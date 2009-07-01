/**
 * ...
 * @author 
 */

package xpde.compiler;

import xpde.parser.AST;

class JSCompiler implements ICompiler
{
	var output:StringBuf;
	var packageIdent:Array<String>;
	var packageIdentString:String;
	var classDef:String;

	public function new() 
	{
		
	}
	
	public function compile(unit:CompilationUnit):String
	{
		// start output
		output = new StringBuf();
		
		// package
		packageIdent = ["window"].concat(unit.packageIdent);
		packageIdentString = packageIdent.join('.') + '.';
//		if (unit.packageIdent.length > 0)
//			packageIdentString = unit.packageIdent.join('.') + '.';
		
		// closure
		output.add('(function () {\n');
		
		// imports
//		for (imp in unit.importIdents)
//			output.add('import ' + imp.join('.') + ';\n');
//		output.add('\n');
		output.add('var PApplet = xpde.core.PApplet;\n\n');

		// definitions
		for (definition in unit.definitions) {
			compileDefinition(definition);
			output.add('\n');
		}
		
		// closure
		output.add('})()');
		
		// return output
		return output.toString();
	}
	
	function compileDefinition(definition:Definition)
	{
		switch (definition)
		{
		    case DMethod(identifier, type, modifiers, params, body):
			if (classDef != null)
				output.add(classDef + identifier + ' = ');
			output.add('function');
			output.add(' ' + identifier + '(');
			for (i in 0...params.length) {
				compileFormalParameter(params[i]);
				if (i < params.length - 1)
					output.add(', ');
			}
			output.add(') {with(this){');
			var tmp:String = classDef;
			classDef = null;
			compileStatement(body);
			classDef = tmp;
			output.add('}};\n');

		    case DField(identifier, type, modifiers):
			if (classDef != null)
				output.add(classDef + identifier + ' = ');
			else
				output.add('var');
			output.add(' ' + identifier + ';\n');
		    
		    case DClass(identifier, modifiers, definitions, extend, implement, clinit, init):
			output.add(packageIdentString + identifier + ' = function () {\n');
			if (extend != null) {
				compileType(extend);
				output.add('.apply(this, arguments);\n');
			}
			output.add('with(this){\n');
			if (init != null) {
				compileStatement(init);
			}
			output.add('}};\n');
			output.add(packageIdentString + identifier + '.__name__ = ["'
			    + packageIdent.concat([identifier]).join('","') + '"];\n');
			output.add(packageIdentString + identifier + '.prototype.__class__ = ' + packageIdentString + identifier + ';\n');
			var tmp:String = classDef;
			classDef = packageIdentString + identifier + '.prototype.';
			for (definition in definitions) {
				compileDefinition(definition);
			}
			classDef = tmp;
/*			if (clinit != null) {
				output.add('static ');
				compileStatement(clinit);
			}*/
		}
	}
	
	function compileType(type:DataType)
	{
		if (type == null) {
			output.add('void');
			return;
		}
		
		switch (type)
		{
		    case DTPrimitive(type):
			switch (type)
			{
			    case PTByte: output.add('byte');
			    case PTShort: output.add('short');
			    case PTInt: output.add('int');
			    case PTLong: output.add('long');
			    case PTFloat: output.add('float');
			    case PTDouble: output.add('double');
			    case PTChar: output.add('char');
			    case PTBoolean: output.add('boolean');
			}
		    case DTReference(qualident):
			output.add(qualident.join('.'));
		    case DTArray(type, dimensions):
			compileType(type);
			for (i in 0...dimensions)
				output.add('[]');
		}
	}
	
	function compileModifiers(modifiers:EnumSet<Modifier>)
	{
		for (modifier in modifiers)
			switch (modifier)
			{
			    case MPublic: output.add('public ');
			    case MPrivate: output.add('private ');
			    case MProtected: output.add('protected ');
			    case MStatic: output.add('static ');
			    case MFinal: output.add('final ');
			    case MSynchronized: output.add('synchronized ');
			    case MVolatile: output.add('volatile ');
			    case MTransient: output.add('transient ');
			    case MNative: output.add('native ');
			    case MAbstract: output.add('abstract ');
			    case MStrictfp: output.add('strictfp ');
			}
	}
	
	function compileStatement(statement:Statement)
	{
//if (statement == null)
//return;

		switch (statement)
		{
		    case SBlock(definitions, statements):
			output.add('{\n');
			for (definition in definitions)
				compileDefinition(definition);
			for (statement in statements)
				compileStatement(statement);
			output.add('}\n');
		    
		    case SBreak(label):
			output.add('break');
			if (label != null)
				output.add(' ' + label);
			output.add(';\n');
			
		    case SConditional(condition, thenBlock, elseBlock):
			output.add('if (');
			compileExpression(condition);
			output.add(') ');
			compileStatement(thenBlock);
			if (elseBlock != null) {
				output.add('else ');
				compileStatement(elseBlock);
			}
		    
		    case SContinue(label):
			output.add('continue');
			if (label != null)
				output.add(' ' + label);
			output.add(';\n');
			
		    case SExpression(expression):
			compileExpression(expression);
			output.add(';\n');
			
		    case SLabel(label, body):
			output.add(label + ': ');
			compileStatement(body);
		    
		    case SLoop(condition, body, doLoop):
			if (doLoop)
			{
				output.add('do ');
				compileStatement(body);
				output.add('while (');
				compileExpression(condition);
				output.add(');\n');
			}
			else
			{
				output.add('while (');
				compileExpression(condition);
				output.add(') ');
				compileStatement(body);
			}
			
		    case SReturn(value):
			output.add('return');
			if (value != null) {
				output.add(' ');
				compileExpression(value);
			}
			output.add(';\n');

//		    case SSwitch():

		    case SThrow(expression):
			output.add('throw');
			compileExpression(expression);
			output.add(';\n');
			
		    case STry(body, catches, finallyBody):
			output.add('try ');
			compileStatement(body);
			if (catches != null) {
				for (katch in catches) {
					output.add('catch (');
					compileFormalParameter(katch.parameter);
					output.add(')');
					compileStatement(katch.body);
				}
			}
			if (finallyBody != null) {
				output.add('finally\n');
				compileStatement(finallyBody);
			}
		    
		    default:
		}
	}
	
	function compileExpression(expression:Expression)
	{
//if (expression == null)
//return;

		switch (expression)
		{
		    // expressions
		    case EArrayAccess(index, base):
			compileExpression(base);
			output.add('[');
			compileExpression(index);
			output.add(']');
		    
/*		    case EArrayInstantiation(type:DataType, sizes:Array<Expression>):*/

		    case EArrayAssignment(index, base, value):
			compileExpression(base);
			output.add('[');
			compileExpression(index);
			output.add(']');
			output.add(' = ');
			compileExpression(value);

		    case EAssignment(identifier, base, value):
			if (base != null) {
				compileExpression(base);
				output.add('.');
			}
			output.add(identifier);
			output.add(' = ');
			compileExpression(value);
		    
		    case ECall(method, args):
			output.add('(');
			compileExpression(method);
			output.add(')(');
			for (i in 0...args.length)
			{
				compileExpression(args[i]);
				if (i < args.length - 1)
					output.add(', ');
			}
			output.add(')');
			
		    case ECallMethod(identifier, base, args):
			compileExpression(base);
			output.add('.' + identifier);
			output.add('(');
			for (i in 0...args.length)
			{
				compileExpression(args[i]);
				if (i < args.length - 1)
					output.add(', ');
			}
			output.add(')');
			
		    case ECast(type, expression):
			output.add('(');
			compileType(type);
			output.add(') (');
			compileExpression(expression);
			output.add(')');

		    case EConditional(condition, thenExpression, elseExpression):
			output.add('(');
			compileExpression(condition);
			output.add(' ? ');
			compileExpression(thenExpression);
			output.add(' : ');
			compileExpression(elseExpression);
			output.add(')');
		    
		    case EInstanceOf(expression, type):
			compileExpression(expression);
			output.add(' instanceof ');
			compileType(type);

		    case EObjectInstantiation(qualifier, args):
			output.add('new ' + qualifier.join('.') + '(');
			for (i in 0...args.length)
			{
				compileExpression(args[i]);
				if (i < args.length - 1)
					output.add(', ');
			}
			output.add(')');
		    
		    case EPrefix(type, reference):
			compileIncrementType(type);
			output.add('(');
			compileExpression(reference);
			output.add(')');
			
		    case EPostfix(type, reference):
			output.add('(');
			compileExpression(reference);
			output.add(')');
			compileIncrementType(type);
		    
		    case EReference(identifier, base):
			if (base != null) {
				compileExpression(base);
				output.add('.');
			}
			output.add(identifier);
		    
		    case ESuperReference:
			output.add('super');
			
		    case EThisReference:
			output.add('this');
		
		    // operations
		    case EInfixOperation(operator, leftOperand, rightOperand):
			output.add('(');
			compileExpression(leftOperand);
			compileInfixOperator(operator);
			compileExpression(rightOperand);
			output.add(')');

		    case EPrefixOperation(operator, operand):
			compilePrefixOperator(operator);
			output.add('(');
			compileExpression(operand);
			output.add(')');
		
		    // literals
		    case EArrayLiteral(values):
			output.add('{');
			for (i in 0...values.length)
			{
				compileExpression(values[i]);
				if (i < values.length - 1)
					output.add(', ');
			}
			output.add('}');
		    
		    case EStringLiteral(value):
			output.add('"' + StringTools.replace(value, '"', '\\"') + '"');
		    
		    case EIntegerLiteral(value):
			output.add(Std.string(value));
		    
		    case EFloatLiteral(value):
			output.add(Std.string(value));
		   
		    case ECharLiteral(value):
			output.add("'" + String.fromCharCode(value) + "'");
		    
		    case EBooleanLiteral(value):
			output.add(value ? 'true' : 'false');
		    
		    case ENull:
			output.add('null');
			
		    default:
		}
	}
	
	function compilePrefixOperator(operator:PrefixOperator)
	{
		output.add(switch (operator)
		{
		    // unary operators
		    case OpNot: '!';
		    case OpBitwiseNot: '~';
		    case OpUnaryPlus: '+';
		    case OpUnaryMinus: '-';
		});
	}

	function compileInfixOperator(operator:InfixOperator)
	{
		output.add(switch (operator)
		{
		    // binary operators
		    case OpOr: '||';
		    case OpAnd: '&&';
		    case OpBitwiseOr: '|';
		    case OpBitwiseXor: '^';
		    case OpBitwiseAnd: '&';
		    case OpEqual: '==';
		    case OpUnequal: '!=';
		    case OpLessThan: '<';
		    case OpLessThanOrEqual: '<=';
		    case OpGreaterThan: '>';
		    case OpGreaterThanOrEqual: '>=';
		    case OpLeftShift: '<<';
		    case OpRightShift: '>>';
		    case OpZeroRightShift: '>>>';
		    case OpAdd: '+';
		    case OpSubtract: '-';
		    case OpMultiply: '*';
		    case OpDivide: '/';
		    case OpModulus: '%';
		});
	}
	
	function compileIncrementType(type:IncrementType)
	{
		output.add(switch (type) {
		    case IIncrement: '++';
		    case IDecrement: '--';
		});
	}
	
	function compileFormalParameter(parameter:FormalParameter) {
		output.add(parameter.identifier);
	}
}
