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
class Tokenizer
{
	// private state
	private var source:String;
	private var cursor:Int;
	private var currentToken:Token;
	private var states:Array<Dynamic>;
	
	public function new():Void
	{		
		// initialize states
		load('');
	}
	
//[TODO] argument to start tokenizing /from line/?
	public function load(s:String)
	{
		// load source and reset location
		source = s;
		cursor = 0;
		currentToken = null;
		states = [];
	}
	
	public function current():Token
	{
		return currentToken;
	}
	
	public function next():Token
	{
		// init variables
		var regex:SimpleEReg, input:String = '';

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
			currentToken = TEof;
		}
		else if ((regex = regexes.OPERATOR).match(input))
		{
			// assignment operator
			currentToken = TOperator(regex.matched(1));
		}
		else if ((regex = regexes.COLOR).match(input))
		{
			// color
			currentToken = TInteger(Std.parseInt('0x' + regex.matched(1)) + (regex.matched(1).length == 6 ? 0xFF000000 : 0));
		}
		else if ((regex = regexes.FLOAT).match(input))
		{
			// float
			currentToken = TFloat(Std.parseFloat(regex.matched(0)));
		}
		else if ((regex = regexes.INTEGER).match(input))
		{
			// integer
			currentToken = TInteger(Std.parseInt(regex.matched(0)));
		}
		else if ((regex = regexes.KEYWORD).match(input))
		{
			// keyword
			currentToken = TKeyword(regex.matched(0));
		}
		else if ((regex = regexes.TYPE).match(input))
		{
			// keyword
			currentToken = TType(regex.matched(0));
		}
		else if ((regex = regexes.IDENTIFIER).match(input))
		{
			// identifier
			currentToken = TIdentifier(regex.matched(0));
		}
		else if ((regex = regexes.CHAR).match(input))
		{
			// char
			currentToken = TChar(parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 2)).charCodeAt(0));
		}
		else if ((regex = regexes.STRING).match(input))
		{
			// string
			currentToken = TString(parseStringLiteral(regex.matched(0).substr(1, regex.matched(0).length - 2)));
		}
		else if ((regex = regexes.PUNCUATION).match(input))
		{
			// puncuation
			currentToken = switch (regex.matched(0)) {
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
		else 
		{
			throw createSyntaxError('Illegal token ' + input);
		}
			
		// move cursor
		cursor += regex.matched(0).length;
		// return current token		
		return currentToken;
	}

	public function match(to:Dynamic):Bool {
		// preserve state
		pushState();
		// compare next token
		var token:Token = next();		
		if (compareTokens(token, to))
		{
			clearState();
			return true;
		}
		// didn't match
		popState();
		return false;
	}
	
	public function require(to:Dynamic):Void {
		if (!match(to))
			throw createSyntaxError('Must match ' + to + ', found ' + current());
	}
	
	public function hasNext():Bool
	{
		return !match(TEof);
	}
	
	public function getCurrentLineNumber():Int
	{
		return regexes.NEWLINES.split(source.substr(0, cursor)).length + 1;
	}
	
	/*
	 * utilities
	 */
	
	// static regexes
	public static var regexes = TokenizerRegexList;
	
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
	
	private function compareTokens(from:Token, to:Dynamic):Bool
	{
//[TODO] is this matching technique even correct?
		return (Type.enumEq(from, to) || (Type.enumConstructor(from) == to));
	}
	
	/*
	 * [deprecated] peek functions
	 */
	
	public function peek(?lookAhead:Int = 1):Token {
		// peek ahead x tokens, retaining state
		pushState();
		var token:Token = currentToken;
		for (i in 0...lookAhead)
			token = next();
		popState();
		return token;
	}
	
	public function peekMatch(to:Dynamic, ?lookAhead:Int = 1):Bool {
		return compareTokens(peek(lookAhead), to);
	}
	
	/*
	 * tokenizer stack
	 */
	
	public function pushState():Void
	{
		states.push({cursor: cursor, current: currentToken});
	}
	
	public function popState():Void
	{
		var state:Dynamic = states.pop();
		cursor = state.cursor;
		currentToken = state.current;
	}
	
	public function clearState():Void 
	{
		states.pop();
	}
	
	/*
	 * errors
	 */
	
	public function createSyntaxError(message):TokenizerSyntaxError
	{
		var error:TokenizerSyntaxError = new TokenizerSyntaxError(message);
		error.source = source;
		error.cursor = cursor;
		error.line = getCurrentLineNumber();
		return error;
	}
}

class TokenizerRegexList
{
	// dead space
	public static var WHITESPACE = new SimpleEReg("^\\s+","");
	public static var COMMENT = new SimpleEReg("^/(?:\\*(?:.|\\n|\\r)*?\\*/|/.*)","");
	public static var NEWLINES = new SimpleEReg("\\n", "g");
	
	// tokens
	public static var EOF = new SimpleEReg("^$","");
	public static var COLOR = new SimpleEReg("^(?:0[xX]|#)([\\da-fA-F]{6}|[\\da-fA-F]{8})","");
	public static var FLOAT = new SimpleEReg("^\\d+(?:\\.\\d*)?[fF]|^\\d+\\.\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|^\\.\\d+(?:[eE][-+]?\\d+)?","");
	public static var INTEGER = new SimpleEReg("^0[xX][\\da-fA-F]+|^0[0-7]*|^\\d+","");
	public static var KEYWORD = new SimpleEReg("^(break|class|case|catch|const|continue|default|do|else|enum|false|finally|for|function|if|new|null|public|private|return|static|switch|this|throw|true|try|var|while|with)\\b","");
	public static var TYPE = new SimpleEReg("^(boolean|char|void|float|int)\\b","");
	public static var IDENTIFIER = new SimpleEReg("^\\w+","");
	public static var CHAR = new SimpleEReg("^'(?:[^']|\\\\.|\\\\u[0-9A-Fa-f]{4})'","");
	public static var STRING = new SimpleEReg("^\"(?:\\\\.|[^\"])*\"|^'(?:[^']|\\\\.)*'","");
	public static var OPERATOR = new SimpleEReg("^(\\n|\\|\\||&&|[!=]=|(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=(?!=)|<<|<=|>>>?|>=|\\+\\+|--|[|^&<>+\\-*/%!~]|instanceof\\b)","");
	public static var PUNCUATION = new SimpleEReg("^\\[\\]|^[;,?:.[\\]{}()]", "");
	
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
	
	public function new(message:String)
	{
		this.message = message;
	}
	
	public function toString():String
	{
		return message + ' (line ' + line + ', char ' + cursor + ')';
	}
}