$estr = function() { return js.Boot.__string_rec(this,''); }
haxe = {}
haxe.io = {}
haxe.io.BytesBuffer = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype.add = function(src) {
	var b1 = this.b;
	var b2 = src.b;
	{
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
}
haxe.io.BytesBuffer.prototype.addByte = function($byte) {
	this.b.push($byte);
}
haxe.io.BytesBuffer.prototype.addBytes = function(src,pos,len) {
	if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	{
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
}
haxe.io.BytesBuffer.prototype.b = null;
haxe.io.BytesBuffer.prototype.getBytes = function() {
	var bytes = new haxe.io.Bytes(this.b.length,this.b);
	this.b = null;
	return bytes;
}
haxe.io.BytesBuffer.prototype.__class__ = haxe.io.BytesBuffer;
haxe.io.Input = function() { }
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype.bigEndian = null;
haxe.io.Input.prototype.close = function() {
	null;
}
haxe.io.Input.prototype.read = function(nbytes) {
	var s = haxe.io.Bytes.alloc(nbytes);
	var p = 0;
	while(nbytes > 0) {
		var k = this.readBytes(s,p,nbytes);
		if(k == 0) throw haxe.io.Error.Blocked;
		p += k;
		nbytes -= k;
	}
	return s;
}
haxe.io.Input.prototype.readAll = function(bufsize) {
	if(bufsize == null) bufsize = (1 << 14);
	var buf = haxe.io.Bytes.alloc(bufsize);
	var total = new haxe.io.BytesBuffer();
	try {
		while(true) {
			var len = this.readBytes(buf,0,bufsize);
			if(len == 0) throw haxe.io.Error.Blocked;
			total.addBytes(buf,0,len);
		}
	}
	catch( $e0 ) {
		if( js.Boot.__instanceof($e0,haxe.io.Eof) ) {
			var e = $e0;
			null;
		} else throw($e0);
	}
	return total.getBytes();
}
haxe.io.Input.prototype.readByte = function() {
	return function($this) {
		var $r;
		throw "Not implemented";
		return $r;
	}(this);
}
haxe.io.Input.prototype.readBytes = function(s,pos,len) {
	var k = len;
	var b = s.b;
	if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
	while(k > 0) {
		b[pos] = this.readByte();
		pos++;
		k--;
	}
	return len;
}
haxe.io.Input.prototype.readDouble = function() {
	throw "Not implemented";
	return 0;
}
haxe.io.Input.prototype.readFloat = function() {
	throw "Not implemented";
	return 0;
}
haxe.io.Input.prototype.readFullBytes = function(s,pos,len) {
	while(len > 0) {
		var k = this.readBytes(s,pos,len);
		pos += k;
		len -= k;
	}
}
haxe.io.Input.prototype.readInt16 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var n = (this.bigEndian?ch2 | (ch1 << 8):ch1 | (ch2 << 8));
	if((n & 32768) != 0) return n - 65536;
	return n;
}
haxe.io.Input.prototype.readInt24 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var n = (this.bigEndian?(ch3 | (ch2 << 8)) | (ch1 << 16):(ch1 | (ch2 << 8)) | (ch3 << 16));
	if((n & 8388608) != 0) return n - 16777216;
	return n;
}
haxe.io.Input.prototype.readInt31 = function() {
	var ch1, ch2, ch3, ch4;
	if(this.bigEndian) {
		ch4 = this.readByte();
		ch3 = this.readByte();
		ch2 = this.readByte();
		ch1 = this.readByte();
	}
	else {
		ch1 = this.readByte();
		ch2 = this.readByte();
		ch3 = this.readByte();
		ch4 = this.readByte();
	}
	if(((ch4 & 128) == 0) != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
	return ((ch1 | (ch2 << 8)) | (ch3 << 16)) | (ch4 << 24);
}
haxe.io.Input.prototype.readInt32 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var ch4 = this.readByte();
	return (this.bigEndian?(((ch1 << 8) | ch2) << 16) | ((ch3 << 8) | ch4):(((ch4 << 8) | ch3) << 16) | ((ch2 << 8) | ch1));
}
haxe.io.Input.prototype.readInt8 = function() {
	var n = this.readByte();
	if(n >= 128) return n - 256;
	return n;
}
haxe.io.Input.prototype.readLine = function() {
	var buf = new StringBuf();
	var last;
	var s;
	try {
		while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
		s = buf.b;
		if(s.charCodeAt(s.length - 1) == 13) s = s.substr(0,-1);
	}
	catch( $e1 ) {
		if( js.Boot.__instanceof($e1,haxe.io.Eof) ) {
			var e = $e1;
			{
				s = buf.b;
				if(s.length == 0) throw (e);
			}
		} else throw($e1);
	}
	return s;
}
haxe.io.Input.prototype.readString = function(len) {
	var b = haxe.io.Bytes.alloc(len);
	this.readFullBytes(b,0,len);
	return b.toString();
}
haxe.io.Input.prototype.readUInt16 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	return (this.bigEndian?ch2 | (ch1 << 8):ch1 | (ch2 << 8));
}
haxe.io.Input.prototype.readUInt24 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	return (this.bigEndian?(ch3 | (ch2 << 8)) | (ch1 << 16):(ch1 | (ch2 << 8)) | (ch3 << 16));
}
haxe.io.Input.prototype.readUInt30 = function() {
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var ch4 = this.readByte();
	if(((this.bigEndian?ch1:ch4)) >= 64) throw haxe.io.Error.Overflow;
	return (this.bigEndian?((ch4 | (ch3 << 8)) | (ch2 << 16)) | (ch1 << 24):((ch1 | (ch2 << 8)) | (ch3 << 16)) | (ch4 << 24));
}
haxe.io.Input.prototype.readUntil = function(end) {
	var buf = new StringBuf();
	var last;
	while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
	return buf.b;
}
haxe.io.Input.prototype.setEndian = function(b) {
	this.bigEndian = b;
	return b;
}
haxe.io.Input.prototype.__class__ = haxe.io.Input;
StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return (s.length >= start.length && s.substr(0,start.length) == start);
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return (slen >= elen && s.substr(slen - elen,elen) == end);
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return (c >= 9 && c <= 13) || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) {
		r++;
	}
	if(r > 0) return s.substr(r,l - r);
	else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) {
		r++;
	}
	if(r > 0) {
		return s.substr(0,l - r);
	}
	else {
		return s;
	}
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			s += c.substr(0,l - sl);
			sl = l;
		}
		else {
			s += c;
			sl += cl;
		}
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			ns += c.substr(0,l - sl);
			sl = l;
		}
		else {
			ns += c;
			sl += cl;
		}
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var neg = false;
	if(n < 0) {
		neg = true;
		n = -n;
	}
	var s = n.toString(16);
	s = s.toUpperCase();
	if(digits != null) while(s.length < digits) s = "0" + s;
	if(neg) s = "-" + s;
	return s;
}
StringTools.prototype.__class__ = StringTools;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it2 = arr.iterator();
	while( $it2.hasNext() ) { var t = $it2.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e3 ) {
		{
			var e = $e3;
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
		catch( $e4 ) {
			{
				var e = $e4;
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
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
JSMain = function() { }
JSMain.__name__ = ["JSMain"];
JSMain.main = function() {
	null;
}
JSMain.getSource = function() {
	return js.Lib.document.getElementById("script").value;
}
JSMain.compile = function() {
	var scanner = new xpde.parser.Scanner(new haxe.io.StringInput(JSMain.getSource()));
	var parser = new xpde.parser.Parser(scanner);
	var program = parser.Parse();
	var compiler = new xpde.compiler.JSCompiler();
	haxe.Log.trace(compiler.compile(program.getCompilationUnit("Sketch")),{ fileName : "JSMain.hx", lineNumber : 34, className : "JSMain", methodName : "compile"});
	haxe.Log.trace("#DONE#",{ fileName : "JSMain.hx", lineNumber : 35, className : "JSMain", methodName : "compile"});
}
JSMain.interpret = function() {
	var scanner = new xpde.parser.Scanner(new haxe.io.StringInput(JSMain.getSource()));
	var parser = new xpde.parser.Parser(scanner);
	var program = parser.Parse();
	var interpreter = new xpde.interpreter.JSInterpreter();
	interpreter.interpret(program.getCompilationUnit("Sketch"));
}
JSMain.prototype.__class__ = JSMain;
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
haxe.Int32 = function() { }
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return (a << 16) | b;
}
haxe.Int32.ofInt = function(x) {
	return x;
}
haxe.Int32.toInt = function(x) {
	if((((x) >> 30) & 1) != ((x) >>> 31)) throw "Overflow " + x;
	return ((x) & -1);
}
haxe.Int32.add = function(a,b) {
	return (a) + (b);
}
haxe.Int32.sub = function(a,b) {
	return (a) - (b);
}
haxe.Int32.mul = function(a,b) {
	return (a) * (b);
}
haxe.Int32.div = function(a,b) {
	return Std["int"]((a) / (b));
}
haxe.Int32.mod = function(a,b) {
	return (a) % (b);
}
haxe.Int32.shl = function(a,b) {
	return (a) << b;
}
haxe.Int32.shr = function(a,b) {
	return (a) >> b;
}
haxe.Int32.ushr = function(a,b) {
	return (a) >>> b;
}
haxe.Int32.and = function(a,b) {
	return (a) & (b);
}
haxe.Int32.or = function(a,b) {
	return (a) | (b);
}
haxe.Int32.xor = function(a,b) {
	return (a) ^ (b);
}
haxe.Int32.neg = function(a) {
	return -(a);
}
haxe.Int32.complement = function(a) {
	return ~(a);
}
haxe.Int32.compare = function(a,b) {
	return (a) - (b);
}
haxe.Int32.prototype.__class__ = haxe.Int32;
xpde = {}
xpde.compiler = {}
xpde.compiler.JSCompiler = function(p) { if( p === $_ ) return; {
	null;
}}
xpde.compiler.JSCompiler.__name__ = ["xpde","compiler","JSCompiler"];
xpde.compiler.JSCompiler.prototype.classDef = null;
xpde.compiler.JSCompiler.prototype.compile = function(unit) {
	this.output = new StringBuf();
	this.packageIdent = ["window"].concat(unit.packageIdent);
	this.packageIdentString = this.packageIdent.join(".") + ".";
	this.output.b += "(function () {\n";
	this.output.b += "var PApplet = xpde.core.PApplet;\n\n";
	{
		var _g = 0, _g1 = unit.definitions;
		while(_g < _g1.length) {
			var definition = _g1[_g];
			++_g;
			this.compileDefinition(definition);
			this.output.b += "\n";
		}
	}
	this.output.b += "})()";
	return this.output.b;
}
xpde.compiler.JSCompiler.prototype.compileDefinition = function(definition) {
	var $e = (definition);
	switch( $e[1] ) {
	case 0:
	var body = $e[6], params = $e[5], modifiers = $e[4], type = $e[3], identifier = $e[2];
	{
		if(this.classDef != null) this.output.b += this.classDef + identifier + " = ";
		this.output.b += "function";
		this.output.b += " " + identifier + "(";
		{
			var _g1 = 0, _g = params.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileFormalParameter(params[i]);
				if(i < params.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ") {with(this){";
		var tmp = this.classDef;
		this.classDef = null;
		this.compileStatement(body);
		this.classDef = tmp;
		this.output.b += "}};\n";
	}break;
	case 1:
	var modifiers = $e[4], type = $e[3], identifier = $e[2];
	{
		if(this.classDef != null) this.output.b += this.classDef + identifier + " = ";
		else this.output.b += "var";
		this.output.b += " " + identifier + ";\n";
	}break;
	case 2:
	var init = $e[8], clinit = $e[7], implement = $e[6], extend = $e[5], definitions = $e[4], modifiers = $e[3], identifier = $e[2];
	{
		this.output.b += this.packageIdentString + identifier + " = function () {\n";
		if(extend != null) {
			this.compileType(extend);
			this.output.b += ".apply(this, arguments);\n";
		}
		this.output.b += "with(this){\n";
		if(init != null) {
			this.compileStatement(init);
		}
		this.output.b += "}};\n";
		this.output.b += this.packageIdentString + identifier + ".__name__ = [\"" + this.packageIdent.concat([identifier]).join("\",\"") + "\"];\n";
		this.output.b += this.packageIdentString + identifier + ".prototype.__class__ = " + this.packageIdentString + identifier + ";\n";
		var tmp = this.classDef;
		this.classDef = this.packageIdentString + identifier + ".prototype.";
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition1 = definitions[_g];
				++_g;
				this.compileDefinition(definition1);
			}
		}
		this.classDef = tmp;
	}break;
	}
}
xpde.compiler.JSCompiler.prototype.compileExpression = function(expression) {
	var $e = (expression);
	switch( $e[1] ) {
	case 0:
	var base = $e[3], index = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "[";
		this.compileExpression(index);
		this.output.b += "]";
	}break;
	case 2:
	var value = $e[4], base = $e[3], index = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "[";
		this.compileExpression(index);
		this.output.b += "]";
		this.output.b += " = ";
		this.compileExpression(value);
	}break;
	case 3:
	var value = $e[4], base = $e[3], identifier = $e[2];
	{
		if(base != null) {
			this.compileExpression(base);
			this.output.b += ".";
		}
		this.output.b += identifier;
		this.output.b += " = ";
		this.compileExpression(value);
	}break;
	case 4:
	var args = $e[3], method = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(method);
		this.output.b += ")(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 5:
	var args = $e[4], base = $e[3], identifier = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "." + identifier;
		this.output.b += "(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 6:
	var expression1 = $e[3], type = $e[2];
	{
		this.output.b += "(";
		this.compileType(type);
		this.output.b += ") (";
		this.compileExpression(expression1);
		this.output.b += ")";
	}break;
	case 7:
	var elseExpression = $e[4], thenExpression = $e[3], condition = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(condition);
		this.output.b += " ? ";
		this.compileExpression(thenExpression);
		this.output.b += " : ";
		this.compileExpression(elseExpression);
		this.output.b += ")";
	}break;
	case 8:
	var type = $e[3], expression1 = $e[2];
	{
		this.compileExpression(expression1);
		this.output.b += " instanceof ";
		this.compileType(type);
	}break;
	case 9:
	var args = $e[3], qualifier = $e[2];
	{
		this.output.b += "new " + qualifier.join(".") + "(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 10:
	var reference = $e[3], type = $e[2];
	{
		this.compileIncrementType(type);
		this.output.b += "(";
		this.compileExpression(reference);
		this.output.b += ")";
	}break;
	case 11:
	var reference = $e[3], type = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(reference);
		this.output.b += ")";
		this.compileIncrementType(type);
	}break;
	case 12:
	var base = $e[3], identifier = $e[2];
	{
		if(base != null) {
			this.compileExpression(base);
			this.output.b += ".";
		}
		this.output.b += identifier;
	}break;
	case 13:
	{
		this.output.b += "super";
	}break;
	case 14:
	{
		this.output.b += "this";
	}break;
	case 16:
	var rightOperand = $e[4], leftOperand = $e[3], operator = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(leftOperand);
		this.compileInfixOperator(operator);
		this.compileExpression(rightOperand);
		this.output.b += ")";
	}break;
	case 15:
	var operand = $e[3], operator = $e[2];
	{
		this.compilePrefixOperator(operator);
		this.output.b += "(";
		this.compileExpression(operand);
		this.output.b += ")";
	}break;
	case 17:
	var values = $e[2];
	{
		this.output.b += "{";
		{
			var _g1 = 0, _g = values.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(values[i]);
				if(i < values.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += "}";
	}break;
	case 18:
	var value = $e[2];
	{
		this.output.b += "\"" + StringTools.replace(value,"\"","\\\"") + "\"";
	}break;
	case 19:
	var value = $e[2];
	{
		this.output.b += Std.string(value);
	}break;
	case 20:
	var value = $e[2];
	{
		this.output.b += Std.string(value);
	}break;
	case 21:
	var value = $e[2];
	{
		this.output.b += "'" + String.fromCharCode(value) + "'";
	}break;
	case 22:
	var value = $e[2];
	{
		this.output.b += (value?"true":"false");
	}break;
	case 23:
	{
		this.output.b += "null";
	}break;
	default:{
		null;
	}break;
	}
}
xpde.compiler.JSCompiler.prototype.compileFormalParameter = function(parameter) {
	this.output.b += parameter.identifier;
}
xpde.compiler.JSCompiler.prototype.compileIncrementType = function(type) {
	this.output.b += function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 0:
		{
			$r = "++";
		}break;
		case 1:
		{
			$r = "--";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.JSCompiler.prototype.compileInfixOperator = function(operator) {
	this.output.b += function($this) {
		var $r;
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		{
			$r = "||";
		}break;
		case 1:
		{
			$r = "&&";
		}break;
		case 2:
		{
			$r = "|";
		}break;
		case 3:
		{
			$r = "^";
		}break;
		case 4:
		{
			$r = "&";
		}break;
		case 5:
		{
			$r = "==";
		}break;
		case 6:
		{
			$r = "!=";
		}break;
		case 7:
		{
			$r = "<";
		}break;
		case 8:
		{
			$r = "<=";
		}break;
		case 9:
		{
			$r = ">";
		}break;
		case 10:
		{
			$r = ">=";
		}break;
		case 11:
		{
			$r = "<<";
		}break;
		case 12:
		{
			$r = ">>";
		}break;
		case 13:
		{
			$r = ">>>";
		}break;
		case 14:
		{
			$r = "+";
		}break;
		case 15:
		{
			$r = "-";
		}break;
		case 16:
		{
			$r = "*";
		}break;
		case 17:
		{
			$r = "/";
		}break;
		case 18:
		{
			$r = "%";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.JSCompiler.prototype.compileModifiers = function(modifiers) {
	{ var $it5 = modifiers.iterator();
	while( $it5.hasNext() ) { var modifier = $it5.next();
	var $e = (modifier);
	switch( $e[1] ) {
	case 0:
	{
		this.output.b += "public ";
	}break;
	case 1:
	{
		this.output.b += "private ";
	}break;
	case 2:
	{
		this.output.b += "protected ";
	}break;
	case 3:
	{
		this.output.b += "static ";
	}break;
	case 4:
	{
		this.output.b += "final ";
	}break;
	case 5:
	{
		this.output.b += "synchronized ";
	}break;
	case 6:
	{
		this.output.b += "volatile ";
	}break;
	case 7:
	{
		this.output.b += "transient ";
	}break;
	case 8:
	{
		this.output.b += "native ";
	}break;
	case 9:
	{
		this.output.b += "abstract ";
	}break;
	case 10:
	{
		this.output.b += "strictfp ";
	}break;
	}
	}}
}
xpde.compiler.JSCompiler.prototype.compilePrefixOperator = function(operator) {
	this.output.b += function($this) {
		var $r;
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		{
			$r = "!";
		}break;
		case 1:
		{
			$r = "~";
		}break;
		case 2:
		{
			$r = "+";
		}break;
		case 3:
		{
			$r = "-";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.JSCompiler.prototype.compileStatement = function(statement) {
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var statements = $e[3], definitions = $e[2];
	{
		this.output.b += "{\n";
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition = definitions[_g];
				++_g;
				this.compileDefinition(definition);
			}
		}
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				this.compileStatement(statement1);
			}
		}
		this.output.b += "}\n";
	}break;
	case 1:
	var label = $e[2];
	{
		this.output.b += "break";
		if(label != null) this.output.b += " " + label;
		this.output.b += ";\n";
	}break;
	case 2:
	var elseBlock = $e[4], thenBlock = $e[3], condition = $e[2];
	{
		this.output.b += "if (";
		this.compileExpression(condition);
		this.output.b += ") ";
		this.compileStatement(thenBlock);
		if(elseBlock != null) {
			this.output.b += "else ";
			this.compileStatement(elseBlock);
		}
	}break;
	case 3:
	var label = $e[2];
	{
		this.output.b += "continue";
		if(label != null) this.output.b += " " + label;
		this.output.b += ";\n";
	}break;
	case 4:
	var expression = $e[2];
	{
		this.compileExpression(expression);
		this.output.b += ";\n";
	}break;
	case 5:
	var body = $e[3], label = $e[2];
	{
		this.output.b += label + ": ";
		this.compileStatement(body);
	}break;
	case 6:
	var doLoop = $e[4], body = $e[3], condition = $e[2];
	{
		if(doLoop) {
			this.output.b += "do ";
			this.compileStatement(body);
			this.output.b += "while (";
			this.compileExpression(condition);
			this.output.b += ");\n";
		}
		else {
			this.output.b += "while (";
			this.compileExpression(condition);
			this.output.b += ") ";
			this.compileStatement(body);
		}
	}break;
	case 7:
	var value = $e[2];
	{
		this.output.b += "return";
		if(value != null) {
			this.output.b += " ";
			this.compileExpression(value);
		}
		this.output.b += ";\n";
	}break;
	case 8:
	var expression = $e[2];
	{
		this.output.b += "throw";
		this.compileExpression(expression);
		this.output.b += ";\n";
	}break;
	case 9:
	var finallyBody = $e[4], catches = $e[3], body = $e[2];
	{
		this.output.b += "try ";
		this.compileStatement(body);
		if(catches != null) {
			{
				var _g = 0;
				while(_g < catches.length) {
					var katch = catches[_g];
					++_g;
					this.output.b += "catch (";
					this.compileFormalParameter(katch.parameter);
					this.output.b += ")";
					this.compileStatement(katch.body);
				}
			}
		}
		if(finallyBody != null) {
			this.output.b += "finally\n";
			this.compileStatement(finallyBody);
		}
	}break;
	default:{
		null;
	}break;
	}
}
xpde.compiler.JSCompiler.prototype.compileType = function(type) {
	if(type == null) {
		this.output.b += "void";
		return;
	}
	var $e = (type);
	switch( $e[1] ) {
	case 0:
	var type1 = $e[2];
	{
		var $e = (type1);
		switch( $e[1] ) {
		case 0:
		{
			this.output.b += "byte";
		}break;
		case 1:
		{
			this.output.b += "short";
		}break;
		case 2:
		{
			this.output.b += "int";
		}break;
		case 3:
		{
			this.output.b += "long";
		}break;
		case 4:
		{
			this.output.b += "float";
		}break;
		case 5:
		{
			this.output.b += "double";
		}break;
		case 6:
		{
			this.output.b += "char";
		}break;
		case 7:
		{
			this.output.b += "boolean";
		}break;
		}
	}break;
	case 1:
	var qualident = $e[2];
	{
		this.output.b += qualident.join(".");
	}break;
	case 2:
	var dimensions = $e[3], type1 = $e[2];
	{
		this.compileType(type1);
		{
			var _g = 0;
			while(_g < dimensions) {
				var i = _g++;
				this.output.b += "[]";
			}
		}
	}break;
	}
}
xpde.compiler.JSCompiler.prototype.output = null;
xpde.compiler.JSCompiler.prototype.packageIdent = null;
xpde.compiler.JSCompiler.prototype.packageIdentString = null;
xpde.compiler.JSCompiler.prototype.__class__ = xpde.compiler.JSCompiler;
haxe.io.BytesInput = function(b,pos,len) { if( b === $_ ) return; {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
}}
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
for(var k in haxe.io.Input.prototype ) haxe.io.BytesInput.prototype[k] = haxe.io.Input.prototype[k];
haxe.io.BytesInput.prototype.b = null;
haxe.io.BytesInput.prototype.len = null;
haxe.io.BytesInput.prototype.pos = null;
haxe.io.BytesInput.prototype.readByte = function() {
	if(this.len == 0) throw new haxe.io.Eof();
	this.len--;
	return this.b[this.pos++];
}
haxe.io.BytesInput.prototype.readBytes = function(buf,pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.b.length) throw haxe.io.Error.OutsideBounds;
	if(this.len == 0 && len > 0) throw new haxe.io.Eof();
	if(this.len < len) len = this.len;
	var b1 = this.b;
	var b2 = buf.b;
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
	}
	this.pos += len;
	this.len -= len;
	return len;
}
haxe.io.BytesInput.prototype.__class__ = haxe.io.BytesInput;
haxe.io.StringInput = function(s) { if( s === $_ ) return; {
	haxe.io.BytesInput.apply(this,[haxe.io.Bytes.ofString(s)]);
}}
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
for(var k in haxe.io.BytesInput.prototype ) haxe.io.StringInput.prototype[k] = haxe.io.BytesInput.prototype[k];
haxe.io.StringInput.prototype.__class__ = haxe.io.StringInput;
xpde.compiler.SourceCompiler = function(p) { if( p === $_ ) return; {
	null;
}}
xpde.compiler.SourceCompiler.__name__ = ["xpde","compiler","SourceCompiler"];
xpde.compiler.SourceCompiler.prototype.compile = function(unit) {
	this.output = new StringBuf();
	this.output.b += "package " + unit.packageIdent.join(".") + ";\n\n";
	{
		var _g = 0, _g1 = unit.importIdents;
		while(_g < _g1.length) {
			var imp = _g1[_g];
			++_g;
			this.output.b += "import " + imp.join(".") + ";\n";
		}
	}
	this.output.b += "\n";
	{
		var _g = 0, _g1 = unit.definitions;
		while(_g < _g1.length) {
			var definition = _g1[_g];
			++_g;
			this.compileDefinition(definition);
			this.output.b += "\n";
		}
	}
	return this.output.b;
}
xpde.compiler.SourceCompiler.prototype.compileDefinition = function(definition) {
	var $e = (definition);
	switch( $e[1] ) {
	case 0:
	var body = $e[6], params = $e[5], modifiers = $e[4], type = $e[3], identifier = $e[2];
	{
		this.compileModifiers(modifiers);
		this.compileType(type);
		this.output.b += " " + identifier + "(";
		{
			var _g1 = 0, _g = params.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileFormalParameter(params[i]);
				if(i < params.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ") ";
		this.compileStatement(body);
	}break;
	case 1:
	var modifiers = $e[4], type = $e[3], identifier = $e[2];
	{
		this.compileModifiers(modifiers);
		this.compileType(type);
		this.output.b += " " + identifier + ";\n";
	}break;
	case 2:
	var init = $e[8], clinit = $e[7], implement = $e[6], extend = $e[5], definitions = $e[4], modifiers = $e[3], identifier = $e[2];
	{
		this.compileModifiers(modifiers);
		this.output.b += "class " + identifier;
		if(extend != null) {
			this.output.b += " extends ";
			this.compileType(extend);
		}
		this.output.b += " {\n";
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition1 = definitions[_g];
				++_g;
				this.compileDefinition(definition1);
				this.output.b += "\n";
			}
		}
		if(clinit != null) {
			this.output.b += "static ";
			this.compileStatement(clinit);
		}
		if(init != null) {
			this.compileStatement(init);
		}
		this.output.b += "}\n";
	}break;
	}
}
xpde.compiler.SourceCompiler.prototype.compileExpression = function(expression) {
	var $e = (expression);
	switch( $e[1] ) {
	case 0:
	var base = $e[3], index = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "[";
		this.compileExpression(index);
		this.output.b += "]";
	}break;
	case 2:
	var value = $e[4], base = $e[3], index = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "[";
		this.compileExpression(index);
		this.output.b += "]";
		this.output.b += " = ";
		this.compileExpression(value);
	}break;
	case 3:
	var value = $e[4], base = $e[3], identifier = $e[2];
	{
		if(base != null) {
			this.compileExpression(base);
			this.output.b += ".";
		}
		this.output.b += identifier;
		this.output.b += " = ";
		this.compileExpression(value);
	}break;
	case 4:
	var args = $e[3], method = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(method);
		this.output.b += ")(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 5:
	var args = $e[4], base = $e[3], identifier = $e[2];
	{
		this.compileExpression(base);
		this.output.b += "." + identifier;
		this.output.b += "(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 6:
	var expression1 = $e[3], type = $e[2];
	{
		this.output.b += "(";
		this.compileType(type);
		this.output.b += ") (";
		this.compileExpression(expression1);
		this.output.b += ")";
	}break;
	case 7:
	var elseExpression = $e[4], thenExpression = $e[3], condition = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(condition);
		this.output.b += " ? ";
		this.compileExpression(thenExpression);
		this.output.b += " : ";
		this.compileExpression(elseExpression);
		this.output.b += ")";
	}break;
	case 8:
	var type = $e[3], expression1 = $e[2];
	{
		this.compileExpression(expression1);
		this.output.b += " instanceof ";
		this.compileType(type);
	}break;
	case 9:
	var args = $e[3], qualifier = $e[2];
	{
		this.output.b += "new " + qualifier.join(".") + "(";
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(args[i]);
				if(i < args.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += ")";
	}break;
	case 10:
	var reference = $e[3], type = $e[2];
	{
		this.compileIncrementType(type);
		this.output.b += "(";
		this.compileExpression(reference);
		this.output.b += ")";
	}break;
	case 11:
	var reference = $e[3], type = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(reference);
		this.output.b += ")";
		this.compileIncrementType(type);
	}break;
	case 12:
	var base = $e[3], identifier = $e[2];
	{
		if(base != null) {
			this.compileExpression(base);
			this.output.b += ".";
		}
		this.output.b += identifier;
	}break;
	case 13:
	{
		this.output.b += "super";
	}break;
	case 14:
	{
		this.output.b += "this";
	}break;
	case 16:
	var rightOperand = $e[4], leftOperand = $e[3], operator = $e[2];
	{
		this.output.b += "(";
		this.compileExpression(leftOperand);
		this.compileInfixOperator(operator);
		this.compileExpression(rightOperand);
		this.output.b += ")";
	}break;
	case 15:
	var operand = $e[3], operator = $e[2];
	{
		this.compilePrefixOperator(operator);
		this.output.b += "(";
		this.compileExpression(operand);
		this.output.b += ")";
	}break;
	case 17:
	var values = $e[2];
	{
		this.output.b += "{";
		{
			var _g1 = 0, _g = values.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.compileExpression(values[i]);
				if(i < values.length - 1) this.output.b += ", ";
			}
		}
		this.output.b += "}";
	}break;
	case 18:
	var value = $e[2];
	{
		this.output.b += "\"" + StringTools.replace(value,"\"","\\\"") + "\"";
	}break;
	case 19:
	var value = $e[2];
	{
		this.output.b += Std.string(value);
	}break;
	case 20:
	var value = $e[2];
	{
		this.output.b += Std.string(value);
	}break;
	case 21:
	var value = $e[2];
	{
		this.output.b += "'" + String.fromCharCode(value) + "'";
	}break;
	case 22:
	var value = $e[2];
	{
		this.output.b += (value?"true":"false");
	}break;
	case 23:
	{
		this.output.b += "null";
	}break;
	default:{
		null;
	}break;
	}
}
xpde.compiler.SourceCompiler.prototype.compileFormalParameter = function(parameter) {
	this.compileModifiers(parameter.modifiers);
	this.compileType(parameter.type);
	this.output.b += " " + parameter.identifier;
}
xpde.compiler.SourceCompiler.prototype.compileIncrementType = function(type) {
	this.output.b += function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 0:
		{
			$r = "++";
		}break;
		case 1:
		{
			$r = "--";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.SourceCompiler.prototype.compileInfixOperator = function(operator) {
	this.output.b += function($this) {
		var $r;
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		{
			$r = "||";
		}break;
		case 1:
		{
			$r = "&&";
		}break;
		case 2:
		{
			$r = "|";
		}break;
		case 3:
		{
			$r = "^";
		}break;
		case 4:
		{
			$r = "&";
		}break;
		case 5:
		{
			$r = "==";
		}break;
		case 6:
		{
			$r = "!=";
		}break;
		case 7:
		{
			$r = "<";
		}break;
		case 8:
		{
			$r = "<=";
		}break;
		case 9:
		{
			$r = ">";
		}break;
		case 10:
		{
			$r = ">=";
		}break;
		case 11:
		{
			$r = "<<";
		}break;
		case 12:
		{
			$r = ">>";
		}break;
		case 13:
		{
			$r = ">>>";
		}break;
		case 14:
		{
			$r = "+";
		}break;
		case 15:
		{
			$r = "-";
		}break;
		case 16:
		{
			$r = "*";
		}break;
		case 17:
		{
			$r = "/";
		}break;
		case 18:
		{
			$r = "%";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.SourceCompiler.prototype.compileModifiers = function(modifiers) {
	{ var $it6 = modifiers.iterator();
	while( $it6.hasNext() ) { var modifier = $it6.next();
	var $e = (modifier);
	switch( $e[1] ) {
	case 0:
	{
		this.output.b += "public ";
	}break;
	case 1:
	{
		this.output.b += "private ";
	}break;
	case 2:
	{
		this.output.b += "protected ";
	}break;
	case 3:
	{
		this.output.b += "static ";
	}break;
	case 4:
	{
		this.output.b += "final ";
	}break;
	case 5:
	{
		this.output.b += "synchronized ";
	}break;
	case 6:
	{
		this.output.b += "volatile ";
	}break;
	case 7:
	{
		this.output.b += "transient ";
	}break;
	case 8:
	{
		this.output.b += "native ";
	}break;
	case 9:
	{
		this.output.b += "abstract ";
	}break;
	case 10:
	{
		this.output.b += "strictfp ";
	}break;
	}
	}}
}
xpde.compiler.SourceCompiler.prototype.compilePrefixOperator = function(operator) {
	this.output.b += function($this) {
		var $r;
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		{
			$r = "!";
		}break;
		case 1:
		{
			$r = "~";
		}break;
		case 2:
		{
			$r = "+";
		}break;
		case 3:
		{
			$r = "-";
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.compiler.SourceCompiler.prototype.compileStatement = function(statement) {
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var statements = $e[3], definitions = $e[2];
	{
		this.output.b += "{\n";
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition = definitions[_g];
				++_g;
				this.compileDefinition(definition);
			}
		}
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				this.compileStatement(statement1);
			}
		}
		this.output.b += "}\n";
	}break;
	case 1:
	var label = $e[2];
	{
		this.output.b += "break";
		if(label != null) this.output.b += " " + label;
		this.output.b += ";\n";
	}break;
	case 2:
	var elseBlock = $e[4], thenBlock = $e[3], condition = $e[2];
	{
		this.output.b += "if (";
		this.compileExpression(condition);
		this.output.b += ") ";
		this.compileStatement(thenBlock);
		if(elseBlock != null) {
			this.output.b += "else ";
			this.compileStatement(elseBlock);
		}
	}break;
	case 3:
	var label = $e[2];
	{
		this.output.b += "continue";
		if(label != null) this.output.b += " " + label;
		this.output.b += ";\n";
	}break;
	case 4:
	var expression = $e[2];
	{
		this.compileExpression(expression);
		this.output.b += ";\n";
	}break;
	case 5:
	var body = $e[3], label = $e[2];
	{
		this.output.b += label + ": ";
		this.compileStatement(body);
	}break;
	case 6:
	var doLoop = $e[4], body = $e[3], condition = $e[2];
	{
		if(doLoop) {
			this.output.b += "do ";
			this.compileStatement(body);
			this.output.b += "while (";
			this.compileExpression(condition);
			this.output.b += ");\n";
		}
		else {
			this.output.b += "while (";
			this.compileExpression(condition);
			this.output.b += ") ";
			this.compileStatement(body);
		}
	}break;
	case 7:
	var value = $e[2];
	{
		this.output.b += "return";
		if(value != null) {
			this.output.b += " ";
			this.compileExpression(value);
		}
		this.output.b += ";\n";
	}break;
	case 8:
	var expression = $e[2];
	{
		this.output.b += "throw";
		this.compileExpression(expression);
		this.output.b += ";\n";
	}break;
	case 9:
	var finallyBody = $e[4], catches = $e[3], body = $e[2];
	{
		this.output.b += "try ";
		this.compileStatement(body);
		if(catches != null) {
			{
				var _g = 0;
				while(_g < catches.length) {
					var katch = catches[_g];
					++_g;
					this.output.b += "catch (";
					this.compileFormalParameter(katch.parameter);
					this.output.b += ")";
					this.compileStatement(katch.body);
				}
			}
		}
		if(finallyBody != null) {
			this.output.b += "finally\n";
			this.compileStatement(finallyBody);
		}
	}break;
	default:{
		null;
	}break;
	}
}
xpde.compiler.SourceCompiler.prototype.compileType = function(type) {
	if(type == null) {
		this.output.b += "void";
		return;
	}
	var $e = (type);
	switch( $e[1] ) {
	case 0:
	var type1 = $e[2];
	{
		var $e = (type1);
		switch( $e[1] ) {
		case 0:
		{
			this.output.b += "byte";
		}break;
		case 1:
		{
			this.output.b += "short";
		}break;
		case 2:
		{
			this.output.b += "int";
		}break;
		case 3:
		{
			this.output.b += "long";
		}break;
		case 4:
		{
			this.output.b += "float";
		}break;
		case 5:
		{
			this.output.b += "double";
		}break;
		case 6:
		{
			this.output.b += "char";
		}break;
		case 7:
		{
			this.output.b += "boolean";
		}break;
		}
	}break;
	case 1:
	var qualident = $e[2];
	{
		this.output.b += qualident.join(".");
	}break;
	case 2:
	var dimensions = $e[3], type1 = $e[2];
	{
		this.compileType(type1);
		{
			var _g = 0;
			while(_g < dimensions) {
				var i = _g++;
				this.output.b += "[]";
			}
		}
	}break;
	}
}
xpde.compiler.SourceCompiler.prototype.output = null;
xpde.compiler.SourceCompiler.prototype.__class__ = xpde.compiler.SourceCompiler;
haxe.io.Bytes = function(length,b) { if( length === $_ ) return; {
	this.length = length;
	this.b = b;
}}
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	{
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			a.push(0);
		}
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	{
		var _g1 = 0, _g = s.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = s["cca"](i);
			if(c <= 127) a.push(c);
			else if(c <= 2047) {
				a.push(192 | (c >> 6));
				a.push(128 | (c & 63));
			}
			else if(c <= 65535) {
				a.push(224 | (c >> 12));
				a.push(128 | ((c >> 6) & 63));
				a.push(128 | (c & 63));
			}
			else {
				a.push(240 | (c >> 18));
				a.push(128 | ((c >> 12) & 63));
				a.push(128 | ((c >> 6) & 63));
				a.push(128 | (c & 63));
			}
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.blit = function(pos,src,srcpos,len) {
	if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	if(b1 == b2 && pos > srcpos) {
		var i = len;
		while(i > 0) {
			i--;
			b1[i + pos] = b2[i + srcpos];
		}
		return;
	}
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
}
haxe.io.Bytes.prototype.compare = function(other) {
	var b1 = this.b;
	var b2 = other.b;
	var len = ((this.length < other.length)?this.length:other.length);
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
	}
	return this.length - other.length;
}
haxe.io.Bytes.prototype.get = function(pos) {
	return this.b[pos];
}
haxe.io.Bytes.prototype.getData = function() {
	return this.b;
}
haxe.io.Bytes.prototype.length = null;
haxe.io.Bytes.prototype.readString = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	var s = "";
	var b = this.b;
	var fcc = $closure(String,"fromCharCode");
	var i = pos;
	var max = pos + len;
	while(i < max) {
		var c = b[i++];
		if(c < 128) {
			if(c == 0) break;
			s += fcc(c);
		}
		else if(c < 224) s += fcc(((c & 63) << 6) | (b[i++] & 127));
		else if(c < 240) {
			var c2 = b[i++];
			s += fcc((((c & 31) << 12) | ((c2 & 127) << 6)) | (b[i++] & 127));
		}
		else {
			var c2 = b[i++];
			var c3 = b[i++];
			s += fcc(((((c & 15) << 18) | ((c2 & 127) << 12)) | ((c3 << 6) & 127)) | (b[i++] & 127));
		}
	}
	return s;
}
haxe.io.Bytes.prototype.set = function(pos,v) {
	this.b[pos] = v;
}
haxe.io.Bytes.prototype.sub = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
}
haxe.io.Bytes.prototype.toString = function() {
	return this.readString(0,this.length);
}
haxe.io.Bytes.prototype.__class__ = haxe.io.Bytes;
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
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
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
xpde.parser = {}
xpde.parser.EnumSet = function(enums) { if( enums === $_ ) return; {
	this.set = [];
	if(enums != null) {
		var _g = 0;
		while(_g < enums.length) {
			var item = enums[_g];
			++_g;
			this.add(item);
		}
	}
}}
xpde.parser.EnumSet.__name__ = ["xpde","parser","EnumSet"];
xpde.parser.EnumSet.prototype.add = function(item) {
	if(!this.contains(item)) this.set.push(item);
}
xpde.parser.EnumSet.prototype.contains = function(itemA) {
	{
		var _g = 0, _g1 = this.set;
		while(_g < _g1.length) {
			var itemB = _g1[_g];
			++_g;
			if(Type.enumEq(itemA,itemB)) return true;
		}
	}
	return false;
}
xpde.parser.EnumSet.prototype.iterator = function() {
	return this.set.iterator();
}
xpde.parser.EnumSet.prototype.set = null;
xpde.parser.EnumSet.prototype.toString = function() {
	return this.set.join(" ");
}
xpde.parser.EnumSet.prototype.__class__ = xpde.parser.EnumSet;
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
	catch( $e7 ) {
		{
			var e = $e7;
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
	catch( $e8 ) {
		{
			var err = $e8;
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
js = {}
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
xpde.parser.Token = function(p) { if( p === $_ ) return; {
	null;
}}
xpde.parser.Token.__name__ = ["xpde","parser","Token"];
xpde.parser.Token.prototype.col = null;
xpde.parser.Token.prototype.kind = null;
xpde.parser.Token.prototype.line = null;
xpde.parser.Token.prototype.next = null;
xpde.parser.Token.prototype.pos = null;
xpde.parser.Token.prototype.val = null;
xpde.parser.Token.prototype.__class__ = xpde.parser.Token;
xpde.parser.Buffer = function(s) { if( s === $_ ) return; {
	this.pos = 0;
	this.bufChar = 0;
	this.stream = s;
	this.Read();
}}
xpde.parser.Buffer.__name__ = ["xpde","parser","Buffer"];
xpde.parser.Buffer.prototype.Peek = function() {
	return this.bufChar;
}
xpde.parser.Buffer.prototype.Read = function() {
	this.pos++;
	var ret = this.bufChar;
	try {
		this.bufChar = this.stream.readByte();
	}
	catch( $e9 ) {
		if( js.Boot.__instanceof($e9,haxe.io.Eof) ) {
			var e = $e9;
			{
				this.bufChar = xpde.parser.Buffer.EOF;
			}
		} else throw($e9);
	}
	return ret;
}
xpde.parser.Buffer.prototype.bufChar = null;
xpde.parser.Buffer.prototype.getPos = function() {
	return this.pos;
}
xpde.parser.Buffer.prototype.pos = null;
xpde.parser.Buffer.prototype.stream = null;
xpde.parser.Buffer.prototype.__class__ = xpde.parser.Buffer;
xpde.parser.StartStates = function(p) { if( p === $_ ) return; {
	this.tab = [];
}}
xpde.parser.StartStates.__name__ = ["xpde","parser","StartStates"];
xpde.parser.StartStates.prototype.set = function(key,val) {
	var e = new xpde.parser.Elem(key,val);
	var k = key % 128;
	e.next = this.tab[k];
	this.tab[k] = e;
}
xpde.parser.StartStates.prototype.state = function(key) {
	var e = this.tab[key % 128];
	while(e != null && e.key != key) e = e.next;
	return (e == null?0:e.val);
}
xpde.parser.StartStates.prototype.tab = null;
xpde.parser.StartStates.prototype.__class__ = xpde.parser.StartStates;
xpde.parser.Elem = function(key,val) { if( key === $_ ) return; {
	this.key = key;
	this.val = val;
}}
xpde.parser.Elem.__name__ = ["xpde","parser","Elem"];
xpde.parser.Elem.prototype.key = null;
xpde.parser.Elem.prototype.next = null;
xpde.parser.Elem.prototype.val = null;
xpde.parser.Elem.prototype.__class__ = xpde.parser.Elem;
Hash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
Hash.__name__ = ["Hash"];
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	}
	catch( $e10 ) {
		{
			var e = $e10;
			{
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				return false;
			}
		}
	}
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.h = null;
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}}
}
Hash.prototype.keys = function() {
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	return a.iterator();
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b += "{";
	var it = this.keys();
	{ var $it11 = it;
	while( $it11.hasNext() ) { var i = $it11.next();
	{
		s.b += i;
		s.b += " => ";
		s.b += Std.string(this.get(i));
		if(it.hasNext()) s.b += ", ";
	}
	}}
	s.b += "}";
	return s.b;
}
Hash.prototype.__class__ = Hash;
xpde.parser.Scanner = function(s) { if( s === $_ ) return; {
	this.tval = new StringBuf();
	this.buffer = new xpde.parser.Buffer(s);
	this.Init();
}}
xpde.parser.Scanner.__name__ = ["xpde","parser","Scanner"];
xpde.parser.Scanner.prototype.AddCh = function() {
	if(this.ch != xpde.parser.Buffer.EOF) {
		this.tval.b += String.fromCharCode(this.ch);
		this.NextCh();
	}
}
xpde.parser.Scanner.prototype.CheckLiteral = function() {
	var val = this.t.val;
	var kind = xpde.parser.Scanner.literals.get(val);
	if(kind != null) {
		this.t.kind = kind;
	}
}
xpde.parser.Scanner.prototype.Comment0 = function() {
	var level = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, nch = this.buffer.Peek();
	if(nch == 47) {
		this.NextCh();
		this.NextCh();
		while(true) {
			if(this.ch == 10) {
				level--;
				if(level == 0) {
					this.oldEols = this.line - line0;
					this.NextCh();
					return true;
				}
				this.NextCh();
			}
			else if(this.ch == xpde.parser.Buffer.EOF) return false;
			else this.NextCh();
		}
	}
	return false;
}
xpde.parser.Scanner.prototype.Comment1 = function() {
	var level = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, nch = this.buffer.Peek();
	if(nch == 42) {
		this.NextCh();
		this.NextCh();
		while(true) {
			if(this.ch == 42) {
				this.NextCh();
				if(this.ch == 47) {
					level--;
					if(level == 0) {
						this.oldEols = this.line - line0;
						this.NextCh();
						return true;
					}
					this.NextCh();
				}
			}
			else if(this.ch == xpde.parser.Buffer.EOF) return false;
			else this.NextCh();
		}
	}
	return false;
}
xpde.parser.Scanner.prototype.Init = function() {
	this.pos = -1;
	this.line = 1;
	this.col = 0;
	this.oldEols = 0;
	this.NextCh();
	this.pt = this.tokens = new xpde.parser.Token();
}
xpde.parser.Scanner.prototype.NextCh = function() {
	if(this.oldEols > 0) {
		this.ch = xpde.parser.Scanner.EOL;
		this.oldEols--;
	}
	else {
		this.pos = this.buffer.getPos();
		this.ch = this.buffer.Read();
		this.col++;
		if(this.ch == 13 && this.buffer.Peek() != 10) this.ch = xpde.parser.Scanner.EOL;
		if(this.ch == xpde.parser.Scanner.EOL) {
			this.line++;
			this.col = 0;
		}
	}
}
xpde.parser.Scanner.prototype.NextToken = function() {
	while(this.ch == 32 || this.ch >= 9 && this.ch <= 10 || this.ch == 13) this.NextCh();
	if(this.ch == 47 && this.Comment0() || this.ch == 47 && this.Comment1()) return this.NextToken();
	this.t = new xpde.parser.Token();
	this.t.pos = this.pos;
	this.t.col = this.col;
	this.t.line = this.line;
	var state = xpde.parser.Scanner.start.state(this.ch);
	this.tlen = 0;
	this.AddCh();
	try {
		while(true) {
			switch(state) {
			case -1:{
				this.t.kind = xpde.parser.Scanner.eofSym;
				throw "__break__";
			}break;
			case 0:{
				this.t.kind = xpde.parser.Scanner.noSym;
				throw "__break__";
			}break;
			case 1:{
				if(this.ch == 36 || this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 90 || this.ch == 95 || this.ch >= 97 && this.ch <= 122) {
					this.AddCh();
					state = 1;
				}
				else {
					this.t.kind = 1;
					this.t.val = this.tval.b;
					this.tval = new StringBuf();
					this.CheckLiteral();
					return this.t;
				}
			}break;
			case 2:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 3;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 3:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 3;
				}
				else if(this.ch == 76 || this.ch == 108) {
					this.AddCh();
					state = 4;
				}
				else {
					this.t.kind = 2;
					throw "__break__";
				}
			}break;
			case 4:{
				{
					this.t.kind = 2;
					throw "__break__";
				}
			}break;
			case 5:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 5;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 6;
				}
				else {
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 6:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 8;
				}
				else if(this.ch == 43 || this.ch == 45) {
					this.AddCh();
					state = 7;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 7:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 8;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 8:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 8;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 9:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 9;
				}
				else if(this.ch == 46) {
					this.AddCh();
					state = 10;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 14;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 10:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 10;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 11;
				}
				else {
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 11:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 13;
				}
				else if(this.ch == 43 || this.ch == 45) {
					this.AddCh();
					state = 12;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 12:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 13;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 13:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 13;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 14:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 16;
				}
				else if(this.ch == 43 || this.ch == 45) {
					this.AddCh();
					state = 15;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 15:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 16;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 16:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 16;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 17:{
				{
					this.t.kind = 3;
					throw "__break__";
				}
			}break;
			case 18:{
				if(this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 38 || this.ch >= 40 && this.ch <= 91 || this.ch >= 93 && this.ch <= 65535) {
					this.AddCh();
					state = 19;
				}
				else if(this.ch == 92) {
					this.AddCh();
					state = 20;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 19:{
				if(this.ch == 39) {
					this.AddCh();
					state = 26;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 20:{
				if(this.ch >= 48 && this.ch <= 51) {
					this.AddCh();
					state = 49;
				}
				else if(this.ch >= 52 && this.ch <= 55) {
					this.AddCh();
					state = 25;
				}
				else if(this.ch == 34 || this.ch == 39 || this.ch == 92 || this.ch == 98 || this.ch == 102 || this.ch == 110 || this.ch == 114 || this.ch == 116) {
					this.AddCh();
					state = 19;
				}
				else if(this.ch == 117) {
					this.AddCh();
					state = 21;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 21:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 22;
				}
				else if(this.ch == 117) {
					this.AddCh();
					state = 21;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 22:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 23;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 23:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 24;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 24:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 19;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 25:{
				if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 19;
				}
				else if(this.ch == 39) {
					this.AddCh();
					state = 26;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 26:{
				{
					this.t.kind = 4;
					throw "__break__";
				}
			}break;
			case 27:{
				if(this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 || this.ch >= 35 && this.ch <= 91 || this.ch >= 93 && this.ch <= 65535) {
					this.AddCh();
					state = 27;
				}
				else if(this.ch == 34) {
					this.AddCh();
					state = 34;
				}
				else if(this.ch == 92) {
					this.AddCh();
					state = 28;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 28:{
				if(this.ch >= 48 && this.ch <= 51) {
					this.AddCh();
					state = 51;
				}
				else if(this.ch >= 52 && this.ch <= 55) {
					this.AddCh();
					state = 33;
				}
				else if(this.ch == 34 || this.ch == 39 || this.ch == 92 || this.ch == 98 || this.ch == 102 || this.ch == 110 || this.ch == 114 || this.ch == 116) {
					this.AddCh();
					state = 27;
				}
				else if(this.ch == 117) {
					this.AddCh();
					state = 29;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 29:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 30;
				}
				else if(this.ch == 117) {
					this.AddCh();
					state = 29;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 30:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 31;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 31:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 32;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 32:{
				if(this.ch >= 48 && this.ch <= 57 || this.ch >= 65 && this.ch <= 70 || this.ch >= 97 && this.ch <= 102) {
					this.AddCh();
					state = 27;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 33:{
				if(this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 || this.ch >= 35 && this.ch <= 91 || this.ch >= 93 && this.ch <= 65535) {
					this.AddCh();
					state = 27;
				}
				else if(this.ch == 34) {
					this.AddCh();
					state = 34;
				}
				else if(this.ch == 92) {
					this.AddCh();
					state = 28;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 34:{
				{
					this.t.kind = 5;
					throw "__break__";
				}
			}break;
			case 35:{
				{
					this.t.kind = 26;
					throw "__break__";
				}
			}break;
			case 36:{
				{
					this.t.kind = 27;
					throw "__break__";
				}
			}break;
			case 37:{
				{
					this.t.kind = 28;
					throw "__break__";
				}
			}break;
			case 38:{
				{
					this.t.kind = 30;
					throw "__break__";
				}
			}break;
			case 39:{
				{
					this.t.kind = 31;
					throw "__break__";
				}
			}break;
			case 40:{
				{
					this.t.kind = 32;
					throw "__break__";
				}
			}break;
			case 41:{
				{
					this.t.kind = 33;
					throw "__break__";
				}
			}break;
			case 42:{
				{
					this.t.kind = 37;
					throw "__break__";
				}
			}break;
			case 43:{
				{
					this.t.kind = 38;
					throw "__break__";
				}
			}break;
			case 44:{
				{
					this.t.kind = 39;
					throw "__break__";
				}
			}break;
			case 45:{
				{
					this.t.kind = 40;
					throw "__break__";
				}
			}break;
			case 46:{
				if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 53;
				}
				else if(this.ch >= 56 && this.ch <= 57) {
					this.AddCh();
					state = 9;
				}
				else if(this.ch == 76 || this.ch == 108) {
					this.AddCh();
					state = 4;
				}
				else if(this.ch == 88 || this.ch == 120) {
					this.AddCh();
					state = 2;
				}
				else if(this.ch == 46) {
					this.AddCh();
					state = 10;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 14;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 2;
					throw "__break__";
				}
			}break;
			case 47:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 47;
				}
				else if(this.ch == 76 || this.ch == 108) {
					this.AddCh();
					state = 4;
				}
				else if(this.ch == 46) {
					this.AddCh();
					state = 10;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 14;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 2;
					throw "__break__";
				}
			}break;
			case 48:{
				if(this.ch >= 48 && this.ch <= 57) {
					this.AddCh();
					state = 5;
				}
				else {
					this.t.kind = 29;
					throw "__break__";
				}
			}break;
			case 49:{
				if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 50;
				}
				else if(this.ch == 39) {
					this.AddCh();
					state = 26;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 50:{
				if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 19;
				}
				else if(this.ch == 39) {
					this.AddCh();
					state = 26;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 51:{
				if(this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 || this.ch >= 35 && this.ch <= 47 || this.ch >= 56 && this.ch <= 91 || this.ch >= 93 && this.ch <= 65535) {
					this.AddCh();
					state = 27;
				}
				else if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 52;
				}
				else if(this.ch == 34) {
					this.AddCh();
					state = 34;
				}
				else if(this.ch == 92) {
					this.AddCh();
					state = 28;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 52:{
				if(this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 || this.ch >= 35 && this.ch <= 91 || this.ch >= 93 && this.ch <= 65535) {
					this.AddCh();
					state = 27;
				}
				else if(this.ch == 34) {
					this.AddCh();
					state = 34;
				}
				else if(this.ch == 92) {
					this.AddCh();
					state = 28;
				}
				else {
					this.t.kind = xpde.parser.Scanner.noSym;
					throw "__break__";
				}
			}break;
			case 53:{
				if(this.ch >= 48 && this.ch <= 55) {
					this.AddCh();
					state = 53;
				}
				else if(this.ch >= 56 && this.ch <= 57) {
					this.AddCh();
					state = 9;
				}
				else if(this.ch == 76 || this.ch == 108) {
					this.AddCh();
					state = 4;
				}
				else if(this.ch == 46) {
					this.AddCh();
					state = 10;
				}
				else if(this.ch == 69 || this.ch == 101) {
					this.AddCh();
					state = 14;
				}
				else if(this.ch == 68 || this.ch == 70 || this.ch == 100 || this.ch == 102) {
					this.AddCh();
					state = 17;
				}
				else {
					this.t.kind = 2;
					throw "__break__";
				}
			}break;
			case 54:{
				{
					this.t.kind = 41;
					throw "__break__";
				}
			}break;
			case 55:{
				{
					this.t.kind = 72;
					throw "__break__";
				}
			}break;
			case 56:{
				{
					this.t.kind = 74;
					throw "__break__";
				}
			}break;
			case 57:{
				{
					this.t.kind = 75;
					throw "__break__";
				}
			}break;
			case 58:{
				{
					this.t.kind = 76;
					throw "__break__";
				}
			}break;
			case 59:{
				{
					this.t.kind = 77;
					throw "__break__";
				}
			}break;
			case 60:{
				{
					this.t.kind = 78;
					throw "__break__";
				}
			}break;
			case 61:{
				{
					this.t.kind = 79;
					throw "__break__";
				}
			}break;
			case 62:{
				{
					this.t.kind = 80;
					throw "__break__";
				}
			}break;
			case 63:{
				{
					this.t.kind = 81;
					throw "__break__";
				}
			}break;
			case 64:{
				{
					this.t.kind = 82;
					throw "__break__";
				}
			}break;
			case 65:{
				{
					this.t.kind = 83;
					throw "__break__";
				}
			}break;
			case 66:{
				{
					this.t.kind = 84;
					throw "__break__";
				}
			}break;
			case 67:{
				{
					this.t.kind = 85;
					throw "__break__";
				}
			}break;
			case 68:{
				{
					this.t.kind = 86;
					throw "__break__";
				}
			}break;
			case 69:{
				{
					this.t.kind = 90;
					throw "__break__";
				}
			}break;
			case 70:{
				{
					this.t.kind = 91;
					throw "__break__";
				}
			}break;
			case 71:{
				{
					this.t.kind = 94;
					throw "__break__";
				}
			}break;
			case 72:{
				{
					this.t.kind = 95;
					throw "__break__";
				}
			}break;
			case 73:{
				if(this.ch == 45) {
					this.AddCh();
					state = 37;
				}
				else if(this.ch == 61) {
					this.AddCh();
					state = 57;
				}
				else {
					this.t.kind = 34;
					throw "__break__";
				}
			}break;
			case 74:{
				if(this.ch == 43) {
					this.AddCh();
					state = 38;
				}
				else if(this.ch == 61) {
					this.AddCh();
					state = 56;
				}
				else {
					this.t.kind = 36;
					throw "__break__";
				}
			}break;
			case 75:{
				if(this.ch == 61) {
					this.AddCh();
					state = 70;
				}
				else {
					this.t.kind = 35;
					throw "__break__";
				}
			}break;
			case 76:{
				if(this.ch == 61) {
					this.AddCh();
					state = 58;
				}
				else {
					this.t.kind = 43;
					throw "__break__";
				}
			}break;
			case 77:{
				if(this.ch == 61) {
					this.AddCh();
					state = 69;
				}
				else {
					this.t.kind = 52;
					throw "__break__";
				}
			}break;
			case 78:{
				if(this.ch == 61) {
					this.AddCh();
					state = 59;
				}
				else {
					this.t.kind = 99;
					throw "__break__";
				}
			}break;
			case 79:{
				if(this.ch == 61) {
					this.AddCh();
					state = 60;
				}
				else if(this.ch == 38) {
					this.AddCh();
					state = 68;
				}
				else {
					this.t.kind = 89;
					throw "__break__";
				}
			}break;
			case 80:{
				if(this.ch == 61) {
					this.AddCh();
					state = 61;
				}
				else if(this.ch == 124) {
					this.AddCh();
					state = 67;
				}
				else {
					this.t.kind = 87;
					throw "__break__";
				}
			}break;
			case 81:{
				if(this.ch == 61) {
					this.AddCh();
					state = 62;
				}
				else {
					this.t.kind = 88;
					throw "__break__";
				}
			}break;
			case 82:{
				if(this.ch == 61) {
					this.AddCh();
					state = 63;
				}
				else {
					this.t.kind = 100;
					throw "__break__";
				}
			}break;
			case 83:{
				if(this.ch == 60) {
					this.AddCh();
					state = 85;
				}
				else if(this.ch == 61) {
					this.AddCh();
					state = 71;
				}
				else {
					this.t.kind = 92;
					throw "__break__";
				}
			}break;
			case 84:{
				if(this.ch == 62) {
					this.AddCh();
					state = 86;
				}
				else if(this.ch == 61) {
					this.AddCh();
					state = 72;
				}
				else {
					this.t.kind = 93;
					throw "__break__";
				}
			}break;
			case 85:{
				if(this.ch == 61) {
					this.AddCh();
					state = 64;
				}
				else {
					this.t.kind = 96;
					throw "__break__";
				}
			}break;
			case 86:{
				if(this.ch == 61) {
					this.AddCh();
					state = 65;
				}
				else if(this.ch == 62) {
					this.AddCh();
					state = 87;
				}
				else {
					this.t.kind = 97;
					throw "__break__";
				}
			}break;
			case 87:{
				if(this.ch == 61) {
					this.AddCh();
					state = 66;
				}
				else {
					this.t.kind = 98;
					throw "__break__";
				}
			}break;
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
	this.t.val = this.tval.b;
	this.tval = new StringBuf();
	return this.t;
}
xpde.parser.Scanner.prototype.Peek = function() {
	do {
		if(this.pt.next == null) {
			this.pt.next = this.NextToken();
		}
		this.pt = this.pt.next;
	} while(this.pt.kind > xpde.parser.Scanner.maxT);
	return this.pt;
}
xpde.parser.Scanner.prototype.ResetPeek = function() {
	this.pt = this.tokens;
}
xpde.parser.Scanner.prototype.Scan = function() {
	if(this.tokens.next == null) {
		return this.NextToken();
	}
	else {
		this.pt = this.tokens = this.tokens.next;
		return this.tokens;
	}
}
xpde.parser.Scanner.prototype.buffer = null;
xpde.parser.Scanner.prototype.ch = null;
xpde.parser.Scanner.prototype.col = null;
xpde.parser.Scanner.prototype.line = null;
xpde.parser.Scanner.prototype.oldEols = null;
xpde.parser.Scanner.prototype.pos = null;
xpde.parser.Scanner.prototype.pt = null;
xpde.parser.Scanner.prototype.t = null;
xpde.parser.Scanner.prototype.tlen = null;
xpde.parser.Scanner.prototype.tokens = null;
xpde.parser.Scanner.prototype.tval = null;
xpde.parser.Scanner.prototype.__class__ = xpde.parser.Scanner;
haxe.io.Eof = function(p) { if( p === $_ ) return; {
	null;
}}
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype.toString = function() {
	return "Eof";
}
haxe.io.Eof.prototype.__class__ = haxe.io.Eof;
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
		catch( $e12 ) {
			{
				var e = $e12;
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
	catch( $e13 ) {
		{
			var e = $e13;
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
xpde.parser.PrefixOperator = { __ename__ : ["xpde","parser","PrefixOperator"], __constructs__ : ["OpNot","OpBitwiseNot","OpUnaryPlus","OpUnaryMinus"] }
xpde.parser.PrefixOperator.OpBitwiseNot = ["OpBitwiseNot",1];
xpde.parser.PrefixOperator.OpBitwiseNot.toString = $estr;
xpde.parser.PrefixOperator.OpBitwiseNot.__enum__ = xpde.parser.PrefixOperator;
xpde.parser.PrefixOperator.OpNot = ["OpNot",0];
xpde.parser.PrefixOperator.OpNot.toString = $estr;
xpde.parser.PrefixOperator.OpNot.__enum__ = xpde.parser.PrefixOperator;
xpde.parser.PrefixOperator.OpUnaryMinus = ["OpUnaryMinus",3];
xpde.parser.PrefixOperator.OpUnaryMinus.toString = $estr;
xpde.parser.PrefixOperator.OpUnaryMinus.__enum__ = xpde.parser.PrefixOperator;
xpde.parser.PrefixOperator.OpUnaryPlus = ["OpUnaryPlus",2];
xpde.parser.PrefixOperator.OpUnaryPlus.toString = $estr;
xpde.parser.PrefixOperator.OpUnaryPlus.__enum__ = xpde.parser.PrefixOperator;
xpde.parser.InfixOperator = { __ename__ : ["xpde","parser","InfixOperator"], __constructs__ : ["OpOr","OpAnd","OpBitwiseOr","OpBitwiseXor","OpBitwiseAnd","OpEqual","OpUnequal","OpLessThan","OpLessThanOrEqual","OpGreaterThan","OpGreaterThanOrEqual","OpLeftShift","OpRightShift","OpZeroRightShift","OpAdd","OpSubtract","OpMultiply","OpDivide","OpModulus"] }
xpde.parser.InfixOperator.OpAdd = ["OpAdd",14];
xpde.parser.InfixOperator.OpAdd.toString = $estr;
xpde.parser.InfixOperator.OpAdd.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpAnd = ["OpAnd",1];
xpde.parser.InfixOperator.OpAnd.toString = $estr;
xpde.parser.InfixOperator.OpAnd.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpBitwiseAnd = ["OpBitwiseAnd",4];
xpde.parser.InfixOperator.OpBitwiseAnd.toString = $estr;
xpde.parser.InfixOperator.OpBitwiseAnd.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpBitwiseOr = ["OpBitwiseOr",2];
xpde.parser.InfixOperator.OpBitwiseOr.toString = $estr;
xpde.parser.InfixOperator.OpBitwiseOr.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpBitwiseXor = ["OpBitwiseXor",3];
xpde.parser.InfixOperator.OpBitwiseXor.toString = $estr;
xpde.parser.InfixOperator.OpBitwiseXor.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpDivide = ["OpDivide",17];
xpde.parser.InfixOperator.OpDivide.toString = $estr;
xpde.parser.InfixOperator.OpDivide.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpEqual = ["OpEqual",5];
xpde.parser.InfixOperator.OpEqual.toString = $estr;
xpde.parser.InfixOperator.OpEqual.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpGreaterThan = ["OpGreaterThan",9];
xpde.parser.InfixOperator.OpGreaterThan.toString = $estr;
xpde.parser.InfixOperator.OpGreaterThan.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpGreaterThanOrEqual = ["OpGreaterThanOrEqual",10];
xpde.parser.InfixOperator.OpGreaterThanOrEqual.toString = $estr;
xpde.parser.InfixOperator.OpGreaterThanOrEqual.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpLeftShift = ["OpLeftShift",11];
xpde.parser.InfixOperator.OpLeftShift.toString = $estr;
xpde.parser.InfixOperator.OpLeftShift.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpLessThan = ["OpLessThan",7];
xpde.parser.InfixOperator.OpLessThan.toString = $estr;
xpde.parser.InfixOperator.OpLessThan.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpLessThanOrEqual = ["OpLessThanOrEqual",8];
xpde.parser.InfixOperator.OpLessThanOrEqual.toString = $estr;
xpde.parser.InfixOperator.OpLessThanOrEqual.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpModulus = ["OpModulus",18];
xpde.parser.InfixOperator.OpModulus.toString = $estr;
xpde.parser.InfixOperator.OpModulus.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpMultiply = ["OpMultiply",16];
xpde.parser.InfixOperator.OpMultiply.toString = $estr;
xpde.parser.InfixOperator.OpMultiply.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpOr = ["OpOr",0];
xpde.parser.InfixOperator.OpOr.toString = $estr;
xpde.parser.InfixOperator.OpOr.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpRightShift = ["OpRightShift",12];
xpde.parser.InfixOperator.OpRightShift.toString = $estr;
xpde.parser.InfixOperator.OpRightShift.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpSubtract = ["OpSubtract",15];
xpde.parser.InfixOperator.OpSubtract.toString = $estr;
xpde.parser.InfixOperator.OpSubtract.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpUnequal = ["OpUnequal",6];
xpde.parser.InfixOperator.OpUnequal.toString = $estr;
xpde.parser.InfixOperator.OpUnequal.__enum__ = xpde.parser.InfixOperator;
xpde.parser.InfixOperator.OpZeroRightShift = ["OpZeroRightShift",13];
xpde.parser.InfixOperator.OpZeroRightShift.toString = $estr;
xpde.parser.InfixOperator.OpZeroRightShift.__enum__ = xpde.parser.InfixOperator;
xpde.parser.IncrementType = { __ename__ : ["xpde","parser","IncrementType"], __constructs__ : ["IIncrement","IDecrement"] }
xpde.parser.IncrementType.IDecrement = ["IDecrement",1];
xpde.parser.IncrementType.IDecrement.toString = $estr;
xpde.parser.IncrementType.IDecrement.__enum__ = xpde.parser.IncrementType;
xpde.parser.IncrementType.IIncrement = ["IIncrement",0];
xpde.parser.IncrementType.IIncrement.toString = $estr;
xpde.parser.IncrementType.IIncrement.__enum__ = xpde.parser.IncrementType;
xpde.parser.Expression = { __ename__ : ["xpde","parser","Expression"], __constructs__ : ["EArrayAccess","EArrayInstantiation","EArrayAssignment","EAssignment","ECall","ECallMethod","ECast","EConditional","EInstanceOf","EObjectInstantiation","EPrefix","EPostfix","EReference","ESuperReference","EThisReference","EPrefixOperation","EInfixOperation","EArrayLiteral","EStringLiteral","EIntegerLiteral","EFloatLiteral","ECharLiteral","EBooleanLiteral","ENull"] }
xpde.parser.Expression.EArrayAccess = function(index,base) { var $x = ["EArrayAccess",0,index,base]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayAssignment = function(index,base,value) { var $x = ["EArrayAssignment",2,index,base,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayInstantiation = function(type,sizes) { var $x = ["EArrayInstantiation",1,type,sizes]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayLiteral = function(values) { var $x = ["EArrayLiteral",17,values]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EAssignment = function(identifier,base,value) { var $x = ["EAssignment",3,identifier,base,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EBooleanLiteral = function(value) { var $x = ["EBooleanLiteral",22,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECall = function(method,args) { var $x = ["ECall",4,method,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECallMethod = function(identifier,base,args) { var $x = ["ECallMethod",5,identifier,base,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECast = function(type,expression) { var $x = ["ECast",6,type,expression]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECharLiteral = function(value) { var $x = ["ECharLiteral",21,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EConditional = function(condition,thenExpression,elseExpression) { var $x = ["EConditional",7,condition,thenExpression,elseExpression]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EFloatLiteral = function(value) { var $x = ["EFloatLiteral",20,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EInfixOperation = function(operation,leftOperand,rightOperand) { var $x = ["EInfixOperation",16,operation,leftOperand,rightOperand]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EInstanceOf = function(expression,type) { var $x = ["EInstanceOf",8,expression,type]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EIntegerLiteral = function(value) { var $x = ["EIntegerLiteral",19,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ENull = ["ENull",23];
xpde.parser.Expression.ENull.toString = $estr;
xpde.parser.Expression.ENull.__enum__ = xpde.parser.Expression;
xpde.parser.Expression.EObjectInstantiation = function(qualifier,args) { var $x = ["EObjectInstantiation",9,qualifier,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPostfix = function(type,reference) { var $x = ["EPostfix",11,type,reference]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPrefix = function(type,reference) { var $x = ["EPrefix",10,type,reference]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPrefixOperation = function(operation,operand) { var $x = ["EPrefixOperation",15,operation,operand]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EReference = function(identifier,base) { var $x = ["EReference",12,identifier,base]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EStringLiteral = function(value) { var $x = ["EStringLiteral",18,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ESuperReference = ["ESuperReference",13];
xpde.parser.Expression.ESuperReference.toString = $estr;
xpde.parser.Expression.ESuperReference.__enum__ = xpde.parser.Expression;
xpde.parser.Expression.EThisReference = ["EThisReference",14];
xpde.parser.Expression.EThisReference.toString = $estr;
xpde.parser.Expression.EThisReference.__enum__ = xpde.parser.Expression;
xpde.parser.Statement = { __ename__ : ["xpde","parser","Statement"], __constructs__ : ["SBlock","SBreak","SConditional","SContinue","SExpression","SLabel","SLoop","SReturn","SThrow","STry"] }
xpde.parser.Statement.SBlock = function(definitions,statements) { var $x = ["SBlock",0,definitions,statements]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SBreak = function(label) { var $x = ["SBreak",1,label]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SConditional = function(condition,thenBlock,elseBlock) { var $x = ["SConditional",2,condition,thenBlock,elseBlock]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SContinue = function(label) { var $x = ["SContinue",3,label]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SExpression = function(expression) { var $x = ["SExpression",4,expression]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SLabel = function(label,body) { var $x = ["SLabel",5,label,body]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SLoop = function(condition,body,doLoop) { var $x = ["SLoop",6,condition,body,doLoop]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SReturn = function(value) { var $x = ["SReturn",7,value]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.SThrow = function(expression) { var $x = ["SThrow",8,expression]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Statement.STry = function(body,catches,finallyBody) { var $x = ["STry",9,body,catches,finallyBody]; $x.__enum__ = xpde.parser.Statement; $x.toString = $estr; return $x; }
xpde.parser.Visibility = { __ename__ : ["xpde","parser","Visibility"], __constructs__ : ["VPublic","VPrivate"] }
xpde.parser.Visibility.VPrivate = ["VPrivate",1];
xpde.parser.Visibility.VPrivate.toString = $estr;
xpde.parser.Visibility.VPrivate.__enum__ = xpde.parser.Visibility;
xpde.parser.Visibility.VPublic = ["VPublic",0];
xpde.parser.Visibility.VPublic.toString = $estr;
xpde.parser.Visibility.VPublic.__enum__ = xpde.parser.Visibility;
xpde.parser.DataType = { __ename__ : ["xpde","parser","DataType"], __constructs__ : ["DTPrimitive","DTReference","DTArray"] }
xpde.parser.DataType.DTArray = function(type,dimensions) { var $x = ["DTArray",2,type,dimensions]; $x.__enum__ = xpde.parser.DataType; $x.toString = $estr; return $x; }
xpde.parser.DataType.DTPrimitive = function(type) { var $x = ["DTPrimitive",0,type]; $x.__enum__ = xpde.parser.DataType; $x.toString = $estr; return $x; }
xpde.parser.DataType.DTReference = function(qualident) { var $x = ["DTReference",1,qualident]; $x.__enum__ = xpde.parser.DataType; $x.toString = $estr; return $x; }
xpde.parser.PrimitiveType = { __ename__ : ["xpde","parser","PrimitiveType"], __constructs__ : ["PTByte","PTShort","PTInt","PTLong","PTFloat","PTDouble","PTChar","PTBoolean"] }
xpde.parser.PrimitiveType.PTBoolean = ["PTBoolean",7];
xpde.parser.PrimitiveType.PTBoolean.toString = $estr;
xpde.parser.PrimitiveType.PTBoolean.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTByte = ["PTByte",0];
xpde.parser.PrimitiveType.PTByte.toString = $estr;
xpde.parser.PrimitiveType.PTByte.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTChar = ["PTChar",6];
xpde.parser.PrimitiveType.PTChar.toString = $estr;
xpde.parser.PrimitiveType.PTChar.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTDouble = ["PTDouble",5];
xpde.parser.PrimitiveType.PTDouble.toString = $estr;
xpde.parser.PrimitiveType.PTDouble.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTFloat = ["PTFloat",4];
xpde.parser.PrimitiveType.PTFloat.toString = $estr;
xpde.parser.PrimitiveType.PTFloat.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTInt = ["PTInt",2];
xpde.parser.PrimitiveType.PTInt.toString = $estr;
xpde.parser.PrimitiveType.PTInt.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTLong = ["PTLong",3];
xpde.parser.PrimitiveType.PTLong.toString = $estr;
xpde.parser.PrimitiveType.PTLong.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.PrimitiveType.PTShort = ["PTShort",1];
xpde.parser.PrimitiveType.PTShort.toString = $estr;
xpde.parser.PrimitiveType.PTShort.__enum__ = xpde.parser.PrimitiveType;
xpde.parser.Definition = { __ename__ : ["xpde","parser","Definition"], __constructs__ : ["DMethod","DField","DClass"] }
xpde.parser.Definition.DClass = function(identifier,modifiers,definitions,extend,implement,clinit,init) { var $x = ["DClass",2,identifier,modifiers,definitions,extend,implement,clinit,init]; $x.__enum__ = xpde.parser.Definition; $x.toString = $estr; return $x; }
xpde.parser.Definition.DField = function(identifier,type,modifiers) { var $x = ["DField",1,identifier,type,modifiers]; $x.__enum__ = xpde.parser.Definition; $x.toString = $estr; return $x; }
xpde.parser.Definition.DMethod = function(identifier,type,modifiers,params,body) { var $x = ["DMethod",0,identifier,type,modifiers,params,body]; $x.__enum__ = xpde.parser.Definition; $x.toString = $estr; return $x; }
xpde.parser.Modifier = { __ename__ : ["xpde","parser","Modifier"], __constructs__ : ["MPublic","MPrivate","MProtected","MStatic","MFinal","MSynchronized","MVolatile","MTransient","MNative","MAbstract","MStrictfp"] }
xpde.parser.Modifier.MAbstract = ["MAbstract",9];
xpde.parser.Modifier.MAbstract.toString = $estr;
xpde.parser.Modifier.MAbstract.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MFinal = ["MFinal",4];
xpde.parser.Modifier.MFinal.toString = $estr;
xpde.parser.Modifier.MFinal.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MNative = ["MNative",8];
xpde.parser.Modifier.MNative.toString = $estr;
xpde.parser.Modifier.MNative.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MPrivate = ["MPrivate",1];
xpde.parser.Modifier.MPrivate.toString = $estr;
xpde.parser.Modifier.MPrivate.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MProtected = ["MProtected",2];
xpde.parser.Modifier.MProtected.toString = $estr;
xpde.parser.Modifier.MProtected.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MPublic = ["MPublic",0];
xpde.parser.Modifier.MPublic.toString = $estr;
xpde.parser.Modifier.MPublic.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MStatic = ["MStatic",3];
xpde.parser.Modifier.MStatic.toString = $estr;
xpde.parser.Modifier.MStatic.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MStrictfp = ["MStrictfp",10];
xpde.parser.Modifier.MStrictfp.toString = $estr;
xpde.parser.Modifier.MStrictfp.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MSynchronized = ["MSynchronized",5];
xpde.parser.Modifier.MSynchronized.toString = $estr;
xpde.parser.Modifier.MSynchronized.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MTransient = ["MTransient",7];
xpde.parser.Modifier.MTransient.toString = $estr;
xpde.parser.Modifier.MTransient.__enum__ = xpde.parser.Modifier;
xpde.parser.Modifier.MVolatile = ["MVolatile",6];
xpde.parser.Modifier.MVolatile.toString = $estr;
xpde.parser.Modifier.MVolatile.__enum__ = xpde.parser.Modifier;
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
xpde.interpreter = {}
xpde.interpreter.JSInterpreter = function(p) { if( p === $_ ) return; {
	this.compiler = new xpde.compiler.JSCompiler();
}}
xpde.interpreter.JSInterpreter.__name__ = ["xpde","interpreter","JSInterpreter"];
xpde.interpreter.JSInterpreter.prototype.compiler = null;
xpde.interpreter.JSInterpreter.prototype.interpret = function(unit) {
	var source = this.compiler.compile(unit);
	js.Lib.eval(source);
	js.Lib.eval("window.sketch = new Sketch(\"pde\"); window.sketch.main()");
}
xpde.interpreter.JSInterpreter.prototype.__class__ = xpde.interpreter.JSInterpreter;
xpde.parser.BitSet = function(nbits) { if( nbits === $_ ) return; {
	this.bitset = [];
	{
		var _g = 0;
		while(_g < nbits) {
			var i = _g++;
			this.bitset.push(false);
		}
	}
}}
xpde.parser.BitSet.__name__ = ["xpde","parser","BitSet"];
xpde.parser.BitSet.prototype.bitset = null;
xpde.parser.BitSet.prototype.get = function(bitIndex) {
	return this.bitset[bitIndex];
}
xpde.parser.BitSet.prototype.or = function(bitset2) {
	var _g1 = 0, _g = this.bitset.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.bitset[i] = this.bitset[i] || bitset2.bitset[i];
	}
}
xpde.parser.BitSet.prototype.set = function(bitIndex) {
	this.bitset[bitIndex] = true;
}
xpde.parser.BitSet.prototype.__class__ = xpde.parser.BitSet;
xpde.parser.Parser = function(scanner) { if( scanner === $_ ) return; {
	this.errDist = xpde.parser.Parser.minErrDist;
	this.scanner = scanner;
	this.errors = new xpde.parser.Errors();
}}
xpde.parser.Parser.__name__ = ["xpde","parser","Parser"];
xpde.parser.Parser.newSet = function(values) {
	var s = new xpde.parser.BitSet(xpde.parser.Parser.maxTerminals);
	{
		var _g1 = 0, _g = values.length;
		while(_g1 < _g) {
			var i = _g1++;
			s.bitset[values[i]] = true;
		}
	}
	return s;
}
xpde.parser.Parser.or = function(s1,s2) {
	s1.or(s2);
	return s1;
}
xpde.parser.Parser.prototype.Arguments = function() {
	var arguments = null;
	arguments = [];
	this.Expect(33);
	if(this.StartOf(13)) {
		var expression = this.Expression0();
		arguments.push(expression);
		while(this.la.kind == 27) {
			this.Get();
			var expression1 = this.Expression0();
			arguments.push(expression1);
		}
	}
	this.Expect(39);
	return arguments;
}
xpde.parser.Parser.prototype.ArgumentsMethodOpt = function(identifier,base) {
	var expression = null;
	expression = xpde.parser.Expression.EReference(identifier,base);
	if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = xpde.parser.Expression.ECallMethod(identifier,base,arguments);
	}
	return expression;
}
xpde.parser.Parser.prototype.ArgumentsOpt = function(method) {
	var expression = null;
	expression = method;
	if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = xpde.parser.Expression.ECall(method,arguments);
	}
	return expression;
}
xpde.parser.Parser.prototype.ArrayCreatorRest = function(type) {
	var expression = null;
	this.Expect(32);
	if(this.la.kind == 38) {
		this.Get();
		var bCount = this.BracketsOpt();
		var expression1 = this.ArrayInitializer();
	}
	else if(this.StartOf(13)) {
		var dummy = this.Expression0();
		this.Expect(38);
		while(this.nonEmptyBracket()) {
			this.Expect(32);
			var dummy1 = this.Expression0();
			this.Expect(38);
		}
		while(this.emptyBracket()) {
			this.Expect(32);
			this.Expect(38);
		}
	}
	else this.SynErr(142);
	return expression;
}
xpde.parser.Parser.prototype.ArrayInitializer = function() {
	var expression = null;
	var values = [];
	this.Expect(31);
	if(this.StartOf(14)) {
		var arg = this.VariableInitializer();
		values.push(arg);
		while(this.commaAndNoRBrace()) {
			this.Expect(27);
			var arg1 = this.VariableInitializer();
			values.push(arg1);
		}
	}
	if(this.la.kind == 27) {
		this.Get();
	}
	this.Expect(37);
	return expression;
}
xpde.parser.Parser.prototype.AssignmentOperator = function() {
	var operator = null;
	switch(this.la.kind) {
	case 52:{
		this.Get();
		operator = null;
	}break;
	case 74:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpAdd;
	}break;
	case 75:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpSubtract;
	}break;
	case 76:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpMultiply;
	}break;
	case 77:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpDivide;
	}break;
	case 78:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseAnd;
	}break;
	case 79:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseOr;
	}break;
	case 80:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseXor;
	}break;
	case 81:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpModulus;
	}break;
	case 82:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpLeftShift;
	}break;
	case 83:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpRightShift;
	}break;
	case 84:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpZeroRightShift;
	}break;
	default:{
		this.SynErr(127);
	}break;
	}
	return operator;
}
xpde.parser.Parser.prototype.BasicType = function() {
	var type = null;
	switch(this.la.kind) {
	case 7:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTByte;
	}break;
	case 20:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTShort;
	}break;
	case 8:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTChar;
	}break;
	case 15:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTInt;
	}break;
	case 16:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTLong;
	}break;
	case 13:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTFloat;
	}break;
	case 10:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTDouble;
	}break;
	case 6:{
		this.Get();
		type = xpde.parser.PrimitiveType.PTBoolean;
	}break;
	default:{
		this.SynErr(114);
	}break;
	}
	return type;
}
xpde.parser.Parser.prototype.Block = function(parent) {
	var statement = null;
	var scope = new xpde.parser.BlockScope();
	this.Expect(31);
	while(this.StartOf(3)) {
		this.BlockStatement(scope);
	}
	this.Expect(37);
	statement = scope.getStatement();
	return statement;
}
xpde.parser.Parser.prototype.BlockStatement = function(scope) {
	if(this.isLocalVarDecl(false)) {
		this.LocalVariableDeclaration(scope);
		this.Expect(41);
	}
	else if(this.StartOf(9)) {
		this.ClassOrInterfaceDeclaration(scope);
	}
	else if(this.StartOf(10)) {
		var statement = this.Statement0(scope);
		scope.pushStatement(statement);
	}
	else this.SynErr(106);
}
xpde.parser.Parser.prototype.BracketsOpt = function() {
	var bCount = null;
	bCount = 0;
	while(this.la.kind == 32) {
		this.Get();
		this.Expect(38);
		bCount++;
	}
	return bCount;
}
xpde.parser.Parser.prototype.CatchClause = function(scope) {
	var _catch = null;
	this.Expect(69);
	this.Expect(33);
	var parameter = this.FormalParameter0();
	this.Expect(39);
	var block = this.Block(scope);
	_catch = { parameter : parameter, body : block}
	return _catch;
}
xpde.parser.Parser.prototype.Catches = function(scope) {
	var catches = null;
	catches = [];
	var catchBlock = this.CatchClause(scope);
	catches.push(catchBlock);
	while(this.la.kind == 69) {
		var catchBlock1 = this.CatchClause(scope);
		catches.push(catchBlock1);
	}
	return catches;
}
xpde.parser.Parser.prototype.ClassBody = function() {
	var classScope = null;
	classScope = new xpde.parser.ClassScope();
	this.Expect(31);
	while(this.StartOf(2)) {
		this.ClassBodyDeclaration(classScope);
	}
	this.Expect(37);
	return classScope;
}
xpde.parser.Parser.prototype.ClassBodyDeclaration = function(scope) {
	if(this.la.kind == 41) {
		this.Get();
	}
	else if(this.StartOf(5)) {
		var m = new xpde.parser.EnumSet();
		if(this.la.kind == 21) {
			this.Get();
			this.addModifier(m,xpde.parser.Modifier.MStatic);
		}
		if(this.la.kind == 31) {
			var block = this.Block(null);
			scope.pushStatement(block);
		}
		else if(this.StartOf(6)) {
			if(this.StartOf(7)) {
				this.Modifier1(m);
				while(this.StartOf(8)) {
					this.Modifier0(m);
				}
			}
			this.MemberDecl(scope,m);
		}
		else this.SynErr(104);
	}
	else this.SynErr(105);
}
xpde.parser.Parser.prototype.ClassCreatorRest = function(qualifier) {
	var expression = null;
	var arguments = this.Arguments();
	expression = xpde.parser.Expression.EObjectInstantiation(qualifier,arguments);
	if(this.la.kind == 31) {
		var classScope = this.ClassBody();
	}
	return expression;
}
xpde.parser.Parser.prototype.ClassDeclaration = function(scope,m) {
	this.checkModifierPermission(m,xpde.parser.ModifierSet.classes);
	this.Expect(9);
	this.Expect(1);
	var identifier = this.t.val, extend = null, implement = null;
	if(this.la.kind == 53) {
		this.Get();
		var arg = this.Type();
		extend = arg;
	}
	if(this.la.kind == 54) {
		this.Get();
		var arg = this.TypeList();
		implement = arg;
	}
	var classScope = this.ClassBody();
	scope.pushDefinition(xpde.parser.Definition.DClass(identifier,m,classScope.getDefinitions(),extend,implement,null,classScope.getStatement()));
}
xpde.parser.Parser.prototype.ClassModifier = function(m) {
	switch(this.la.kind) {
	case 19:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MPublic);
	}break;
	case 44:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MProtected);
	}break;
	case 45:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MPrivate);
	}break;
	case 46:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MAbstract);
	}break;
	case 21:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MStatic);
	}break;
	case 12:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MFinal);
	}break;
	case 47:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MStrictfp);
	}break;
	default:{
		this.SynErr(110);
	}break;
	}
}
xpde.parser.Parser.prototype.ClassOrInterfaceDeclaration = function(scope) {
	var m = new xpde.parser.EnumSet();
	while(this.StartOf(11)) {
		this.ClassModifier(m);
	}
	if(this.la.kind == 9) {
		this.ClassDeclaration(scope,m);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(scope,m);
	}
	else this.SynErr(109);
}
xpde.parser.Parser.prototype.CompilationUnit = function(scope) {
	if(this.la.kind == 42) {
		this.Get();
		var qualident = this.Qualident();
		scope.setPackage(qualident);
		this.Expect(41);
	}
	while(this.la.kind == 14) {
		var importIdent = this.ImportDeclaration();
		scope.pushImport(importIdent);
	}
	while(this.StartOf(4)) {
		this.TypeDeclaration(scope);
	}
	if(this.la.kind != xpde.parser.Parser._EOF) this.error("'class' or 'interface' expected");
}
xpde.parser.Parser.prototype.ConditionalExpr = function(conditional) {
	var expression = null;
	this.Expect(72);
	var thenExpression = this.Expression0();
	this.Expect(26);
	var elseExpression = this.Expression1();
	expression = xpde.parser.Expression.EConditional(conditional,thenExpression,elseExpression);
	return expression;
}
xpde.parser.Parser.prototype.ConstantDeclarator = function() {
	this.Expect(1);
	this.ConstantDeclaratorRest();
}
xpde.parser.Parser.prototype.ConstantDeclaratorRest = function() {
	var bCount = this.BracketsOpt();
	this.Expect(52);
	var expression = this.VariableInitializer();
}
xpde.parser.Parser.prototype.ConstantDeclaratorsRest = function() {
	this.ConstantDeclaratorRest();
	while(this.la.kind == 27) {
		this.Get();
		this.ConstantDeclarator();
	}
}
xpde.parser.Parser.prototype.ConstructorDeclaratorRest = function(scope,m,identifier) {
	this.checkModifierPermission(m,xpde.parser.ModifierSet.constructors);
	var throwsList = [];
	var parameters = this.FormalParameters();
	if(this.la.kind == 55) {
		this.Get();
		this.QualidentList();
	}
	var body = this.Block(null);
	scope.pushDefinition(xpde.parser.Definition.DMethod(identifier,null,m,parameters,body));
}
xpde.parser.Parser.prototype.Creator = function() {
	var expression = null;
	if(this.StartOf(12)) {
		var type = this.BasicType();
		var arg = this.ArrayCreatorRest(xpde.parser.DataType.DTPrimitive(type));
		expression = arg;
	}
	else if(this.la.kind == 1) {
		var qualifier = this.Qualident();
		if(this.la.kind == 32) {
			var arg = this.ArrayCreatorRest(xpde.parser.DataType.DTReference(qualifier));
			expression = arg;
		}
		else if(this.la.kind == 33) {
			var arg = this.ClassCreatorRest(qualifier);
			expression = arg;
		}
		else this.SynErr(138);
	}
	else this.SynErr(139);
	return expression;
}
xpde.parser.Parser.prototype.Expect = function(n) {
	if(this.la.kind == n) this.Get();
	else {
		this.SynErr(n);
	}
}
xpde.parser.Parser.prototype.ExpectWeak = function(n,follow) {
	if(this.la.kind == n) this.Get();
	else {
		this.SynErr(n);
		while(!this.StartOf(follow)) this.Get();
	}
}
xpde.parser.Parser.prototype.Expression0 = function() {
	var expression = null;
	var expression1 = this.Expression1();
	while(this.StartOf(15)) {
		var operator = this.AssignmentOperator();
		var value = this.Expression1();
		if(operator != null) value = xpde.parser.Expression.EInfixOperation(operator,expression1,value);
		var $e = (expression1);
		switch( $e[1] ) {
		case 12:
		var base = $e[3], identifier = $e[2];
		{
			expression1 = xpde.parser.Expression.EAssignment(identifier,base,value);
		}break;
		case 0:
		var base = $e[3], index = $e[2];
		{
			expression1 = xpde.parser.Expression.EArrayAssignment(index,base,value);
		}break;
		default:{
			this.error("invalid assignment left-hand side");
		}break;
		}
	}
	return expression1;
}
xpde.parser.Parser.prototype.Expression1 = function() {
	var expression = null;
	var expression1 = this.Expression2();
	if(this.la.kind == 72) {
		var rest = this.ConditionalExpr(expression1);
		expression1 = rest;
	}
	return expression1;
}
xpde.parser.Parser.prototype.Expression2 = function() {
	var expression = null;
	var expression1 = this.Expression3();
	if(this.StartOf(22)) {
		var rest = this.Expression2Rest(expression1);
		expression1 = rest;
	}
	return expression1;
}
xpde.parser.Parser.prototype.Expression2Rest = function(operand) {
	var expression = null;
	if(this.StartOf(25)) {
		var builder = new xpde.parser.OperationBuilder();
		builder.operand(operand);
		var operator = this.Infixop();
		builder.operator(operator);
		var operand1 = this.Expression3();
		builder.operand(operand1);
		while(this.StartOf(25)) {
			var operator1 = this.Infixop();
			builder.operator(operator1);
			var operand2 = this.Expression3();
			builder.operand(operand2);
		}
		expression = builder.reduce();
	}
	else if(this.la.kind == 73) {
		this.Get();
		var type = this.Type();
		expression = xpde.parser.Expression.EInstanceOf(expression,type);
	}
	else this.SynErr(129);
	return expression;
}
xpde.parser.Parser.prototype.Expression3 = function() {
	var expression = null;
	if(this.StartOf(23)) {
		if(this.la.kind == 28 || this.la.kind == 30) {
			var type = this.Increment();
			var rest = this.Expression3();
			expression = xpde.parser.Expression.EPrefix(type,rest);
		}
		else {
			var operator = this.PrefixOp();
			var rest = this.Expression3();
			expression = xpde.parser.Expression.EPrefixOperation(operator,rest);
		}
	}
	else if(this.isTypeCast()) {
		this.Expect(33);
		var type = this.Type();
		this.Expect(39);
		var rest = this.Expression3();
		expression = xpde.parser.Expression.ECast(type,rest);
	}
	else if(this.StartOf(24)) {
		var rest = this.Primary();
		expression = rest;
		while(this.la.kind == 29 || this.la.kind == 32) {
			var rest1 = this.Selector(expression);
			expression = rest1;
		}
		while(this.la.kind == 28 || this.la.kind == 30) {
			var type = this.Increment();
			expression = xpde.parser.Expression.EPostfix(type,expression);
		}
	}
	else this.SynErr(128);
	return expression;
}
xpde.parser.Parser.prototype.ForInit = function(scope) {
	if(this.isLocalVarDecl(true)) {
		this.LocalVariableDeclaration(scope);
	}
	else if(this.StartOf(13)) {
		var statement = this.StatementExpression();
		scope.pushStatement(statement);
		var statements = this.MoreStatementExpressions();
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				scope.pushStatement(statement1);
			}
		}
	}
	else this.SynErr(125);
}
xpde.parser.Parser.prototype.ForUpdate = function() {
	var statements = null;
	var statement = this.StatementExpression();
	statements = [statement];
	var arg = this.MoreStatementExpressions();
	statements = statements.concat(arg);
	return statements;
}
xpde.parser.Parser.prototype.FormalParameter0 = function() {
	var parameter = null;
	var modifiers = new xpde.parser.EnumSet();
	if(this.la.kind == 12) {
		this.Get();
		modifiers.add(xpde.parser.Modifier.MFinal);
	}
	var type = this.Type();
	this.Expect(1);
	var identifier = this.t.val;
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	parameter = { identifier : identifier, type : type, modifiers : modifiers}
	return parameter;
}
xpde.parser.Parser.prototype.FormalParameters = function() {
	var parameters = null;
	parameters = [];
	this.Expect(33);
	if(this.StartOf(18)) {
		var parameter = this.FormalParameter0();
		parameters.push(parameter);
		while(this.la.kind == 27) {
			this.Get();
			var parameter1 = this.FormalParameter0();
			parameters.push(parameter1);
		}
	}
	this.Expect(39);
	return parameters;
}
xpde.parser.Parser.prototype.Get = function() {
	while(true) {
		this.t = this.la;
		this.la = this.scanner.Scan();
		if(this.la.kind <= xpde.parser.Parser.maxT) {
			++this.errDist;
			break;
		}
		this.la = this.t;
	}
}
xpde.parser.Parser.prototype.IdentifierSuffix = function(identifier,base) {
	var expression = null;
	if(this.la.kind == 32) {
		this.Get();
		this.Expect(38);
		var bCount = this.BracketsOpt();
		this.Expect(29);
		this.Expect(9);
	}
	else if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = (base == null?xpde.parser.Expression.ECall(xpde.parser.Expression.EReference(identifier),arguments):xpde.parser.Expression.ECallMethod(identifier,base,arguments));
	}
	else if(this.la.kind == 29) {
		this.Get();
		if(this.la.kind == 9) {
			this.Get();
		}
		else if(this.la.kind == 23) {
			this.Get();
		}
		else if(this.la.kind == 22) {
			this.Get();
			this.Expect(29);
			this.Expect(1);
			var dummy = this.ArgumentsMethodOpt(null,null);
		}
		else this.SynErr(140);
	}
	else this.SynErr(141);
	return expression;
}
xpde.parser.Parser.prototype.ImportDeclaration = function() {
	var importIdent = null;
	this.Expect(14);
	this.Expect(1);
	importIdent = [this.t.val];
	var arg = this.QualifiedImport();
	this.Expect(41);
	importIdent = importIdent.concat(arg);
	return importIdent;
}
xpde.parser.Parser.prototype.Increment = function() {
	var type = null;
	if(this.la.kind == 30) {
		this.Get();
		type = xpde.parser.IncrementType.IIncrement;
	}
	else if(this.la.kind == 28) {
		this.Get();
		type = xpde.parser.IncrementType.IDecrement;
	}
	else this.SynErr(131);
	return type;
}
xpde.parser.Parser.prototype.Infixop = function() {
	var operator = null;
	switch(this.la.kind) {
	case 85:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpOr;
	}break;
	case 86:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpAnd;
	}break;
	case 87:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseOr;
	}break;
	case 88:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseXor;
	}break;
	case 89:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpBitwiseAnd;
	}break;
	case 90:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpEqual;
	}break;
	case 91:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpUnequal;
	}break;
	case 92:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpLessThan;
	}break;
	case 93:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpGreaterThan;
	}break;
	case 94:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpLessThanOrEqual;
	}break;
	case 95:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpGreaterThanOrEqual;
	}break;
	case 96:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpLeftShift;
	}break;
	case 97:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpRightShift;
	}break;
	case 98:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpZeroRightShift;
	}break;
	case 36:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpAdd;
	}break;
	case 34:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpSubtract;
	}break;
	case 43:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpMultiply;
	}break;
	case 99:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpDivide;
	}break;
	case 100:{
		this.Get();
		operator = xpde.parser.InfixOperator.OpModulus;
	}break;
	default:{
		this.SynErr(130);
	}break;
	}
	return operator;
}
xpde.parser.Parser.prototype.InnerCreator = function() {
	var qualifier = [];
	this.Expect(1);
	var expression = this.ClassCreatorRest(qualifier);
}
xpde.parser.Parser.prototype.InterfaceBody = function() {
	this.Expect(31);
	while(this.StartOf(19)) {
		this.InterfaceBodyDeclaration();
	}
	this.Expect(37);
}
xpde.parser.Parser.prototype.InterfaceBodyDeclaration = function() {
	var m = new xpde.parser.EnumSet();
	if(this.la.kind == 41) {
		this.Get();
	}
	else if(this.StartOf(20)) {
		while(this.StartOf(8)) {
			this.Modifier0(m);
		}
		this.InterfaceMemberDecl(m);
	}
	else this.SynErr(120);
}
xpde.parser.Parser.prototype.InterfaceDeclaration = function(scope,m) {
	this.checkModifierPermission(m,xpde.parser.ModifierSet.interfaces);
	this.Expect(56);
	this.Expect(1);
	if(this.la.kind == 53) {
		this.Get();
		var extend = this.TypeList();
	}
	this.InterfaceBody();
}
xpde.parser.Parser.prototype.InterfaceMemberDecl = function(m) {
	if(this.StartOf(16)) {
		this.InterfaceMethodOrFieldDecl(m);
	}
	else if(this.la.kind == 25) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.interfaces);
		this.Get();
		this.Expect(1);
		this.VoidInterfaceMethodDeclaratorRest();
	}
	else if(this.la.kind == 9) {
		this.ClassDeclaration(null,m);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(null,m);
	}
	else this.SynErr(121);
}
xpde.parser.Parser.prototype.InterfaceMethodDeclaratorRest = function() {
	var parameters = this.FormalParameters();
	var bCount = this.BracketsOpt();
	if(this.la.kind == 55) {
		this.Get();
		this.QualidentList();
	}
	this.Expect(41);
}
xpde.parser.Parser.prototype.InterfaceMethodOrFieldDecl = function(m) {
	var type = this.Type();
	this.Expect(1);
	this.InterfaceMethodOrFieldRest(m);
}
xpde.parser.Parser.prototype.InterfaceMethodOrFieldRest = function(m) {
	if(this.la.kind == 32 || this.la.kind == 52) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.constants);
		this.ConstantDeclaratorsRest();
		this.Expect(41);
	}
	else if(this.la.kind == 33) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.interfaces);
		this.InterfaceMethodDeclaratorRest();
	}
	else this.SynErr(122);
}
xpde.parser.Parser.prototype.Literal = function() {
	var expression = null;
	switch(this.la.kind) {
	case 2:{
		this.Get();
		expression = xpde.parser.Expression.EIntegerLiteral(Std.parseInt(this.t.val));
	}break;
	case 3:{
		this.Get();
		expression = xpde.parser.Expression.EFloatLiteral(Std.parseFloat(this.t.val));
	}break;
	case 4:{
		this.Get();
		expression = xpde.parser.Expression.ECharLiteral(this.t.val.charCodeAt(0));
	}break;
	case 5:{
		this.Get();
		expression = xpde.parser.Expression.EStringLiteral(this.t.val);
	}break;
	case 24:{
		this.Get();
		expression = xpde.parser.Expression.EBooleanLiteral(true);
	}break;
	case 11:{
		this.Get();
		expression = xpde.parser.Expression.EBooleanLiteral(false);
	}break;
	case 18:{
		this.Get();
		expression = xpde.parser.Expression.ENull;
	}break;
	default:{
		this.SynErr(137);
	}break;
	}
	return expression;
}
xpde.parser.Parser.prototype.LocalVariableDeclaration = function(scope) {
	var modifiers = new xpde.parser.EnumSet();
	if(this.la.kind == 12) {
		this.Get();
		modifiers.add(xpde.parser.Modifier.MFinal);
	}
	var type = this.Type();
	this.VariableDeclarators(scope,modifiers,type);
}
xpde.parser.Parser.prototype.MemberDecl = function(scope,m) {
	if(this.identAndLPar()) {
		this.Expect(1);
		var identifier = this.t.val;
		this.ConstructorDeclaratorRest(scope,m,identifier);
	}
	else if(this.StartOf(16)) {
		this.MethodOrFieldDecl(scope,m);
	}
	else if(this.la.kind == 25) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.methods);
		this.Get();
		this.Expect(1);
		var identifier = this.t.val;
		this.VoidMethodDeclaratorRest(scope,m,identifier);
	}
	else if(this.la.kind == 9) {
		this.ClassDeclaration(scope,m);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(scope,m);
	}
	else this.SynErr(116);
}
xpde.parser.Parser.prototype.MethodDeclaratorRest = function(scope,m,identifier,type) {
	var body = null;
	var parameters = this.FormalParameters();
	var bCount = this.BracketsOpt();
	if(this.la.kind == 55) {
		this.Get();
		this.QualidentList();
	}
	if(this.la.kind == 31) {
		var block = this.Block(null);
		body = block;
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(119);
	scope.pushDefinition(xpde.parser.Definition.DMethod(identifier,type,m,parameters,body));
}
xpde.parser.Parser.prototype.MethodOrFieldDecl = function(scope,m) {
	var type = this.Type();
	this.Expect(1);
	var identifier = this.t.val;
	this.MethodOrFieldRest(scope,m,identifier,type);
}
xpde.parser.Parser.prototype.MethodOrFieldRest = function(scope,m,identifier,type) {
	if(this.StartOf(17)) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.fields);
		this.VariableDeclaratorsRest(scope,m,type,identifier);
		this.Expect(41);
	}
	else if(this.la.kind == 33) {
		this.checkModifierPermission(m,xpde.parser.ModifierSet.methods);
		this.MethodDeclaratorRest(scope,m,identifier,type);
	}
	else this.SynErr(118);
}
xpde.parser.Parser.prototype.Modifier0 = function(m) {
	if(this.la.kind == 21) {
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MStatic);
	}
	else if(this.StartOf(7)) {
		this.Modifier1(m);
	}
	else this.SynErr(111);
}
xpde.parser.Parser.prototype.Modifier1 = function(m) {
	switch(this.la.kind) {
	case 19:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MPublic);
	}break;
	case 44:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MProtected);
	}break;
	case 45:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MPrivate);
	}break;
	case 46:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MAbstract);
	}break;
	case 12:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MFinal);
	}break;
	case 48:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MNative);
	}break;
	case 49:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MSynchronized);
	}break;
	case 50:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MTransient);
	}break;
	case 51:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MVolatile);
	}break;
	case 47:{
		this.Get();
		this.addModifier(m,xpde.parser.Modifier.MStrictfp);
	}break;
	default:{
		this.SynErr(112);
	}break;
	}
}
xpde.parser.Parser.prototype.MoreStatementExpressions = function() {
	var statements = null;
	statements = [];
	while(this.la.kind == 27) {
		this.Get();
		var statement = this.StatementExpression();
		statements.push(statement);
	}
	return statements;
}
xpde.parser.Parser.prototype.ParExpression = function() {
	var expression = null;
	this.Expect(33);
	var expression1 = this.Expression0();
	this.Expect(39);
	return expression1;
}
xpde.parser.Parser.prototype.Parse = function() {
	this.la = new xpde.parser.Token();
	this.la.val = "";
	this.Get();
	var ret = this.PdeProgram();
	this.Expect(0);
	return ret;
}
xpde.parser.Parser.prototype.PdeProgram = function() {
	var program = null;
	if(this.isJavaProgram()) {
		program = new xpde.parser.JavaProgram();
		this.CompilationUnit(function($this) {
			var $r;
			var tmp = program;
			$r = (Std["is"](tmp,xpde.parser.CompilationUnitScope)?tmp:function($this) {
				var $r;
				throw "Class cast error";
				return $r;
			}($this));
			return $r;
		}(this));
	}
	else if(this.StartOf(1)) {
		var tempScope = new xpde.parser.BlockScope();
		while(this.isLocalVarDecl(false)) {
			this.LocalVariableDeclaration(tempScope);
			this.Expect(41);
		}
		if(this.isActiveProgram()) {
			program = new xpde.parser.ActiveProgram();
			(function($this) {
				var $r;
				var tmp = program;
				$r = (Std["is"](tmp,xpde.parser.Scope)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this)).concat(tempScope);
			this.ClassBodyDeclaration(function($this) {
				var $r;
				var tmp = program;
				$r = (Std["is"](tmp,xpde.parser.ClassScope)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this));
			while(this.StartOf(2)) {
				this.ClassBodyDeclaration(function($this) {
					var $r;
					var tmp = program;
					$r = (Std["is"](tmp,xpde.parser.ClassScope)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this));
			}
		}
		else if(this.StartOf(3)) {
			program = new xpde.parser.StaticProgram();
			(function($this) {
				var $r;
				var tmp = program;
				$r = (Std["is"](tmp,xpde.parser.Scope)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this)).concat(tempScope);
			this.BlockStatement(function($this) {
				var $r;
				var tmp = program;
				$r = (Std["is"](tmp,xpde.parser.BlockScope)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this));
			while(this.StartOf(3)) {
				this.BlockStatement(function($this) {
					var $r;
					var tmp = program;
					$r = (Std["is"](tmp,xpde.parser.BlockScope)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this));
			}
		}
		else this.SynErr(102);
		if(this.la.kind != xpde.parser.Parser._EOF) this.error("unexpected script termination");
	}
	else this.SynErr(103);
	return program;
}
xpde.parser.Parser.prototype.PrefixOp = function() {
	var operator = null;
	if(this.la.kind == 35) {
		this.Get();
		operator = xpde.parser.PrefixOperator.OpNot;
	}
	else if(this.la.kind == 40) {
		this.Get();
		operator = xpde.parser.PrefixOperator.OpBitwiseNot;
	}
	else if(this.la.kind == 36) {
		this.Get();
		operator = xpde.parser.PrefixOperator.OpUnaryPlus;
	}
	else if(this.la.kind == 34) {
		this.Get();
		operator = xpde.parser.PrefixOperator.OpUnaryMinus;
	}
	else this.SynErr(132);
	return operator;
}
xpde.parser.Parser.prototype.Primary = function() {
	var expression = null;
	switch(this.la.kind) {
	case 33:{
		this.Get();
		var arg = this.Expression0();
		this.Expect(39);
		expression = arg;
	}break;
	case 23:{
		this.Get();
		var arg = this.ArgumentsOpt(xpde.parser.Expression.EThisReference);
		expression = arg;
	}break;
	case 22:{
		this.Get();
		var arg = this.SuperSuffix();
		expression = arg;
	}break;
	case 2:case 3:case 4:case 5:case 11:case 18:case 24:{
		var arg = this.Literal();
		expression = arg;
	}break;
	case 17:{
		this.Get();
		var arg = this.Creator();
		expression = arg;
	}break;
	case 1:{
		this.Get();
		var identifier = this.t.val, base = null;
		while(this.dotAndIdent()) {
			this.Expect(29);
			this.Expect(1);
			base = xpde.parser.Expression.EReference(identifier,base);
			identifier = this.t.val;
		}
		expression = xpde.parser.Expression.EReference(identifier,base);
		if(this.isIdentSuffix()) {
			var arg = this.IdentifierSuffix(identifier,base);
			expression = arg;
		}
	}break;
	case 6:case 7:case 8:case 10:case 13:case 15:case 16:case 20:{
		var type = this.BasicType();
		var bCount = this.BracketsOpt();
		this.Expect(29);
		this.Expect(9);
	}break;
	case 25:{
		this.Get();
		this.Expect(29);
		this.Expect(9);
	}break;
	default:{
		this.SynErr(133);
	}break;
	}
	return expression;
}
xpde.parser.Parser.prototype.Qualident = function() {
	var qualident = null;
	qualident = [];
	this.Expect(1);
	qualident.push(this.t.val);
	while(this.la.kind == 29) {
		this.Get();
		this.Expect(1);
		qualident.push(this.t.val);
	}
	return qualident;
}
xpde.parser.Parser.prototype.QualidentList = function() {
	var list = [];
	var qualident = this.Qualident();
	list.push(qualident);
	while(this.la.kind == 27) {
		this.Get();
		var qualident1 = this.Qualident();
		list.push(qualident1);
	}
}
xpde.parser.Parser.prototype.QualifiedImport = function() {
	var importIdent = null;
	this.Expect(29);
	if(this.la.kind == 1) {
		this.Get();
		importIdent = [this.t.val];
		if(this.la.kind == 29) {
			var arg = this.QualifiedImport();
			importIdent = importIdent.concat(arg);
		}
	}
	else if(this.la.kind == 43) {
		this.Get();
		importIdent = ["*"];
	}
	else this.SynErr(108);
	return importIdent;
}
xpde.parser.Parser.prototype.Selector = function(base) {
	var expression = null;
	if(this.la.kind == 29) {
		this.Get();
		if(this.la.kind == 1) {
			this.Get();
			var identifier = this.t.val;
			var arg = this.ArgumentsMethodOpt(identifier,base);
			expression = arg;
		}
		else if(this.la.kind == 22) {
			this.Get();
			var arguments = this.Arguments();
		}
		else if(this.la.kind == 17) {
			this.Get();
			this.InnerCreator();
		}
		else this.SynErr(134);
	}
	else if(this.la.kind == 32) {
		this.Get();
		var index = this.Expression0();
		this.Expect(38);
		expression = xpde.parser.Expression.EArrayAccess(index,base);
	}
	else this.SynErr(135);
	return expression;
}
xpde.parser.Parser.prototype.SemErr = function(msg) {
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SemErr(this.t.line,this.t.col,msg);
	this.errDist = 0;
}
xpde.parser.Parser.prototype.StartOf = function(s) {
	return xpde.parser.Parser.set[s][this.la.kind];
}
xpde.parser.Parser.prototype.Statement0 = function(scope) {
	var statement = null;
	if(this.la.kind == 31) {
		var block = this.Block(scope);
		statement = block;
	}
	else if(this.la.kind == 57) {
		this.Get();
		var condition = this.ParExpression();
		var thenStatement = this.Statement0(scope);
		var elseStatement = null;
		if(this.la.kind == 58) {
			this.Get();
			var body = this.Statement0(scope);
			elseStatement = body;
		}
		statement = xpde.parser.Statement.SConditional(condition,thenStatement,elseStatement);
	}
	else if(this.la.kind == 59) {
		this.Get();
		this.Expect(33);
		var forScope = new xpde.parser.BlockScope();
		if(this.StartOf(21)) {
			this.ForInit(forScope);
		}
		this.Expect(41);
		var conditional = xpde.parser.Expression.EBooleanLiteral(true);
		if(this.StartOf(13)) {
			var expression = this.Expression0();
			conditional = expression;
		}
		this.Expect(41);
		var body = [];
		if(this.StartOf(13)) {
			var updates = this.ForUpdate();
			body = updates;
		}
		this.Expect(39);
		var arg = this.Statement0(scope);
		body = [arg].concat(body);
		forScope.pushStatement(xpde.parser.Statement.SLoop(conditional,xpde.parser.Statement.SBlock([],body),false));
		statement = forScope.getStatement();
	}
	else if(this.la.kind == 60) {
		this.Get();
		var condition = this.ParExpression();
		var body = this.Statement0(scope);
		statement = xpde.parser.Statement.SLoop(condition,body,false);
	}
	else if(this.la.kind == 61) {
		this.Get();
		var body = this.Statement0(scope);
		this.Expect(60);
		var condition = this.ParExpression();
		this.Expect(41);
		statement = xpde.parser.Statement.SLoop(condition,body,true);
	}
	else if(this.la.kind == 62) {
		this.Get();
		var body = this.Block(scope);
		var catches = [], finallyBody = null;
		if(this.la.kind == 69) {
			var _catches = this.Catches(scope);
			catches = _catches;
			if(this.la.kind == 63) {
				this.Get();
				var block = this.Block(scope);
				finallyBody = block;
			}
		}
		else if(this.la.kind == 63) {
			this.Get();
			var block = this.Block(scope);
			finallyBody = block;
		}
		else this.SynErr(123);
		statement = xpde.parser.Statement.STry(body,catches,finallyBody);
	}
	else if(this.la.kind == 64) {
		this.Get();
		var expression = this.ParExpression();
		this.Expect(31);
		this.SwitchBlockStatementGroups();
		this.Expect(37);
	}
	else if(this.la.kind == 49) {
		this.Get();
		var expression = this.ParExpression();
		var block = this.Block(null);
	}
	else if(this.la.kind == 65) {
		this.Get();
		var value = null;
		if(this.StartOf(13)) {
			var expression = this.Expression0();
			value = expression;
		}
		this.Expect(41);
		statement = xpde.parser.Statement.SReturn(value);
	}
	else if(this.la.kind == 66) {
		this.Get();
		var expression = this.Expression0();
		this.Expect(41);
		statement = xpde.parser.Statement.SThrow(expression);
	}
	else if(this.la.kind == 67) {
		this.Get();
		var label = null;
		if(this.la.kind == 1) {
			this.Get();
			label = this.t.val;
		}
		this.Expect(41);
		statement = xpde.parser.Statement.SBreak(label);
	}
	else if(this.la.kind == 68) {
		this.Get();
		var label = null;
		if(this.la.kind == 1) {
			this.Get();
			label = this.t.val;
		}
		this.Expect(41);
		statement = xpde.parser.Statement.SContinue(label);
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else if(this.isLabel()) {
		this.Expect(1);
		var label = this.t.val;
		this.Expect(26);
		var body = this.Statement0(scope);
		statement = xpde.parser.Statement.SLabel(label,body);
	}
	else if(this.StartOf(13)) {
		var arg = this.StatementExpression();
		this.Expect(41);
		statement = arg;
	}
	else this.SynErr(124);
	return statement;
}
xpde.parser.Parser.prototype.StatementExpression = function() {
	var statement = null;
	var expression = this.Expression0();
	this.checkExprStat(expression);
	statement = xpde.parser.Statement.SExpression(expression);
	return statement;
}
xpde.parser.Parser.prototype.SuperSuffix = function() {
	var expression = null;
	if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = xpde.parser.Expression.ECall(xpde.parser.Expression.ESuperReference,arguments);
	}
	else if(this.la.kind == 29) {
		this.Get();
		this.Expect(1);
		var identifier = this.t.val;
		var arg = this.ArgumentsMethodOpt(identifier,xpde.parser.Expression.ESuperReference);
		expression = arg;
	}
	else this.SynErr(136);
	return expression;
}
xpde.parser.Parser.prototype.SwitchBlockStatementGroup = function() {
	this.SwitchLabel();
	while(this.StartOf(3)) {
		this.BlockStatement(null);
	}
}
xpde.parser.Parser.prototype.SwitchBlockStatementGroups = function() {
	while(this.la.kind == 70 || this.la.kind == 71) {
		this.SwitchBlockStatementGroup();
	}
}
xpde.parser.Parser.prototype.SwitchLabel = function() {
	if(this.la.kind == 70) {
		this.Get();
		var expression = this.Expression0();
		this.Expect(26);
	}
	else if(this.la.kind == 71) {
		this.Get();
		this.Expect(26);
	}
	else this.SynErr(126);
}
xpde.parser.Parser.prototype.SynErr = function(n) {
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SynErr(this.la.line,this.la.col,n);
	this.errDist = 0;
}
xpde.parser.Parser.prototype.Type = function() {
	var type = null;
	if(this.la.kind == 1) {
		var qualident = this.Qualident();
		type = xpde.parser.DataType.DTReference(qualident);
	}
	else if(this.StartOf(12)) {
		var primitive = this.BasicType();
		type = xpde.parser.DataType.DTPrimitive(primitive);
	}
	else this.SynErr(113);
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	return type;
}
xpde.parser.Parser.prototype.TypeDeclaration = function(scope) {
	if(this.StartOf(9)) {
		this.ClassOrInterfaceDeclaration(scope);
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(107);
}
xpde.parser.Parser.prototype.TypeList = function() {
	var list = null;
	list = [];
	var type = this.Type();
	list.push(type);
	while(this.la.kind == 27) {
		this.Get();
		var type1 = this.Type();
		list.push(type1);
	}
	return list;
}
xpde.parser.Parser.prototype.VariableDeclarator = function(scope,modifiers,type) {
	this.Expect(1);
	var identifier = this.t.val;
	this.VariableDeclaratorRest(scope,modifiers,type,identifier);
}
xpde.parser.Parser.prototype.VariableDeclaratorRest = function(scope,modifiers,type,identifier) {
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	var init = null;
	if(this.la.kind == 52) {
		this.Get();
		var expression = this.VariableInitializer();
		scope.pushStatement(xpde.parser.Statement.SExpression(xpde.parser.Expression.EAssignment(identifier,null,expression)));
	}
	scope.pushDefinition(xpde.parser.Definition.DField(identifier,type,modifiers));
}
xpde.parser.Parser.prototype.VariableDeclarators = function(scope,modifiers,type) {
	this.VariableDeclarator(scope,modifiers,type);
	while(this.la.kind == 27) {
		this.Get();
		this.VariableDeclarator(scope,modifiers,type);
	}
}
xpde.parser.Parser.prototype.VariableDeclaratorsRest = function(scope,m,type,identifier) {
	this.VariableDeclaratorRest(scope,m,type,identifier);
	while(this.la.kind == 27) {
		this.Get();
		this.VariableDeclarator(scope,m,type);
	}
}
xpde.parser.Parser.prototype.VariableInitializer = function() {
	var expression = null;
	if(this.la.kind == 31) {
		var arg = this.ArrayInitializer();
		expression = arg;
	}
	else if(this.StartOf(13)) {
		var arg = this.Expression0();
		expression = arg;
	}
	else this.SynErr(115);
	return expression;
}
xpde.parser.Parser.prototype.VoidInterfaceMethodDeclaratorRest = function() {
	var parameters = this.FormalParameters();
	if(this.la.kind == 55) {
		this.Get();
		this.QualidentList();
	}
	this.Expect(41);
}
xpde.parser.Parser.prototype.VoidMethodDeclaratorRest = function(scope,m,identifier) {
	var body = null;
	var parameters = this.FormalParameters();
	if(this.la.kind == 55) {
		this.Get();
		this.QualidentList();
	}
	if(this.la.kind == 31) {
		var block = this.Block(null);
		body = block;
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(117);
	scope.pushDefinition(xpde.parser.Definition.DMethod(identifier,null,m,parameters,body));
}
xpde.parser.Parser.prototype.WeakSeparator = function(n,syFol,repFol) {
	var kind = this.la.kind;
	if(kind == n) {
		this.Get();
		return true;
	}
	else if(this.StartOf(repFol)) return false;
	else {
		this.SynErr(n);
		while(!(xpde.parser.Parser.set[syFol][kind] || xpde.parser.Parser.set[repFol][kind] || xpde.parser.Parser.set[0][kind])) {
			this.Get();
			kind = this.la.kind;
		}
		return this.StartOf(syFol);
	}
}
xpde.parser.Parser.prototype.addModifier = function(set,modifier) {
	if(set.contains(modifier)) this.error("repeated modifier " + modifier);
	else set.add(modifier);
}
xpde.parser.Parser.prototype.checkExprStat = function(expression) {
	var $e = (expression);
	switch( $e[1] ) {
	case 4:
	{
		null;
	}break;
	case 5:
	{
		null;
	}break;
	case 9:
	{
		null;
	}break;
	case 3:
	{
		null;
	}break;
	case 10:
	{
		null;
	}break;
	case 11:
	{
		null;
	}break;
	default:{
		this.error("not a statement" + " (" + expression + ")");
	}break;
	}
}
xpde.parser.Parser.prototype.checkModifierAccess = function(set) {
	var access = 0;
	if(set.contains(xpde.parser.Modifier.MPublic)) access++;
	if(set.contains(xpde.parser.Modifier.MPrivate)) access++;
	if(set.contains(xpde.parser.Modifier.MProtected)) access++;
	if(access > 1) this.error("illegal combination of modifiers: " + set);
}
xpde.parser.Parser.prototype.checkModifierPermission = function(set,permission) {
	{ var $it14 = set.iterator();
	while( $it14.hasNext() ) { var modifier = $it14.next();
	if(!permission.contains(modifier)) this.error("modifier(s) " + set + "not allowed here");
	else this.checkModifierAccess(set);
	}}
}
xpde.parser.Parser.prototype.commaAndNoRBrace = function() {
	return (this.la.kind == xpde.parser.Parser._comma && this.peek(1).kind != xpde.parser.Parser._rbrace);
}
xpde.parser.Parser.prototype.compoundBrackets = function(type,bCount) {
	if(bCount == 0) return type;
	var $e = (type);
	switch( $e[1] ) {
	case 2:
	var dimensions = $e[3], type1 = $e[2];
	{
		return xpde.parser.DataType.DTArray(type1,dimensions + bCount);
	}break;
	default:{
		return xpde.parser.DataType.DTArray(type,bCount);
	}break;
	}
}
xpde.parser.Parser.prototype.dotAndIdent = function() {
	return this.la.kind == xpde.parser.Parser._dot && this.peek(1).kind == xpde.parser.Parser._ident;
}
xpde.parser.Parser.prototype.emptyBracket = function() {
	return (this.la.kind == xpde.parser.Parser._lbrack && this.peek(1).kind == xpde.parser.Parser._rbrack);
}
xpde.parser.Parser.prototype.errDist = null;
xpde.parser.Parser.prototype.error = function(s) {
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SemErr(this.la.line,this.la.col,s);
	this.errDist = 0;
}
xpde.parser.Parser.prototype.errors = null;
xpde.parser.Parser.prototype.guessTypeCast = function() {
	this.scanner.ResetPeek();
	var pt = this.scanner.Peek();
	pt = this.rdQualident(pt);
	if(pt != null) {
		pt = this.skipDims(pt);
		if(pt != null) {
			var pt1 = this.scanner.Peek();
			return pt.kind == xpde.parser.Parser._rpar && xpde.parser.Parser.castFollower.bitset[pt1.kind];
		}
	}
	return false;
}
xpde.parser.Parser.prototype.identAndLPar = function() {
	return this.la.kind == xpde.parser.Parser._ident && this.peek(1).kind == xpde.parser.Parser._lpar;
}
xpde.parser.Parser.prototype.isActiveProgram = function() {
	return (this.la.kind == xpde.parser.Parser._void && this.peek(1).kind == xpde.parser.Parser._ident && this.peek(2).kind == xpde.parser.Parser._lpar);
}
xpde.parser.Parser.prototype.isIdentSuffix = function() {
	if(this.la.kind == xpde.parser.Parser._dot) {
		this.scanner.ResetPeek();
		var pt = this.scanner.Peek();
		if(pt.kind == xpde.parser.Parser._super) return this.scanner.Peek().kind == xpde.parser.Parser._dot;
		return (pt.kind == xpde.parser.Parser._class || pt.kind == xpde.parser.Parser._this);
	}
	return (this.la.kind == xpde.parser.Parser._lpar || this.emptyBracket());
}
xpde.parser.Parser.prototype.isJavaProgram = function() {
	return (this.la.kind == xpde.parser.Parser._public && this.peek(1).kind == xpde.parser.Parser._class) || (this.la.kind == xpde.parser.Parser._import_);
}
xpde.parser.Parser.prototype.isLabel = function() {
	return this.la.kind == xpde.parser.Parser._ident && this.peek(1).kind == xpde.parser.Parser._colon;
}
xpde.parser.Parser.prototype.isLocalVarDecl = function(finalIsSuccess) {
	var pt = this.la;
	this.scanner.ResetPeek();
	if(this.la.kind == xpde.parser.Parser._final) if(finalIsSuccess) return true;
	else pt = this.scanner.Peek();
	if(xpde.parser.Parser.typeKW.bitset[pt.kind]) pt = this.scanner.Peek();
	else pt = this.rdQualident(pt);
	if(pt != null) {
		pt = this.skipDims(pt);
		if(pt != null) {
			return pt.kind == xpde.parser.Parser._ident;
		}
	}
	return false;
}
xpde.parser.Parser.prototype.isSimpleTypeCast = function() {
	this.scanner.ResetPeek();
	var pt1 = this.scanner.Peek();
	if(xpde.parser.Parser.typeKW.bitset[pt1.kind]) {
		var pt = this.scanner.Peek();
		pt = this.skipDims(pt);
		if(pt != null) {
			return pt.kind == xpde.parser.Parser._rpar;
		}
	}
	return false;
}
xpde.parser.Parser.prototype.isTypeCast = function() {
	if(this.la.kind != xpde.parser.Parser._lpar) return false;
	if(this.isSimpleTypeCast()) return true;
	return this.guessTypeCast();
}
xpde.parser.Parser.prototype.la = null;
xpde.parser.Parser.prototype.nonEmptyBracket = function() {
	return (this.la.kind == xpde.parser.Parser._lbrack && this.peek(1).kind != xpde.parser.Parser._rbrack);
}
xpde.parser.Parser.prototype.peek = function(n) {
	this.scanner.ResetPeek();
	var x = this.la;
	while(n > 0) {
		x = this.scanner.Peek();
		n--;
	}
	return x;
}
xpde.parser.Parser.prototype.rdQualident = function(pt) {
	var qualident = "";
	if(pt.kind == xpde.parser.Parser._ident) {
		qualident = pt.val;
		pt = this.scanner.Peek();
		while(pt.kind == xpde.parser.Parser._dot) {
			pt = this.scanner.Peek();
			if(pt.kind != xpde.parser.Parser._ident) return null;
			qualident += "." + pt.val;
			pt = this.scanner.Peek();
		}
		return pt;
	}
	else return null;
}
xpde.parser.Parser.prototype.scanner = null;
xpde.parser.Parser.prototype.skipDims = function(pt) {
	if(pt.kind != xpde.parser.Parser._lbrack) return pt;
	do {
		pt = this.scanner.Peek();
		if(pt.kind != xpde.parser.Parser._rbrack) return null;
		pt = this.scanner.Peek();
	} while(pt.kind == xpde.parser.Parser._lbrack);
	return pt;
}
xpde.parser.Parser.prototype.t = null;
xpde.parser.Parser.prototype.__class__ = xpde.parser.Parser;
xpde.parser.Errors = function(p) { if( p === $_ ) return; {
	this.count = 0;
}}
xpde.parser.Errors.__name__ = ["xpde","parser","Errors"];
xpde.parser.Errors.prototype.SemErr = function(line,col,s) {
	if(line == null) this.printMsg(line,col,s);
	else haxe.Log.trace(s,{ fileName : "Parser.hx", lineNumber : 1933, className : "xpde.parser.Errors", methodName : "SemErr"});
	this.count++;
	throw new xpde.parser.FatalError(s);
}
xpde.parser.Errors.prototype.SynErr = function(line,col,n) {
	var s;
	switch(n) {
	case 0:{
		s = "EOF expected";
	}break;
	case 1:{
		s = "ident expected";
	}break;
	case 2:{
		s = "intLit expected";
	}break;
	case 3:{
		s = "floatLit expected";
	}break;
	case 4:{
		s = "charLit expected";
	}break;
	case 5:{
		s = "stringLit expected";
	}break;
	case 6:{
		s = "boolean expected";
	}break;
	case 7:{
		s = "byte expected";
	}break;
	case 8:{
		s = "char expected";
	}break;
	case 9:{
		s = "class expected";
	}break;
	case 10:{
		s = "double expected";
	}break;
	case 11:{
		s = "false expected";
	}break;
	case 12:{
		s = "final expected";
	}break;
	case 13:{
		s = "float expected";
	}break;
	case 14:{
		s = "import_ expected";
	}break;
	case 15:{
		s = "int expected";
	}break;
	case 16:{
		s = "long expected";
	}break;
	case 17:{
		s = "new expected";
	}break;
	case 18:{
		s = "null expected";
	}break;
	case 19:{
		s = "public expected";
	}break;
	case 20:{
		s = "short expected";
	}break;
	case 21:{
		s = "static expected";
	}break;
	case 22:{
		s = "super expected";
	}break;
	case 23:{
		s = "this expected";
	}break;
	case 24:{
		s = "true expected";
	}break;
	case 25:{
		s = "void expected";
	}break;
	case 26:{
		s = "colon expected";
	}break;
	case 27:{
		s = "comma expected";
	}break;
	case 28:{
		s = "dec expected";
	}break;
	case 29:{
		s = "dot expected";
	}break;
	case 30:{
		s = "inc expected";
	}break;
	case 31:{
		s = "lbrace expected";
	}break;
	case 32:{
		s = "lbrack expected";
	}break;
	case 33:{
		s = "lpar expected";
	}break;
	case 34:{
		s = "minus expected";
	}break;
	case 35:{
		s = "not expected";
	}break;
	case 36:{
		s = "plus expected";
	}break;
	case 37:{
		s = "rbrace expected";
	}break;
	case 38:{
		s = "rbrack expected";
	}break;
	case 39:{
		s = "rpar expected";
	}break;
	case 40:{
		s = "tilde expected";
	}break;
	case 41:{
		s = "\";\" expected";
	}break;
	case 42:{
		s = "\"package\" expected";
	}break;
	case 43:{
		s = "\"*\" expected";
	}break;
	case 44:{
		s = "\"protected\" expected";
	}break;
	case 45:{
		s = "\"private\" expected";
	}break;
	case 46:{
		s = "\"abstract\" expected";
	}break;
	case 47:{
		s = "\"strictfp\" expected";
	}break;
	case 48:{
		s = "\"native\" expected";
	}break;
	case 49:{
		s = "\"synchronized\" expected";
	}break;
	case 50:{
		s = "\"transient\" expected";
	}break;
	case 51:{
		s = "\"volatile\" expected";
	}break;
	case 52:{
		s = "\"=\" expected";
	}break;
	case 53:{
		s = "\"extends\" expected";
	}break;
	case 54:{
		s = "\"implements\" expected";
	}break;
	case 55:{
		s = "\"throws\" expected";
	}break;
	case 56:{
		s = "\"interface\" expected";
	}break;
	case 57:{
		s = "\"if\" expected";
	}break;
	case 58:{
		s = "\"else\" expected";
	}break;
	case 59:{
		s = "\"for\" expected";
	}break;
	case 60:{
		s = "\"while\" expected";
	}break;
	case 61:{
		s = "\"do\" expected";
	}break;
	case 62:{
		s = "\"try\" expected";
	}break;
	case 63:{
		s = "\"finally\" expected";
	}break;
	case 64:{
		s = "\"switch\" expected";
	}break;
	case 65:{
		s = "\"return\" expected";
	}break;
	case 66:{
		s = "\"throw\" expected";
	}break;
	case 67:{
		s = "\"break\" expected";
	}break;
	case 68:{
		s = "\"continue\" expected";
	}break;
	case 69:{
		s = "\"catch\" expected";
	}break;
	case 70:{
		s = "\"case\" expected";
	}break;
	case 71:{
		s = "\"default\" expected";
	}break;
	case 72:{
		s = "\"?\" expected";
	}break;
	case 73:{
		s = "\"instanceof\" expected";
	}break;
	case 74:{
		s = "\"+=\" expected";
	}break;
	case 75:{
		s = "\"-=\" expected";
	}break;
	case 76:{
		s = "\"*=\" expected";
	}break;
	case 77:{
		s = "\"/=\" expected";
	}break;
	case 78:{
		s = "\"&=\" expected";
	}break;
	case 79:{
		s = "\"|=\" expected";
	}break;
	case 80:{
		s = "\"^=\" expected";
	}break;
	case 81:{
		s = "\"%=\" expected";
	}break;
	case 82:{
		s = "\"<<=\" expected";
	}break;
	case 83:{
		s = "\">>=\" expected";
	}break;
	case 84:{
		s = "\">>>=\" expected";
	}break;
	case 85:{
		s = "\"||\" expected";
	}break;
	case 86:{
		s = "\"&&\" expected";
	}break;
	case 87:{
		s = "\"|\" expected";
	}break;
	case 88:{
		s = "\"^\" expected";
	}break;
	case 89:{
		s = "\"&\" expected";
	}break;
	case 90:{
		s = "\"==\" expected";
	}break;
	case 91:{
		s = "\"!=\" expected";
	}break;
	case 92:{
		s = "\"<\" expected";
	}break;
	case 93:{
		s = "\">\" expected";
	}break;
	case 94:{
		s = "\"<=\" expected";
	}break;
	case 95:{
		s = "\">=\" expected";
	}break;
	case 96:{
		s = "\"<<\" expected";
	}break;
	case 97:{
		s = "\">>\" expected";
	}break;
	case 98:{
		s = "\">>>\" expected";
	}break;
	case 99:{
		s = "\"/\" expected";
	}break;
	case 100:{
		s = "\"%\" expected";
	}break;
	case 101:{
		s = "??? expected";
	}break;
	case 102:{
		s = "invalid PdeProgram";
	}break;
	case 103:{
		s = "invalid PdeProgram";
	}break;
	case 104:{
		s = "invalid ClassBodyDeclaration";
	}break;
	case 105:{
		s = "invalid ClassBodyDeclaration";
	}break;
	case 106:{
		s = "invalid BlockStatement";
	}break;
	case 107:{
		s = "invalid TypeDeclaration";
	}break;
	case 108:{
		s = "invalid QualifiedImport";
	}break;
	case 109:{
		s = "invalid ClassOrInterfaceDeclaration";
	}break;
	case 110:{
		s = "invalid ClassModifier";
	}break;
	case 111:{
		s = "invalid Modifier0";
	}break;
	case 112:{
		s = "invalid Modifier1";
	}break;
	case 113:{
		s = "invalid Type";
	}break;
	case 114:{
		s = "invalid BasicType";
	}break;
	case 115:{
		s = "invalid VariableInitializer";
	}break;
	case 116:{
		s = "invalid MemberDecl";
	}break;
	case 117:{
		s = "invalid VoidMethodDeclaratorRest";
	}break;
	case 118:{
		s = "invalid MethodOrFieldRest";
	}break;
	case 119:{
		s = "invalid MethodDeclaratorRest";
	}break;
	case 120:{
		s = "invalid InterfaceBodyDeclaration";
	}break;
	case 121:{
		s = "invalid InterfaceMemberDecl";
	}break;
	case 122:{
		s = "invalid InterfaceMethodOrFieldRest";
	}break;
	case 123:{
		s = "invalid Statement0";
	}break;
	case 124:{
		s = "invalid Statement0";
	}break;
	case 125:{
		s = "invalid ForInit";
	}break;
	case 126:{
		s = "invalid SwitchLabel";
	}break;
	case 127:{
		s = "invalid AssignmentOperator";
	}break;
	case 128:{
		s = "invalid Expression3";
	}break;
	case 129:{
		s = "invalid Expression2Rest";
	}break;
	case 130:{
		s = "invalid Infixop";
	}break;
	case 131:{
		s = "invalid Increment";
	}break;
	case 132:{
		s = "invalid PrefixOp";
	}break;
	case 133:{
		s = "invalid Primary";
	}break;
	case 134:{
		s = "invalid Selector";
	}break;
	case 135:{
		s = "invalid Selector";
	}break;
	case 136:{
		s = "invalid SuperSuffix";
	}break;
	case 137:{
		s = "invalid Literal";
	}break;
	case 138:{
		s = "invalid Creator";
	}break;
	case 139:{
		s = "invalid Creator";
	}break;
	case 140:{
		s = "invalid IdentifierSuffix";
	}break;
	case 141:{
		s = "invalid IdentifierSuffix";
	}break;
	case 142:{
		s = "invalid ArrayCreatorRest";
	}break;
	default:{
		s = "error " + n;
	}break;
	}
	this.printMsg(line,col,s);
	this.count++;
	throw new xpde.parser.FatalError(s);
}
xpde.parser.Errors.prototype.Warning = function(line,col,s) {
	if(line == null) this.printMsg(line,col,s);
	else haxe.Log.trace(s,{ fileName : "Parser.hx", lineNumber : 1939, className : "xpde.parser.Errors", methodName : "Warning"});
}
xpde.parser.Errors.prototype.count = null;
xpde.parser.Errors.prototype.printMsg = function(line,column,msg) {
	var b = xpde.parser.Errors.errMsgFormat;
	b = StringTools.replace(b,"{0}",Std.string(line));
	b = StringTools.replace(b,"{1}",Std.string(column));
	b = StringTools.replace(b,"{2}",msg);
	haxe.Log.trace(b,{ fileName : "Parser.hx", lineNumber : 1776, className : "xpde.parser.Errors", methodName : "printMsg"});
}
xpde.parser.Errors.prototype.__class__ = xpde.parser.Errors;
xpde.parser.FatalError = function(s) { if( s === $_ ) return; {
	this.message = s;
}}
xpde.parser.FatalError.__name__ = ["xpde","parser","FatalError"];
xpde.parser.FatalError.prototype.message = null;
xpde.parser.FatalError.prototype.__class__ = xpde.parser.FatalError;
xpde.parser.ModifierSet = function() { }
xpde.parser.ModifierSet.__name__ = ["xpde","parser","ModifierSet"];
xpde.parser.ModifierSet.prototype.__class__ = xpde.parser.ModifierSet;
xpde.parser.OperationBuilder = function(p) { if( p === $_ ) return; {
	this.operators = [];
	this.operands = [];
}}
xpde.parser.OperationBuilder.__name__ = ["xpde","parser","OperationBuilder"];
xpde.parser.OperationBuilder.prototype.lookupOperatorPrecedence = function(operator) {
	return function($this) {
		var $r;
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		{
			$r = 3;
		}break;
		case 1:
		{
			$r = 4;
		}break;
		case 2:
		{
			$r = 5;
		}break;
		case 3:
		{
			$r = 6;
		}break;
		case 4:
		{
			$r = 7;
		}break;
		case 5:
		case 6:
		{
			$r = 8;
		}break;
		case 7:
		case 8:
		case 9:
		case 10:
		{
			$r = 9;
		}break;
		case 11:
		case 12:
		case 13:
		{
			$r = 10;
		}break;
		case 14:
		case 15:
		{
			$r = 11;
		}break;
		case 16:
		case 17:
		case 18:
		{
			$r = 12;
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
xpde.parser.OperationBuilder.prototype.operand = function(operand) {
	this.operands.push(operand);
}
xpde.parser.OperationBuilder.prototype.operands = null;
xpde.parser.OperationBuilder.prototype.operator = function(operator) {
	this.reduce(this.lookupOperatorPrecedence(operator));
	this.operators.push(operator);
}
xpde.parser.OperationBuilder.prototype.operators = null;
xpde.parser.OperationBuilder.prototype.reduce = function(precedence) {
	if(precedence == null) precedence = 0;
	while(this.operators.length > 0 && this.lookupOperatorPrecedence(this.operators[this.operators.length - 1]) >= precedence) this.reduceOperator(this.operators.pop());
	return this.operands[0];
}
xpde.parser.OperationBuilder.prototype.reduceOperator = function(operator) {
	var b = this.operands.pop(), a = this.operands.pop();
	this.operands.push(xpde.parser.Expression.EInfixOperation(operator,a,b));
}
xpde.parser.OperationBuilder.prototype.__class__ = xpde.parser.OperationBuilder;
xpde.parser.Scope = function(p) { if( p === $_ ) return; {
	this.definitions = [];
}}
xpde.parser.Scope.__name__ = ["xpde","parser","Scope"];
xpde.parser.Scope.prototype.concat = function(block) {
	var _g = 0, _g1 = block.definitions;
	while(_g < _g1.length) {
		var definition = _g1[_g];
		++_g;
		this.pushDefinition(definition);
	}
}
xpde.parser.Scope.prototype.definitions = null;
xpde.parser.Scope.prototype.getDefinitions = function() {
	return this.definitions;
}
xpde.parser.Scope.prototype.parent = null;
xpde.parser.Scope.prototype.pushDefinition = function(definition) {
	this.definitions.push(definition);
}
xpde.parser.Scope.prototype.__class__ = xpde.parser.Scope;
xpde.parser.CompilationUnitScope = function(p) { if( p === $_ ) return; {
	xpde.parser.Scope.apply(this,[]);
	this._package = [];
	this._imports = [];
}}
xpde.parser.CompilationUnitScope.__name__ = ["xpde","parser","CompilationUnitScope"];
xpde.parser.CompilationUnitScope.__super__ = xpde.parser.Scope;
for(var k in xpde.parser.Scope.prototype ) xpde.parser.CompilationUnitScope.prototype[k] = xpde.parser.Scope.prototype[k];
xpde.parser.CompilationUnitScope.prototype._imports = null;
xpde.parser.CompilationUnitScope.prototype._package = null;
xpde.parser.CompilationUnitScope.prototype.getImports = function() {
	return this._imports;
}
xpde.parser.CompilationUnitScope.prototype.getPackage = function() {
	return this._package;
}
xpde.parser.CompilationUnitScope.prototype.pushImport = function(ident) {
	this._imports.push(ident);
}
xpde.parser.CompilationUnitScope.prototype.setPackage = function(ident) {
	this._package = ident;
}
xpde.parser.CompilationUnitScope.prototype.__class__ = xpde.parser.CompilationUnitScope;
xpde.parser.BlockScope = function(p) { if( p === $_ ) return; {
	xpde.parser.Scope.apply(this,[]);
	this.statements = [];
}}
xpde.parser.BlockScope.__name__ = ["xpde","parser","BlockScope"];
xpde.parser.BlockScope.__super__ = xpde.parser.Scope;
for(var k in xpde.parser.Scope.prototype ) xpde.parser.BlockScope.prototype[k] = xpde.parser.Scope.prototype[k];
xpde.parser.BlockScope.prototype.concat = function(block) {
	xpde.parser.Scope.prototype.concat.apply(this,[block]);
	var block1 = function($this) {
		var $r;
		var tmp = block;
		$r = (Std["is"](tmp,xpde.parser.BlockScope)?tmp:function($this) {
			var $r;
			throw "Class cast error";
			return $r;
		}($this));
		return $r;
	}(this);
	{
		var _g = 0, _g1 = block1.statements;
		while(_g < _g1.length) {
			var statement = _g1[_g];
			++_g;
			this.pushStatement(statement);
		}
	}
}
xpde.parser.BlockScope.prototype.getStatement = function() {
	return xpde.parser.Statement.SBlock(this.definitions,this.statements);
}
xpde.parser.BlockScope.prototype.pushStatement = function(statement) {
	this.statements.push(statement);
}
xpde.parser.BlockScope.prototype.statements = null;
xpde.parser.BlockScope.prototype.__class__ = xpde.parser.BlockScope;
xpde.parser.ClassScope = function(p) { if( p === $_ ) return; {
	xpde.parser.BlockScope.apply(this,[]);
}}
xpde.parser.ClassScope.__name__ = ["xpde","parser","ClassScope"];
xpde.parser.ClassScope.__super__ = xpde.parser.BlockScope;
for(var k in xpde.parser.BlockScope.prototype ) xpde.parser.ClassScope.prototype[k] = xpde.parser.BlockScope.prototype[k];
xpde.parser.ClassScope.prototype.getStatement = function() {
	return xpde.parser.Statement.SBlock([],this.statements);
}
xpde.parser.ClassScope.prototype.__class__ = xpde.parser.ClassScope;
xpde.parser.PdeProgram = function() { }
xpde.parser.PdeProgram.__name__ = ["xpde","parser","PdeProgram"];
xpde.parser.PdeProgram.prototype.getCompilationUnit = null;
xpde.parser.PdeProgram.prototype.__class__ = xpde.parser.PdeProgram;
xpde.parser.JavaProgram = function(p) { if( p === $_ ) return; {
	xpde.parser.CompilationUnitScope.apply(this,[]);
}}
xpde.parser.JavaProgram.__name__ = ["xpde","parser","JavaProgram"];
xpde.parser.JavaProgram.__super__ = xpde.parser.CompilationUnitScope;
for(var k in xpde.parser.CompilationUnitScope.prototype ) xpde.parser.JavaProgram.prototype[k] = xpde.parser.CompilationUnitScope.prototype[k];
xpde.parser.JavaProgram.prototype.getCompilationUnit = function(identifier) {
	return { packageIdent : this._package, importIdents : this._imports, definitions : this.definitions}
}
xpde.parser.JavaProgram.prototype.__class__ = xpde.parser.JavaProgram;
xpde.parser.JavaProgram.__interfaces__ = [xpde.parser.PdeProgram];
xpde.parser.ActiveProgram = function(p) { if( p === $_ ) return; {
	xpde.parser.ClassScope.apply(this,[]);
}}
xpde.parser.ActiveProgram.__name__ = ["xpde","parser","ActiveProgram"];
xpde.parser.ActiveProgram.__super__ = xpde.parser.ClassScope;
for(var k in xpde.parser.ClassScope.prototype ) xpde.parser.ActiveProgram.prototype[k] = xpde.parser.ClassScope.prototype[k];
xpde.parser.ActiveProgram.prototype.getCompilationUnit = function(identifier) {
	var classDefinition = xpde.parser.Definition.DClass(identifier,new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic]),this.definitions,xpde.parser.DataType.DTReference(["PApplet"]));
	return { packageIdent : [], importIdents : [["xpde","core","*"],["xpde","xml","*"]], definitions : [classDefinition]}
}
xpde.parser.ActiveProgram.prototype.__class__ = xpde.parser.ActiveProgram;
xpde.parser.ActiveProgram.__interfaces__ = [xpde.parser.PdeProgram];
xpde.parser.StaticProgram = function(p) { if( p === $_ ) return; {
	xpde.parser.BlockScope.apply(this,[]);
}}
xpde.parser.StaticProgram.__name__ = ["xpde","parser","StaticProgram"];
xpde.parser.StaticProgram.__super__ = xpde.parser.BlockScope;
for(var k in xpde.parser.BlockScope.prototype ) xpde.parser.StaticProgram.prototype[k] = xpde.parser.BlockScope.prototype[k];
xpde.parser.StaticProgram.prototype.getCompilationUnit = function(identifier) {
	var setupDefinition = xpde.parser.Definition.DMethod("setup",null,new xpde.parser.EnumSet(),[],this.getStatement());
	var classDefinition = xpde.parser.Definition.DClass(identifier,new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic]),[setupDefinition],xpde.parser.DataType.DTReference(["PApplet"]));
	return { packageIdent : [], importIdents : [], definitions : [classDefinition]}
}
xpde.parser.StaticProgram.prototype.__class__ = xpde.parser.StaticProgram;
xpde.parser.StaticProgram.__interfaces__ = [xpde.parser.PdeProgram];
Main = function() { }
Main.__name__ = ["Main"];
Main.main = function() {
	null;
}
Main.start = function() {
	var script = js.Lib.document.getElementById("script").value;
	var scanner = new xpde.parser.Scanner(new haxe.io.StringInput(script));
	var parser = new xpde.parser.Parser(scanner);
	var program = parser.Parse();
	var compiler = new xpde.compiler.SourceCompiler();
	haxe.Log.trace(compiler.compile(program.getCompilationUnit("Sketch")),{ fileName : "Main.hx", lineNumber : 29, className : "Main", methodName : "start"});
	haxe.Log.trace("#DONE#",{ fileName : "Main.hx", lineNumber : 31, className : "Main", methodName : "start"});
}
Main.serialize = function(arg,count) {
	if(count == null) count = 0;
	if(count == 99) return null;
	if(Std["is"](arg,Array)) {
		var ret = {}
		{
			var _g = 0, _g1 = Reflect.fields(arg);
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				ret[Std.parseInt(i)] = Main.serialize(Reflect.field(arg,i));
			}
		}
		return ret;
	}
	else if(Type.getEnum(arg) != null) {
		var ret = {}
		ret["#TYPE#"] = Type.enumConstructor(arg);
		var args = Reflect.field(Type.getEnum(arg),Type.enumConstructor(arg)).toString();
		var argsA = new EReg("^function \\(|\\)[\\s\\S]+$|\\s+","g").replace(args,"").split(","), j = 0;
		{
			var _g = 0;
			while(_g < argsA.length) {
				var i = argsA[_g];
				++_g;
				ret[i] = Main.serialize(Type.enumParameters(arg)[j++],count + 1);
			}
		}
		return ret;
	}
	else if(Std["is"](arg,String)) {
		return arg;
	}
	else if(Std["is"](arg,Hash)) {
		var ret = {}
		var keys = arg.keys();
		{ var $it15 = keys;
		while( $it15.hasNext() ) { var i = $it15.next();
		ret[i] = Main.serialize(arg.get(i),count + 1);
		}}
		return ret;
	}
	else {
		var ret = {}
		{
			var _g = 0, _g1 = Reflect.fields(arg);
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				ret[i] = Main.serialize(Reflect.field(arg,i),count + 1);
			}
		}
		return ret;
	}
}
Main.prototype.__class__ = Main;
$Main = function() { }
$Main.__name__ = ["@Main"];
$Main.prototype.__class__ = $Main;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
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
js.Lib.onerror = null;
xpde.parser.Buffer.EOF = 65535;
xpde.parser.Scanner.EOL = 10;
xpde.parser.Scanner.eofSym = 0;
xpde.parser.Scanner.maxT = 101;
xpde.parser.Scanner.noSym = 101;
xpde.parser.Scanner.start = new xpde.parser.StartStates();
xpde.parser.Scanner.literals = function($this) {
	var $r;
	var literals = new Hash();
	xpde.parser.Scanner.start.set(36,1);
	{
		var _g = 65;
		while(_g < 91) {
			var i = _g++;
			xpde.parser.Scanner.start.set(i,1);
		}
	}
	xpde.parser.Scanner.start.set(95,1);
	{
		var _g = 97;
		while(_g < 123) {
			var i = _g++;
			xpde.parser.Scanner.start.set(i,1);
		}
	}
	xpde.parser.Scanner.start.set(48,46);
	{
		var _g = 49;
		while(_g < 58) {
			var i = _g++;
			xpde.parser.Scanner.start.set(i,47);
		}
	}
	xpde.parser.Scanner.start.set(46,48);
	xpde.parser.Scanner.start.set(39,18);
	xpde.parser.Scanner.start.set(34,27);
	xpde.parser.Scanner.start.set(58,35);
	xpde.parser.Scanner.start.set(44,36);
	xpde.parser.Scanner.start.set(45,73);
	xpde.parser.Scanner.start.set(43,74);
	xpde.parser.Scanner.start.set(123,39);
	xpde.parser.Scanner.start.set(91,40);
	xpde.parser.Scanner.start.set(40,41);
	xpde.parser.Scanner.start.set(33,75);
	xpde.parser.Scanner.start.set(125,42);
	xpde.parser.Scanner.start.set(93,43);
	xpde.parser.Scanner.start.set(41,44);
	xpde.parser.Scanner.start.set(126,45);
	xpde.parser.Scanner.start.set(59,54);
	xpde.parser.Scanner.start.set(42,76);
	xpde.parser.Scanner.start.set(61,77);
	xpde.parser.Scanner.start.set(63,55);
	xpde.parser.Scanner.start.set(47,78);
	xpde.parser.Scanner.start.set(38,79);
	xpde.parser.Scanner.start.set(124,80);
	xpde.parser.Scanner.start.set(94,81);
	xpde.parser.Scanner.start.set(37,82);
	xpde.parser.Scanner.start.set(60,83);
	xpde.parser.Scanner.start.set(62,84);
	xpde.parser.Scanner.start.set(xpde.parser.Buffer.EOF,-1);
	literals.set("boolean",6);
	literals.set("byte",7);
	literals.set("char",8);
	literals.set("class",9);
	literals.set("double",10);
	literals.set("false",11);
	literals.set("final",12);
	literals.set("float",13);
	literals.set("import",14);
	literals.set("int",15);
	literals.set("long",16);
	literals.set("new",17);
	literals.set("null",18);
	literals.set("public",19);
	literals.set("short",20);
	literals.set("static",21);
	literals.set("super",22);
	literals.set("this",23);
	literals.set("true",24);
	literals.set("void",25);
	literals.set("package",42);
	literals.set("protected",44);
	literals.set("private",45);
	literals.set("abstract",46);
	literals.set("strictfp",47);
	literals.set("native",48);
	literals.set("synchronized",49);
	literals.set("transient",50);
	literals.set("volatile",51);
	literals.set("extends",53);
	literals.set("implements",54);
	literals.set("throws",55);
	literals.set("interface",56);
	literals.set("if",57);
	literals.set("else",58);
	literals.set("for",59);
	literals.set("while",60);
	literals.set("do",61);
	literals.set("try",62);
	literals.set("finally",63);
	literals.set("switch",64);
	literals.set("return",65);
	literals.set("throw",66);
	literals.set("break",67);
	literals.set("continue",68);
	literals.set("catch",69);
	literals.set("case",70);
	literals.set("default",71);
	literals.set("instanceof",73);
	$r = literals;
	return $r;
}(this);
xpde.parser.Parser._EOF = 0;
xpde.parser.Parser._ident = 1;
xpde.parser.Parser._intLit = 2;
xpde.parser.Parser._floatLit = 3;
xpde.parser.Parser._charLit = 4;
xpde.parser.Parser._stringLit = 5;
xpde.parser.Parser._boolean = 6;
xpde.parser.Parser._byte = 7;
xpde.parser.Parser._char = 8;
xpde.parser.Parser._class = 9;
xpde.parser.Parser._double = 10;
xpde.parser.Parser._false = 11;
xpde.parser.Parser._final = 12;
xpde.parser.Parser._float = 13;
xpde.parser.Parser._import_ = 14;
xpde.parser.Parser._int = 15;
xpde.parser.Parser._long = 16;
xpde.parser.Parser._new = 17;
xpde.parser.Parser._null = 18;
xpde.parser.Parser._public = 19;
xpde.parser.Parser._short = 20;
xpde.parser.Parser._static = 21;
xpde.parser.Parser._super = 22;
xpde.parser.Parser._this = 23;
xpde.parser.Parser._true = 24;
xpde.parser.Parser._void = 25;
xpde.parser.Parser._colon = 26;
xpde.parser.Parser._comma = 27;
xpde.parser.Parser._dec = 28;
xpde.parser.Parser._dot = 29;
xpde.parser.Parser._inc = 30;
xpde.parser.Parser._lbrace = 31;
xpde.parser.Parser._lbrack = 32;
xpde.parser.Parser._lpar = 33;
xpde.parser.Parser._minus = 34;
xpde.parser.Parser._not = 35;
xpde.parser.Parser._plus = 36;
xpde.parser.Parser._rbrace = 37;
xpde.parser.Parser._rbrack = 38;
xpde.parser.Parser._rpar = 39;
xpde.parser.Parser._tilde = 40;
xpde.parser.Parser.maxT = 101;
xpde.parser.Parser.T = true;
xpde.parser.Parser.x = false;
xpde.parser.Parser.minErrDist = 2;
xpde.parser.Parser.maxTerminals = 160;
xpde.parser.Parser.typeKWarr = [xpde.parser.Parser._byte,xpde.parser.Parser._short,xpde.parser.Parser._char,xpde.parser.Parser._int,xpde.parser.Parser._long,xpde.parser.Parser._float,xpde.parser.Parser._double,xpde.parser.Parser._boolean];
xpde.parser.Parser.castFollowerArr = [xpde.parser.Parser._ident,xpde.parser.Parser._new,xpde.parser.Parser._super,xpde.parser.Parser._this,xpde.parser.Parser._void,xpde.parser.Parser._intLit,xpde.parser.Parser._floatLit,xpde.parser.Parser._charLit,xpde.parser.Parser._stringLit,xpde.parser.Parser._true,xpde.parser.Parser._false,xpde.parser.Parser._null,xpde.parser.Parser._lpar,xpde.parser.Parser._not,xpde.parser.Parser._tilde];
xpde.parser.Parser.prefixArr = [xpde.parser.Parser._inc,xpde.parser.Parser._dec,xpde.parser.Parser._not,xpde.parser.Parser._tilde,xpde.parser.Parser._plus,xpde.parser.Parser._minus];
xpde.parser.Parser.typeKW = xpde.parser.Parser.newSet(xpde.parser.Parser.typeKWarr);
xpde.parser.Parser.castFollower = xpde.parser.Parser.or(xpde.parser.Parser.newSet(xpde.parser.Parser.castFollowerArr),xpde.parser.Parser.typeKW);
xpde.parser.Parser.prefix = xpde.parser.Parser.newSet(xpde.parser.Parser.prefixArr);
xpde.parser.Parser.set = [[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,true,true,true,true,false,true,false,false,false,false,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,true,true,true,false,true,false,false,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,false,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,false,true,false,false,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,false,true,false,true,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,false,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false]];
xpde.parser.Errors.errMsgFormat = "-- line {0} col {1}: {2}";
xpde.parser.FatalError.serialVersionUID = 1.0;
xpde.parser.ModifierSet.none = new xpde.parser.EnumSet([]);
xpde.parser.ModifierSet.access = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate]);
xpde.parser.ModifierSet.classes = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate,xpde.parser.Modifier.MAbstract,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MFinal,xpde.parser.Modifier.MStrictfp]);
xpde.parser.ModifierSet.fields = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MFinal,xpde.parser.Modifier.MTransient,xpde.parser.Modifier.MVolatile]);
xpde.parser.ModifierSet.methods = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate,xpde.parser.Modifier.MAbstract,xpde.parser.Modifier.MSynchronized,xpde.parser.Modifier.MNative,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MFinal,xpde.parser.Modifier.MStrictfp]);
xpde.parser.ModifierSet.constructors = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate]);
xpde.parser.ModifierSet.interfaces = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate,xpde.parser.Modifier.MAbstract,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MStrictfp]);
xpde.parser.ModifierSet.constants = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MFinal]);
xpde.parser.ModifierSet.all = new xpde.parser.EnumSet([xpde.parser.Modifier.MPublic,xpde.parser.Modifier.MProtected,xpde.parser.Modifier.MPrivate,xpde.parser.Modifier.MAbstract,xpde.parser.Modifier.MVolatile,xpde.parser.Modifier.MTransient,xpde.parser.Modifier.MSynchronized,xpde.parser.Modifier.MNative,xpde.parser.Modifier.MStatic,xpde.parser.Modifier.MFinal,xpde.parser.Modifier.MStrictfp]);
$Main.init = JSMain.main();
