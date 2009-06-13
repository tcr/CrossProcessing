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
				var condition:Expression = parseExpression();
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

			    // while statement
			    case 'while':
				// match opening 'while'
				tokenizer.get();

				// match condition
				tokenizer.match(TParenOpen, true);
				var condition:Expression = parseExpression();
				tokenizer.match(TSemicolon, true);
				
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
				
				// add loop
				statements.push(SLoop(condition, body));

			    // for statement
			    case 'for':
				// match opening 'for' and '('
				tokenizer.get();
				tokenizer.match(TParenOpen, true);

				// variable definition/initialization
				if (!parseDefinition(PBlock, statements, definitions))
				{
					// match expression initialization
					var init:Array<Expression> = parseList();
					for (statement in init)
						statements.push(SExpression(statement));
					tokenizer.match(TSemicolon, true);
				}
				// match condition
				var condition:Expression = parseExpression();
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
					throw new TokenizerSyntaxError('Invalid expression in for loop.', tokenizer);
				// append update to body
				for (statement in update)
					body.push(SExpression(statement));
				
				// add loop
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
//[TODO] is this right?
				// match expression or semicolon
				var expression:Expression = parseExpression();
				if (expression == null)
					return tokenizer.match(TSemicolon);
				tokenizer.match(TSemicolon, true);
				
				// push expression
				statements.push(SExpression(expression));
			}
		
		    // expression
		    default:
			// match expression or semicolon
			var expression:Expression = parseExpression();
			if (expression == null)
				return tokenizer.match(TSemicolon);
			tokenizer.match(TSemicolon, true);
			
			// push expression
			statements.push(SExpression(expression));
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
			if (tokenizer.peekMatch(TKeyword('private'), peek) || tokenizer.peekMatch(TKeyword('public'), peek))
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
				var expression:Expression = parseExpression();
				if (expression == null)
					throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
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
	
	private function parseList():Array<Expression>
	{
		// parse a comma-delimited list of expressions (array initializer, function call, &c.)
		var list:Array<Expression> = [], expression:Expression;
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
	private function parseExpression():Expression
	{
		// variable definitions
		var operators:Array<ParserOperator> = [], operands:Array<Expression> = [];
	
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

	private function scanOperand(operators:Array<ParserOperator>, operands:Array<Expression>, ?required:Bool = false):Bool
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
					throw new TokenizerSyntaxError('Invalid operator.', tokenizer);
				}
			}

		    // explicit cast (Processing-specific)
		    case TType(value):
			// push cast
			var type:VariableType = parseType();
			operators.push(PCast(type));
			
			// push cast operand
			tokenizer.match(TParenOpen, true);
			var expression:Expression = parseExpression();
			if (expression == null)
				throw new TokenizerSyntaxError('Invalid expression in cast.', tokenizer);
			tokenizer.match(TParenClose, true);
			operands.push(expression);

		    // identifier
		    case TIdentifier(value):
			// push reference
			tokenizer.get();
			operands.push(EReference(value));

		    // keywords
		    case TKeyword(keyword):
			switch (keyword) {
			    // literals
			    case 'this': tokenizer.get(); operands.push(EThisReference);
			    case 'null': tokenizer.get(); operands.push(ELiteral(null));
			    case 'true': tokenizer.get(); operands.push(ELiteral(true));
			    case 'false': tokenizer.get(); operands.push(ELiteral(false));

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
					var sizes:Array<Expression> = [];
					while (tokenizer.match(TBracketOpen))
					{
						var expression:Expression = parseExpression();
						if (expression == null)
							throw new TokenizerSyntaxError('Invalid array dimension.', tokenizer);
						sizes.push(expression);
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
					var reference:String = Type.enumParameters(tokenizer.currentToken)[0];
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
					throw new TokenizerSyntaxError('Missing operand', tokenizer);
				return false;
			}
			
		    // literals
//[TODO] simplify?
		    case TString(value):
			tokenizer.get();
			operands.push(ELiteral(value));
		    case TInteger(value):
			tokenizer.get();
			operands.push(ELiteral(value));
		    case TFloat(value):
			tokenizer.get();
			operands.push(ELiteral(value));
		    case TChar(value):
			tokenizer.get();
			operands.push(ELiteral(value));

		    // array literal
		    case TBraceOpen:
			tokenizer.get();
			operands.push(EArrayLiteral(parseList()));
			tokenizer.match(TBraceClose, true);
		
		    // cast/group
		    case TParenOpen:
			// knock off token
			tokenizer.get();
			
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
			var expression:Expression = parseExpression();
			if (expression == null)
				throw new TokenizerSyntaxError('Invalid parenthetical expression.', tokenizer);
			operands.push(expression);
			if (!tokenizer.match(TParenClose))
				throw new TokenizerSyntaxError('Missing ) in parenthetical', tokenizer);

		    // missing operand
		    default:
			if (required)
				throw new TokenizerSyntaxError('Missing operand', tokenizer);
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
			tokenizer.get();
			
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
					throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
				// get value
				var value:Expression = parseExpression();
				if (value == null)
					throw new TokenizerSyntaxError('Invalid assignment right-hand side.', tokenizer);
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
			tokenizer.get();
			
			// match and push required identifier as string
			tokenizer.match('TIdentifier', true);
			// reduce and push operator
			var operator:ParserOperator = PDot(Type.enumParameters(tokenizer.currentToken)[0]);
			recursiveReduceExpression(operators, operands, lookupOperatorPrecedence(operator));
			operators.push(operator);

			// matched operand, find next operator
			return scanOperator(operators, operands, required);

		    // array access
		    case TBracketOpen:
			// match index
			tokenizer.match(TBracketOpen, true);
			var index:Expression = parseExpression();
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
		    case TQuestion:
			// knock off token
			tokenizer.get();
			
			// reduce left-hand conditional
			recursiveReduceExpression(operators, operands);
			var conditional:Expression = operands.pop();
			// parse statements
			var thenExpression:Expression = parseExpression();
			tokenizer.match(TDoubleDot, true);
			var elseExpression:Expression = parseExpression();
			
			// validate expressions
			if ((thenExpression == null) || (elseExpression == null))
				throw new TokenizerSyntaxError('Invalid expression in ternary conditional.', tokenizer);
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
				throw new TokenizerSyntaxError('Missing operator', tokenizer);
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
			
/*		    case PAssignment(operator):
			// get assignment
		        var value:Expression = operands.pop(), reference:Expression = operands.pop();
			// we can only assign to a reference
			if ((Type.enumConstructor(reference) != 'EReference') &&
			    (Type.enumConstructor(reference) != 'EArrayAccess'))
				throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
			// compound assignment operations
			if (operator != null)
				value = EOperation(operator, reference, value);
			operands.push(EAssignment(reference, value));*/
	    
		    case PCast(type):
			// expression cast
			var expression:Expression = operands.pop();
			operands.push(ECast(type, expression));
		    
		    case PPrefix(type):
			// get reference
		        var reference:Expression = operands.pop();
			// we can only assign to a reference
			if (Type.enumConstructor(reference) != 'EReference')
				throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
			// compound prefix operation
			operands.push(EPrefix(reference, type));
		    
		    case PPostfix(type):
			// get reference
		        var reference:Expression = operands.pop();
			// we can only assign to a reference
			if (Type.enumConstructor(reference) != 'EReference')
				throw new TokenizerSyntaxError('Invalid assignment left-hand side.', tokenizer);
				
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
//		    case PAssignment(_): 1;
//		    case PNew: 13;
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
//	PAssignment(?operator:Operator);
//	PNew;
	PCast(type:VariableType);
	PPrefix(type:IncrementType);
	PPostfix(type:IncrementType);
	PDot(identifier:String);
	PArrayAccess(index:Expression);
	PCall(args:Array<Expression>);
}