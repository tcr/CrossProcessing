package processing.parser;

class Token {
	// properties
	public var type:TokenType;
	public var value:Dynamic;
	public var start:Int;
	public var content:String;
	public var line:Int;
	
	public function new(t:TokenType, v:Dynamic = null, c:String = '', s:Int = 0, l:Int = 0) {
		type = t;
		value = v;
		start = s;
		content = c;
		line = l;
	}
	
	public function match(compareType:TokenType):Bool {
		return (type == compareType); 
	}
	
	public function debug() {
		trace('token {');
		trace('\ttype: ' + type);
		trace('\tvalue: "' + value + '"');
		trace('\tstart: ' + start);
		trace('\tcontent: "' + content + '"');
		trace('\tline: ' + line);
		trace('}');
	}
}