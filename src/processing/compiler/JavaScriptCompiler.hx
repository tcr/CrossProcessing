/**
 * ...
 * @author ...
 */

package processing.compiler;

import processing.parser.Statement;

class JavaScriptCompiler implements ICompiler
{	
	public function new() { }

	public function compile(code:Statement):Dynamic
	{		
		// serialize code to JavaScript
		return serialize(code);
	}
	
	private function serialize(statement:Statement, ?escape:Bool = true, ?inClass:String, ?inBlock:Bool):String
	{
		switch (statement)
		{
//		case ArrayInstantiation(type, size1, size2, size3):
//		case ArrayLiteral(values):

		case SAssignment(reference, value):
			return serialize(reference) + ' = ' + serialize(value);

		case SBlock(statements):
			var source:Array<String> = new Array();
			for (statement in statements)
				source.push(serialize(statement, true, null, true));
			return inBlock ? source.join(';\n') : '{\n' + source.join(';\n') + ';\n}\n';
		
		case SBreak(level):
			return 'break ' + level;

		case SCall(method, args):
			var source:Array<String> = new Array();
			for (arg in args)
				source.push(serialize(arg));
			return serialize(method) + '(' + source.join(',') + ')';

//		case SCast(type, expression):
//		case SClassDefinition(identifier, constructorBody, publicBody, privateBody):

		case SConditional(condition, thenBlock, elseBlock):
			return '(' + serialize(condition) + ' ? ' + serialize(thenBlock) + ' : ' + serialize(elseBlock) + ')';
//			if (this.inline)
//				return '(' + this.condition.serialize() + ' ? ' + this.thenBlock.serialize() + ' : ' + this.elseBlock.serialize() + ')';
//			else
//				return 'if (' + this.condition.serialize() + ') \n' + this.thenBlock.serialize() + (this.elseBlock ? ' else ' + this.elseBlock.serialize() : '');

		case SContinue(level):
			return 'continue ' + level;
			
		case SDecrement(reference):
			return serialize(reference) + '--';
			
		case SFunctionDefinition(identifier, type, params, body):
			// format params
			var paramKeys:Array<String> = new Array();
			for (param in params)
				paramKeys.push(paramKeys[0]);
			var func:String = 'function ' + identifier + ' (' + paramKeys.join(',') + ') {\n' + serialize(body) + '\n}';
			
			return
//			    inClass != null ?
//			    'addMethod(this, "' + (identifier == inClass ? 'CONSTRUCTORMETHOD' : this.identifier) + '", ' + func + ')' :
//[TODO] functions should just be declared
			    'Processing.' + identifier + ' = ' + func;

		case SIncrement(reference):
			return serialize(reference) + '++';
			
		case SLiteral(value):
//[TODO] remove "escape" flag necessity
			return escape && Std.is(value, String) ? '"' + value + '"' : value;

		case SLoop(condition, body):
			return 'while (' + serialize(condition) + ')\n' + serialize(body) + '';

//		case SObjectInstantiation(method, ?args):
		case SOperation(type, leftOperand, rightOperand):
			if (rightOperand != null)
				return '(' + serialize(leftOperand) + type.value + serialize(rightOperand) + ')';
			else
				return '(' + type.value + serialize(leftOperand) + ')';

		case SReference(identifier, base):
			if (base == null)
				return serialize(identifier, false);
			else
				return serialize(base) + '[' + serialize(identifier) + ']';
				
		case SReturn(value):
			return 'return ' + (value != null ? serialize(value) : '');
			
		case SThisReference:
			return 'this';

		case SVariableDefinition(identifier, type):
//[TODO] type
			return (inClass != null ? 'this.' : 'var ') + identifier + ' = 0';
		
		case SValue(value):
			return '(' + serialize(value) + ')';

		default:
			return 'hihihi';
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
