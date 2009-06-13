package processing.parser;

import processing.parser.Syntax;
import processing.parser.Tokenizer;

class Parser {
	public var tokenizer:Tokenizer;

	public function new() {
		// create tokenizer
		tokenizer = new Tokenizer();
	}
	
	public function parse(code:String):Statement
	{
		// initialize tokenizer
		tokenizer.load(code);

		// parse global block
//[TODO] should definitions be a map?
		var statements:Array<Statement> = [], definitions:Array<Definition> = [];
		//[NOTE] function order is important here
		while (parseDefinition(PScript, statements, definitions) ||
		    parseStatement(statements, definitions))
			continue;

		// check that we've finished parsing
		if (tokenizer.hasNext())
//[TODO] ParserSyntaxError?
			throw tokenizer.createSyntaxError('Script unterminated');
		// return parsed global block
		return SBlock(statements, definitions);
	}

// required flag?
	private function parseStatement(statements:Array<Statement>, definitions:Array<Definition>):Bool
	{
		// parse variable definitions first
		if (parseDefinition(PBlock, statements, definitions))
			return true;
		
		// if 
		if (tokenizer.match(TKeyword('if')))
		{
			// condition
			tokenizer.match(TParenOpen, true);
			var condition:Expression = parseExpression(true);
			tokenizer.match(TParenClose, true);
			// then block
			var thenBlock:Array<Statement> = [];
			if (tokenizer.match(TBraceOpen))
			{
				while (parseStatement(thenBlock, definitions))
					continue;
				tokenizer.match(TBraceClose, true);
			}
			else if (!parseStatement(thenBlock, definitions))
				throw tokenizer.createSyntaxError('Invalid expression in conditional.');
			// else block
			var elseBlock:Array<Statement> = [];
			if (tokenizer.match(TKeyword('else')))
			{
				if (tokenizer.match(TBraceOpen))
				{
					while (parseStatement(elseBlock, definitions))
						continue;
					tokenizer.match(TBraceClose, true);
				}
				else if (!parseStatement(elseBlock, definitions))
					throw tokenizer.createSyntaxError('Invalid expression in conditional.');
			}
			
			// add conditional
			statements.push(SConditional(condition, thenBlock, elseBlock));
		}
		// while 
		else if (tokenizer.match(TKeyword('while')))
		{
			// match condition
			tokenizer.match(TParenOpen, true);
			var condition:Expression = parseExpression(true);
			tokenizer.match(TParenClose, true);
			
			// parse body
			var body:Array<Statement> = [];
			if (tokenizer.match(TBraceOpen))
			{
				while (parseStatement(body, definitions))
					continue;
				tokenizer.match(TBraceClose, true);
			}
			else if (!parseStatement(body, definitions))
				throw tokenizer.createSyntaxError('Invalid expression in for loop.');
			
			// add loop
			statements.push(SLoop(condition, body));
		}
		// for
		else if (tokenizer.match(TKeyword('for')))
		{
			// variable definition/initialization
			tokenizer.match(TParenOpen, true);
			if (!parseDefinition(PBlock, statements, definitions))
			{
				// match expression initialization
				var init:Array<Expression> = parseList();
				for (statement in init)
					statements.push(SExpression(statement));
				tokenizer.match(TSemicolon, true);
			}
			// match condition (null expression evaluates as true)
			var condition:Expression = parseExpression(false);
			if (condition == null)
				condition = ELiteral(true);
			tokenizer.match(TSemicolon, true);
			// match update
			var update:Array<Expression> = parseList();
			tokenizer.match(TParenClose, true);
			
			// parse body
			var body:Array<Statement> = [];
			if (tokenizer.match(TBraceOpen))
			{
				while (parseStatement(body, definitions))
					continue;
				tokenizer.match(TBraceClose, true);
			}
			else if (!parseStatement(body, definitions))
				throw tokenizer.createSyntaxError('Invalid expression in for loop.');
			// append update to body
			for (statement in update)
				body.push(SExpression(statement));
			
			// add loop
			statements.push(SLoop(condition, body));
		}
		// return
		else if (tokenizer.match(TKeyword('return')))
		{
			// push return statement
			statements.push(SReturn(parseExpression(false)));
		}
		// break
		else if (tokenizer.match(TKeyword('break')))
		{
			// match break and optional level
			tokenizer.match('TIdentifier') ?
			    statements.push(SBreak(Type.enumParameters(tokenizer.current())[0])) :
			    statements.push(SBreak());
		}
		// continue
		else if (tokenizer.match(TKeyword('continue')))
		{
			// match continue and optional level
			tokenizer.match('TIdentifier') ?
			    statements.push(SContinue(Type.enumParameters(tokenizer.current())[0])) :
			    statements.push(SContinue());
		}
//[TODO] switch, try/catch/finally, do loop, 
		// expression
		else
		{
			// match expression or semicolon
			var expression:Expression = parseExpression(false);
			if (expression == null)
				return tokenizer.match(TSemicolon);
			tokenizer.match(TSemicolon, true);
			
			// push expression
			statements.push(SExpression(expression));
		}

		// statement matched
		return true;
	}
	
	private function parseDefinition(scope:ParserScope, statements:Array<Statement>, definitions:Array<Definition>)
	{
		// search ahead to find definition
		tokenizer.pushState();

		// match visibility and static (except in block)
		if (scope != PBlock)
		{
			tokenizer.match(TKeyword('static'));
			tokenizer.match(TKeyword('private')) || tokenizer.match(TKeyword('public'));
		}

		// match class (PScript)
		if ((scope == PScript) && tokenizer.match(TKeyword('class')))
		{
			tokenizer.popState();
			return parseClassDefinition(definitions);
		}
		// class constructor
		tokenizer.pushState();
		if ((Type.enumConstructor(scope) == 'PClass') &&
		    tokenizer.match(TIdentifier(Type.enumParameters(scope)[0])) &&
		    tokenizer.match(TParenOpen))
		{
			tokenizer.popState();
			tokenizer.popState();
			return parseFunctionDefinition(definitions, true);
		}
		tokenizer.popState();

		// match type definition
		if (parseType() == null)
		{
			tokenizer.popState();
			return false;
		}
		// match variable/function
		if (tokenizer.match('TIdentifier'))
		{
			// function (PScript, PClass)
			if ((scope != PBlock) && tokenizer.match(TParenOpen))
			{
				tokenizer.popState();
				return parseFunctionDefinition(definitions);
			}
			// variable (PClass, PBlock) (PScript handled by parseStatement as PBlock)
			else if (scope != PScript)
			{
				tokenizer.popState();
				return parseVariableDefinition(statements, definitions);
			}
		}
		
		// no match
		tokenizer.popState();
		return false;
	}
	
	private function parseVisibility():Visibility
	{
		if (tokenizer.match(TKeyword('private')))
			return VPrivate;
		tokenizer.match(TKeyword('public'));
		return VPublic;
	}
	
	private function parseType():VariableType
	{
		// match a type declaration
		tokenizer.pushState();
		switch (tokenizer.next())
		{
		    case TType(value), TIdentifier(value):
			// return type declaration
			tokenizer.clearState();
			var dimensions:Int = 0;
			while (tokenizer.match(TDimensions))
				dimensions++;
			return { type: value, dimensions: dimensions };
		
		    default:
			// no match
			tokenizer.popState();
			return null;
		}
	}
	
	private function parseVariableDefinition(statements:Array<Statement>, definitions:Array<Definition>):Bool
	{
		// get variable definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility();
		var vType:VariableType = parseType();

		// get variable definitions
		do {
			// get identifier
			tokenizer.match('TIdentifier', true);
			var identifier:String = Type.enumParameters(tokenizer.current())[0];
			// check for per-variable array brackets
			var vTypeDimensions:Int = vType.dimensions;
			if (vTypeDimensions == 0) {
				while (tokenizer.match(TDimensions))
					vTypeDimensions++;
			}
			// add definition
			definitions.push(DVariable(identifier, visibility, isStatic, {type: vType.type, dimensions: vTypeDimensions}));
			
			// check for assignment operation
			if (tokenizer.match(TOperator('=')))
			{
				var expression:Expression = parseExpression(true);
				statements.push(SExpression(EAssignment(EReference(identifier), expression)));
			}
		} while (tokenizer.match(TComma));
		
		// closing semicolon
		tokenizer.match(TSemicolon, true);

		// definition matched
		return true;
	}

	private function parseFunctionDefinition(definitions:Array<Definition>, ?constructor:Bool = false):Bool
	{
		// get function definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility(), fType:VariableType = null;
		if (!constructor)
			fType = parseType();
		tokenizer.match('TIdentifier', true);
		var identifier:String = Type.enumParameters(tokenizer.current())[0];
		
		// parse parameters
		tokenizer.match(TParenOpen, true);
		var params:Array<FunctionParam> = [];
		while (!tokenizer.peekMatch(TParenClose))
		{
			// get type
			var type:VariableType = parseType();
			if (type == null)
				throw tokenizer.createSyntaxError('Invalid formal parameter type');
			// get identifier
			if (!tokenizer.match('TIdentifier'))
				throw tokenizer.createSyntaxError('Invalid formal parameter');
			var name:String = Type.enumParameters(tokenizer.current())[0];
			
			// add parameter
			params.push({name: name, type: type});
			
			// check for comma
			if (!tokenizer.peekMatch(TParenClose))
				tokenizer.match(TComma, true);
		}
		tokenizer.match(TParenClose, true);
		
		// parse body
		tokenizer.match(TBraceOpen, true);
		var fStatements:Array<Statement> = [], fDefinitions:Array<Definition> = [];
		while (parseStatement(fStatements, fDefinitions))
			continue;
		tokenizer.match(TBraceClose, true);
		// return function declaration statement
		definitions.push(DFunction(identifier, visibility, isStatic, fType, params, SBlock(fStatements, fDefinitions)));
		return true;
	}

	private function parseClassDefinition(definitions:Array<Definition>):Bool
	{
		// get class definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility();
		tokenizer.match(TKeyword('class'), true);
		tokenizer.match('TIdentifier', true);
		var identifier:String = Type.enumParameters(tokenizer.current())[0];
		
		// parse body
		tokenizer.match(TBraceOpen, true);
		var cStatements:Array<Statement> = [], cDefinitions:Array<Definition> = [];
		while (parseDefinition(PClass(identifier), cStatements, cDefinitions))
			continue;
		tokenizer.match(TBraceClose, true);

		// return function declaration statement
		definitions.push(DClass(identifier, visibility, isStatic, SBlock(cStatements, cDefinitions)));
		return true;
	}
	
	private function parseList():Array<Expression>
	{
		// parse a comma-delimited list of expressions (array initializer, function call, &c.)
		var list:Array<Expression> = [];
		do
		{
			var expression = parseExpression(list.length > 0);
			if (expression == null)
				return list;
			list.push(expression);
		} while (tokenizer.match(TComma));
		return list;
	}

	private function parseExpression(required:Bool):Expression
	{
		// variable definitions
		var operators:Array<ParserOperator> = [], operands:Array<Expression> = [];
	
		// main loop
		scanOperand(operators, operands);
		if (operands.length == 0)
			if (required)
				throw tokenizer.createSyntaxError('Expected expression.');
			else
				return null;
		while (scanOperator(operators, operands))
			scanOperand(operators, operands, true);
			
		// reduce to a single operand
		recursiveReduceExpression(operators, operands);
		return operands[0];
	}

	private function scanOperand(operators:Array<ParserOperator>, operands:Array<Expression>, ?required:Bool = false):Bool
	{
		// switch based on next token
		var token:Token = tokenizer.peek();
		switch (token)
		{
		    // unary operators
		    case TOperator(opString):
			// knock off token
			tokenizer.next();
			
			// prefix operators
			if (opString == '++' || opString == '--') {
				// reduce and push operator
				var operator:ParserOperator = PPrefix(lookupIncrementType(opString));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);

				// already matched operator, find operand
				return scanOperand(operators, operands, required);
			}
			else
			{
				// lookup operator
				var operation:Operator = lookupOperatorType(opString, true);
				switch (operation)
				{
				    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus:
					// reduce and push operator
					var operator:ParserOperator = POperator(operation);
					recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
					operators.push(operator);
					
					// matched operator, find next operand
					return scanOperand(operators, operands, required);
				
				    default:
					throw tokenizer.createSyntaxError('Invalid operator.');
				}
			}

		    // explicit cast (Processing-specific)
		    case TType(value):
			// push cast
			var type:VariableType = parseType();
			operators.push(PCast(type));
			
			// push cast operand
			tokenizer.match(TParenOpen, true);
			var expression:Expression = parseExpression(true);
			tokenizer.match(TParenClose, true);
			operands.push(expression);

		    // identifier
		    case TIdentifier(value):
			// push reference
			tokenizer.next();
			operands.push(EReference(value));

		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {
			    // literals
			    case 'this': tokenizer.next(); operands.push(EThisReference);
			    case 'null': tokenizer.next(); operands.push(ELiteral(null));
			    case 'true': tokenizer.next(); operands.push(ELiteral(true));
			    case 'false': tokenizer.next(); operands.push(ELiteral(false));

			    // unary operators
			    case 'new':
				// knock off token
				tokenizer.next();
				
				// array instantiation
				if ((tokenizer.peekMatch('TIdentifier') || tokenizer.peekMatch('TType')) &&
				    tokenizer.peekMatch(TBracketOpen, 2))
				{
					// type
					var type:VariableType = parseType();
					// array dimensions
					var sizes:Array<Expression> = [];
					while (tokenizer.match(TBracketOpen))
					{
						sizes.push(parseExpression(true));
						tokenizer.match(TBracketClose, true);
					}

					// operand
					operands.push(EArrayInstantiation(type, sizes));
				}
				// object instantiation
				else
				{
					// match class
					tokenizer.match('TIdentifier', true);
					var reference:String = Type.enumParameters(tokenizer.current())[0];
					// match optional arguments
					var args:Array<Expression> = null;
					if (tokenizer.match(TParenOpen))
					{
						args = parseList();
						tokenizer.match(TParenClose);
					}
					
					// operand
					args == null ?
					    operands.push(EObjectInstantiation(EReference(reference))) :
					    operands.push(EObjectInstantiation(EReference(reference), args));
				}
			
			    default:
				// invalid keyword; missing operand
				if (required)
					throw tokenizer.createSyntaxError('Missing operand');
				return false;
			}
			
		    // literals
//[TODO] simplify?
		    case TString(value):
			tokenizer.next();
			operands.push(ELiteral(value));
		    case TInteger(value):
			tokenizer.next();
			operands.push(ELiteral(value));
		    case TFloat(value):
			tokenizer.next();
			operands.push(ELiteral(value));
		    case TChar(value):
			tokenizer.next();
			operands.push(ELiteral(value));

		    // array literal
		    case TBraceOpen:
			tokenizer.next();
			operands.push(EArrayLiteral(parseList()));
			tokenizer.match(TBraceClose, true);
		
		    // cast/group
		    case TParenOpen:
			// knock off token
			tokenizer.next();
			
			// check for cast or parenthetical
			tokenizer.pushState();
			var isPrimitive:Bool = tokenizer.peekMatch('TType');
			var type:VariableType = parseType();
			if ((type != null) && tokenizer.match(TParenClose))
			{
				// push temp operator (before scanning for operand)
				operators.push(PCast(type));
				// ensure this be a cast
				// ( ReferenceType ) UnaryExpressionNotPlusMinus
				if ((isPrimitive || !(tokenizer.peekMatch(TOperator('+')) && !tokenizer.peekMatch(TOperator('-')))) &&
				    scanOperand(operators, operands))
				{
					// matched operand already
					tokenizer.clearState();
					return true;
				}

				// clear operator
				operators.pop();
			}
			// clear state
			tokenizer.popState();
			
			// parse parenthetical
			operands.push(parseExpression(true));
			if (!tokenizer.match(TParenClose))
				throw tokenizer.createSyntaxError('Missing ) in parenthetical');

		    // missing operand
		    default:
			if (required)
				throw tokenizer.createSyntaxError('Missing operand');
			return false;
		}

		// matched operand
		return true;
	}

	private function scanOperator(operators:Array<ParserOperator>, operands:Array<Expression>, ?required:Bool = false):Bool
	{		
		// get next token
		var token:Token = tokenizer.peek();
		// switch based on type
		switch (token)
		{
		    // operators
		    case TOperator(opToken):
			// knock off token
			tokenizer.next();
			
			// postfix operators
			if (opToken == '++' || opToken == '--')
			{
				// reduce and push operator
				var operator:ParserOperator = PPostfix(lookupIncrementType(opToken));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);
				
				// matched operand, find next operator
				return scanOperator(operators, operands, required);
			}
			// assignment operators
			else if (isAssignmentOperator(opToken))
			{
				// reduce left-hand expression
				recursiveReduceExpression(operators, operands);
				// we can only assign to a reference
				var reference:Expression = operands.pop();
				if ((Type.enumConstructor(reference) != 'EReference') &&
				    (Type.enumConstructor(reference) != 'EArrayAccess'))
					throw tokenizer.createSyntaxError('Invalid assignment left-hand side.');
				
				// get value
				var value:Expression = parseExpression(true);
				if (opToken != '=')
					value = EOperation(lookupOperatorType(opToken), reference, value);
					
				// add assignment
				operands.push(EAssignment(reference, value));
				// expression finished
				return false;
			}
			// regular operators
			else
			{
				// combine higher-precedence expressions and push
				var operator:ParserOperator = POperator(lookupOperatorType(opToken));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);
			}

		    // dot operator
		    case TDot:
			// knock off token
			tokenizer.next();
			
			// match and push required identifier as string
			tokenizer.match('TIdentifier', true);
			// reduce and push operator
			var operator:ParserOperator = PDot(Type.enumParameters(tokenizer.current())[0]);
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);

			// matched operand, find next operator
			return scanOperator(operators, operands, required);

		    // array access
		    case TBracketOpen:
			// match index
			tokenizer.match(TBracketOpen, true);
			var index:Expression = parseExpression(true);
			tokenizer.match(TBracketClose, true);
			
			// reduce and push operator
			var operator:ParserOperator = PArrayAccess(index);
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);

			// matched operand, find next operator
			return scanOperator(operators, operands, required);
			
		    // hook/colon operator
		    case TQuestion:
			// knock off token
			tokenizer.next();
			
			// reduce left-hand conditional
			recursiveReduceExpression(operators, operands);
			var conditional:Expression = operands.pop();
			// parse statements
			var thenExpression:Expression = parseExpression(true);
			tokenizer.match(TDoubleDot, true);
			var elseExpression:Expression = parseExpression(true);
			
			// add conditional
			operands.push(EConditional(conditional, thenExpression, elseExpression));
			// reached end of expression
			return false;

		    // method call
		    case TParenOpen:
			// parse arguments
			tokenizer.match(TParenOpen, true);
			var args:Array<Expression> = parseList();
			tokenizer.match(TParenClose, true);
			
			// reduce and push operator
			var operator:ParserOperator = PCall(args);
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);

			// operand already found; find next operator
			return scanOperator(operators, operands);

		    // missing operator
		    default:
			if (required)
				throw tokenizer.createSyntaxError('Missing operator');
			return false;
		}
	
		// matched operator
		return true;
	}
	
	private function recursiveReduceExpression(operators:Array<ParserOperator> , operands:Array<Expression>, ?precedence:Int = 0):Void
	{
		while (operators.length > 0 && lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence)
			reduceExpression(operators, operands);
	}

	private function reduceExpression(operators:Array<ParserOperator>, operands:Array<Expression>):Void
	{
		// reduce topmost operator
		switch (operators.pop())
		{
		    case POperator(operator):
			switch (operator)
			{
			    // arity: 1
			    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus:
				var a:Expression = operands.pop();
				operands.push(EOperation(operator, a));

			    // arity: 2
			    case OpOr, OpAnd, OpBitwiseOr, OpBitwiseXor, OpBitwiseAnd, OpEqual,
			      OpUnequal, OpLessThan, OpLessThanOrEqual, OpGreaterThan, OpGreaterThanOrEqual,
			      OpInstanceOf, OpLeftShift, OpRightShift, OpZeroRightShift, OpPlus, OpMinus,
			      OpMultiply, OpDivide, OpModulus:
				var b:Expression = operands.pop(), a:Expression = operands.pop();
				operands.push(EOperation(operator, a, b));
			}
	    
		    case PCast(type):
			// expression cast
			var expression:Expression = operands.pop();
			operands.push(ECast(type, expression));
		    
		    case PPrefix(type):
			// get reference
		        var reference:Expression = operands.pop();
			// we can only assign to a reference
			if (Type.enumConstructor(reference) != 'EReference')
				throw tokenizer.createSyntaxError('Invalid assignment left-hand side.');
				
			// compound prefix operation
			operands.push(EPrefix(reference, type));
		    
		    case PPostfix(type):
			// get reference
		        var reference:Expression = operands.pop();
			// we can only assign to a reference
			if (Type.enumConstructor(reference) != 'EReference')
				throw tokenizer.createSyntaxError('Invalid assignment left-hand side.');
				
			// compound postfix operation
			operands.push(EPostfix(reference, type));
		    
		    case PDot(identifier):
			// get property and base
		        var base:Expression = operands.pop();
			// compound reference
			operands.push(EReference(identifier, base));
		    
		    case PArrayAccess(index):
			// array access
			var reference:Expression = operands.pop();
			operands.push(EArrayAccess(reference, index));
		    
		    case PCall(args):
			// method call
			var method:Expression = operands.pop();
			operands.push(ECall(method, args));
		}
	}
	
	private static var IS_ASSIGNMENT_OPERATOR:EReg = ~/^(\||\^|&|<<|>>>?|\+|\-|\*|\/|%)?=$/;
	
	private function isAssignmentOperator(operator:String):Bool
	{
		return IS_ASSIGNMENT_OPERATOR.match(operator);
	}
	
//[TODO] lookupSimpleOperatorType
	private function lookupOperatorType(operator:String, scanOperand:Bool = false):Operator
	{
		switch (operator)
		{
		    case '!': return OpNot;
		    case '~': return OpBitwiseNot;
		    case '||': return OpOr;
		    case '&&': return OpAnd;
		    case '|', '|=': return OpBitwiseOr;
		    case '^', '^=': return OpBitwiseXor;
		    case '&', '&=': return OpBitwiseAnd;
		    case '==': return OpEqual;
		    case '!=': return OpUnequal;
		    case '<': return OpLessThan;
		    case '<=': return OpLessThanOrEqual;
		    case '>': return OpGreaterThan;
		    case '>=': return OpGreaterThanOrEqual;
		    case 'instanceof': return OpInstanceOf;
		    case '<<', '<<=': return OpLeftShift;
		    case '>>', '>>=': return OpRightShift;
		    case '>>>', '>>>=': return OpZeroRightShift;
		    case '+', '+=', '++': return scanOperand ? OpUnaryPlus : OpPlus;
		    case '-', '-=', '--': return scanOperand ? OpUnaryMinus : OpMinus;
		    case '*', '*=': return OpMultiply;
		    case '/', '/=': return OpDivide;
		    case '%', '%=': return OpModulus;
		    default: throw 'Unknown operator "' + operator + '"';
		}
	}
	
	private function lookupIncrementType(operator:String):IncrementType
	{
		switch (operator)
		{
		    case '++': return IIncrement;
		    case '--': return IDecrement;
		    default: throw 'Unknown increment operator "' + operator + '"';
		}
	}

// http://www.particle.kth.se/~lindsey/JavaCourse/Book/Part1/Java/Chapter02/operators.html

	private function lookupOperatorPrecedence(operator:ParserOperator)
	{
		return switch (operator)
		{
		    case POperator(operator):
			switch (operator)
			{
			    case OpOr: 3;
			    case OpAnd: 4;
			    case OpBitwiseOr: 5;
			    case OpBitwiseXor: 6;
			    case OpBitwiseAnd: 7;
			    case OpEqual, OpUnequal: 8;
			    case OpLessThan, OpLessThanOrEqual, OpGreaterThan, OpGreaterThanOrEqual, OpInstanceOf: 9;
			    case OpLeftShift, OpRightShift, OpZeroRightShift: 10;
			    case OpPlus, OpMinus: 11;
			    case OpMultiply, OpDivide, OpModulus: 12;
			    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus: 14;
			}
		    case PCast(_): 13;
		    case PPrefix(_): 14;
		    case PPostfix(_): 15;
		    case PDot(_): 15;
		    case PArrayAccess(_): 15;
		    case PCall(_): 15;
		}
	}
}

enum ParserScope
{
	PScript;
	PClass(identifier:String);
	PBlock;
}

enum ParserOperator
{
	POperator(operator:Operator);
	PCast(type:VariableType);
	PPrefix(type:IncrementType);
	
	// highest precedence
	PPostfix(type:IncrementType);
	PDot(identifier:String);
	PArrayAccess(index:Expression);
	PCall(args:Array<Expression>);
}