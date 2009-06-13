/**
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
		return serializeStatement(code);
	}
	
	private function serializeStatement(statement:Statement, ?scope:CompilerScope):String
	{
		switch (statement)
		{
		    case SBlock(statements, definitions):
			var source:Array<String> = new Array();
			source.push('// definitions');
			for (definition in definitions)
				source.push(serializeDefinition(definition, scope));
			source.push('// statements');
			for (statement in statements)
				source.push(serializeStatement(statement));
			return source.join('\n');
		
		    case SBreak(label):
			return 'break' + (label == null ? '' : ' ' + label) + ';';

		    case SConditional(condition, thenBlock, elseBlock):
			var source:Array<String> = new Array();
			source.push('if (' + serializeExpression(condition) + ') {');
			for (statement in thenBlock)
				source.push(serializeStatement(statement));
			source.push('} else {');
			for (statement in elseBlock)
				source.push(serializeStatement(statement));
			source.push('}');
			return source.join('\n');

		    case SContinue(label):
			return 'continue' + (label == null ? '' : ' ' + label) + ';';
			
		    case SExpression(expression):
			return serializeExpression(expression) + ';';

		    case SLoop(condition, body):
			var source:Array<String> = new Array();
			source.push('while (' + serializeExpression(condition) + ') {');
			for (statement in body)
				source.push(serializeStatement(statement));
			source.push('}');
			return source.join('\n');
				
		    case SReturn(value):
//[TODO] variable type binding here?
			return 'return' + (value == null ? '' : ' ' + serializeExpression(value)) + ';';
		}
	}
	
	private function serializeExpression(expression:Expression):String
	{
		switch (expression)
		{
		    case EArrayAccess(reference, index):
			return serializeExpression(reference) + '[' + serializeExpression(index) + ']';
			
		    case EArrayInstantiation(type, sizes):
			var source:Array<String> = new Array();
			for (size in sizes)
				source.push(serializeExpression(size));
			return 'new ArrayList(' + source.join(', ') + ')';
			
		    case EArrayLiteral(values):
			var source:Array<String> = new Array();
			for (value in values)
				source.push(serializeExpression(value));
			return '[' + source.join(', ') + ']';

//[TODO] variable type binding here?
		    case EAssignment(reference, value):
			return serializeExpression(reference) + ' = ' + serializeExpression(value);

		    case ECall(method, args):
			var source:Array<String> = new Array();
			for (arg in args)
				source.push(serializeExpression(arg));
			return serializeExpression(method) + '(' + source.join(', ') + ')';

		    case ECast(type, expression):
//[TODO] actually cast
			if (~/^(boolean|char|void|float|int)$/.match(type.type) && (type.dimensions == 0))
				return type.type + '(' + serializeExpression(expression) + ')';
			return serializeExpression(expression);
		
		    case EConditional(condition, thenStatement, elseStatement):
			return '((' + serializeExpression(condition) + ') ? (' + serializeExpression(thenStatement) + ') : (' + serializeExpression(elseStatement) + '))';
			
		    case EPrefix(reference, type):
			return switch (type) {
			    case IIncrement: '(++' + serializeExpression(reference) + ')';
			    case IDecrement: '(--' + serializeExpression(reference) + ')';
			}

		    case EPostfix(reference, type):
			return switch (type) {
			    case IIncrement: '(' + serializeExpression(reference) + '++)';
			    case IDecrement: '(' + serializeExpression(reference) + '--)';
			}
			
		    case ELiteral(value):
			return Std.is(value, String) ? '"' + value + '"' : value;

		    case EObjectInstantiation(method, args):
			var source:Array<String> = new Array();
			if (args != null)
				for (arg in args)
					source.push(serializeExpression(arg));
			return 'new ' + serializeExpression(method) + '(' + source.join(', ') + ')';
			
		    case EOperation(type, leftOperand, rightOperand):
			if (rightOperand != null)
				return '(' + serializeExpression(leftOperand) + serializeOperator(type) + serializeExpression(rightOperand) + ')';
			else
				return '(' + serializeOperator(type) + serializeExpression(leftOperand) + ')';

		    case EReference(identifier, base):
			if (base == null)
				return identifier;
			else
				return '(' + serializeExpression(base) + ').' + identifier;

		    case EThisReference:
			return 'this';
		}
	}
	
	public function serializeDefinition(definition:Definition, ?scope:CompilerScope):String
	{
		switch (definition)
		{
			case DVariable(identifier, visibility, isStatic, type):
				return ((scope != null) && Type.enumConstructor(scope) == 'SClass' ? 'this.' : 'var ') +
				    identifier + ' = 0;';
			
			case DFunction(identifier, visibility, isStatic, type, params, body):
				// format params
				var paramKeys:Array<String> = new Array();
				for (param in params)
					paramKeys.push(param.name);
				var func:String = 'function ' + identifier + '(' + paramKeys.join(', ') + ') {\n' + serializeStatement(body) + '\n}';

				return ((scope != null) && Type.enumConstructor(scope) == 'SClass') ?
				    'addMethod(this, "' +
				      (identifier == Type.enumParameters(scope)[0] ? '__construct' : identifier) +
				      '", ' + func + ');' :
				    identifier + ' = ' + func + ';';
			    
			case DClass(identifier, visibility, isStatic, body):
				return 'function ' + identifier + '() {\nwith (this) {\n' +
				    serializeStatement(body, SClass(identifier)) +
				    '\n}\nthis.__construct && this.__construct.apply(this, arguments);\n } ';
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

enum CompilerScope 
{
	SClass(identifier:String);
	SBlock;
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
