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
processing = {}
processing.compiler = {}
processing.compiler.ICompiler = function() { }
processing.compiler.ICompiler.__name__ = ["processing","compiler","ICompiler"];
processing.compiler.ICompiler.prototype.compile = null;
processing.compiler.ICompiler.prototype.__class__ = processing.compiler.ICompiler;
processing.compiler.JavaScriptCompiler = function(p) { if( p === $_ ) return; {
	null;
}}
processing.compiler.JavaScriptCompiler.__name__ = ["processing","compiler","JavaScriptCompiler"];
processing.compiler.JavaScriptCompiler.prototype.compile = function(code) {
	return this.serializeStatement(code);
}
processing.compiler.JavaScriptCompiler.prototype.serializeDefinition = function(definition,scope) {
	var $e = (definition);
	switch( $e[1] ) {
	case 0:
	var type = $e[5], isStatic = $e[4], visibility = $e[3], identifier = $e[2];
	{
		return (((scope != null) && Type.enumConstructor(scope) == "SClass"?"this.":"var ")) + identifier + " = 0;";
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
		var func = "function " + identifier + "(" + paramKeys.join(", ") + ") {\n" + this.serializeStatement(body) + "\n}";
		return (((scope != null) && Type.enumConstructor(scope) == "SClass")?"addMethod(this, \"" + ((identifier == Type.enumParameters(scope)[0]?"__construct":identifier)) + "\", " + func + ");":identifier + " = " + func + ";");
	}break;
	case 2:
	var body = $e[5], isStatic = $e[4], visibility = $e[3], identifier = $e[2];
	{
		return "function " + identifier + "() {\nwith (this) {\n" + this.serializeStatement(body,processing.compiler.CompilerScope.SClass(identifier)) + "\n}\nthis.__construct && this.__construct.apply(this, arguments);\n } ";
	}break;
	}
}
processing.compiler.JavaScriptCompiler.prototype.serializeExpression = function(expression) {
	var $e = (expression);
	switch( $e[1] ) {
	case 0:
	var index = $e[3], reference = $e[2];
	{
		return this.serializeExpression(reference) + "[" + this.serializeExpression(index) + "]";
	}break;
	case 1:
	var sizes = $e[3], type = $e[2];
	{
		var source = new Array();
		{
			var _g = 0;
			while(_g < sizes.length) {
				var size = sizes[_g];
				++_g;
				source.push(this.serializeExpression(size));
			}
		}
		return "new ArrayList(" + source.join(", ") + ")";
	}break;
	case 2:
	var values = $e[2];
	{
		var source = new Array();
		{
			var _g = 0;
			while(_g < values.length) {
				var value = values[_g];
				++_g;
				source.push(this.serializeExpression(value));
			}
		}
		return "[" + source.join(", ") + "]";
	}break;
	case 3:
	var value = $e[3], reference = $e[2];
	{
		return this.serializeExpression(reference) + " = " + this.serializeExpression(value);
	}break;
	case 4:
	var args = $e[3], method = $e[2];
	{
		var source = new Array();
		{
			var _g = 0;
			while(_g < args.length) {
				var arg = args[_g];
				++_g;
				source.push(this.serializeExpression(arg));
			}
		}
		return this.serializeExpression(method) + "(" + source.join(", ") + ")";
	}break;
	case 5:
	var expression1 = $e[3], type = $e[2];
	{
		if(new EReg("^(boolean|char|void|float|int)$","").match(type.type) && (type.dimensions == 0)) return type.type + "(" + this.serializeExpression(expression1) + ")";
		return this.serializeExpression(expression1);
	}break;
	case 6:
	var elseStatement = $e[4], thenStatement = $e[3], condition = $e[2];
	{
		return "((" + this.serializeExpression(condition) + ") ? (" + this.serializeExpression(thenStatement) + ") : (" + this.serializeExpression(elseStatement) + "))";
	}break;
	case 10:
	var type = $e[3], reference = $e[2];
	{
		return function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 0:
			{
				$r = "(++" + $this.serializeExpression(reference) + ")";
			}break;
			case 1:
			{
				$r = "(--" + $this.serializeExpression(reference) + ")";
			}break;
			default:{
				$r = null;
			}break;
			}
			return $r;
		}(this);
	}break;
	case 11:
	var type = $e[3], reference = $e[2];
	{
		return function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 0:
			{
				$r = "(" + $this.serializeExpression(reference) + "++)";
			}break;
			case 1:
			{
				$r = "(" + $this.serializeExpression(reference) + "--)";
			}break;
			default:{
				$r = null;
			}break;
			}
			return $r;
		}(this);
	}break;
	case 7:
	var value = $e[2];
	{
		return (Std["is"](value,String)?"\"" + value + "\"":value);
	}break;
	case 8:
	var args = $e[3], method = $e[2];
	{
		var source = new Array();
		if(args != null) {
			var _g = 0;
			while(_g < args.length) {
				var arg = args[_g];
				++_g;
				source.push(this.serializeExpression(arg));
			}
		}
		return "new " + this.serializeExpression(method) + "(" + source.join(", ") + ")";
	}break;
	case 9:
	var rightOperand = $e[4], leftOperand = $e[3], type = $e[2];
	{
		if(rightOperand != null) return "(" + this.serializeExpression(leftOperand) + this.serializeOperator(type) + this.serializeExpression(rightOperand) + ")";
		else return "(" + this.serializeOperator(type) + this.serializeExpression(leftOperand) + ")";
	}break;
	case 12:
	var base = $e[3], identifier = $e[2];
	{
		if(base == null) return identifier;
		else return "(" + this.serializeExpression(base) + ")." + identifier;
	}break;
	case 13:
	{
		return "this";
	}break;
	}
}
processing.compiler.JavaScriptCompiler.prototype.serializeOperator = function(operator) {
	return function($this) {
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
}
processing.compiler.JavaScriptCompiler.prototype.serializeStatement = function(statement,scope) {
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var definitions = $e[3], statements = $e[2];
	{
		var source = new Array();
		source.push("// definitions");
		{
			var _g = 0;
			while(_g < definitions.length) {
				var definition = definitions[_g];
				++_g;
				source.push(this.serializeDefinition(definition,scope));
			}
		}
		source.push("// statements");
		{
			var _g = 0;
			while(_g < statements.length) {
				var statement1 = statements[_g];
				++_g;
				source.push(this.serializeStatement(statement1));
			}
		}
		return source.join("\n");
	}break;
	case 1:
	var label = $e[2];
	{
		return "break" + ((label == null?"":" " + label)) + ";";
	}break;
	case 2:
	var elseBlock = $e[4], thenBlock = $e[3], condition = $e[2];
	{
		var source = new Array();
		source.push("if (" + this.serializeExpression(condition) + ") {");
		{
			var _g = 0;
			while(_g < thenBlock.length) {
				var statement1 = thenBlock[_g];
				++_g;
				source.push(this.serializeStatement(statement1));
			}
		}
		source.push("} else {");
		{
			var _g = 0;
			while(_g < elseBlock.length) {
				var statement1 = elseBlock[_g];
				++_g;
				source.push(this.serializeStatement(statement1));
			}
		}
		source.push("}");
		return source.join("\n");
	}break;
	case 3:
	var label = $e[2];
	{
		return "continue" + ((label == null?"":" " + label)) + ";";
	}break;
	case 4:
	var expression = $e[2];
	{
		return this.serializeExpression(expression) + ";";
	}break;
	case 5:
	var body = $e[3], condition = $e[2];
	{
		var source = new Array();
		source.push("while (" + this.serializeExpression(condition) + ") {");
		{
			var _g = 0;
			while(_g < body.length) {
				var statement1 = body[_g];
				++_g;
				source.push(this.serializeStatement(statement1));
			}
		}
		source.push("}");
		return source.join("\n");
	}break;
	case 6:
	var value = $e[2];
	{
		return "return" + ((value == null?"":" " + this.serializeExpression(value))) + ";";
	}break;
	}
}
processing.compiler.JavaScriptCompiler.prototype.__class__ = processing.compiler.JavaScriptCompiler;
processing.compiler.JavaScriptCompiler.__interfaces__ = [processing.compiler.ICompiler];
processing.compiler.CompilerScope = { __ename__ : ["processing","compiler","CompilerScope"], __constructs__ : ["SClass","SBlock"] }
processing.compiler.CompilerScope.SBlock = ["SBlock",1];
processing.compiler.CompilerScope.SBlock.toString = $estr;
processing.compiler.CompilerScope.SBlock.__enum__ = processing.compiler.CompilerScope;
processing.compiler.CompilerScope.SClass = function(identifier) { var $x = ["SClass",0,identifier]; $x.__enum__ = processing.compiler.CompilerScope; $x.toString = $estr; return $x; }
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
processing.parser.SimpleEReg = function(r,opt) { if( r === $_ ) return; {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
}}
processing.parser.SimpleEReg.__name__ = ["processing","parser","SimpleEReg"];
processing.parser.SimpleEReg.prototype.match = function(s) {
	this.r.m = this.r.exec(s);
	this.r.s = s;
	return (this.r.m != null);
}
processing.parser.SimpleEReg.prototype.matched = function(n) {
	return (this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
}
processing.parser.SimpleEReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length}
}
processing.parser.SimpleEReg.prototype.r = null;
processing.parser.SimpleEReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
}
processing.parser.SimpleEReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
}
processing.parser.SimpleEReg.prototype.__class__ = processing.parser.SimpleEReg;
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
processing.parser.Tokenizer.prototype.clearState = function() {
	this.states.pop();
}
processing.parser.Tokenizer.prototype.compareTokens = function(from,to) {
	return (Type.enumEq(from,to) || (Type.enumConstructor(from) == to));
}
processing.parser.Tokenizer.prototype.createSyntaxError = function(message) {
	var error = new processing.parser.TokenizerSyntaxError(message);
	error.source = this.source;
	error.cursor = this.cursor;
	error.line = this.getCurrentLineNumber();
	return error;
}
processing.parser.Tokenizer.prototype.current = function() {
	return this.currentToken;
}
processing.parser.Tokenizer.prototype.currentToken = null;
processing.parser.Tokenizer.prototype.cursor = null;
processing.parser.Tokenizer.prototype.getCurrentLineNumber = function() {
	return processing.parser.Tokenizer.regexes.NEWLINES.split(this.source.substr(0,this.cursor)).length + 1;
}
processing.parser.Tokenizer.prototype.hasNext = function() {
	return !this.match(processing.parser.Token.TEof);
}
processing.parser.Tokenizer.prototype.load = function(s) {
	this.source = s;
	this.cursor = 0;
	this.currentToken = null;
	this.states = [];
}
processing.parser.Tokenizer.prototype.match = function(to,mustMatch) {
	if(mustMatch == null) mustMatch = false;
	this.pushState();
	var token = this.next();
	if(this.compareTokens(token,to)) {
		this.clearState();
		return true;
	}
	else if(mustMatch) throw this.createSyntaxError("Must match " + to + ", found " + token);
	this.popState();
	return false;
}
processing.parser.Tokenizer.prototype.next = function() {
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
		this.currentToken = processing.parser.Token.TChar(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 2)).charCodeAt(0));
	}
	else if((regex = processing.parser.Tokenizer.regexes.STRING).match(input)) {
		this.currentToken = processing.parser.Token.TString(this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 2)));
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
	else {
		throw this.createSyntaxError("Illegal token " + input);
	}
	this.cursor += regex.matched(0).length;
	return this.currentToken;
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
	this.pushState();
	var token = this.currentToken;
	{
		var _g = 0;
		while(_g < lookAhead) {
			var i = _g++;
			token = this.next();
		}
	}
	this.popState();
	return token;
}
processing.parser.Tokenizer.prototype.peekMatch = function(to,lookAhead) {
	if(lookAhead == null) lookAhead = 1;
	return this.compareTokens(this.peek(lookAhead),to);
}
processing.parser.Tokenizer.prototype.popState = function() {
	var state = this.states.pop();
	this.cursor = state.cursor;
	this.currentToken = state.current;
}
processing.parser.Tokenizer.prototype.pushState = function() {
	this.states.push({ cursor : this.cursor, current : this.currentToken});
}
processing.parser.Tokenizer.prototype.source = null;
processing.parser.Tokenizer.prototype.states = null;
processing.parser.Tokenizer.prototype.__class__ = processing.parser.Tokenizer;
processing.parser.TokenizerSyntaxError = function(message) { if( message === $_ ) return; {
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
processing.evaluator = {}
processing.evaluator.Evaluator = function(_contexts) { if( _contexts === $_ ) return; {
	this.contexts = (_contexts != null?_contexts:[]);
}}
processing.evaluator.Evaluator.__name__ = ["processing","evaluator","Evaluator"];
processing.evaluator.Evaluator.prototype.contexts = null;
processing.evaluator.Evaluator.prototype.evaluate = function(code) {
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
	return evaluator(compiled,this.contexts);
}
processing.evaluator.Evaluator.prototype.__class__ = processing.evaluator.Evaluator;
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
processing.parser.Parser = function(p) { if( p === $_ ) return; {
	this.tokenizer = new processing.parser.Tokenizer();
}}
processing.parser.Parser.__name__ = ["processing","parser","Parser"];
processing.parser.Parser.prototype.isAssignmentOperator = function(operator) {
	return processing.parser.Parser.IS_ASSIGNMENT_OPERATOR.match(operator);
}
processing.parser.Parser.prototype.lookupIncrementType = function(operator) {
	switch(operator) {
	case "++":{
		return processing.parser.IncrementType.IIncrement;
	}break;
	case "--":{
		return processing.parser.IncrementType.IDecrement;
	}break;
	default:{
		throw "Unknown increment operator \"" + operator + "\"";
	}break;
	}
}
processing.parser.Parser.prototype.lookupOperatorPrecedence = function(operator) {
	return function($this) {
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
			$r = 13;
		}break;
		case 2:
		{
			$r = 14;
		}break;
		case 3:
		{
			$r = 15;
		}break;
		case 4:
		{
			$r = 15;
		}break;
		case 5:
		{
			$r = 15;
		}break;
		case 6:
		{
			$r = 15;
		}break;
		default:{
			$r = null;
		}break;
		}
		return $r;
	}(this);
}
processing.parser.Parser.prototype.lookupOperatorType = function(operator,scanOperand) {
	if(scanOperand == null) scanOperand = false;
	switch(operator) {
	case "!":{
		return processing.parser.Operator.OpNot;
	}break;
	case "~":{
		return processing.parser.Operator.OpBitwiseNot;
	}break;
	case "||":{
		return processing.parser.Operator.OpOr;
	}break;
	case "&&":{
		return processing.parser.Operator.OpAnd;
	}break;
	case "|":case "|=":{
		return processing.parser.Operator.OpBitwiseOr;
	}break;
	case "^":case "^=":{
		return processing.parser.Operator.OpBitwiseXor;
	}break;
	case "&":case "&=":{
		return processing.parser.Operator.OpBitwiseAnd;
	}break;
	case "==":{
		return processing.parser.Operator.OpEqual;
	}break;
	case "!=":{
		return processing.parser.Operator.OpUnequal;
	}break;
	case "<":{
		return processing.parser.Operator.OpLessThan;
	}break;
	case "<=":{
		return processing.parser.Operator.OpLessThanOrEqual;
	}break;
	case ">":{
		return processing.parser.Operator.OpGreaterThan;
	}break;
	case ">=":{
		return processing.parser.Operator.OpGreaterThanOrEqual;
	}break;
	case "instanceof":{
		return processing.parser.Operator.OpInstanceOf;
	}break;
	case "<<":case "<<=":{
		return processing.parser.Operator.OpLeftShift;
	}break;
	case ">>":case ">>=":{
		return processing.parser.Operator.OpRightShift;
	}break;
	case ">>>":case ">>>=":{
		return processing.parser.Operator.OpZeroRightShift;
	}break;
	case "+":case "+=":case "++":{
		return (scanOperand?processing.parser.Operator.OpUnaryPlus:processing.parser.Operator.OpPlus);
	}break;
	case "-":case "-=":case "--":{
		return (scanOperand?processing.parser.Operator.OpUnaryMinus:processing.parser.Operator.OpMinus);
	}break;
	case "*":case "*=":{
		return processing.parser.Operator.OpMultiply;
	}break;
	case "/":case "/=":{
		return processing.parser.Operator.OpDivide;
	}break;
	case "%":case "%=":{
		return processing.parser.Operator.OpModulus;
	}break;
	default:{
		throw "Unknown operator \"" + operator + "\"";
	}break;
	}
}
processing.parser.Parser.prototype.parse = function(code) {
	this.tokenizer.load(code);
	var statements = [], definitions = [];
	while(this.parseDefinition(processing.parser.ParserScope.PScript,statements,definitions) || this.parseStatement(statements,definitions)) continue;
	if(this.tokenizer.hasNext()) throw this.tokenizer.createSyntaxError("Script unterminated");
	return processing.parser.Statement.SBlock(statements,definitions);
}
processing.parser.Parser.prototype.parseClassDefinition = function(definitions) {
	var isStatic = this.tokenizer.match(processing.parser.Token.TKeyword("static"));
	var visibility = this.parseVisibility();
	this.tokenizer.match(processing.parser.Token.TKeyword("class"),true);
	this.tokenizer.match("TIdentifier",true);
	var identifier = Type.enumParameters(this.tokenizer.current())[0];
	this.tokenizer.match(processing.parser.Token.TBraceOpen,true);
	var cStatements = [], cDefinitions = [];
	while(this.parseDefinition(processing.parser.ParserScope.PClass(identifier),cStatements,cDefinitions)) continue;
	this.tokenizer.match(processing.parser.Token.TBraceClose,true);
	definitions.push(processing.parser.Definition.DClass(identifier,visibility,isStatic,processing.parser.Statement.SBlock(cStatements,cDefinitions)));
	return true;
}
processing.parser.Parser.prototype.parseDefinition = function(scope,statements,definitions) {
	this.tokenizer.pushState();
	if(scope != processing.parser.ParserScope.PBlock) {
		this.tokenizer.match(processing.parser.Token.TKeyword("static"));
		this.tokenizer.match(processing.parser.Token.TKeyword("private")) || this.tokenizer.match(processing.parser.Token.TKeyword("public"));
	}
	if((scope == processing.parser.ParserScope.PScript) && this.tokenizer.match(processing.parser.Token.TKeyword("class"))) {
		this.tokenizer.popState();
		return this.parseClassDefinition(definitions);
	}
	this.tokenizer.pushState();
	if((Type.enumConstructor(scope) == "PClass") && this.tokenizer.match(processing.parser.Token.TIdentifier(Type.enumParameters(scope)[0])) && this.tokenizer.match(processing.parser.Token.TParenOpen)) {
		this.tokenizer.popState();
		this.tokenizer.popState();
		return this.parseFunctionDefinition(definitions,true);
	}
	this.tokenizer.popState();
	if(this.parseType() == null) {
		this.tokenizer.popState();
		return false;
	}
	if(this.tokenizer.match("TIdentifier")) {
		if((scope != processing.parser.ParserScope.PBlock) && this.tokenizer.match(processing.parser.Token.TParenOpen)) {
			this.tokenizer.popState();
			return this.parseFunctionDefinition(definitions);
		}
		else if(scope != processing.parser.ParserScope.PScript) {
			this.tokenizer.popState();
			return this.parseVariableDefinition(statements,definitions);
		}
	}
	this.tokenizer.popState();
	return false;
}
processing.parser.Parser.prototype.parseExpression = function(required) {
	var operators = [], operands = [];
	this.scanOperand(operators,operands);
	if(operands.length == 0) if(required) throw this.tokenizer.createSyntaxError("Expected expression.");
	else return null;
	while(this.scanOperator(operators,operands)) this.scanOperand(operators,operands,true);
	this.recursiveReduceExpression(operators,operands);
	return operands[0];
}
processing.parser.Parser.prototype.parseFunctionDefinition = function(definitions,constructor) {
	if(constructor == null) constructor = false;
	var isStatic = this.tokenizer.match(processing.parser.Token.TKeyword("static"));
	var visibility = this.parseVisibility(), fType = null;
	if(!constructor) fType = this.parseType();
	this.tokenizer.match("TIdentifier",true);
	var identifier = Type.enumParameters(this.tokenizer.current())[0];
	this.tokenizer.match(processing.parser.Token.TParenOpen,true);
	var params = [];
	while(!this.tokenizer.peekMatch(processing.parser.Token.TParenClose)) {
		var type = this.parseType();
		if(type == null) throw this.tokenizer.createSyntaxError("Invalid formal parameter type");
		if(!this.tokenizer.match("TIdentifier")) throw this.tokenizer.createSyntaxError("Invalid formal parameter");
		var name = Type.enumParameters(this.tokenizer.current())[0];
		params.push({ name : name, type : type});
		if(!this.tokenizer.peekMatch(processing.parser.Token.TParenClose)) this.tokenizer.match(processing.parser.Token.TComma,true);
	}
	this.tokenizer.match(processing.parser.Token.TParenClose,true);
	this.tokenizer.match(processing.parser.Token.TBraceOpen,true);
	var fStatements = [], fDefinitions = [];
	while(this.parseStatement(fStatements,fDefinitions)) continue;
	this.tokenizer.match(processing.parser.Token.TBraceClose,true);
	definitions.push(processing.parser.Definition.DFunction(identifier,visibility,isStatic,fType,params,processing.parser.Statement.SBlock(fStatements,fDefinitions)));
	return true;
}
processing.parser.Parser.prototype.parseList = function() {
	var list = [];
	do {
		var expression = this.parseExpression(list.length > 0);
		if(expression == null) return list;
		list.push(expression);
	} while(this.tokenizer.match(processing.parser.Token.TComma));
	return list;
}
processing.parser.Parser.prototype.parseStatement = function(statements,definitions) {
	if(this.parseDefinition(processing.parser.ParserScope.PBlock,statements,definitions)) return true;
	if(this.tokenizer.match(processing.parser.Token.TKeyword("if"))) {
		this.tokenizer.match(processing.parser.Token.TParenOpen,true);
		var condition = this.parseExpression(true);
		this.tokenizer.match(processing.parser.Token.TParenClose,true);
		var thenBlock = [];
		if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
			while(this.parseStatement(thenBlock,definitions)) continue;
			this.tokenizer.match(processing.parser.Token.TBraceClose,true);
		}
		else if(!this.parseStatement(thenBlock,definitions)) throw this.tokenizer.createSyntaxError("Invalid expression in conditional.");
		var elseBlock = [];
		if(this.tokenizer.match(processing.parser.Token.TKeyword("else"))) {
			if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
				while(this.parseStatement(elseBlock,definitions)) continue;
				this.tokenizer.match(processing.parser.Token.TBraceClose,true);
			}
			else if(!this.parseStatement(elseBlock,definitions)) throw this.tokenizer.createSyntaxError("Invalid expression in conditional.");
		}
		statements.push(processing.parser.Statement.SConditional(condition,thenBlock,elseBlock));
	}
	else if(this.tokenizer.match(processing.parser.Token.TKeyword("while"))) {
		this.tokenizer.match(processing.parser.Token.TParenOpen,true);
		var condition = this.parseExpression(true);
		this.tokenizer.match(processing.parser.Token.TParenClose,true);
		var body = [];
		if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
			while(this.parseStatement(body,definitions)) continue;
			this.tokenizer.match(processing.parser.Token.TBraceClose,true);
		}
		else if(!this.parseStatement(body,definitions)) throw this.tokenizer.createSyntaxError("Invalid expression in for loop.");
		statements.push(processing.parser.Statement.SLoop(condition,body));
	}
	else if(this.tokenizer.match(processing.parser.Token.TKeyword("for"))) {
		this.tokenizer.match(processing.parser.Token.TParenOpen,true);
		if(!this.parseDefinition(processing.parser.ParserScope.PBlock,statements,definitions)) {
			var init = this.parseList();
			{
				var _g = 0;
				while(_g < init.length) {
					var statement = init[_g];
					++_g;
					statements.push(processing.parser.Statement.SExpression(statement));
				}
			}
			this.tokenizer.match(processing.parser.Token.TSemicolon,true);
		}
		var condition = this.parseExpression(false);
		if(condition == null) condition = processing.parser.Expression.ELiteral(true);
		this.tokenizer.match(processing.parser.Token.TSemicolon,true);
		var update = this.parseList();
		this.tokenizer.match(processing.parser.Token.TParenClose,true);
		var body = [];
		if(this.tokenizer.match(processing.parser.Token.TBraceOpen)) {
			while(this.parseStatement(body,definitions)) continue;
			this.tokenizer.match(processing.parser.Token.TBraceClose,true);
		}
		else if(!this.parseStatement(body,definitions)) throw this.tokenizer.createSyntaxError("Invalid expression in for loop.");
		{
			var _g = 0;
			while(_g < update.length) {
				var statement = update[_g];
				++_g;
				body.push(processing.parser.Statement.SExpression(statement));
			}
		}
		statements.push(processing.parser.Statement.SLoop(condition,body));
	}
	else if(this.tokenizer.match(processing.parser.Token.TKeyword("return"))) {
		statements.push(processing.parser.Statement.SReturn(this.parseExpression(false)));
	}
	else if(this.tokenizer.match(processing.parser.Token.TKeyword("break"))) {
		if(this.tokenizer.match("TIdentifier")) statements.push(processing.parser.Statement.SBreak(Type.enumParameters(this.tokenizer.current())[0]));
		else statements.push(processing.parser.Statement.SBreak());
	}
	else if(this.tokenizer.match(processing.parser.Token.TKeyword("continue"))) {
		if(this.tokenizer.match("TIdentifier")) statements.push(processing.parser.Statement.SContinue(Type.enumParameters(this.tokenizer.current())[0]));
		else statements.push(processing.parser.Statement.SContinue());
	}
	else {
		var expression = this.parseExpression(false);
		if(expression == null) return this.tokenizer.match(processing.parser.Token.TSemicolon);
		this.tokenizer.match(processing.parser.Token.TSemicolon,true);
		statements.push(processing.parser.Statement.SExpression(expression));
	}
	return true;
}
processing.parser.Parser.prototype.parseType = function() {
	this.tokenizer.pushState();
	var $e = (this.tokenizer.next());
	switch( $e[1] ) {
	case 2:
	case 3:
	var value = $e[2];
	{
		this.tokenizer.clearState();
		var dimensions = 0;
		while(this.tokenizer.match(processing.parser.Token.TDimensions)) dimensions++;
		return { type : value, dimensions : dimensions}
	}break;
	default:{
		this.tokenizer.popState();
		return null;
	}break;
	}
}
processing.parser.Parser.prototype.parseVariableDefinition = function(statements,definitions) {
	var isStatic = this.tokenizer.match(processing.parser.Token.TKeyword("static"));
	var visibility = this.parseVisibility();
	var vType = this.parseType();
	do {
		this.tokenizer.match("TIdentifier",true);
		var identifier = Type.enumParameters(this.tokenizer.current())[0];
		var vTypeDimensions = vType.dimensions;
		if(vTypeDimensions == 0) {
			while(this.tokenizer.match(processing.parser.Token.TDimensions)) vTypeDimensions++;
		}
		definitions.push(processing.parser.Definition.DVariable(identifier,visibility,isStatic,{ type : vType.type, dimensions : vTypeDimensions}));
		if(this.tokenizer.match(processing.parser.Token.TOperator("="))) {
			var expression = this.parseExpression(true);
			statements.push(processing.parser.Statement.SExpression(processing.parser.Expression.EAssignment(processing.parser.Expression.EReference(identifier),expression)));
		}
	} while(this.tokenizer.match(processing.parser.Token.TComma));
	this.tokenizer.match(processing.parser.Token.TSemicolon,true);
	return true;
}
processing.parser.Parser.prototype.parseVisibility = function() {
	if(this.tokenizer.match(processing.parser.Token.TKeyword("private"))) return processing.parser.Visibility.VPrivate;
	this.tokenizer.match(processing.parser.Token.TKeyword("public"));
	return processing.parser.Visibility.VPublic;
}
processing.parser.Parser.prototype.recursiveReduceExpression = function(operators,operands,precedence) {
	if(precedence == null) precedence = 0;
	while(operators.length > 0 && this.lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence) this.reduceExpression(operators,operands);
}
processing.parser.Parser.prototype.reduceExpression = function(operators,operands) {
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
			operands.push(processing.parser.Expression.EOperation(operator,a));
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
			operands.push(processing.parser.Expression.EOperation(operator,a,b));
		}break;
		}
	}break;
	case 1:
	var type = $e[2];
	{
		var expression = operands.pop();
		operands.push(processing.parser.Expression.ECast(type,expression));
	}break;
	case 2:
	var type = $e[2];
	{
		var reference = operands.pop();
		if(Type.enumConstructor(reference) != "EReference") throw this.tokenizer.createSyntaxError("Invalid assignment left-hand side.");
		operands.push(processing.parser.Expression.EPrefix(reference,type));
	}break;
	case 3:
	var type = $e[2];
	{
		var reference = operands.pop();
		if(Type.enumConstructor(reference) != "EReference") throw this.tokenizer.createSyntaxError("Invalid assignment left-hand side.");
		operands.push(processing.parser.Expression.EPostfix(reference,type));
	}break;
	case 4:
	var identifier = $e[2];
	{
		var base = operands.pop();
		operands.push(processing.parser.Expression.EReference(identifier,base));
	}break;
	case 5:
	var index = $e[2];
	{
		var reference = operands.pop();
		operands.push(processing.parser.Expression.EArrayAccess(reference,index));
	}break;
	case 6:
	var args = $e[2];
	{
		var method = operands.pop();
		operands.push(processing.parser.Expression.ECall(method,args));
	}break;
	}
}
processing.parser.Parser.prototype.scanOperand = function(operators,operands,required) {
	if(required == null) required = false;
	var token = this.tokenizer.peek();
	var $e = (token);
	switch( $e[1] ) {
	case 4:
	var opString = $e[2];
	{
		this.tokenizer.next();
		if(opString == "++" || opString == "--") {
			var operator = processing.parser.ParserOperator.PPrefix(this.lookupIncrementType(opString));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
			return this.scanOperand(operators,operands,required);
		}
		else {
			var operation = this.lookupOperatorType(opString,true);
			var $e = (operation);
			switch( $e[1] ) {
			case 0:
			case 1:
			case 2:
			case 3:
			{
				var operator = processing.parser.ParserOperator.POperator(operation);
				this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
				operators.push(operator);
				return this.scanOperand(operators,operands,required);
			}break;
			default:{
				throw this.tokenizer.createSyntaxError("Invalid operator.");
			}break;
			}
		}
	}break;
	case 2:
	var value = $e[2];
	{
		var type = this.parseType();
		operators.push(processing.parser.ParserOperator.PCast(type));
		this.tokenizer.match(processing.parser.Token.TParenOpen,true);
		var expression = this.parseExpression(true);
		this.tokenizer.match(processing.parser.Token.TParenClose,true);
		operands.push(expression);
	}break;
	case 3:
	var value = $e[2];
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.EReference(value));
	}break;
	case 1:
	var keyword = $e[2];
	{
		switch(keyword) {
		case "this":{
			this.tokenizer.next();
			operands.push(processing.parser.Expression.EThisReference);
		}break;
		case "null":{
			this.tokenizer.next();
			operands.push(processing.parser.Expression.ELiteral(null));
		}break;
		case "true":{
			this.tokenizer.next();
			operands.push(processing.parser.Expression.ELiteral(true));
		}break;
		case "false":{
			this.tokenizer.next();
			operands.push(processing.parser.Expression.ELiteral(false));
		}break;
		case "new":{
			this.tokenizer.next();
			if((this.tokenizer.peekMatch("TIdentifier") || this.tokenizer.peekMatch("TType")) && this.tokenizer.peekMatch(processing.parser.Token.TBracketOpen,2)) {
				var type = this.parseType();
				var sizes = [];
				while(this.tokenizer.match(processing.parser.Token.TBracketOpen)) {
					sizes.push(this.parseExpression(true));
					this.tokenizer.match(processing.parser.Token.TBracketClose,true);
				}
				operands.push(processing.parser.Expression.EArrayInstantiation(type,sizes));
			}
			else {
				this.tokenizer.match("TIdentifier",true);
				var reference = Type.enumParameters(this.tokenizer.current())[0];
				var args = null;
				if(this.tokenizer.match(processing.parser.Token.TParenOpen)) {
					args = this.parseList();
					this.tokenizer.match(processing.parser.Token.TParenClose);
				}
				if(args == null) operands.push(processing.parser.Expression.EObjectInstantiation(processing.parser.Expression.EReference(reference)));
				else operands.push(processing.parser.Expression.EObjectInstantiation(processing.parser.Expression.EReference(reference),args));
			}
		}break;
		default:{
			if(required) throw this.tokenizer.createSyntaxError("Missing operand");
			return false;
		}break;
		}
	}break;
	case 5:
	var value = $e[2];
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.ELiteral(value));
	}break;
	case 6:
	var value = $e[2];
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.ELiteral(value));
	}break;
	case 7:
	var value = $e[2];
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.ELiteral(value));
	}break;
	case 8:
	var value = $e[2];
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.ELiteral(value));
	}break;
	case 17:
	{
		this.tokenizer.next();
		operands.push(processing.parser.Expression.EArrayLiteral(this.parseList()));
		this.tokenizer.match(processing.parser.Token.TBraceClose,true);
	}break;
	case 10:
	{
		this.tokenizer.next();
		this.tokenizer.pushState();
		var isPrimitive = this.tokenizer.peekMatch("TType");
		var type = this.parseType();
		if((type != null) && this.tokenizer.match(processing.parser.Token.TParenClose)) {
			operators.push(processing.parser.ParserOperator.PCast(type));
			if((isPrimitive || !(this.tokenizer.peekMatch(processing.parser.Token.TOperator("+")) && !this.tokenizer.peekMatch(processing.parser.Token.TOperator("-")))) && this.scanOperand(operators,operands)) {
				this.tokenizer.clearState();
				return true;
			}
			operators.pop();
		}
		this.tokenizer.popState();
		operands.push(this.parseExpression(true));
		if(!this.tokenizer.match(processing.parser.Token.TParenClose)) throw this.tokenizer.createSyntaxError("Missing ) in parenthetical");
	}break;
	default:{
		if(required) throw this.tokenizer.createSyntaxError("Missing operand");
		return false;
	}break;
	}
	return true;
}
processing.parser.Parser.prototype.scanOperator = function(operators,operands,required) {
	if(required == null) required = false;
	var token = this.tokenizer.peek();
	var $e = (token);
	switch( $e[1] ) {
	case 4:
	var opToken = $e[2];
	{
		this.tokenizer.next();
		if(opToken == "++" || opToken == "--") {
			var operator = processing.parser.ParserOperator.PPostfix(this.lookupIncrementType(opToken));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
			return this.scanOperator(operators,operands,required);
		}
		else if(this.isAssignmentOperator(opToken)) {
			this.recursiveReduceExpression(operators,operands);
			var reference = operands.pop();
			if((Type.enumConstructor(reference) != "EReference") && (Type.enumConstructor(reference) != "EArrayAccess")) throw this.tokenizer.createSyntaxError("Invalid assignment left-hand side.");
			var value = this.parseExpression(true);
			if(opToken != "=") value = processing.parser.Expression.EOperation(this.lookupOperatorType(opToken),reference,value);
			operands.push(processing.parser.Expression.EAssignment(reference,value));
			return false;
		}
		else {
			var operator = processing.parser.ParserOperator.POperator(this.lookupOperatorType(opToken));
			this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
			operators.push(operator);
		}
	}break;
	case 14:
	{
		this.tokenizer.next();
		this.tokenizer.match("TIdentifier",true);
		var operator = processing.parser.ParserOperator.PDot(Type.enumParameters(this.tokenizer.current())[0]);
		this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
		operators.push(operator);
		return this.scanOperator(operators,operands,required);
	}break;
	case 12:
	{
		this.tokenizer.match(processing.parser.Token.TBracketOpen,true);
		var index = this.parseExpression(true);
		this.tokenizer.match(processing.parser.Token.TBracketClose,true);
		var operator = processing.parser.ParserOperator.PArrayAccess(index);
		this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
		operators.push(operator);
		return this.scanOperator(operators,operands,required);
	}break;
	case 19:
	{
		this.tokenizer.next();
		this.recursiveReduceExpression(operators,operands);
		var conditional = operands.pop();
		var thenExpression = this.parseExpression(true);
		this.tokenizer.match(processing.parser.Token.TDoubleDot,true);
		var elseExpression = this.parseExpression(true);
		operands.push(processing.parser.Expression.EConditional(conditional,thenExpression,elseExpression));
		return false;
	}break;
	case 10:
	{
		this.tokenizer.match(processing.parser.Token.TParenOpen,true);
		var args = this.parseList();
		this.tokenizer.match(processing.parser.Token.TParenClose,true);
		var operator = processing.parser.ParserOperator.PCall(args);
		this.recursiveReduceExpression(operators,operands,this.lookupOperatorPrecedence(operator));
		operators.push(operator);
		return this.scanOperator(operators,operands);
	}break;
	default:{
		if(required) throw this.tokenizer.createSyntaxError("Missing operator");
		return false;
	}break;
	}
	return true;
}
processing.parser.Parser.prototype.tokenizer = null;
processing.parser.Parser.prototype.__class__ = processing.parser.Parser;
processing.parser.ParserScope = { __ename__ : ["processing","parser","ParserScope"], __constructs__ : ["PScript","PClass","PBlock"] }
processing.parser.ParserScope.PBlock = ["PBlock",2];
processing.parser.ParserScope.PBlock.toString = $estr;
processing.parser.ParserScope.PBlock.__enum__ = processing.parser.ParserScope;
processing.parser.ParserScope.PClass = function(identifier) { var $x = ["PClass",1,identifier]; $x.__enum__ = processing.parser.ParserScope; $x.toString = $estr; return $x; }
processing.parser.ParserScope.PScript = ["PScript",0];
processing.parser.ParserScope.PScript.toString = $estr;
processing.parser.ParserScope.PScript.__enum__ = processing.parser.ParserScope;
processing.parser.ParserOperator = { __ename__ : ["processing","parser","ParserOperator"], __constructs__ : ["POperator","PCast","PPrefix","PPostfix","PDot","PArrayAccess","PCall"] }
processing.parser.ParserOperator.PArrayAccess = function(index) { var $x = ["PArrayAccess",5,index]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PCall = function(args) { var $x = ["PCall",6,args]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PCast = function(type) { var $x = ["PCast",1,type]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PDot = function(identifier) { var $x = ["PDot",4,identifier]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.POperator = function(operator) { var $x = ["POperator",0,operator]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PPostfix = function(type) { var $x = ["PPostfix",3,type]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
processing.parser.ParserOperator.PPrefix = function(type) { var $x = ["PPrefix",2,type]; $x.__enum__ = processing.parser.ParserOperator; $x.toString = $estr; return $x; }
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
processing.parser.Statement = { __ename__ : ["processing","parser","Statement"], __constructs__ : ["SBlock","SBreak","SConditional","SContinue","SExpression","SLoop","SReturn"] }
processing.parser.Statement.SBlock = function(statements,definitions) { var $x = ["SBlock",0,statements,definitions]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SBreak = function(label) { var $x = ["SBreak",1,label]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SConditional = function(condition,thenBlock,elseBlock) { var $x = ["SConditional",2,condition,thenBlock,elseBlock]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SContinue = function(label) { var $x = ["SContinue",3,label]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SExpression = function(expression) { var $x = ["SExpression",4,expression]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SLoop = function(condition,body) { var $x = ["SLoop",5,condition,body]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReturn = function(value) { var $x = ["SReturn",6,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Expression = { __ename__ : ["processing","parser","Expression"], __constructs__ : ["EArrayAccess","EArrayInstantiation","EArrayLiteral","EAssignment","ECall","ECast","EConditional","ELiteral","EObjectInstantiation","EOperation","EPrefix","EPostfix","EReference","EThisReference"] }
processing.parser.Expression.EArrayAccess = function(reference,index) { var $x = ["EArrayAccess",0,reference,index]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EArrayInstantiation = function(type,sizes) { var $x = ["EArrayInstantiation",1,type,sizes]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EArrayLiteral = function(values) { var $x = ["EArrayLiteral",2,values]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EAssignment = function(reference,value) { var $x = ["EAssignment",3,reference,value]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.ECall = function(method,args) { var $x = ["ECall",4,method,args]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.ECast = function(type,expression) { var $x = ["ECast",5,type,expression]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EConditional = function(condition,thenExpression,elseExpression) { var $x = ["EConditional",6,condition,thenExpression,elseExpression]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.ELiteral = function(value) { var $x = ["ELiteral",7,value]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EObjectInstantiation = function(method,args) { var $x = ["EObjectInstantiation",8,method,args]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EOperation = function(type,leftOperand,rightOperand) { var $x = ["EOperation",9,type,leftOperand,rightOperand]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EPostfix = function(reference,type) { var $x = ["EPostfix",11,reference,type]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EPrefix = function(reference,type) { var $x = ["EPrefix",10,reference,type]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EReference = function(identifier,base) { var $x = ["EReference",12,identifier,base]; $x.__enum__ = processing.parser.Expression; $x.toString = $estr; return $x; }
processing.parser.Expression.EThisReference = ["EThisReference",13];
processing.parser.Expression.EThisReference.toString = $estr;
processing.parser.Expression.EThisReference.__enum__ = processing.parser.Expression;
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
processing.parser.IncrementType = { __ename__ : ["processing","parser","IncrementType"], __constructs__ : ["IIncrement","IDecrement"] }
processing.parser.IncrementType.IDecrement = ["IDecrement",1];
processing.parser.IncrementType.IDecrement.toString = $estr;
processing.parser.IncrementType.IDecrement.__enum__ = processing.parser.IncrementType;
processing.parser.IncrementType.IIncrement = ["IIncrement",0];
processing.parser.IncrementType.IIncrement.toString = $estr;
processing.parser.IncrementType.IIncrement.__enum__ = processing.parser.IncrementType;
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
processing.parser.TokenizerRegexList.WHITESPACE = new processing.parser.SimpleEReg("^\\s+","");
processing.parser.TokenizerRegexList.COMMENT = new processing.parser.SimpleEReg("^/(?:\\*(?:.|\\n|\\r)*?\\*/|/.*)","");
processing.parser.TokenizerRegexList.NEWLINES = new processing.parser.SimpleEReg("\\n","g");
processing.parser.TokenizerRegexList.EOF = new processing.parser.SimpleEReg("^$","");
processing.parser.TokenizerRegexList.COLOR = new processing.parser.SimpleEReg("^(?:0[xX]|#)([\\da-fA-F]{6}|[\\da-fA-F]{8})","");
processing.parser.TokenizerRegexList.FLOAT = new processing.parser.SimpleEReg("^\\d+(?:\\.\\d*)?[fF]|^\\d+\\.\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|^\\.\\d+(?:[eE][-+]?\\d+)?","");
processing.parser.TokenizerRegexList.INTEGER = new processing.parser.SimpleEReg("^0[xX][\\da-fA-F]+|^0[0-7]*|^\\d+","");
processing.parser.TokenizerRegexList.KEYWORD = new processing.parser.SimpleEReg("^(break|class|case|catch|const|continue|default|do|else|enum|false|finally|for|function|if|new|null|public|private|return|static|switch|this|throw|true|try|var|while|with)\\b","");
processing.parser.TokenizerRegexList.TYPE = new processing.parser.SimpleEReg("^(boolean|char|void|float|int)\\b","");
processing.parser.TokenizerRegexList.IDENTIFIER = new processing.parser.SimpleEReg("^\\w+","");
processing.parser.TokenizerRegexList.CHAR = new processing.parser.SimpleEReg("^'(?:[^']|\\\\.|\\\\u[0-9A-Fa-f]{4})'","");
processing.parser.TokenizerRegexList.STRING = new processing.parser.SimpleEReg("^\"(?:\\\\.|[^\"])*\"|^'(?:[^']|\\\\.)*'","");
processing.parser.TokenizerRegexList.OPERATOR = new processing.parser.SimpleEReg("^(\\n|\\|\\||&&|[!=]=|(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=(?!=)|<<|<=|>>>?|>=|\\+\\+|--|[|^&<>+\\-*/%!~]|instanceof\\b)","");
processing.parser.TokenizerRegexList.PUNCUATION = new processing.parser.SimpleEReg("^\\[\\]|^[;,?:.[\\]{}()]","");
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
processing.parser.Parser.IS_ASSIGNMENT_OPERATOR = new processing.parser.SimpleEReg("^(\\||\\^|&|<<|>>>?|\\+|\\-|\\*|/|%)?=$","");
