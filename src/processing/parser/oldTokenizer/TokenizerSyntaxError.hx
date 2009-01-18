package processing.parser;

// standardized haXe error class?

class TokenizerSyntaxError {
	public var source:String;
	public var line:Int;
	public var cursor:Int;
	public var message:String;
	
	public function new(_message:String = '', tokenizer:Tokenizer) {
		source = tokenizer.source;
		line = tokenizer.line;
		cursor = tokenizer.cursor;
		message = _message;
	}
	
	public function toString():String
	{
		return message + '\nParsing error (line ' + line + ', char ' + cursor + ')';
	}
}