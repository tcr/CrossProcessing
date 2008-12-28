package processing.parser;

class Token {
	// properties
	public var type:TokenType;
	public var value:Dynamic;
	public var start:Int;
	public var content:String;
	public var line:Int;
//[TODO] get rid of assignOp?
	public var assignOp:TokenType;
	
	public function new(t:TokenType, v:Dynamic = null, c:String = '', s:Int = 0, l:Int = 0, ?a:TokenType) {
		type = t;
		value = v;
		start = s;
		content = c;
		line = l;
		assignOp = a;
	}
	
	public function match(compareType:TokenType):Bool {
		return (type == compareType); 
	}
	
	public function debug() {
		trace('token {');
		trace('\ttype: ' + TokenType.getConstant(type));
		trace('\tvalue: "' + value + '"');
		trace('\tstart: ' + start);
		trace('\tcontent: "' + content + '"');
		trace('\tline: ' + line);
		trace('}');
	}
}