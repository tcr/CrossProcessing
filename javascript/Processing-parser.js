$estr = function() { return js.Boot.__string_rec(this,''); }
js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = (i != null?i.fileName + ":" + i.lineNumber + ": ":"");
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	}
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				{
					var _g1 = 2, _g = o.length;
					while(_g1 < _g) {
						var i = _g1++;
						if(i != 2) str += "," + js.Boot.__string_rec(o[i],s);
						else str += js.Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			{
				var _g = 0;
				while(_g < l) {
					var i1 = _g++;
					str += ((i1 > 0?",":"")) + js.Boot.__string_rec(o[i1],s);
				}
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					return "???";
				}
			}
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = (o.hasOwnProperty != null);
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) continue;
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") continue;
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	}break;
	case "function":{
		return "<function>";
	}break;
	case "string":{
		return o;
	}break;
	default:{
		return String(o);
	}break;
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return (o.__enum__ == null);
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	}
	catch( $e1 ) {
		{
			var e = $e1;
			{
				if(cl == null) return false;
			}
		}
	}
	switch(cl) {
	case Int:{
		return Math.ceil(o%2147483648.0) === o;
	}break;
	case Float:{
		return typeof(o) == "number";
	}break;
	case Bool:{
		return o === true || o === false;
	}break;
	case String:{
		return typeof(o) == "string";
	}break;
	case Dynamic:{
		return true;
	}break;
	default:{
		if(o == null) return false;
		return o.__enum__ == cl || (cl == Class && o.__name__ != null) || (cl == Enum && o.__ename__ != null);
	}break;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = (document.all != null && window.opera == null);
	js.Lib.isOpera = (window.opera != null);
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	}
	Array.prototype.remove = function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	}
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}}
	}
	var cca = String.prototype.charCodeAt;
	String.prototype.cca = cca;
	String.prototype.charCodeAt = function(i) {
		var x = cca.call(this,i);
		if(isNaN(x)) return null;
		return x;
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = this.length + len - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
js.Lib = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype.__class__ = js.Lib;
ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	if(c == null) return null;
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl;
	try {
		cl = eval(name);
	}
	catch( $e2 ) {
		{
			var e = $e2;
			{
				cl = null;
			}
		}
	}
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e;
	try {
		e = eval(name);
	}
	catch( $e3 ) {
		{
			var err = $e3;
			{
				e = null;
			}
		}
	}
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	if(args.length <= 3) return new cl(args[0],args[1],args[2]);
	if(args.length > 8) throw "Too many arguments";
	return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
}
Type.createEmptyInstance = function(cl) {
	return new cl($_);
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.getInstanceFields = function(c) {
	var a = Reflect.fields(c.prototype);
	a.remove("__class__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	return e.__constructs__;
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":{
		return ValueType.TBool;
	}break;
	case "string":{
		return ValueType.TClass(String);
	}break;
	case "number":{
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	}break;
	case "object":{
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	}break;
	case "function":{
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	}break;
	case "undefined":{
		return ValueType.TNull;
	}break;
	default:{
		return ValueType.TUnknown;
	}break;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	if(a[0] != b[0]) return false;
	{
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
	}
	var e = a.__enum__;
	if(e != b.__enum__ || e == null) return false;
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.prototype.__class__ = Type;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
}
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(Math.isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype.__class__ = Std;
processing = {}
processing.parser = {}
processing.parser.Token = { __ename__ : ["processing","parser","Token"], __constructs__ : ["TEof","TKeyword","TIdentifier","TOperator","TString","TInteger","TFloat","TChar","TDimensions","TParenOpen","TParenClose","TBracketOpen","TBracketClose","TDot","TComma","TSemicolon","TBraceOpen","TBraceClose","TQuestion","TDoubleDot"] }
processing.parser.Token.TBraceClose = ["TBraceClose",17];
processing.parser.Token.TBraceClose.toString = $estr;
processing.parser.Token.TBraceClose.__enum__ = processing.parser.Token;
processing.parser.Token.TBraceOpen = ["TBraceOpen",16];
processing.parser.Token.TBraceOpen.toString = $estr;
processing.parser.Token.TBraceOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TBracketClose = ["TBracketClose",12];
processing.parser.Token.TBracketClose.toString = $estr;
processing.parser.Token.TBracketClose.__enum__ = processing.parser.Token;
processing.parser.Token.TBracketOpen = ["TBracketOpen",11];
processing.parser.Token.TBracketOpen.toString = $estr;
processing.parser.Token.TBracketOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TChar = function(value) { var $x = ["TChar",7,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TComma = ["TComma",14];
processing.parser.Token.TComma.toString = $estr;
processing.parser.Token.TComma.__enum__ = processing.parser.Token;
processing.parser.Token.TDimensions = ["TDimensions",8];
processing.parser.Token.TDimensions.toString = $estr;
processing.parser.Token.TDimensions.__enum__ = processing.parser.Token;
processing.parser.Token.TDot = ["TDot",13];
processing.parser.Token.TDot.toString = $estr;
processing.parser.Token.TDot.__enum__ = processing.parser.Token;
processing.parser.Token.TDoubleDot = ["TDoubleDot",19];
processing.parser.Token.TDoubleDot.toString = $estr;
processing.parser.Token.TDoubleDot.__enum__ = processing.parser.Token;
processing.parser.Token.TEof = ["TEof",0];
processing.parser.Token.TEof.toString = $estr;
processing.parser.Token.TEof.__enum__ = processing.parser.Token;
processing.parser.Token.TFloat = function(value) { var $x = ["TFloat",6,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TIdentifier = function(identifier) { var $x = ["TIdentifier",2,identifier]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TInteger = function(value) { var $x = ["TInteger",5,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TKeyword = function(keyword) { var $x = ["TKeyword",1,keyword]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TOperator = function(operator) { var $x = ["TOperator",3,operator]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TParenClose = ["TParenClose",10];
processing.parser.Token.TParenClose.toString = $estr;
processing.parser.Token.TParenClose.__enum__ = processing.parser.Token;
processing.parser.Token.TParenOpen = ["TParenOpen",9];
processing.parser.Token.TParenOpen.toString = $estr;
processing.parser.Token.TParenOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TQuestion = ["TQuestion",18];
processing.parser.Token.TQuestion.toString = $estr;
processing.parser.Token.TQuestion.__enum__ = processing.parser.Token;
processing.parser.Token.TSemicolon = ["TSemicolon",15];
processing.parser.Token.TSemicolon.toString = $estr;
processing.parser.Token.TSemicolon.__enum__ = processing.parser.Token;
processing.parser.Token.TString = function(value) { var $x = ["TString",4,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
EReg = function(r,opt) { if( r === $_ ) return; {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
}}
EReg.__name__ = ["EReg"];
EReg.prototype.customReplace = function(s,f) {
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b += this.matchedLeft();
		buf.b += f(this);
		s = this.matchedRight();
	}
	buf.b += s;
	return buf.b;
}
EReg.prototype.match = function(s) {
	this.r.m = this.r.exec(s);
	this.r.s = s;
	this.r.l = RegExp.leftContext;
	this.r.r = RegExp.rightContext;
	return (this.r.m != null);
}
EReg.prototype.matched = function(n) {
	return (this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
}
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.l == null) return this.r.s.substr(0,this.r.m.index);
	return this.r.l;
}
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length}
}
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.r == null) {
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	return this.r.r;
}
EReg.prototype.r = null;
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
}
EReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
}
EReg.prototype.__class__ = EReg;
processing.parser.TokenizerRegexList = function() { }
processing.parser.TokenizerRegexList.__name__ = ["processing","parser","TokenizerRegexList"];
processing.parser.TokenizerRegexList.prototype.__class__ = processing.parser.TokenizerRegexList;
processing.parser.Tokenizer = function(p) { if( p === $_ ) return; {
	this.load("");
}}
processing.parser.Tokenizer.__name__ = ["processing","parser","Tokenizer"];
processing.parser.Tokenizer.prototype.currentToken = null;
processing.parser.Tokenizer.prototype.cursor = null;
processing.parser.Tokenizer.prototype.done = null;
processing.parser.Tokenizer.prototype.get = function() {
	var token = null, regex, input = "";
	while(true) {
		input = this.source.substr(this.cursor);
		if((regex = processing.parser.Tokenizer.regexes.WHITESPACE).match(input) || (regex = processing.parser.Tokenizer.regexes.COMMENT).match(input)) this.cursor += regex.matched(0).length;
		else break;
	}
	if((regex = processing.parser.Tokenizer.regexes.EOF).match(input)) {
		token = processing.parser.Token.TEof;
	}
	else if((regex = processing.parser.Tokenizer.regexes.COLOR).match(input)) {
		token = processing.parser.Token.TInteger(Std.parseInt("0x" + regex.matched(1)) + ((regex.matched(1).length == 6?-16777216:0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.FLOAT).match(input)) {
		token = processing.parser.Token.TFloat(Std.parseFloat(regex.matched(0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.INTEGER).match(input)) {
		token = processing.parser.Token.TInteger(Std.parseInt(regex.matched(0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.KEYWORD).match(input)) {
		token = processing.parser.Token.TKeyword(regex.matched(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.IDENTIFIER).match(input)) {
		token = processing.parser.Token.TIdentifier(regex.matched(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.CHAR).match(input)) {
		token = processing.parser.Token.TChar(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)).charCodeAt(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.STRING).match(input)) {
		token = processing.parser.Token.TString(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.OPERATOR).match(input)) {
		token = processing.parser.Token.TOperator(regex.matched(1));
	}
	else if((regex = processing.parser.Tokenizer.regexes.PUNCUATION).match(input)) {
		token = function($this) {
			var $r;
			switch(regex.matched(0)) {
			case "[]":{
				$r = processing.parser.Token.TDimensions;
			}break;
			case "(":{
				$r = processing.parser.Token.TParenOpen;
			}break;
			case ")":{
				$r = processing.parser.Token.TParenClose;
			}break;
			case "[":{
				$r = processing.parser.Token.TBracketOpen;
			}break;
			case "]":{
				$r = processing.parser.Token.TBracketClose;
			}break;
			case ".":{
				$r = processing.parser.Token.TDot;
			}break;
			case ",":{
				$r = processing.parser.Token.TComma;
			}break;
			case ";":{
				$r = processing.parser.Token.TSemicolon;
			}break;
			case "{":{
				$r = processing.parser.Token.TBraceOpen;
			}break;
			case "}":{
				$r = processing.parser.Token.TBraceClose;
			}break;
			case "?":{
				$r = processing.parser.Token.TQuestion;
			}break;
			case ":":{
				$r = processing.parser.Token.TDoubleDot;
			}break;
			default:{
				$r = null;
			}break;
			}
			return $r;
		}(this);
	}
	else {
		throw new processing.parser.TokenizerSyntaxError("Illegal token " + input,this);
	}
	this.cursor += regex.matched(0).length;
	return token;
}
processing.parser.Tokenizer.prototype.getCurrentLineNumber = function() {
	return this.getLineNumber(this.cursor);
}
processing.parser.Tokenizer.prototype.getLineNumber = function(searchCursor) {
	return processing.parser.Tokenizer.regexes.NEWLINES.split(this.source.substr(0,searchCursor)).length + 1;
}
processing.parser.Tokenizer.prototype.isDone = function() {
	return this.match(processing.parser.Token.TEof);
}
processing.parser.Tokenizer.prototype.line = null;
processing.parser.Tokenizer.prototype.load = function(s) {
	this.source = s;
	this.cursor = 0;
	this.scanOperand = true;
}
processing.parser.Tokenizer.prototype.match = function(to,mustMatch) {
	if(mustMatch == null) mustMatch = false;
	var doesMatch = (this.peek() == to);
	if(doesMatch) this.get();
	else if(mustMatch) throw new processing.parser.TokenizerSyntaxError("Tokenizer: Must match " + Type.enumConstructor(to) + ", found " + Type.enumConstructor(this.peek()),this);
	return doesMatch;
}
processing.parser.Tokenizer.prototype.parseStringLiteral = function(str) {
	str = processing.parser.Tokenizer.regexes.CHAR_BACKSPACE.replace(str,"$1");
	str = processing.parser.Tokenizer.regexes.CHAR_TAB.replace(str,"$1\t");
	str = processing.parser.Tokenizer.regexes.CHAR_NEWLINE.replace(str,"$1\n");
	str = processing.parser.Tokenizer.regexes.CHAR_VERTICAL_TAB.replace(str,"$1");
	str = processing.parser.Tokenizer.regexes.CHAR_FORM_FEED.replace(str,"$1");
	str = processing.parser.Tokenizer.regexes.CHAR_CARRIAGE_RETURN.replace(str,"$1\r");
	str = processing.parser.Tokenizer.regexes.CHAR_DOUBLE_QUOTE.replace(str,"$1\"");
	str = processing.parser.Tokenizer.regexes.CHAR_SINGLE_QUOTE.replace(str,"$1'");
	str = processing.parser.Tokenizer.regexes.CHAR_BACKSLASH.replace(str,"\\");
	str = processing.parser.Tokenizer.regexes.CHAR_UNICODE.customReplace(str,function(regex) {
		return regex.matchedLeft() + String.fromCharCode(Std.parseInt("0x" + regex.matched(1))) + regex.matchedRight();
	});
	return str;
}
processing.parser.Tokenizer.prototype.peek = function(lookAhead) {
	if(lookAhead == null) lookAhead = 1;
	var origCursor = this.cursor, origToken = this.currentToken, token = null;
	{
		var _g = 0;
		while(_g < lookAhead) {
			var i = _g++;
			token = this.get();
		}
	}
	this.cursor = origCursor;
	this.currentToken = origToken;
	return token;
}
processing.parser.Tokenizer.prototype.scanOperand = null;
processing.parser.Tokenizer.prototype.source = null;
processing.parser.Tokenizer.prototype.__class__ = processing.parser.Tokenizer;
processing.parser.TokenizerSyntaxError = function(message,tokenizer) { if( message === $_ ) return; {
	this.source = tokenizer.source;
	this.line = tokenizer.getCurrentLineNumber();
	this.cursor = tokenizer.cursor;
	this.message = message;
}}
processing.parser.TokenizerSyntaxError.__name__ = ["processing","parser","TokenizerSyntaxError"];
processing.parser.TokenizerSyntaxError.prototype.cursor = null;
processing.parser.TokenizerSyntaxError.prototype.line = null;
processing.parser.TokenizerSyntaxError.prototype.message = null;
processing.parser.TokenizerSyntaxError.prototype.source = null;
processing.parser.TokenizerSyntaxError.prototype.toString = function() {
	return this.message + " (line " + this.line + ", char " + this.cursor + ")";
}
processing.parser.TokenizerSyntaxError.prototype.__class__ = processing.parser.TokenizerSyntaxError;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it4 = arr.iterator();
	while( $it4.hasNext() ) { var t = $it4.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e5 ) {
		{
			var e = $e5;
			null;
		}
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		
					for(var i in o)
						if( o.hasOwnProperty(i) )
							a.push(i);
				;
	}
	else {
		var t;
		try {
			t = o.__proto__;
		}
		catch( $e6 ) {
			{
				var e = $e6;
				{
					t = null;
				}
			}
		}
		if(t != null) o.__proto__ = null;
		
					for(var i in o)
						if( i != "__proto__" )
							a.push(i);
				;
		if(t != null) o.__proto__ = t;
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return ((a == b)?0:((((a) > (b))?1:-1)));
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return (t == "string" || (t == "object" && !v.__enum__) || (t == "function" && v.__name__ != null));
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { }
	{
		var _g = 0, _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = new Array();
		{
			var _g1 = 0, _g = arguments.length;
			while(_g1 < _g) {
				var i = _g1++;
				a.push(arguments[i]);
			}
		}
		return f(a);
	}
}
Reflect.prototype.__class__ = Reflect;
StringBuf = function(p) { if( p === $_ ) return; {
	this.b = "";
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b += x;
}
StringBuf.prototype.addChar = function(c) {
	this.b += String.fromCharCode(c);
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b += s.substr(pos,len);
}
StringBuf.prototype.b = null;
StringBuf.prototype.toString = function() {
	return this.b;
}
StringBuf.prototype.__class__ = StringBuf;
IntIter = function(min,max) { if( min === $_ ) return; {
	this.min = min;
	this.max = max;
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]}
	Dynamic = { __name__ : ["Dynamic"]}
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]}
	Class = { __name__ : ["Class"]}
	Enum = { }
	Void = { __ename__ : ["Void"]}
}
{
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	}
	Math.isNaN = function(i) {
		return isNaN(i);
	}
	Math.__name__ = ["Math"];
}
js.Lib.onerror = null;
processing.parser.TokenizerRegexList.WHITESPACE = new EReg("^\\s+","");
processing.parser.TokenizerRegexList.COMMENT = new EReg("^/(?:\\*(?:.|\\n|\\r)*?\\*/|/.*)","");
processing.parser.TokenizerRegexList.NEWLINES = new EReg("\\n","g");
processing.parser.TokenizerRegexList.EOF = new EReg("^$","");
processing.parser.TokenizerRegexList.COLOR = new EReg("^(?:0[xX]|#)([\\da-fA-F]{6}|[\\da-fA-F]{8})","");
processing.parser.TokenizerRegexList.FLOAT = new EReg("^\\d+(?:\\.\\d*)?[fF]|^\\d+\\.\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|^\\.\\d+(?:[eE][-+]?\\d+)?","");
processing.parser.TokenizerRegexList.INTEGER = new EReg("^0[xX][\\da-fA-F]+|^0[0-7]*|^\\d+","");
processing.parser.TokenizerRegexList.KEYWORD = new EReg("^(break|class|case|catch|const|continue|debugger|default|delete|do|else|enum|false|finally|for|function|in|instanceof|new|null|public|private|return|static|switch|this|throw|true|try|typeof|var|while|with|boolean|char|void|float|int)","");
processing.parser.TokenizerRegexList.IDENTIFIER = new EReg("^\\w+","");
processing.parser.TokenizerRegexList.CHAR = new EReg("^'(?:[^']|\\\\.|\\\\u[0-9A-Fa-f]{4})'","");
processing.parser.TokenizerRegexList.STRING = new EReg("^\"(?:\\\\.|[^\"])*\"|^'(?:[^']|\\\\.)*'","");
processing.parser.TokenizerRegexList.OPERATOR = new EReg("^(\\n|\\|\\||&&|===?|!==?|<<|<=|>>>?|>=|\\+\\+|--|[|^&<>+\\-*/%!~]|(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=(?!=))","");
processing.parser.TokenizerRegexList.PUNCUATION = new EReg("^\\[\\]|^[;,?:.[\\]{}()]","");
processing.parser.TokenizerRegexList.CHAR_BACKSPACE = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\b","g");
processing.parser.TokenizerRegexList.CHAR_TAB = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\t","g");
processing.parser.TokenizerRegexList.CHAR_NEWLINE = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\n","g");
processing.parser.TokenizerRegexList.CHAR_VERTICAL_TAB = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\v","g");
processing.parser.TokenizerRegexList.CHAR_FORM_FEED = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\f","g");
processing.parser.TokenizerRegexList.CHAR_CARRIAGE_RETURN = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\r","g");
processing.parser.TokenizerRegexList.CHAR_DOUBLE_QUOTE = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\\"","g");
processing.parser.TokenizerRegexList.CHAR_SINGLE_QUOTE = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\'","g");
processing.parser.TokenizerRegexList.CHAR_BACKSLASH = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\\\\\","g");
processing.parser.TokenizerRegexList.CHAR_UNICODE = new EReg("((?:[^\\\\]|^)(?:\\\\\\\\)+)\\\\u([0-9A-Fa-z]{4})","g");
processing.parser.Tokenizer.regexes = processing.parser.TokenizerRegexList;
