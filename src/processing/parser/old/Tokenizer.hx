package processing.parser;

//[TODO] might want to take cues from a real Tokenizer class....
class Tokenizer {
	public var source(default, null):String;
	public var cursor(default, null):Int;
	public var done(isDone, null):Bool;
	public var line(getCurrentLineNumber, null):Int;
	public var scanOperand:Bool;
	
	public function new():Void
	{
		load('');
	}
	
//[TODO] argument to start tokenizing /from line/?
	public function load(s:String)
	{
		// load source and reset location
		source = s;
		cursor = 0;
		scanOperand = true;
	}
	
	// static regexes
	public static var regexes = TokenizerRegexList;
	
	public function peek(lookAhead:Int = 1, onSameLine:Bool = false):Token
	{
		// init variables
		var peekCursor:Int = cursor, token:Token = null, input:String = '', regex:EReg;
		while (lookAhead-- > 0) {
			// eliminate comments/whitespace
			while (true)
			{
				// get input
				input = source.substr(peekCursor);
				if ((regex = onSameLine ? regexes.WHITESPACE_SAME_LINE : regexes.WHITESPACE).match(input) ||
				    (regex = regexes.COMMENT).match(input))
					peekCursor += regex.matched(0).length;
				else
					break;
			}
						
			// find next token
			if ((regex = regexes.EOF).match(input))
			{
				// end
				token = new Token(TokenType.END);
			}
			else if ((regex = regexes.COLOR).match(input))
			{
				// color
				token = new Token(TokenType.NUMBER, Std.parseInt('0x' + regex.matched(1)) + (regex.matched(1).length == 6 ? 0xFF000000 : 0));
			}
			else if ((regex = regexes.FLOAT).match(input))
			{
				// float
				token = new Token(TokenType.NUMBER, Std.parseFloat(regex.matched(0)));
			}
			else if ((regex = regexes.INTEGER).match(input))
			{
				// integer
				token = new Token(TokenType.NUMBER, Std.parseInt(regex.matched(0)));
			}
			else if ((regex = regexes.KEYWORD).match(input))
			{
				// type
				if (TokenType.TYPES.exists(regex.matched(0)))
					token = new Token(TokenType.TYPE, TokenType.TYPES.get(regex.matched(0)));
				// keyword
				else if (TokenType.KEYWORDS.exists(regex.matched(0)))
					token = new Token(TokenType.KEYWORDS.get(regex.matched(0)), TokenType.KEYWORDS.get(regex.matched(0)).value);
					
				// identifier
				else
					token = new Token(TokenType.IDENTIFIER, regex.matched(0));
			}
			else if ((regex = regexes.ARRAY_DIMENSIONS).match(input))
			{
				// array dimensions
				token = new Token(TokenType.ARRAY_DIMENSION, regex.matched(0).length / 2);
			}
			else if ((regex = regexes.CHAR).match(input))
			{
				// char
				token = new Token(TokenType.CHAR, parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 1)).charCodeAt(0));
			}
			else if ((regex = regexes.STRING).match(input))
			{
				// string
				token = new Token(TokenType.STRING, parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 1)));
			}
			else if ((regex = regexes.ASSIGN_OPERATOR).match(input))
			{
				// assignment operator
				var op:String = regex.matched(1);
				token = new Token(TokenType.ASSIGNMENT_OPS.get(op), op);
			}
			else if ((regex = regexes.OPERATOR).match(input))
			{
				// operator
				var op:String = regex.matched(1);
				token = new Token(TokenType.OPS.get(op), op);
				if (scanOperand) {
					if (token.type == TokenType.PLUS)
						token.type = TokenType.UNARY_PLUS;
					if (token.type == TokenType.MINUS)
						token.type = TokenType.UNARY_MINUS;
				}
			}
			else
			{
				throw new TokenizerSyntaxError('Illegal token ' + input, this);
			}
	
			// set token properties
			token.content = regex.matched(0);
			token.start = peekCursor;
			token.line = getLineNumber(peekCursor);
			
			// move cursor
			peekCursor += token.content.length;
		}
		
		return token;
	}
	
	private function parseStringLiteral(str:String):String {
		str = regexes.CHAR_BACKSPACE.replace(str, '$1\x08');
		str = regexes.CHAR_TAB.replace(str, '$1\x09');
		str = regexes.CHAR_NEWLINE.replace(str, '$1\x0A');
		str = regexes.CHAR_VERTICAL_TAB.replace(str, '$1\x0B');
		str = regexes.CHAR_FORM_FEED.replace(str, '$1\x0C');
		str = regexes.CHAR_CARRIAGE_RETURN.replace(str, '$1\x0D');
		str = regexes.CHAR_DOUBLE_QUOTE.replace(str, '$1"');
		str = regexes.CHAR_SINGLE_QUOTE.replace(str, "$1'");
		str = regexes.CHAR_BACKSLASH.replace(str, '\\');
		str = regexes.CHAR_UNICODE.customReplace(str,
			function (regex:EReg):String {
				return regex.matchedLeft() + String.fromCharCode(Std.parseInt('0x' + regex.matched(1))) + regex.matchedRight();
			});
		return str;
	}
	
	public var currentToken(default, null):Token;

	public function get():Token {
		// get next token
		currentToken = peek();
		// move variables
		cursor = currentToken.start + currentToken.content.length;
		return currentToken;
	}
	
	public function match(matchType:TokenType, mustMatch:Bool = false):Bool {
		var doesMatch:Bool = (peek().type == matchType);
		if (doesMatch)
			get();
		else if (mustMatch)
			throw new TokenizerSyntaxError('Tokenizer: Must match ' + matchType.value + ', found ' + peek().type, this);
		return doesMatch;
	}
	
	private function isDone():Bool
	{
		return match(TokenType.END);
	}
	
	private function getCurrentLineNumber():Int
	{
		return getLineNumber(cursor);
	}
	
	private function getLineNumber(searchCursor:Int):Int
	{
		return regexes.NEWLINES.split(source.substr(0, searchCursor)).length + 1;
	}
}

class TokenizerRegexList
{
	// dead space
	public static var WHITESPACE:EReg = ~/^\s+/;
	public static var WHITESPACE_SAME_LINE:EReg = ~/^[ \t]+/;
	public static var COMMENT:EReg = ~/^\/(?:\*(?:.|\n|\r)*?\*\/|\/.*)/;
	public static var NEWLINES:EReg = ~/\n/g;
	
	// tokens
	public static var EOF:EReg = ~/^$/;
	public static var COLOR:EReg = ~/^(?:0[xX]|#)([\da-fA-F]{6}|[\da-fA-F]{8})/;
	public static var FLOAT:EReg = ~/^\d+(?:\.\d*)?[fF]|^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/;
	public static var INTEGER:EReg = ~/^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/;
	public static var KEYWORD:EReg = ~/^\w+/;
	public static var ARRAY_DIMENSIONS:EReg = ~/^(?:\[\]){1,}/;
	public static var CHAR:EReg = ~/^'(?:[^']|\\.|\\u[0-9A-Fa-f]{4})'/;
	public static var STRING:EReg = ~/^"(?:\\.|[^"])*"|^'(?:[^']|\\.)*'/;
	public static var ASSIGN_OPERATOR:EReg = ~/^(\||\^|&|<<|>>>?|\+|\-|\*|\/|%)?=(?!=)|^\+\+|^--/;
	public static var OPERATOR:EReg = ~/^(\n|\|\||&&|===?|!==?|<<|<=|>>>?|>=|\+\+|--|\[\]|[;,?:|^&<>+\-*\/%!~.[\]{}()])/;
	
	// characters
	public static var CHAR_BACKSPACE:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\b/g;
	public static var CHAR_TAB:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\t/g;
	public static var CHAR_NEWLINE:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\n/g;
	public static var CHAR_VERTICAL_TAB:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\v/g;
	public static var CHAR_FORM_FEED:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\f/g;
	public static var CHAR_CARRIAGE_RETURN:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\r/g;
	public static var CHAR_DOUBLE_QUOTE:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\"/g;
	public static var CHAR_SINGLE_QUOTE:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\'/g;
	public static var CHAR_BACKSLASH:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\\\/g;
	public static var CHAR_UNICODE:EReg = ~/((?:[^\\]|^)(?:\\\\)+)\\u([0-9A-Fa-z]{4})/g;
}