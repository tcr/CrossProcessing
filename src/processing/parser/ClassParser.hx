/**
 * ...
 * @author ...
 */

package processing.parser;

class ClassParser 
{
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
		definitions.push(DFunction(identifier, visibility, isStatic, fType, params, fDefinitions, fStatements));
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
		definitions.push(DClass(identifier, visibility, isStatic, cDefinitions, cStatements));
		return true;
	}
}

enum ParserScope
{
	PScript;
	PClass(identifier:String);
	PBlock;
}