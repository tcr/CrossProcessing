package processing.parser;

import processing.parser.Syntax;
import processing.parser.Tokenizer;

class Parser {
	public var tokenizer:Tokenizer;

	public function new() {
		// create tokenizer
		tokenizer = new Tokenizer();
	}
	
	public function parse(code:String):Statement {
		// initialize tokenizer
		tokenizer.load(code);

		// parse global block
//[TODO] definitions should be a map!
		var statements:Array<Statement> = [], definitions:Array<Definition> = [];
		//[NOTE] function order is important here
		while (parseDefinition(PScript, statements, definitions) ||
		    parseStatement(statements, definitions))
			continue;

		// check that we've finished parsing
		if (!tokenizer.done)
//[TODO] ParserSyntaxError?
			throw new TokenizerSyntaxError('Script unterminated', tokenizer);
		// return parsed global block
		return SBlock(statements, definitions);
	}

// required flag?
	private function parseStatement(statements:Array<Statement>, definitions:Array<Definition>):Bool
	{
		// parse variable definitions first
		if (parseDefinition(PBlock, statements, definitions))
			return true;
		
		// peek to see what kind of statement this is
		switch (tokenizer.peek())
		{
		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {

			    // if block
			    case 'if':
				// condition
				tokenizer.get();
				tokenizer.match(TParenOpen, true);
				var condition:Statement = parseExpression();
				if (condition == null)
					throw new TokenizerSyntaxError('Invalid expression in conditional.', tokenizer);
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
					throw new TokenizerSyntaxError('Invalid expression in conditional.', tokenizer);
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
						throw new TokenizerSyntaxError('Invalid expression in conditional.', tokenizer);
				}
				
				// add conditional
				statements.push(SConditional(condition, thenBlock, elseBlock));
				
//[TODO] handle loop labels!
/*
			    // while statement
			    case 'while':
				// match opening 'while' and '('
				tokenizer.get();
				tokenizer.match(TokenType.LEFT_PAREN, true);
				
				// match condition
				var condition:Statement = parseExpression(TokenType.RIGHT_PAREN);
				tokenizer.match(TokenType.RIGHT_PAREN, true);
				// parse body
				var body:Statement;
				if (tokenizer.match(TokenType.LEFT_CURLY)) {
					body = parseBlock(TokenType.RIGHT_CURLY);
					tokenizer.match(TokenType.RIGHT_CURLY, true);
				} else {
					body = parseStatement();
				}

				// push for loop
				statements.push(SLoop(condition, body));
*/
			    // for statement
			    case 'for':
				// match opening 'for' and '('
				tokenizer.get();
				tokenizer.match(TParenOpen, true);

				// variable definition/initialization
				if (!parseDefinition(PBlock, statements, definitions))
				{
					// match expression initialization
					var init:Array<Statement> = parseList();
					for (statement in init)
						statements.push(statement);
					tokenizer.match(TSemicolon, true);
				}
				// match condition
				var condition:Statement = parseExpression();
				tokenizer.match(TSemicolon, true);
				// match update
				var update:Array<Statement> = parseList();
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
					throw new TokenizerSyntaxError('Invalid expression in for loop.', tokenizer);
				// append loop body
				body = body.concat(update);
				
				// return loop
				statements.push(SLoop(condition, body));

			    // returns
			    case 'return':
				tokenizer.get();
				// push return statement
				statements.push(SReturn(parseExpression()));
			
			    // break
			    case 'break':
				tokenizer.get();		
				// match break and optional level
				tokenizer.match('TIdentifier') ?
				    statements.push(SBreak(Type.enumParameters(tokenizer.currentToken)[0])) :
				    statements.push(SBreak());
				
			    // continue
			    case 'continue' :
				tokenizer.get();			
				// match continue and optional level
				tokenizer.match('TIdentifier') ?
				    statements.push(SContinue(Type.enumParameters(tokenizer.currentToken)[0])) :
				    statements.push(SContinue());

			    default:
//[TODO] this might have to be a check on every loop
//				if (required)
//					throw new TokenizerSyntaxError('Unexpected keyword "' + keyword + '"', tokenizer);
				return false;
			}
		
		    // expression
		    default:
			// match expression or semicolon
			var expression:Statement = parseExpression();
			if (expression == null)
				return tokenizer.match(TSemicolon);
			tokenizer.match(TSemicolon, true);
			
			// push expression
			statements.push(expression);
		}

		return true;
	}
	
	private function parseDefinition(scope:ParserScope, statements:Array<Statement>, definitions:Array<Definition>)
	{
		// search ahead to find definition
		var peek:Int = 1;
		
		// match visibility and static (except in block)
		if (scope != PBlock)
		{
			if (tokenizer.peekMatch(TKeyword('static'), peek))
				peek++;
			if (tokenizer.peekMatch(TKeyword('private'), peek) || tokenizer.match(TKeyword('public'), peek))
				peek++;
		}
		
		// match class (PScript)
		if ((scope == PScript) && tokenizer.peekMatch(TKeyword('class'), peek))
			return parseClassDefinition(definitions);
		// class constructor
		if ((Type.enumConstructor(scope) == 'PClass') &&
		    tokenizer.peekMatch(TIdentifier(Type.enumParameters(scope)[0]), peek) &&
		    tokenizer.peekMatch(TParenOpen, peek + 1))
			return parseFunctionDefinition(definitions, true);
		
		// match type definition
		if (tokenizer.peekMatch('TType', peek) || tokenizer.peekMatch('TIdentifier', peek))
			peek++;
		else
			return false;
		while (tokenizer.peekMatch(TDimensions, peek))
			peek++;
		
		// match variable/function
		if (tokenizer.peekMatch('TIdentifier', peek))
		{
			// function (PScript, PClass)
			if ((scope != PBlock) && tokenizer.peekMatch(TParenOpen, peek + 1))
				return parseFunctionDefinition(definitions);
			// variable (PClass, PBlock) (PScript handled by parseStatement as PBlock)
			else if (scope != PScript)
				return parseVariableDefinition(statements, definitions);
		}
		// no match
		return false;
	}
	
	private function parseVisibility():Visibility {
		if (tokenizer.match(TKeyword('private')))
			return VPrivate;
		tokenizer.match(TKeyword('public'));
		return VPublic;
	}
	
	private function parseType():VariableType {
		// match a type declaration
		switch (tokenizer.peek())
		{
		    case TType(value), TIdentifier(value):
			// return type declaration
			tokenizer.get();
			var dimensions:Int = 0;
			while (tokenizer.match(TDimensions))
				dimensions++;
			return { type: value, dimensions: dimensions };
		
		    default:
			// no match
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
			var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
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
				var expression:Statement = parseExpression();
				if (expression == null)
					throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				statements.push(SAssignment(SReference(SLiteral(identifier)), expression));
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
		var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
		
		// parse parameters
		tokenizer.match(TParenOpen, true);
		var params:Array<FunctionParam> = [];
		while (!tokenizer.peekMatch(TParenClose))
		{
			// get type
			var type:VariableType = parseType();
			if (type == null)
				throw new TokenizerSyntaxError('Invalid formal parameter type', tokenizer);
			// get identifier
			if (!tokenizer.match('TIdentifier'))
				throw new TokenizerSyntaxError('Invalid formal parameter', tokenizer);
			var name:String = Type.enumParameters(tokenizer.currentToken)[0];
			
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
		//[NOTE] function order is important here
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
		var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
		
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
	
	private function parseList():Array<Statement>
	{
		// parse a comma-delimited list of expressions (array initializer, function call, &c.)
		var list:Array<Statement> = [], expression:Statement;
		do
		{
			expression = parseExpression();
			if (expression == null)
				if (list.length == 0)
					return list;
				else
					throw new TokenizerSyntaxError('Invalid expression in list.', tokenizer);
			list.push(expression);
		} while (tokenizer.match(TComma));
		return list;
	}

//[TODO] allowEmpty argument?
	private function parseExpression():Statement
	{
		// variable definitions
		var operators:Array<ParserOperator> = [], operands:Array<Statement> = [];
	
		// main loop
		scanOperand(operators, operands);
		if (operands.length == 0)
			return null;
		while (scanOperator(operators, operands))
			scanOperand(operators, operands, true);
			
		// reduce to a single operand
		recursiveReduceExpression(operators, operands);
		return operands[0];
	}

	private function scanOperand(operators:Array<ParserOperator>, operands:Array<Statement>, ?required:Bool = false):Bool
	{
		// get next token
		var token:Token = tokenizer.peek();
		// switch based on type
		switch (token)
		{
		    // unary operators
		    case TOperator(opString):
			// knock off token
			tokenizer.get();
			
/*			// prefix operators
			if (opToken == '++' || opToken == '--') {
				// reduce and push operator
				var operator:ParserOperator = PPrefix(lookupOperatorType(opToken));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);

				// already matched operator, find operand
				return scanOperand(operators, operands, required);
			}
			else
			{*/
				// lookup operator
				var operation:Operator = lookupOperatorType(opString, true);
				switch (operation) {
				    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus:
					// reduce and push operator
					var operator:ParserOperator = POperator(operation);
					recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
					operators.push(operator);
					
					// matched operator, find next operand
					return scanOperand(operators, operands, required);
				
				    default:
					throw new TokenizerSyntaxError('Invalid operator.', tokenizer);
				}
//			}

		    // explicit cast (Processing-specific)
		    case TType(value):
			// push cast
			var type:VariableType = parseType();
			operators.push(PCast(type));
			
			// push cast operand
			tokenizer.match(TParenOpen, true);
			var expression:Statement = parseExpression();
			if (expression == null)
				throw new TokenizerSyntaxError('Invalid expression in cast.', tokenizer);
			tokenizer.match(TParenClose, true);
			operands.push(expression);

		    // identifier
		    case TIdentifier(value):
			// push reference
			tokenizer.get();
			operands.push(SReference(SLiteral(value)));

		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {
			    // literals
			    case 'this': tokenizer.get(); operands.push(SThisReference);
			    case 'null': tokenizer.get(); operands.push(SLiteral(null));
			    case 'true': tokenizer.get(); operands.push(SLiteral(true));
			    case 'false': tokenizer.get(); operands.push(SLiteral(false));

			    // unary operators
			    case 'new':
				// knock off token
				tokenizer.get();
				
				// array instantiation
				if ((tokenizer.peekMatch('TIdentifier') || tokenizer.peekMatch('TType')) &&
				    tokenizer.peekMatch(TBracketOpen, 2))
				{
					// type
					var type:VariableType = parseType();
					// array dimensions
					var sizes:Array<Statement> = [];
					while (tokenizer.match(TBracketOpen))
					{
						var expression:Statement = parseExpression();
						if (expression == null)
							throw new TokenizerSyntaxError('Invalid array dimension.', tokenizer);
						sizes.push(expression);
						tokenizer.match(TBracketClose, true);
					}

					// operand
					operands.push(SArrayInstantiation(type, sizes));
				}
				// object instantiation
				else
				{
					// match class
					tokenizer.match('TIdentifier', true);
					var reference:Statement = Type.enumParameters(tokenizer.currentToken)[0];
					// match optional arguments
					var args:Array<Statement> = null;
					if (tokenizer.match(TParenOpen))
					{
						args = parseList();
						tokenizer.match(TParenClose);
					}
					
					// operand
					args == null ?
					    operands.push(SObjectInstantiation(SReference(SLiteral(reference)))) :
					    operands.push(SObjectInstantiation(SReference(SLiteral(reference)), args));
				}
			
			    default:
				// invalid keyword; missing operand
				if (required)
					throw new TokenizerSyntaxError('Missing operand', tokenizer);
				return false;
			}
			
		    // literals
//[TODO] simplify?
		    case TString(value):
			tokenizer.get();
			operands.push(SLiteral(value));
		    case TInteger(value):
			tokenizer.get();
			operands.push(SLiteral(value));
		    case TFloat(value):
			tokenizer.get();
			operands.push(SLiteral(value));
		    case TChar(value):
			tokenizer.get();
			operands.push(SLiteral(value));

		    // array literal
		    case TBraceOpen:
			tokenizer.get();
			operands.push(SArrayLiteral(parseList()));
			tokenizer.match(TBraceClose, true);
		
		    // cast/group
		    case TParenOpen:
			// parse parenthetical
			tokenizer.get();
			var expression:Statement = parseExpression();
			if (expression == null)
				throw new TokenizerSyntaxError('Invalid parenthetical expression.', tokenizer);
			operands.push(expression);
			if (!tokenizer.match(TParenClose))
				throw new TokenizerSyntaxError('Missing ) in parenthetical', tokenizer);

/*
		    // cast/group
		    case TParenOpen:
			tokenizer.get();

			// check if this be a cast or a group
//[TODO] what about multi-dimension arrays?
			var isArray:Bool = tokenizer.match(TDimensions, 2);
			if (tokenizer.match('TType', 1) ||
			    (isArray && tokenizer.match('TIdentifier', 1)) &&
			    tokenizer.match(TParenClose, isArray ? 3 : 2))
			{
				// push casting operator
//[TODO] what the hell is this
				operators.push('cast');
				// push operands
				operands.push(parseType());
				tokenizer.match(TParenClose, true);
				return scanOperand(operators, operands, stopAt, true);
			}
			else if (tokenizer.match(TParenClose, 2) && tokenizer.match('TIdentifier'))
			{
				// match ambiguous parenthetical
				var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
				tokenizer.match(TParenClose, true);
				
				// check if this be a cast
//[TODO] proper casting these arrays
				var tmpOperators:Array<Dynamic> = [], tmpOperands:Array<Dynamic> = [];
				if (scanOperand(tmpOperators, tmpOperands))
				{
					// add operators
					operators.push('cast');
					for (i in tmpOperators)
						operators.push(i);
					// add operands
					operands.push({type: identifier, dimensions: null});
					for (i in tmpOperands)
						operands.push(i);
				}
				else
				{
					// not a cast; add operand
					operands.push(SReference(SLiteral(identifier)));
				}
			}
			else
			{
				// parse parenthetical
				operands.push(parseExpression(TParenClose));
				if (!tokenizer.match(TParenClose))
					throw new TokenizerSyntaxError('Missing ) in parenthetical', tokenizer);
			}
			return true;
*/

		    // missing operand
		    default:
			if (required)
				throw new TokenizerSyntaxError('Missing operand', tokenizer);
			return false;
		}

		// matched operand
		return true;
	}

	private function scanOperator(operators:Array<ParserOperator>, operands:Array<Statement>, ?required:Bool = false):Bool
	{		
		// get next token
		var token:Token = tokenizer.peek();
		// switch based on type
		switch (token)
		{
		    // operators
		    case TOperator(opToken):
			// knock off token
			tokenizer.get();
			
			// postfix operators
			if (opToken == '++' || opToken == '--')
			{
				// reduce and push operator
				var operator:ParserOperator = PPostfix(lookupOperatorType(opToken));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);
				
				// matched operand, find next operator
				return scanOperator(operators, operands, required);
			}
			// assignment operators
			else if (isAssignmentOperator(opToken))
			{
				// combine higher-precedence expressions and push
				var operator:ParserOperator = (opToken == '=') ? PAssignment() : PAssignment(lookupOperatorType(opToken));
				recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
				operators.push(operator);

//[TODO] probably just push operand expression here
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
			tokenizer.get();
			// reduce and push operator
			var operator:ParserOperator = PDot;
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);
			
			// match and push required identifier as string
			tokenizer.match('TIdentifier', true);
			operands.push(SLiteral(Type.enumParameters(tokenizer.currentToken)[0]));
			// reduce now to concatenate reference
			reduceExpression(operators, operands);

			// matched operand, find next operator
			return scanOperator(operators, operands, required);

		    // array access
		    case TBracketOpen:
			// match index
			tokenizer.match(TBracketOpen, true);
			var index:Statement = parseExpression();
			if (index == null)
				throw new TokenizerSyntaxError('Invalid array index.', tokenizer);
			tokenizer.match(TBracketClose, true);
			
			// reduce and push operator
			var operator:ParserOperator = PArrayAccess(index);
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);

			// matched operand, find next operator
			return scanOperator(operators, operands, required);
			
		    // hook/colon operator
/*		    case TQuestion:
			// reduce left-hand conditional
			tokenizer.get();
			while (operators.length > 0)
				reduceExpression(operators, operands);
			var conditional:Statement = operands.pop();
			// parse then block
			var thenBlock:Statement = parseExpression(TokenType.COLON);
			// parse else block
			tokenizer.match(TokenType.COLON, true);
			var elseBlock:Statement = parseExpression();
			
			// add conditional
			operands.push(SConditional(conditional, thenBlock, elseBlock));
			// already matched expression
			return false;*/

		    // method call
		    case TParenOpen:
			// parse arguments
			tokenizer.match(TParenOpen, true);
			var args:Array<Statement> = parseList();
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
				throw new TokenizerSyntaxError('Missing operator', tokenizer);
			return false;
		}
	
		// matched operator
		return true;
	}
	
	private function recursiveReduceExpression(operators:Array<ParserOperator> , operands:Array<Statement>, ?precedence:Int = 0):Void {
		while (operators.length > 0 && lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence)
			reduceExpression(operators, operands);
	}

	private function reduceExpression(operators:Array<ParserOperator>, operands:Array<Statement>):Void {
		// reduce topmost operator
//[TODO] ternary?
		switch (operators.pop())
		{
		    case POperator(operator):
			switch (operator)
			{
			    // arity: 1
			    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus:
				var a:Statement = operands.pop();
				operands.push(SOperation(operator, a));

			    // arity: 2
			    case OpOr, OpAnd, OpBitwiseOr, OpBitwiseXor, OpBitwiseAnd, OpEqual,
			      OpUnequal, OpLessThan, OpLessThanOrEqual, OpGreaterThan, OpGreaterThanOrEqual,
			      OpInstanceOf, OpLeftShift, OpRightShift, OpZeroRightShift, OpPlus, OpMinus,
			      OpMultiply, OpDivide, OpModulus:
				var b:Statement = operands.pop(), a:Statement = operands.pop();
				operands.push(SOperation(operator, a, b));
			}
			
		    case PAssignment(operator):
			// get assignment
		        var value:Statement = operands.pop(), reference:Statement = operands.pop();
			// we can only assign to a reference
			if ((Type.enumConstructor(reference) != 'SReference') &&
			    (Type.enumConstructor(reference) != 'SArrayAccess'))
				throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
			// compound assignment operations
			if (operator != null)
				value = SOperation(operator, reference, value);
			operands.push(SAssignment(reference, value));
	    
		    case PCast(type):
			// expression cast
			var expression:Statement = operands.pop();
			operands.push(SCast(type, expression));
		    
		    case PPrefix(operator):
//[TODO]
		    
		    case PPostfix(operator):
			// get reference
		        var reference:Statement = operands.pop();
			// we can only assign to a reference
			if (Type.enumConstructor(reference) != 'SReference')
				throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
			// compound postfix operation
			operands.push(SPostfix(reference,
			    SAssignment(reference, SOperation(operator, reference, SLiteral(1)))));
		    
		    case PDot:
			// get property and base
		        var identifier:Statement = operands.pop(), base:Statement = operands.pop();
			// compound reference
			operands.push(SReference(identifier, base));
		    
		    case PArrayAccess(index):
			// array access
			var reference:Statement = operands.pop();
			operands.push(SArrayAccess(reference, index));
		    
		    case PCall(args):
			// method call
			var method:Statement = operands.pop();
			operands.push(SCall(method, args));
		}
	}
	
	private static var IS_ASSIGNMENT_OPERATOR:EReg = ~/^(\||\^|&|<<|>>>?|\+|\-|\*|\/|%)?=$/;
	
	private function isAssignmentOperator(operator:String):Bool {
		return IS_ASSIGNMENT_OPERATOR.match(operator);
	}
	
//[TODO] lookupSimpleOperatorType
	private function lookupOperatorType(operator:String, scanOperand:Bool = false):Operator {
		switch (operator) {
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

// http://www.particle.kth.se/~lindsey/JavaCourse/Book/Part1/Java/Chapter02/operators.html
	private function lookupOperatorPrecedence(operator:ParserOperator) {
		return switch (operator) {
		    case POperator(operator):
			switch (operator) {
//[TODO] ternary?
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
		    case PAssignment(_): 1;
//		    case PNew: 13;
		    case PCast(_): 13;
		    case PPrefix(_): 14;
		    case PPostfix(_): 15;
		    case PDot: 15;
		    case PArrayAccess(_): 15;
		    case PCall(_): 15;
		}
	}
}

enum ParserScope {
	PScript;
	PClass(identifier:String);
	PBlock;
}

enum ParserOperator {
	POperator(operator:Operator);
	PAssignment(?operator:Operator);
//	PNew;
	PCast(type:VariableType);
	PPrefix(operator:Operator);
	PPostfix(operator:Operator);
	PDot;
	PArrayAccess(index:Statement);
	PCall(args:Array<Statement>);
}