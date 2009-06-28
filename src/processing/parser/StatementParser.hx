/**
 * ...
 * @author ...
 */

package processing.parser;

class BlockParser extends ExpressionParser
{
	private var blocks:Array<Dynamic>;
	private var blockDefinitions:Hash < BlockDefinition >;
	private var blockStatements:Array<Statement>;
	
	private function pushBlock()
	{
		blockDefinitions = new Hash<BlockDefinition>();
		blockStatements = [];
		blocks.push( { definitions: blockDefinitions, statements: blockStatements.length } );
	}
	
	private function popBlock():Statement
	{
		blocks.pop();
		var block:Statement = SBlock(blockDefinitions, blockStatements);
		blockDefinitions = blocks.length > 0 ? blocks[blocks.length - 1].definitions : null;
		blockStatements = blocks.length > 0 ? blocks[blocks.length - 1].statements : null;
		return block;
	}
	
	private function pushDefinition(identifier:String, type:DataType)
	{
		blockDefinitions[blockDefinitions.length - 1].push(DVariable(identifier, type));
	}
	
	private function pushStatement(statement:Statement)
	{
		blockStatements[blockStatements.length - 1]).push(statement);
	}
	
	private function parseBlock(?required:Bool = false):Statement
	{
		// match opening
		if (required)
			tokenizer.require(TBraceOpen);
		else if (!tokenizer.match(TBraceOpen))
			return null;
		// parse block
		pushBlock();
		while (scanStatement(false))
			continue;
		// match closing
		tokenizer.require(TBraceClose);
		
		// return block statement
		return popBlock();
	}

	private function scanStatement(?required:Bool = false):Bool
	{
		// variable definitions
		if (parseDefinition(PBlock, statements, definitions))
			return true;
		// block
		var statement:Statement;
		if ((statement = parseBlock(false)) != null)
		{
			blockStatements.push(statement);
			return true;
		}
		
		// if 
		if (tokenizer.match(TKeyword('if')))
		{
			// condition
			tokenizer.require(TParenOpen);
			var condition:Expression = parseExpression(true);
			tokenizer.require(TParenClose);
			// then block
			var thenBlock:Statement = parseStatement(true);
			// else block
			var elseBlock:Statement = null;
			if (tokenizer.match(TKeyword('else')))
				elseBlock = parseStatement(true);
			
			// add conditional
			blockStatements.push(SConditional(condition, thenBlock, elseBlock));
		}
		// while 
		else if (tokenizer.match(TKeyword('while')))
		{
			// condition
			tokenizer.require(TParenOpen);
			var condition:Expression = parseExpression(true);
			tokenizer.require(TParenClose);
			// body
			var body:Statement = parseStatement(true);
			
			// add loop
			blockStatements.push(SLoop(condition, body));
		}
		// for
		else if (tokenizer.match(TKeyword('for')))
		{
			// initialization takes place in its own block
			pushBlock();
			// variable definition/initialization
			tokenizer.match(TParenOpen, true);
			if (!parseVariableDefinition())
			{
				// match expression initialization
				var init:Array<Expression> = parseList();
				for (statement in init)
					statements.push(SExpression(statement));
				tokenizer.match(TSemicolon, true);
			}
			
			// condition (null expression evaluates as true)
			var condition:Expression = parseExpression(false);
			if (condition == null)
				condition = EBooleanLiteral(true);
			tokenizer.match(TSemicolon, true);
			// update
			var update:Array<Expression> = parseList();
			tokenizer.match(TParenClose, true);
			// body
			var body:Statement = parseStatement(true);
			
			// add loop
			blockStatements.push(SLoop(condition, body));
			// append update to body
			for (statement in update)
				blockStatements.push(SExpression(statement));			
			// add loop block
			blockStatements.push(popBlock());
		}
		// return
		else if (tokenizer.match(TKeyword('return')))
		{
			// push return statement
			blockStatements.push(SReturn(parseExpression(false)));
		}
		// break
		else if (tokenizer.match(TKeyword('break')))
		{
			// match break and optional level
			tokenizer.match('TIdentifier') ?
			    blockStatements.push(SBreak(Type.enumParameters(tokenizer.current())[0])) :
			    blockStatements.push(SBreak());
		}
		// continue
		else if (tokenizer.match(TKeyword('continue')))
		{
			// match continue and optional level
			tokenizer.match('TIdentifier') ?
			    blockStatements.push(SContinue(Type.enumParameters(tokenizer.current())[0])) :
			    blockStatements.push(SContinue());
		}
//[TODO] switch, try/catch/finally, do loop, 
		// expression/no statement
		else
		{
			// match expression or semicolon
			var expression:Expression = parseExpression(false);
			if (expression == null)
				return tokenizer.match(TSemicolon);
			tokenizer.require(TSemicolon);
			
			// push expression
			blockStatements.push(SExpression(expression));
		}

		// statement matched
		return true;
	}
	
	private function parseVariableDefinition(?required:Bool = false):Bool
	{
		// get data type
		var vType:DataType = parseType(required);
		
		// lookahead to ensure this isn't an expression
		tokenizer.pushState();
		if (required)
			tokenizer.require('TIdentifier');
		else if (!tokenizer.match('TIdentifier'))
		{
			tokenizer.popState();
			return false;
		}
		tokenizer.popState();
		
		// get variable definitions
		do {
			// get identifier
			tokenizer.require('TIdentifier');
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
				blockStatements.push(SExpression(EAssignment(EReference(identifier), expression)));
			}
		} while (tokenizer.match(TComma));
		
		// closing semicolon
		tokenizer.match(TSemicolon, true);

		// definition matched
		return true;
	}
}