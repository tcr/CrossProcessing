/**
 * ...
 * @author ...
 */

package processing.interpreter;

import processing.parser.Statement;

class Interpreter 
{

	public function new() 
	{
		
	}

	public function interpret(statement:Statement, context:Scope, ?parent:Statement):Dynamic
	{
		switch (statement)
		{
		case ArrayInstantiation(type, size1, size2, size3):
			// return new ArrayList object
			return new ArrayList(size1.execute(context), size2 ? size2.execute(context) : 0, size3 ? size3.execute(context) : 0, type);

		case ArrayLiteral(values):
			// parse array
			var array:Array<Dynamic> = new Array();
			for (i in 0...values.length)
				array[i] = interpret(values[i], context);
			return array;
			
		case Assignment(reference, value):
			// get simplified reference
			var ref:ReferenceProperty = interpret(reference, context, statement);
			// increment and return
			return Reflect.setField(ref.base, ref.identifier, interpret(value, context));
			
		case Block(statements):
			// iterate block
			var retValue:Dynamic;
			for (i in statements)
				retValue = interpret(i, context);
			return retValue;
		
		case Break(level):
//[TODO] BreakException
			throw this;
			
		case Call(method, args):
			// iterate args statements
			var parsedArgs:Array<Dynamic> = new Array();
			for (arg in args)
				parsedArgs.push(interpret(arg, context));
			// apply function			
			return Reflect.callMethod(context.scope, interpret(method, context), parsedArgs);
			
		case Cast(type, expression):
			// parse value
			var value:Dynamic = interpret(expression, context);
			
			// cast non-arrays
			if (!type.dimensions)
			{
				switch (type.type) {
				    case TokenType.VOID:	return void(value);
				    case TokenType.INT:	return int(value);
				    case TokenType.FLOAT:	return Number(value);
				    case TokenType.BOOLEAN:	return Boolean(value);
				    case TokenType.CHAR:	return Std.is(value, String) ? value.charCodeAt(0) : value;
//[TODO] cast objects?
				}
			}
			
			// could not cast
//[TODO] throw error
			return value;
			
		case ClassDefinition(identifier, constructorBody, publicBody, privateBody):
			// create class constructor
			Reflect.setField(context.scope, identifier, Reflect.makeVarArgs(function (args)
			{
				// check that this be called as a constructor
//[TODO] that
			
				// create new evaluator contexts
//[TODO] really this should modify .prototype...
				var objContext:ExecutionContext = new ExecutionContext(this, context, this);
				var classContext:ExecutionContext = new ExecutionContext({}, objContext);
				
				// define variables
				publicBody.execute(objContext);
				privateBody.execute(classContext);

				// call constructor
				if (constructorBody) {
//[TODO] look into alternate means of defining constructor?
					constructorBody.execute(classContext);
					classContext.scope[identifier].apply(classContext.scope, args);
				}
			}));
			
		case Conditional(condition, thenBlock, elseBlock):
			if (condition.execute(context))
				return thenBlock.execute(context);
			else if (elseBlock)
				return elseBlock.execute(context);
				
		case Continue(level):
//[TODO] ContinueException
			// throw exception
			throw statement;
		
		case Decrement(reference):
			// get simplified reference
			var ref:ReferenceProperty = interpret(reference, context, statement);
			// increment and return
			return Reflect.setField(ref.base, ref.identifier, Reflect.getField(ref.base, ref.identifier) - 1);
			
		case FunctionDefinition(identifier, type, params, body):
			// check that a variable is not already defined
//[TODO] this shouldn't have " || !context.scope[identifier]"; must remove predefined .setup from Processing API context!
			if (!context.scope.hasOwnProperty(identifier) || !context.scope[identifier])
			{
				// define wrapper function
				context.scope[identifier] = Reflect.makeVarArgs(function (arguments)
				{
					// check that an overloader be available
					if (!context.scope[identifier].overloads.hasOwnProperty(arguments.length))
						throw new Error('Function called without proper argument number.');

					// convert arguments object to array
					var args:Array = [];
					for (i in 0...arguments.length)
						args.push(arguments[i]);
					// call overload
					return context.scope[identifier].overloads[args.length].apply(null, args);
				});

				// create overloads array
				context.scope[identifier].overloads = [];
			}
			else if (context.scope[identifier] && !context.scope[identifier].hasOwnProperty('overloads'))
			{
				// cannot define function with name of declared variable
				throw new Error('Cannot declare function "' + identifier + '" as it is already defined.');
			}

			// add overload
//[TODO] overloads based on param type
			context.scope[identifier].overloads[params.length] = Reflect.makeVarArgs(function (args)
			{
				// check that this be called as a function
//[TODO] that
				// create new evaluator context
				var funcContext:ExecutionContext = new ExecutionContext({}, context);

				// parse args
				for (i in args)
				{
//[TODO] what happens when args/params differ?
//[TODO] maybe shortcut something here?
					(new VariableDefinition(params[i][0], params[i][1])).execute(funcContext);
					(new Assignment(new Reference(new Literal(params[i][0])), new Literal(args[i]))).execute(funcContext);
				}
				
				try
				{
					// evaluate body
					body.execute(funcContext);
				}
				catch (ret:Return)
				{
					// handle returns
//[TODO] do something with type
					return ret.value.execute(funcContext);
				}
			});
		
		case Increment(reference):
			// get simplified reference
			var ref:ReferenceProperty = interpret(reference, context, statement);
			// increment and return
			return Reflect.setField(ref.base, ref.identifier, Reflect.getField(ref.base, ref.identifier) + 1);
			
		case Literal(value):
			// return literal
			return value;
			
		case Loop(condition, body):
			// loop condition
			while (condition.execute(context)) {
				try {
					// execute body
					body.execute(context);
				} catch (b:Break) {
					// decrease level and rethrow if necessary
					if (--b.level)
						throw b;
					// else break loop
					break;
				} catch (c:Continue) {
					// decrease level and rethrow if necessary
					if (--c.level)
						throw c;
					// else continue loop
					continue;
				}
			}
		
		case ObjectInstantiation(method, args):
			// parse class
			var objClass:Class = method.execute(context);
			// iterate args statements
			var parsedArgs:Array = [];
			for (arg in args)
				parsedArgs.push(interpret(arg, context));
			return Type.createInstance(objClass, parsedArgs);
			
		case Operation(type, leftOperand, rightOperand):
			// evaluate operands
			var a:Dynamic = interpret(leftOperand, context), b:Dynamic;
			if (rightOperand)
				b = interpret(rightOperand, context);

			// evaluate operation
			switch (type) {
			    // unary operators
			    case TokenType.NOT:		return !a;
			    case TokenType.BITWISE_NOT:	return ~a;
			    case TokenType.UNARY_PLUS:	return a;
			    case TokenType.UNARY_MINUS:	return -a;

			    // binary operators
			    case TokenType.OR:		return a || b;
			    case TokenType.AND:		return a && b;
			    case TokenType.BITWISE_OR:	return a | b;
			    case TokenType.BITWISE_XOR:	return a ^ b;
			    case TokenType.BITWISE_AND:	return a & b;
			    case TokenType.EQ:		return a == b;
			    case TokenType.NE:		return a != b;
//[TODO] strict eq!
//			    case TokenType.STRICT_EQ:	return a === b;
//			    case TokenType.STRICT_NE:	return a !== b;
			    case TokenType.LT:		return a < b;
			    case TokenType.LE:		return a <= b;
			    case TokenType.GT:		return a > b;
			    case TokenType.GE:		return a >= b;
			    case TokenType.IN:		return Reflect.hasField(b, a);
			    case TokenType.INSTANCEOF:	return Std.is(a, b);
			    case TokenType.LSH:		return a << b;
			    case TokenType.RSH:		return a >> b;
			    case TokenType.URSH:	return a >>> b;
			    case TokenType.PLUS:	return a + b;
			    case TokenType.MINUS:	return a - b;
			    case TokenType.MUL:		return a * b;
			    case TokenType.DIV:		return a / b;
			    case TokenType.MOD:		return a % b;
			    case TokenType.DOT:		return a[b];
			    default: throw new Error('Unrecognized expression operator.');
			}
			
		case Reference(identifier, base):
			// get simplified reference
//[TODO] i'm not sure i like this...
			var ref:ReferenceProperty = reduceReference(context);
			// switch based on parent type
			switch (parent)
			{
				case Increment, Decrement, Assignment: return ref;
				default: return ref != null ? Reflect.getField(ref.base, ref.identifier) : null;
			}
		
		case Return(value):
//[TODO] ReturnException
			// throw this return
			throw statement;
			
		case ThisReference:
			// climb context inheritance to find defined thisObject
			var c:Scope = context;
			while (c != null && c.thisObject == null)
			    c = c.parent;
			return c == null ? c.thisObject : null;
			
		case VariableDefinition(identifier, type):
//[TODO] do something with type
			// define variable (by default, 0)
			context.scope[identifier] = 0;
		}
	}
	
	// reduce to [identifier, base] array pair for assignments
	private function reduceReference(context:Scope, sIdentifier:Statement, ?sBase:Statement):ReferenceProperty {
		// evaluate identifier
		var identifier:String = interpret(sIdentifier, context), base:Dynamic;
		// evaluate base reference in current context
		if (sBase != null)
		{
			// base object exists
			base = interpret(sBase, context);
		}
		else
		{
			// climb context inheritance to find declared identifier
			var c:Scope = context;
			while (c != null && !c.scope.hasOwnProperty(identifier))
			    c = c.parent;
			if (c == null)
				return null;
			base = c.scope;
		}

		// return reduced reference
		return {identifier: identifier, base: base};
	}
}

//[TODO] rename Reference, rename statement SReference
typedef ReferenceProperty = {
	identifier:String,
	base:Dynamic
}