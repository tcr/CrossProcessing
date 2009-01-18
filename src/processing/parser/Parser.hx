package processing.parser;

import processing.parser.Statement;

class Parser {
	public var tokenizer:Tokenizer;
//[TODO] no parser contexts; but maybe add a Block.definitions array?
//		public var context:ParserContext;

	public function new() {
		// create tokenizer
		tokenizer = new Tokenizer();
	}
	
	public function parse(code:String):Statement {
		// initialize tokenizer
		tokenizer.load(code);
		
		// parse script
		var script:Statement = parseBlock();
		if (!tokenizer.done)
			throw new TokenizerSyntaxError('Syntax error', tokenizer);
		return script;
	}
	
	private function parseBlock(stopAt:TokenType = null):Statement {
		// parse code block
		var block:Array<Statement> = new Array();
//[TODO] right_curly should be a stopAt
		while (!tokenizer.done && (stopAt == null || !tokenizer.peek().match(stopAt)))
			block.push(parseStatement());
		return SBlock(block);
	}

//[TODO] could parseStatement be made to only match certain "types"?
	private function parseStatement():Statement {
		// parse current statement line
		var block:Array<Statement> = new Array();

		// peek to see what kind of statement this is
		var token:Token = tokenizer.peek();
		switch (token.type)
		{				
		    // if block
		    case TokenType.IF:
			var condition:Statement, thenBlock:Statement, elseBlock:Statement = null;
			
			// get condition
			tokenizer.get();
			tokenizer.match(TokenType.LEFT_PAREN, true);
			condition = parseExpression();
			tokenizer.match(TokenType.RIGHT_PAREN, true);
			// get then block
			if (tokenizer.match(TokenType.LEFT_CURLY)) {
				thenBlock = parseBlock(TokenType.RIGHT_CURLY);
				tokenizer.match(TokenType.RIGHT_CURLY, true);
			} else {
				thenBlock = parseStatement();
			}
			// get else block
			if (tokenizer.match(TokenType.ELSE)) {
				if (tokenizer.match(TokenType.LEFT_CURLY)) {
					elseBlock = parseBlock(TokenType.RIGHT_CURLY);
					tokenizer.match(TokenType.RIGHT_CURLY, true);
				} else {
					elseBlock = parseStatement();
				}
			}
			
			// push conditional
			block.push(SConditional(condition, thenBlock, elseBlock));
			return SBlock(block);
			
		    // while statement
		    case TokenType.WHILE:
			// match opening 'for' and '('
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
			block.push(SLoop(condition, body));
			return SBlock(block);

		    // for statement
		    case TokenType.FOR:
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
			var condition:Statement = parseExpression(TokenType.SEMICOLON);
			tokenizer.match(TokenType.SEMICOLON, true);
			// match update
			var update:Statement = parseExpression(TokenType.RIGHT_PAREN);
			tokenizer.match(TokenType.RIGHT_PAREN, true);
			// parse body
			var body:Array<Statement> = new Array();
			if (tokenizer.match(TokenType.LEFT_CURLY)) {
				body.push(parseBlock(TokenType.RIGHT_CURLY));
				tokenizer.match(TokenType.RIGHT_CURLY, true);
			} else {
				body.push(parseStatement());
			}
			
			// append loop body
			if (update != null)
				body.push(update);
			// push for loop
			block.push(SLoop(condition, SBlock(body)));
			return SBlock(block);
		
		    // returns
		    case TokenType.RETURN:
			tokenizer.get();
			// push return statement
			block.push(SReturn(parseExpression()));
		
		    // break
		    case TokenType.BREAK:
			tokenizer.get();			
			// match break and optional level
			block.push(SBreak(tokenizer.match(TokenType.NUMBER) ?
			    tokenizer.currentToken.value : 1));
			
		    // continue
		    case TokenType.CONTINUE:
			tokenizer.get();			
			// match continue and optional level
			block.push(SContinue(tokenizer.match(TokenType.NUMBER) ?
			    tokenizer.currentToken.value : 1));
			
		    // definition visibility
		    case TokenType.STATIC, TokenType.PUBLIC, TokenType.PRIVATE:
//[TODO] what happens when "private" declared in main block? "static"?
			// get definition
			tokenizer.get();
			block.push(tokenizer.peek().match(TokenType.CLASS) ? parseClass() : parseFunction());
			return SBlock(block);
			
		    case TokenType.CLASS:
			// get class definition
			block.push(parseClass());
			return SBlock(block);
		
		    // definitions
		    case TokenType.TYPE, TokenType.IDENTIFIER:
			// resolve ambiguous identifier
			var isArray:Bool = tokenizer.peek(2).match(TokenType.ARRAY_DIMENSION);
			if (tokenizer.peek(isArray ? 3 : 2).match(TokenType.IDENTIFIER)) {
				// get parsed function
				if (tokenizer.peek(isArray ? 4 : 3).match(TokenType.LEFT_PAREN))
				{
					var block:Array<Statement> = new Array();
					block.push(parseFunction());
					return SBlock(block);
				}
					
				// else, get variable list
				block.push(parseVariables());
			}
			else
			{
				// expression
				block.push(parseExpression(TokenType.SEMICOLON));
			}
		
		    // expression
		    default:
			block.push(parseExpression(TokenType.SEMICOLON));
		}

		// match terminating semicolon
		if (!tokenizer.match(TokenType.SEMICOLON))
			throw new TokenizerSyntaxError('Missing ; after statement', tokenizer);
		// return parsed statement
		return SBlock(block);
	}
	
	private function parseType():VariableType {
		// try and match a type declaration
		if (!tokenizer.match(TokenType.TYPE) && !tokenizer.match(TokenType.IDENTIFIER))
			return null;
			
		// return type declaration
		var type = tokenizer.currentToken.value;
		var dimensions:Int = tokenizer.match(TokenType.ARRAY_DIMENSION) ? tokenizer.currentToken.value : 0;
		return {type: type, dimensions: dimensions};
	}
	
	private function parseFunction():Statement {
		// get function type (if not constructor)
		var funcType:VariableType = null;
		if (!tokenizer.peek(2).match(TokenType.LEFT_PAREN))
			funcType = parseType();
		// get function name
		tokenizer.match(TokenType.IDENTIFIER, true);
		var funcName:String = tokenizer.currentToken.value;
		
		// parse parameters
		tokenizer.match(TokenType.LEFT_PAREN, true);
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
		tokenizer.match(TokenType.RIGHT_PAREN, true);
		
		// parse body
		tokenizer.match(TokenType.LEFT_CURLY, true);
		var body:Statement = parseBlock(TokenType.RIGHT_CURLY);
		tokenizer.match(TokenType.RIGHT_CURLY, true);
		
		// return function declaration statement
		return SFunctionDefinition(funcName, funcType, params, body);
	}
	
	private function parseClass():Statement
	{
		// get class name
		tokenizer.match(TokenType.CLASS, true);
		tokenizer.match(TokenType.IDENTIFIER, true);
		var className:String = tokenizer.currentToken.value;
		
		// initialize statements
		var constructor:Array<Statement> = new Array();
		var publicBody:Array<Statement> = new Array();
		var privateBody:Array<Statement> = new Array();
		// parse body
		tokenizer.match(TokenType.LEFT_CURLY, true);
		while (!tokenizer.peek().match(TokenType.RIGHT_CURLY))
		{
			// get visibility (default public)
			var block:Array<Statement> = publicBody;
			tokenizer.match(TokenType.PUBLIC);
			if (tokenizer.match(TokenType.PRIVATE))
				block = privateBody;

			// get next token
			var token:Token = tokenizer.peek();
			switch (token.type)
			{
			    // variable or function
			    case TokenType.IDENTIFIER:
				// check for constructor
				if (token.value == className && tokenizer.peek(2).match(TokenType.LEFT_PAREN))
				{
					// get type-less constructors
					constructor.push(parseFunction());
					break;
				}
				// class type; fall-through
				
			    case TokenType.TYPE:
				if (tokenizer.peek(2).match(TokenType.IDENTIFIER) ||
				    tokenizer.peek(2).match(TokenType.ARRAY_DIMENSION))
				{
					// parse definition
					block.push(parseStatement());
					break;
				}
				// invalid definition; fall-through
			    
			    default:
				throw new TokenizerSyntaxError('Invalid initializer in class "' + className + '"', tokenizer);
			}
		}
		tokenizer.match(TokenType.RIGHT_CURLY, true);
		
		// return function declaration statement
		return SClassDefinition(className, SBlock(constructor), SBlock(publicBody), SBlock(privateBody));
	}
	
	private function parseVariables():Statement
	{
		// get main variable type
		var declarationType:VariableType = parseType();
		// get variable list
		var block:Array<Statement> = new Array();
		do {
			// add definitions
			tokenizer.match(TokenType.IDENTIFIER, true);
			var varName:String = tokenizer.currentToken.value;
			// check for per-variable array brackets
			var varDimensions:Int = tokenizer.match(TokenType.ARRAY_DIMENSION) ?
			    tokenizer.currentToken.value : declarationType.dimensions;
			// add definition
			block.push(SVariableDefinition(varName, {type: declarationType.type, dimensions: varDimensions}));
			
			// check for assignment operation
			if (tokenizer.match(TokenType.ASSIGN))
			{
				// get initializer statement
				block.push(SAssignment(AssignOp, SReference(SLiteral(varName)),
				    parseExpression(TokenType.COMMA)));
			}
		} while (tokenizer.match(TokenType.COMMA));
		
		// return variable definition
		return SBlock(block);
	}
	
//[TODO] remove stopAt token altogether
	private function parseList(stopAt:TokenType):Array<Statement>
	{
		// parse a list (array initializer, function call, &c.)
		var list:Array<Statement> = [];
		while (!tokenizer.peek().match(stopAt)) {
			// parse empty entries
			if (tokenizer.match(TokenType.COMMA)) {
				list.push(null);
				continue;
			}
			// parse arguments up to next comma
			list.push(parseExpression(TokenType.COMMA));
			if (!tokenizer.match(TokenType.COMMA))
				break;
		}
		return list;
	}
	
	private function parseExpression(?stopAt:TokenType):Statement
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

	private function scanOperand(operators:Array<Dynamic>, operands:Array<Dynamic>, ?stopAt:TokenType, ?required:Bool):Bool
	{
		// get next token
		tokenizer.scanOperand = true;
		var token:Token = tokenizer.peek();
		// stop if token matches stop parameter
		if (stopAt != null && token.match(stopAt))
			return false;

		// switch based on type
		switch (token.type)
		{			
		    // unary operators
		    case TokenType.INCREMENT, TokenType.DECREMENT,
//[TODO] which of these are used in processing?
		    TokenType.DELETE, TokenType.TYPEOF, TokenType.NOT, TokenType.BITWISE_NOT,
		    TokenType.UNARY_PLUS, TokenType.UNARY_MINUS, TokenType.NEW:					
			// add operator
			tokenizer.get();
			operators.push(token.type);
			
			// match operand
			return scanOperand(operators, operands, stopAt, true);
			
		    // casting/array initialization
		    case TokenType.TYPE, TokenType.IDENTIFIER:
			var isArray:Bool = tokenizer.peek(2).match(TokenType.ARRAY_DIMENSION);
			if (token.type == TokenType.TYPE &&
			    tokenizer.peek(isArray ? 3 : 2).match(TokenType.LEFT_PAREN))
			{
				// push casting operator
				operators.push(TokenType.CAST);
				// push operands
				operands.push(parseType());
				tokenizer.match(TokenType.LEFT_PAREN, true);
				operands.push(parseExpression(TokenType.RIGHT_PAREN));
				tokenizer.match(TokenType.RIGHT_PAREN, true);
			}
			else	// array initialization/references
			{
//[TODO] move this into NEW operator?
				// check for new operator
				if (operators[operators.length - 1] == TokenType.NEW &&
				    tokenizer.peek(2).match(TokenType.LEFT_BRACKET)) {
					// get type
					var type:VariableType = parseType();
					// match array dimensions
					var sizes:Array<Statement> = [];
					while (tokenizer.match(TokenType.LEFT_BRACKET))
					{
						sizes.push(parseExpression(TokenType.RIGHT_BRACKET));
						tokenizer.match(TokenType.RIGHT_BRACKET, true);
					}

					// create array initializer
					operators.pop();
					operands.push(SArrayInstantiation(type, sizes));
				} else if (!token.match(TokenType.IDENTIFIER)) {
					// invalid use of type keyword
					throw new TokenizerSyntaxError('Invalid type declaration', tokenizer);
				}
				else
				{
					// push reference
					tokenizer.get();
					operands.push(SReference(SLiteral(token.value)));
				}
			}
			
		    case TokenType.THIS:
			// push reference
			tokenizer.get();
			operands.push(SThisReference);

		    // operands
		    case TokenType.NULL, TokenType.TRUE, TokenType.FALSE, TokenType.NUMBER,
		    TokenType.STRING, TokenType.CHAR:
			// push literal
			tokenizer.get();
			operands.push(SLiteral(token.value));
			
		    // array literal
		    case TokenType.LEFT_CURLY:
			// push array literal
			tokenizer.get();
			operands.push(SArrayLiteral(parseList(TokenType.RIGHT_CURLY)));
			tokenizer.match(TokenType.RIGHT_CURLY, true);
		
		    // cast/group
		    case TokenType.LEFT_PAREN:
			tokenizer.get();

			// check if this be a cast or a group
			var isArray:Bool = tokenizer.peek(2).match(TokenType.ARRAY_DIMENSION);
			if ((tokenizer.peek().match(TokenType.TYPE) ||
			    (isArray && tokenizer.peek().match(TokenType.IDENTIFIER))) &&
			    tokenizer.peek(isArray ? 3 : 2).match(TokenType.RIGHT_PAREN))
			{
				// push casting operator
				operators.push(TokenType.CAST);
				// push operands
				operands.push(parseType());
				tokenizer.match(TokenType.RIGHT_PAREN, true);
				return scanOperand(operators, operands, stopAt, true);
			}
			else if (tokenizer.peek(2).match(TokenType.RIGHT_PAREN) && tokenizer.match(TokenType.IDENTIFIER))
			{
				// match ambiguous parenthetical
				var identifier:String = tokenizer.currentToken.value;
				tokenizer.match(TokenType.RIGHT_PAREN, true);
				
				// check if this be a cast
//[TODO] proper casting these arrays
				var tmpOperators:Array<Dynamic> = [], tmpOperands:Array<Dynamic> = [];
				if (scanOperand(tmpOperators, tmpOperands))
				{
					// add operators
					operators.push(TokenType.CAST);
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
				operands.push(parseExpression(TokenType.RIGHT_PAREN));
				if (!tokenizer.match(TokenType.RIGHT_PAREN))
					throw new TokenizerSyntaxError('Missing ) in parenthetical', tokenizer);
			}
			
		    default:
			// missing operand
			if (required)
				throw new TokenizerSyntaxError('Missing operand', tokenizer);
			else
				return false;
		}

		// matched operand
		return true;
	}

//[TODO] remove Dynamic here
	private function scanOperator(operators:Array<Dynamic>, operands:Array<Dynamic>, ?stopAt:TokenType):Bool {		
		// get next token
		tokenizer.scanOperand = false;
		var token:Token = tokenizer.peek();
		// stop if token matches stop parameter
		if (stopAt != null && token.match(stopAt))
			return false;

		// switch based on type
		switch (token.type) {				
		    // assignment
		    case TokenType.ASSIGN, TokenType.ASSIGN_BITWISE_OR, TokenType.ASSIGN_BITWISE_XOR,
		        TokenType.ASSIGN_BITWISE_AND, TokenType.ASSIGN_LSH, TokenType.ASSIGN_RSH,
			TokenType.ASSIGN_URSH, TokenType.ASSIGN_PLUS, TokenType.ASSIGN_MINUS,
			TokenType.ASSIGN_MUL, TokenType.ASSIGN_DIV, TokenType.ASSIGN_MOD:
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
		    case TokenType.INCREMENT, TokenType.DECREMENT:
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
			
		    // dot operator
		    case TokenType.DOT:			
			// combine any higher-precedence expressions
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence >= token.type.precedence)
				reduceExpression(operators, operands);
			
			// push operator
			operators.push(tokenizer.get().type);
			// match and push required identifier as string
			tokenizer.match(TokenType.IDENTIFIER, true);
			operands.push(SLiteral(tokenizer.currentToken.value));

			// operand already found; find next operator
			return scanOperator(operators, operands, stopAt);

		    // brackets
		    case TokenType.LEFT_BRACKET:
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
		
		    // operators
		    case TokenType.OR, TokenType.AND, TokenType.BITWISE_OR, TokenType.BITWISE_XOR,
		        TokenType.BITWISE_AND, TokenType.EQ, TokenType.NE, TokenType.STRICT_EQ,
			TokenType.STRICT_NE, TokenType.LT, TokenType.LE, TokenType.GE,
			TokenType.GT, TokenType.IN, TokenType.INSTANCEOF, TokenType.LSH, TokenType.RSH,
			TokenType.URSH, TokenType.PLUS, TokenType.MINUS, TokenType.MUL,
			TokenType.DIV, TokenType.MOD:
			// combine any higher-precedence expressions
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence >= token.type.precedence)
				reduceExpression(operators, operands);

			// push operator and scan for operand
			operators.push(tokenizer.get().type);
			
		    // hook/colon operator
		    case TokenType.HOOK:
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
		    case TokenType.LEFT_PAREN:
			// reduce until we get the current function (or lower operator precedence than 'new')
			while (operators.length > 0 &&
			    operators[operators.length - 1].precedence > TokenType.NEW.precedence)
				reduceExpression(operators, operands);

			// parse arguments
			tokenizer.match(TokenType.LEFT_PAREN, true);
			operands.push(parseList(TokenType.RIGHT_PAREN));
			tokenizer.match(TokenType.RIGHT_PAREN, true);
			
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
}