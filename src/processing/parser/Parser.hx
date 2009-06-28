package processing.parser;

import processing.parser.Syntax;
import processing.parser.Tokenizer;

class Parser
{
	public var tokenizer:Tokenizer;

	public function new() {
		// create tokenizer
		tokenizer = new Tokenizer();
	}
	
	public function parse(code:String):Definition
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
		return DScript(definitions, statements);
	}
}