package processing.parser;

enum Token {
	TEof;
	TKeyword(keyword:String);
	TType(type:String);
	TIdentifier(identifier:String);
	TOperator(operator:String);
	TString(value:String);
	TInteger(value:Int);
	TFloat(value:Float);
	TChar(value:Int);
	TDimensions;
	TParenOpen;
	TParenClose;
	TBracketOpen;
	TBracketClose;
	TDot;
	TComma;
	TSemicolon;
	TBraceOpen;
	TBraceClose;
	TQuestion;
	TDoubleDot;
}

//[TODO] might want to take cues from a real Tokenizer class....
class Tokenizer {
	public var source(default, null):String;
	public var cursor(default, null):Int;
	public var done(isDone, null):Bool;
	public var line(getCurrentLineNumber, null):Int;
	public var currentToken(default, null):Token;
	
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
	}
	
	// static regexes
	public static var regexes = TokenizerRegexList;
	
	public function get():Token
	{
		// init variables
		var token:Token = null, regex:EReg, input:String = '';

		// eliminate comments/whitespace
		while (true)
		{
			// cache input and strip whitespace
			input = source.substr(cursor);
			if ((regex = regexes.WHITESPACE).match(input) ||
			    (regex = regexes.COMMENT).match(input))
				cursor += regex.matched(0).length;
			else
				break;
		}
					
		// find next token
		if ((regex = regexes.EOF).match(input))
		{
			// end
			token = TEof;
		}
		else if ((regex = regexes.OPERATOR).match(input))
		{
			// assignment operator
			token = TOperator(regex.matched(1));
		}
		else if ((regex = regexes.PUNCUATION).match(input))
		{
			// puncuation
			token = switch (regex.matched(0)) {
			    case '[]': TDimensions;
			    case '(': TParenOpen;
			    case ')': TParenClose;
			    case '[': TBracketOpen;
			    case ']': TBracketClose;
			    case '.': TDot;
			    case ',': TComma;
			    case ';': TSemicolon;
			    case '{': TBraceOpen;
			    case '}': TBraceClose;
			    case '?': TQuestion;
			    case ':': TDoubleDot;
			}
		}
		else if ((regex = regexes.COLOR).match(input))
		{
			// color
			token = TInteger(Std.parseInt('0x' + regex.matched(1)) + (regex.matched(1).length == 6 ? 0xFF000000 : 0));
		}
		else if ((regex = regexes.FLOAT).match(input))
		{
			// float
			token = TFloat(Std.parseFloat(regex.matched(0)));
		}
		else if ((regex = regexes.INTEGER).match(input))
		{
			// integer
			token = TInteger(Std.parseInt(regex.matched(0)));
		}
		else if ((regex = regexes.KEYWORD).match(input))
		{
			// keyword
			token = TKeyword(regex.matched(0));
		}
		else if ((regex = regexes.TYPE).match(input))
		{
			// keyword
			token = TType(regex.matched(0));
		}
		else if ((regex = regexes.IDENTIFIER).match(input))
		{
			// identifier
			token = TIdentifier(regex.matched(0));
		}
		else if ((regex = regexes.CHAR).match(input))
		{
			// char
			token = TChar(parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 1)).charCodeAt(0));
		}
		else if ((regex = regexes.STRING).match(input))
		{
			// string
			token = TString(parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 1)));
		}
		else 
		{
			throw new TokenizerSyntaxError('Illegal token ' + input, this);
		}
			
		// move cursor
		cursor += regex.matched(0).length;
		// return token		
		return token;
	}
	
	public function peek(lookAhead:Int = 1):Token {
		// peek ahead a certain distance (but retain Tokenizer state)
		var origCursor:Int = cursor, origToken:Token = currentToken, token:Token = null;
		for (i in 0...lookAhead)
			token = get();
		cursor = origCursor;
		currentToken = origToken;
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
	
	public function match(to:Dynamic, ?lookAhead:Int = 0, ?mustMatch:Bool = false):Bool {
		// peek to find a match
		var origCursor:Int = cursor, origToken:Token = currentToken, token:Token = get();
		for (i in 0...lookAhead)
			token = get();
		
		// check type of match
		if ((Std.is(to, Token) && Type.enumEq(token, to)) || (Std.is(to, String) && Type.enumConstructor(token) == to))
			return true;
		else if (mustMatch)
			throw new TokenizerSyntaxError('Tokenizer: Must match ' + to + ', found ' + token, this);
		
		// didn't match
		cursor = origCursor;
		currentToken = origToken;
		return false;
	}
	
	private function isDone():Bool
	{
		return match(TEof);
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
	public static var COMMENT:EReg = ~/^\/(?:\*(?:.|\n|\r)*?\*\/|\/.*)/;
	public static var NEWLINES:EReg = ~/\n/g;
	
	// tokens
	public static var EOF:EReg = ~/^$/;
	public static var COLOR:EReg = ~/^(?:0[xX]|#)([\da-fA-F]{6}|[\da-fA-F]{8})/;
	public static var FLOAT:EReg = ~/^\d+(?:\.\d*)?[fF]|^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/;
	public static var INTEGER:EReg = ~/^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/;
	public static var KEYWORD:EReg = ~/^(break|class|case|catch|const|continue|debugger|default|delete|do|else|enum|false|finally|for|function|new|null|public|private|return|static|switch|this|throw|true|try|typeof|var|while|with)\b/;
	public static var TYPE:EReg = ~/^(boolean|char|void|float|int)\b/;
	public static var IDENTIFIER:EReg = ~/^\w+/;
	public static var CHAR:EReg = ~/^'(?:[^']|\\.|\\u[0-9A-Fa-f]{4})'/;
	public static var STRING:EReg = ~/^"(?:\\.|[^"])*"|^'(?:[^']|\\.)*'/;
	public static var OPERATOR:EReg = ~/^(\n|\|\||&&|===?|!==?|<<|<=|>>>?|>=|\+\+|--|[|^&<>+\-*\/%!~]|(\||\^|&|<<|>>>?|\+|\-|\*|\/|%)?=(?!=)|in\b|instanceof\b)/;
	public static var PUNCUATION:EReg = ~/^\[\]|^[;,?:.[\]{}()]/;
	
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

//[TODO] standardized haXe error class?

class TokenizerSyntaxError {
	public var source:String;
	public var line:Int;
	public var cursor:Int;
	public var message:String;
	
	public function new(message:String, tokenizer:Tokenizer) {
		this.source = tokenizer.source;
		this.line = tokenizer.line;
		this.cursor = tokenizer.cursor;
		this.message = message;
	}
	
	public function toString():String
	{
		return message + ' (line ' + line + ', char ' + cursor + ')';
	}
}