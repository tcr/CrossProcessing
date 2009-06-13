/**
 * ...
 * @author ...
 */

package processing.interpreter;

import processing.parser.Syntax;

//[TODO] rewrite all to use Scope methods

class Interpreter 
{
	public function new() 
	{
		
	}

//[TODO] we can use Type class to get rid of byValue necessity
	public function interpretStatement(statement:Statement, context:Scope, ?byValue = true):Dynamic
	{
		switch (statement)
		{
		    case SBlock(statements):
			// iterate block
			var retValue:Dynamic = null;
			for (i in statements)
				retValue = interpret(i, context);
			return retValue;
		
		    case SBreak(level):
			throw new Break(level);

		    case SConditional(condition, thenBlock, elseBlock):
			if (interpret(condition, context))
				return interpret(thenBlock, context);
			else if (elseBlock != null)
				return interpret(elseBlock, context);
			return;
				
		    case SContinue(level):
			throw new Continue(level);

		    case SLoop(condition, body):
			// loop condition
			while (interpret(condition, context)) {
				try {
					// execute body
					interpret(body, context);
				} catch (b:Break) {
					// decrease level and rethrow if necessary
					if (--b.level <= 0)
						throw b;
					// else break loop
					break;
				} catch (c:Continue) {
					// decrease level and rethrow if necessary
					if (--c.level <= 0)
						throw c;
					// else continue loop
					continue;
				}
			}
			return;

		    case SReturn(value):
			throw new Return(interpret(value, context));
		}
	}
	
	public function interpretExpression(expression:Expression, context:Scope, ?byValue = true):Dynamic
	{
		switch (expression)
		{
		    case EArrayInstantiation(type, sizes):
			// return new (multi-)dimensional array
			var array:Array<Dynamic> = [], current:Dynamic = 0;
			sizes.reverse();
			for (size in sizes)
			{
				for (i in 0...interpret(size, context))
					array.push(Std.is(current, array) ? current.copy() : current);
				current = array;
				array = [];
			}
			return current;

		    case EArrayLiteral(values):
			// parse array
			var array:Array<Dynamic> = new Array();
			for (value in values)
				array.push(interpret(value, context));
			return array;
		
		    case EAssignment(reference, value):
			// evaluate operands
			var a:Reference = interpret(reference, context, false);
			var b:Dynamic = interpret(value, context);
			a.setValue(b);
			
		    case ECall(method, args):
			// iterate args statements
			var parsedArgs:Array<Dynamic> = [];
			for (arg in args)
				parsedArgs.push(interpret(arg, context));
			// apply function
			return Reflect.callMethod(context.scope, interpret(method, context), parsedArgs);
			
		    case ECast(type, expression):
			// parse value
			var value:Dynamic = interpret(expression, context);
			
			// cast non-arrays
			if (type.dimensions == 0)
			{
				switch (type.type) {
//[TODO] this right? cast isn't really casting in haXe...
				    case TokenType.VOID:	return cast(value, Void);
				    case TokenType.INT:		return cast(value, Int);
				    case TokenType.FLOAT:	return cast(value, Float);
				    case TokenType.BOOLEAN:	return cast(value, Bool);
				    case TokenType.CHAR:	return Std.is(value, String) ? value.charCodeAt(0) : value;
//[TODO] cast objects?
				}
			}
			
			// could not cast
//[TODO] throw error
			return value;

		    case EConditional(condition, thenExpression, elseExpression):
			if (interpret(condition, context))
				return interpret(thenBlock, context);
			else if (elseBlock != null)
				return interpret(elseBlock, context);
			return;
			
		    case ELiteral(value):
			// return literal
			return value;

		    case EObjectInstantiation(method, args):
			// parse class
			var objClass:Class<Dynamic> = interpret(method, context);
			// iterate args statements
			var parsedArgs:Array<Dynamic> = [];
			for (arg in args)
				parsedArgs.push(interpret(arg, context));
			return Type.createInstance(objClass, parsedArgs);
			
		    case EOperation(type, leftOperand, rightOperand):
			// evaluate operands
			var a:Dynamic = interpret(leftOperand, context), b:Dynamic = null;
			if (rightOperand != null)
				b = interpret(rightOperand, context);

			// evaluate operation
			switch (type) {
			    // unary operators
			    case OpNot:			return !a;
			    case OpBitwiseNot:		return ~a;
			    case OpUnaryPlus:		return a;
			    case OpUnaryMinus:		return -a;

			    // binary operators
			    case OpOr:			return a || b;
			    case OpAnd:			return a && b;
			    case OpBitwiseOr:		return a | b;
			    case OpBitwiseXor:		return a ^ b;
			    case OpBitwiseAnd:		return a & b;
//[TODO] java has .equals(); figure out relation between == and .equals
			    case OpEqual:		return a == b;
			    case OpUnequal:		return a != b;
			    case OpLessThan:		return a < b;
			    case OpLessThanOrEqual:	return a <= b;
			    case OpGreaterThan:		return a > b;
			    case OpGreaterThanOrEqual:	return a >= b;
			    case OpInstanceOf:		return Std.is(a, b);
			    case OpLeftShift:		return a << b;
			    case OpRightShift:		return a >> b;
			    case OpZeroRightShift:	return a >>> b;
			    case OpPlus:		return a + b;
			    case OpMinus:		return a - b;
			    case OpMultiply:		return a * b;
			    case OpDivide:		return a / b;
			    case OpModulus:		return a % b;
			}
		
		    case EReference(sIdentifier, sBase):
			// evaluate identifier
			var identifier:String = interpret(sIdentifier, context), ref:Reference;
			// evaluate base in current context
			if (sBase != null)
			{
				// if a base is supplied, return it
				ref = new Reference(identifier, interpret(sBase, context));
			}
			else
			{
				// find definition of this identifier
				var definition:Scope = context.findDefinition(identifier);
				if (definition == null)
					return null;
				ref = new Reference(identifier, definition.scope);
			}
			return byValue ? ref.getValue() : ref;

		    case EThisReference:
			// climb context inheritance to find defined thisObject
			var c:Scope = context;
			while (c != null && c.thisObject == null)
			    c = c.parent;
			return c == null ? c.thisObject : null;
		}
	}
	
	public function interpretDefinition(definition:Definition, context:Scope, ?byValue = true):Dynamic
	{
		switch (definition)
		{
		    case DClass(identifier, constructorBody, publicBody, privateBody):
//[TODO] figure out how to do this in haXe
/*
			// create class constructor
			Reflect.setField(context.scope, identifier, Reflect.makeVarArgs(function (args)
			{
				// check that this be called as a constructor
//[TODO] that
			
				// create new evaluator contexts
//[TODO] really this should modify .prototype...
				var objContext:Scope = new Scope(this, context, this);
				var classContext:Scope = new Scope({}, objContext);
				
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
*/
			return;

		    case DFunction(identifier, type, params, body):
			// make a new definition
//[TODO] an OverloadedFunction class would be cool beans
//[TODO] should this be deep?
			if (!context.hasField(identifier) || !context.hasField('__' + identifier))
			{
				// define wrapper function
				context.setField(identifier, Reflect.makeVarArgs(function (arguments) {
					// find a matching overload
					for (overload in cast(context.getField('__' + identifier), Array<Dynamic>))
					{						
						// check if arguments match
						if (overload.params.length != arguments.length)
							continue;
//[TODO]					// iterate types
//						try {
//							for (i in 0...overload.params.length)
//								if (!Std.is(arguments[i], overload.params[i].type))
//									throw false;
//						} catch (e:Dynamic) { continue; }
						
						// call function
						return Reflect.callMethod(context.thisObject, overload.method, arguments);
					}
					
					throw 'Function called without matching overload.';
				}));
				
				// define overloads
				context.setField('__' + identifier, []);
			}
			
			// add new overload
			context.getField('__' + identifier).push( {
				params: params,
				type: type,
				method: Reflect.makeVarArgs(function (arguments) {
					// create new evaluator context
					var funcContext:Scope = new Scope({}, context);

					// define arguments
					for (i in 0...params.length)
						funcContext.setField(params[i].name, arguments[i]);
					
					// evaluate body
					var interpreter:Interpreter = new Interpreter();
					try
					{
						interpreter.interpret(body, funcContext);
						return;
					}
					catch (ret:Return)
					{
//[TODO] do something with type
						return interpreter.interpret(ret.value, funcContext);
					}
				})
			});
			return;

		    case DVariable(identifier, type):
//[TODO] do something with type
			// define variable (by default, 0)
			Reflect.setField(context.scope, identifier, 0);
			return;
		}
	}
}

class Reference {
	public var identifier:String;
	public var base:Dynamic;
	
	public function new(identifier:String, base:Dynamic) {
		this.identifier = identifier;
		this.base = base;
	}
	
	public function getValue():Dynamic {
		return Reflect.field(base, identifier);
	}
	
	public function setValue(value:Dynamic):Dynamic {
		return Reflect.setField(base, identifier, value);
	}
}

class Break {
	public var level:Int;
	public function new(level:Int) { this.level = level; }
}

class Continue {
	public var level:Int;
	public function new(level:Int) { this.level = level; }
}

class Return {
	public var value:Dynamic;
	public function new(value:Dynamic) { this.value = value; }
}