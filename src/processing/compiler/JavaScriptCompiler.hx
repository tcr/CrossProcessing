﻿/**
 * ...
 * @author ...
 */

package processing.compiler;

import processing.parser.Syntax;

class JavaScriptCompiler implements ICompiler
{	
	public function new() { }

	public function compile(code:Statement):Dynamic
	{		
		// serialize code to JavaScript
		return serialize(code);
	}
	
//[TODO] scope argument!
	private function serialize(statement:Statement, ?escape:Bool = true, ?inClass:Bool = false, ?inBlock:Bool = false):String
	{
		switch (statement)
		{
		    case SArrayAccess(reference, index):
			return serialize(reference) + '[' + serialize(index) + ']';
			
		    case SArrayInstantiation(type, sizes):
			var source:Array<String> = new Array();
			for (size in sizes)
				source.push(serialize(size));
			return 'new ArrayList(' + source.join(',') + ')';
			
		    case SArrayLiteral(values):
//[TODO]
			return '';

		    case SAssignment(reference, value):
			return serialize(reference) + ' = ' + serialize(value);

		    case SBlock(statements, definitions):
			var source:Array<String> = new Array();
			for (definition in definitions)
				source.push(serializeDefinition(definition, inClass));
			source.push(serializeStatements(statements));
			return source.join(';\n'); // inBlock ? source.join(';\n') : '{\n' + source.join(';\n') + ';\n}\n';
		
		    case SBreak(level):
			return level == null ? 'break' : 'break ' + level;

		    case SCall(method, args):
			var source:Array<String> = new Array();
			for (arg in args)
				source.push(serialize(arg));
			return serialize(method) + '(' + source.join(',') + ')';

		    case SCast(type, expression):
//[TODO] actually cast
			return serialize(expression);
		
		    case SInlineConditional(condition, thenStatement, elseStatement):
//[TODO]
			return '((' + serialize(condition) + ') ? (' + serialize(thenStatement) + ') : (' + serialize(elseStatement) + '))';

		    case SConditional(condition, thenBlock, elseBlock):
			return 'if (' + serialize(condition) + ') \n{\n' + serializeStatements(thenBlock) + '\n} else {\n' + serializeStatements(elseBlock) + '\n}';

		    case SContinue(level):
			return level == null ? 'continue' : 'continue ' + level;
			
		    case SPostfix(reference, postfix):
			return '(function () { var __ret = ' + serialize(reference) + '; ' + serialize(postfix) + '; return __ret; })()';
			
		    case SLiteral(value):
//[TODO] remove "escape" flag necessity
			return escape && Std.is(value, String) ? '"' + value + '"' : value;

		    case SLoop(condition, body):
			return 'while (' + serialize(condition) + ')\n{\n' + serializeStatements(body) + ';\n}';

		    case SObjectInstantiation(method, args):
			var source:Array<String> = new Array();
			if (args != null)
				for (arg in args)
					source.push(serialize(arg));
			return 'new ' + serialize(method) + '(' + source.join(', ') + ')';
			
		    case SOperation(type, leftOperand, rightOperand):
			if (rightOperand != null)
				return '(' + serialize(leftOperand) + serializeOperator(type) + serialize(rightOperand) + ')';
			else
				return '(' + serializeOperator(type) + serialize(leftOperand) + ')';

		    case SReference(identifier, base):
			if (base == null)
				return serialize(identifier, false);
			else
				return serialize(base) + '[' + serialize(identifier) + ']';
				
		    case SReturn(value):
			return 'return ' + (value != null ? serialize(value) : '');
			
		    case SThisReference:
			return 'this';
		}
	}
	
	public function serializeStatements(statements:Array<Statement>):String
	{
		var source:Array<String> = [];
		for (statement in statements)
			source.push(serialize(statement, true, null, true));
		return source.join(';\n');
	}
	
	public function serializeDefinition(definition:Definition, ?inClass:Bool = false):String
	{
		switch (definition)
		{
			case DVariable(identifier, visibility, isStatic, type):
//[TODO] type
				return (inClass ? 'this.' : 'var ') + identifier + ' = 0';
			
			case DFunction(identifier, visibility, isStatic, type, params, body):
				// format params
				var paramKeys:Array<String> = new Array();
				for (param in params)
					paramKeys.push(param.name);
				var func:String = 'function ' + identifier + '(' + paramKeys.join(',') + ') {\n' + serialize(body) + '\n}';
				
				return
//				    inClass != null ?
//				    'addMethod(this, "' + (identifier == inClass ? 'CONSTRUCTORMETHOD' : this.identifier) + '", ' + func + ')' :
//[TODO] functions should just be declared
				    (inClass ? 'this.' : '') + identifier + ' = ' + func;
			    
			case DClass(identifier, visibility, isStatic, body):
				return 'function ' + identifier + '() {\nwith (this) {\n' + serialize(body, true, true) + ';\n}\nthis.' + identifier + '.apply(this, arguments);\n}';
			
			default: return '';
		}
	}
	
	public function serializeOperator(operator:Operator):String {
		return switch (operator)
		{
		    // unary operators
		    case OpNot: '!';
		    case OpBitwiseNot: '~';
		    case OpUnaryPlus: '+';
		    case OpUnaryMinus: '-';
		
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
		    case OpInstanceOf: 'instanceof';
		    case OpLeftShift: '<<';
		    case OpRightShift: '>>';
		    case OpZeroRightShift: '>>>';
		    case OpPlus: '+';
		    case OpMinus: '-';
		    case OpMultiply: '*';
		    case OpDivide: '/';
		    case OpModulus: '%';
		}
	}
}
	
	/*
	
	function ArrayInstantiation(type, size1, size2, size3) {
		this.type = type;
		this.size1 = size1;
		this.size2 = size2;
		this.size3 = size3;
		
		this.serialize = function () {
			return 'new ArrayList(' + this.size1.serialize() +
			    (size2 ? ', ' + this.size2.serialize() + 
			    (size3 ? ', '+ this.size3.serialize() : '')
			    : '') + ')';
		}
	}
	
	function ArrayLiteral(value) {
		this.value = value;
		
		this.serialize = function () {
			for (var source = [], i = 0; i < this.value.length; i++)
				source.push(this.value[i].serialize());
			return '[' + source.join(',') + ']';
		}
	}
	
	function ObjectInstantiation(method, args) {
		this.method = method;
		this.args = args;
		
		this.serialize = function () {
			for (var source = [], i = 0; i < this.args.length; i++)
				source.push(this.args[i].serialize());
			return 'new ' + this.method.serialize() + '(' + source.join(',') + ')';
		}
	}
	
	function Cast(type, expression) {
		this.type = type;
		this.expression = expression;
		
		this.serialize = function () {
			return (this.type.type.value in TokenType.TYPES && !this.type.dimensions) ?
			    this.type.type.value + '(' + expression.serialize() + ')' :
			    expression.serialize();
		}
	}
	
	function ClassDefinition(identifier, constructorBody, publicBody, privateBody) {
		this.identifier = identifier;
		this.constructorBody = constructorBody;
		this.publicBody = publicBody;
		this.privateBody = privateBody;
		
		this.serialize = function () {
			// format functions
			var classSource = 'Processing.' + this.identifier + ' = function () {\nwith (this) {';
	
			var source = [];
			for (var i = 0; i < this.constructorBody.length; i++)
				source.push(this.constructorBody[i].serialize(this.identifier));
			for (var i = 0; i < this.publicBody.length; i++)
				source.push(this.publicBody[i].serialize(this.identifier));		
			for (var i = 0; i < this.privateBody.length; i++)
				source.push(this.privateBody[i].serialize(this.identifier));
			classSource += source.join(';\n');
			
			classSource += ';\nif (CONSTRUCTORMETHOD) CONSTRUCTORMETHOD.apply(this, arguments);\n}\n}\n';
			
			return classSource;
		}
	}
	
	function FunctionDefinition(identifier, type, params, body) {
		this.identifier = identifier;
		this.type = type;
		this.params = params;
		this.body = body;
		
		this.serialize = function (inClass) {
			// format params
			for (var params = [], i = 0; i < this.params.length; i++)
				params.push(this.params[i][0]);
			var func = 'function ' + this.identifier + ' (' + params.join(',') + ') {\n' + body.serialize() + '\n}';
			
			return inClass ? 'addMethod(this, "' + (this.identifier == inClass ? 'CONSTRUCTORMETHOD' : this.identifier) + '", ' + func + ')' :
			    'Processing.' + this.identifier + ' = ' + func;
		}
	}
*/
