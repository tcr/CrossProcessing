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
		while (parseVariableDefinition(statements, definitions) ||
		    parseFunctionDefinition(definitions) ||
		    parseClassDefinition(definitions) ||
		    parseStatement(statements))
			continue;
		// check that we've finished parsing
		if (!tokenizer.done)
//[TODO] ParserSyntaxError?
			throw new TokenizerSyntaxError('Script unterminated', tokenizer);
		// return parsed global block
		return SBlock(statements, definitions);
	}

// is required a necessary flag?
	private function parseStatement(statements:Array<Statement>):Bool {
		// peek to see what kind of statement this is
		switch (tokenizer.peek())
		{
		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {
			    // if block
			    case 'if':
				var condition:Statement, thenBlock:Statement, elseBlock:Statement = null;
				
				// get condition
				tokenizer.get();
				tokenizer.match(TParenOpen, true);
				condition = parseExpression();
				tokenizer.match(TParenClose, true);
				// get then block
				if (tokenizer.match(TBraceOpen)) {
					thenBlock = parseBlock(TBraceClose);
					tokenizer.match(TBraceClose, true);
				} else {
					thenBlock = parseStatement();
				}
				// get else block
				if (tokenizer.match(TKeyword('else'))) {
					if (tokenizer.match(TBraceOpen)) {
						elseBlock = parseBlock(TBraceClose);
						tokenizer.match(TBraceClose, true);
					} else {
						elseBlock = parseStatement();
					}
				}
				
				// add conditional
				statements.push(SConditional(condition, thenBlock, elseBlock));

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

			    // for statement
			    case 'for':
				// match opening 'for' and '('
				tokenizer.get();
				tokenizer.match(TokenType.LEFT_PAREN, true);
				
				// match initializer
				if (!tokenizer.match(TokenType.SEMICOLON)) {
					// variable definitions
					if ((tokenizer.peek().match(TokenType.TYPE) ||
					    tokenizer.peek().match(TokenType.IDENTIFIER)) &&
					    tokenizer.peek(2).match(TokenType.IDENTIFIER))
						block.push(parseVariables());
					// expression
					else
						block.push(parseExpression(TokenType.SEMICOLON));
						
					// match semicolon
					tokenizer.match(TokenType.SEMICOLON, true);
				}
				
				// match condition
				var condition:Statement = parseExpression();
				tokenizer.match(TSemicolon, true);
				// match update
				var update:Array<Statement> = [];
				do {
					update.push(parseExpression());
				} while (tokenizer.match(TSemicolon));
				tokenizer.match(TokenType.RIGHT_PAREN, true);
				
				// parse body
				var body:Array<Statement> = [];
				if (tokenizer.match(TokenType.LEFT_CURLY)) {
					body.push(parseBlock(TokenType.RIGHT_CURLY));
					tokenizer.match(TokenType.RIGHT_CURLY, true);
				} else {
					body.push(parseStatement());
				}
				// append loop body
				body = body.concat(update);
				
				// return loop
				statements.push(SLoop(condition, SBlock(body)));
			
			    // returns
			    case 'return':
				tokenizer.get();
				// push return statement
				statements.push(SReturn(parseExpression()));
			
			    // break
			    case 'break':
				tokenizer.get();			
				// match break and optional level
				statements.push(SBreak(tokenizer.match('TInteger') ? tokenizer.currentToken.value : 1));
				
			    // continue
			    case 'continue' :
				tokenizer.get();			
				// match continue and optional level
				statements.push(SContinue(tokenizer.match(TokenType.NUMBER) ? tokenizer.currentToken.value : 1));

			    default:
//[TODO] this might have to be a check on every loop
//				if (required)
//					throw new TokenizerSyntaxError('Unexpected keyword "' + keyword + '"', tokenizer);
				return false;
			}
		
		    // match expression
		    default:
//[TODO] how does parseexpression react when there's nothing to parse!?
			statements.push(parseExpression(statements, definitions));
		}
		
		// match terminating semicolon
		if (!tokenizer.match(TSemicolon))
			throw new TokenizerSyntaxError('Missing ; after statement', tokenizer);
		return true;
	}
	
	private function isDefinition(type:Token, hasType:Bool = true) {
		// match visibility and static
		var peek:Int = 0;
		if (tokenizer.peekMatch(TKeyword('static'), peek))
			peek++;
		if (tokenizer.peekMatch(TKeyword('private'), peek) || tokenizer.match(TKeyword('public'), peek))
			peek++;
		if (hasType) {
			if (tokenizer.peekMatch(TType, peek) || !tokenizer.peekMatch(TIdentifier, peek)
				peek++;
			else 
				return false;
			while (tokenizer.peekMatch(TDimension, peek))
				peek++;
		}
		return tokenizer.peekMatch(type, peek);
	}
	
	private function parseVisibility():Visibility {
		if (tokenizer.match(TKeyword('private')))
			return VPrivate;
		tokenizer.match(TKeyword('public'));
		return VPublic;
	}
	
	private function parseFunctionDefinition(definitions:Array < Definition > ):Bool {
		// match definition
		if (!isDefinition(TKeyword('function'), true))
			return false;
			
		// get function definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility();
		var fType:VariableType = parseType();
		tokenizer.match(TKeyword('function'), true);
		tokenizer.match(TIdentifier, true);
		var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
		
		// parse parameters
		tokenizer.match(TParenOpen, true);
		var params:Array<FunctionParam> = [];
		while (!tokenizer.peek().match(TokenType.RIGHT_PAREN))
		{
			// get type
			var type:VariableType = parseType();
			if (type == null)
				throw new TokenizerSyntaxError('Invalid formal parameter type', tokenizer);
			// get identifier
			if (!tokenizer.match(TokenType.IDENTIFIER))
				throw new TokenizerSyntaxError('Invalid formal parameter', tokenizer);
			var name:String = tokenizer.currentToken.value;
			
			// add parameter
			params.push({name: name, type: type});
			
			// check for comma
			if (!tokenizer.peek().match(TokenType.RIGHT_PAREN))
				tokenizer.match(TokenType.COMMA, true);
		}
		tokenizer.match(TParenClose, true);
		
		// parse body
		tokenizer.match(TBraceOpen, true);
		var fStatements:Array<Statement> = [], fDefinitions:Array<Statement> = [];
		//[NOTE] function order is important here
		while (parseVariableDefinition(fStatements, fDefinitions) ||
		    parseStatement(fStatements))
			continue;
		tokenizer.match(TBraceClose, true);
		// return function declaration statement
		definitions.push(DFunction(identifier, visibility, isStatic, fType, params, SBlock(fStatements, fDefinitions));
	}
	
	private function parseClassDefinition(definitions:Array<Definition>):Bool
	{
		// match definition
		if (!isDefinition(TKeyword('class'), false))
			return false;
			
		// get class definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility();
		tokenizer.match(TKeyword('class'), true);
		tokenizer.match(TIdentifier, true);
		var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
		
		// parse body
		tokenizer.match(TBraceOpen, true);
		var cStatements:Array<Statement> = [], cDefinitions:Array<Definition> = [];
		//[NOTE] function order is important here
		while (parseVariableDefinition(cDefinitions) ||
		    parseFunctionDefinition(cDefinitions))
			continue;
		tokenizer.match(TBraceClose, true);
		// return function declaration statement
		definitions.push(DClass(identifier, visibility, isStatic, SBlock(cStatements, cDefinitions));
	}
	
	private function parseVariableDefinition(statements:Array<Statement>, definitions:Array<Definition>):Bool
	{
		// match definition
		if (!isDefinition(TIdentifier, true))
			return false;
			
		// get variable definition
		var isStatic:Bool = tokenizer.match(TKeyword('static'));
		var visibility:Visibility = parseVisibility();
		var vType:VariableType = parseType();
		
		// get variable definitions
		do {
			// get identifier
			tokenizer.match(TIdentifier, true);
			var identifier:String = Type.enumParameters(tokenizer.currentToken)[0];
			// check for per-variable array brackets
			var vTypeDimensions:Int = vType.dimensions;
			if (vTypeDimensions == 0) {
				while (tokenizer.match(TDimensions))
					vTypeDimensions++;
			}
			// add definition
			definitions.push(DVariable(identifier, visibility, isStatic, {type: vType.type, dimensions: vTypeDimensions));
			
			// check for assignment operation
			if (tokenizer.match(TOperator('=')))
			{
				statements.push(SAssignment(AssignOp, SReference(SLiteral(varName)), parseExpression()));
			}
		} while (tokenizer.match(TComma));
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
	
	private function parseList():Array<Statement>
	{
		// parse a comma-delimited list of expressions (array initializer, function call, &c.)
		var list:Array<Statement> = [];
		while (!tokenizer.match(TComma))
			list.push(parseExpression());
		return list;
	}

	private function parseExpression(?stopAt:Token):Statement
	{
		// variable definitions
		var operators:Array<Dynamic> = [], operands:Array<Dynamic> = [];
	
		// main loop
		if (scanOperand(operators, operands, stopAt))
			while (scanOperator(operators, operands, stopAt))
				scanOperand(operators, operands, stopAt, true);
			
		// reduce to a single operand
		while (operators.length > 0)
			reduceExpression(operators, operands);
		return operands.pop();
	}

	private function scanOperand(operators:Array<Dynamic>, operands:Array<Dynamic>, ?stopAt:Token, ?required:Bool):Bool
	{
		// get next token
		var token:Token = tokenizer.peek();
		// stop if token matches stop parameter
		if (token == stopAt)
			return false;

		// switch based on type
		switch (token)
		{
		    // unary operators
		    case TOperator(opString):
			// lookup operator
			var operator:Dynamic = lookupOperator(opString, true);
			switch (operator) {
			    case AssignOpIncrement, AssignOpDecrement, OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus:
				// push operator and match next operand
				operators.push(operator);
				tokenizer.get();
				return scanOperand(operators, operands, stopAt, true);
			}
			
		    // casting/array initialization
		    case TType(value), TIdentifier(value):
			var isArray:Bool = (tokenizer.peek(2) == TDimensions);
			if (token == TType(value) && tokenizer.peek(isArray ? 3 : 2) == TParenClose)
			{
				// push casting operator
//[TODO] again with the plaintext operators!
				operators.push('cast');
				// push operands
				operands.push(parseType());
				tokenizer.match(TParenOpen, true);
				operands.push(parseExpression(TParenClose));
				tokenizer.match(TParenClose, true);
			}
			else	// array initialization/references
			{
//[TODO] move this into NEW operator?
				// check for new operator
				if (operators[operators.length - 1] == 'new' && tokenizer.peek(2) == TBracketOpen) {
					// get type
					var type:VariableType = parseType();
					// match array dimensions
					var sizes:Array<Statement> = [];
					while (tokenizer.match(TBracketOpen))
					{
						sizes.push(parseExpression(TBracketClose));
						tokenizer.match(TBracketClose, true);
					}

					// create array initializer
					operators.pop();
					operands.push(SArrayInstantiation(type, sizes));
				} else if (Type.enumConstructor(token) != 'TIdentifier') {
					// invalid use of type keyword
					throw new TokenizerSyntaxError('Invalid type declaration', tokenizer);
				}
				else
				{
					// push reference
					tokenizer.get();
					operands.push(SReference(SLiteral(value)));
				}
			}
			return true;

		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {
			    // literals
			    case 'this': operands.push(SThisReference);
			    case 'null': operands.push(SLiteral(null));
			    case 'true': operands.push(SLiteral(true));
			    case 'false': operands.push(SLiteral(false));
			
			    // unary operators
//[TODO] push operators as plaintext!?
			    case 'delete', 'typeof', 'new':	
				// add operator
				tokenizer.get();
				operators.push(keyword);
				
				// match operand
				return scanOperand(operators, operands, stopAt, true);
			
			    default:
				// missing operand
				if (required)
					throw new TokenizerSyntaxError('Missing operand', tokenizer);
				else
					return false;
			}
			tokenizer.get();
			return true;
			
		    // literals
//[TODO] simplify
		    case TString(value):
			tokenizer.get();
			operands.push(SLiteral(value));
			return true;
		    case TInteger(value):
			tokenizer.get();
			operands.push(SLiteral(value));
			return true;
		    case TFloat(value):
			tokenizer.get();
			operands.push(SLiteral(value));
			return true;
		    case TChar(value):
			tokenizer.get();
			operands.push(SLiteral(value));
			return true;
			
		    // array literal
		    case TBraceOpen:
			tokenizer.get();
			operands.push(SArrayLiteral(parseList()));
			tokenizer.match(TBraceClose, true);
			return true;
		
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
			
			// not matched
			default:
		}

		// missing operand
		if (required)
			throw new TokenizerSyntaxError('Missing operand', tokenizer);
		return false;
	}

//[TODO] remove Dynamic here
	private function scanOperator(operators:Array<Dynamic>, operands:Array<Dynamic>, ?stopAt:Token):Bool {		
		// get next token
		var token:Token = tokenizer.peek();
		// stop if token matches stop parameter
		if (stopAt != null && token.match(stopAt))
			return false;

		// switch based on type
		switch (token.type) {				
		    // operators
		    case TOperator(operator):
			switch (operator) {
			    // assignment
			    case '=', '|=', '^=', '&=', '<<=', '>>=', '>>>=', '+=', '-=', '*=', '/=', '%=':
				// combine any higher-precedence expressions (using > and not >=, so postfix > prefix)
				while (operators.length > 0 &&
				    operators[operators.length - 1].precedence > token.type.precedence)
					reduceExpression(operators, operands);
					
				// push operator
				operators.push(tokenizer.get().type);
				// push assignment value
				operands.push(parseExpression(stopAt));

				// reached end of expression
				return false;
		
			    // increment/decrement
			    case '++', '--':
//[TODO] actually this doesn't actually work! how do we do a postfix in the middle of an expression...
				// postfix; reduce higher-precedence operators (using > and not >=, so postfix > prefix)
				while (operators.length > 0 &&
				    operators[operators.length - 1].precedence > token.type.precedence)
					reduceExpression(operators, operands);
					
				// add operator and reduce immediately
//[TODO] is reducing immediately necessary? a matter of precedence...
				operators.push(tokenizer.get().type);
				reduceExpression(operators, operands);
				
				// find next operator
				return scanOperator(operators, operands, stopAt);
				
			    // binary operators
			    case '||', '&&', '|', '^', '&', '==', '!=', '===', '!==', '<', '<=', '>=', '>', '<<', '>>',
			        '>>>', '+', '-', '*', '/', '%', 'in', 'instanceof':
				// combine any higher-precedence expressions
				while (operators.length > 0 &&
				    operators[operators.length - 1].precedence >= token.type.precedence)
					reduceExpression(operators, operands);

				// push operator and scan for operand
				operators.push(tokenizer.get().type);
			
			    default: throw 'Unrecognized operator!';
			}
			
		    // dot operator
		    case TDot:			
			// combine any higher-precedence expressions
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence >= token.type.precedence)
				reduceExpression(operators, operands);
			
			// push operator
			operators.push(tokenizer.get().type);
			// match and push required identifier as string
			tokenizer.match(TIdentifier, true);
			operands.push(SLiteral(tokenizer.currentToken.value));

			// operand already found; find next operator
			return scanOperator(operators, operands, stopAt);

		    // brackets
		    case TBracketOpen:
			// combine any higher-precedence expressions
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence >= TokenType.INDEX.precedence)
				reduceExpression(operators, operands);

			// begin array index operator
			operators.push(TokenType.INDEX);
			tokenizer.match(TokenType.LEFT_BRACKET, true);
			operands.push(parseExpression(TokenType.RIGHT_BRACKET));
			if (!tokenizer.match(TokenType.RIGHT_BRACKET))
				throw new TokenizerSyntaxError('Missing ] in index expression', tokenizer);

			// operand already found; find next operator
			return scanOperator(operators, operands, stopAt);
			
		    // hook/colon operator
		    case TQuestion:
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
			return false;
		
		    // call/instantiation
		    case TParenOpen:
			// reduce until we get the current function (or lower operator precedence than 'new')
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence > TokenType.NEW.precedence)
				reduceExpression(operators, operands);

			// parse arguments
			tokenizer.match(TParenOpen, true);
			operands.push(parseList());
			tokenizer.match(TParenClose, true);
			
			// designate call operator, or that 'new' has args
			if (operators.length == 0 || operators[operators.length - 1] != TokenType.NEW)
			{
				operators.push(TokenType.CALL);
			}
			else if (operators[operators.length - 1] == TokenType.NEW)
			{
				operators.pop();
				operators.push(TokenType.NEW_WITH_ARGS);
			}
//[TODO] completely reduce here?
			// reduce now because CALL/NEW has no precedence
			reduceExpression(operators, operands);

			// operand already found; find next operator
			return scanOperator(operators, operands, stopAt);

		    // no operator found
		    default:
			return false;
		}

		// operator matched
		return true;
	}

//[TODO] integrate some of this into other functions?
	private function reduceExpression(operatorList:Array<Dynamic>, operandList:Array<Dynamic>):Void {
		// extract operator and operands
		var operator:TokenType = operatorList.pop();
		var operands:Array<Dynamic> = operandList.splice(operandList.length - operator.arity, operator.arity);
		
		// convert expression to statements
		switch (operator) {
		    // object instantiation
		    case TokenType.NEW, TokenType.NEW_WITH_ARGS:
			operandList.push(SObjectInstantiation(operands[0], operands[1]));
		    
		    // function call
		    case TokenType.CALL:
			operandList.push(SCall(operands[0], operands[1]));
		
		    // casting
		    case TokenType.CAST:
			operandList.push(SCast(operands[0], operands[1]));
			
		    // property operator
		    case TokenType.INDEX, TokenType.DOT:
			operandList.push(SReference(operands[1], operands[0]));

		    // unary operators
		    case TokenType.NOT, TokenType.BITWISE_NOT, TokenType.UNARY_PLUS, TokenType.UNARY_MINUS:
			operandList.push(SOperation(operator.value, operands[0]));
		    case TokenType.INCREMENT, TokenType.DECREMENT:
			operandList.push(SAssignment(operator.value, operands[0]));

		    // binary operators
		    case TokenType.OR, TokenType.AND, TokenType.BITWISE_OR, TokenType.BITWISE_XOR,
		        TokenType.BITWISE_AND, TokenType.EQ, TokenType.NE, TokenType.STRICT_EQ,
			TokenType.STRICT_NE, TokenType.LT, TokenType.LE, TokenType.GE,
			TokenType.GT, TokenType.INSTANCEOF, TokenType.LSH, TokenType.RSH,
			TokenType.URSH, TokenType.PLUS, TokenType.MINUS, TokenType.MUL,
			TokenType.DIV, TokenType.MOD:
			operandList.push(SOperation(operator.value, operands[0], operands[1]));
		    case TokenType.ASSIGN, TokenType.ASSIGN_BITWISE_OR, TokenType.ASSIGN_BITWISE_XOR,
		        TokenType.ASSIGN_BITWISE_AND, TokenType.ASSIGN_LSH, TokenType.ASSIGN_RSH,
			TokenType.ASSIGN_URSH, TokenType.ASSIGN_PLUS, TokenType.ASSIGN_MINUS,
			TokenType.ASSIGN_MUL, TokenType.ASSIGN_DIV, TokenType.ASSIGN_MOD:
			operandList.push(SAssignment(operator.value, operands[0], operands[1]));
		
		    default:
			throw 'Unknown operator "' + operator + '"';
		}
	}
	
	private static var IS_ASSIGNMENT_OPERATOR:EReg = ~/^(\||\^|&|<<|>>>?|\+|\-|\*|\/|%)?=$/;
	
	private function isAssignmentOperator(operator:String):Bool {
		return IS_ASSIGNMENT_OPERATOR.match(operator);
	}

	private function lookupOperator(operator:String, scanOperand:Bool = false):Operator {
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
		    case '===': return OpStrictEqual;
		    case '!==': return OpStrictUnequal;
		    case '<': return OpLessThan;
		    case '<=': return OpLessThanOrEqual;
		    case '>': return OpGreaterThan;
		    case '>=': return OpGreaterThanOrEqual;
		    case 'in': return OpIn;
		    case 'instanceof': return OpInstanceOf;
		    case '<<', '<<=': return OpLeftShift;
		    case '>>', '>>=': return OpRightShift;
		    case '>>>', '>>>=': return OpZeroRightShift;
		    case '+', '+=': return scanOperand ? OpUnaryPlus : return OpPlus;
		    case '-', '-=': return scanOperand ? OpUnaryMinus : return OpMinus;
		    case '*', '*=': return OpMultiply;
		    case '/', '/=': return OpDivide;
		    case '%', '%=': return OpModulus;
		    default: throw 'Unknown operator "' + operator + '"';
		}
	}
}