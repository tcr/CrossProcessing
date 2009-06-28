/**
 * ...
 * @author ...
 */

package processing.parser;

class ExpressionParser extends Parser
{
	private var operators:Array<ParserOperator>;
	private var operands:Array<Expression>;
	
	private function parseExpression(?required:Bool = false):Expression
	{
		// initialize arrays
		operators = [];
		operands = [];
	
		// main loop
		scanOperand();
		if (operands.length == 0)
			if (required)
				throw tokenizer.createSyntaxError('Expected expression.');
			else
				return null;
		while (scanOperator())
			scanOperand(true);
			
		// reduce to a single operand
		recursiveReduceExpression();
		return operands[0];
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

	private function scanOperand(?required:Bool = false):Bool
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
				recursiveReduceExpression(lookupOperatorPrecedence(operator));
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
					recursiveReduceExpression(lookupOperatorPrecedence(operator));
					operators.push(operator);
					
					// matched operator, find next operand
					return scanOperand(operators, operands, required);
				
				    default:
				        if (required)
						throw tokenizer.createSyntaxError('Invalid unary operator.');
					return false;
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
			    case 'null': tokenizer.next(); operands.push(ENull);
			    case 'true': tokenizer.next(); operands.push(EBooleanLiteral(true));
			    case 'false': tokenizer.next(); operands.push(EBooleanLiteral(false));

			    // unary operators
			    case 'new':
				// knock off token
				tokenizer.next();
				
				// array instantiation
//[TODO] match "new (Array)()"-style syntax!
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
		    case TString(value):
			tokenizer.next();
			operands.push(EStringLiteral(value));
			
		    case TInteger(value):
			tokenizer.next();
			operands.push(EIntegerLiteral(value));
			
		    case TFloat(value):
			tokenizer.next();
			operands.push(EFloatLiteral(value));
			
		    case TChar(value):
			tokenizer.next();
			operands.push(ECharLiteral(value));

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

	private function scanOperator(?required:Bool = false):Bool
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
				recursiveReduceExpression(lookupOperatorPrecedence(operator));
				operators.push(operator);
				
				// matched operand, find next operator
				return scanOperator(operators, operands, required);
			}
			// assignment operators
			else if (isAssignmentOperator(opToken))
			{
				// reduce left-hand expression
				recursiveReduceExpression();
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
				recursiveReduceExpression(lookupOperatorPrecedence(operator));
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
			recursiveReduceExpression(lookupOperatorPrecedence(operator));
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
			recursiveReduceExpression(lookupOperatorPrecedence(operator));
			operators.push(operator);

			// matched operand, find next operator
			return scanOperator(required);
			
		    // hook/colon operator
		    case TQuestion:
			// knock off token
			tokenizer.next();
			
			// reduce left-hand conditional
			recursiveReduceExpression();
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
			recursiveReduceExpression(lookupOperatorPrecedence(operator));
			// function or method call
			if (Type.enumConstructor(operands[operands.length - 1]) == 'EReference')
			{
				switch (operands.pop()) {
				    case EReference(identifier, base):
				        operands.push(ECallMethod(identifier, base, args));
				    default:
				}
			}
			else
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
	
	private function recursiveReduceExpression(?precedence:Int = 0):Void
	{
		while (operators.length > 0 && lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence)
			reduceExpression();
	}

	private function reduceExpression():Void
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
			if ((Type.enumConstructor(reference) != 'EReference') &&
			    (Type.enumConstructor(reference) != 'EArrayAccess'))
				throw tokenizer.createSyntaxError('Invalid assignment left-hand side.');
				
			// compound prefix operation
			operands.push(EPrefix(reference, type));
		    
		    case PPostfix(type):
			// get reference
		        var reference:Expression = operands.pop();
			// we can only assign to a reference
			if ((Type.enumConstructor(reference) != 'EReference') &&
			    (Type.enumConstructor(reference) != 'EArrayAccess'))
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
	
	private static var IS_ASSIGNMENT_OPERATOR = new SimpleEReg("^(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=$","");
	
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

enum ParserOperator
{
	POperator(operator:Operator);
	PCast(type:VariableType);
	PPrefix(type:IncrementType);
	
	// highest precedence (could be eliminated)
	PPostfix(type:IncrementType);
	PDot(identifier:String);
	PArrayAccess(index:Expression);
	PCall(args:Array<Expression>);
}