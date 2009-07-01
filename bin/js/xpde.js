$estr = function() { return js.Boot.__string_rec(this,''); }
haxe = {}
haxe.io = {}
haxe.io.BytesBuffer = function(p) { if( p === $_ ) return; {
	$s.push("haxe.io.BytesBuffer::new");
	var $spos = $s.length;
	this.b = new Array();
	$s.pop();
}}
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype.add = function(src) {
	$s.push("haxe.io.BytesBuffer::add");
	var $spos = $s.length;
	var b1 = this.b;
	var b2 = src.b;
	{
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	$s.pop();
}
haxe.io.BytesBuffer.prototype.addByte = function($byte) {
	$s.push("haxe.io.BytesBuffer::addByte");
	var $spos = $s.length;
	this.b.push($byte);
	$s.pop();
}
haxe.io.BytesBuffer.prototype.addBytes = function(src,pos,len) {
	$s.push("haxe.io.BytesBuffer::addBytes");
	var $spos = $s.length;
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
	$s.pop();
}
haxe.io.BytesBuffer.prototype.b = null;
haxe.io.BytesBuffer.prototype.getBytes = function() {
	$s.push("haxe.io.BytesBuffer::getBytes");
	var $spos = $s.length;
	var bytes = new haxe.io.Bytes(this.b.length,this.b);
	this.b = null;
	{
		$s.pop();
		return bytes;
	}
	$s.pop();
}
haxe.io.BytesBuffer.prototype.__class__ = haxe.io.BytesBuffer;
haxe.io.Input = function() { }
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype.bigEndian = null;
haxe.io.Input.prototype.close = function() {
	$s.push("haxe.io.Input::close");
	var $spos = $s.length;
	null;
	$s.pop();
}
haxe.io.Input.prototype.read = function(nbytes) {
	$s.push("haxe.io.Input::read");
	var $spos = $s.length;
	var s = haxe.io.Bytes.alloc(nbytes);
	var p = 0;
	while(nbytes > 0) {
		var k = this.readBytes(s,p,nbytes);
		if(k == 0) throw haxe.io.Error.Blocked;
		p += k;
		nbytes -= k;
	}
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
haxe.io.Input.prototype.readAll = function(bufsize) {
	$s.push("haxe.io.Input::readAll");
	var $spos = $s.length;
	if(bufsize == null) bufsize = (16384);
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
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				null;
			}
		} else throw($e0);
	}
	{
		var $tmp = total.getBytes();
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readByte = function() {
	$s.push("haxe.io.Input::readByte");
	var $spos = $s.length;
	{
		var $tmp = function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readBytes = function(s,pos,len) {
	$s.push("haxe.io.Input::readBytes");
	var $spos = $s.length;
	var k = len;
	var b = s.b;
	if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
	while(k > 0) {
		b[pos] = this.readByte();
		pos++;
		k--;
	}
	{
		$s.pop();
		return len;
	}
	$s.pop();
}
haxe.io.Input.prototype.readDouble = function() {
	$s.push("haxe.io.Input::readDouble");
	var $spos = $s.length;
	throw "Not implemented";
	{
		$s.pop();
		return 0;
	}
	$s.pop();
}
haxe.io.Input.prototype.readFloat = function() {
	$s.push("haxe.io.Input::readFloat");
	var $spos = $s.length;
	throw "Not implemented";
	{
		$s.pop();
		return 0;
	}
	$s.pop();
}
haxe.io.Input.prototype.readFullBytes = function(s,pos,len) {
	$s.push("haxe.io.Input::readFullBytes");
	var $spos = $s.length;
	while(len > 0) {
		var k = this.readBytes(s,pos,len);
		pos += k;
		len -= k;
	}
	$s.pop();
}
haxe.io.Input.prototype.readInt16 = function() {
	$s.push("haxe.io.Input::readInt16");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var n = (this.bigEndian?ch2 | (ch1 << 8):ch1 | (ch2 << 8));
	if((n & 32768) != 0) {
		var $tmp = n - 65536;
		$s.pop();
		return $tmp;
	}
	{
		$s.pop();
		return n;
	}
	$s.pop();
}
haxe.io.Input.prototype.readInt24 = function() {
	$s.push("haxe.io.Input::readInt24");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var n = (this.bigEndian?(ch3 | (ch2 << 8)) | (ch1 << 16):(ch1 | (ch2 << 8)) | (ch3 << 16));
	if((n & 8388608) != 0) {
		var $tmp = n - 16777216;
		$s.pop();
		return $tmp;
	}
	{
		$s.pop();
		return n;
	}
	$s.pop();
}
haxe.io.Input.prototype.readInt31 = function() {
	$s.push("haxe.io.Input::readInt31");
	var $spos = $s.length;
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
	{
		var $tmp = ((ch1 | (ch2 << 8)) | (ch3 << 16)) | (ch4 << 24);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readInt32 = function() {
	$s.push("haxe.io.Input::readInt32");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var ch4 = this.readByte();
	{
		var $tmp = (this.bigEndian?(((ch1 << 8) | ch2) << 16) | ((ch3 << 8) | ch4):(((ch4 << 8) | ch3) << 16) | ((ch2 << 8) | ch1));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readInt8 = function() {
	$s.push("haxe.io.Input::readInt8");
	var $spos = $s.length;
	var n = this.readByte();
	if(n >= 128) {
		var $tmp = n - 256;
		$s.pop();
		return $tmp;
	}
	{
		$s.pop();
		return n;
	}
	$s.pop();
}
haxe.io.Input.prototype.readLine = function() {
	$s.push("haxe.io.Input::readLine");
	var $spos = $s.length;
	var buf = new StringBuf();
	var last;
	var s;
	try {
		while((last = this.readByte()) != 10) buf.b[buf.b.length] = String.fromCharCode(last);
		s = buf.b.join("");
		if(s.charCodeAt(s.length - 1) == 13) s = s.substr(0,-1);
	}
	catch( $e1 ) {
		if( js.Boot.__instanceof($e1,haxe.io.Eof) ) {
			var e = $e1;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				s = buf.b.join("");
				if(s.length == 0) throw (e);
			}
		} else throw($e1);
	}
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
haxe.io.Input.prototype.readString = function(len) {
	$s.push("haxe.io.Input::readString");
	var $spos = $s.length;
	var b = haxe.io.Bytes.alloc(len);
	this.readFullBytes(b,0,len);
	{
		var $tmp = b.toString();
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readUInt16 = function() {
	$s.push("haxe.io.Input::readUInt16");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	{
		var $tmp = (this.bigEndian?ch2 | (ch1 << 8):ch1 | (ch2 << 8));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readUInt24 = function() {
	$s.push("haxe.io.Input::readUInt24");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	{
		var $tmp = (this.bigEndian?(ch3 | (ch2 << 8)) | (ch1 << 16):(ch1 | (ch2 << 8)) | (ch3 << 16));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readUInt30 = function() {
	$s.push("haxe.io.Input::readUInt30");
	var $spos = $s.length;
	var ch1 = this.readByte();
	var ch2 = this.readByte();
	var ch3 = this.readByte();
	var ch4 = this.readByte();
	if(((this.bigEndian?ch1:ch4)) >= 64) throw haxe.io.Error.Overflow;
	{
		var $tmp = (this.bigEndian?((ch4 | (ch3 << 8)) | (ch2 << 16)) | (ch1 << 24):((ch1 | (ch2 << 8)) | (ch3 << 16)) | (ch4 << 24));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.readUntil = function(end) {
	$s.push("haxe.io.Input::readUntil");
	var $spos = $s.length;
	var buf = new StringBuf();
	var last;
	while((last = this.readByte()) != end) buf.b[buf.b.length] = String.fromCharCode(last);
	{
		var $tmp = buf.b.join("");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Input.prototype.setEndian = function(b) {
	$s.push("haxe.io.Input::setEndian");
	var $spos = $s.length;
	this.bigEndian = b;
	{
		$s.pop();
		return b;
	}
	$s.pop();
}
haxe.io.Input.prototype.__class__ = haxe.io.Input;
StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	$s.push("StringTools::urlEncode");
	var $spos = $s.length;
	{
		var $tmp = encodeURIComponent(s);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.urlDecode = function(s) {
	$s.push("StringTools::urlDecode");
	var $spos = $s.length;
	{
		var $tmp = decodeURIComponent(s.split("+").join(" "));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.htmlEscape = function(s) {
	$s.push("StringTools::htmlEscape");
	var $spos = $s.length;
	{
		var $tmp = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.htmlUnescape = function(s) {
	$s.push("StringTools::htmlUnescape");
	var $spos = $s.length;
	{
		var $tmp = s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.startsWith = function(s,start) {
	$s.push("StringTools::startsWith");
	var $spos = $s.length;
	{
		var $tmp = (s.length >= start.length && s.substr(0,start.length) == start);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.endsWith = function(s,end) {
	$s.push("StringTools::endsWith");
	var $spos = $s.length;
	var elen = end.length;
	var slen = s.length;
	{
		var $tmp = (slen >= elen && s.substr(slen - elen,elen) == end);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.isSpace = function(s,pos) {
	$s.push("StringTools::isSpace");
	var $spos = $s.length;
	var c = s.charCodeAt(pos);
	{
		var $tmp = (c >= 9 && c <= 13) || c == 32;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.ltrim = function(s) {
	$s.push("StringTools::ltrim");
	var $spos = $s.length;
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) {
		r++;
	}
	if(r > 0) {
		var $tmp = s.substr(r,l - r);
		$s.pop();
		return $tmp;
	}
	else {
		$s.pop();
		return s;
	}
	$s.pop();
}
StringTools.rtrim = function(s) {
	$s.push("StringTools::rtrim");
	var $spos = $s.length;
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) {
		r++;
	}
	if(r > 0) {
		{
			var $tmp = s.substr(0,l - r);
			$s.pop();
			return $tmp;
		}
	}
	else {
		{
			$s.pop();
			return s;
		}
	}
	$s.pop();
}
StringTools.trim = function(s) {
	$s.push("StringTools::trim");
	var $spos = $s.length;
	{
		var $tmp = StringTools.ltrim(StringTools.rtrim(s));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.rpad = function(s,c,l) {
	$s.push("StringTools::rpad");
	var $spos = $s.length;
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
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
StringTools.lpad = function(s,c,l) {
	$s.push("StringTools::lpad");
	var $spos = $s.length;
	var ns = "";
	var sl = s.length;
	if(sl >= l) {
		$s.pop();
		return s;
	}
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
	{
		var $tmp = ns + s;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.replace = function(s,sub,by) {
	$s.push("StringTools::replace");
	var $spos = $s.length;
	{
		var $tmp = s.split(sub).join(by);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringTools.hex = function(n,digits) {
	$s.push("StringTools::hex");
	var $spos = $s.length;
	var neg = false;
	if(n < 0) {
		neg = true;
		n = -n;
	}
	var s = n.toString(16);
	s = s.toUpperCase();
	if(digits != null) while(s.length < digits) s = "0" + s;
	if(neg) s = "-" + s;
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
StringTools.prototype.__class__ = StringTools;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	$s.push("Reflect::hasField");
	var $spos = $s.length;
	if(o.hasOwnProperty != null) {
		var $tmp = o.hasOwnProperty(field);
		$s.pop();
		return $tmp;
	}
	var arr = Reflect.fields(o);
	{ var $it2 = arr.iterator();
	while( $it2.hasNext() ) { var t = $it2.next();
	if(t == field) {
		$s.pop();
		return true;
	}
	}}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
Reflect.field = function(o,field) {
	$s.push("Reflect::field");
	var $spos = $s.length;
	var v = null;
	try {
		v = o[field];
	}
	catch( $e3 ) {
		{
			var e = $e3;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				null;
			}
		}
	}
	{
		$s.pop();
		return v;
	}
	$s.pop();
}
Reflect.setField = function(o,field,value) {
	$s.push("Reflect::setField");
	var $spos = $s.length;
	o[field] = value;
	$s.pop();
}
Reflect.callMethod = function(o,func,args) {
	$s.push("Reflect::callMethod");
	var $spos = $s.length;
	{
		var $tmp = func.apply(o,args);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.fields = function(o) {
	$s.push("Reflect::fields");
	var $spos = $s.length;
	if(o == null) {
		var $tmp = new Array();
		$s.pop();
		return $tmp;
	}
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
					$e = [];
					while($s.length >= $spos) $e.unshift($s.pop());
					$s.push($e[0]);
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
	{
		$s.pop();
		return a;
	}
	$s.pop();
}
Reflect.isFunction = function(f) {
	$s.push("Reflect::isFunction");
	var $spos = $s.length;
	{
		var $tmp = typeof(f) == "function" && f.__name__ == null;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.compare = function(a,b) {
	$s.push("Reflect::compare");
	var $spos = $s.length;
	{
		var $tmp = ((a == b)?0:((((a) > (b))?1:-1)));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.compareMethods = function(f1,f2) {
	$s.push("Reflect::compareMethods");
	var $spos = $s.length;
	if(f1 == f2) {
		$s.pop();
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		$s.pop();
		return false;
	}
	{
		var $tmp = f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.isObject = function(v) {
	$s.push("Reflect::isObject");
	var $spos = $s.length;
	if(v == null) {
		$s.pop();
		return false;
	}
	var t = typeof(v);
	{
		var $tmp = (t == "string" || (t == "object" && !v.__enum__) || (t == "function" && v.__name__ != null));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.deleteField = function(o,f) {
	$s.push("Reflect::deleteField");
	var $spos = $s.length;
	if(!Reflect.hasField(o,f)) {
		$s.pop();
		return false;
	}
	delete(o[f]);
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
Reflect.copy = function(o) {
	$s.push("Reflect::copy");
	var $spos = $s.length;
	var o2 = { }
	{
		var _g = 0, _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
	}
	{
		$s.pop();
		return o2;
	}
	$s.pop();
}
Reflect.makeVarArgs = function(f) {
	$s.push("Reflect::makeVarArgs");
	var $spos = $s.length;
	{
		var $tmp = function() {
			$s.push("Reflect::makeVarArgs@345");
			var $spos = $s.length;
			var a = new Array();
			{
				var _g1 = 0, _g = arguments.length;
				while(_g1 < _g) {
					var i = _g1++;
					a.push(arguments[i]);
				}
			}
			{
				var $tmp = f(a);
				$s.pop();
				return $tmp;
			}
			$s.pop();
		}
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Reflect.prototype.__class__ = Reflect;
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	$s.push("haxe.Log::trace");
	var $spos = $s.length;
	js.Boot.__trace(v,infos);
	$s.pop();
}
haxe.Log.clear = function() {
	$s.push("haxe.Log::clear");
	var $spos = $s.length;
	js.Boot.__clear_trace();
	$s.pop();
}
haxe.Log.prototype.__class__ = haxe.Log;
JSMain = function() { }
JSMain.__name__ = ["JSMain"];
JSMain.main = function() {
	$s.push("JSMain::main");
	var $spos = $s.length;
	null;
	$s.pop();
}
JSMain.getSource = function() {
	$s.push("JSMain::getSource");
	var $spos = $s.length;
	{
		var $tmp = js.Lib.document.getElementById("script").value;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
JSMain.compile = function() {
	$s.push("JSMain::compile");
	var $spos = $s.length;
	null;
	$s.pop();
}
JSMain.interpret = function() {
	$s.push("JSMain::interpret");
	var $spos = $s.length;
	var rootPackage = new xpde.parser.JavaPackage();
	haxe.Log.trace(xpde.core.js.PApplet.__rtti,{ fileName : "JSMain.hx", lineNumber : 45, className : "JSMain", methodName : "interpret"});
	$s.pop();
}
JSMain.prototype.__class__ = JSMain;
StringBuf = function(p) { if( p === $_ ) return; {
	$s.push("StringBuf::new");
	var $spos = $s.length;
	this.b = new Array();
	$s.pop();
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	$s.push("StringBuf::add");
	var $spos = $s.length;
	this.b[this.b.length] = x;
	$s.pop();
}
StringBuf.prototype.addChar = function(c) {
	$s.push("StringBuf::addChar");
	var $spos = $s.length;
	this.b[this.b.length] = String.fromCharCode(c);
	$s.pop();
}
StringBuf.prototype.addSub = function(s,pos,len) {
	$s.push("StringBuf::addSub");
	var $spos = $s.length;
	this.b[this.b.length] = s.substr(pos,len);
	$s.pop();
}
StringBuf.prototype.b = null;
StringBuf.prototype.toString = function() {
	$s.push("StringBuf::toString");
	var $spos = $s.length;
	{
		var $tmp = this.b.join("");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
StringBuf.prototype.__class__ = StringBuf;
haxe.Int32 = function() { }
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	$s.push("haxe.Int32::make");
	var $spos = $s.length;
	{
		var $tmp = (a << 16) | b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.ofInt = function(x) {
	$s.push("haxe.Int32::ofInt");
	var $spos = $s.length;
	{
		$s.pop();
		return x;
	}
	$s.pop();
}
haxe.Int32.toInt = function(x) {
	$s.push("haxe.Int32::toInt");
	var $spos = $s.length;
	if((((x) >> 30) & 1) != ((x) >>> 31)) throw "Overflow " + x;
	{
		var $tmp = (x) & -1;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.toNativeInt = function(x) {
	$s.push("haxe.Int32::toNativeInt");
	var $spos = $s.length;
	{
		$s.pop();
		return x;
	}
	$s.pop();
}
haxe.Int32.add = function(a,b) {
	$s.push("haxe.Int32::add");
	var $spos = $s.length;
	{
		var $tmp = (a) + (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.sub = function(a,b) {
	$s.push("haxe.Int32::sub");
	var $spos = $s.length;
	{
		var $tmp = (a) - (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.mul = function(a,b) {
	$s.push("haxe.Int32::mul");
	var $spos = $s.length;
	{
		var $tmp = (a) * (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.div = function(a,b) {
	$s.push("haxe.Int32::div");
	var $spos = $s.length;
	{
		var $tmp = Std["int"]((a) / (b));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.mod = function(a,b) {
	$s.push("haxe.Int32::mod");
	var $spos = $s.length;
	{
		var $tmp = (a) % (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.shl = function(a,b) {
	$s.push("haxe.Int32::shl");
	var $spos = $s.length;
	{
		var $tmp = (a) << b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.shr = function(a,b) {
	$s.push("haxe.Int32::shr");
	var $spos = $s.length;
	{
		var $tmp = (a) >> b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.ushr = function(a,b) {
	$s.push("haxe.Int32::ushr");
	var $spos = $s.length;
	{
		var $tmp = (a) >>> b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.and = function(a,b) {
	$s.push("haxe.Int32::and");
	var $spos = $s.length;
	{
		var $tmp = (a) & (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.or = function(a,b) {
	$s.push("haxe.Int32::or");
	var $spos = $s.length;
	{
		var $tmp = (a) | (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.xor = function(a,b) {
	$s.push("haxe.Int32::xor");
	var $spos = $s.length;
	{
		var $tmp = (a) ^ (b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.neg = function(a) {
	$s.push("haxe.Int32::neg");
	var $spos = $s.length;
	{
		var $tmp = -(a);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.complement = function(a) {
	$s.push("haxe.Int32::complement");
	var $spos = $s.length;
	{
		var $tmp = ~(a);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.compare = function(a,b) {
	$s.push("haxe.Int32::compare");
	var $spos = $s.length;
	{
		var $tmp = a - b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.Int32.prototype.__class__ = haxe.Int32;
haxe.rtti = {}
haxe.rtti.Infos = function() { }
haxe.rtti.Infos.__name__ = ["haxe","rtti","Infos"];
haxe.rtti.Infos.prototype.__class__ = haxe.rtti.Infos;
haxe.io.BytesInput = function(b,pos,len) { if( b === $_ ) return; {
	$s.push("haxe.io.BytesInput::new");
	var $spos = $s.length;
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	$s.pop();
}}
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
for(var k in haxe.io.Input.prototype ) haxe.io.BytesInput.prototype[k] = haxe.io.Input.prototype[k];
haxe.io.BytesInput.prototype.b = null;
haxe.io.BytesInput.prototype.len = null;
haxe.io.BytesInput.prototype.pos = null;
haxe.io.BytesInput.prototype.readByte = function() {
	$s.push("haxe.io.BytesInput::readByte");
	var $spos = $s.length;
	if(this.len == 0) throw new haxe.io.Eof();
	this.len--;
	{
		var $tmp = this.b[this.pos++];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.BytesInput.prototype.readBytes = function(buf,pos,len) {
	$s.push("haxe.io.BytesInput::readBytes");
	var $spos = $s.length;
	if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
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
	{
		$s.pop();
		return len;
	}
	$s.pop();
}
haxe.io.BytesInput.prototype.__class__ = haxe.io.BytesInput;
haxe.io.StringInput = function(s) { if( s === $_ ) return; {
	$s.push("haxe.io.StringInput::new");
	var $spos = $s.length;
	haxe.io.BytesInput.apply(this,[haxe.io.Bytes.ofString(s)]);
	$s.pop();
}}
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
for(var k in haxe.io.BytesInput.prototype ) haxe.io.StringInput.prototype[k] = haxe.io.BytesInput.prototype[k];
haxe.io.StringInput.prototype.__class__ = haxe.io.StringInput;
haxe.io.Bytes = function(length,b) { if( length === $_ ) return; {
	$s.push("haxe.io.Bytes::new");
	var $spos = $s.length;
	this.length = length;
	this.b = b;
	$s.pop();
}}
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	$s.push("haxe.io.Bytes::alloc");
	var $spos = $s.length;
	var a = new Array();
	{
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			a.push(0);
		}
	}
	{
		var $tmp = new haxe.io.Bytes(length,a);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.ofString = function(s) {
	$s.push("haxe.io.Bytes::ofString");
	var $spos = $s.length;
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
	{
		var $tmp = new haxe.io.Bytes(a.length,a);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.ofData = function(b) {
	$s.push("haxe.io.Bytes::ofData");
	var $spos = $s.length;
	{
		var $tmp = new haxe.io.Bytes(b.length,b);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.blit = function(pos,src,srcpos,len) {
	$s.push("haxe.io.Bytes::blit");
	var $spos = $s.length;
	if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	if(b1 == b2 && pos > srcpos) {
		var i = len;
		while(i > 0) {
			i--;
			b1[i + pos] = b2[i + srcpos];
		}
		{
			$s.pop();
			return;
		}
	}
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	$s.pop();
}
haxe.io.Bytes.prototype.compare = function(other) {
	$s.push("haxe.io.Bytes::compare");
	var $spos = $s.length;
	var b1 = this.b;
	var b2 = other.b;
	var len = ((this.length < other.length)?this.length:other.length);
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) {
				var $tmp = b1[i] - b2[i];
				$s.pop();
				return $tmp;
			}
		}
	}
	{
		var $tmp = this.length - other.length;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.get = function(pos) {
	$s.push("haxe.io.Bytes::get");
	var $spos = $s.length;
	{
		var $tmp = this.b[pos];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.getData = function() {
	$s.push("haxe.io.Bytes::getData");
	var $spos = $s.length;
	{
		var $tmp = this.b;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.length = null;
haxe.io.Bytes.prototype.readString = function(pos,len) {
	$s.push("haxe.io.Bytes::readString");
	var $spos = $s.length;
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
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.set = function(pos,v) {
	$s.push("haxe.io.Bytes::set");
	var $spos = $s.length;
	this.b[pos] = v;
	$s.pop();
}
haxe.io.Bytes.prototype.sub = function(pos,len) {
	$s.push("haxe.io.Bytes::sub");
	var $spos = $s.length;
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	{
		var $tmp = new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.toString = function() {
	$s.push("haxe.io.Bytes::toString");
	var $spos = $s.length;
	{
		var $tmp = this.readString(0,this.length);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
haxe.io.Bytes.prototype.__class__ = haxe.io.Bytes;
IntIter = function(min,max) { if( min === $_ ) return; {
	$s.push("IntIter::new");
	var $spos = $s.length;
	this.min = min;
	this.max = max;
	$s.pop();
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.hasNext = function() {
	$s.push("IntIter::hasNext");
	var $spos = $s.length;
	{
		var $tmp = this.min < this.max;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.next = function() {
	$s.push("IntIter::next");
	var $spos = $s.length;
	{
		var $tmp = this.min++;
		$s.pop();
		return $tmp;
	}
	$s.pop();
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
	$s.push("Std::is");
	var $spos = $s.length;
	{
		var $tmp = js.Boot.__instanceof(v,t);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Std.string = function(s) {
	$s.push("Std::string");
	var $spos = $s.length;
	{
		var $tmp = js.Boot.__string_rec(s,"");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Std["int"] = function(x) {
	$s.push("Std::int");
	var $spos = $s.length;
	if(x < 0) {
		var $tmp = Math.ceil(x);
		$s.pop();
		return $tmp;
	}
	{
		var $tmp = Math.floor(x);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Std.parseInt = function(x) {
	$s.push("Std::parseInt");
	var $spos = $s.length;
	var v = parseInt(x);
	if(Math.isNaN(v)) {
		$s.pop();
		return null;
	}
	{
		$s.pop();
		return v;
	}
	$s.pop();
}
Std.parseFloat = function(x) {
	$s.push("Std::parseFloat");
	var $spos = $s.length;
	{
		var $tmp = parseFloat(x);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Std.random = function(x) {
	$s.push("Std::random");
	var $spos = $s.length;
	{
		var $tmp = Math.floor(Math.random() * x);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Std.prototype.__class__ = Std;
xpde = {}
xpde.core = {}
xpde.core.js = {}
xpde.core.js.PApplet = function(curElement) { if( curElement === $_ ) return; {
	$s.push("xpde.core.js.PApplet::new");
	var $spos = $s.length;
	
  if ( typeof curElement == "string" )
    curElement = document.getElementById(curElement);

  var p = this;
  
  // Eval imported libraries  
  //for( var i = 0; var len = libs
  
  // init
  p.PI = Math.PI;
  p.TWO_PI = 2 * p.PI;
  p.HALF_PI = p.PI / 2;
  p.P3D = 3;
  p.CORNER = 0;
  p.RADIUS = 1;
  p.CENTER_RADIUS = 1;
  p.CENTER = 2;
  p.POLYGON = 2;
  p.QUADS = 5;
  p.TRIANGLES = 6;
  p.POINTS = 7;
  p.LINES = 8;
  p.TRIANGLE_STRIP = 9;
  p.TRIANGLE_FAN = 4;
  p.QUAD_STRIP = 3;
  p.CORNERS = 10;
  p.CLOSE = true;
  p.RGB = 1;
  p.HSB = 2;  

  // mouseButton constants: values adjusted to come directly from e.which
  // CONFLICT: LEFT and RIGHT are keyboard values in Processing already. - F1lT3R         
  // RESOLUTION: Extended Keyboard & Mouse variables  
  p.CENTER = 88888880;
  p.CODED  = 88888888;
  p.UP      = 88888870;
  p.RIGHT   = 88888871;
  p.DOWN    = 88888872;
  p.LEFT    = 88888869;
  p.codedKeys = [69, 70, 71, 72];

  // "Private" variables used to maintain state
  var curContext = curElement.getContext("2d");
  var doFill = true;
  var doStroke = true;
  var loopStarted = false;
  var hasBackground = false;
  var doLoop = true;
  var looping = 0;
  var curRectMode = p.CORNER;
  var curEllipseMode = p.CENTER;
  var inSetup = false;
  var inDraw = false;
  var curBackground = "rgba(204,204,204,1)";
  var curFrameRate = 1000;
  var curShape = p.POLYGON;
  var curShapeCount = 0;
  var curvePoints = [];
  var curTightness = 0;
  var opacityRange = 255;
  var redRange = 255;
  var greenRange = 255;
  var blueRange = 255;
  var pathOpen = false;
  var mousePressed = false;
  var keyPressed = false;
  var firstX, firstY, secondX, secondY, prevX, prevY;
  var curColorMode = p.RGB;
  var curTint = -1;
  var curTextSize = 12;
  var curTextFont = "Arial";
  var getLoaded = false;
  var start = (new Date).getTime();
  
  // println(), print()
  p.ln = "";
  
  // Glyph path storage for quick rendering  
  p.glyphTable = {};
  
  // Global vars for tracking mouse position
  p.pmouseX = 0;
  p.pmouseY = 0;
  p.mouseX = 0;
  p.mouseY = 0;
  p.mouseButton = 0;
  p.mouseDown = false;

  // Will be replaced by the user, most likely
/*  p.mouseClicked = undefined;
  p.mouseDragged = undefined;
  p.mouseMoved = undefined;
  p.mousePressed = undefined;
  p.mouseReleased = undefined;
  p.keyPressed = undefined;
  p.keyReleased = undefined;
  p.draw = undefined;
  p.setup = undefined;*/

  // The height/width of the canvas
  p.width = curElement.width - 0;
  p.height = curElement.height - 0;

  // The current animation frame
  p.frameCount = 0;
  
  // Forced default color mode for #aaaaaa style
  p.DefaultColor = function ( aValue1, aValue2, aValue3) {
    var tmpColorMode = curColorMode;
    curColorMode = p.RGB;
    var c = p.color( ((aValue1 / 255) * redRange), ((aValue2 / 255) * greenRange), ((aValue3 / 255) * blueRange));
    curColorMode = tmpColorMode;
    return c;
  }      
    
  p.ajax=function(url){
    if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
    else{AJAX=new ActiveXObject("Microsoft.XMLHTTP");}
    if(AJAX){
       AJAX.open("GET",url,false);
       AJAX.send(null);
       return AJAX.responseText;
    }else{return false;}
  }
  
  p.Import=function Import(lib){
    eval(p.ajax(lib));
  }
  
  // Load a file or URL into strings     
  p.loadStrings = function loadStrings(url) {
    return p.ajax(url).split("\n");              
  };
  
  // In case I ever need to do HSV conversion:
  // http://srufaculty.sru.edu/david.dailey/javascript/js/5rml.js
  p.color = function color( aValue1, aValue2, aValue3, aValue4 ) {
    var aColor = "";
    
    if ( arguments.length == 3 ) {
      aColor = p.color( aValue1, aValue2, aValue3, opacityRange );
    } else if ( arguments.length == 4 ) {
      var a = aValue4 / opacityRange;
      a = isNaN(a) ? 1 : a;

      if ( curColorMode == p.HSB ) {
        var rgb = HSBtoRGB(aValue1, aValue2, aValue3);
        var r = rgb[0], g = rgb[1], b = rgb[2];
      } else {
        var r = getColor(aValue1, redRange);
        var g = getColor(aValue2, greenRange);
        var b = getColor(aValue3, blueRange);
      }

      aColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else if ( typeof aValue1 == "string" ) {
      aColor = aValue1;

      if ( arguments.length == 2 ) {
        var c = aColor.split(",");
        c[3] = (aValue2 / opacityRange) + ")";
        aColor = c.join(",");
      }
    } else if ( arguments.length == 2 ) {
      aColor = p.color( aValue1, aValue1, aValue1, aValue2 );
    } else if ( typeof aValue1 == "number" ) {
      aColor = p.color( aValue1, aValue1, aValue1, opacityRange );
    } else {
      aColor = p.color( redRange, greenRange, blueRange, opacityRange );
    }

    // HSB conversion function from Mootools, MIT Licensed
    function HSBtoRGB(h, s, b) {
      h = (h / redRange) * 360;
      s = (s / greenRange) * 100;
      b = (b / blueRange) * 100;
      var br = Math.round(b / 100 * 255);
      if (s == 0){
        return [br, br, br];
      } else {
        var hue = h % 360;
        var f = hue % 60;
        var p = Math.round((b * (100 - s)) / 10000 * 255);
        var q = Math.round((b * (6000 - s * f)) / 600000 * 255);
        var t = Math.round((b * (6000 - s * (60 - f))) / 600000 * 255);
        switch (Math.floor(hue / 60)){
          case 0: return [br, t, p];
          case 1: return [q, br, p];
          case 2: return [p, br, t];
          case 3: return [p, q, br];
          case 4: return [t, p, br];
          case 5: return [br, p, q];
        }
      }
    }

    function getColor( aValue, range ) {
      return Math.round(255 * (aValue / range));
    }
    
    return aColor;
  }
  
  p.red = function( aColor ) {        
    return parseInt( verifyChannel(aColor).slice(5) );
  };

  p.green = function( aColor ) {     
    return parseInt( verifyChannel(aColor).split(",")[1] );
  };

  p.blue = function( aColor ) {
    return parseInt( verifyChannel(aColor).split(",")[2] );
  };

  p.alpha = function( aColor ) {    
    return parseInt( parseFloat(verifyChannel(aColor).split(",")[3])*255 );
  };

  function verifyChannel(aColor){
    if(aColor.constructor == Array){    
      return aColor;
    } else {
      return p.color(aColor);
    }
  }

  
  // Added lerpColor() - F1LT3R - 08.11.14
  p.lerpColor = function lerpColor( c1, c2, amt ){
      
      // Get RGBA values for Color 1 to floats
      var colors1 = p.color(c1).split(",");
      var r1 = parseInt( colors1[0].split("(")[1] ); 
      var g1 = parseInt( colors1[1] );
      var b1 = parseInt( colors1[2] );
      var a1 = parseFloat( colors1[3].split(")")[0] );
          
      // Get RGBA values for Color 2 to floats
      var colors2 = p.color(c2).split(",");
      var r2 = parseInt( colors2[0].split("(")[1] ); 
      var g2 = parseInt( colors2[1] );
      var b2 = parseInt( colors2[2] );
      var a2 = parseFloat( colors2[3].split(")")[0] );            
                        
      // Return lerp value for each channel, INT for color, Float for Alpha-range
      var r = parseInt( p.lerp(r1, r2, amt) );
      var g = parseInt( p.lerp(g1, g2, amt) );
      var b = parseInt( p.lerp(b1, b2, amt) );
      var a = parseFloat( p.lerp(a1, a2, amt) );
      
      aColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      return aColor;
  }
  
  p.nf = function( num, pad ) {
    var str = "" + num;
    while ( pad - str.length )
      str = "0" + str;
    return str;
  };

  p.AniSprite = function( prefix, frames ) {    
    this.images = [];
    this.pos = 0;

    for ( var i = 0; i < frames; i++ ) {
      this.images.push( prefix + p.nf( i, ("" + frames).length ) + ".gif" );
    }

    this.display = function( x, y ) {
      p.image( this.images[ this.pos ], x, y );

      if ( ++this.pos >= frames )
        this.pos = 0;
    };

    this.getWidth = function() {
      return getImage(this.images[0]).width;
    };

    this.getHeight = function() {
      return getImage(this.images[0]).height;
    };
  };

  function buildImageObject( obj ) {
    var pixels = obj.data;
    var data = p.createImage( obj.width, obj.height );

    if ( data.__defineGetter__ && data.__lookupGetter__ && !data.__lookupGetter__("pixels") ) {
      var pixelsDone;
      data.__defineGetter__("pixels", function() {
        if ( pixelsDone )
          return pixelsDone;

        pixelsDone = [];

        for ( var i = 0; i < pixels.length; i += 4 ) {
          pixelsDone.push( p.color(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]) );
        }

        return pixelsDone;
      });
    } else {
      data.pixels = [];

      for ( var i = 0; i < pixels.length; i += 4 ) {
        data.pixels.push( p.color(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]) );
      }
    }

    return data;
  }

  p.createImage = function createImage( w, h, mode ) {
    var data = {};
    data.width = w;
    data.height = h;
    data.data = [];

    if ( curContext.createImageData ) {
      data = curContext.createImageData( w, h );
    }

    data.pixels = new Array( w * h );
    data.get = function(x,y) {
      return this.pixels[w*y+x];
    };
    data._mask = null;
    data.mask = function(img) {
      this._mask = img;
    };
    data.loadPixels = function(){};
    data.updatePixels = function(){};

    return data;
  };

  p.createGraphics = function createGraphics( w, h ) {
    var canvas = document.createElement("canvas");
    var ret = buildProcessing( canvas );
    ret.size( w, h );
    ret.canvas = canvas;
    return ret;
  };

  p.beginDraw = function beginDraw(){};

  p.endDraw = function endDraw(){};

  p.tint = function tint( rgb, a ) {
    curTint = a;
  };

  function getImage( img ) {
    if ( typeof img == "string" ) {
      return document.getElementById(img);
    }

    if ( img.img || img.canvas ) {
      return img.img || img.canvas;
    }

    for ( var i = 0, l = img.pixels.length; i < l; i++ ) {
      var pos = i * 4;
      var c = (img.pixels[i] || "rgba(0,0,0,1)").slice(5,-1).split(",");
      img.data[pos] = parseInt(c[0]);
      img.data[pos+1] = parseInt(c[1]);
      img.data[pos+2] = parseInt(c[2]);
      img.data[pos+3] = parseFloat(c[3]) * 100;
    }

    var canvas = document.createElement("canvas")
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.putImageData( img, 0, 0 );

    img.canvas = canvas;

    return canvas;
  }

  p.image = function image( img, x, y, w, h ) {
    x = x || 0;
    y = y || 0;

    var obj = getImage(img);

    if ( curTint >= 0 ) {
      var oldAlpha = curContext.globalAlpha;
      curContext.globalAlpha = curTint / opacityRange;
    }

    if ( arguments.length == 3 ) {
      curContext.drawImage( obj, x, y );
    } else {
      curContext.drawImage( obj, x, y, w, h );
    }

    if ( curTint >= 0 ) {
      curContext.globalAlpha = oldAlpha;
    }

    if ( img._mask ) {
      var oldComposite = curContext.globalCompositeOperation;
      curContext.globalCompositeOperation = "darker";
      p.image( img._mask, x, y );
      curContext.globalCompositeOperation = oldComposite;
    }
  };

  p.exit = function exit() {
    clearInterval(looping);
  };

  p.save = function save( file ){};

  p.loadImage = function loadImage( file ) {
    var img = document.getElementById(file);
    if ( !img )
      return;

    var h = img.height, w = img.width;

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext("2d");

    context.drawImage( img, 0, 0 );
    var data = buildImageObject( context.getImageData( 0, 0, w, h ) );
    data.img = img;
    return data;
  };

  p.loadFont = function loadFont( name ) {
    if(name.indexOf(".svg")==-1){
      return {
        name: name,
        width: function( str ) {
          if ( curContext.mozMeasureText )
            return curContext.mozMeasureText( typeof str == "number" ?
              String.fromCharCode( str ) :
              str) / curTextSize;
          else
            return 0;
        }
      };
    }else{// If the font is a glyph, calculate by SVG table 
      var font=p.loadGlyphs(name);
      return {
      name: name,
      glyph: true,
      units_per_em: font.units_per_em,
      horiz_adv_x: 1/font.units_per_em*font.horiz_adv_x,
      ascent: font.ascent,
      descent: font.descent,
      width: function( str ) {
        var width=0;
        var len = str.length;
        for(var i=0;i < len;i++){                          
          try{width+=parseFloat(p.glyphLook(p.glyphTable[name],str[i]).horiz_adv_x);}
          catch(e){;}
        }
        return width/p.glyphTable[name].units_per_em;
        }
      }
    }
  };

  p.textFont = function textFont( name, size ) {
    curTextFont = name;
    p.textSize( size );
  };

  p.textSize = function textSize( size ) {
    if ( size ) {
      curTextSize = size;
    }
  };

  p.textAlign = function textAlign(){};

  p.glyphLook = function glyphLook(font,chr){
    try{
      switch(chr){
        case "1":return font["one"];break;
        case "2":return font["two"];break;
        case "3":return font["three"];break;
        case "4":return font["four"];break;
        case "5":return font["five"];break;
        case "6":return font["six"];break;
        case "7":return font["seven"];break;
        case "8":return font["eight"];break;
        case "9":return font["nine"];break;
        case "0":return font["zero"];break;
        case " ":return font["space"];break;
        case "$":return font["dollar"];break;
        case "!":return font["exclam"];break;
        case '"':return font["quotedbl"];break;
        case "#":return font["numbersign"];break;
        case "%":return font["percent"];break;
        case "&":return font["ampersand"];break;
        case "'":return font["quotesingle"];break;
        case "(":return font["parenleft"];break;
        case ")":return font["parenright"];break;
        case "*":return font["asterisk"];break;
        case "+":return font["plus"];break;
        case ",":return font["comma"];break;
        case "-":return font["hyphen"];break;
        case ".":return font["period"];break;
        case "/":return font["slash"];break;
        case "_":return font["underscore"];break;
        case ":":return font["colon"];break;
        case ";":return font["semicolon"];break;
        case "<":return font["less"];break;
        case "=":return font["equal"];break;
        case ">":return font["greater"];break;
        case "?":return font["question"];break;
        case "@":return font["at"];break;
        case "[":return font["bracketleft"];break;
        case "\\":return font["backslash"];break;
        case "]":return font["bracketright"];break;
        case "^":return font["asciicircum"];break;
        case "`":return font["grave"];break;
        case "{":return font["braceleft"];break;
        case "|":return font["bar"];break;
        case "}":return font["braceright"];break;
        case "~":return font["asciitilde"];break;
        default:return font[chr]; break;
      }
    }catch(e){;}
  }
  
  p.text = function text( str, x, y ) {
    if(!curTextFont.glyph){
      if ( str && curContext.mozDrawText ) {
        curContext.save();
        curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;
        curContext.translate(x, y);
        curContext.mozDrawText( typeof str == "number" ?
          String.fromCharCode( str ) :
          str );
        curContext.restore();
      }
    }else{
      var font=p.glyphTable[curTextFont.name];
        curContext.save();
        curContext.translate(x,y+curTextSize);
        var upem = font["units_per_em"];
        var newScale=1/upem*curTextSize;
        curContext.scale(newScale,newScale);
        var len = str.length;
        for(var i=0;i < len;i++){
          try{p.glyphLook(font,str[i]).draw();}
          catch(e){;}
        }
      curContext.restore();
    }
  };
  
  
  // Load Batik SVG Fonts and parse to pre-def objects for quick rendering - F1LT3R 
  p.loadGlyphs=function loadGlyph(url){
      // SJAX SVG as XML D.O.
      var loadXML=function loadXML(){
        try{var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");}
        catch(e){try{xmlDoc=document.implementation.createDocument("","",null);}
        catch(e){p.println(e.message);return;}}
          try{// Firefox, Mozilla, Opera, etc.
            xmlDoc.async=false;
            xmlDoc.load(url);
            parse(xmlDoc.getElementsByTagName("svg")[0]);
            }
          catch(e){try{// Google Chrome, Safari etc.
             try{console.log(e)}catch(e){alert(e);}
             var xmlhttp = new window.XMLHttpRequest();
             xmlhttp.open("GET",url,false);
             xmlhttp.send(null);
             parse(xmlhttp.responseXML.documentElement);
            }catch(e){}
          }
      }
      
      // Return arrays of SVG commands and coords
      var regex=function regex(needle,hay){
        var regexp=new RegExp(needle,"g");
        var i=0;
        var results=[];
        while(results[i]=regexp.exec(hay)){i++;}
        return results;
      }        
      
      // Parse SVG font-file
      var parse=function parse(svg){
        
        // Store font attributes
        var font=svg.getElementsByTagName("font");
        p.glyphTable[url]["horiz_adv_x"]=font[0].getAttribute("horiz-adv-x");      
        var font_face=svg.getElementsByTagName("font-face")[0];                  
        p.glyphTable[url]["units_per_em"]=parseFloat(font_face.getAttribute("units-per-em"));
        p.glyphTable[url]["ascent"]=parseFloat(font_face.getAttribute("ascent"));
        p.glyphTable[url]["descent"]=parseFloat(font_face.getAttribute("descent"));          
        
        var getXY = "[0-9\-]+";
        var glyph = svg.getElementsByTagName("glyph");
        
        // Loop through each glyph in the SVG
        var len = glyph.length;
        for(var i=0;i < len;i++){
          
          // Store attributes for this glyph
          var unicode = glyph[i].getAttribute("unicode");
          var name = glyph[i].getAttribute("glyph-name");
          var horiz_adv_x = glyph[i].getAttribute("horiz-adv-x");
          if(horiz_adv_x==null){var horiz_adv_x=p.glyphTable[url]["horiz_adv_x"];}
          
          var buildPath = function buildPath(d){ 
            var c = regex("[A-Za-z][0-9\- ]+|Z",d);                                                    
            // Begin storing path object 
            var path="var path={draw:function(){curContext.beginPath();";//curContext.beginPath();
            // Loop through SVG commands translating to canvas eqivs functions in path object
            var x=0,y=0,cx=0,cy=0,nx=0,ny=0,d=0,a=0,lastCom="";
            var lenC = c.length-1;
            for(var j=0;j < lenC;j++){
              var com=c[j][0];
              var xy=regex(getXY,com);
              switch(com[0]){            
                case "M"://curContext.moveTo(x,-y);
                  x=parseFloat( xy[0][0] );
                  y=parseFloat( xy[1][0] );              
                  path+="curContext.moveTo("+(x)+","+(-y)+");";
                  break;
                case "L"://curContext.lineTo(x,-y);
                  x=parseFloat( xy[0][0] );
                  y=parseFloat( xy[1][0] );
                  path+="curContext.lineTo("+(x)+","+(-y)+");";
                  break;
                case "H"://curContext.lineTo(x,-y)
                  x=parseFloat( xy[0][0] );
                  path+="curContext.lineTo("+(x)+","+(-y)+");";
                  break;
                case "V"://curContext.lineTo(x,-y);
                  y=parseFloat( xy[0][0] );              
                  path+="curContext.lineTo("+(x)+","+(-y)+");";
                  break;
                case "T"://curContext.quadraticCurveTo(cx,-cy,nx,-ny);
                  nx=parseFloat( xy[0][0] );
                  ny=parseFloat( xy[1][0] );
                  if(lastCom=="Q"||lastCom=="T"){
                    d=Math.sqrt(Math.pow(x-cx,2)+Math.pow(cy-y,2));
                    a=Math.PI+Math.atan2(cx-x,cy-y);
                    cx=x+(Math.sin(a)*(d));
                    cy=y+(Math.cos(a)*(d));
                  }else{cx=x;cy=y;}       
                  path+="curContext.quadraticCurveTo("+(cx)+","+(-cy)+","+(nx)+","+(-ny)+");";
                  x=nx;y=ny;
                  break; 
                case "Q"://curContext.quadraticCurveTo(cx,-cy,nx,-ny);
                  cx=parseFloat( xy[0][0] );
                  cy=parseFloat( xy[1][0] );
                  nx=parseFloat( xy[2][0] );
                  ny=parseFloat( xy[3][0] );  
                  path+="curContext.quadraticCurveTo("+(cx)+","+(-cy)+","+(nx)+","+(-ny)+");";              
                  x=nx;y=ny;
                  break;
                case "Z"://curContext.closePath();
                  path+="curContext.closePath();";
                  break;
              }
              lastCom=com[0];
            }
            path+="curContext.translate("+(horiz_adv_x)+",0);";
            path+="doStroke?curContext.stroke():0;";
            path+="doFill?curContext.fill():0;";
            path+="}}";
            return path;
          }
          
          // Split path commands in glpyh          
          var d=glyph[i].getAttribute("d");
          if(d!==undefined){
            var path=buildPath(d);
            eval(path);
            // Store glyph data to table object
            p.glyphTable[url][name]={
              name:name,
              unicode:unicode,
              horiz_adv_x:horiz_adv_x,
              draw:path.draw
            }
          }                  
        } // finished adding glyphs to table
      }
      
      // Create a new object in glyphTable to store this font
      p.glyphTable[url]={};
      
      // Begin loading the Batik SVG font... 
      loadXML(url);
      
      // Return the loaded font for attribute grabbing
      return p.glyphTable[url];
  }
  
  
  // Returns a line to lnPrinted() for user handling 
  p.lnPrinted = function lnPrinted(){};
  p.printed = function printed(){};  
  p.println = function println(){
    var Caller = arguments.callee.caller.name.toString();
    if ( arguments.length > 1 ) {
      Caller!="print"?
        p.ln = arguments:
        p.ln = arguments[0];
    } else {
      p.ln = arguments[0];
    }
    Caller=="print"?        
      p.printed(arguments):
      p.lnPrinted();
  };
  p.print = function print(){ p.println(arguments[0])};
  
  p.char = function char( key ) {
    return key;
  };

  p.map = function map( value, istart, istop, ostart, ostop ) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  };

  String.prototype.replaceAll = function(re, replace) {
    return this.replace(new RegExp(re, "g"), replace);
  };

  p.Point = function Point( x, y ) {
    this.x = x;
    this.y = y;
    this.copy = function() {
      return new Point( x, y );
    }
  };

  p.Random = function() {
    var haveNextNextGaussian = false;
    var nextNextGaussian;

    this.nextGaussian = function() {
      if (haveNextNextGaussian) {
        haveNextNextGaussian = false;

        return nextNextGaussian;
      } else {
        var v1, v2, s;
        do { 
          v1 = 2 * p.random(1) - 1;   // between -1.0 and 1.0
          v2 = 2 * p.random(1) - 1;   // between -1.0 and 1.0
          s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s == 0);
        var multiplier = Math.sqrt(-2 * Math.log(s)/s);
        nextNextGaussian = v2 * multiplier;
        haveNextNextGaussian = true;

        return v1 * multiplier;
      }
    };
  };

  p.ArrayList = function ArrayList( size, size2, size3 ) {
    var array = new Array( 0 | size );
    
    if ( size2 ) {
      for ( var i = 0; i < size; i++ ) {
        array[i] = [];

        for ( var j = 0; j < size2; j++ ) {
          var a = array[i][j] = size3 ? new Array( size3 ) : 0;
          for ( var k = 0; k < size3; k++ ) {
            a[k] = 0;
          }
        }
      }
    } else {
      for ( var i = 0; i < size; i++ ) {
        array[i] = 0;
      }
    }
    
    array.size = function() {
      return this.length;
    };
    array.get = function( i ) {
      return this[ i ];
    };
    array.remove = function( i ) {
      return this.splice( i, 1 );
    };
    array.add = function( item ) {
      return this.push( item );
    };
    array.clone = function() {
      var a = new ArrayList( size );
      for ( var i = 0; i < size; i++ ) {
        a[ i ] = this[ i ];
      }
      return a;
    };
    array.isEmpty = function() {
      return !this.length;
    };
    array.clear = function() {
      this.length = 0;
    };
    
    return array;
  };
  
  p.colorMode = function colorMode( mode, range1, range2, range3, range4 ) {
    curColorMode = mode;

    if ( arguments.length >= 4 ) {
      redRange = range1;
      greenRange = range2;
      blueRange = range3;
    }

    if ( arguments.length == 5 ) {
      opacityRange = range4;
    }

    if ( arguments.length == 2 ) {
      p.colorMode( mode, range1, range1, range1, range1 );
    }
  };
  
  p.beginShape = function beginShape( type ) {
    curShape = type;
    curShapeCount = 0; 
    curvePoints = [];
  };
  
  p.endShape = function endShape( close ) {
    if ( curShapeCount != 0 ) {
      if ( close || doFill ) 
      curContext.lineTo( firstX, firstY );

      if ( doFill )
        curContext.fill();
        
      if ( doStroke )
        curContext.stroke();
    
      curContext.closePath();
      curShapeCount = 0;
      pathOpen = false;
    }

    if ( pathOpen ) {
      if ( doFill )
        curContext.fill();

      if ( doStroke )
        curContext.stroke();

      curContext.closePath();
      curShapeCount = 0;
      pathOpen = false;
    }
  };
  
  p.vertex = function vertex( x, y, x2, y2, x3, y3 ) {    
    if ( curShapeCount == 0 && curShape != p.POINTS ) {
      pathOpen = true;
      curContext.beginPath();
      curContext.moveTo( x, y );
      firstX = x;
      firstY = y;
    } else {
      if ( curShape == p.POINTS ) {
        p.point( x, y );
      } else if ( arguments.length == 2 ) {
        if ( curShape != p.QUAD_STRIP || curShapeCount != 2 )
          curContext.lineTo( x, y );
        if ( curShape == p.TRIANGLE_STRIP ) {
          if ( curShapeCount == 2 ) {
            // finish shape
            p.endShape(p.CLOSE);
            pathOpen = true;
            curContext.beginPath();
            
            // redraw last line to start next shape
            curContext.moveTo( prevX, prevY );
            curContext.lineTo( x, y );
            curShapeCount = 1;
          }
          firstX = prevX;
          firstY = prevY;
        }

        if ( curShape == p.TRIANGLE_FAN && curShapeCount == 2 ) {
          // finish shape
          p.endShape(p.CLOSE);
          pathOpen = true;
          curContext.beginPath();
      
          // redraw last line to start next shape
          curContext.moveTo( firstX, firstY );
          curContext.lineTo( x, y );
          curShapeCount = 1;
        }
    
        if ( curShape == p.QUAD_STRIP && curShapeCount == 3 ) {
          // finish shape
          curContext.lineTo( prevX, prevY );
          p.endShape(p.CLOSE);
          pathOpen = true;
          curContext.beginPath();
    
          // redraw lines to start next shape
          curContext.moveTo( prevX, prevY );
          curContext.lineTo( x, y );
          curShapeCount = 1;
        }

        if ( curShape == p.QUAD_STRIP) {
          
          firstX = secondX;
          firstY = secondY;
          secondX = prevX;
          secondY = prevY;
        }
      } else if ( arguments.length == 4 ) {
        if ( curShapeCount > 1 ) {
          curContext.moveTo( prevX, prevY );
          curContext.quadraticCurveTo( firstX, firstY, x, y );
          curShapeCount = 1;
        }
      } else if ( arguments.length == 6 ) {
        curContext.bezierCurveTo( x, y, x2, y2, x3, y3 );
        //curShapeCount = -1; // Removed due to Heart-Shape issue. - F1LT3R
      }
    }

    prevX = x;
    prevY = y;
    curShapeCount++;
    
    if ( curShape == p.LINES && curShapeCount == 2 ||
         (curShape == p.TRIANGLES) && curShapeCount == 3 ||
     (curShape == p.QUADS) && curShapeCount == 4 ) {
      p.endShape(p.CLOSE);
    }
  };

  p.curveVertex = function( x, y, x2, y2 ) {
    if ( curvePoints.length < 3 ) {
      curvePoints.push([x,y]);
    } else {
      var b = [], s = 1 - curTightness;

      /*
       * Matrix to convert from Catmull-Rom to cubic Bezier
       * where t = curTightness
       * |0         1          0         0       |
       * |(t-1)/6   1          (1-t)/6   0       |
       * |0         (1-t)/6    1         (t-1)/6 |
       * |0         0          0         0       |
       */

      curvePoints.push([x,y]);

      b[0] = [curvePoints[1][0],curvePoints[1][1]];
      b[1] = [curvePoints[1][0]+(s*curvePoints[2][0]-s*curvePoints[0][0])/6,curvePoints[1][1]+(s*curvePoints[2][1]-s*curvePoints[0][1])/6];
      b[2] = [curvePoints[2][0]+(s*curvePoints[1][0]-s*curvePoints[3][0])/6,curvePoints[2][1]+(s*curvePoints[1][1]-s*curvePoints[3][1])/6];
      b[3] = [curvePoints[2][0],curvePoints[2][1]];

      if ( !pathOpen ) {
        p.vertex( b[0][0], b[0][1] );
      } else {
        curShapeCount = 1;
      }

      p.vertex( b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1] );
      curvePoints.shift();
    }
  };

  p.curveTightness = function( tightness ) {
    curTightness = tightness;
  };

  p.bezierVertex = p.vertex;
  
  p.rectMode = function rectMode( aRectMode ) {
    curRectMode = aRectMode;
  };

  p.imageMode = function(){};
  
  p.ellipseMode = function ellipseMode( aEllipseMode ) {
    curEllipseMode = aEllipseMode;
  };
  
  p.dist = function dist( x1, y1, x2, y2 ) {
    return Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) );
  };

  p.year = function year() {
    return (new Date).getYear() + 1900;
  };

  p.month = function month() {
    return (new Date).getMonth();
  };

  p.day = function day() {
    return (new Date).getDay();
  };

  p.hour = function hour() {
    return (new Date).getHours();
  };

  p.minute = function minute() {
    return (new Date).getMinutes();
  };

  p.second = function second() {
    return (new Date).getSeconds();
  };

  p.millis = function millis() {
    return (new Date).getTime() - start;
  };
  
  p.ortho = function ortho(){};
  
  p.translate = function translate( x, y ) {
    curContext.translate( x, y );
  };
  
  p.scale = function scale( x, y ) {
    curContext.scale( x, y || x );
  };
  
  p.rotate = function rotate( aAngle ) {
    curContext.rotate( aAngle );
  };
  
  p.pushMatrix = function pushMatrix() {
    curContext.save();
  };
  
  p.popMatrix = function popMatrix() {
    curContext.restore();
  };
  
  p.redraw = function redraw() {
    
    if ( hasBackground ) {
      p.background();
    }

    p.frameCount++;
    
    inDraw = true;
    p.pushMatrix();
    p.draw();
    p.popMatrix();
    inDraw = false;
  };
  
  p.loop = function loop() {
    if (loopStarted)
      return;
    
    looping = setInterval(function() {
      try {
        p.redraw();  
      }
      catch(e) {
        clearInterval( looping );
        throw e;
      }
    }, 1000 / curFrameRate );
    
    loopStarted = true;
  };
  
  p.frameRate = function frameRate( aRate ) {
    curFrameRate = aRate;
  };
  
  p.background = function background( img ) {
    if ( arguments.length ) {
      if ( img && img.img ) {
        curBackground = img;
      } else {
        curBackground = p.color.apply( this, arguments );
      }
    }    

    if ( curBackground.img ) {
      p.image( curBackground, 0, 0 );
    } else {
      var oldFill = curContext.fillStyle;
      curContext.fillStyle = curBackground + "";
      curContext.fillRect( 0, 0, p.width, p.height );
      curContext.fillStyle = oldFill;
    }
  };
  
  // Clear function - F1LT3R - Not native to Processing
  p.clear = function clear ( x, y, width, height ) {    
    arguments.length==0?
      curContext.clearRect(0,0,p.width,p.height):
      curContext.clearRect(x,y,width,height);     
  }
  
  // Str() - F1LT3R
  p.str = function str( aNumber ){
      return aNumber+"";
  }
  
  p.sq = function sq( aNumber ) {
    return aNumber * aNumber;
  };

  p.sqrt = function sqrt( aNumber ) {
    return Math.sqrt( aNumber );
  };

  // ngsqrt() - Personal Function - F1LT3R // Allows me to calculate the positive square root of a negative number
  p.ngsqrt = function ngsqrt( aNumber ) {
    if (aNumber <= 0){
      return Math.sqrt( -aNumber );
    } else {
      return Math.sqrt( aNumber );
    }
  };
  
  p.int = function int( aNumber ) {
    return Math.floor( aNumber );    
  };

  p.min = function min( aNumber, aNumber2 ) {
    return Math.min( aNumber, aNumber2 );
  };

  p.max = function max( aNumber, aNumber2 ) {
    return Math.max( aNumber, aNumber2 );
  };

  p.ceil = function ceil( aNumber ) {
    return Math.ceil( aNumber );
  };
  
  p.round = function round( aNumber ) {
    return Math.round( aNumber );
  };

  p.norm = function norm( aNumber, low, high ) {
    var range = high-low;
    return ( ( 1 / range ) * aNumber ) - ( ( 1 / range ) * low );
  };

  p.lerp = function lerp( value1, value2, amt ) {
    var range = value2 - value1;
    return ( range * amt ) + value1;
  }
  
  p.floor = function floor( aNumber ) {
    return Math.floor( aNumber );
  };

  p.float = function float( aNumber ) {
      return parseFloat( aNumber );
      /*
      return typeof aNumber == "string" ?
      p.float( aNumber.charCodeAt(0) ) :
      parseFloat( aNumber );
      */
  };

  p.byte = function byte( aNumber ) {
    return aNumber || 0;
  };
  
  p.random = function random( aMin, aMax ) {
    return arguments.length == 2 ?
      aMin + (Math.random() * (aMax - aMin)) :
      Math.random() * aMin;
  };

  // From: http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
  p.noise = function( x, y, z ) {
    return arguments.length >= 2 ?
      PerlinNoise_2D( x, y ) :
      PerlinNoise_2D( x, x );
  };

  function Noise(x, y) {
    var n = x + y * 57;
    n = (n<<13) ^ n;
    return Math.abs(1.0 - (((n * ((n * n * 15731) + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0));
  };

  function SmoothedNoise(x, y) {
    var corners = ( Noise(x-1, y-1)+Noise(x+1, y-1)+Noise(x-1, y+1)+Noise(x+1, y+1) ) / 16;
    var sides   = ( Noise(x-1, y)  +Noise(x+1, y)  +Noise(x, y-1)  +Noise(x, y+1) ) /  8;
    var center  =  Noise(x, y) / 4;
    return corners + sides + center;
  };

  function InterpolatedNoise(x, y) {
    var integer_X    = Math.floor(x);
    var fractional_X = x - integer_X;

    var integer_Y    = Math.floor(y);
    var fractional_Y = y - integer_Y;

    var v1 = SmoothedNoise(integer_X,     integer_Y);
    var v2 = SmoothedNoise(integer_X + 1, integer_Y);
    var v3 = SmoothedNoise(integer_X,     integer_Y + 1);
    var v4 = SmoothedNoise(integer_X + 1, integer_Y + 1);

    var i1 = Interpolate(v1 , v2 , fractional_X);
    var i2 = Interpolate(v3 , v4 , fractional_X);

    return Interpolate(i1 , i2 , fractional_Y);
  }

  function PerlinNoise_2D(x, y) {
      var total = 0;
      var p = 0.25;
      var n = 3;

      for ( var i = 0; i <= n; i++ ) {
          var frequency = Math.pow(2, i);
          var amplitude = Math.pow(p, i);

          total = total + InterpolatedNoise(x * frequency, y * frequency) * amplitude;
      }

      return total;
  }

  function Interpolate(a, b, x) {
    var ft = x * p.PI;
    var f = (1 - p.cos(ft)) * .5;
    return  a*(1-f) + b*f;
  }

  p.abs = function abs( aNumber ) {
    return Math.abs( aNumber );
  };
  
  p.cos = function cos( aNumber ) {
    return Math.cos( aNumber );
  };
  
  p.sin = function sin( aNumber ) {
    return Math.sin( aNumber );
  };
  
  p.pow = function pow( aNumber, aExponent ) {
    return Math.pow( aNumber, aExponent );
  };
  
  p.constrain = function constrain( aNumber, aMin, aMax ) {
    return Math.min( Math.max( aNumber, aMin ), aMax );
  };
  
  p.sqrt = function sqrt( aNumber ) {
    return Math.sqrt( aNumber );
  };
  
  p.atan2 = function atan2( aNumber, aNumber2 ) {
    return Math.atan2( aNumber, aNumber2 );
  };
  
  p.radians = function radians( aAngle ) {
    return ( aAngle / 180 ) * p.PI;
  };
  
  p.degrees = function degrees( aAngle ) {
    aAngle = ( aAngle * 180 ) / p.PI;  
    if (aAngle < 0) {aAngle = 360 + aAngle}    
    return aAngle;
  };
  
  p.size = function size( aWidth, aHeight ) {
    var fillStyle = curContext.fillStyle;
    var strokeStyle = curContext.strokeStyle;

    curElement.width = p.width = aWidth;
    curElement.height = p.height = aHeight;

    curContext.fillStyle = fillStyle;
    curContext.strokeStyle = strokeStyle;
  };
  
  p.noStroke = function noStroke() {
    doStroke = false;
  };
  
  p.noFill = function noFill() {
    doFill = false;
  };
  
  p.smooth = function smooth(){};
  
  p.noSmooth = function noSmooth(){
      
  };
  
  
  p.noLoop = function noLoop() {
    doLoop = false;
  };
  
  p.fill = function fill() {
    doFill = true;
    curContext.fillStyle = p.color.apply( this, arguments );    
  };
  
  p.stroke = function stroke() {
    doStroke = true;
    curContext.strokeStyle = p.color.apply( this, arguments );
  };

  p.strokeWeight = function strokeWeight( w ) {
    curContext.lineWidth = w;
  };
  
  p.point = function point( x, y ) {
    var oldFill = curContext.fillStyle;
    curContext.fillStyle = curContext.strokeStyle;
    curContext.fillRect( Math.round( x ), Math.round( y ), 1, 1 );
    curContext.fillStyle = oldFill;
  };

  p.get = function get( x, y ) {
    if ( arguments.length == 0 ) {
      var c = p.createGraphics( p.width, p.height );
      c.image( curContext, 0, 0 );
      return c;
    }

    if ( !getLoaded ) {
      getLoaded = buildImageObject( curContext.getImageData(0, 0, p.width, p.height) );
    }

    return getLoaded.get( x, y );
  };

  p.set = function set( x, y, obj ) {
    if ( obj && obj.img ) {
      p.image( obj, x, y );
    } else {
      var oldFill = curContext.fillStyle;
      var color = obj;
      curContext.fillStyle = color;
      curContext.fillRect( Math.round( x ), Math.round( y ), 1, 1 );
      curContext.fillStyle = oldFill;
    }
  };
  
  p.arc = function arc( x, y, width, height, start, stop ) {       if ( width <= 0 )
     return;

   if ( curEllipseMode == p.CORNER ) {
     x += width / 2;
     y += height / 2;
   }
      curContext.moveTo( x, y );
   curContext.beginPath();   
   curContext.arc( x, y, curEllipseMode == p.CENTER_RADIUS ? width : width/2, start, stop, false );

   if ( doStroke )
     curContext.stroke();

   curContext.lineTo( x, y );

   if ( doFill )
     curContext.fill();
   
   curContext.closePath();
  };
  
  p.line = function line( x1, y1, x2, y2 ) {   
    curContext.lineCap = "round";
    curContext.beginPath();
  
    curContext.moveTo( x1 || 0, y1 || 0 );
    curContext.lineTo( x2 || 0, y2 || 0 );
    
    curContext.stroke();
    
    curContext.closePath();
  };

  p.bezier = function bezier( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    curContext.lineCap = "butt";
    curContext.beginPath();
  
    curContext.moveTo( x1, y1 );
    curContext.bezierCurveTo( x2, y2, x3, y3, x4, y4 );
    
    curContext.stroke();
    
    curContext.closePath();
  };

  p.triangle = function triangle( x1, y1, x2, y2, x3, y3 ) {
    p.beginShape();
    p.vertex( x1, y1 );
    p.vertex( x2, y2 );
    p.vertex( x3, y3 );
    p.endShape();
  };

  p.quad = function quad( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    curContext.lineCap = "square";
    p.beginShape();
    p.vertex( x1, y1 );
    p.vertex( x2, y2 );
    p.vertex( x3, y3 );
    p.vertex( x4, y4 );
    p.endShape();
  };
  
  p.rect = function rect( x, y, width, height ) {
    if ( width == 0 && height == 0 )
      return;

    curContext.beginPath();
    
    var offsetStart = 0;
    var offsetEnd = 0;

    if ( curRectMode == p.CORNERS ) {
      width -= x;
      height -= y;
    }
    
    if ( curRectMode == p.RADIUS ) {
      width *= 2;
      height *= 2;
    }
    
    if ( curRectMode == p.CENTER || curRectMode == p.RADIUS ) {
      x -= width / 2;
      y -= height / 2;
    }
  
    curContext.rect(
      Math.round( x ) - offsetStart,
      Math.round( y ) - offsetStart,
      Math.round( width ) + offsetEnd,
      Math.round( height ) + offsetEnd
    );
      
    if ( doFill )
      curContext.fill();
      
    if ( doStroke )
      curContext.stroke();
    
    curContext.closePath();
  };
  
  p.ellipse = function ellipse( x, y, width, height ) {
    x = x || 0;
    y = y || 0;

    if ( width <= 0 && height <= 0 )
      return;

    curContext.beginPath();
    
    if ( curEllipseMode == p.RADIUS ) {
      width *= 2;
      height *= 2;
    }     
    
    var offsetStart = 0;
    
    // Shortcut for drawing a circle
    if ( width == height ) {
      curContext.arc( x - offsetStart, y - offsetStart, width / 2, 0, Math.PI * 2, false );
    } else {
      var w = width/2;
      var h = height/2;
      var C = 0.5522847498307933;
      var c_x = C * w;
      var c_y = C * h;
      curContext.moveTo(x+w, y);
      curContext.bezierCurveTo(x+w, y-c_y, x+c_x, y-h, x, y-h);
      curContext.bezierCurveTo(x-c_x, y-h, x-w, y-c_y, x-w, y);
      curContext.bezierCurveTo(x-w, y+c_y, x-c_x, y+h, x, y+h);
      curContext.bezierCurveTo(x+c_x, y+h, x+w, y+c_y, x+w, y);
    }
  
    if ( doFill )
      curContext.fill();
      
    if ( doStroke )
      curContext.stroke();
    
    curContext.closePath();
  };

  p.cursor = function(mode){
    document.body.style.cursor=mode;
  }

  p.link = function( href, target ) {
    window.location = href;
  };

  p.loadPixels = function() {
    p.pixels = buildImageObject( curContext.getImageData(0, 0, p.width, p.height) ).pixels;
  };

  p.updatePixels = function() {
    var colors = /(\d+),(\d+),(\d+),(\d+)/;
    var pixels = {};
    pixels.width = p.width;
    pixels.height = p.height;
    pixels.data = [];

    if ( curContext.createImageData ) {
      pixels = curContext.createImageData( p.width, p.height );
    }

    var data = pixels.data;
    var pos = 0;

    for ( var i = 0, l = p.pixels.length; i < l; i++ ) {
      var c = (p.pixels[i] || "rgba(0,0,0,1)").match(colors);
      data[pos] = parseInt(c[1]);
      data[pos+1] = parseInt(c[2]);
      data[pos+2] = parseInt(c[3]);
      data[pos+3] = parseFloat(c[4]) * 255; // changed to 255 - F1LT3R 08.11.15
      pos += 4;
    }

    curContext.putImageData(pixels, 0, 0);
  };

  p.extendClass = function extendClass( obj, args, fn ) {
    if ( arguments.length == 3 ) {
      fn.apply( obj, args );
    } else {
      args.call( obj );
    }
  };

  p.addMethod = function addMethod( object, name, fn ) {
    if ( object[ name ] ) {
      var args = fn.length;
      
      var oldfn = object[ name ];
      object[ name ] = function() {
        if ( arguments.length == args )
          return fn.apply( this, arguments );
        else
          return oldfn.apply( this, arguments );
      };
    } else {
       object[ name ] = fn;
    }
  };

  p.main = function init(){
  console.log(p);
    p.stroke( 0 );
    p.fill( 255 );
  
    // Canvas has trouble rendering single pixel stuff on whole-pixel
    // counts, so we slightly offset it (this is super lame).
     curContext.translate( 0.5, 0.5 );

    if (p.setup) {
      inSetup = true;
      p.setup();
    }
    
    inSetup = false;
    
    if ( p.draw ) {
      if ( !doLoop ) {
        p.redraw();
      } else {
        p.loop();
      }
    }
    
    attach( curElement, "mousemove", function(e) {
      var scrollX = window.scrollX != null ? window.scrollX : window.pageXOffset;
      var scrollY = window.scrollY != null ? window.scrollY : window.pageYOffset;            
      p.pmouseX = p.mouseX;
      p.pmouseY = p.mouseY;
      p.mouseX = e.clientX - curElement.offsetLeft + scrollX;
      p.mouseY = e.clientY - curElement.offsetTop + scrollY;    

      if ( p.mouseMoved ) {
        p.mouseMoved();
      }

      if ( mousePressed && p.mouseDragged ) {
        p.mouseDragged();
      }    
    });
    
    attach( curElement, "mouseout", function(e) {
      p.cursor("auto");
    });
    
    attach( curElement, "mousedown", function(e) {
      mousePressed = true;
      switch(e.which){
        case 1: p.mouseButton = p.LEFT; break;
        case 2: p.mouseButton = p.CENTER; break;
        case 3: p.mouseButton = p.RIGHT; break; 
      }
      
      p.mouseDown = true;
      
      if ( typeof p.mousePressed == "function" ) {
        p.mousePressed();
      } else {
        p.mousePressed = true;
      }
    });

    attach( curElement, "contextmenu", function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    attach( curElement, "mouseup", function(e) {
      mousePressed = false;
      
      if ( p.mouseClicked ) {
        p.mouseClicked();
      }
      
      if ( typeof p.mousePressed != "function" ) {
        p.mousePressed = false;
      }

      if ( p.mouseReleased ) {
        p.mouseReleased();
      }
    });

    attach( document, "keydown", function(e) {
      keyPressed = true;

      p.key = e.keyCode + 32;
      
      var i; 
      for (i=0; i < p.codedKeys.length; i++){                                        
          if (p.key == p.codedKeys[i]){
            switch(p.key){
            case 70: p.keyCode = p.UP; break;
            case 71: p.keyCode = p.RIGHT; break;
            case 72: p.keyCode = p.DOWN; break;
            case 69: p.keyCode = p.LEFT; break;          
            }
            p.key=p.CODED;
          }
      }

      if ( e.shiftKey ) {
        p.key = String.fromCharCode(p.key).toUpperCase().charCodeAt(0);
      }

      if ( typeof p.keyPressed == "function" ) {
        p.keyPressed();
      } else {
        p.keyPressed = true;
      }
      
    });

    attach( document, "keyup", function(e) {
      keyPressed = false;

      if ( typeof p.keyPressed != "function" ) {
        p.keyPressed = false;
      }

      if ( p.keyReleased ) {
        p.keyReleased();
      }
    });

    function attach(elem, type, fn) {
      if ( elem.addEventListener )
        elem.addEventListener( type, fn, false );
      else
        elem.attachEvent( "on" + type, fn );
    }

  };;
	$s.pop();
}}
xpde.core.js.PApplet.__name__ = ["xpde","core","js","PApplet"];
xpde.core.js.PApplet.prototype.__class__ = xpde.core.js.PApplet;
xpde.core.js.PApplet.__interfaces__ = [haxe.rtti.Infos];
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
	$s.push("Type::getClass");
	var $spos = $s.length;
	if(o == null) {
		$s.pop();
		return null;
	}
	if(o.__enum__ != null) {
		$s.pop();
		return null;
	}
	{
		var $tmp = o.__class__;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.getEnum = function(o) {
	$s.push("Type::getEnum");
	var $spos = $s.length;
	if(o == null) {
		$s.pop();
		return null;
	}
	{
		var $tmp = o.__enum__;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.getSuperClass = function(c) {
	$s.push("Type::getSuperClass");
	var $spos = $s.length;
	{
		var $tmp = c.__super__;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.getClassName = function(c) {
	$s.push("Type::getClassName");
	var $spos = $s.length;
	if(c == null) {
		$s.pop();
		return null;
	}
	var a = c.__name__;
	{
		var $tmp = a.join(".");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.getEnumName = function(e) {
	$s.push("Type::getEnumName");
	var $spos = $s.length;
	var a = e.__ename__;
	{
		var $tmp = a.join(".");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.resolveClass = function(name) {
	$s.push("Type::resolveClass");
	var $spos = $s.length;
	var cl;
	try {
		cl = eval(name);
	}
	catch( $e5 ) {
		{
			var e = $e5;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				cl = null;
			}
		}
	}
	if(cl == null || cl.__name__ == null) {
		$s.pop();
		return null;
	}
	{
		$s.pop();
		return cl;
	}
	$s.pop();
}
Type.resolveEnum = function(name) {
	$s.push("Type::resolveEnum");
	var $spos = $s.length;
	var e;
	try {
		e = eval(name);
	}
	catch( $e6 ) {
		{
			var err = $e6;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				e = null;
			}
		}
	}
	if(e == null || e.__ename__ == null) {
		$s.pop();
		return null;
	}
	{
		$s.pop();
		return e;
	}
	$s.pop();
}
Type.createInstance = function(cl,args) {
	$s.push("Type::createInstance");
	var $spos = $s.length;
	if(args.length <= 3) {
		var $tmp = new cl(args[0],args[1],args[2]);
		$s.pop();
		return $tmp;
	}
	if(args.length > 8) throw "Too many arguments";
	{
		var $tmp = new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.createEmptyInstance = function(cl) {
	$s.push("Type::createEmptyInstance");
	var $spos = $s.length;
	{
		var $tmp = new cl($_);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.createEnum = function(e,constr,params) {
	$s.push("Type::createEnum");
	var $spos = $s.length;
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		{
			var $tmp = f.apply(e,params);
			$s.pop();
			return $tmp;
		}
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	{
		$s.pop();
		return f;
	}
	$s.pop();
}
Type.getInstanceFields = function(c) {
	$s.push("Type::getInstanceFields");
	var $spos = $s.length;
	var a = Reflect.fields(c.prototype);
	a.remove("__class__");
	{
		$s.pop();
		return a;
	}
	$s.pop();
}
Type.getClassFields = function(c) {
	$s.push("Type::getClassFields");
	var $spos = $s.length;
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__super__");
	a.remove("prototype");
	{
		$s.pop();
		return a;
	}
	$s.pop();
}
Type.getEnumConstructs = function(e) {
	$s.push("Type::getEnumConstructs");
	var $spos = $s.length;
	{
		var $tmp = e.__constructs__;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type["typeof"] = function(v) {
	$s.push("Type::typeof");
	var $spos = $s.length;
	switch(typeof(v)) {
	case "boolean":{
		{
			var $tmp = ValueType.TBool;
			$s.pop();
			return $tmp;
		}
	}break;
	case "string":{
		{
			var $tmp = ValueType.TClass(String);
			$s.pop();
			return $tmp;
		}
	}break;
	case "number":{
		if(Math.ceil(v) == v % 2147483648.0) {
			var $tmp = ValueType.TInt;
			$s.pop();
			return $tmp;
		}
		{
			var $tmp = ValueType.TFloat;
			$s.pop();
			return $tmp;
		}
	}break;
	case "object":{
		if(v == null) {
			var $tmp = ValueType.TNull;
			$s.pop();
			return $tmp;
		}
		var e = v.__enum__;
		if(e != null) {
			var $tmp = ValueType.TEnum(e);
			$s.pop();
			return $tmp;
		}
		var c = v.__class__;
		if(c != null) {
			var $tmp = ValueType.TClass(c);
			$s.pop();
			return $tmp;
		}
		{
			var $tmp = ValueType.TObject;
			$s.pop();
			return $tmp;
		}
	}break;
	case "function":{
		if(v.__name__ != null) {
			var $tmp = ValueType.TObject;
			$s.pop();
			return $tmp;
		}
		{
			var $tmp = ValueType.TFunction;
			$s.pop();
			return $tmp;
		}
	}break;
	case "undefined":{
		{
			var $tmp = ValueType.TNull;
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		{
			var $tmp = ValueType.TUnknown;
			$s.pop();
			return $tmp;
		}
	}break;
	}
	$s.pop();
}
Type.enumEq = function(a,b) {
	$s.push("Type::enumEq");
	var $spos = $s.length;
	if(a == b) {
		$s.pop();
		return true;
	}
	if(a[0] != b[0]) {
		$s.pop();
		return false;
	}
	{
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) {
				$s.pop();
				return false;
			}
		}
	}
	var e = a.__enum__;
	if(e != b.__enum__ || e == null) {
		$s.pop();
		return false;
	}
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
Type.enumConstructor = function(e) {
	$s.push("Type::enumConstructor");
	var $spos = $s.length;
	{
		var $tmp = e[0];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.enumParameters = function(e) {
	$s.push("Type::enumParameters");
	var $spos = $s.length;
	{
		var $tmp = e.slice(2);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Type.enumIndex = function(e) {
	$s.push("Type::enumIndex");
	var $spos = $s.length;
	{
		var $tmp = e[1];
		$s.pop();
		return $tmp;
	}
	$s.pop();
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
	$s.push("js.Lib::alert");
	var $spos = $s.length;
	alert(js.Boot.__string_rec(v,""));
	$s.pop();
}
js.Lib.eval = function(code) {
	$s.push("js.Lib::eval");
	var $spos = $s.length;
	{
		var $tmp = eval(code);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
js.Lib.setErrorHandler = function(f) {
	$s.push("js.Lib::setErrorHandler");
	var $spos = $s.length;
	js.Lib.onerror = f;
	$s.pop();
}
js.Lib.prototype.__class__ = js.Lib;
xpde.parser = {}
xpde.parser.Token = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.Token::new");
	var $spos = $s.length;
	null;
	$s.pop();
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
	$s.push("xpde.parser.Buffer::new");
	var $spos = $s.length;
	this.pos = 0;
	this.bufChar = 0;
	this.stream = s;
	this.Read();
	$s.pop();
}}
xpde.parser.Buffer.__name__ = ["xpde","parser","Buffer"];
xpde.parser.Buffer.prototype.Peek = function() {
	$s.push("xpde.parser.Buffer::Peek");
	var $spos = $s.length;
	{
		var $tmp = this.bufChar;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Buffer.prototype.Read = function() {
	$s.push("xpde.parser.Buffer::Read");
	var $spos = $s.length;
	this.pos++;
	var ret = this.bufChar;
	try {
		this.bufChar = this.stream.readByte();
	}
	catch( $e7 ) {
		if( js.Boot.__instanceof($e7,haxe.io.Eof) ) {
			var e = $e7;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				this.bufChar = xpde.parser.Buffer.EOF;
			}
		} else throw($e7);
	}
	{
		$s.pop();
		return ret;
	}
	$s.pop();
}
xpde.parser.Buffer.prototype.bufChar = null;
xpde.parser.Buffer.prototype.getPos = function() {
	$s.push("xpde.parser.Buffer::getPos");
	var $spos = $s.length;
	{
		var $tmp = this.pos;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Buffer.prototype.pos = null;
xpde.parser.Buffer.prototype.stream = null;
xpde.parser.Buffer.prototype.__class__ = xpde.parser.Buffer;
xpde.parser.StartStates = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.StartStates::new");
	var $spos = $s.length;
	this.tab = [];
	$s.pop();
}}
xpde.parser.StartStates.__name__ = ["xpde","parser","StartStates"];
xpde.parser.StartStates.prototype.set = function(key,val) {
	$s.push("xpde.parser.StartStates::set");
	var $spos = $s.length;
	var e = new xpde.parser.Elem(key,val);
	var k = key % 128;
	e.next = this.tab[k];
	this.tab[k] = e;
	$s.pop();
}
xpde.parser.StartStates.prototype.state = function(key) {
	$s.push("xpde.parser.StartStates::state");
	var $spos = $s.length;
	var e = this.tab[key % 128];
	while(e != null && e.key != key) e = e.next;
	{
		var $tmp = (e == null?0:e.val);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.StartStates.prototype.tab = null;
xpde.parser.StartStates.prototype.__class__ = xpde.parser.StartStates;
xpde.parser.Elem = function(key,val) { if( key === $_ ) return; {
	$s.push("xpde.parser.Elem::new");
	var $spos = $s.length;
	this.key = key;
	this.val = val;
	$s.pop();
}}
xpde.parser.Elem.__name__ = ["xpde","parser","Elem"];
xpde.parser.Elem.prototype.key = null;
xpde.parser.Elem.prototype.next = null;
xpde.parser.Elem.prototype.val = null;
xpde.parser.Elem.prototype.__class__ = xpde.parser.Elem;
Hash = function(p) { if( p === $_ ) return; {
	$s.push("Hash::new");
	var $spos = $s.length;
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
	$s.pop();
}}
Hash.__name__ = ["Hash"];
Hash.prototype.exists = function(key) {
	$s.push("Hash::exists");
	var $spos = $s.length;
	try {
		key = "$" + key;
		{
			var $tmp = this.hasOwnProperty.call(this.h,key);
			$s.pop();
			return $tmp;
		}
	}
	catch( $e8 ) {
		{
			var e = $e8;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				{
					$s.pop();
					return false;
				}
			}
		}
	}
	$s.pop();
}
Hash.prototype.get = function(key) {
	$s.push("Hash::get");
	var $spos = $s.length;
	{
		var $tmp = this.h["$" + key];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Hash.prototype.h = null;
Hash.prototype.iterator = function() {
	$s.push("Hash::iterator");
	var $spos = $s.length;
	{
		var $tmp = { ref : this.h, it : this.keys(), hasNext : function() {
			$s.push("Hash::iterator@200");
			var $spos = $s.length;
			{
				var $tmp = this.it.hasNext();
				$s.pop();
				return $tmp;
			}
			$s.pop();
		}, next : function() {
			$s.push("Hash::iterator@201");
			var $spos = $s.length;
			var i = this.it.next();
			{
				var $tmp = this.ref["$" + i];
				$s.pop();
				return $tmp;
			}
			$s.pop();
		}}
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Hash.prototype.keys = function() {
	$s.push("Hash::keys");
	var $spos = $s.length;
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	{
		var $tmp = a.iterator();
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Hash.prototype.remove = function(key) {
	$s.push("Hash::remove");
	var $spos = $s.length;
	if(!this.exists(key)) {
		$s.pop();
		return false;
	}
	delete(this.h["$" + key]);
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
Hash.prototype.set = function(key,value) {
	$s.push("Hash::set");
	var $spos = $s.length;
	this.h["$" + key] = value;
	$s.pop();
}
Hash.prototype.toString = function() {
	$s.push("Hash::toString");
	var $spos = $s.length;
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it9 = it;
	while( $it9.hasNext() ) { var i = $it9.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	{
		var $tmp = s.b.join("");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
Hash.prototype.__class__ = Hash;
xpde.parser.Scanner = function(s) { if( s === $_ ) return; {
	$s.push("xpde.parser.Scanner::new");
	var $spos = $s.length;
	this.tval = new StringBuf();
	this.buffer = new xpde.parser.Buffer(s);
	this.Init();
	$s.pop();
}}
xpde.parser.Scanner.__name__ = ["xpde","parser","Scanner"];
xpde.parser.Scanner.prototype.AddCh = function() {
	$s.push("xpde.parser.Scanner::AddCh");
	var $spos = $s.length;
	if(this.ch != xpde.parser.Buffer.EOF) {
		this.tval.addChar(this.ch);
		this.NextCh();
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.CheckLiteral = function() {
	$s.push("xpde.parser.Scanner::CheckLiteral");
	var $spos = $s.length;
	var val = this.t.val;
	var kind = xpde.parser.Scanner.literals.get(val);
	if(kind != null) {
		this.t.kind = kind;
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.Comment0 = function() {
	$s.push("xpde.parser.Scanner::Comment0");
	var $spos = $s.length;
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
					{
						$s.pop();
						return true;
					}
				}
				this.NextCh();
			}
			else if(this.ch == xpde.parser.Buffer.EOF) {
				$s.pop();
				return false;
			}
			else this.NextCh();
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.Comment1 = function() {
	$s.push("xpde.parser.Scanner::Comment1");
	var $spos = $s.length;
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
						{
							$s.pop();
							return true;
						}
					}
					this.NextCh();
				}
			}
			else if(this.ch == xpde.parser.Buffer.EOF) {
				$s.pop();
				return false;
			}
			else this.NextCh();
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.Init = function() {
	$s.push("xpde.parser.Scanner::Init");
	var $spos = $s.length;
	this.pos = -1;
	this.line = 1;
	this.col = 0;
	this.oldEols = 0;
	this.NextCh();
	this.pt = this.tokens = new xpde.parser.Token();
	$s.pop();
}
xpde.parser.Scanner.prototype.NextCh = function() {
	$s.push("xpde.parser.Scanner::NextCh");
	var $spos = $s.length;
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
	$s.pop();
}
xpde.parser.Scanner.prototype.NextToken = function() {
	$s.push("xpde.parser.Scanner::NextToken");
	var $spos = $s.length;
	while(this.ch == 32 || this.ch >= 9 && this.ch <= 10 || this.ch == 13) this.NextCh();
	if(this.ch == 47 && this.Comment0() || this.ch == 47 && this.Comment1()) {
		var $tmp = this.NextToken();
		$s.pop();
		return $tmp;
	}
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
					this.t.val = this.tval.b.join("");
					this.tval = new StringBuf();
					this.CheckLiteral();
					{
						var $tmp = this.t;
						$s.pop();
						return $tmp;
					}
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
	this.t.val = this.tval.b.join("");
	this.tval = new StringBuf();
	{
		var $tmp = this.t;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.Peek = function() {
	$s.push("xpde.parser.Scanner::Peek");
	var $spos = $s.length;
	do {
		if(this.pt.next == null) {
			this.pt.next = this.NextToken();
		}
		this.pt = this.pt.next;
	} while(this.pt.kind > xpde.parser.Scanner.maxT);
	{
		var $tmp = this.pt;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Scanner.prototype.ResetPeek = function() {
	$s.push("xpde.parser.Scanner::ResetPeek");
	var $spos = $s.length;
	this.pt = this.tokens;
	$s.pop();
}
xpde.parser.Scanner.prototype.Scan = function() {
	$s.push("xpde.parser.Scanner::Scan");
	var $spos = $s.length;
	if(this.tokens.next == null) {
		{
			var $tmp = this.NextToken();
			$s.pop();
			return $tmp;
		}
	}
	else {
		this.pt = this.tokens = this.tokens.next;
		{
			var $tmp = this.tokens;
			$s.pop();
			return $tmp;
		}
	}
	$s.pop();
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
	$s.push("haxe.io.Eof::new");
	var $spos = $s.length;
	null;
	$s.pop();
}}
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype.toString = function() {
	$s.push("haxe.io.Eof::toString");
	var $spos = $s.length;
	{
		$s.pop();
		return "Eof";
	}
	$s.pop();
}
haxe.io.Eof.prototype.__class__ = haxe.io.Eof;
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	$s.push("js.Boot::__unhtml");
	var $spos = $s.length;
	{
		var $tmp = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
js.Boot.__trace = function(v,i) {
	$s.push("js.Boot::__trace");
	var $spos = $s.length;
	var msg = (i != null?i.fileName + ":" + i.lineNumber + ": ":"");
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
	$s.pop();
}
js.Boot.__clear_trace = function() {
	$s.push("js.Boot::__clear_trace");
	var $spos = $s.length;
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
	$s.pop();
}
js.Boot.__closure = function(o,f) {
	$s.push("js.Boot::__closure");
	var $spos = $s.length;
	var m = o[f];
	if(m == null) {
		$s.pop();
		return null;
	}
	var f1 = function() {
		$s.push("js.Boot::__closure@67");
		var $spos = $s.length;
		{
			var $tmp = m.apply(o,arguments);
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	f1.scope = o;
	f1.method = m;
	{
		$s.pop();
		return f1;
	}
	$s.pop();
}
js.Boot.__string_rec = function(o,s) {
	$s.push("js.Boot::__string_rec");
	var $spos = $s.length;
	if(o == null) {
		$s.pop();
		return "null";
	}
	if(s.length >= 5) {
		$s.pop();
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) {
					var $tmp = o[0];
					$s.pop();
					return $tmp;
				}
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
				{
					var $tmp = str + ")";
					$s.pop();
					return $tmp;
				}
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
			{
				$s.pop();
				return str;
			}
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e10 ) {
			{
				var e = $e10;
				{
					$e = [];
					while($s.length >= $spos) $e.unshift($s.pop());
					$s.push($e[0]);
					{
						$s.pop();
						return "???";
					}
				}
			}
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				$s.pop();
				return s2;
			}
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
		{
			$s.pop();
			return str;
		}
	}break;
	case "function":{
		{
			$s.pop();
			return "<function>";
		}
	}break;
	case "string":{
		{
			$s.pop();
			return o;
		}
	}break;
	default:{
		{
			var $tmp = String(o);
			$s.pop();
			return $tmp;
		}
	}break;
	}
	$s.pop();
}
js.Boot.__interfLoop = function(cc,cl) {
	$s.push("js.Boot::__interfLoop");
	var $spos = $s.length;
	if(cc == null) {
		$s.pop();
		return false;
	}
	if(cc == cl) {
		$s.pop();
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) {
				$s.pop();
				return true;
			}
		}
	}
	{
		var $tmp = js.Boot.__interfLoop(cc.__super__,cl);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
js.Boot.__instanceof = function(o,cl) {
	$s.push("js.Boot::__instanceof");
	var $spos = $s.length;
	try {
		if(o instanceof cl) {
			if(cl == Array) {
				var $tmp = (o.__enum__ == null);
				$s.pop();
				return $tmp;
			}
			{
				$s.pop();
				return true;
			}
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) {
			$s.pop();
			return true;
		}
	}
	catch( $e11 ) {
		{
			var e = $e11;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				if(cl == null) {
					$s.pop();
					return false;
				}
			}
		}
	}
	switch(cl) {
	case Int:{
		{
			var $tmp = Math.ceil(o%2147483648.0) === o;
			$s.pop();
			return $tmp;
		}
	}break;
	case Float:{
		{
			var $tmp = typeof(o) == "number";
			$s.pop();
			return $tmp;
		}
	}break;
	case Bool:{
		{
			var $tmp = o === true || o === false;
			$s.pop();
			return $tmp;
		}
	}break;
	case String:{
		{
			var $tmp = typeof(o) == "string";
			$s.pop();
			return $tmp;
		}
	}break;
	case Dynamic:{
		{
			$s.pop();
			return true;
		}
	}break;
	default:{
		if(o == null) {
			$s.pop();
			return false;
		}
		{
			var $tmp = o.__enum__ == cl || (cl == Class && o.__name__ != null) || (cl == Enum && o.__ename__ != null);
			$s.pop();
			return $tmp;
		}
	}break;
	}
	$s.pop();
}
js.Boot.__init = function() {
	$s.push("js.Boot::__init");
	var $spos = $s.length;
	js.Lib.isIE = (document.all != null && window.opera == null);
	js.Lib.isOpera = (window.opera != null);
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		$s.push("js.Boot::__init@199");
		var $spos = $s.length;
		this.splice(i,0,x);
		$s.pop();
	}
	Array.prototype.remove = (Array.prototype.indexOf?function(obj) {
		$s.push("js.Boot::__init@202");
		var $spos = $s.length;
		var idx = this.indexOf(obj);
		if(idx == -1) {
			$s.pop();
			return false;
		}
		this.splice(idx,1);
		{
			$s.pop();
			return true;
		}
		$s.pop();
	}:function(obj) {
		$s.push("js.Boot::__init@207");
		var $spos = $s.length;
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				{
					$s.pop();
					return true;
				}
			}
			i++;
		}
		{
			$s.pop();
			return false;
		}
		$s.pop();
	});
	Array.prototype.iterator = function() {
		$s.push("js.Boot::__init@219");
		var $spos = $s.length;
		{
			var $tmp = { cur : 0, arr : this, hasNext : function() {
				$s.push("js.Boot::__init@219@223");
				var $spos = $s.length;
				{
					var $tmp = this.cur < this.arr.length;
					$s.pop();
					return $tmp;
				}
				$s.pop();
			}, next : function() {
				$s.push("js.Boot::__init@219@226");
				var $spos = $s.length;
				{
					var $tmp = this.arr[this.cur++];
					$s.pop();
					return $tmp;
				}
				$s.pop();
			}}
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	var cca = String.prototype.charCodeAt;
	String.prototype.cca = cca;
	String.prototype.charCodeAt = function(i) {
		$s.push("js.Boot::__init@233");
		var $spos = $s.length;
		var x = cca.call(this,i);
		if(isNaN(x)) {
			$s.pop();
			return null;
		}
		{
			$s.pop();
			return x;
		}
		$s.pop();
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		$s.push("js.Boot::__init@240");
		var $spos = $s.length;
		if(pos != null && pos != 0 && len != null && len < 0) {
			$s.pop();
			return "";
		}
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = this.length + len - pos;
		}
		{
			var $tmp = oldsub.apply(this,[pos,len]);
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	$closure = js.Boot.__closure;
	$s.pop();
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
xpde.parser.Expression = { __ename__ : ["xpde","parser","Expression"], __constructs__ : ["EArrayInstantiation","EObjectInstantiation","EConditional","EArrayAccess","ELocalReference","EReference","EQualifiedReference","ESuperReference","EThisReference","ECall","EThisCall","ESuperCall","EArrayAssignment","EAssignment","ELocalAssignment","ECast","EPrefixOperation","EInfixOperation","EInstanceOf","EPrefix","EPostfix","EArrayLiteral","EStringLiteral","EIntegerLiteral","EFloatLiteral","ECharLiteral","EBooleanLiteral","ENull","ELexExpression"] }
xpde.parser.Expression.EArrayAccess = function(index,base) { var $x = ["EArrayAccess",3,index,base]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayAssignment = function(index,base,value) { var $x = ["EArrayAssignment",12,index,base,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayInstantiation = function(type,sizes) { var $x = ["EArrayInstantiation",0,type,sizes]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EArrayLiteral = function(values) { var $x = ["EArrayLiteral",21,values]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EAssignment = function(identifier,base,value) { var $x = ["EAssignment",13,identifier,base,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EBooleanLiteral = function(value) { var $x = ["EBooleanLiteral",26,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECall = function(identifier,base,args) { var $x = ["ECall",9,identifier,base,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECast = function(type,expression) { var $x = ["ECast",15,type,expression]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ECharLiteral = function(value) { var $x = ["ECharLiteral",25,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EConditional = function(condition,thenExpression,elseExpression) { var $x = ["EConditional",2,condition,thenExpression,elseExpression]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EFloatLiteral = function(value) { var $x = ["EFloatLiteral",24,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EInfixOperation = function(operation,leftOperand,rightOperand) { var $x = ["EInfixOperation",17,operation,leftOperand,rightOperand]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EInstanceOf = function(expression,type) { var $x = ["EInstanceOf",18,expression,type]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EIntegerLiteral = function(value) { var $x = ["EIntegerLiteral",23,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ELexExpression = function(expression) { var $x = ["ELexExpression",28,expression]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ELocalAssignment = function(identifier,value) { var $x = ["ELocalAssignment",14,identifier,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ELocalReference = function(identifier) { var $x = ["ELocalReference",4,identifier]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ENull = ["ENull",27];
xpde.parser.Expression.ENull.toString = $estr;
xpde.parser.Expression.ENull.__enum__ = xpde.parser.Expression;
xpde.parser.Expression.EObjectInstantiation = function(qualifier,args) { var $x = ["EObjectInstantiation",1,qualifier,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPostfix = function(type,reference) { var $x = ["EPostfix",20,type,reference]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPrefix = function(type,reference) { var $x = ["EPrefix",19,type,reference]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EPrefixOperation = function(operation,operand) { var $x = ["EPrefixOperation",16,operation,operand]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EQualifiedReference = function(qualident) { var $x = ["EQualifiedReference",6,qualident]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EReference = function(identifier,base) { var $x = ["EReference",5,identifier,base]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EStringLiteral = function(value) { var $x = ["EStringLiteral",22,value]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ESuperCall = function(args) { var $x = ["ESuperCall",11,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.ESuperReference = ["ESuperReference",7];
xpde.parser.Expression.ESuperReference.toString = $estr;
xpde.parser.Expression.ESuperReference.__enum__ = xpde.parser.Expression;
xpde.parser.Expression.EThisCall = function(args) { var $x = ["EThisCall",10,args]; $x.__enum__ = xpde.parser.Expression; $x.toString = $estr; return $x; }
xpde.parser.Expression.EThisReference = ["EThisReference",8];
xpde.parser.Expression.EThisReference.toString = $estr;
xpde.parser.Expression.EThisReference.__enum__ = xpde.parser.Expression;
xpde.parser.LexicalExpression = { __ename__ : ["xpde","parser","LexicalExpression"], __constructs__ : ["LReference","LCall","LAssignment"] }
xpde.parser.LexicalExpression.LAssignment = function(identifier,value) { var $x = ["LAssignment",2,identifier,value]; $x.__enum__ = xpde.parser.LexicalExpression; $x.toString = $estr; return $x; }
xpde.parser.LexicalExpression.LCall = function(identifier,args) { var $x = ["LCall",1,identifier,args]; $x.__enum__ = xpde.parser.LexicalExpression; $x.toString = $estr; return $x; }
xpde.parser.LexicalExpression.LReference = function(identifier) { var $x = ["LReference",0,identifier]; $x.__enum__ = xpde.parser.LexicalExpression; $x.toString = $estr; return $x; }
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
xpde.parser.BitSet = function(nbits) { if( nbits === $_ ) return; {
	$s.push("xpde.parser.BitSet::new");
	var $spos = $s.length;
	this.bitset = [];
	{
		var _g = 0;
		while(_g < nbits) {
			var i = _g++;
			this.bitset.push(false);
		}
	}
	$s.pop();
}}
xpde.parser.BitSet.__name__ = ["xpde","parser","BitSet"];
xpde.parser.BitSet.prototype.bitset = null;
xpde.parser.BitSet.prototype.get = function(bitIndex) {
	$s.push("xpde.parser.BitSet::get");
	var $spos = $s.length;
	{
		var $tmp = this.bitset[bitIndex];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.BitSet.prototype.or = function(bitset2) {
	$s.push("xpde.parser.BitSet::or");
	var $spos = $s.length;
	var _g1 = 0, _g = this.bitset.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.bitset[i] = this.bitset[i] || bitset2.bitset[i];
	}
	$s.pop();
}
xpde.parser.BitSet.prototype.set = function(bitIndex) {
	$s.push("xpde.parser.BitSet::set");
	var $spos = $s.length;
	this.bitset[bitIndex] = true;
	$s.pop();
}
xpde.parser.BitSet.prototype.__class__ = xpde.parser.BitSet;
xpde.parser.Parser = function(scanner,unit) { if( scanner === $_ ) return; {
	$s.push("xpde.parser.Parser::new");
	var $spos = $s.length;
	this.errDist = xpde.parser.Parser.minErrDist;
	this.scanner = scanner;
	this.unit = unit;
	this.errors = new xpde.parser.Errors();
	this.classContexts = [];
	this.blockContexts = [];
	$s.pop();
}}
xpde.parser.Parser.__name__ = ["xpde","parser","Parser"];
xpde.parser.Parser.newSet = function(values) {
	$s.push("xpde.parser.Parser::newSet");
	var $spos = $s.length;
	var s = new xpde.parser.BitSet(xpde.parser.Parser.maxTerminals);
	{
		var _g1 = 0, _g = values.length;
		while(_g1 < _g) {
			var i = _g1++;
			s.bitset[values[i]] = true;
		}
	}
	{
		$s.pop();
		return s;
	}
	$s.pop();
}
xpde.parser.Parser.or = function(s1,s2) {
	$s.push("xpde.parser.Parser::or");
	var $spos = $s.length;
	s1.or(s2);
	{
		$s.pop();
		return s1;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Arguments = function() {
	$s.push("xpde.parser.Parser::Arguments");
	var $spos = $s.length;
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
	{
		$s.pop();
		return arguments;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ArgumentsOpt = function(identifier,base) {
	$s.push("xpde.parser.Parser::ArgumentsOpt");
	var $spos = $s.length;
	var expression = null;
	expression = xpde.parser.Expression.EReference(identifier,base);
	if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = xpde.parser.Expression.ECall(identifier,base,arguments);
	}
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ArrayCreatorRest = function(type) {
	$s.push("xpde.parser.Parser::ArrayCreatorRest");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ArrayInitializer = function() {
	$s.push("xpde.parser.Parser::ArrayInitializer");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.AssignmentOperator = function() {
	$s.push("xpde.parser.Parser::AssignmentOperator");
	var $spos = $s.length;
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
	{
		$s.pop();
		return operator;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.BasicType = function() {
	$s.push("xpde.parser.Parser::BasicType");
	var $spos = $s.length;
	var type = null;
	switch(this.la.kind) {
	case 7:{
		this.Get();
		type = xpde.PrimitiveType.PTByte;
	}break;
	case 20:{
		this.Get();
		type = xpde.PrimitiveType.PTShort;
	}break;
	case 8:{
		this.Get();
		type = xpde.PrimitiveType.PTChar;
	}break;
	case 15:{
		this.Get();
		type = xpde.PrimitiveType.PTInt;
	}break;
	case 16:{
		this.Get();
		type = xpde.PrimitiveType.PTLong;
	}break;
	case 13:{
		this.Get();
		type = xpde.PrimitiveType.PTFloat;
	}break;
	case 10:{
		this.Get();
		type = xpde.PrimitiveType.PTDouble;
	}break;
	case 6:{
		this.Get();
		type = xpde.PrimitiveType.PTBoolean;
	}break;
	default:{
		this.SynErr(114);
	}break;
	}
	{
		$s.pop();
		return type;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Block = function(parent) {
	$s.push("xpde.parser.Parser::Block");
	var $spos = $s.length;
	var statement = null;
	this.blockContexts.unshift(new xpde.parser.BlockContext(parent));
	this.Expect(31);
	while(this.StartOf(4)) {
		this.BlockStatement();
	}
	this.Expect(37);
	statement = this.blockContexts.shift().getBlockStatement();
	{
		$s.pop();
		return statement;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.BlockStatement = function() {
	$s.push("xpde.parser.Parser::BlockStatement");
	var $spos = $s.length;
	if(this.isLocalVarDecl(false)) {
		this.LocalVariableDeclaration();
		this.Expect(41);
	}
	else if(this.StartOf(5)) {
		this.ClassOrInterfaceDeclaration();
	}
	else if(this.StartOf(10)) {
		var statement = this.Statement0();
		this.blockContexts[0].pushStatement(statement);
	}
	else this.SynErr(107);
	$s.pop();
}
xpde.parser.Parser.prototype.BracketsOpt = function() {
	$s.push("xpde.parser.Parser::BracketsOpt");
	var $spos = $s.length;
	var bCount = null;
	bCount = 0;
	while(this.la.kind == 32) {
		this.Get();
		this.Expect(38);
		bCount++;
	}
	{
		$s.pop();
		return bCount;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.CatchClause = function() {
	$s.push("xpde.parser.Parser::CatchClause");
	var $spos = $s.length;
	var _catch = null;
	this.Expect(69);
	this.Expect(33);
	var parameter = this.FormalParameter0();
	this.Expect(39);
	var block = this.Block(this.blockContexts[0]);
	_catch = { parameter : parameter, body : block}
	{
		$s.pop();
		return _catch;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Catches = function() {
	$s.push("xpde.parser.Parser::Catches");
	var $spos = $s.length;
	var catches = null;
	catches = [];
	var catchBlock = this.CatchClause();
	catches.push(catchBlock);
	while(this.la.kind == 69) {
		var catchBlock1 = this.CatchClause();
		catches.push(catchBlock1);
	}
	{
		$s.pop();
		return catches;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ClassBody = function() {
	$s.push("xpde.parser.Parser::ClassBody");
	var $spos = $s.length;
	this.Expect(31);
	while(this.StartOf(3)) {
		this.ClassBodyDeclaration();
	}
	this.Expect(37);
	$s.pop();
}
xpde.parser.Parser.prototype.ClassBodyDeclaration = function() {
	$s.push("xpde.parser.Parser::ClassBodyDeclaration");
	var $spos = $s.length;
	if(this.la.kind == 41) {
		this.Get();
	}
	else if(this.StartOf(6)) {
		var modifiers = new xpde.parser.EnumSet();
		if(this.la.kind == 21) {
			this.Get();
			this.addModifier(modifiers,xpde.Modifier.MStatic);
		}
		if(this.la.kind == 31) {
			var block = this.Block(null);
			this.classContexts[0].staticConstructor.pushStatement(block);
		}
		else if(this.StartOf(7)) {
			if(this.StartOf(8)) {
				this.Modifier1(modifiers);
				while(this.StartOf(9)) {
					this.Modifier0(modifiers);
				}
			}
			this.MemberDecl(modifiers);
		}
		else this.SynErr(105);
	}
	else this.SynErr(106);
	$s.pop();
}
xpde.parser.Parser.prototype.ClassCreatorRest = function(qualifier) {
	$s.push("xpde.parser.Parser::ClassCreatorRest");
	var $spos = $s.length;
	var expression = null;
	var arguments = this.Arguments();
	expression = xpde.parser.Expression.EObjectInstantiation(qualifier,arguments);
	if(this.la.kind == 31) {
		this.ClassBody();
	}
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ClassDeclaration = function(modifiers) {
	$s.push("xpde.parser.Parser::ClassDeclaration");
	var $spos = $s.length;
	this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.classes);
	this.Expect(9);
	this.Expect(1);
	this.classContexts.unshift(new xpde.parser.ClassContext(modifiers,this.t.val));
	if(this.la.kind == 53) {
		this.Get();
		var arg = this.Type();
		this.classContexts[0].extend = arg;
	}
	if(this.la.kind == 54) {
		this.Get();
		var arg = this.TypeList();
		this.classContexts[0].implement = arg;
	}
	this.ClassBody();
	this.unit.context.defineClass(this.classContexts.shift());
	$s.pop();
}
xpde.parser.Parser.prototype.ClassModifier = function(modifiers) {
	$s.push("xpde.parser.Parser::ClassModifier");
	var $spos = $s.length;
	switch(this.la.kind) {
	case 19:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MPublic);
	}break;
	case 44:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MProtected);
	}break;
	case 45:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MPrivate);
	}break;
	case 46:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MAbstract);
	}break;
	case 21:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MStatic);
	}break;
	case 12:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MFinal);
	}break;
	case 47:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MStrictfp);
	}break;
	default:{
		this.SynErr(110);
	}break;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ClassOrInterfaceDeclaration = function() {
	$s.push("xpde.parser.Parser::ClassOrInterfaceDeclaration");
	var $spos = $s.length;
	var modifiers = new xpde.parser.EnumSet();
	while(this.StartOf(11)) {
		this.ClassModifier(modifiers);
	}
	if(this.la.kind == 9) {
		this.ClassDeclaration(modifiers);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(modifiers);
	}
	else this.SynErr(109);
	$s.pop();
}
xpde.parser.Parser.prototype.CompilationUnit = function() {
	$s.push("xpde.parser.Parser::CompilationUnit");
	var $spos = $s.length;
	var packageDeclaration = [];
	if(this.la.kind == 42) {
		this.Get();
		var qualident = this.Qualident();
		packageDeclaration = qualident;
		this.Expect(41);
	}
	while(this.la.kind == 14) {
		var importIdent = this.ImportDeclaration();
		this.unit.context.mapImports(importIdent);
	}
	while(this.StartOf(1)) {
		this.TypeDeclaration();
	}
	if(packageDeclaration.join(".") != this.unit.packageDeclaration.join(".")) this.error("invalid package declaration (expecting \"" + this.unit.packageDeclaration.join(".") + "\")");
	if(this.la.kind != xpde.parser.Parser._EOF) this.error("'class' or 'interface' expected");
	$s.pop();
}
xpde.parser.Parser.prototype.ConditionalExpr = function(conditional) {
	$s.push("xpde.parser.Parser::ConditionalExpr");
	var $spos = $s.length;
	var expression = null;
	this.Expect(72);
	var thenExpression = this.Expression0();
	this.Expect(26);
	var elseExpression = this.Expression1();
	expression = xpde.parser.Expression.EConditional(conditional,thenExpression,elseExpression);
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ConstantDeclarator = function() {
	$s.push("xpde.parser.Parser::ConstantDeclarator");
	var $spos = $s.length;
	this.Expect(1);
	this.ConstantDeclaratorRest();
	$s.pop();
}
xpde.parser.Parser.prototype.ConstantDeclaratorRest = function() {
	$s.push("xpde.parser.Parser::ConstantDeclaratorRest");
	var $spos = $s.length;
	var bCount = this.BracketsOpt();
	this.Expect(52);
	var expression = this.VariableInitializer();
	$s.pop();
}
xpde.parser.Parser.prototype.ConstantDeclaratorsRest = function() {
	$s.push("xpde.parser.Parser::ConstantDeclaratorsRest");
	var $spos = $s.length;
	this.ConstantDeclaratorRest();
	while(this.la.kind == 27) {
		this.Get();
		this.ConstantDeclarator();
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ConstructorDeclaratorRest = function(methodContext) {
	$s.push("xpde.parser.Parser::ConstructorDeclaratorRest");
	var $spos = $s.length;
	this.checkModifierPermission(methodContext.modifiers,xpde.parser.ModifierSet.constructors);
	var arg = this.FormalParameters();
	methodContext.parameters = arg;
	if(this.la.kind == 55) {
		this.Get();
		var arg1 = this.QualidentList();
		methodContext.throwsList = arg1;
	}
	var body = this.Block(null);
	this.classContexts[0].defineMethod(methodContext);
	$s.pop();
}
xpde.parser.Parser.prototype.Creator = function() {
	$s.push("xpde.parser.Parser::Creator");
	var $spos = $s.length;
	var expression = null;
	if(this.StartOf(12)) {
		var type = this.BasicType();
		var arg = this.ArrayCreatorRest(xpde.DataType.DTPrimitive(type));
		expression = arg;
	}
	else if(this.la.kind == 1) {
		var qualifier = this.Qualident();
		if(this.la.kind == 32) {
			var arg = this.ArrayCreatorRest(xpde.DataType.DTReference(qualifier));
			expression = arg;
		}
		else if(this.la.kind == 33) {
			var arg = this.ClassCreatorRest(qualifier);
			expression = arg;
		}
		else this.SynErr(138);
	}
	else this.SynErr(139);
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expect = function(n) {
	$s.push("xpde.parser.Parser::Expect");
	var $spos = $s.length;
	if(this.la.kind == n) this.Get();
	else {
		this.SynErr(n);
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ExpectWeak = function(n,follow) {
	$s.push("xpde.parser.Parser::ExpectWeak");
	var $spos = $s.length;
	if(this.la.kind == n) this.Get();
	else {
		this.SynErr(n);
		while(!this.StartOf(follow)) this.Get();
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expression0 = function() {
	$s.push("xpde.parser.Parser::Expression0");
	var $spos = $s.length;
	var expression = null;
	var expression1 = this.Expression1();
	while(this.StartOf(15)) {
		var operator = this.AssignmentOperator();
		var value = this.Expression1();
		if(operator != null) value = xpde.parser.Expression.EInfixOperation(operator,expression1,value);
		var $e = (expression1);
		switch( $e[1] ) {
		case 4:
		var identifier = $e[2];
		{
			expression1 = xpde.parser.Expression.ELocalAssignment(identifier,value);
		}break;
		case 5:
		var base = $e[3], identifier = $e[2];
		{
			expression1 = xpde.parser.Expression.EAssignment(identifier,base,value);
		}break;
		case 3:
		var base = $e[3], index = $e[2];
		{
			expression1 = xpde.parser.Expression.EArrayAssignment(index,base,value);
		}break;
		case 28:
		var lexpression = $e[2];
		{
			var $e = (lexpression);
			switch( $e[1] ) {
			case 0:
			var identifier = $e[2];
			{
				expression1 = xpde.parser.Expression.ELexExpression(xpde.parser.LexicalExpression.LAssignment(identifier,value));
			}break;
			default:{
				this.error("invalid assignment left-hand side");
			}break;
			}
		}break;
		default:{
			this.error("invalid assignment left-hand side");
		}break;
		}
	}
	{
		$s.pop();
		return expression1;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expression1 = function() {
	$s.push("xpde.parser.Parser::Expression1");
	var $spos = $s.length;
	var expression = null;
	var expression1 = this.Expression2();
	if(this.la.kind == 72) {
		var rest = this.ConditionalExpr(expression1);
		expression1 = rest;
	}
	{
		$s.pop();
		return expression1;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expression2 = function() {
	$s.push("xpde.parser.Parser::Expression2");
	var $spos = $s.length;
	var expression = null;
	var expression1 = this.Expression3();
	if(this.StartOf(22)) {
		var rest = this.Expression2Rest(expression1);
		expression1 = rest;
	}
	{
		$s.pop();
		return expression1;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expression2Rest = function(operand) {
	$s.push("xpde.parser.Parser::Expression2Rest");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Expression3 = function() {
	$s.push("xpde.parser.Parser::Expression3");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ForInit = function() {
	$s.push("xpde.parser.Parser::ForInit");
	var $spos = $s.length;
	if(this.isLocalVarDecl(true)) {
		this.LocalVariableDeclaration();
	}
	else if(this.StartOf(13)) {
		var statement = this.StatementExpression();
		this.blockContexts[0].pushStatement(statement);
		var statements = this.MoreStatementExpressions();
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				this.blockContexts[0].pushStatement(statement1);
			}
		}
	}
	else this.SynErr(125);
	$s.pop();
}
xpde.parser.Parser.prototype.ForUpdate = function() {
	$s.push("xpde.parser.Parser::ForUpdate");
	var $spos = $s.length;
	var statements = null;
	var statement = this.StatementExpression();
	statements = [statement];
	var arg = this.MoreStatementExpressions();
	statements = statements.concat(arg);
	{
		$s.pop();
		return statements;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.FormalParameter0 = function() {
	$s.push("xpde.parser.Parser::FormalParameter0");
	var $spos = $s.length;
	var parameter = null;
	var modifiers = new xpde.parser.EnumSet();
	if(this.la.kind == 12) {
		this.Get();
		modifiers.add(xpde.Modifier.MFinal);
	}
	var type = this.Type();
	this.Expect(1);
	var identifier = this.t.val;
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	parameter = { identifier : identifier, type : type, modifiers : modifiers}
	{
		$s.pop();
		return parameter;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.FormalParameters = function() {
	$s.push("xpde.parser.Parser::FormalParameters");
	var $spos = $s.length;
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
	{
		$s.pop();
		return parameters;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Get = function() {
	$s.push("xpde.parser.Parser::Get");
	var $spos = $s.length;
	while(true) {
		this.t = this.la;
		this.la = this.scanner.Scan();
		if(this.la.kind <= xpde.parser.Parser.maxT) {
			++this.errDist;
			break;
		}
		this.la = this.t;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.IdentifierSuffix = function(identifier,base) {
	$s.push("xpde.parser.Parser::IdentifierSuffix");
	var $spos = $s.length;
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
		expression = (base == null?xpde.parser.Expression.ELexExpression(xpde.parser.LexicalExpression.LCall(identifier,arguments)):xpde.parser.Expression.ECall(identifier,base,arguments));
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
			var dummy = this.ArgumentsOpt(null,null);
		}
		else this.SynErr(140);
	}
	else this.SynErr(141);
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ImportDeclaration = function() {
	$s.push("xpde.parser.Parser::ImportDeclaration");
	var $spos = $s.length;
	var importIdent = null;
	this.Expect(14);
	this.Expect(1);
	importIdent = [this.t.val];
	var arg = this.QualifiedImport();
	this.Expect(41);
	importIdent = importIdent.concat(arg);
	{
		$s.pop();
		return importIdent;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Increment = function() {
	$s.push("xpde.parser.Parser::Increment");
	var $spos = $s.length;
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
	{
		$s.pop();
		return type;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Infixop = function() {
	$s.push("xpde.parser.Parser::Infixop");
	var $spos = $s.length;
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
	{
		$s.pop();
		return operator;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.InnerCreator = function() {
	$s.push("xpde.parser.Parser::InnerCreator");
	var $spos = $s.length;
	var qualifier = [];
	this.Expect(1);
	var expression = this.ClassCreatorRest(qualifier);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceBody = function() {
	$s.push("xpde.parser.Parser::InterfaceBody");
	var $spos = $s.length;
	this.Expect(31);
	while(this.StartOf(19)) {
		this.InterfaceBodyDeclaration();
	}
	this.Expect(37);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceBodyDeclaration = function() {
	$s.push("xpde.parser.Parser::InterfaceBodyDeclaration");
	var $spos = $s.length;
	var modifiers = new xpde.parser.EnumSet();
	if(this.la.kind == 41) {
		this.Get();
	}
	else if(this.StartOf(20)) {
		while(this.StartOf(9)) {
			this.Modifier0(modifiers);
		}
		this.InterfaceMemberDecl(modifiers);
	}
	else this.SynErr(120);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceDeclaration = function(modifiers) {
	$s.push("xpde.parser.Parser::InterfaceDeclaration");
	var $spos = $s.length;
	this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.interfaces);
	this.Expect(56);
	this.Expect(1);
	if(this.la.kind == 53) {
		this.Get();
		var extend = this.TypeList();
	}
	this.InterfaceBody();
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceMemberDecl = function(modifiers) {
	$s.push("xpde.parser.Parser::InterfaceMemberDecl");
	var $spos = $s.length;
	if(this.StartOf(16)) {
		this.InterfaceMethodOrFieldDecl(modifiers);
	}
	else if(this.la.kind == 25) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.interfaces);
		this.Get();
		this.Expect(1);
		this.VoidInterfaceMethodDeclaratorRest();
	}
	else if(this.la.kind == 9) {
		this.ClassDeclaration(modifiers);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(modifiers);
	}
	else this.SynErr(121);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceMethodDeclaratorRest = function() {
	$s.push("xpde.parser.Parser::InterfaceMethodDeclaratorRest");
	var $spos = $s.length;
	var parameters = this.FormalParameters();
	var bCount = this.BracketsOpt();
	if(this.la.kind == 55) {
		this.Get();
		var arg = this.QualidentList();
	}
	this.Expect(41);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceMethodOrFieldDecl = function(modifiers) {
	$s.push("xpde.parser.Parser::InterfaceMethodOrFieldDecl");
	var $spos = $s.length;
	var type = this.Type();
	this.Expect(1);
	this.InterfaceMethodOrFieldRest(modifiers);
	$s.pop();
}
xpde.parser.Parser.prototype.InterfaceMethodOrFieldRest = function(modifiers) {
	$s.push("xpde.parser.Parser::InterfaceMethodOrFieldRest");
	var $spos = $s.length;
	if(this.la.kind == 32 || this.la.kind == 52) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.constants);
		this.ConstantDeclaratorsRest();
		this.Expect(41);
	}
	else if(this.la.kind == 33) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.interfaces);
		this.InterfaceMethodDeclaratorRest();
	}
	else this.SynErr(122);
	$s.pop();
}
xpde.parser.Parser.prototype.Literal = function() {
	$s.push("xpde.parser.Parser::Literal");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.LocalVariableDeclaration = function() {
	$s.push("xpde.parser.Parser::LocalVariableDeclaration");
	var $spos = $s.length;
	var modifiers = new xpde.parser.EnumSet();
	if(this.la.kind == 12) {
		this.Get();
		modifiers.add(xpde.Modifier.MFinal);
	}
	var type = this.Type();
	this.VariableDeclarators(this.blockContexts[0],modifiers,type);
	$s.pop();
}
xpde.parser.Parser.prototype.MemberDecl = function(modifiers) {
	$s.push("xpde.parser.Parser::MemberDecl");
	var $spos = $s.length;
	if(this.identAndLPar()) {
		this.Expect(1);
		var identifier = this.t.val;
		if(identifier != this.classContexts[0].identifier) this.error("invalid function declaration");
		this.ConstructorDeclaratorRest(new xpde.parser.MethodContext(modifiers,null,identifier));
	}
	else if(this.StartOf(16)) {
		this.MethodOrFieldDecl(modifiers);
	}
	else if(this.la.kind == 25) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.methods);
		this.Get();
		this.Expect(1);
		var identifier = this.t.val;
		this.VoidMethodDeclaratorRest(new xpde.parser.MethodContext(modifiers,null,identifier));
	}
	else if(this.la.kind == 9) {
		this.ClassDeclaration(modifiers);
	}
	else if(this.la.kind == 56) {
		this.InterfaceDeclaration(modifiers);
	}
	else this.SynErr(116);
	$s.pop();
}
xpde.parser.Parser.prototype.MethodDeclaratorRest = function(methodContext) {
	$s.push("xpde.parser.Parser::MethodDeclaratorRest");
	var $spos = $s.length;
	var arg = this.FormalParameters();
	methodContext.parameters = arg;
	var bCount = this.BracketsOpt();
	if(this.la.kind == 55) {
		this.Get();
		var arg1 = this.QualidentList();
		methodContext.throwsList = arg1;
	}
	if(this.la.kind == 31) {
		var block = this.Block(null);
		methodContext.body = block;
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(119);
	this.classContexts[0].defineMethod(methodContext);
	$s.pop();
}
xpde.parser.Parser.prototype.MethodOrFieldDecl = function(modifiers) {
	$s.push("xpde.parser.Parser::MethodOrFieldDecl");
	var $spos = $s.length;
	var type = this.Type();
	this.Expect(1);
	var identifier = this.t.val;
	this.MethodOrFieldRest(modifiers,identifier,type);
	$s.pop();
}
xpde.parser.Parser.prototype.MethodOrFieldRest = function(modifiers,identifier,type) {
	$s.push("xpde.parser.Parser::MethodOrFieldRest");
	var $spos = $s.length;
	if(this.StartOf(17)) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.fields);
		this.VariableDeclaratorsRest(this.classContexts[0],modifiers,type,identifier);
		this.Expect(41);
	}
	else if(this.la.kind == 33) {
		this.checkModifierPermission(modifiers,xpde.parser.ModifierSet.methods);
		this.MethodDeclaratorRest(new xpde.parser.MethodContext(modifiers,type,identifier));
	}
	else this.SynErr(118);
	$s.pop();
}
xpde.parser.Parser.prototype.Modifier0 = function(modifiers) {
	$s.push("xpde.parser.Parser::Modifier0");
	var $spos = $s.length;
	if(this.la.kind == 21) {
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MStatic);
	}
	else if(this.StartOf(8)) {
		this.Modifier1(modifiers);
	}
	else this.SynErr(111);
	$s.pop();
}
xpde.parser.Parser.prototype.Modifier1 = function(modifiers) {
	$s.push("xpde.parser.Parser::Modifier1");
	var $spos = $s.length;
	switch(this.la.kind) {
	case 19:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MPublic);
	}break;
	case 44:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MProtected);
	}break;
	case 45:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MPrivate);
	}break;
	case 46:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MAbstract);
	}break;
	case 12:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MFinal);
	}break;
	case 48:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MNative);
	}break;
	case 49:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MSynchronized);
	}break;
	case 50:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MTransient);
	}break;
	case 51:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MVolatile);
	}break;
	case 47:{
		this.Get();
		this.addModifier(modifiers,xpde.Modifier.MStrictfp);
	}break;
	default:{
		this.SynErr(112);
	}break;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.MoreStatementExpressions = function() {
	$s.push("xpde.parser.Parser::MoreStatementExpressions");
	var $spos = $s.length;
	var statements = null;
	statements = [];
	while(this.la.kind == 27) {
		this.Get();
		var statement = this.StatementExpression();
		statements.push(statement);
	}
	{
		$s.pop();
		return statements;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.ParExpression = function() {
	$s.push("xpde.parser.Parser::ParExpression");
	var $spos = $s.length;
	var expression = null;
	this.Expect(33);
	var expression1 = this.Expression0();
	this.Expect(39);
	{
		$s.pop();
		return expression1;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Parse = function() {
	$s.push("xpde.parser.Parser::Parse");
	var $spos = $s.length;
	this.la = new xpde.parser.Token();
	this.la.val = "";
	this.Get();
	this.PdeProgram();
	this.Expect(0);
	(new xpde.parser.LexicalResolver()).resolve(this.unit);
	$s.pop();
}
xpde.parser.Parser.prototype.PdeProgram = function() {
	$s.push("xpde.parser.Parser::PdeProgram");
	var $spos = $s.length;
	while(this.la.kind == 14) {
		var importIdent = this.ImportDeclaration();
		this.unit.context.mapImports(importIdent);
	}
	if(this.isJavaProgram()) {
		this.TypeDeclaration();
		while(this.StartOf(1)) {
			this.TypeDeclaration();
		}
	}
	else if(this.StartOf(2)) {
		this.unit.context.mapImports(["xpde","core","*"]);
		this.unit.context.mapImports(["xpde","xml","*"]);
		this.classContexts.unshift(new xpde.parser.ClassContext(new xpde.parser.EnumSet([xpde.Modifier.MPublic]),this.unit.packageDeclaration.slice(-1)[0]));
		this.classContexts[0].extend = xpde.DataType.DTReference(["xpde","core","PApplet"]);
		while(this.isLocalVarDecl(false)) {
			this.LocalVariableDeclaration();
			this.Expect(41);
		}
		if(this.isActiveProgram()) {
			this.ClassBodyDeclaration();
			while(this.StartOf(3)) {
				this.ClassBodyDeclaration();
			}
		}
		else if(this.StartOf(4)) {
			this.blockContexts.unshift(new xpde.parser.BlockContext());
			this.BlockStatement();
			while(this.StartOf(4)) {
				this.BlockStatement();
			}
			var methodContext = new xpde.parser.MethodContext(new xpde.parser.EnumSet(),null,"setup");
			methodContext.body = this.blockContexts.shift().getBlockStatement();
			this.classContexts[0].defineMethod(methodContext);
		}
		else this.SynErr(102);
	}
	else this.SynErr(103);
	this.unit.context.defineClass(this.classContexts.shift());
	if(this.la.kind != xpde.parser.Parser._EOF) this.error("unexpected script termination");
	$s.pop();
}
xpde.parser.Parser.prototype.PrefixOp = function() {
	$s.push("xpde.parser.Parser::PrefixOp");
	var $spos = $s.length;
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
	{
		$s.pop();
		return operator;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Primary = function() {
	$s.push("xpde.parser.Parser::Primary");
	var $spos = $s.length;
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
		expression = xpde.parser.Expression.EThisReference;
		if(this.la.kind == 33) {
			var arguments = this.Arguments();
			expression = xpde.parser.Expression.EThisCall(arguments);
		}
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
			base = (base != null?xpde.parser.Expression.EReference(identifier,base):(this.blockContexts[0].isFieldDefined(identifier)?xpde.parser.Expression.ELocalReference(identifier):xpde.parser.Expression.ELexExpression(xpde.parser.LexicalExpression.LReference(identifier))));
			identifier = this.t.val;
		}
		expression = (base != null?xpde.parser.Expression.EReference(identifier,base):(this.blockContexts[0].isFieldDefined(identifier)?xpde.parser.Expression.ELocalReference(identifier):xpde.parser.Expression.ELexExpression(xpde.parser.LexicalExpression.LReference(identifier))));
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Qualident = function() {
	$s.push("xpde.parser.Parser::Qualident");
	var $spos = $s.length;
	var qualident = null;
	qualident = [];
	this.Expect(1);
	qualident.push(this.t.val);
	while(this.la.kind == 29) {
		this.Get();
		this.Expect(1);
		qualident.push(this.t.val);
	}
	{
		$s.pop();
		return qualident;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.QualidentList = function() {
	$s.push("xpde.parser.Parser::QualidentList");
	var $spos = $s.length;
	var list = null;
	list = [];
	var qualident = this.Qualident();
	list.push(qualident);
	while(this.la.kind == 27) {
		this.Get();
		var qualident1 = this.Qualident();
		list.push(qualident1);
	}
	{
		$s.pop();
		return list;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.QualifiedImport = function() {
	$s.push("xpde.parser.Parser::QualifiedImport");
	var $spos = $s.length;
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
	{
		$s.pop();
		return importIdent;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Selector = function(base) {
	$s.push("xpde.parser.Parser::Selector");
	var $spos = $s.length;
	var expression = null;
	if(this.la.kind == 29) {
		this.Get();
		if(this.la.kind == 1) {
			this.Get();
			var identifier = this.t.val;
			var arg = this.ArgumentsOpt(identifier,base);
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.SemErr = function(msg) {
	$s.push("xpde.parser.Parser::SemErr");
	var $spos = $s.length;
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SemErr(this.t.line,this.t.col,msg);
	this.errDist = 0;
	$s.pop();
}
xpde.parser.Parser.prototype.StartOf = function(s) {
	$s.push("xpde.parser.Parser::StartOf");
	var $spos = $s.length;
	{
		var $tmp = xpde.parser.Parser.set[s][this.la.kind];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.Statement0 = function() {
	$s.push("xpde.parser.Parser::Statement0");
	var $spos = $s.length;
	var statement = null;
	if(this.la.kind == 31) {
		var block = this.Block(this.blockContexts[0]);
		statement = block;
	}
	else if(this.la.kind == 57) {
		this.Get();
		var condition = this.ParExpression();
		var thenStatement = this.Statement0();
		var elseStatement = null;
		if(this.la.kind == 58) {
			this.Get();
			var body = this.Statement0();
			elseStatement = body;
		}
		statement = xpde.parser.Statement.SConditional(condition,thenStatement,elseStatement);
	}
	else if(this.la.kind == 59) {
		this.Get();
		this.Expect(33);
		this.blockContexts.unshift(new xpde.parser.BlockContext(this.blockContexts[0]));
		if(this.StartOf(21)) {
			this.ForInit();
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
		var arg = this.Statement0();
		body = [arg].concat(body);
		this.blockContexts[0].pushStatement(xpde.parser.Statement.SLoop(conditional,xpde.parser.Statement.SBlock(new Hash(),body),false));
		statement = this.blockContexts.shift().getBlockStatement();
	}
	else if(this.la.kind == 60) {
		this.Get();
		var condition = this.ParExpression();
		var body = this.Statement0();
		statement = xpde.parser.Statement.SLoop(condition,body,false);
	}
	else if(this.la.kind == 61) {
		this.Get();
		var body = this.Statement0();
		this.Expect(60);
		var condition = this.ParExpression();
		this.Expect(41);
		statement = xpde.parser.Statement.SLoop(condition,body,true);
	}
	else if(this.la.kind == 62) {
		this.Get();
		var body = this.Block(this.blockContexts[0]);
		var catches = [], finallyBody = null;
		if(this.la.kind == 69) {
			var _catches = this.Catches();
			catches = _catches;
			if(this.la.kind == 63) {
				this.Get();
				var block = this.Block(this.blockContexts[0]);
				finallyBody = block;
			}
		}
		else if(this.la.kind == 63) {
			this.Get();
			var block = this.Block(this.blockContexts[0]);
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
		var block = this.Block(this.blockContexts[0]);
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
		var body = this.Statement0();
		statement = xpde.parser.Statement.SLabel(label,body);
	}
	else if(this.StartOf(13)) {
		var arg = this.StatementExpression();
		this.Expect(41);
		statement = arg;
	}
	else this.SynErr(124);
	{
		$s.pop();
		return statement;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.StatementExpression = function() {
	$s.push("xpde.parser.Parser::StatementExpression");
	var $spos = $s.length;
	var statement = null;
	var expression = this.Expression0();
	this.checkExprStat(expression);
	statement = xpde.parser.Statement.SExpression(expression);
	{
		$s.pop();
		return statement;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.SuperSuffix = function() {
	$s.push("xpde.parser.Parser::SuperSuffix");
	var $spos = $s.length;
	var expression = null;
	if(this.la.kind == 33) {
		var arguments = this.Arguments();
		expression = xpde.parser.Expression.ESuperCall(arguments);
	}
	else if(this.la.kind == 29) {
		this.Get();
		this.Expect(1);
		var identifier = this.t.val;
		var arg = this.ArgumentsOpt(identifier,xpde.parser.Expression.ESuperReference);
		expression = arg;
	}
	else this.SynErr(136);
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.SwitchBlockStatementGroup = function() {
	$s.push("xpde.parser.Parser::SwitchBlockStatementGroup");
	var $spos = $s.length;
	this.SwitchLabel();
	while(this.StartOf(4)) {
		this.BlockStatement();
	}
	$s.pop();
}
xpde.parser.Parser.prototype.SwitchBlockStatementGroups = function() {
	$s.push("xpde.parser.Parser::SwitchBlockStatementGroups");
	var $spos = $s.length;
	while(this.la.kind == 70 || this.la.kind == 71) {
		this.SwitchBlockStatementGroup();
	}
	$s.pop();
}
xpde.parser.Parser.prototype.SwitchLabel = function() {
	$s.push("xpde.parser.Parser::SwitchLabel");
	var $spos = $s.length;
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
	$s.pop();
}
xpde.parser.Parser.prototype.SynErr = function(n) {
	$s.push("xpde.parser.Parser::SynErr");
	var $spos = $s.length;
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SynErr(this.la.line,this.la.col,n);
	this.errDist = 0;
	$s.pop();
}
xpde.parser.Parser.prototype.Type = function() {
	$s.push("xpde.parser.Parser::Type");
	var $spos = $s.length;
	var type = null;
	if(this.la.kind == 1) {
		var qualident = this.Qualident();
		type = xpde.DataType.DTLexReference(qualident);
	}
	else if(this.StartOf(12)) {
		var primitive = this.BasicType();
		type = xpde.DataType.DTPrimitive(primitive);
	}
	else this.SynErr(113);
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	{
		$s.pop();
		return type;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.TypeDeclaration = function() {
	$s.push("xpde.parser.Parser::TypeDeclaration");
	var $spos = $s.length;
	if(this.StartOf(5)) {
		this.ClassOrInterfaceDeclaration();
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(104);
	$s.pop();
}
xpde.parser.Parser.prototype.TypeList = function() {
	$s.push("xpde.parser.Parser::TypeList");
	var $spos = $s.length;
	var list = null;
	list = [];
	var type = this.Type();
	list.push(type);
	while(this.la.kind == 27) {
		this.Get();
		var type1 = this.Type();
		list.push(type1);
	}
	{
		$s.pop();
		return list;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.VariableDeclarator = function(context,modifiers,type) {
	$s.push("xpde.parser.Parser::VariableDeclarator");
	var $spos = $s.length;
	this.Expect(1);
	var identifier = this.t.val;
	this.VariableDeclaratorRest(context,modifiers,type,identifier);
	$s.pop();
}
xpde.parser.Parser.prototype.VariableDeclaratorRest = function(context,modifiers,type,identifier) {
	$s.push("xpde.parser.Parser::VariableDeclaratorRest");
	var $spos = $s.length;
	var bCount = this.BracketsOpt();
	type = this.compoundBrackets(type,bCount);
	var init = null;
	if(this.la.kind == 52) {
		this.Get();
		var expression = this.VariableInitializer();
		init = expression;
	}
	context.defineField({ identifier : identifier, type : type, modifiers : modifiers},init);
	$s.pop();
}
xpde.parser.Parser.prototype.VariableDeclarators = function(context,modifiers,type) {
	$s.push("xpde.parser.Parser::VariableDeclarators");
	var $spos = $s.length;
	this.VariableDeclarator(context,modifiers,type);
	while(this.la.kind == 27) {
		this.Get();
		this.VariableDeclarator(context,modifiers,type);
	}
	$s.pop();
}
xpde.parser.Parser.prototype.VariableDeclaratorsRest = function(context,modifiers,type,identifier) {
	$s.push("xpde.parser.Parser::VariableDeclaratorsRest");
	var $spos = $s.length;
	this.VariableDeclaratorRest(context,modifiers,type,identifier);
	while(this.la.kind == 27) {
		this.Get();
		this.VariableDeclarator(context,modifiers,type);
	}
	$s.pop();
}
xpde.parser.Parser.prototype.VariableInitializer = function() {
	$s.push("xpde.parser.Parser::VariableInitializer");
	var $spos = $s.length;
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
	{
		$s.pop();
		return expression;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.VoidInterfaceMethodDeclaratorRest = function() {
	$s.push("xpde.parser.Parser::VoidInterfaceMethodDeclaratorRest");
	var $spos = $s.length;
	var parameters = this.FormalParameters();
	if(this.la.kind == 55) {
		this.Get();
		var arg = this.QualidentList();
	}
	this.Expect(41);
	$s.pop();
}
xpde.parser.Parser.prototype.VoidMethodDeclaratorRest = function(methodContext) {
	$s.push("xpde.parser.Parser::VoidMethodDeclaratorRest");
	var $spos = $s.length;
	var arg = this.FormalParameters();
	methodContext.parameters = arg;
	if(this.la.kind == 55) {
		this.Get();
		var arg1 = this.QualidentList();
		methodContext.throwsList = arg1;
	}
	if(this.la.kind == 31) {
		var block = this.Block(null);
		methodContext.body = block;
	}
	else if(this.la.kind == 41) {
		this.Get();
	}
	else this.SynErr(117);
	this.classContexts[0].defineMethod(methodContext);
	$s.pop();
}
xpde.parser.Parser.prototype.WeakSeparator = function(n,syFol,repFol) {
	$s.push("xpde.parser.Parser::WeakSeparator");
	var $spos = $s.length;
	var kind = this.la.kind;
	if(kind == n) {
		this.Get();
		{
			$s.pop();
			return true;
		}
	}
	else if(this.StartOf(repFol)) {
		$s.pop();
		return false;
	}
	else {
		this.SynErr(n);
		while(!(xpde.parser.Parser.set[syFol][kind] || xpde.parser.Parser.set[repFol][kind] || xpde.parser.Parser.set[0][kind])) {
			this.Get();
			kind = this.la.kind;
		}
		{
			var $tmp = this.StartOf(syFol);
			$s.pop();
			return $tmp;
		}
	}
	$s.pop();
}
xpde.parser.Parser.prototype.addModifier = function(set,modifier) {
	$s.push("xpde.parser.Parser::addModifier");
	var $spos = $s.length;
	if(set.contains(modifier)) this.error("repeated modifier " + modifier);
	else set.add(modifier);
	$s.pop();
}
xpde.parser.Parser.prototype.blockContexts = null;
xpde.parser.Parser.prototype.checkExprStat = function(expression) {
	$s.push("xpde.parser.Parser::checkExprStat");
	var $spos = $s.length;
	var $e = (expression);
	switch( $e[1] ) {
	case 1:
	{
		null;
	}break;
	case 9:
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
	case 12:
	{
		null;
	}break;
	case 13:
	{
		null;
	}break;
	case 14:
	{
		null;
	}break;
	case 19:
	{
		null;
	}break;
	case 20:
	{
		null;
	}break;
	case 28:
	var expression1 = $e[2];
	{
		var $e = (expression1);
		switch( $e[1] ) {
		case 1:
		{
			null;
		}break;
		case 2:
		{
			null;
		}break;
		default:{
			this.error("not a statement" + " (" + expression1 + ")");
		}break;
		}
	}break;
	default:{
		this.error("not a statement" + " (" + expression + ")");
	}break;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.checkModifierAccess = function(set) {
	$s.push("xpde.parser.Parser::checkModifierAccess");
	var $spos = $s.length;
	var access = 0;
	if(set.contains(xpde.Modifier.MPublic)) access++;
	if(set.contains(xpde.Modifier.MPrivate)) access++;
	if(set.contains(xpde.Modifier.MProtected)) access++;
	if(access > 1) this.error("illegal combination of modifiers: " + set);
	$s.pop();
}
xpde.parser.Parser.prototype.checkModifierPermission = function(set,permission) {
	$s.push("xpde.parser.Parser::checkModifierPermission");
	var $spos = $s.length;
	{ var $it12 = set.iterator();
	while( $it12.hasNext() ) { var modifier = $it12.next();
	if(!permission.contains(modifier)) this.error("modifier(s) " + set + "not allowed here");
	else this.checkModifierAccess(set);
	}}
	$s.pop();
}
xpde.parser.Parser.prototype.classContexts = null;
xpde.parser.Parser.prototype.commaAndNoRBrace = function() {
	$s.push("xpde.parser.Parser::commaAndNoRBrace");
	var $spos = $s.length;
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._comma && this.peek(1).kind != xpde.parser.Parser._rbrace);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.compoundBrackets = function(type,bCount) {
	$s.push("xpde.parser.Parser::compoundBrackets");
	var $spos = $s.length;
	if(bCount == 0) {
		$s.pop();
		return type;
	}
	var $e = (type);
	switch( $e[1] ) {
	case 2:
	var dimensions = $e[3], type1 = $e[2];
	{
		{
			var $tmp = xpde.DataType.DTArray(type1,dimensions + bCount);
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		{
			var $tmp = xpde.DataType.DTArray(type,bCount);
			$s.pop();
			return $tmp;
		}
	}break;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.dotAndIdent = function() {
	$s.push("xpde.parser.Parser::dotAndIdent");
	var $spos = $s.length;
	{
		var $tmp = this.la.kind == xpde.parser.Parser._dot && this.peek(1).kind == xpde.parser.Parser._ident;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.emptyBracket = function() {
	$s.push("xpde.parser.Parser::emptyBracket");
	var $spos = $s.length;
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._lbrack && this.peek(1).kind == xpde.parser.Parser._rbrack);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.errDist = null;
xpde.parser.Parser.prototype.error = function(s) {
	$s.push("xpde.parser.Parser::error");
	var $spos = $s.length;
	if(this.errDist >= xpde.parser.Parser.minErrDist) this.errors.SemErr(this.la.line,this.la.col,s);
	this.errDist = 0;
	$s.pop();
}
xpde.parser.Parser.prototype.errors = null;
xpde.parser.Parser.prototype.guessTypeCast = function() {
	$s.push("xpde.parser.Parser::guessTypeCast");
	var $spos = $s.length;
	this.scanner.ResetPeek();
	var pt = this.scanner.Peek();
	pt = this.rdQualident(pt);
	if(pt != null) {
		pt = this.skipDims(pt);
		if(pt != null) {
			var pt1 = this.scanner.Peek();
			{
				var $tmp = pt.kind == xpde.parser.Parser._rpar && xpde.parser.Parser.castFollower.bitset[pt1.kind];
				$s.pop();
				return $tmp;
			}
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.identAndLPar = function() {
	$s.push("xpde.parser.Parser::identAndLPar");
	var $spos = $s.length;
	{
		var $tmp = this.la.kind == xpde.parser.Parser._ident && this.peek(1).kind == xpde.parser.Parser._lpar;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isActiveProgram = function() {
	$s.push("xpde.parser.Parser::isActiveProgram");
	var $spos = $s.length;
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._void && this.peek(1).kind == xpde.parser.Parser._ident && this.peek(2).kind == xpde.parser.Parser._lpar);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isIdentSuffix = function() {
	$s.push("xpde.parser.Parser::isIdentSuffix");
	var $spos = $s.length;
	if(this.la.kind == xpde.parser.Parser._dot) {
		this.scanner.ResetPeek();
		var pt = this.scanner.Peek();
		if(pt.kind == xpde.parser.Parser._super) {
			var $tmp = this.scanner.Peek().kind == xpde.parser.Parser._dot;
			$s.pop();
			return $tmp;
		}
		{
			var $tmp = (pt.kind == xpde.parser.Parser._class || pt.kind == xpde.parser.Parser._this);
			$s.pop();
			return $tmp;
		}
	}
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._lpar || this.emptyBracket());
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isJavaProgram = function() {
	$s.push("xpde.parser.Parser::isJavaProgram");
	var $spos = $s.length;
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._public && this.peek(1).kind == xpde.parser.Parser._class);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isLabel = function() {
	$s.push("xpde.parser.Parser::isLabel");
	var $spos = $s.length;
	{
		var $tmp = this.la.kind == xpde.parser.Parser._ident && this.peek(1).kind == xpde.parser.Parser._colon;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isLocalVarDecl = function(finalIsSuccess) {
	$s.push("xpde.parser.Parser::isLocalVarDecl");
	var $spos = $s.length;
	var pt = this.la;
	this.scanner.ResetPeek();
	if(this.la.kind == xpde.parser.Parser._final) if(finalIsSuccess) {
		$s.pop();
		return true;
	}
	else pt = this.scanner.Peek();
	if(xpde.parser.Parser.typeKW.bitset[pt.kind]) pt = this.scanner.Peek();
	else pt = this.rdQualident(pt);
	if(pt != null) {
		pt = this.skipDims(pt);
		if(pt != null) {
			{
				var $tmp = pt.kind == xpde.parser.Parser._ident;
				$s.pop();
				return $tmp;
			}
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isSimpleTypeCast = function() {
	$s.push("xpde.parser.Parser::isSimpleTypeCast");
	var $spos = $s.length;
	this.scanner.ResetPeek();
	var pt1 = this.scanner.Peek();
	if(xpde.parser.Parser.typeKW.bitset[pt1.kind]) {
		var pt = this.scanner.Peek();
		pt = this.skipDims(pt);
		if(pt != null) {
			{
				var $tmp = pt.kind == xpde.parser.Parser._rpar;
				$s.pop();
				return $tmp;
			}
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.isTypeCast = function() {
	$s.push("xpde.parser.Parser::isTypeCast");
	var $spos = $s.length;
	if(this.la.kind != xpde.parser.Parser._lpar) {
		$s.pop();
		return false;
	}
	if(this.isSimpleTypeCast()) {
		$s.pop();
		return true;
	}
	{
		var $tmp = this.guessTypeCast();
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.la = null;
xpde.parser.Parser.prototype.nonEmptyBracket = function() {
	$s.push("xpde.parser.Parser::nonEmptyBracket");
	var $spos = $s.length;
	{
		var $tmp = (this.la.kind == xpde.parser.Parser._lbrack && this.peek(1).kind != xpde.parser.Parser._rbrack);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.peek = function(n) {
	$s.push("xpde.parser.Parser::peek");
	var $spos = $s.length;
	this.scanner.ResetPeek();
	var x = this.la;
	while(n > 0) {
		x = this.scanner.Peek();
		n--;
	}
	{
		$s.pop();
		return x;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.rdQualident = function(pt) {
	$s.push("xpde.parser.Parser::rdQualident");
	var $spos = $s.length;
	var qualident = "";
	if(pt.kind == xpde.parser.Parser._ident) {
		qualident = pt.val;
		pt = this.scanner.Peek();
		while(pt.kind == xpde.parser.Parser._dot) {
			pt = this.scanner.Peek();
			if(pt.kind != xpde.parser.Parser._ident) {
				$s.pop();
				return null;
			}
			qualident += "." + pt.val;
			pt = this.scanner.Peek();
		}
		{
			$s.pop();
			return pt;
		}
	}
	else {
		$s.pop();
		return null;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.scanner = null;
xpde.parser.Parser.prototype.skipDims = function(pt) {
	$s.push("xpde.parser.Parser::skipDims");
	var $spos = $s.length;
	if(pt.kind != xpde.parser.Parser._lbrack) {
		$s.pop();
		return pt;
	}
	do {
		pt = this.scanner.Peek();
		if(pt.kind != xpde.parser.Parser._rbrack) {
			$s.pop();
			return null;
		}
		pt = this.scanner.Peek();
	} while(pt.kind == xpde.parser.Parser._lbrack);
	{
		$s.pop();
		return pt;
	}
	$s.pop();
}
xpde.parser.Parser.prototype.t = null;
xpde.parser.Parser.prototype.unit = null;
xpde.parser.Parser.prototype.__class__ = xpde.parser.Parser;
xpde.parser.Errors = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.Errors::new");
	var $spos = $s.length;
	this.count = 0;
	$s.pop();
}}
xpde.parser.Errors.__name__ = ["xpde","parser","Errors"];
xpde.parser.Errors.prototype.SemErr = function(line,col,s) {
	$s.push("xpde.parser.Errors::SemErr");
	var $spos = $s.length;
	if(line == null) this.printMsg(line,col,s);
	else haxe.Log.trace(s,{ fileName : "Parser.hx", lineNumber : 1997, className : "xpde.parser.Errors", methodName : "SemErr"});
	this.count++;
	throw new xpde.parser.FatalError(s);
	$s.pop();
}
xpde.parser.Errors.prototype.SynErr = function(line,col,n) {
	$s.push("xpde.parser.Errors::SynErr");
	var $spos = $s.length;
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
		s = "invalid TypeDeclaration";
	}break;
	case 105:{
		s = "invalid ClassBodyDeclaration";
	}break;
	case 106:{
		s = "invalid ClassBodyDeclaration";
	}break;
	case 107:{
		s = "invalid BlockStatement";
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
	$s.pop();
}
xpde.parser.Errors.prototype.Warning = function(line,col,s) {
	$s.push("xpde.parser.Errors::Warning");
	var $spos = $s.length;
	if(line == null) this.printMsg(line,col,s);
	else haxe.Log.trace(s,{ fileName : "Parser.hx", lineNumber : 2003, className : "xpde.parser.Errors", methodName : "Warning"});
	$s.pop();
}
xpde.parser.Errors.prototype.count = null;
xpde.parser.Errors.prototype.printMsg = function(line,column,msg) {
	$s.push("xpde.parser.Errors::printMsg");
	var $spos = $s.length;
	var b = xpde.parser.Errors.errMsgFormat;
	b = StringTools.replace(b,"{0}",Std.string(line));
	b = StringTools.replace(b,"{1}",Std.string(column));
	b = StringTools.replace(b,"{2}",msg);
	haxe.Log.trace(b,{ fileName : "Parser.hx", lineNumber : 1840, className : "xpde.parser.Errors", methodName : "printMsg"});
	$s.pop();
}
xpde.parser.Errors.prototype.__class__ = xpde.parser.Errors;
xpde.parser.FatalError = function(s) { if( s === $_ ) return; {
	$s.push("xpde.parser.FatalError::new");
	var $spos = $s.length;
	this.message = s;
	$s.pop();
}}
xpde.parser.FatalError.__name__ = ["xpde","parser","FatalError"];
xpde.parser.FatalError.prototype.message = null;
xpde.parser.FatalError.prototype.__class__ = xpde.parser.FatalError;
xpde.Modifier = { __ename__ : ["xpde","Modifier"], __constructs__ : ["MPublic","MPrivate","MProtected","MStatic","MFinal","MSynchronized","MVolatile","MTransient","MNative","MAbstract","MStrictfp"] }
xpde.Modifier.MAbstract = ["MAbstract",9];
xpde.Modifier.MAbstract.toString = $estr;
xpde.Modifier.MAbstract.__enum__ = xpde.Modifier;
xpde.Modifier.MFinal = ["MFinal",4];
xpde.Modifier.MFinal.toString = $estr;
xpde.Modifier.MFinal.__enum__ = xpde.Modifier;
xpde.Modifier.MNative = ["MNative",8];
xpde.Modifier.MNative.toString = $estr;
xpde.Modifier.MNative.__enum__ = xpde.Modifier;
xpde.Modifier.MPrivate = ["MPrivate",1];
xpde.Modifier.MPrivate.toString = $estr;
xpde.Modifier.MPrivate.__enum__ = xpde.Modifier;
xpde.Modifier.MProtected = ["MProtected",2];
xpde.Modifier.MProtected.toString = $estr;
xpde.Modifier.MProtected.__enum__ = xpde.Modifier;
xpde.Modifier.MPublic = ["MPublic",0];
xpde.Modifier.MPublic.toString = $estr;
xpde.Modifier.MPublic.__enum__ = xpde.Modifier;
xpde.Modifier.MStatic = ["MStatic",3];
xpde.Modifier.MStatic.toString = $estr;
xpde.Modifier.MStatic.__enum__ = xpde.Modifier;
xpde.Modifier.MStrictfp = ["MStrictfp",10];
xpde.Modifier.MStrictfp.toString = $estr;
xpde.Modifier.MStrictfp.__enum__ = xpde.Modifier;
xpde.Modifier.MSynchronized = ["MSynchronized",5];
xpde.Modifier.MSynchronized.toString = $estr;
xpde.Modifier.MSynchronized.__enum__ = xpde.Modifier;
xpde.Modifier.MTransient = ["MTransient",7];
xpde.Modifier.MTransient.toString = $estr;
xpde.Modifier.MTransient.__enum__ = xpde.Modifier;
xpde.Modifier.MVolatile = ["MVolatile",6];
xpde.Modifier.MVolatile.toString = $estr;
xpde.Modifier.MVolatile.__enum__ = xpde.Modifier;
xpde.parser.EnumSet = function(enums) { if( enums === $_ ) return; {
	$s.push("xpde.parser.EnumSet::new");
	var $spos = $s.length;
	this.set = [];
	if(enums != null) {
		var _g = 0;
		while(_g < enums.length) {
			var item = enums[_g];
			++_g;
			this.add(item);
		}
	}
	$s.pop();
}}
xpde.parser.EnumSet.__name__ = ["xpde","parser","EnumSet"];
xpde.parser.EnumSet.prototype.add = function(item) {
	$s.push("xpde.parser.EnumSet::add");
	var $spos = $s.length;
	if(!this.contains(item)) this.set.push(item);
	$s.pop();
}
xpde.parser.EnumSet.prototype.contains = function(itemA) {
	$s.push("xpde.parser.EnumSet::contains");
	var $spos = $s.length;
	{
		var _g = 0, _g1 = this.set;
		while(_g < _g1.length) {
			var itemB = _g1[_g];
			++_g;
			if(Type.enumEq(itemA,itemB)) {
				$s.pop();
				return true;
			}
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
xpde.parser.EnumSet.prototype.iterator = function() {
	$s.push("xpde.parser.EnumSet::iterator");
	var $spos = $s.length;
	{
		var $tmp = this.set.iterator();
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.EnumSet.prototype.set = null;
xpde.parser.EnumSet.prototype.toString = function() {
	$s.push("xpde.parser.EnumSet::toString");
	var $spos = $s.length;
	{
		var $tmp = this.set.join(" ");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.EnumSet.prototype.__class__ = xpde.parser.EnumSet;
xpde.parser.ModifierSet = function() { }
xpde.parser.ModifierSet.__name__ = ["xpde","parser","ModifierSet"];
xpde.parser.ModifierSet.prototype.__class__ = xpde.parser.ModifierSet;
xpde.parser.OperationBuilder = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.OperationBuilder::new");
	var $spos = $s.length;
	this.operators = [];
	this.operands = [];
	$s.pop();
}}
xpde.parser.OperationBuilder.__name__ = ["xpde","parser","OperationBuilder"];
xpde.parser.OperationBuilder.prototype.lookupOperatorPrecedence = function(operator) {
	$s.push("xpde.parser.OperationBuilder::lookupOperatorPrecedence");
	var $spos = $s.length;
	{
		var $tmp = function($this) {
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
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.OperationBuilder.prototype.operand = function(operand) {
	$s.push("xpde.parser.OperationBuilder::operand");
	var $spos = $s.length;
	this.operands.push(operand);
	$s.pop();
}
xpde.parser.OperationBuilder.prototype.operands = null;
xpde.parser.OperationBuilder.prototype.operator = function(operator) {
	$s.push("xpde.parser.OperationBuilder::operator");
	var $spos = $s.length;
	this.reduce(this.lookupOperatorPrecedence(operator));
	this.operators.push(operator);
	$s.pop();
}
xpde.parser.OperationBuilder.prototype.operators = null;
xpde.parser.OperationBuilder.prototype.reduce = function(precedence) {
	$s.push("xpde.parser.OperationBuilder::reduce");
	var $spos = $s.length;
	if(precedence == null) precedence = 0;
	while(this.operators.length > 0 && this.lookupOperatorPrecedence(this.operators[this.operators.length - 1]) >= precedence) this.reduceOperator(this.operators.pop());
	{
		var $tmp = this.operands[0];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.OperationBuilder.prototype.reduceOperator = function(operator) {
	$s.push("xpde.parser.OperationBuilder::reduceOperator");
	var $spos = $s.length;
	var b = this.operands.pop(), a = this.operands.pop();
	this.operands.push(xpde.parser.Expression.EInfixOperation(operator,a,b));
	$s.pop();
}
xpde.parser.OperationBuilder.prototype.__class__ = xpde.parser.OperationBuilder;
xpde.parser.JavaPackageItem = function() { }
xpde.parser.JavaPackageItem.__name__ = ["xpde","parser","JavaPackageItem"];
xpde.parser.JavaPackageItem.prototype.__class__ = xpde.parser.JavaPackageItem;
xpde.parser.JavaPackage = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.JavaPackage::new");
	var $spos = $s.length;
	this.contents = new Hash();
	$s.pop();
}}
xpde.parser.JavaPackage.__name__ = ["xpde","parser","JavaPackage"];
xpde.parser.JavaPackage.prototype.addCompilationUnit = function(qualident,unit) {
	$s.push("xpde.parser.JavaPackage::addCompilationUnit");
	var $spos = $s.length;
	if(qualident.length == 0) if(this.contents.exists(qualident[0])) throw "redefinition of " + qualident.join(".");
	else this.contents.set(qualident[0],unit);
	else {
		if(this.contents.exists(qualident[0]) && !Std["is"](this.contents.get(qualident[0]),xpde.parser.JavaPackage)) throw qualident.join(".") + " is not a package";
		else if(!this.contents.exists(qualident[0])) this.contents.set(qualident[0],new xpde.parser.JavaPackage());
		(function($this) {
			var $r;
			var tmp = $this.contents.get(qualident[0]);
			$r = (Std["is"](tmp,xpde.parser.JavaPackage)?tmp:function($this) {
				var $r;
				throw "Class cast error";
				return $r;
			}($this));
			return $r;
		}(this)).addCompilationUnit(qualident.slice(1),unit);
	}
	$s.pop();
}
xpde.parser.JavaPackage.prototype.contents = null;
xpde.parser.JavaPackage.prototype.getByQualident = function(qualident) {
	$s.push("xpde.parser.JavaPackage::getByQualident");
	var $spos = $s.length;
	try {
		if(!this.contents.exists(qualident[0])) throw false;
		if(qualident.length == 1) {
			var $tmp = this.contents.get(qualident[0]);
			$s.pop();
			return $tmp;
		}
		else {
			var $tmp = function($this) {
				var $r;
				var tmp = $this.contents.get(qualident[0]);
				$r = (Std["is"](tmp,xpde.parser.JavaPackage)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this).getByQualident(qualident.slice(1));
			$s.pop();
			return $tmp;
		}
	}
	catch( $e13 ) {
		{
			var e = $e13;
			{
				$e = [];
				while($s.length >= $spos) $e.unshift($s.pop());
				$s.push($e[0]);
				throw "invalid qualified reference " + qualident.join(".");
			}
		}
	}
	$s.pop();
}
xpde.parser.JavaPackage.prototype.__class__ = xpde.parser.JavaPackage;
xpde.parser.JavaPackage.__interfaces__ = [xpde.parser.JavaPackageItem];
xpde.parser.CompilationUnit = function() { }
xpde.parser.CompilationUnit.__name__ = ["xpde","parser","CompilationUnit"];
xpde.parser.CompilationUnit.prototype.dependencies = null;
xpde.parser.CompilationUnit.prototype.initialize = null;
xpde.parser.CompilationUnit.prototype.packageDeclaration = null;
xpde.parser.CompilationUnit.prototype.__class__ = xpde.parser.CompilationUnit;
xpde.parser.CompilationUnit.__interfaces__ = [xpde.parser.JavaPackageItem];
xpde.parser.ParsedCompilationUnit = function(rootPackage,packageDeclaration,source) { if( rootPackage === $_ ) return; {
	$s.push("xpde.parser.ParsedCompilationUnit::new");
	var $spos = $s.length;
	this.packageDeclaration = packageDeclaration;
	rootPackage.addCompilationUnit(packageDeclaration,this);
	this.dependencies = [];
	this.context = new xpde.parser.CompilationUnitContext(rootPackage,this);
	this.source = source;
	this.initialized = false;
	$s.pop();
}}
xpde.parser.ParsedCompilationUnit.__name__ = ["xpde","parser","ParsedCompilationUnit"];
xpde.parser.ParsedCompilationUnit.prototype.context = null;
xpde.parser.ParsedCompilationUnit.prototype.dependencies = null;
xpde.parser.ParsedCompilationUnit.prototype.initialize = function() {
	$s.push("xpde.parser.ParsedCompilationUnit::initialize");
	var $spos = $s.length;
	if(this.initialized) {
		$s.pop();
		return;
	}
	var scanner = new xpde.parser.Scanner(this.source);
	var parser = new xpde.parser.Parser(scanner,this);
	parser.Parse();
	this.initialized = true;
	$s.pop();
}
xpde.parser.ParsedCompilationUnit.prototype.initialized = null;
xpde.parser.ParsedCompilationUnit.prototype.packageDeclaration = null;
xpde.parser.ParsedCompilationUnit.prototype.source = null;
xpde.parser.ParsedCompilationUnit.prototype.__class__ = xpde.parser.ParsedCompilationUnit;
xpde.parser.ParsedCompilationUnit.__interfaces__ = [xpde.parser.CompilationUnit];
xpde.parser.CompilationUnitContext = function(rootPackage,unit) { if( rootPackage === $_ ) return; {
	$s.push("xpde.parser.CompilationUnitContext::new");
	var $spos = $s.length;
	this.unit = unit;
	this.rootPackage = rootPackage;
	this.definitions = new Hash();
	this.importMap = new Hash();
	$s.pop();
}}
xpde.parser.CompilationUnitContext.__name__ = ["xpde","parser","CompilationUnitContext"];
xpde.parser.CompilationUnitContext.prototype.define = function(identifier,definition) {
	$s.push("xpde.parser.CompilationUnitContext::define");
	var $spos = $s.length;
	if(this.definitions.exists(identifier)) throw "redefinition of top-level declaration \"" + identifier + "\"";
	this.definitions.set(identifier,definition);
	$s.pop();
}
xpde.parser.CompilationUnitContext.prototype.defineClass = function(definition) {
	$s.push("xpde.parser.CompilationUnitContext::defineClass");
	var $spos = $s.length;
	this.define(definition.identifier,xpde.TopLevelDefinition.DClass(definition));
	$s.pop();
}
xpde.parser.CompilationUnitContext.prototype.definitions = null;
xpde.parser.CompilationUnitContext.prototype.importMap = null;
xpde.parser.CompilationUnitContext.prototype.mapImports = function(ident) {
	$s.push("xpde.parser.CompilationUnitContext::mapImports");
	var $spos = $s.length;
	if(ident[ident.length - 1] != "*") {
		if(!Std["is"](this.rootPackage.getByQualident(ident.slice(0,-1)),xpde.parser.CompilationUnit)) {
			$s.pop();
			return;
		}
		this.importMap.set(ident[ident.length - 1],ident);
	}
	else {
		try {
			var importPackage = function($this) {
				var $r;
				var tmp = $this.rootPackage.getByQualident(ident.slice(0,-1));
				$r = (Std["is"](tmp,xpde.parser.JavaPackage)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this);
			{ var $it14 = importPackage.contents.keys();
			while( $it14.hasNext() ) { var item = $it14.next();
			if(Std["is"](importPackage.contents.get(item),xpde.parser.CompilationUnit)) this.importMap.set(item,ident.slice(0,-1).concat([item]));
			}}
		}
		catch( $e15 ) {
			{
				var e = $e15;
				{
					$e = [];
					while($s.length >= $spos) $e.unshift($s.pop());
					$s.push($e[0]);
					null;
				}
			}
		}
	}
	$s.pop();
}
xpde.parser.CompilationUnitContext.prototype.rootPackage = null;
xpde.parser.CompilationUnitContext.prototype.unit = null;
xpde.parser.CompilationUnitContext.prototype.__class__ = xpde.parser.CompilationUnitContext;
xpde.parser.FieldDefinable = function() { }
xpde.parser.FieldDefinable.__name__ = ["xpde","parser","FieldDefinable"];
xpde.parser.FieldDefinable.prototype.defineField = null;
xpde.parser.FieldDefinable.prototype.__class__ = xpde.parser.FieldDefinable;
xpde.parser.ClassContext = function(modifiers,identifier) { if( modifiers === $_ ) return; {
	$s.push("xpde.parser.ClassContext::new");
	var $spos = $s.length;
	this.modifiers = modifiers;
	this.identifier = identifier;
	this.implement = [];
	this.fields = new Hash();
	this.methods = new Hash();
	this.staticConstructor = new xpde.parser.BlockContext();
	this.objectConstructor = new xpde.parser.BlockContext();
	$s.pop();
}}
xpde.parser.ClassContext.__name__ = ["xpde","parser","ClassContext"];
xpde.parser.ClassContext.prototype.defineField = function(definition,init) {
	$s.push("xpde.parser.ClassContext::defineField");
	var $spos = $s.length;
	if(this.fields.exists(definition.identifier)) throw "redeclaration of field \"" + definition.identifier + "\"";
	this.fields.set(definition.identifier,definition);
	if(init != null) if(definition.modifiers.contains(xpde.Modifier.MStatic)) this.staticConstructor.pushStatement(xpde.parser.Statement.SExpression(xpde.parser.Expression.EAssignment(definition.identifier,xpde.parser.Expression.ELexExpression(xpde.parser.LexicalExpression.LReference(this.identifier)),init)));
	else this.objectConstructor.pushStatement(xpde.parser.Statement.SExpression(xpde.parser.Expression.EAssignment(definition.identifier,xpde.parser.Expression.EThisReference,init)));
	$s.pop();
}
xpde.parser.ClassContext.prototype.defineMethod = function(definition) {
	$s.push("xpde.parser.ClassContext::defineMethod");
	var $spos = $s.length;
	this.methods.set(definition.identifier,definition);
	$s.pop();
}
xpde.parser.ClassContext.prototype.extend = null;
xpde.parser.ClassContext.prototype.fields = null;
xpde.parser.ClassContext.prototype.identifier = null;
xpde.parser.ClassContext.prototype.implement = null;
xpde.parser.ClassContext.prototype.methods = null;
xpde.parser.ClassContext.prototype.modifiers = null;
xpde.parser.ClassContext.prototype.objectConstructor = null;
xpde.parser.ClassContext.prototype.staticConstructor = null;
xpde.parser.ClassContext.prototype.__class__ = xpde.parser.ClassContext;
xpde.parser.ClassContext.__interfaces__ = [xpde.parser.FieldDefinable];
xpde.parser.BlockContext = function(parent) { if( parent === $_ ) return; {
	$s.push("xpde.parser.BlockContext::new");
	var $spos = $s.length;
	this.parent = parent;
	this.statements = [];
	this.fieldDefinitions = new Hash();
	$s.pop();
}}
xpde.parser.BlockContext.__name__ = ["xpde","parser","BlockContext"];
xpde.parser.BlockContext.prototype.defineField = function(definition,init) {
	$s.push("xpde.parser.BlockContext::defineField");
	var $spos = $s.length;
	if(this.isFieldDefined(definition.identifier)) throw "redeclaration of variable \"" + definition.identifier + "\" in block scope";
	this.fieldDefinitions.set(definition.identifier,definition);
	if(init != null) this.pushStatement(xpde.parser.Statement.SExpression(xpde.parser.Expression.ELocalAssignment(definition.identifier,init)));
	$s.pop();
}
xpde.parser.BlockContext.prototype.fieldDefinitions = null;
xpde.parser.BlockContext.prototype.getBlockStatement = function() {
	$s.push("xpde.parser.BlockContext::getBlockStatement");
	var $spos = $s.length;
	{
		var $tmp = xpde.parser.Statement.SBlock(this.fieldDefinitions,this.statements);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.BlockContext.prototype.isFieldDefined = function(identifier) {
	$s.push("xpde.parser.BlockContext::isFieldDefined");
	var $spos = $s.length;
	{
		var $tmp = this.fieldDefinitions.exists(identifier) || ((this.parent != null?this.parent.isFieldDefined(identifier):false));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
xpde.parser.BlockContext.prototype.parent = null;
xpde.parser.BlockContext.prototype.pushStatement = function(statement) {
	$s.push("xpde.parser.BlockContext::pushStatement");
	var $spos = $s.length;
	this.statements.push(statement);
	$s.pop();
}
xpde.parser.BlockContext.prototype.statements = null;
xpde.parser.BlockContext.prototype.__class__ = xpde.parser.BlockContext;
xpde.parser.BlockContext.__interfaces__ = [xpde.parser.FieldDefinable];
xpde.parser.MethodContext = function(modifiers,type,identifier) { if( modifiers === $_ ) return; {
	$s.push("xpde.parser.MethodContext::new");
	var $spos = $s.length;
	this.modifiers = modifiers;
	this.type = type;
	this.identifier = identifier;
	this.throwsList = [];
	this.parameters = [];
	$s.pop();
}}
xpde.parser.MethodContext.__name__ = ["xpde","parser","MethodContext"];
xpde.parser.MethodContext.prototype.body = null;
xpde.parser.MethodContext.prototype.identifier = null;
xpde.parser.MethodContext.prototype.modifiers = null;
xpde.parser.MethodContext.prototype.parameters = null;
xpde.parser.MethodContext.prototype.throwsList = null;
xpde.parser.MethodContext.prototype.type = null;
xpde.parser.MethodContext.prototype.__class__ = xpde.parser.MethodContext;
xpde.parser.LexicalResolver = function(p) { if( p === $_ ) return; {
	$s.push("xpde.parser.LexicalResolver::new");
	var $spos = $s.length;
	null;
	$s.pop();
}}
xpde.parser.LexicalResolver.__name__ = ["xpde","parser","LexicalResolver"];
xpde.parser.LexicalResolver.prototype.classContext = null;
xpde.parser.LexicalResolver.prototype.resolve = function(unit) {
	$s.push("xpde.parser.LexicalResolver::resolve");
	var $spos = $s.length;
	this.unit = unit;
	{ var $it16 = unit.context.definitions.iterator();
	while( $it16.hasNext() ) { var definition = $it16.next();
	var $e = (definition);
	switch( $e[1] ) {
	case 0:
	var definition1 = $e[2];
	{
		this.resolveClass(function($this) {
			var $r;
			var tmp = definition1;
			$r = (Std["is"](tmp,xpde.parser.ClassContext)?tmp:function($this) {
				var $r;
				throw "Class cast error";
				return $r;
			}($this));
			return $r;
		}(this));
	}break;
	}
	}}
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveClass = function(definition) {
	$s.push("xpde.parser.LexicalResolver::resolveClass");
	var $spos = $s.length;
	this.classContext = definition;
	{ var $it17 = this.classContext.methods.iterator();
	while( $it17.hasNext() ) { var method = $it17.next();
	this.resolveMethod(function($this) {
		var $r;
		var tmp = method;
		$r = (Std["is"](tmp,xpde.parser.MethodContext)?tmp:function($this) {
			var $r;
			throw "Class cast error";
			return $r;
		}($this));
		return $r;
	}(this));
	}}
	this.resolveStatement(this.classContext.staticConstructor.getBlockStatement());
	this.resolveStatement(this.classContext.objectConstructor.getBlockStatement());
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveExpression = function(array,index) {
	$s.push("xpde.parser.LexicalResolver::resolveExpression");
	var $spos = $s.length;
	var expression = array[index];
	var $e = (expression);
	switch( $e[1] ) {
	case 0:
	var sizes = $e[3];
	{
		{
			var _g1 = 0, _g = sizes.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(sizes,index1);
			}
		}
	}break;
	case 1:
	var args = $e[3];
	{
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(args,index1);
			}
		}
	}break;
	case 2:
	{
		this.resolveExpression(Type.enumParameters(expression),0);
		this.resolveExpression(Type.enumParameters(expression),1);
		this.resolveExpression(Type.enumParameters(expression),2);
	}break;
	case 3:
	{
		this.resolveExpression(Type.enumParameters(expression),0);
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 4:
	{
		null;
	}break;
	case 5:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 6:
	{
		null;
	}break;
	case 7:
	{
		null;
	}break;
	case 8:
	{
		null;
	}break;
	case 9:
	var args = $e[4];
	{
		this.resolveExpression(Type.enumParameters(expression),1);
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(args,index1);
			}
		}
	}break;
	case 10:
	var args = $e[2];
	{
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(args,index1);
			}
		}
	}break;
	case 11:
	var args = $e[2];
	{
		{
			var _g1 = 0, _g = args.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(args,index1);
			}
		}
	}break;
	case 12:
	{
		this.resolveExpression(Type.enumParameters(expression),0);
		this.resolveExpression(Type.enumParameters(expression),1);
		this.resolveExpression(Type.enumParameters(expression),2);
	}break;
	case 13:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
		this.resolveExpression(Type.enumParameters(expression),2);
	}break;
	case 14:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 15:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 16:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 17:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
		this.resolveExpression(Type.enumParameters(expression),2);
	}break;
	case 18:
	{
		this.resolveExpression(Type.enumParameters(expression),0);
	}break;
	case 19:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 20:
	{
		this.resolveExpression(Type.enumParameters(expression),1);
	}break;
	case 21:
	var values = $e[2];
	{
		{
			var _g1 = 0, _g = values.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				this.resolveExpression(values,index1);
			}
		}
	}break;
	case 22:
	{
		null;
	}break;
	case 23:
	{
		null;
	}break;
	case 24:
	{
		null;
	}break;
	case 25:
	{
		null;
	}break;
	case 26:
	{
		null;
	}break;
	case 27:
	{
		null;
	}break;
	case 28:
	var expression1 = $e[2];
	{
		var $e = (expression1);
		switch( $e[1] ) {
		case 0:
		var identifier = $e[2];
		{
			array[index] = this.resolveLexicalReference(identifier);
		}break;
		case 1:
		var args = $e[3], identifier = $e[2];
		{
			array[index] = this.resolveLexicalCall(identifier,args);
		}break;
		case 2:
		var value = $e[3], identifier = $e[2];
		{
			array[index] = this.resolveLexicalAssignment(identifier,value);
		}break;
		}
	}break;
	}
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveLexicalAssignment = function(identifier,value) {
	$s.push("xpde.parser.LexicalResolver::resolveLexicalAssignment");
	var $spos = $s.length;
	if(this.classContext.fields.exists(identifier)) {
		var $tmp = xpde.parser.Expression.EAssignment(identifier,xpde.parser.Expression.EThisReference,value);
		$s.pop();
		return $tmp;
	}
	throw "invalid reference to variable \"" + identifier + "\"";
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveLexicalCall = function(identifier,args) {
	$s.push("xpde.parser.LexicalResolver::resolveLexicalCall");
	var $spos = $s.length;
	if(this.classContext.methods.exists(identifier)) {
		var $tmp = xpde.parser.Expression.ECall(identifier,xpde.parser.Expression.EThisReference,args);
		$s.pop();
		return $tmp;
	}
	throw "invalid call to method \"" + identifier + "\"";
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveLexicalReference = function(identifier) {
	$s.push("xpde.parser.LexicalResolver::resolveLexicalReference");
	var $spos = $s.length;
	if(this.classContext.fields.exists(identifier)) {
		var $tmp = xpde.parser.Expression.EReference(identifier,xpde.parser.Expression.EThisReference);
		$s.pop();
		return $tmp;
	}
	throw "invalid reference to variable \"" + identifier + "\"";
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveMethod = function(definition) {
	$s.push("xpde.parser.LexicalResolver::resolveMethod");
	var $spos = $s.length;
	this.resolveStatement(definition.body);
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.resolveStatement = function(statement) {
	$s.push("xpde.parser.LexicalResolver::resolveStatement");
	var $spos = $s.length;
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var statements = $e[3];
	{
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				this.resolveStatement(statement1);
			}
		}
	}break;
	case 1:
	{
		null;
	}break;
	case 2:
	var elseBlock = $e[4], thenBlock = $e[3];
	{
		this.resolveExpression(Type.enumParameters(statement),0);
		this.resolveStatement(thenBlock);
		if(elseBlock != null) this.resolveStatement(elseBlock);
	}break;
	case 3:
	{
		null;
	}break;
	case 4:
	{
		this.resolveExpression(Type.enumParameters(statement),0);
	}break;
	case 5:
	var body = $e[3];
	{
		this.resolveStatement(body);
	}break;
	case 6:
	var body = $e[3];
	{
		this.resolveExpression(Type.enumParameters(statement),0);
		this.resolveStatement(body);
	}break;
	case 7:
	var value = $e[2];
	{
		if(value != null) this.resolveExpression(Type.enumParameters(statement),0);
	}break;
	case 8:
	{
		this.resolveExpression(Type.enumParameters(statement),0);
	}break;
	case 9:
	var finallyBody = $e[4], catches = $e[3], body = $e[2];
	{
		this.resolveStatement(body);
		{
			var _g = 0;
			while(_g < catches.length) {
				var catchBlock = catches[_g];
				++_g;
				this.resolveStatement(catchBlock.body);
			}
		}
		if(finallyBody != null) this.resolveStatement(finallyBody);
	}break;
	}
	$s.pop();
}
xpde.parser.LexicalResolver.prototype.unit = null;
xpde.parser.LexicalResolver.prototype.__class__ = xpde.parser.LexicalResolver;
xpde.DataType = { __ename__ : ["xpde","DataType"], __constructs__ : ["DTPrimitive","DTReference","DTArray","DTLexReference"] }
xpde.DataType.DTArray = function(type,dimensions) { var $x = ["DTArray",2,type,dimensions]; $x.__enum__ = xpde.DataType; $x.toString = $estr; return $x; }
xpde.DataType.DTLexReference = function(qualident) { var $x = ["DTLexReference",3,qualident]; $x.__enum__ = xpde.DataType; $x.toString = $estr; return $x; }
xpde.DataType.DTPrimitive = function(type) { var $x = ["DTPrimitive",0,type]; $x.__enum__ = xpde.DataType; $x.toString = $estr; return $x; }
xpde.DataType.DTReference = function(qualident) { var $x = ["DTReference",1,qualident]; $x.__enum__ = xpde.DataType; $x.toString = $estr; return $x; }
xpde.PrimitiveType = { __ename__ : ["xpde","PrimitiveType"], __constructs__ : ["PTByte","PTShort","PTInt","PTLong","PTFloat","PTDouble","PTChar","PTBoolean"] }
xpde.PrimitiveType.PTBoolean = ["PTBoolean",7];
xpde.PrimitiveType.PTBoolean.toString = $estr;
xpde.PrimitiveType.PTBoolean.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTByte = ["PTByte",0];
xpde.PrimitiveType.PTByte.toString = $estr;
xpde.PrimitiveType.PTByte.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTChar = ["PTChar",6];
xpde.PrimitiveType.PTChar.toString = $estr;
xpde.PrimitiveType.PTChar.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTDouble = ["PTDouble",5];
xpde.PrimitiveType.PTDouble.toString = $estr;
xpde.PrimitiveType.PTDouble.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTFloat = ["PTFloat",4];
xpde.PrimitiveType.PTFloat.toString = $estr;
xpde.PrimitiveType.PTFloat.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTInt = ["PTInt",2];
xpde.PrimitiveType.PTInt.toString = $estr;
xpde.PrimitiveType.PTInt.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTLong = ["PTLong",3];
xpde.PrimitiveType.PTLong.toString = $estr;
xpde.PrimitiveType.PTLong.__enum__ = xpde.PrimitiveType;
xpde.PrimitiveType.PTShort = ["PTShort",1];
xpde.PrimitiveType.PTShort.toString = $estr;
xpde.PrimitiveType.PTShort.__enum__ = xpde.PrimitiveType;
xpde.TopLevelDefinition = { __ename__ : ["xpde","TopLevelDefinition"], __constructs__ : ["DClass"] }
xpde.TopLevelDefinition.DClass = function(definition) { var $x = ["DClass",0,definition]; $x.__enum__ = xpde.TopLevelDefinition; $x.toString = $estr; return $x; }
$Main = function() { }
$Main.__name__ = ["@Main"];
$Main.prototype.__class__ = $Main;
$_ = {}
js.Boot.__res = {}
$s = [];
$e = [];
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
		$s.push("@Main::new@73");
		var $spos = $s.length;
		{
			var $tmp = isFinite(i);
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	Math.isNaN = function(i) {
		$s.push("@Main::new@85");
		var $spos = $s.length;
		{
			var $tmp = isNaN(i);
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	Math.__name__ = ["Math"];
}
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var stack = $s.copy();
		var f = js.Lib.onerror;
		$s.splice(0,$s.length);
		if( f == null ) {
			var i = stack.length;
			var s = "";
			while( --i >= 0 )
				s += "Called from "+stack[i]+"\n";
			alert(msg+"\n\n"+s);
			return false;
		}
		return f(msg,stack);
	}
}
xpde.core.js.PApplet.__rtti = "<class path=\"xpde.core.js.PApplet\" params=\"\" file=\"C:\\Documents and Settings\\Ryan Family\\Desktop\\tim\\xpde\\src/xpde/core/js/PApplet.hx\">\n\t<implements path=\"haxe.rtti.Infos\"/>\n\t<new public=\"1\" line=\"17\"><f a=\"?curElement\">\n\t<c path=\"String\"/>\n\t<e path=\"Void\"/>\n</f></new>\n</class>";
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
xpde.parser.Parser.minErrDist = 2;
xpde.parser.Parser.maxTerminals = 160;
xpde.parser.Parser.typeKWarr = [xpde.parser.Parser._byte,xpde.parser.Parser._short,xpde.parser.Parser._char,xpde.parser.Parser._int,xpde.parser.Parser._long,xpde.parser.Parser._float,xpde.parser.Parser._double,xpde.parser.Parser._boolean];
xpde.parser.Parser.castFollowerArr = [xpde.parser.Parser._ident,xpde.parser.Parser._new,xpde.parser.Parser._super,xpde.parser.Parser._this,xpde.parser.Parser._void,xpde.parser.Parser._intLit,xpde.parser.Parser._floatLit,xpde.parser.Parser._charLit,xpde.parser.Parser._stringLit,xpde.parser.Parser._true,xpde.parser.Parser._false,xpde.parser.Parser._null,xpde.parser.Parser._lpar,xpde.parser.Parser._not,xpde.parser.Parser._tilde];
xpde.parser.Parser.prefixArr = [xpde.parser.Parser._inc,xpde.parser.Parser._dec,xpde.parser.Parser._not,xpde.parser.Parser._tilde,xpde.parser.Parser._plus,xpde.parser.Parser._minus];
xpde.parser.Parser.typeKW = xpde.parser.Parser.newSet(xpde.parser.Parser.typeKWarr);
xpde.parser.Parser.castFollower = xpde.parser.Parser.or(xpde.parser.Parser.newSet(xpde.parser.Parser.castFollowerArr),xpde.parser.Parser.typeKW);
xpde.parser.Parser.prefix = xpde.parser.Parser.newSet(xpde.parser.Parser.prefixArr);
xpde.parser.Parser.T = true;
xpde.parser.Parser.x = false;
xpde.parser.Parser.set = [[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,true,true,true,true,false,true,false,false,false,false,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,true,true,true,false,true,false,false,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,false,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,true,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,false,true,false,false,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,false,true,false,true,true,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,false,false,false,false,true,true,true,true,true,false,true,true,false,true,true,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,true,false,true,false,false,true,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,true,true,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,true,false,true,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false]];
xpde.parser.Errors.errMsgFormat = "-- line {0} col {1}: {2}";
xpde.parser.FatalError.serialVersionUID = 1.0;
xpde.parser.ModifierSet.none = new xpde.parser.EnumSet([]);
xpde.parser.ModifierSet.access = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate]);
xpde.parser.ModifierSet.classes = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate,xpde.Modifier.MAbstract,xpde.Modifier.MStatic,xpde.Modifier.MFinal,xpde.Modifier.MStrictfp]);
xpde.parser.ModifierSet.fields = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate,xpde.Modifier.MStatic,xpde.Modifier.MFinal,xpde.Modifier.MTransient,xpde.Modifier.MVolatile]);
xpde.parser.ModifierSet.methods = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate,xpde.Modifier.MAbstract,xpde.Modifier.MSynchronized,xpde.Modifier.MNative,xpde.Modifier.MStatic,xpde.Modifier.MFinal,xpde.Modifier.MStrictfp]);
xpde.parser.ModifierSet.constructors = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate]);
xpde.parser.ModifierSet.interfaces = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate,xpde.Modifier.MAbstract,xpde.Modifier.MStatic,xpde.Modifier.MStrictfp]);
xpde.parser.ModifierSet.constants = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MStatic,xpde.Modifier.MFinal]);
xpde.parser.ModifierSet.all = new xpde.parser.EnumSet([xpde.Modifier.MPublic,xpde.Modifier.MProtected,xpde.Modifier.MPrivate,xpde.Modifier.MAbstract,xpde.Modifier.MVolatile,xpde.Modifier.MTransient,xpde.Modifier.MSynchronized,xpde.Modifier.MNative,xpde.Modifier.MStatic,xpde.Modifier.MFinal,xpde.Modifier.MStrictfp]);
$Main.init = JSMain.main();
