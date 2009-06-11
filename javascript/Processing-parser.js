$estr = function() { return js.Boot.__string_rec(this,''); }
js = {}
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
		catch( $e0 ) {
			{
				var e = $e0;
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
	catch( $e1 ) {
		{
			var e = $e1;
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
processing = {}
processing.compiler = {}
processing.compiler.ICompiler = function() { }
processing.compiler.ICompiler.__name__ = ["processing","compiler","ICompiler"];
processing.compiler.ICompiler.prototype.compile = null;
processing.compiler.ICompiler.prototype.__class__ = processing.compiler.ICompiler;
processing.compiler.JavaScriptCompiler = function(p) { if( p === $_ ) return; {
	$s.push("processing.compiler.JavaScriptCompiler::new");
	var $spos = $s.length;
	null;
	$s.pop();
}}
processing.compiler.JavaScriptCompiler.__name__ = ["processing","compiler","JavaScriptCompiler"];
processing.compiler.JavaScriptCompiler.prototype.compile = function(code) {
	$s.push("processing.compiler.JavaScriptCompiler::compile");
	var $spos = $s.length;
	{
		var $tmp = this.serialize(code);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.compiler.JavaScriptCompiler.prototype.serialize = function(statement,escape,inClass,inBlock) {
	$s.push("processing.compiler.JavaScriptCompiler::serialize");
	var $spos = $s.length;
	if(escape == null) escape = true;
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var sizes = $e[3], type = $e[2];
	{
		{
			$s.pop();
			return "";
		}
	}break;
	case 1:
	var sizes = $e[3], type = $e[2];
	{
		{
			$s.pop();
			return "";
		}
	}break;
	case 2:
	var values = $e[2];
	{
		{
			$s.pop();
			return "";
		}
	}break;
	case 3:
	var value = $e[3], reference = $e[2];
	{
		{
			var $tmp = this.serialize(reference) + " = " + this.serialize(value);
			$s.pop();
			return $tmp;
		}
	}break;
	case 4:
	var definitions = $e[3], statements = $e[2];
	{
		var source = new Array();
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition = definitions[_g];
				++_g;
				source.push(this.serializeDefinition(definition));
			}
		}
		source.push(this.serializeStatements(statements));
		{
			var $tmp = source.join(";\n");
			$s.pop();
			return $tmp;
		}
	}break;
	case 5:
	var level = $e[2];
	{
		{
			var $tmp = "break " + level;
			$s.pop();
			return $tmp;
		}
	}break;
	case 6:
	var args = $e[3], method = $e[2];
	{
		var source = new Array();
		{
			var _g = 0;
			while(_g < args.length) {
				var arg = args[_g];
				++_g;
				source.push(this.serialize(arg));
			}
		}
		{
			var $tmp = this.serialize(method) + "(" + source.join(",") + ")";
			$s.pop();
			return $tmp;
		}
	}break;
	case 7:
	var expression = $e[3], type = $e[2];
	{
		{
			$s.pop();
			return "";
		}
	}break;
	case 8:
	var elseBlock = $e[4], thenBlock = $e[3], condition = $e[2];
	{
		{
			var $tmp = "if (" + this.serialize(condition) + ") \n{" + this.serializeStatements(thenBlock) + "} else {" + this.serializeStatements(elseBlock) + "}";
			$s.pop();
			return $tmp;
		}
	}break;
	case 9:
	var level = $e[2];
	{
		{
			var $tmp = "continue " + level;
			$s.pop();
			return $tmp;
		}
	}break;
	case 14:
	var postfix = $e[3], reference = $e[2];
	{
		{
			var $tmp = "(function () { var __ret = " + this.serialize(reference) + "; " + this.serialize(postfix) + "; return __ret; })()";
			$s.pop();
			return $tmp;
		}
	}break;
	case 10:
	var value = $e[2];
	{
		{
			var $tmp = (escape && Std["is"](value,String)?"\"" + value + "\"":value);
			$s.pop();
			return $tmp;
		}
	}break;
	case 11:
	var body = $e[3], condition = $e[2];
	{
		{
			var $tmp = "while (" + this.serialize(condition) + ")\n{\n" + this.serializeStatements(body) + "}\n";
			$s.pop();
			return $tmp;
		}
	}break;
	case 12:
	var args = $e[3], method = $e[2];
	{
		{
			$s.pop();
			return "";
		}
	}break;
	case 13:
	var rightOperand = $e[4], leftOperand = $e[3], type = $e[2];
	{
		if(rightOperand != null) {
			var $tmp = "(" + this.serialize(leftOperand) + this.serializeOperator(type) + this.serialize(rightOperand) + ")";
			$s.pop();
			return $tmp;
		}
		else {
			var $tmp = "(" + this.serializeOperator(type) + this.serialize(leftOperand) + ")";
			$s.pop();
			return $tmp;
		}
	}break;
	case 15:
	var base = $e[3], identifier = $e[2];
	{
		if(base == null) {
			var $tmp = this.serialize(identifier,false);
			$s.pop();
			return $tmp;
		}
		else {
			var $tmp = this.serialize(base) + "[" + this.serialize(identifier) + "]";
			$s.pop();
			return $tmp;
		}
	}break;
	case 16:
	var value = $e[2];
	{
		{
			var $tmp = "return " + ((value != null?this.serialize(value):""));
			$s.pop();
			return $tmp;
		}
	}break;
	case 17:
	{
		{
			$s.pop();
			return "this";
		}
	}break;
	}
	$s.pop();
}
processing.compiler.JavaScriptCompiler.prototype.serializeDefinition = function(definition,inClass) {
	$s.push("processing.compiler.JavaScriptCompiler::serializeDefinition");
	var $spos = $s.length;
	var $e = (definition);
	switch( $e[1] ) {
	case 0:
	var type = $e[5], isStatic = $e[4], visibility = $e[3], identifier = $e[2];
	{
		{
			var $tmp = ((inClass != null?"this.":"var ")) + identifier + " = 0";
			$s.pop();
			return $tmp;
		}
	}break;
	case 1:
	var body = $e[7], params = $e[6], type = $e[5], isStatic = $e[4], visibility = $e[3], identifier = $e[2];
	{
		var paramKeys = new Array();
		{
			var _g = 0;
			while(_g < params.length) {
				var param = params[_g];
				++_g;
				paramKeys.push(param.name);
			}
		}
		var func = "function " + identifier + "(" + paramKeys.join(",") + ") {\n" + this.serialize(body) + "\n}";
		{
			var $tmp = identifier + " = " + func;
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		{
			$s.pop();
			return "";
		}
	}break;
	}
	$s.pop();
}
processing.compiler.JavaScriptCompiler.prototype.serializeOperator = function(operator) {
	$s.push("processing.compiler.JavaScriptCompiler::serializeOperator");
	var $spos = $s.length;
	{
		var $tmp = function($this) {
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
			case 4:
			{
				$r = "||";
			}break;
			case 5:
			{
				$r = "&&";
			}break;
			case 6:
			{
				$r = "|";
			}break;
			case 7:
			{
				$r = "^";
			}break;
			case 8:
			{
				$r = "&";
			}break;
			case 9:
			{
				$r = "==";
			}break;
			case 10:
			{
				$r = "!=";
			}break;
			case 11:
			{
				$r = "<";
			}break;
			case 12:
			{
				$r = "<=";
			}break;
			case 13:
			{
				$r = ">";
			}break;
			case 14:
			{
				$r = ">=";
			}break;
			case 15:
			{
				$r = "instanceof";
			}break;
			case 16:
			{
				$r = "<<";
			}break;
			case 17:
			{
				$r = ">>";
			}break;
			case 18:
			{
				$r = ">>>";
			}break;
			case 19:
			{
				$r = "+";
			}break;
			case 20:
			{
				$r = "-";
			}break;
			case 21:
			{
				$r = "*";
			}break;
			case 22:
			{
				$r = "/";
			}break;
			case 23:
			{
				$r = "%";
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
processing.compiler.JavaScriptCompiler.prototype.serializeStatements = function(statements) {
	$s.push("processing.compiler.JavaScriptCompiler::serializeStatements");
	var $spos = $s.length;
	var source = [];
	{
		var _g = 0;
		while(_g < statements.length) {
			var statement = statements[_g];
			++_g;
			source.push(this.serialize(statement,true,null,true));
		}
	}
	{
		var $tmp = source.join(";\n");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.compiler.JavaScriptCompiler.prototype.__class__ = processing.compiler.JavaScriptCompiler;
processing.compiler.JavaScriptCompiler.__interfaces__ = [processing.compiler.ICompiler];
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
	catch( $e2 ) {
		{
			var e = $e2;
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
	catch( $e3 ) {
		{
			var err = $e3;
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
processing.parser = {}
processing.parser.Token = { __ename__ : ["processing","parser","Token"], __constructs__ : ["TEof","TKeyword","TType","TIdentifier","TOperator","TString","TInteger","TFloat","TChar","TDimensions","TParenOpen","TParenClose","TBracketOpen","TBracketClose","TDot","TComma","TSemicolon","TBraceOpen","TBraceClose","TQuestion","TDoubleDot"] }
processing.parser.Token.TBraceClose = ["TBraceClose",18];
processing.parser.Token.TBraceClose.toString = $estr;
processing.parser.Token.TBraceClose.__enum__ = processing.parser.Token;
processing.parser.Token.TBraceOpen = ["TBraceOpen",17];
processing.parser.Token.TBraceOpen.toString = $estr;
processing.parser.Token.TBraceOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TBracketClose = ["TBracketClose",13];
processing.parser.Token.TBracketClose.toString = $estr;
processing.parser.Token.TBracketClose.__enum__ = processing.parser.Token;
processing.parser.Token.TBracketOpen = ["TBracketOpen",12];
processing.parser.Token.TBracketOpen.toString = $estr;
processing.parser.Token.TBracketOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TChar = function(value) { var $x = ["TChar",8,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TComma = ["TComma",15];
processing.parser.Token.TComma.toString = $estr;
processing.parser.Token.TComma.__enum__ = processing.parser.Token;
processing.parser.Token.TDimensions = ["TDimensions",9];
processing.parser.Token.TDimensions.toString = $estr;
processing.parser.Token.TDimensions.__enum__ = processing.parser.Token;
processing.parser.Token.TDot = ["TDot",14];
processing.parser.Token.TDot.toString = $estr;
processing.parser.Token.TDot.__enum__ = processing.parser.Token;
processing.parser.Token.TDoubleDot = ["TDoubleDot",20];
processing.parser.Token.TDoubleDot.toString = $estr;
processing.parser.Token.TDoubleDot.__enum__ = processing.parser.Token;
processing.parser.Token.TEof = ["TEof",0];
processing.parser.Token.TEof.toString = $estr;
processing.parser.Token.TEof.__enum__ = processing.parser.Token;
processing.parser.Token.TFloat = function(value) { var $x = ["TFloat",7,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TIdentifier = function(identifier) { var $x = ["TIdentifier",3,identifier]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TInteger = function(value) { var $x = ["TInteger",6,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TKeyword = function(keyword) { var $x = ["TKeyword",1,keyword]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TOperator = function(operator) { var $x = ["TOperator",4,operator]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TParenClose = ["TParenClose",11];
processing.parser.Token.TParenClose.toString = $estr;
processing.parser.Token.TParenClose.__enum__ = processing.parser.Token;
processing.parser.Token.TParenOpen = ["TParenOpen",10];
processing.parser.Token.TParenOpen.toString = $estr;
processing.parser.Token.TParenOpen.__enum__ = processing.parser.Token;
processing.parser.Token.TQuestion = ["TQuestion",19];
processing.parser.Token.TQuestion.toString = $estr;
processing.parser.Token.TQuestion.__enum__ = processing.parser.Token;
processing.parser.Token.TSemicolon = ["TSemicolon",16];
processing.parser.Token.TSemicolon.toString = $estr;
processing.parser.Token.TSemicolon.__enum__ = processing.parser.Token;
processing.parser.Token.TString = function(value) { var $x = ["TString",5,value]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
processing.parser.Token.TType = function(type) { var $x = ["TType",2,type]; $x.__enum__ = processing.parser.Token; $x.toString = $estr; return $x; }
EReg = function(r,opt) { if( r === $_ ) return; {
	$s.push("EReg::new");
	var $spos = $s.length;
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
	$s.pop();
}}
EReg.__name__ = ["EReg"];
EReg.prototype.customReplace = function(s,f) {
	$s.push("EReg::customReplace");
	var $spos = $s.length;
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b[buf.b.length] = this.matchedLeft();
		buf.b[buf.b.length] = f(this);
		s = this.matchedRight();
	}
	buf.b[buf.b.length] = s;
	{
		var $tmp = buf.b.join("");
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.match = function(s) {
	$s.push("EReg::match");
	var $spos = $s.length;
	this.r.m = this.r.exec(s);
	this.r.s = s;
	this.r.l = RegExp.leftContext;
	this.r.r = RegExp.rightContext;
	{
		var $tmp = (this.r.m != null);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.matched = function(n) {
	$s.push("EReg::matched");
	var $spos = $s.length;
	{
		var $tmp = (this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.matchedLeft = function() {
	$s.push("EReg::matchedLeft");
	var $spos = $s.length;
	if(this.r.m == null) throw "No string matched";
	if(this.r.l == null) {
		var $tmp = this.r.s.substr(0,this.r.m.index);
		$s.pop();
		return $tmp;
	}
	{
		var $tmp = this.r.l;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.matchedPos = function() {
	$s.push("EReg::matchedPos");
	var $spos = $s.length;
	if(this.r.m == null) throw "No string matched";
	{
		var $tmp = { pos : this.r.m.index, len : this.r.m[0].length}
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.matchedRight = function() {
	$s.push("EReg::matchedRight");
	var $spos = $s.length;
	if(this.r.m == null) throw "No string matched";
	if(this.r.r == null) {
		var sz = this.r.m.index + this.r.m[0].length;
		{
			var $tmp = this.r.s.substr(sz,this.r.s.length - sz);
			$s.pop();
			return $tmp;
		}
	}
	{
		var $tmp = this.r.r;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.r = null;
EReg.prototype.replace = function(s,by) {
	$s.push("EReg::replace");
	var $spos = $s.length;
	{
		var $tmp = s.replace(this.r,by);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.split = function(s) {
	$s.push("EReg::split");
	var $spos = $s.length;
	var d = "#__delim__#";
	{
		var $tmp = s.replace(this.r,d).split(d);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
EReg.prototype.__class__ = EReg;
processing.parser.TokenizerRegexList = function() { }
processing.parser.TokenizerRegexList.__name__ = ["processing","parser","TokenizerRegexList"];
processing.parser.TokenizerRegexList.prototype.__class__ = processing.parser.TokenizerRegexList;
processing.parser.Tokenizer = function(p) { if( p === $_ ) return; {
	$s.push("processing.parser.Tokenizer::new");
	var $spos = $s.length;
	this.load("");
	$s.pop();
}}
processing.parser.Tokenizer.__name__ = ["processing","parser","Tokenizer"];
processing.parser.Tokenizer.matchToken = function(from,to) {
	$s.push("processing.parser.Tokenizer::matchToken");
	var $spos = $s.length;
	{
		var $tmp = (Type.enumEq(from,to) || (Type.enumConstructor(from) == to));
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.currentToken = null;
processing.parser.Tokenizer.prototype.cursor = null;
processing.parser.Tokenizer.prototype.done = null;
processing.parser.Tokenizer.prototype.get = function() {
	$s.push("processing.parser.Tokenizer::get");
	var $spos = $s.length;
	var regex, input = "";
	while(true) {
		input = this.source.substr(this.cursor);
		if((regex = processing.parser.Tokenizer.regexes.WHITESPACE).match(input) || (regex = processing.parser.Tokenizer.regexes.COMMENT).match(input)) this.cursor += regex.matched(0).length;
		else break;
	}
	if((regex = processing.parser.Tokenizer.regexes.EOF).match(input)) {
		this.currentToken = processing.parser.Token.TEof;
	}
	else if((regex = processing.parser.Tokenizer.regexes.OPERATOR).match(input)) {
		this.currentToken = processing.parser.Token.TOperator(regex.matched(1));
	}
	else if((regex = processing.parser.Tokenizer.regexes.PUNCUATION).match(input)) {
		this.currentToken = function($this) {
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
	else if((regex = processing.parser.Tokenizer.regexes.COLOR).match(input)) {
		this.currentToken = processing.parser.Token.TInteger(Std.parseInt("0x" + regex.matched(1)) + ((regex.matched(1).length == 6?-16777216:0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.FLOAT).match(input)) {
		this.currentToken = processing.parser.Token.TFloat(Std.parseFloat(regex.matched(0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.INTEGER).match(input)) {
		this.currentToken = processing.parser.Token.TInteger(Std.parseInt(regex.matched(0)));
	}
	else if((regex = processing.parser.Tokenizer.regexes.KEYWORD).match(input)) {
		this.currentToken = processing.parser.Token.TKeyword(regex.matched(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.TYPE).match(input)) {
		this.currentToken = processing.parser.Token.TType(regex.matched(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.IDENTIFIER).match(input)) {
		this.currentToken = processing.parser.Token.TIdentifier(regex.matched(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.CHAR).match(input)) {
		this.currentToken = processing.parser.Token.TChar(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)).charCodeAt(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.STRING).match(input)) {
		this.currentToken = processing.parser.Token.TString(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)));
	}
	else {
		throw new processing.parser.TokenizerSyntaxError("Illegal token " + input,this);
	}
	this.cursor += regex.matched(0).length;
	{
		var $tmp = this.currentToken;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.getCurrentLineNumber = function() {
	$s.push("processing.parser.Tokenizer::getCurrentLineNumber");
	var $spos = $s.length;
	{
		var $tmp = this.getLineNumber(this.cursor);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.getLineNumber = function(searchCursor) {
	$s.push("processing.parser.Tokenizer::getLineNumber");
	var $spos = $s.length;
	{
		var $tmp = processing.parser.Tokenizer.regexes.NEWLINES.split(this.source.substr(0,searchCursor)).length + 1;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.isDone = function() {
	$s.push("processing.parser.Tokenizer::isDone");
	var $spos = $s.length;
	{
		var $tmp = this.match(processing.parser.Token.TEof);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.line = null;
processing.parser.Tokenizer.prototype.load = function(s) {
	$s.push("processing.parser.Tokenizer::load");
	var $spos = $s.length;
	this.source = s;
	this.cursor = 0;
	$s.pop();
}
processing.parser.Tokenizer.prototype.match = function(to,lookAhead,mustMatch) {
	$s.push("processing.parser.Tokenizer::match");
	var $spos = $s.length;
	if(mustMatch == null) mustMatch = false;
	if(lookAhead == null) lookAhead = 0;
	var origCursor = this.cursor, origToken = this.currentToken, token = this.get();
	{
		var _g = 0;
		while(_g < lookAhead) {
			var i = _g++;
			token = this.get();
		}
	}
	if(processing.parser.Tokenizer.matchToken(token,to)) {
		$s.pop();
		return true;
	}
	else if(mustMatch) throw new processing.parser.TokenizerSyntaxError("Tokenizer: Must match " + to + ", found " + token,this);
	this.cursor = origCursor;
	this.currentToken = origToken;
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.parseStringLiteral = function(str) {
	$s.push("processing.parser.Tokenizer::parseStringLiteral");
	var $spos = $s.length;
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
		$s.push("processing.parser.Tokenizer::parseStringLiteral@160");
		var $spos = $s.length;
		{
			var $tmp = regex.matchedLeft() + String.fromCharCode(Std.parseInt("0x" + regex.matched(1))) + regex.matchedRight();
			$s.pop();
			return $tmp;
		}
		$s.pop();
	});
	{
		$s.pop();
		return str;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.peek = function(lookAhead) {
	$s.push("processing.parser.Tokenizer::peek");
	var $spos = $s.length;
	if(lookAhead == null) lookAhead = 1;
	var origCursor = this.cursor, origToken = this.currentToken, token = origToken;
	{
		var _g = 0;
		while(_g < lookAhead) {
			var i = _g++;
			token = this.get();
		}
	}
	this.cursor = origCursor;
	this.currentToken = origToken;
	{
		$s.pop();
		return token;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.peekMatch = function(to,lookAhead) {
	$s.push("processing.parser.Tokenizer::peekMatch");
	var $spos = $s.length;
	if(lookAhead == null) lookAhead = 1;
	{
		var $tmp = processing.parser.Tokenizer.matchToken(this.peek(lookAhead),to);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Tokenizer.prototype.source = null;
processing.parser.Tokenizer.prototype.__class__ = processing.parser.Tokenizer;
processing.parser.TokenizerSyntaxError = function(message,tokenizer) { if( message === $_ ) return; {
	$s.push("processing.parser.TokenizerSyntaxError::new");
	var $spos = $s.length;
	this.source = tokenizer.source;
	this.line = tokenizer.getCurrentLineNumber();
	this.cursor = tokenizer.cursor;
	this.message = message;
	$s.pop();
}}
processing.parser.TokenizerSyntaxError.__name__ = ["processing","parser","TokenizerSyntaxError"];
processing.parser.TokenizerSyntaxError.prototype.cursor = null;
processing.parser.TokenizerSyntaxError.prototype.line = null;
processing.parser.TokenizerSyntaxError.prototype.message = null;
processing.parser.TokenizerSyntaxError.prototype.source = null;
processing.parser.TokenizerSyntaxError.prototype.toString = function() {
	$s.push("processing.parser.TokenizerSyntaxError::toString");
	var $spos = $s.length;
	{
		var $tmp = this.message + " (line " + this.line + ", char " + this.cursor + ")";
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.TokenizerSyntaxError.prototype.__class__ = processing.parser.TokenizerSyntaxError;
processing.evaluator = {}
processing.evaluator.Evaluator = function(_contexts) { if( _contexts === $_ ) return; {
	$s.push("processing.evaluator.Evaluator::new");
	var $spos = $s.length;
	this.contexts = (_contexts != null?_contexts:[]);
	$s.pop();
}}
processing.evaluator.Evaluator.__name__ = ["processing","evaluator","Evaluator"];
processing.evaluator.Evaluator.prototype.contexts = null;
processing.evaluator.Evaluator.prototype.evaluate = function(code) {
	$s.push("processing.evaluator.Evaluator::evaluate");
	var $spos = $s.length;
	var parser = new processing.parser.Parser();
	var script = parser.parse(code);
	var compiler = new processing.compiler.JavaScriptCompiler();
	var compiled = compiler.compile(script);
	var func = "(function (code, contexts) { ";
	{
		var _g1 = 0, _g = this.contexts.length;
		while(_g1 < _g) {
			var i = _g1++;
			func += "with (contexts.shift()) ";
		}
	}
	func += "return eval(code); })";
	var evaluator = js.Lib.eval(func);
	{
		var $tmp = evaluator(compiled,this.contexts);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.evaluator.Evaluator.prototype.__class__ = processing.evaluator.Evaluator;
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
	{ var $it4 = arr.iterator();
	while( $it4.hasNext() ) { var t = $it4.next();
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
	catch( $e5 ) {
		{
			var e = $e5;
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
		catch( $e6 ) {
			{
				var e = $e6;
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
processing.parser.Parser = function(p) { if( p === $_ ) return; {
	$s.push("processing.parser.Parser::new");
	var $spos = $s.length;
	this.tokenizer = new processing.parser.Tokenizer();
	$s.pop();
}}
processing.parser.Parser.__name__ = ["processing","parser","Parser"];
processing.parser.Parser.prototype.isAssignmentOperator = function(operator) {
	$s.push("processing.parser.Parser::isAssignmentOperator");
	var $spos = $s.length;
	{
		var $tmp = processing.parser.Parser.IS_ASSIGNMENT_OPERATOR.match(operator);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Parser.prototype.lookupOperatorPrecedence = function(operator) {
	$s.push("processing.parser.Parser::lookupOperatorPrecedence");
	var $spos = $s.length;
	{
		var $tmp = function($this) {
			var $r;
			var $e = (operator);
			switch( $e[1] ) {
			case 0:
			var operator1 = $e[2];
			{
				$r = function($this) {
					var $r;
					var $e = (operator1);
					switch( $e[1] ) {
					case 4:
					{
						$r = 3;
					}break;
					case 5:
					{
						$r = 4;
					}break;
					case 6:
					{
						$r = 5;
					}break;
					case 7:
					{
						$r = 6;
					}break;
					case 8:
					{
						$r = 7;
					}break;
					case 9:
					case 10:
					{
						$r = 8;
					}break;
					case 11:
					case 12:
					case 13:
					case 14:
					case 15:
					{
						$r = 9;
					}break;
					case 16:
					case 17:
					case 18:
					{
						$r = 10;
					}break;
					case 19:
					case 20:
					{
						$r = 11;
					}break;
					case 21:
					case 22:
					case 23:
					{
						$r = 12;
					}break;
					case 0:
					case 1:
					case 2:
					case 3:
					{
						$r = 14;
					}break;
					default:{
						$r = null;
					}break;
					}
					return $r;
				}($this);
			}break;
			case 1:
			{
				$r = 1;
			}break;
			case 2:
			{
				$r = 13;
			}break;
			case 3:
			{
				$r = 13;
			}break;
			case 4:
			{
				$r = 14;
			}break;
			case 5:
			{
				$r = 15;
			}break;
			case 6:
			{
				$r = 15;
			}break;
			case 7:
			{
				$r = 15;
			}break;
			case 8:
			{
				$r = 15;
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
processing.parser.Parser.prototype.lookupOperatorType = function(operator,scanOperand) {
	$s.push("processing.parser.Parser::lookupOperatorType");
	var $spos = $s.length;
	if(scanOperand == null) scanOperand = false;
	switch(operator) {
	case "!":{
		{
			var $tmp = processing.parser.Operator.OpNot;
			$s.pop();
			return $tmp;
		}
	}break;
	case "~":{
		{
			var $tmp = processing.parser.Operator.OpBitwiseNot;
			$s.pop();
			return $tmp;
		}
	}break;
	case "||":{
		{
			var $tmp = processing.parser.Operator.OpOr;
			$s.pop();
			return $tmp;
		}
	}break;
	case "&&":{
		{
			var $tmp = processing.parser.Operator.OpAnd;
			$s.pop();
			return $tmp;
		}
	}break;
	case "|":case "|=":{
		{
			var $tmp = processing.parser.Operator.OpBitwiseOr;
			$s.pop();
			return $tmp;
		}
	}break;
	case "^":case "^=":{
		{
			var $tmp = processing.parser.Operator.OpBitwiseXor;
			$s.pop();
			return $tmp;
		}
	}break;
	case "&":case "&=":{
		{
			var $tmp = processing.parser.Operator.OpBitwiseAnd;
			$s.pop();
			return $tmp;
		}
	}break;
	case "==":{
		{
			var $tmp = processing.parser.Operator.OpEqual;
			$s.pop();
			return $tmp;
		}
	}break;
	case "!=":{
		{
			var $tmp = processing.parser.Operator.OpUnequal;
			$s.pop();
			return $tmp;
		}
	}break;
	case "<":{
		{
			var $tmp = processing.parser.Operator.OpLessThan;
			$s.pop();
			return $tmp;
		}
	}break;
	case "<=":{
		{
			var $tmp = processing.parser.Operator.OpLessThanOrEqual;
			$s.pop();
			return $tmp;
		}
	}break;
	case ">":{
		{
			var $tmp = processing.parser.Operator.OpGreaterThan;
			$s.pop();
			return $tmp;
		}
	}break;
	case ">=":{
		{
			var $tmp = processing.parser.Operator.OpGreaterThanOrEqual;
			$s.pop();
			return $tmp;
		}
	}break;
	case "instanceof":{
		{
			var $tmp = processing.parser.Operator.OpInstanceOf;
			$s.pop();
			return $tmp;
		}
	}break;
	case "<<":case "<<=":{
		{
			var $tmp = processing.parser.Operator.OpLeftShift;
			$s.pop();
			return $tmp;
		}
	}break;
	case ">>":case ">>=":{
		{
			var $tmp = processing.parser.Operator.OpRightShift;
			$s.pop();
			return $tmp;
		}
	}break;
	case ">>>":case ">>>=":{
		{
			var $tmp = processing.parser.Operator.OpZeroRightShift;
			$s.pop();
			return $tmp;
		}
	}break;
	case "+":case "+=":case "++":{
		{
			var $tmp = (scanOperand?processing.parser.Operator.OpUnaryPlus:processing.parser.Operator.OpPlus);
			$s.pop();
			return $tmp;
		}
	}break;
	case "-":case "-=":case "--":{
		{
			var $tmp = (scanOperand?processing.parser.Operator.OpUnaryMinus:processing.parser.Operator.OpMinus);
			$s.pop();
			return $tmp;
		}
	}break;
	case "*":case "*=":{
		{
			var $tmp = processing.parser.Operator.OpMultiply;
			$s.pop();
			return $tmp;
		}
	}break;
	case "/":case "/=":{
		{
			var $tmp = processing.parser.Operator.OpDivide;
			$s.pop();
			return $tmp;
		}
	}break;
	case "%":case "%=":{
		{
			var $tmp = processing.parser.Operator.OpModulus;
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		throw "Unknown operator \"" + operator + "\"";
	}break;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parse = function(code) {
	$s.push("processing.parser.Parser::parse");
	var $spos = $s.length;
	this.tokenizer.load(code);
	var statements = [], definitions = [];
	while(this.parseDefinition(processing.parser.ParserScope.PScript,statements,definitions) || this.parseStatement(statements,definitions)) continue;
	if(!this.tokenizer.isDone()) throw new processing.parser.TokenizerSyntaxError("Script unterminated",this.tokenizer);
	{
		var $tmp = processing.parser.Statement.SBlock(statements,definitions);
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseDefinition = function(scope,statements,definitions) {
	$s.push("processing.parser.Parser::parseDefinition");
	var $spos = $s.length;
	var peek = 1;
	if(scope != processing.parser.ParserScope.PBlock) {
		if(this.tokenizer.peekMatch(processing.parser.Token.TKeyword("static"),peek)) peek++;
		if(this.tokenizer.peekMatch(processing.parser.Token.TKeyword("private"),peek) || this.tokenizer.match(processing.parser.Token.TKeyword("public"),peek)) peek++;
	}
	if(this.tokenizer.peekMatch("TType",peek) || this.tokenizer.peekMatch("TIdentifier",peek)) peek++;
	else {
		$s.pop();
		return false;
	}
	while(this.tokenizer.peekMatch(processing.parser.Token.TDimensions,peek)) peek++;
	if(this.tokenizer.peekMatch("TIdentifier",peek)) {
		if((scope != processing.parser.ParserScope.PBlock) && this.tokenizer.peekMatch(processing.parser.Token.TParenOpen,peek + 1)) {
			var $tmp = this.parseFunctionDefinition(definitions);
			$s.pop();
			return $tmp;
		}
		else if(scope != processing.parser.ParserScope.PScript) {
			var $tmp = this.parseVariableDefinition(statements,definitions);
			$s.pop();
			return $tmp;
		}
	}
	{
		$s.pop();
		return false;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseExpression = function() {
	$s.push("processing.parser.Parser::parseExpression");
	var $spos = $s.length;
	var operators = [], operands = [];
	this.scanOperand(operators,operands);
	if(operands.length == 0) {
		$s.pop();
		return null;
	}
	while(this.scanOperator(operators,operands)) this.scanOperand(operators,operands,true);
	this.recursiveReduceExpression(operators,operands);
	{
		var $tmp = operands[0];
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseFunctionDefinition = function(definitions) {
	$s.push("processing.parser.Parser::parseFunctionDefinition");
	var $spos = $s.length;
	var isStatic = this.tokenizer.match(processing.parser.Token.TKeyword("static"));
	var visibility = this.parseVisibility();
	var fType = this.parseType();
	this.tokenizer.match("TIdentifier",null,true);
	var identifier = Type.enumParameters(this.tokenizer.currentToken)[0];
	this.tokenizer.match(processing.parser.Token.TParenOpen,null,true);
	var params = [];
	while(!this.tokenizer.peekMatch(processing.parser.Token.TParenClose)) {
		var type = this.parseType();
		if(type == null) throw new processing.parser.TokenizerSyntaxError("Invalid formal parameter type",this.tokenizer);
		if(!this.tokenizer.match("TIdentifier")) throw new processing.parser.TokenizerSyntaxError("Invalid formal parameter",this.tokenizer);
		var name = Type.enumParameters(this.tokenizer.currentToken)[0];
		params.push({ name : name, type : type});
		if(!this.tokenizer.peekMatch(processing.parser.Token.TParenClose)) this.tokenizer.match(processing.parser.Token.TComma,null,true);
	}
	this.tokenizer.match(processing.parser.Token.TParenClose,null,true);
	this.tokenizer.match(processing.parser.Token.TBraceOpen,null,true);
	var fStatements = [], fDefinitions = [];
	while(this.parseStatement(fStatements,fDefinitions)) continue;
	this.tokenizer.match(processing.parser.Token.TBraceClose,null,true);
	definitions.push(processing.parser.Definition.DFunction(identifier,visibility,isStatic,fType,params,processing.parser.Statement.SBlock(fStatements,fDefinitions)));
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseList = function() {
	$s.push("processing.parser.Parser::parseList");
	var $spos = $s.length;
	var list = [], expression;
	do {
		expression = this.parseExpression();
		if(expression == null) if(list.length == 0) {
			$s.pop();
			return list;
		}
		else throw new processing.parser.TokenizerSyntaxError("Invalid expression in list.",this.tokenizer);
		list.push(expression);
	} while(this.tokenizer.match(processing.parser.Token.TComma));
	{
		$s.pop();
		return list;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseStatement = function(statements,definitions) {
	$s.push("processing.parser.Parser::parseStatement");
	var $spos = $s.length;
	if(this.parseDefinition(processing.parser.ParserScope.PBlock,statements,definitions)) {
		$s.pop();
		return true;
	}
	var $e = (this.tokenizer.peek());
	switch( $e[1] ) {
	case 1:
	var keyword = $e[2];
	{
		switch(keyword) {
		case "if":{
			var condition, thenBlock = [], elseBlock = [];
			this.tokenizer.get();
			this.tokenizer.match(processing.parser.Token.TParenOpen,null,true);
			condition = this.parseExpression();
			if(condition == null) throw new processing.parser.TokenizerSyntaxError("Invalid expression in conditional.",this.tokenizer);
			this.tokenizer.match(processing.parser.Token.TParenClose,null,true);
			if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
				while(this.parseStatement(thenBlock,definitions)) continue;
				this.tokenizer.match(processing.parser.Token.TBraceClose,null,true);
			}
			else if(!this.parseStatement(thenBlock,definitions)) throw new processing.parser.TokenizerSyntaxError("Invalid expression in conditional.",this.tokenizer);
			if(this.tokenizer.match(processing.parser.Token.TKeyword("else"))) {
				if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
					while(this.parseStatement(elseBlock,definitions)) continue;
					this.tokenizer.match(processing.parser.Token.TBraceClose,null,true);
				}
				else if(!this.parseStatement(elseBlock,definitions)) throw new processing.parser.TokenizerSyntaxError("Invalid expression in conditional.",this.tokenizer);
			}
			statements.push(processing.parser.Statement.SConditional(condition,thenBlock,elseBlock));
		}break;
		case "for":{
			this.tokenizer.get();
			this.tokenizer.match(processing.parser.Token.TParenOpen,null,true);
			if(!this.parseVariableDefinition(statements,definitions)) {
				var expression = this.parseExpression();
				if(expression != null) statements.push(expression);
				this.tokenizer.match(processing.parser.Token.TSemicolon,null,true);
			}
			var condition = this.parseExpression();
			this.tokenizer.match(processing.parser.Token.TSemicolon,null,true);
			var update = this.parseList();
			this.tokenizer.match(processing.parser.Token.TParenClose,null,true);
			var body = [];
			if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
				while(this.parseStatement(body,definitions)) continue;
				this.tokenizer.match(processing.parser.Token.TBraceClose,null,true);
			}
			else if(!this.parseStatement(body,definitions)) throw new processing.parser.TokenizerSyntaxError("Invalid expression in for loop.",this.tokenizer);
			body = body.concat(update);
			statements.push(processing.parser.Statement.SLoop(condition,body));
		}break;
		default:{
			{
				$s.pop();
				return false;
			}
		}break;
		}
	}break;
	default:{
		var expression = this.parseExpression();
		if(expression == null) {
			var $tmp = this.tokenizer.match(processing.parser.Token.TSemicolon);
			$s.pop();
			return $tmp;
		}
		this.tokenizer.match(processing.parser.Token.TSemicolon,null,true);
		statements.push(expression);
	}break;
	}
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseType = function() {
	$s.push("processing.parser.Parser::parseType");
	var $spos = $s.length;
	var $e = (this.tokenizer.peek());
	switch( $e[1] ) {
	case 2:
	case 3:
	var value = $e[2];
	{
		this.tokenizer.get();
		var dimensions = 0;
		while(this.tokenizer.match(processing.parser.Token.TDimensions)) dimensions++;
		{
			var $tmp = { type : value, dimensions : dimensions}
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		{
			$s.pop();
			return null;
		}
	}break;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseVariableDefinition = function(statements,definitions) {
	$s.push("processing.parser.Parser::parseVariableDefinition");
	var $spos = $s.length;
	var isStatic = this.tokenizer.match(processing.parser.Token.TKeyword("static"));
	var visibility = this.parseVisibility();
	var vType = this.parseType();
	do {
		this.tokenizer.match("TIdentifier",null,true);
		var identifier = Type.enumParameters(this.tokenizer.currentToken)[0];
		var vTypeDimensions = vType.dimensions;
		if(vTypeDimensions == 0) {
			while(this.tokenizer.match(processing.parser.Token.TDimensions)) vTypeDimensions++;
		}
		definitions.push(processing.parser.Definition.DVariable(identifier,visibility,isStatic,{ type : vType.type, dimensions : vTypeDimensions}));
		if(this.tokenizer.match(processing.parser.Token.TOperator("="))) {
			var expression = this.parseExpression();
			if(expression == null) throw new processing.parser.TokenizerSyntaxError("Invalid assignment left-hand side.",this.tokenizer);
			statements.push(processing.parser.Statement.SAssignment(processing.parser.Statement.SReference(processing.parser.Statement.SLiteral(identifier)),expression));
		}
	} while(this.tokenizer.match(processing.parser.Token.TComma));
	this.tokenizer.match(processing.parser.Token.TSemicolon,null,true);
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
processing.parser.Parser.prototype.parseVisibility = function() {
	$s.push("processing.parser.Parser::parseVisibility");
	var $spos = $s.length;
	if(this.tokenizer.match(processing.parser.Token.TKeyword("private"))) {
		var $tmp = processing.parser.Visibility.VPrivate;
		$s.pop();
		return $tmp;
	}
	this.tokenizer.match(processing.parser.Token.TKeyword("public"));
	{
		var $tmp = processing.parser.Visibility.VPublic;
		$s.pop();
		return $tmp;
	}
	$s.pop();
}
processing.parser.Parser.prototype.recursiveReduceExpression = function(operators,operands,precedence) {
	$s.push("processing.parser.Parser::recursiveReduceExpression");
	var $spos = $s.length;
	if(precedence == null) precedence = 0;
	while(operators.length > 0 && this.lookupOperatorPrecedence(operators[operators.length - 1]) > precedence) this.reduceExpression(operators,operands);
	$s.pop();
}
processing.parser.Parser.prototype.reduceExpression = function(operators,operands) {
	$s.push("processing.parser.Parser::reduceExpression");
	var $spos = $s.length;
	var $e = (operators.pop());
	switch( $e[1] ) {
	case 0:
	var operator = $e[2];
	{
		var $e = (operator);
		switch( $e[1] ) {
		case 0:
		case 1:
		case 2:
		case 3:
		{
			var a = operands.pop();
			operands.push(processing.parser.Statement.SOperation(operator,a));
		}break;
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
		{
			var b = operands.pop(), a = operands.pop();
			operands.push(processing.parser.Statement.SOperation(operator,a,b));
		}break;
		}
	}break;
	case 1:
	var operator = $e[2];
	{
		var value = operands.pop(), reference = operands.pop();
		if(Type.enumConstructor(reference) != "SReference") throw new processing.parser.TokenizerSyntaxError("Invalid assignment left-hand side.",this.tokenizer);
		if(operator != null) value = processing.parser.Statement.SOperation(operator,reference,value);
		operands.push(processing.parser.Statement.SAssignment(reference,value));
	}break;
	case 2:
	{
		null;
	}break;
	case 3:
	var type = $e[2];
	{
		null;
	}break;
	case 4:
	var operator = $e[2];
	{
		null;
	}break;
	case 5:
	var operator = $e[2];
	{
		var reference = operands.pop();
		if(Type.enumConstructor(reference) != "SReference") throw new processing.parser.TokenizerSyntaxError("Invalid assignment left-hand side.",this.tokenizer);
		operands.push(processing.parser.Statement.SPostfix(reference,processing.parser.Statement.SAssignment(reference,processing.parser.Statement.SOperation(operator,reference,processing.parser.Statement.SLiteral(1)))));
	}break;
	case 6:
	{
		var identifier = operands.pop(), base = operands.pop();
		operands.push(processing.parser.Statement.SReference(identifier,base));
	}break;
	case 7:
	var index = $e[2];
	{
		null;
	}break;
	case 8:
	var args = $e[2];
	{
		var method = operands.pop();
		operands.push(processing.parser.Statement.SCall(method,args));
	}break;
	}
	$s.pop();
}
processing.parser.Parser.prototype.scanOperand = function(operators,operands,required) {
	$s.push("processing.parser.Parser::scanOperand");
	var $spos = $s.length;
	if(required == null) required = false;
	var token = this.tokenizer.peek();
	var $e = (token);
	switch( $e[1] ) {
	case 3:
	var value = $e[2];
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SReference(processing.parser.Statement.SLiteral(value)));
	}break;
	case 5:
	var value = $e[2];
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SLiteral(value));
	}break;
	case 6:
	var value = $e[2];
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SLiteral(value));
	}break;
	case 7:
	var value = $e[2];
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SLiteral(value));
	}break;
	case 8:
	var value = $e[2];
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SLiteral(value));
	}break;
	case 17:
	{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SArrayLiteral(this.parseList()));
		this.tokenizer.match(processing.parser.Token.TBraceClose,null,true);
	}break;
	default:{
		if(required) throw new processing.parser.TokenizerSyntaxError("Missing operand",this.tokenizer);
		{
			$s.pop();
			return false;
		}
	}break;
	}
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
processing.parser.Parser.prototype.scanOperator = function(operators,operands,required) {
	$s.push("processing.parser.Parser::scanOperator");
	var $spos = $s.length;
	if(required == null) required = false;
	var token = this.tokenizer.peek();
	var $e = (token);
	switch( $e[1] ) {
	case 4:
	var opToken = $e[2];
	{
		this.tokenizer.get();
		if(opToken == "++" || opToken == "--") {
			var operator = processing.parser.ParserOperator.PPostfix(this.lookupOperatorType(opToken));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
			{
				var $tmp = this.scanOperand(operators,operands);
				$s.pop();
				return $tmp;
			}
		}
		else if(this.isAssignmentOperator(opToken)) {
			var operator = ((opToken == "=")?processing.parser.ParserOperator.PAssignment():processing.parser.ParserOperator.PAssignment(this.lookupOperatorType(opToken)));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
		}
		else {
			var operator = processing.parser.ParserOperator.POperator(this.lookupOperatorType(opToken));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
		}
	}break;
	case 14:
	{
		this.tokenizer.get();
		var operator = processing.parser.ParserOperator.PDot;
		this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
		operators.push(operator);
		this.tokenizer.match("TIdentifier",null,true);
		operands.push(processing.parser.Statement.SLiteral(Type.enumParameters(this.tokenizer.currentToken)[0]));
		this.reduceExpression(operators,operands);
		{
			var $tmp = this.scanOperator(operators,operands);
			$s.pop();
			return $tmp;
		}
	}break;
	case 10:
	{
		this.tokenizer.match(processing.parser.Token.TParenOpen,null,true);
		var args = this.parseList();
		this.tokenizer.match(processing.parser.Token.TParenClose,null,true);
		var operator = processing.parser.ParserOperator.PCall(args);
		this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
		operators.push(operator);
		{
			var $tmp = this.scanOperator(operators,operands);
			$s.pop();
			return $tmp;
		}
	}break;
	default:{
		if(required) throw new processing.parser.TokenizerSyntaxError("Missing operator",this.tokenizer);
		{
			$s.pop();
			return false;
		}
	}break;
	}
	{
		$s.pop();
		return true;
	}
	$s.pop();
}
processing.parser.Parser.prototype.tokenizer = null;
processing.parser.Parser.prototype.__class__ = processing.parser.Parser;
processing.parser.ParserScope = { __ename__ : ["processing","parser","ParserScope"], __constructs__ : ["PScript","PClass","PBlock"] }
processing.parser.ParserScope.PBlock = ["PBlock",2];
processing.parser.ParserScope.PBlock.toString = $estr;
processing.parser.ParserScope.PBlock.__enum__ = processing.parser.ParserScope;
processing.parser.ParserScope.PClass = ["PClass",1];
processing.parser.ParserScope.PClass.toString = $estr;
processing.parser.ParserScope.PClass.__enum__ = processing.parser.ParserScope;
processing.parser.ParserScope.PScript = ["PScript",0];
processing.parser.ParserScope.PScript.toString = $estr;
processing.parser.ParserScope.PScript.__enum__ = processing.parser.ParserScope;
processing.parser.ParserOperator = { __ename__ : ["processing","parser","ParserOperator"], __constructs__ : ["POperator","PAssignment","PNew","PCast","PPrefix","PPostfix","PDot","PArrayAccess","PCall"] }
processing.parser.ParserOperator.PArrayAccess = function(index) { var $x = ["PArrayAccess",7,index]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PAssignment = function(operator) { var $x = ["PAssignment",1,operator]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PCall = function(args) { var $x = ["PCall",8,args]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PCast = function(type) { var $x = ["PCast",3,type]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PDot = ["PDot",6];
processing.parser.ParserOperator.PDot.toString = $estr;
processing.parser.ParserOperator.PDot.__enum__ = processing.parser.ParserOperator;
processing.parser.ParserOperator.PNew = ["PNew",2];
processing.parser.ParserOperator.PNew.toString = $estr;
processing.parser.ParserOperator.PNew.__enum__ = processing.parser.ParserOperator;
processing.parser.ParserOperator.POperator = function(operator) { var $x = ["POperator",0,operator]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PPostfix = function(operator) { var $x = ["PPostfix",5,operator]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PPrefix = function(operator) { var $x = ["PPrefix",4,operator]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
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
processing.parser.Statement = { __ename__ : ["processing","parser","Statement"], __constructs__ : ["SArrayAccess","SArrayInstantiation","SArrayLiteral","SAssignment","SBlock","SBreak","SCall","SCast","SConditional","SContinue","SLiteral","SLoop","SObjectInstantiation","SOperation","SPostfix","SReference","SReturn","SThisReference"] }
processing.parser.Statement.SArrayAccess = function(reference,index) { var $x = ["SArrayAccess",0,reference,index]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SArrayInstantiation = function(type,sizes) { var $x = ["SArrayInstantiation",1,type,sizes]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SArrayLiteral = function(values) { var $x = ["SArrayLiteral",2,values]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SAssignment = function(reference,value) { var $x = ["SAssignment",3,reference,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SBlock = function(statements,definitions) { var $x = ["SBlock",4,statements,definitions]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SBreak = function(level) { var $x = ["SBreak",5,level]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SCall = function(method,args) { var $x = ["SCall",6,method,args]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SCast = function(type,expression) { var $x = ["SCast",7,type,expression]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SConditional = function(condition,thenBlock,elseBlock) { var $x = ["SConditional",8,condition,thenBlock,elseBlock]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SContinue = function(level) { var $x = ["SContinue",9,level]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SLiteral = function(value) { var $x = ["SLiteral",10,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SLoop = function(condition,body) { var $x = ["SLoop",11,condition,body]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SObjectInstantiation = function(method,args) { var $x = ["SObjectInstantiation",12,method,args]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SOperation = function(type,leftOperand,rightOperand) { var $x = ["SOperation",13,type,leftOperand,rightOperand]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SPostfix = function(reference,postfix) { var $x = ["SPostfix",14,reference,postfix]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReference = function(identifier,base) { var $x = ["SReference",15,identifier,base]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReturn = function(value) { var $x = ["SReturn",16,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SThisReference = ["SThisReference",17];
processing.parser.Statement.SThisReference.toString = $estr;
processing.parser.Statement.SThisReference.__enum__ = processing.parser.Statement;
processing.parser.Definition = { __ename__ : ["processing","parser","Definition"], __constructs__ : ["DVariable","DFunction","DClass"] }
processing.parser.Definition.DClass = function(identifier,visibility,isStatic,body) { var $x = ["DClass",2,identifier,visibility,isStatic,body]; $x.__enum__ = processing.parser.Definition; $x.toString = $estr; return $x; }
processing.parser.Definition.DFunction = function(identifier,visibility,isStatic,type,params,body) { var $x = ["DFunction",1,identifier,visibility,isStatic,type,params,body]; $x.__enum__ = processing.parser.Definition; $x.toString = $estr; return $x; }
processing.parser.Definition.DVariable = function(identifier,visibility,isStatic,type) { var $x = ["DVariable",0,identifier,visibility,isStatic,type]; $x.__enum__ = processing.parser.Definition; $x.toString = $estr; return $x; }
processing.parser.Visibility = { __ename__ : ["processing","parser","Visibility"], __constructs__ : ["VPublic","VPrivate"] }
processing.parser.Visibility.VPrivate = ["VPrivate",1];
processing.parser.Visibility.VPrivate.toString = $estr;
processing.parser.Visibility.VPrivate.__enum__ = processing.parser.Visibility;
processing.parser.Visibility.VPublic = ["VPublic",0];
processing.parser.Visibility.VPublic.toString = $estr;
processing.parser.Visibility.VPublic.__enum__ = processing.parser.Visibility;
processing.parser.Operator = { __ename__ : ["processing","parser","Operator"], __constructs__ : ["OpNot","OpBitwiseNot","OpUnaryPlus","OpUnaryMinus","OpOr","OpAnd","OpBitwiseOr","OpBitwiseXor","OpBitwiseAnd","OpEqual","OpUnequal","OpLessThan","OpLessThanOrEqual","OpGreaterThan","OpGreaterThanOrEqual","OpInstanceOf","OpLeftShift","OpRightShift","OpZeroRightShift","OpPlus","OpMinus","OpMultiply","OpDivide","OpModulus"] }
processing.parser.Operator.OpAnd = ["OpAnd",5];
processing.parser.Operator.OpAnd.toString = $estr;
processing.parser.Operator.OpAnd.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpBitwiseAnd = ["OpBitwiseAnd",8];
processing.parser.Operator.OpBitwiseAnd.toString = $estr;
processing.parser.Operator.OpBitwiseAnd.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpBitwiseNot = ["OpBitwiseNot",1];
processing.parser.Operator.OpBitwiseNot.toString = $estr;
processing.parser.Operator.OpBitwiseNot.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpBitwiseOr = ["OpBitwiseOr",6];
processing.parser.Operator.OpBitwiseOr.toString = $estr;
processing.parser.Operator.OpBitwiseOr.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpBitwiseXor = ["OpBitwiseXor",7];
processing.parser.Operator.OpBitwiseXor.toString = $estr;
processing.parser.Operator.OpBitwiseXor.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpDivide = ["OpDivide",22];
processing.parser.Operator.OpDivide.toString = $estr;
processing.parser.Operator.OpDivide.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpEqual = ["OpEqual",9];
processing.parser.Operator.OpEqual.toString = $estr;
processing.parser.Operator.OpEqual.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpGreaterThan = ["OpGreaterThan",13];
processing.parser.Operator.OpGreaterThan.toString = $estr;
processing.parser.Operator.OpGreaterThan.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpGreaterThanOrEqual = ["OpGreaterThanOrEqual",14];
processing.parser.Operator.OpGreaterThanOrEqual.toString = $estr;
processing.parser.Operator.OpGreaterThanOrEqual.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpInstanceOf = ["OpInstanceOf",15];
processing.parser.Operator.OpInstanceOf.toString = $estr;
processing.parser.Operator.OpInstanceOf.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpLeftShift = ["OpLeftShift",16];
processing.parser.Operator.OpLeftShift.toString = $estr;
processing.parser.Operator.OpLeftShift.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpLessThan = ["OpLessThan",11];
processing.parser.Operator.OpLessThan.toString = $estr;
processing.parser.Operator.OpLessThan.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpLessThanOrEqual = ["OpLessThanOrEqual",12];
processing.parser.Operator.OpLessThanOrEqual.toString = $estr;
processing.parser.Operator.OpLessThanOrEqual.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpMinus = ["OpMinus",20];
processing.parser.Operator.OpMinus.toString = $estr;
processing.parser.Operator.OpMinus.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpModulus = ["OpModulus",23];
processing.parser.Operator.OpModulus.toString = $estr;
processing.parser.Operator.OpModulus.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpMultiply = ["OpMultiply",21];
processing.parser.Operator.OpMultiply.toString = $estr;
processing.parser.Operator.OpMultiply.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpNot = ["OpNot",0];
processing.parser.Operator.OpNot.toString = $estr;
processing.parser.Operator.OpNot.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpOr = ["OpOr",4];
processing.parser.Operator.OpOr.toString = $estr;
processing.parser.Operator.OpOr.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpPlus = ["OpPlus",19];
processing.parser.Operator.OpPlus.toString = $estr;
processing.parser.Operator.OpPlus.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpRightShift = ["OpRightShift",17];
processing.parser.Operator.OpRightShift.toString = $estr;
processing.parser.Operator.OpRightShift.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpUnaryMinus = ["OpUnaryMinus",3];
processing.parser.Operator.OpUnaryMinus.toString = $estr;
processing.parser.Operator.OpUnaryMinus.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpUnaryPlus = ["OpUnaryPlus",2];
processing.parser.Operator.OpUnaryPlus.toString = $estr;
processing.parser.Operator.OpUnaryPlus.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpUnequal = ["OpUnequal",10];
processing.parser.Operator.OpUnequal.toString = $estr;
processing.parser.Operator.OpUnequal.__enum__ = processing.parser.Operator;
processing.parser.Operator.OpZeroRightShift = ["OpZeroRightShift",18];
processing.parser.Operator.OpZeroRightShift.toString = $estr;
processing.parser.Operator.OpZeroRightShift.__enum__ = processing.parser.Operator;
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
$_ = {}
js.Boot.__res = {}
$s = [];
$e = [];
js.Boot.__init();
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
		$s.push("IntIter::next");
		var $spos = $s.length;
		{
			var $tmp = isFinite(i);
			$s.pop();
			return $tmp;
		}
		$s.pop();
	}
	Math.isNaN = function(i) {
		$s.push("IntIter::next");
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
js.Lib.onerror = null;
processing.parser.TokenizerRegexList.WHITESPACE = new EReg("^\\s+","");
processing.parser.TokenizerRegexList.COMMENT = new EReg("^/(?:\\*(?:.|\\n|\\r)*?\\*/|/.*)","");
processing.parser.TokenizerRegexList.NEWLINES = new EReg("\\n","g");
processing.parser.TokenizerRegexList.EOF = new EReg("^$","");
processing.parser.TokenizerRegexList.COLOR = new EReg("^(?:0[xX]|#)([\\da-fA-F]{6}|[\\da-fA-F]{8})","");
processing.parser.TokenizerRegexList.FLOAT = new EReg("^\\d+(?:\\.\\d*)?[fF]|^\\d+\\.\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|^\\.\\d+(?:[eE][-+]?\\d+)?","");
processing.parser.TokenizerRegexList.INTEGER = new EReg("^0[xX][\\da-fA-F]+|^0[0-7]*|^\\d+","");
processing.parser.TokenizerRegexList.KEYWORD = new EReg("^(break|class|case|catch|const|continue|default|do|else|enum|false|finally|for|function|if|new|null|public|private|return|static|switch|this|throw|true|try|var|while|with)\\b","");
processing.parser.TokenizerRegexList.TYPE = new EReg("^(boolean|char|void|float|int)\\b","");
processing.parser.TokenizerRegexList.IDENTIFIER = new EReg("^\\w+","");
processing.parser.TokenizerRegexList.CHAR = new EReg("^'(?:[^']|\\\\.|\\\\u[0-9A-Fa-f]{4})'","");
processing.parser.TokenizerRegexList.STRING = new EReg("^\"(?:\\\\.|[^\"])*\"|^'(?:[^']|\\\\.)*'","");
processing.parser.TokenizerRegexList.OPERATOR = new EReg("^(\\n|\\|\\||&&|[!=]=|<<|<=|>>>?|>=|\\+\\+|--|[|^&<>+\\-*/%!~]|(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=(?!=)|in\\b|instanceof\\b)","");
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
processing.parser.Parser.IS_ASSIGNMENT_OPERATOR = new EReg("^(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=$","");
