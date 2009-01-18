package processing.parser;

class TokenType {
	public var value(default, null):Dynamic;
	public var precedence(default, null):Int;
	public var arity(default, null):Int;
	
	public function new(value:Dynamic = '', precedence:Int = 0, arity:Int = 0):Void {
		this.value = value;
		this.precedence = precedence;
		this.arity = arity;
	}
	
	//==============================================================
	// type constants
	//==============================================================
	
	// get token constant (if one exists)
	public static function getConstant(token:TokenType):String {
		trace('THIS IS DEPRECATED');
		return token.value;
//		 var description:XML = describeType(TokenType);
//		 for each (var constant:XML in description..constant)
//			if (TokenType[constant.@name] == token)
//				return constant.@name;
//		return null;
	}

//[TODO] eliminate these as tokens?
	// EOF
	public static var END:TokenType = new TokenType('END');

	// nonterminal tree node type codes
	public static var SCRIPT:TokenType = new TokenType('SCRIPT');
	public static var BLOCK:TokenType = new TokenType('BLOCK');
	public static var LABEL:TokenType = new TokenType('LABEL');
	public static var FOR_IN:TokenType = new TokenType('FOR_IN');
	public static var CALL:TokenType = new TokenType('CALL', 0, 2);
	public static var NEW_WITH_ARGS:TokenType = new TokenType('NEW_WITH_ARGS', 0, 2);
	public static var INDEX:TokenType = new TokenType('INDEX', 17, 2);
	public static var ARRAY_INIT:TokenType = new TokenType('ARRAY_INIT', 0, 1);
	public static var OBJECT_INIT:TokenType = new TokenType('OBJECT_INIT', 0, 1);
	public static var PROPERTY_INIT:TokenType = new TokenType('PROPERTY_INIT');
	public static var GROUP:TokenType = new TokenType('GROUP', 0, 1);
	public static var LIST:TokenType = new TokenType('LIST');
	
	// ...something
	public static var CONSTRUCTOR:TokenType = new TokenType('CONSTRUCTOR');
	
	// terminals
	public static var IDENTIFIER:TokenType = new TokenType('IDENTIFIER');
	public static var TYPE:TokenType = new TokenType('TYPE');
	public static var NUMBER:TokenType = new TokenType('NUMBER');
	public static var STRING:TokenType = new TokenType('STRING');
	public static var REGEXP:TokenType = new TokenType('REGEXP');
	public static var ARRAY_DIMENSION:TokenType = new TokenType('[]');

	// operators
	public static var NEWLINE:TokenType = new TokenType('\n');
	public static var SEMICOLON:TokenType = new TokenType(';', 0);
	public static var COMMA:TokenType = new TokenType(',', 1, -2);
	public static var HOOK:TokenType = new TokenType('?', 2);
	public static var COLON:TokenType = new TokenType(':', 2);
	public static var OR:TokenType = new TokenType('||', 4, 2);
	public static var AND:TokenType = new TokenType('&&', 5, 2);
	public static var BITWISE_OR:TokenType = new TokenType('|', 6, 2);
	public static var BITWISE_XOR:TokenType = new TokenType('^', 7, 2);
	public static var BITWISE_AND:TokenType = new TokenType('&', 8, 2);
	public static var STRICT_EQ:TokenType = new TokenType('===', 9, 2);
	public static var EQ:TokenType = new TokenType('==', 9, 2);
	public static var ASSIGN:TokenType = new TokenType('=', 2, 2);
	public static var STRICT_NE:TokenType = new TokenType('!==', 9, 2);
	public static var NE:TokenType = new TokenType('!=', 9, 2);
	public static var LSH:TokenType = new TokenType('<<', 11, 2);
	public static var LE:TokenType = new TokenType('<=', 10, 2);
	public static var LT:TokenType = new TokenType('<', 10, 2);
	public static var URSH:TokenType = new TokenType('>>>', 11, 2);
	public static var RSH:TokenType = new TokenType('>>', 11, 2);
	public static var GE:TokenType = new TokenType('>=', 10, 2);
	public static var GT:TokenType = new TokenType('>', 10, 2);
	public static var INCREMENT:TokenType = new TokenType('++', 15, 1);
	public static var DECREMENT:TokenType = new TokenType('--', 15, 1);
	public static var PLUS:TokenType = new TokenType('+', 12, 2);
	public static var MINUS:TokenType = new TokenType('-', 12, 2);
	public static var MUL:TokenType = new TokenType('*', 13, 2);
	public static var DIV:TokenType = new TokenType('/', 13, 2);
	public static var MOD:TokenType = new TokenType('%', 13, 2);
	public static var NOT:TokenType = new TokenType('!', 14, 1);
	public static var BITWISE_NOT:TokenType = new TokenType('~', 14, 1);
	public static var DOT:TokenType = new TokenType('.', 17, 2);
	public static var LEFT_BRACKET:TokenType = new TokenType('[');
	public static var RIGHT_BRACKET:TokenType = new TokenType(']');
	public static var LEFT_CURLY:TokenType = new TokenType('{');
	public static var RIGHT_CURLY:TokenType = new TokenType('}');
	public static var LEFT_PAREN:TokenType = new TokenType('(');
	public static var RIGHT_PAREN:TokenType = new TokenType(')');
	public static var CONDITIONAL:TokenType = new TokenType('CONDITIONAL', 2, 3);
	public static var UNARY_PLUS:TokenType = new TokenType('UNARY_PLUS', 14, 1);
	public static var UNARY_MINUS:TokenType = new TokenType('UNARY_MINUS', 14, 1);
	public static var CAST:TokenType = new TokenType('CAST', 14, 2);
	
	// keywords
	public static var BREAK:TokenType = new TokenType();
	public static var CLASS:TokenType = new TokenType();
	public static var CASE:TokenType = new TokenType();
	public static var CATCH:TokenType = new TokenType();
	public static var CONST:TokenType = new TokenType();
	public static var CONTINUE:TokenType = new TokenType();
	public static var DEBUGGER:TokenType = new TokenType();
	public static var DEFAULT:TokenType = new TokenType();
	public static var DELETE:TokenType = new TokenType('delete', 14, 1);
	public static var DO:TokenType = new TokenType();
	public static var ELSE:TokenType = new TokenType();
	public static var ENUM:TokenType = new TokenType();
	public static var FALSE:TokenType = new TokenType(false);
	public static var FINALLY:TokenType = new TokenType();
	public static var FOR:TokenType = new TokenType();
	public static var FUNCTION:TokenType = new TokenType();
	public static var IF:TokenType = new TokenType();
	public static var IN:TokenType = new TokenType('in', 10, 2);
	public static var INSTANCEOF:TokenType = new TokenType('instanceof', 10, 2);
	public static var NEW:TokenType = new TokenType('new', 16, 1);
	public static var NULL:TokenType = new TokenType(null);
	public static var PUBLIC:TokenType = new TokenType('public');
	public static var PRIVATE:TokenType = new TokenType('private');
	public static var RETURN:TokenType = new TokenType();
	public static var STATIC:TokenType = new TokenType('static');
	public static var SWITCH:TokenType = new TokenType();
	public static var THIS:TokenType = new TokenType();
	public static var THROW:TokenType = new TokenType();
	public static var TRUE:TokenType = new TokenType(true);
	public static var TRY:TokenType = new TokenType();
	public static var TYPEOF:TokenType = new TokenType('typeof', 14, 1);
	public static var VAR:TokenType = new TokenType();
	public static var WHILE:TokenType = new TokenType();
	public static var WITH:TokenType = new TokenType();
	
	// variable types
	public static var VOID:TokenType = new TokenType('void');
	public static var BOOLEAN:TokenType = new TokenType('boolean');
	public static var FLOAT:TokenType = new TokenType('float');
	public static var INT:TokenType = new TokenType('int');
	public static var CHAR:TokenType = new TokenType('char');

		// token lists
	public static var TYPES:TypeTokenTypeList = new TypeTokenTypeList();
	public static var KEYWORDS:KeywordTokenTypeList = new KeywordTokenTypeList();
	public static var OPS:OperatorTokenTypeList = new OperatorTokenTypeList();
	public static var ASSIGNMENT_OPS:AssignmentTokenTypeList = new AssignmentTokenTypeList();
}

//[TODO] can probably generate these lists from the TokenType constructor!

class OperatorTokenTypeList extends Hash<TokenType>
{
	public function new() {
		super();

		set('\n', TokenType.NEWLINE);
		set(';', TokenType.SEMICOLON);
		set(',', TokenType.COMMA);
		set('?', TokenType.HOOK);
		set(':', TokenType.COLON);
		set('||', TokenType.OR);
		set('&&', TokenType.AND);
		set('|', TokenType.BITWISE_OR);
		set('^', TokenType.BITWISE_XOR);
		set('&', TokenType.BITWISE_AND);
		set('===', TokenType.STRICT_EQ);
		set('==', TokenType.EQ);
		set('=', TokenType.ASSIGN);
		set('!==', TokenType.STRICT_NE);
		set('!=', TokenType.NE);
		set('<<', TokenType.LSH);
		set('<=', TokenType.LE);
		set('<', TokenType.LT);
		set('>>>', TokenType.URSH);
		set('>>', TokenType.RSH);
		set('>=', TokenType.GE);
		set('>', TokenType.GT);
		set('++', TokenType.INCREMENT);
		set('--', TokenType.DECREMENT);
		set('+', TokenType.PLUS);
		set('-', TokenType.MINUS);
		set('*', TokenType.MUL);
		set('/', TokenType.DIV);
		set('%', TokenType.MOD);
		set('!', TokenType.NOT);
		set('~', TokenType.BITWISE_NOT);
		set('.', TokenType.DOT);
		set('[', TokenType.LEFT_BRACKET);
		set(']', TokenType.RIGHT_BRACKET);
		set('{', TokenType.LEFT_CURLY);
		set('}', TokenType.RIGHT_CURLY);
		set('(', TokenType.LEFT_PAREN);
		set(')', TokenType.RIGHT_PAREN);
	}
}

class AssignmentTokenTypeList extends Hash<TokenType>
{
	public function new()
	{
		super();
		
		set('|', TokenType.BITWISE_OR);
		set('^', TokenType.BITWISE_XOR);
		set('&', TokenType.BITWISE_AND);
		set('<<', TokenType.LSH);
		set('>>>', TokenType.URSH);
		set('>>', TokenType.RSH);
		set('+', TokenType.PLUS);
		set('-', TokenType.MINUS);
		set('*', TokenType.MUL);
		set('/', TokenType.DIV);
		set('%', TokenType.MOD);
	}
}

class KeywordTokenTypeList extends Hash<TokenType>
{
	public function new()
	{
		super();
		
		set('break', TokenType.BREAK);
		set('class', TokenType.CLASS);
		set('case', TokenType.CASE);
		set('catch', TokenType.CATCH);
		set('const', TokenType.CONST);
		set('continue', TokenType.CONTINUE);
		set('debugger', TokenType.DEBUGGER);
		set('default', TokenType.DEFAULT);
		set('delete', TokenType.DELETE);
		set('do', TokenType.DO);
		set('else', TokenType.ELSE);
		set('enum', TokenType.ENUM);
		set('false', TokenType.FALSE);
		set('finally', TokenType.FINALLY);
		set('for', TokenType.FOR);
		set('function', TokenType.FUNCTION);
		set('if', TokenType.IF);
		set('in', TokenType.IN);
		set('instanceof', TokenType.INSTANCEOF);
		set('new', TokenType.NEW);
		set('null', TokenType.NULL);
		set('public', TokenType.PUBLIC);
		set('private', TokenType.PRIVATE);
		set('return', TokenType.RETURN);
		set('static', TokenType.STATIC);
		set('switch', TokenType.SWITCH);
		set('this', TokenType.THIS);
		set('throw', TokenType.THROW);
		set('true', TokenType.TRUE);
		set('try', TokenType.TRY);
		set('typeof', TokenType.TYPEOF);
		set('var', TokenType.VAR);
		set('while', TokenType.WHILE);
		set('with', TokenType.WITH);
	}
}

class TypeTokenTypeList extends Hash<TokenType>
{
	public function new()
	{
		super();
		
		set('boolean', TokenType.BOOLEAN);
		set('char', TokenType.CHAR);
		set('void', TokenType.VOID);		
		set('float', TokenType.FLOAT);
		set('int', TokenType.INT);
	}
}