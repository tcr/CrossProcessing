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
	catch( $e2 ) {
		{
			var e = $e2;
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
	{ var $it3 = it;
	while( $it3.hasNext() ) { var i = $it3.next();
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
processing = {}
processing.parser = {}
processing.parser.AssignmentTokenTypeList = function(p) { if( p === $_ ) return; {
	Hash.apply(this,[]);
	this.set("|",processing.parser.TokenType.BITWISE_OR);
	this.set("^",processing.parser.TokenType.BITWISE_XOR);
	this.set("&",processing.parser.TokenType.BITWISE_AND);
	this.set("<<",processing.parser.TokenType.LSH);
	this.set(">>>",processing.parser.TokenType.URSH);
	this.set(">>",processing.parser.TokenType.RSH);
	this.set("+",processing.parser.TokenType.PLUS);
	this.set("-",processing.parser.TokenType.MINUS);
	this.set("*",processing.parser.TokenType.MUL);
	this.set("/",processing.parser.TokenType.DIV);
	this.set("%",processing.parser.TokenType.MOD);
}}
processing.parser.AssignmentTokenTypeList.__name__ = ["processing","parser","AssignmentTokenTypeList"];
processing.parser.AssignmentTokenTypeList.__super__ = Hash;
for(var k in Hash.prototype ) processing.parser.AssignmentTokenTypeList.prototype[k] = Hash.prototype[k];
processing.parser.AssignmentTokenTypeList.prototype.__class__ = processing.parser.AssignmentTokenTypeList;
processing.parser.KeywordTokenTypeList = function(p) { if( p === $_ ) return; {
	Hash.apply(this,[]);
	this.set("break",processing.parser.TokenType.BREAK);
	this.set("class",processing.parser.TokenType.CLASS);
	this.set("case",processing.parser.TokenType.CASE);
	this.set("catch",processing.parser.TokenType.CATCH);
	this.set("const",processing.parser.TokenType.CONST);
	this.set("continue",processing.parser.TokenType.CONTINUE);
	this.set("debugger",processing.parser.TokenType.DEBUGGER);
	this.set("default",processing.parser.TokenType.DEFAULT);
	this.set("delete",processing.parser.TokenType.DELETE);
	this.set("do",processing.parser.TokenType.DO);
	this.set("else",processing.parser.TokenType.ELSE);
	this.set("enum",processing.parser.TokenType.ENUM);
	this.set("false",processing.parser.TokenType.FALSE);
	this.set("finally",processing.parser.TokenType.FINALLY);
	this.set("for",processing.parser.TokenType.FOR);
	this.set("function",processing.parser.TokenType.FUNCTION);
	this.set("if",processing.parser.TokenType.IF);
	this.set("in",processing.parser.TokenType.IN);
	this.set("instanceof",processing.parser.TokenType.INSTANCEOF);
	this.set("new",processing.parser.TokenType.NEW);
	this.set("null",processing.parser.TokenType.NULL);
	this.set("public",processing.parser.TokenType.PUBLIC);
	this.set("private",processing.parser.TokenType.PRIVATE);
	this.set("return",processing.parser.TokenType.RETURN);
	this.set("static",processing.parser.TokenType.STATIC);
	this.set("switch",processing.parser.TokenType.SWITCH);
	this.set("this",processing.parser.TokenType.THIS);
	this.set("throw",processing.parser.TokenType.THROW);
	this.set("true",processing.parser.TokenType.TRUE);
	this.set("try",processing.parser.TokenType.TRY);
	this.set("typeof",processing.parser.TokenType.TYPEOF);
	this.set("var",processing.parser.TokenType.VAR);
	this.set("while",processing.parser.TokenType.WHILE);
	this.set("with",processing.parser.TokenType.WITH);
}}
processing.parser.KeywordTokenTypeList.__name__ = ["processing","parser","KeywordTokenTypeList"];
processing.parser.KeywordTokenTypeList.__super__ = Hash;
for(var k in Hash.prototype ) processing.parser.KeywordTokenTypeList.prototype[k] = Hash.prototype[k];
processing.parser.KeywordTokenTypeList.prototype.__class__ = processing.parser.KeywordTokenTypeList;
processing.parser.OperatorTokenTypeList = function(p) { if( p === $_ ) return; {
	Hash.apply(this,[]);
	this.set("\n",processing.parser.TokenType.NEWLINE);
	this.set(";",processing.parser.TokenType.SEMICOLON);
	this.set("\n",processing.parser.TokenType.NEWLINE);
	this.set(";",processing.parser.TokenType.SEMICOLON);
	this.set(",",processing.parser.TokenType.COMMA);
	this.set("?",processing.parser.TokenType.HOOK);
	this.set(":",processing.parser.TokenType.COLON);
	this.set("||",processing.parser.TokenType.OR);
	this.set("&&",processing.parser.TokenType.AND);
	this.set("|",processing.parser.TokenType.BITWISE_OR);
	this.set("^",processing.parser.TokenType.BITWISE_XOR);
	this.set("&",processing.parser.TokenType.BITWISE_AND);
	this.set("===",processing.parser.TokenType.STRICT_EQ);
	this.set("==",processing.parser.TokenType.EQ);
	this.set("=",processing.parser.TokenType.ASSIGN);
	this.set("!==",processing.parser.TokenType.STRICT_NE);
	this.set("!=",processing.parser.TokenType.NE);
	this.set("<<",processing.parser.TokenType.LSH);
	this.set("<=",processing.parser.TokenType.LE);
	this.set("<",processing.parser.TokenType.LT);
	this.set(">>>",processing.parser.TokenType.URSH);
	this.set(">>",processing.parser.TokenType.RSH);
	this.set(">=",processing.parser.TokenType.GE);
	this.set(">",processing.parser.TokenType.GT);
	this.set("++",processing.parser.TokenType.INCREMENT);
	this.set("--",processing.parser.TokenType.DECREMENT);
	this.set("+",processing.parser.TokenType.PLUS);
	this.set("-",processing.parser.TokenType.MINUS);
	this.set("*",processing.parser.TokenType.MUL);
	this.set("/",processing.parser.TokenType.DIV);
	this.set("%",processing.parser.TokenType.MOD);
	this.set("!",processing.parser.TokenType.NOT);
	this.set("~",processing.parser.TokenType.BITWISE_NOT);
	this.set(".",processing.parser.TokenType.DOT);
	this.set("[",processing.parser.TokenType.LEFT_BRACKET);
	this.set("]",processing.parser.TokenType.RIGHT_BRACKET);
	this.set("{",processing.parser.TokenType.LEFT_CURLY);
	this.set("}",processing.parser.TokenType.RIGHT_CURLY);
	this.set("(",processing.parser.TokenType.LEFT_PAREN);
	this.set(")",processing.parser.TokenType.RIGHT_PAREN);
}}
processing.parser.OperatorTokenTypeList.__name__ = ["processing","parser","OperatorTokenTypeList"];
processing.parser.OperatorTokenTypeList.__super__ = Hash;
for(var k in Hash.prototype ) processing.parser.OperatorTokenTypeList.prototype[k] = Hash.prototype[k];
processing.parser.OperatorTokenTypeList.prototype.__class__ = processing.parser.OperatorTokenTypeList;
processing.parser.TypeTokenTypeList = function(p) { if( p === $_ ) return; {
	Hash.apply(this,[]);
	this.set("boolean",processing.parser.TokenType.BOOLEAN);
	this.set("char",processing.parser.TokenType.CHAR);
	this.set("void",processing.parser.TokenType.VOID);
	this.set("float",processing.parser.TokenType.FLOAT);
	this.set("int",processing.parser.TokenType.INT);
}}
processing.parser.TypeTokenTypeList.__name__ = ["processing","parser","TypeTokenTypeList"];
processing.parser.TypeTokenTypeList.__super__ = Hash;
for(var k in Hash.prototype ) processing.parser.TypeTokenTypeList.prototype[k] = Hash.prototype[k];
processing.parser.TypeTokenTypeList.prototype.__class__ = processing.parser.TypeTokenTypeList;
processing.parser.TokenType = function(_value,_precedence,_arity,_type) { if( _value === $_ ) return; {
	if(_type == null) _type = 0;
	if(_arity == null) _arity = 0;
	if(_precedence == null) _precedence = 0;
	if(_value == null) _value = "";
	this.value = _value;
	this.precedence = _precedence;
	this.arity = _arity;
	this.type = _type;
}}
processing.parser.TokenType.__name__ = ["processing","parser","TokenType"];
processing.parser.TokenType.getConstant = function(token) {
	haxe.Log.trace("THIS IS DEPRECATED",{ fileName : "TokenType.hx", lineNumber : 38, className : "processing.parser.TokenType", methodName : "getConstant"});
	return token.toString();
}
processing.parser.TokenType.prototype.arity = null;
processing.parser.TokenType.prototype.precedence = null;
processing.parser.TokenType.prototype.toString = function() {
	return this.value;
}
processing.parser.TokenType.prototype.type = null;
processing.parser.TokenType.prototype.value = null;
processing.parser.TokenType.prototype.valueOf = function() {
	return this.value;
}
processing.parser.TokenType.prototype.__class__ = processing.parser.TokenType;
haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
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
processing.interpreter = {}
processing.interpreter.Interpreter = function(p) { if( p === $_ ) return; {
	null;
}}
processing.interpreter.Interpreter.__name__ = ["processing","interpreter","Interpreter"];
processing.interpreter.Interpreter.prototype.interpret = function(statement,context) {
	var $e = (statement);
	switch( $e[1] ) {
	case 0:
	var sizes = $e[3], type = $e[2];
	{
		var array = [], current = 0;
		sizes.reverse();
		{
			var _g = 0;
			while(_g < sizes.length) {
				var size = sizes[_g];
				++_g;
				{
					var _g2 = 0, _g1 = this.interpret(size,context);
					while(_g2 < _g1) {
						var i = _g2++;
						array.push((Std["is"](current,array)?current.copy():current));
					}
				}
				current = array;
				array = [];
			}
		}
		return current;
	}break;
	case 1:
	var values = $e[2];
	{
		var array = new Array();
		{
			var _g1 = 0, _g = values.length;
			while(_g1 < _g) {
				var i = _g1++;
				array[i] = this.interpret(values[i],context);
			}
		}
		return array;
	}break;
	case 2:
	var value = $e[3], reference = $e[2];
	{
		var ref = this.interpret(reference,context);
		return ref.base[ref.identifier] = this.interpret(value,context);
	}break;
	case 3:
	var statements = $e[2];
	{
		var retValue = null;
		{
			var _g = 0;
			while(_g < statements.length) {
				var i = statements[_g];
				++_g;
				retValue = this.interpret(i,context);
			}
		}
		return retValue;
	}break;
	case 4:
	var level = $e[2];
	{
		throw new processing.interpreter.Break(level);
	}break;
	case 5:
	var args = $e[3], method = $e[2];
	{
		var parsedArgs = [];
		{
			var _g = 0;
			while(_g < args.length) {
				var arg = args[_g];
				++_g;
				parsedArgs.push(this.interpret(arg,context));
			}
		}
		return this.interpret(method,context).apply(context.scope,parsedArgs);
	}break;
	case 6:
	var expression = $e[3], type = $e[2];
	{
		var value = this.interpret(expression,context);
		if(type.dimensions == 0) {
			switch(type.type) {
			case processing.parser.TokenType.VOID:{
				return function($this) {
					var $r;
					var tmp = value;
					$r = (Std["is"](tmp,Void)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this);
			}break;
			case processing.parser.TokenType.INT:{
				return function($this) {
					var $r;
					var tmp = value;
					$r = (Std["is"](tmp,Int)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this);
			}break;
			case processing.parser.TokenType.FLOAT:{
				return function($this) {
					var $r;
					var tmp = value;
					$r = (Std["is"](tmp,Float)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this);
			}break;
			case processing.parser.TokenType.BOOLEAN:{
				return function($this) {
					var $r;
					var tmp = value;
					$r = (Std["is"](tmp,Bool)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this);
			}break;
			case processing.parser.TokenType.CHAR:{
				return (Std["is"](value,String)?value.charCodeAt(0):value);
			}break;
			}
		}
		return value;
	}break;
	case 7:
	var privateBody = $e[5], publicBody = $e[4], constructorBody = $e[3], identifier = $e[2];
	{
		return;
	}break;
	case 8:
	var elseBlock = $e[4], thenBlock = $e[3], condition = $e[2];
	{
		if(this.interpret(condition,context)) return this.interpret(thenBlock,context);
		else if(elseBlock != null) return this.interpret(elseBlock,context);
		return;
	}break;
	case 9:
	var level = $e[2];
	{
		throw new processing.interpreter.Continue(level);
	}break;
	case 10:
	var reference = $e[2];
	{
		var ref = this.interpret(reference,context);
		return ref.setValue(ref.getValue() - 1);
	}break;
	case 11:
	var body = $e[5], params = $e[4], type = $e[3], identifier = $e[2];
	{
		if(!context.hasField(identifier)) {
			context.setField(identifier,Reflect.makeVarArgs(function(arguments) {
				{
					var _g = 0, _g1 = function($this) {
						var $r;
						var tmp = context.getField("__" + identifier);
						$r = (Std["is"](tmp,Array)?tmp:function($this) {
							var $r;
							throw "Class cast error";
							return $r;
						}($this));
						return $r;
					}(this);
					while(_g < _g1.length) {
						var overload = _g1[_g];
						++_g;
						if(overload.params.length != arguments.length) continue;
						try {
							{
								var _g3 = 0, _g2 = overload.params.length;
								while(_g3 < _g2) {
									var i = _g3++;
									if(!Std["is"](arguments[i],overload.params[i].type)) throw false;
								}
							}
						}
						catch( $e4 ) {
							{
								var e = $e4;
								{
									continue;
								}
							}
						}
						return overload.method.apply(context.thisObject,arguments);
					}
				}
				throw "Function called without matching overload.";
			}));
			console.log('setField: __' + identifier);
			context.setField("__" + identifier,[]);
		}
		console.log('getField: __' + identifier);
		context.getField("__" + identifier).push({ params : params, type : type, method : Reflect.makeVarArgs(function(arguments) {
			var funcContext = new processing.interpreter.Scope({ },context);
			{
				var _g1 = 0, _g = params.length;
				while(_g1 < _g) {
					var i = _g1++;
					funcContext.setField(params[i].name,arguments[i]);
				}
			}
			var interpreter = new processing.interpreter.Interpreter();
			try {
				return interpreter.interpret(body,funcContext);
			}
			catch( $e5 ) {
				if( js.Boot.__instanceof($e5,processing.interpreter.Return) ) {
					var ret = $e5;
					{
						return interpreter.interpret(ret.value,funcContext);
					}
				} else throw($e5);
			}
		})});
		return;
	}break;
	case 12:
	var reference = $e[2];
	{
		var ref = this.interpret(reference,context);
		return ref.setValue(ref.getValue() + 1);
	}break;
	case 13:
	var value = $e[2];
	{
		return value;
	}break;
	case 14:
	var body = $e[3], condition = $e[2];
	{
		return function($this) {
			var $r;
			while($this.interpret(condition,context)) {
				try {
					$this.interpret(body,context);
				}
				catch( $e6 ) {
					if( js.Boot.__instanceof($e6,processing.interpreter.Break) ) {
						var b = $e6;
						{
							if(--b.level <= 0) throw b;
							break;
						}
					} else if( js.Boot.__instanceof($e6,processing.interpreter.Continue) ) {
						var c = $e6;
						{
							if(--c.level <= 0) throw c;
							continue;
						}
					} else throw($e6);
				}
			}
			return $r;
		}(this);
	}break;
	case 15:
	var args = $e[3], method = $e[2];
	{
		return;
	}break;
	case 16:
	var rightOperand = $e[4], leftOperand = $e[3], type = $e[2];
	{
		var a = this.interpret(leftOperand,context), b = null;
		if(rightOperand != null) b = this.interpret(rightOperand,context);
		switch(type) {
		case processing.parser.TokenType.NOT:{
			return !a;
		}break;
		case processing.parser.TokenType.BITWISE_NOT:{
			return ~a;
		}break;
		case processing.parser.TokenType.UNARY_PLUS:{
			return a;
		}break;
		case processing.parser.TokenType.UNARY_MINUS:{
			return -a;
		}break;
		case processing.parser.TokenType.OR:{
			return a || b;
		}break;
		case processing.parser.TokenType.AND:{
			return a && b;
		}break;
		case processing.parser.TokenType.BITWISE_OR:{
			return a | b;
		}break;
		case processing.parser.TokenType.BITWISE_XOR:{
			return a ^ b;
		}break;
		case processing.parser.TokenType.BITWISE_AND:{
			return a & b;
		}break;
		case processing.parser.TokenType.EQ:{
			return a == b;
		}break;
		case processing.parser.TokenType.NE:{
			return a != b;
		}break;
		case processing.parser.TokenType.LT:{
			return a < b;
		}break;
		case processing.parser.TokenType.LE:{
			return a <= b;
		}break;
		case processing.parser.TokenType.GT:{
			return a > b;
		}break;
		case processing.parser.TokenType.GE:{
			return a >= b;
		}break;
		case processing.parser.TokenType.IN:{
			return Reflect.hasField(b,a);
		}break;
		case processing.parser.TokenType.INSTANCEOF:{
			return Std["is"](a,b);
		}break;
		case processing.parser.TokenType.LSH:{
			return a << b;
		}break;
		case processing.parser.TokenType.RSH:{
			return a >> b;
		}break;
		case processing.parser.TokenType.URSH:{
			return a >>> b;
		}break;
		case processing.parser.TokenType.PLUS:{
			return a + b;
		}break;
		case processing.parser.TokenType.MINUS:{
			return a - b;
		}break;
		case processing.parser.TokenType.MUL:{
			return a * b;
		}break;
		case processing.parser.TokenType.DIV:{
			return a / b;
		}break;
		case processing.parser.TokenType.MOD:{
			return a % b;
		}break;
		default:{
			throw "Unrecognized expression operator.";
		}break;
		}
	}break;
	case 17:
	var sBase = $e[3], sIdentifier = $e[2];
	{
		var identifier = this.interpret(sIdentifier,context), base;
		if(sBase != null) {
			base = this.interpret(sBase,context);
		}
		else {
			var c = context;
			while(c != null && !Reflect.hasField(c.scope,identifier)) c = c.parent;
			if(c == null) return null;
			base = c.scope;
		}
		return new processing.interpreter.Reference(identifier,base);
	}break;
	case 18:
	var reference = $e[2];
	{
		var reference1 = this.interpret(reference,context);
		return (reference1 != null?reference1.getValue():null);
	}break;
	case 19:
	var value = $e[2];
	{
		throw new processing.interpreter.Return(this.interpret(value,context));
	}break;
	case 20:
	{
		var c = context;
		while(c != null && c.thisObject == null) c = c.parent;
		return (c == null?c.thisObject:null);
	}break;
	case 21:
	var type = $e[3], identifier = $e[2];
	{
		context.scope[identifier] = 0;
		return;
	}break;
	case 22:
	var statement1 = $e[2];
	{
		var value = this.interpret(statement1,context);
		if(Std["is"](value,processing.interpreter.Reference)) value = value.getValue();
		return value;
	}break;
	}
}
processing.interpreter.Interpreter.prototype.__class__ = processing.interpreter.Interpreter;
processing.interpreter.Reference = function(identifier,base) { if( identifier === $_ ) return; {
	this.identifier = identifier;
	this.base = base;
}}
processing.interpreter.Reference.__name__ = ["processing","interpreter","Reference"];
processing.interpreter.Reference.prototype.base = null;
processing.interpreter.Reference.prototype.getValue = function() {
	return Reflect.field(this.base,this.identifier);
}
processing.interpreter.Reference.prototype.identifier = null;
processing.interpreter.Reference.prototype.setValue = function(value) {
	return this.base[this.identifier] = value;
}
processing.interpreter.Reference.prototype.__class__ = processing.interpreter.Reference;
processing.interpreter.Break = function(level) { if( level === $_ ) return; {
	this.level = level;
}}
processing.interpreter.Break.__name__ = ["processing","interpreter","Break"];
processing.interpreter.Break.prototype.level = null;
processing.interpreter.Break.prototype.__class__ = processing.interpreter.Break;
processing.interpreter.Continue = function(level) { if( level === $_ ) return; {
	this.level = level;
}}
processing.interpreter.Continue.__name__ = ["processing","interpreter","Continue"];
processing.interpreter.Continue.prototype.level = null;
processing.interpreter.Continue.prototype.__class__ = processing.interpreter.Continue;
processing.interpreter.Return = function(value) { if( value === $_ ) return; {
	this.value = value;
}}
processing.interpreter.Return.__name__ = ["processing","interpreter","Return"];
processing.interpreter.Return.prototype.value = null;
processing.interpreter.Return.prototype.__class__ = processing.interpreter.Return;
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
	this.currentToken = this.peek();
	this.cursor = this.currentToken.start + this.currentToken.content.length;
	return this.currentToken;
}
processing.parser.Tokenizer.prototype.getCurrentLineNumber = function() {
	return this.getLineNumber(this.cursor);
}
processing.parser.Tokenizer.prototype.getLineNumber = function(searchCursor) {
	return processing.parser.Tokenizer.regexes.NEWLINES.split(this.source.substr(0,searchCursor)).length + 1;
}
processing.parser.Tokenizer.prototype.isDone = function() {
	return function($this) {
		var $r;
		var tmp = $this.match(processing.parser.TokenType.END);
		$r = (Std["is"](tmp,Bool)?tmp:function($this) {
			var $r;
			throw "Class cast error";
			return $r;
		}($this));
		return $r;
	}(this);
}
processing.parser.Tokenizer.prototype.line = null;
processing.parser.Tokenizer.prototype.load = function(s) {
	this.source = s;
	this.cursor = 0;
	this.scanOperand = true;
}
processing.parser.Tokenizer.prototype.match = function(matchType,mustMatch) {
	if(mustMatch == null) mustMatch = false;
	var doesMatch = (this.peek().type == matchType);
	if(doesMatch) this.get();
	else if(mustMatch) throw new processing.parser.TokenizerSyntaxError("Tokenizer: Must match " + processing.parser.TokenType.getConstant(matchType) + ", found " + processing.parser.TokenType.getConstant(this.peek().type),this);
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
processing.parser.Tokenizer.prototype.peek = function(lookAhead,onSameLine) {
	if(onSameLine == null) onSameLine = false;
	if(lookAhead == null) lookAhead = 1;
	var peekCursor = this.cursor, token = null, input = "", regex;
	while(lookAhead-- > 0) {
		while(true) {
			input = this.source.substr(peekCursor);
			if((regex = (onSameLine?processing.parser.Tokenizer.regexes.WHITESPACE_SAME_LINE:processing.parser.Tokenizer.regexes.WHITESPACE)).match(input) || (regex = processing.parser.Tokenizer.regexes.COMMENT).match(input)) peekCursor += regex.matched(0).length;
			else break;
		}
		if((regex = processing.parser.Tokenizer.regexes.EOF).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.END);
		}
		else if((regex = processing.parser.Tokenizer.regexes.COLOR).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.NUMBER,Std.parseInt("0x" + regex.matched(1)) + ((regex.matched(1).length == 6?-16777216:0)));
		}
		else if((regex = processing.parser.Tokenizer.regexes.FLOAT).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.NUMBER,Std.parseFloat(regex.matched(0)));
		}
		else if((regex = processing.parser.Tokenizer.regexes.INTEGER).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.NUMBER,Std.parseInt(regex.matched(0)));
		}
		else if((regex = processing.parser.Tokenizer.regexes.KEYWORD).match(input)) {
			if(processing.parser.TokenType.TYPES.exists(regex.matched(0))) token = new processing.parser.Token(processing.parser.TokenType.TYPE,processing.parser.TokenType.TYPES.get(regex.matched(0)));
			else if(processing.parser.TokenType.KEYWORDS.exists(regex.matched(0))) token = new processing.parser.Token(processing.parser.TokenType.KEYWORDS.get(regex.matched(0)),processing.parser.TokenType.KEYWORDS.get(regex.matched(0)).value);
			else token = new processing.parser.Token(processing.parser.TokenType.IDENTIFIER,regex.matched(0));
		}
		else if((regex = processing.parser.Tokenizer.regexes.ARRAY_DIMENSIONS).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.ARRAY_DIMENSION,regex.matched(0).length / 2);
		}
		else if((regex = processing.parser.Tokenizer.regexes.CHAR).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.CHAR,this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)).charCodeAt(0));
		}
		else if((regex = processing.parser.Tokenizer.regexes.STRING).match(input)) {
			token = new processing.parser.Token(processing.parser.TokenType.STRING,this.parseStringLiteral(regex.matched(0).substr(1,regex.matched(0).length - 1)));
		}
		else if((regex = processing.parser.Tokenizer.regexes.OPERATOR).match(input)) {
			var op = regex.matched(1);
			if(processing.parser.TokenType.ASSIGNMENT_OPS.exists(op) && regex.matched(2).length > 0) {
				token = new processing.parser.Token(processing.parser.TokenType.ASSIGN,op);
				token.assignOp = processing.parser.TokenType.OPS.get(op);
			}
			else {
				token = new processing.parser.Token(processing.parser.TokenType.OPS.get(op),op);
				if(this.scanOperand) {
					if(token.type == processing.parser.TokenType.PLUS) token.type = processing.parser.TokenType.UNARY_PLUS;
					if(token.type == processing.parser.TokenType.MINUS) token.type = processing.parser.TokenType.UNARY_MINUS;
				}
				token.assignOp = null;
			}
		}
		else {
			throw new processing.parser.TokenizerSyntaxError("Illegal token " + input,this);
		}
		token.content = regex.matched(0);
		token.start = peekCursor;
		token.line = this.getLineNumber(peekCursor);
		peekCursor += token.content.length;
	}
	return token;
}
processing.parser.Tokenizer.prototype.scanOperand = null;
processing.parser.Tokenizer.prototype.source = null;
processing.parser.Tokenizer.prototype.__class__ = processing.parser.Tokenizer;
processing.parser.Statement = { __ename__ : ["processing","parser","Statement"], __constructs__ : ["SArrayInstantiation","SArrayLiteral","SAssignment","SBlock","SBreak","SCall","SCast","SClassDefinition","SConditional","SContinue","SDecrement","SFunctionDefinition","SIncrement","SLiteral","SLoop","SObjectInstantiation","SOperation","SReference","SReferenceValue","SReturn","SThisReference","SVariableDefinition","SValue"] }
processing.parser.Statement.SArrayInstantiation = function(type,sizes) { var $x = ["SArrayInstantiation",0,type,sizes]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SArrayLiteral = function(values) { var $x = ["SArrayLiteral",1,values]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SAssignment = function(reference,value) { var $x = ["SAssignment",2,reference,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SBlock = function(statements) { var $x = ["SBlock",3,statements]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SBreak = function(level) { var $x = ["SBreak",4,level]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SCall = function(method,args) { var $x = ["SCall",5,method,args]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SCast = function(type,expression) { var $x = ["SCast",6,type,expression]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SClassDefinition = function(identifier,constructorBody,publicBody,privateBody) { var $x = ["SClassDefinition",7,identifier,constructorBody,publicBody,privateBody]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SConditional = function(condition,thenBlock,elseBlock) { var $x = ["SConditional",8,condition,thenBlock,elseBlock]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SContinue = function(level) { var $x = ["SContinue",9,level]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SDecrement = function(reference) { var $x = ["SDecrement",10,reference]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SFunctionDefinition = function(identifier,type,params,body) { var $x = ["SFunctionDefinition",11,identifier,type,params,body]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SIncrement = function(reference) { var $x = ["SIncrement",12,reference]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SLiteral = function(value) { var $x = ["SLiteral",13,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SLoop = function(condition,body) { var $x = ["SLoop",14,condition,body]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SObjectInstantiation = function(method,args) { var $x = ["SObjectInstantiation",15,method,args]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SOperation = function(type,leftOperand,rightOperand) { var $x = ["SOperation",16,type,leftOperand,rightOperand]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReference = function(identifier,base) { var $x = ["SReference",17,identifier,base]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReferenceValue = function(reference) { var $x = ["SReferenceValue",18,reference]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SReturn = function(value) { var $x = ["SReturn",19,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SThisReference = ["SThisReference",20];
processing.parser.Statement.SThisReference.toString = $estr;
processing.parser.Statement.SThisReference.__enum__ = processing.parser.Statement;
processing.parser.Statement.SValue = function(value) { var $x = ["SValue",22,value]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.Statement.SVariableDefinition = function(identifier,type) { var $x = ["SVariableDefinition",21,identifier,type]; $x.__enum__ = processing.parser.Statement; $x.toString = $estr; return $x; }
processing.parser.TokenizerSyntaxError = function(_message,tokenizer) { if( _message === $_ ) return; {
	if(_message == null) _message = "";
	this.source = tokenizer.source;
	this.line = tokenizer.getCurrentLineNumber();
	this.cursor = tokenizer.cursor;
	this.message = _message;
}}
processing.parser.TokenizerSyntaxError.__name__ = ["processing","parser","TokenizerSyntaxError"];
processing.parser.TokenizerSyntaxError.prototype.cursor = null;
processing.parser.TokenizerSyntaxError.prototype.line = null;
processing.parser.TokenizerSyntaxError.prototype.message = null;
processing.parser.TokenizerSyntaxError.prototype.source = null;
processing.parser.TokenizerSyntaxError.prototype.toString = function() {
	return this.message + "\nParsing error (line " + this.line + ", char " + this.cursor + ")";
}
processing.parser.TokenizerSyntaxError.prototype.__class__ = processing.parser.TokenizerSyntaxError;
processing.interpreter.Scope = function(s,p,t) { if( s === $_ ) return; {
	this.scope = ((s != null)?s:{ });
	this.parent = p;
	this.thisObject = t;
}}
processing.interpreter.Scope.__name__ = ["processing","interpreter","Scope"];
processing.interpreter.Scope.prototype.findDefinition = function(name) {
	return (this.hasField(name)?this:((this.parent != null?this.parent.findDefinition(name):null)));
}
processing.interpreter.Scope.prototype.getField = function(name,deep) {
	return (this.hasField(name)?Reflect.field(this.scope,name):((deep?this.parent.getField(name,deep):null)));
}
processing.interpreter.Scope.prototype.hasField = function(name,deep) {
	return Reflect.hasField(this.scope,name) || ((deep?this.parent.hasField(name,deep):false));
}
processing.interpreter.Scope.prototype.parent = null;
processing.interpreter.Scope.prototype.scope = null;
processing.interpreter.Scope.prototype.setField = function(name,value,deep) {
	if(!this.hasField(name) && deep) {
		var scope = this.findDefinition(name);
		if(scope != null) {
			scope.setField(name,value);
			return;
		}
	}
	this.scope[name] = value;
}
processing.interpreter.Scope.prototype.thisObject = null;
processing.interpreter.Scope.prototype.__class__ = processing.interpreter.Scope;
processing.parser.Type = function(t,d) { if( t === $_ ) return; {
	if(d == null) d = 0;
	this.type = t;
	this.dimensions = d;
}}
processing.parser.Type.__name__ = ["processing","parser","Type"];
processing.parser.Type.prototype.dimensions = null;
processing.parser.Type.prototype.type = null;
processing.parser.Type.prototype.__class__ = processing.parser.Type;
processing.evaluator = {}
processing.evaluator.Evaluator = function(_contexts) { if( _contexts === $_ ) return; {
	this.contexts = (_contexts != null?_contexts:[]);
}}
processing.evaluator.Evaluator.__name__ = ["processing","evaluator","Evaluator"];
processing.evaluator.Evaluator.prototype.contexts = null;
processing.evaluator.Evaluator.prototype.evaluate = function(code) {
	var parser = new processing.parser.Parser();
	var script = parser.parse(code);
	var globalScope = new processing.interpreter.Scope(), currentScope = globalScope;
	globalScope.thisObject = globalScope;
	{
		var _g = 0, _g1 = this.contexts;
		while(_g < _g1.length) {
			var context = _g1[_g];
			++_g;
			currentScope = new processing.interpreter.Scope(context,currentScope);
		}
	}
	var interpreter = new processing.interpreter.Interpreter();
	interpreter.interpret(script,currentScope);
}
processing.evaluator.Evaluator.prototype.__class__ = processing.evaluator.Evaluator;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it7 = arr.iterator();
	while( $it7.hasNext() ) { var t = $it7.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e8 ) {
		{
			var e = $e8;
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
		catch( $e9 ) {
			{
				var e = $e9;
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
processing.parser.Token = function(t,v,c,s,l,a) { if( t === $_ ) return; {
	if(l == null) l = 0;
	if(s == null) s = 0;
	if(c == null) c = "";
	this.type = t;
	this.value = v;
	this.start = s;
	this.content = c;
	this.line = l;
	this.assignOp = a;
}}
processing.parser.Token.__name__ = ["processing","parser","Token"];
processing.parser.Token.prototype.assignOp = null;
processing.parser.Token.prototype.content = null;
processing.parser.Token.prototype.debug = function() {
	haxe.Log.trace("token {",{ fileName : "Token.hx", lineNumber : 27, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("\ttype: " + processing.parser.TokenType.getConstant(this.type),{ fileName : "Token.hx", lineNumber : 28, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("\tvalue: \"" + this.value + "\"",{ fileName : "Token.hx", lineNumber : 29, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("\tstart: " + this.start,{ fileName : "Token.hx", lineNumber : 30, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("\tcontent: \"" + this.content + "\"",{ fileName : "Token.hx", lineNumber : 31, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("\tline: " + this.line,{ fileName : "Token.hx", lineNumber : 32, className : "processing.parser.Token", methodName : "debug"});
	haxe.Log.trace("}",{ fileName : "Token.hx", lineNumber : 33, className : "processing.parser.Token", methodName : "debug"});
}
processing.parser.Token.prototype.line = null;
processing.parser.Token.prototype.match = function(compareType) {
	return (this.type == compareType);
}
processing.parser.Token.prototype.start = null;
processing.parser.Token.prototype.type = null;
processing.parser.Token.prototype.value = null;
processing.parser.Token.prototype.__class__ = processing.parser.Token;
processing.parser.Parser = function(p) { if( p === $_ ) return; {
	this.tokenizer = new processing.parser.Tokenizer();
}}
processing.parser.Parser.__name__ = ["processing","parser","Parser"];
processing.parser.Parser.prototype.parse = function(code) {
	this.tokenizer.load(code);
	var script = this.parseBlock();
	if(!this.tokenizer.isDone()) throw new processing.parser.TokenizerSyntaxError("Syntax error",this.tokenizer);
	return script;
}
processing.parser.Parser.prototype.parseBlock = function(stopAt) {
	var block = new Array();
	while(!this.tokenizer.isDone() && (stopAt == null || !this.tokenizer.peek().match(stopAt))) block.push(this.parseStatement());
	return processing.parser.Statement.SBlock(block);
}
processing.parser.Parser.prototype.parseClass = function() {
	this.tokenizer.match(processing.parser.TokenType.CLASS,true);
	this.tokenizer.match(processing.parser.TokenType.IDENTIFIER,true);
	var className = this.tokenizer.currentToken.value;
	var constructor = new Array();
	var publicBody = new Array();
	var privateBody = new Array();
	this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY,true);
	try {
		while(!this.tokenizer.peek().match(processing.parser.TokenType.RIGHT_CURLY)) {
			var block = publicBody;
			this.tokenizer.match(processing.parser.TokenType.PUBLIC);
			if(this.tokenizer.match(processing.parser.TokenType.PRIVATE)) block = privateBody;
			var token = this.tokenizer.peek();
			switch(token.type) {
			case processing.parser.TokenType.IDENTIFIER:{
				if(token.value == className && this.tokenizer.peek(2).match(processing.parser.TokenType.LEFT_PAREN)) {
					constructor.push(this.parseFunction());
					throw "__break__";
				}
			}break;
			case processing.parser.TokenType.TYPE:{
				if(this.tokenizer.peek(2).match(processing.parser.TokenType.IDENTIFIER) || this.tokenizer.peek(2).match(processing.parser.TokenType.ARRAY_DIMENSION)) {
					block.push(this.parseStatement());
					throw "__break__";
				}
			}break;
			default:{
				throw new processing.parser.TokenizerSyntaxError("Invalid initializer in class \"" + className + "\"",this.tokenizer);
			}break;
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
	this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
	return processing.parser.Statement.SClassDefinition(className,processing.parser.Statement.SBlock(constructor),processing.parser.Statement.SBlock(publicBody),processing.parser.Statement.SBlock(privateBody));
}
processing.parser.Parser.prototype.parseExpression = function(stopAt) {
	var operators = [], operands = [];
	if(this.scanOperand(operators,operands,stopAt)) while(this.scanOperator(operators,operands,stopAt)) this.scanOperand(operators,operands,stopAt,true);
	while(operators.length > 0) this.reduceExpression(operators,operands);
	return operands.pop();
}
processing.parser.Parser.prototype.parseFunction = function() {
	var funcType = null;
	if(!this.tokenizer.peek(2).match(processing.parser.TokenType.LEFT_PAREN)) funcType = this.parseType();
	this.tokenizer.match(processing.parser.TokenType.IDENTIFIER,true);
	var funcName = this.tokenizer.currentToken.value;
	this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
	var params = [];
	while(!this.tokenizer.peek().match(processing.parser.TokenType.RIGHT_PAREN)) {
		var type = this.parseType();
		if(type == null) throw new processing.parser.TokenizerSyntaxError("Invalid formal parameter type",this.tokenizer);
		if(!this.tokenizer.match(processing.parser.TokenType.IDENTIFIER)) throw new processing.parser.TokenizerSyntaxError("Invalid formal parameter",this.tokenizer);
		var name = this.tokenizer.currentToken.value;
		params.push({ name : name, type : type});
		if(!this.tokenizer.peek().match(processing.parser.TokenType.RIGHT_PAREN)) this.tokenizer.match(processing.parser.TokenType.COMMA,true);
	}
	this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
	this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY,true);
	var body = this.parseBlock(processing.parser.TokenType.RIGHT_CURLY);
	this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
	return processing.parser.Statement.SFunctionDefinition(funcName,funcType,params,body);
}
processing.parser.Parser.prototype.parseList = function(stopAt) {
	var list = [];
	while(!this.tokenizer.peek().match(stopAt)) {
		if(this.tokenizer.match(processing.parser.TokenType.COMMA)) {
			list.push(null);
			continue;
		}
		list.push(processing.parser.Statement.SValue(this.parseExpression(processing.parser.TokenType.COMMA)));
		if(!this.tokenizer.match(processing.parser.TokenType.COMMA)) break;
	}
	return list;
}
processing.parser.Parser.prototype.parseStatement = function() {
	var block = new Array();
	var token = this.tokenizer.peek();
	switch(token.type) {
	case processing.parser.TokenType.IF:{
		var condition, thenBlock, elseBlock = null;
		this.tokenizer.get();
		this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
		condition = this.parseExpression();
		this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
		if(this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY)) {
			thenBlock = this.parseBlock(processing.parser.TokenType.RIGHT_CURLY);
			this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
		}
		else {
			thenBlock = this.parseStatement();
		}
		if(this.tokenizer.match(processing.parser.TokenType.ELSE)) {
			if(this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY)) {
				elseBlock = this.parseBlock(processing.parser.TokenType.RIGHT_CURLY);
				this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
			}
			else {
				elseBlock = this.parseStatement();
			}
		}
		block.push(processing.parser.Statement.SConditional(condition,thenBlock,elseBlock));
		return processing.parser.Statement.SBlock(block);
	}break;
	case processing.parser.TokenType.WHILE:{
		this.tokenizer.get();
		this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
		var condition = this.parseExpression(processing.parser.TokenType.RIGHT_PAREN);
		this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
		var body;
		if(this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY)) {
			body = this.parseBlock(processing.parser.TokenType.RIGHT_CURLY);
			this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
		}
		else {
			body = this.parseStatement();
		}
		block.push(processing.parser.Statement.SLoop(condition,body));
		return processing.parser.Statement.SBlock(block);
	}break;
	case processing.parser.TokenType.FOR:{
		this.tokenizer.get();
		this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
		if(!this.tokenizer.match(processing.parser.TokenType.SEMICOLON)) {
			if((this.tokenizer.peek().match(processing.parser.TokenType.TYPE) || this.tokenizer.peek().match(processing.parser.TokenType.IDENTIFIER)) && this.tokenizer.peek(2).match(processing.parser.TokenType.IDENTIFIER)) block.push(this.parseVariables());
			else block.push(this.parseExpression(processing.parser.TokenType.SEMICOLON));
			this.tokenizer.match(processing.parser.TokenType.SEMICOLON,true);
		}
		var condition = this.parseExpression(processing.parser.TokenType.SEMICOLON);
		this.tokenizer.match(processing.parser.TokenType.SEMICOLON,true);
		var update = this.parseExpression(processing.parser.TokenType.RIGHT_PAREN);
		this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
		var body = new Array();
		if(this.tokenizer.match(processing.parser.TokenType.LEFT_CURLY)) {
			body.push(this.parseBlock(processing.parser.TokenType.RIGHT_CURLY));
			this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
		}
		else {
			body.push(this.parseStatement());
		}
		if(update != null) body.push(update);
		block.push(processing.parser.Statement.SLoop(condition,processing.parser.Statement.SBlock(body)));
		return processing.parser.Statement.SBlock(block);
	}break;
	case processing.parser.TokenType.RETURN:{
		this.tokenizer.get();
		block.push(processing.parser.Statement.SReturn(this.parseExpression()));
	}break;
	case processing.parser.TokenType.BREAK:{
		this.tokenizer.get();
		block.push(processing.parser.Statement.SBreak((this.tokenizer.match(processing.parser.TokenType.NUMBER)?this.tokenizer.currentToken.value:1)));
	}break;
	case processing.parser.TokenType.CONTINUE:{
		this.tokenizer.get();
		block.push(processing.parser.Statement.SContinue((this.tokenizer.match(processing.parser.TokenType.NUMBER)?this.tokenizer.currentToken.value:1)));
	}break;
	case processing.parser.TokenType.STATIC:case processing.parser.TokenType.PUBLIC:case processing.parser.TokenType.PRIVATE:{
		this.tokenizer.get();
		block.push((this.tokenizer.peek().match(processing.parser.TokenType.CLASS)?this.parseClass():this.parseFunction()));
		return processing.parser.Statement.SBlock(block);
	}break;
	case processing.parser.TokenType.CLASS:{
		block.push(this.parseClass());
		return processing.parser.Statement.SBlock(block);
	}break;
	case processing.parser.TokenType.TYPE:case processing.parser.TokenType.IDENTIFIER:{
		var isArray = this.tokenizer.peek(2).match(processing.parser.TokenType.ARRAY_DIMENSION);
		if(this.tokenizer.peek((isArray?3:2)).match(processing.parser.TokenType.IDENTIFIER)) {
			if(this.tokenizer.peek((isArray?4:3)).match(processing.parser.TokenType.LEFT_PAREN)) {
				var block1 = new Array();
				block1.push(this.parseFunction());
				return processing.parser.Statement.SBlock(block1);
			}
			block.push(this.parseVariables());
		}
		else {
			block.push(this.parseExpression(processing.parser.TokenType.SEMICOLON));
		}
	}break;
	default:{
		block.push(this.parseExpression(processing.parser.TokenType.SEMICOLON));
	}break;
	}
	if(!this.tokenizer.match(processing.parser.TokenType.SEMICOLON)) throw new processing.parser.TokenizerSyntaxError("Missing ; after statement",this.tokenizer);
	return processing.parser.Statement.SBlock(block);
}
processing.parser.Parser.prototype.parseType = function() {
	if(!this.tokenizer.match(processing.parser.TokenType.TYPE) && !this.tokenizer.match(processing.parser.TokenType.IDENTIFIER)) return null;
	var type = this.tokenizer.currentToken.value;
	var dimensions = (this.tokenizer.match(processing.parser.TokenType.ARRAY_DIMENSION)?this.tokenizer.currentToken.value:0);
	return new processing.parser.Type(type,dimensions);
}
processing.parser.Parser.prototype.parseVariables = function() {
	var declarationType = this.parseType();
	var block = new Array();
	do {
		this.tokenizer.match(processing.parser.TokenType.IDENTIFIER,true);
		var varName = this.tokenizer.currentToken.value;
		var varDimensions = (this.tokenizer.match(processing.parser.TokenType.ARRAY_DIMENSION)?this.tokenizer.currentToken.value:declarationType.dimensions);
		block.push(processing.parser.Statement.SVariableDefinition(varName,new processing.parser.Type(declarationType.type,varDimensions)));
		if(this.tokenizer.match(processing.parser.TokenType.ASSIGN)) {
			if(this.tokenizer.currentToken.assignOp != null) throw new processing.parser.TokenizerSyntaxError("Invalid variable initialization",this.tokenizer);
			block.push(processing.parser.Statement.SAssignment(processing.parser.Statement.SReference(processing.parser.Statement.SLiteral(varName)),this.parseExpression(processing.parser.TokenType.COMMA)));
		}
	} while(this.tokenizer.match(processing.parser.TokenType.COMMA));
	return processing.parser.Statement.SBlock(block);
}
processing.parser.Parser.prototype.reduceExpression = function(operatorList,operandList) {
	var operator = operatorList.pop();
	var operands = operandList.splice(operandList.length - operator.arity,operator.arity);
	switch(operator) {
	case processing.parser.TokenType.NEW:case processing.parser.TokenType.NEW_WITH_ARGS:{
		operandList.push(processing.parser.Statement.SObjectInstantiation(processing.parser.Statement.SValue(operands[0]),operands[1]));
	}break;
	case processing.parser.TokenType.CALL:{
		operandList.push(processing.parser.Statement.SCall(processing.parser.Statement.SValue(operands[0]),operands[1]));
	}break;
	case processing.parser.TokenType.CAST:{
		operandList.push(processing.parser.Statement.SCast(operands[0],processing.parser.Statement.SValue(operands[1])));
	}break;
	case processing.parser.TokenType.INCREMENT:{
		operandList.push(processing.parser.Statement.SIncrement(operands[0]));
	}break;
	case processing.parser.TokenType.DECREMENT:{
		operandList.push(processing.parser.Statement.SDecrement(operands[0]));
	}break;
	case processing.parser.TokenType.ASSIGN:{
		operandList.push(processing.parser.Statement.SAssignment(operands[0],operands[1]));
	}break;
	case processing.parser.TokenType.INDEX:case processing.parser.TokenType.DOT:{
		operandList.push(processing.parser.Statement.SReference(operands[1],operands[0]));
	}break;
	case processing.parser.TokenType.NOT:case processing.parser.TokenType.BITWISE_NOT:case processing.parser.TokenType.UNARY_PLUS:case processing.parser.TokenType.UNARY_MINUS:{
		operandList.push(processing.parser.Statement.SOperation(operator,processing.parser.Statement.SValue(operands[0])));
	}break;
	case processing.parser.TokenType.OR:case processing.parser.TokenType.AND:case processing.parser.TokenType.BITWISE_OR:case processing.parser.TokenType.BITWISE_XOR:case processing.parser.TokenType.BITWISE_AND:case processing.parser.TokenType.EQ:case processing.parser.TokenType.NE:case processing.parser.TokenType.STRICT_EQ:case processing.parser.TokenType.STRICT_NE:case processing.parser.TokenType.LT:case processing.parser.TokenType.LE:case processing.parser.TokenType.GE:case processing.parser.TokenType.GT:case processing.parser.TokenType.INSTANCEOF:case processing.parser.TokenType.LSH:case processing.parser.TokenType.RSH:case processing.parser.TokenType.URSH:case processing.parser.TokenType.PLUS:case processing.parser.TokenType.MINUS:case processing.parser.TokenType.MUL:case processing.parser.TokenType.DIV:case processing.parser.TokenType.MOD:{
		operandList.push(processing.parser.Statement.SOperation(operator,processing.parser.Statement.SValue(operands[0]),processing.parser.Statement.SValue(operands[1])));
	}break;
	default:{
		throw "Unknown operator \"" + operator + "\"";
	}break;
	}
}
processing.parser.Parser.prototype.scanOperand = function(operators,operands,stopAt,required) {
	this.tokenizer.scanOperand = true;
	var token = this.tokenizer.peek();
	if(stopAt != null && token.match(stopAt)) return false;
	switch(token.type) {
	case processing.parser.TokenType.INCREMENT:case processing.parser.TokenType.DECREMENT:case processing.parser.TokenType.DELETE:case processing.parser.TokenType.TYPEOF:case processing.parser.TokenType.NOT:case processing.parser.TokenType.BITWISE_NOT:case processing.parser.TokenType.UNARY_PLUS:case processing.parser.TokenType.UNARY_MINUS:case processing.parser.TokenType.NEW:{
		this.tokenizer.get();
		operators.push(token.type);
		return this.scanOperand(operators,operands,stopAt,true);
	}break;
	case processing.parser.TokenType.TYPE:case processing.parser.TokenType.IDENTIFIER:{
		var isArray = this.tokenizer.peek(2).match(processing.parser.TokenType.ARRAY_DIMENSION);
		if(token.type == processing.parser.TokenType.TYPE && this.tokenizer.peek((isArray?3:2)).match(processing.parser.TokenType.LEFT_PAREN)) {
			operators.push(processing.parser.TokenType.CAST);
			operands.push(this.parseType());
			this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
			operands.push(this.parseExpression(processing.parser.TokenType.RIGHT_PAREN));
			this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
		}
		else {
			if(operators[operators.length - 1] == processing.parser.TokenType.NEW && this.tokenizer.peek(2).match(processing.parser.TokenType.LEFT_BRACKET)) {
				var type = this.parseType();
				var sizes = [];
				while(this.tokenizer.match(processing.parser.TokenType.LEFT_BRACKET)) {
					sizes.push(this.parseExpression(processing.parser.TokenType.RIGHT_BRACKET));
					this.tokenizer.match(processing.parser.TokenType.RIGHT_BRACKET,true);
				}
				operators.pop();
				operands.push(processing.parser.Statement.SArrayInstantiation(type,sizes));
			}
			else if(!token.match(processing.parser.TokenType.IDENTIFIER)) {
				throw new processing.parser.TokenizerSyntaxError("Invalid type declaration",this.tokenizer);
			}
			else {
				this.tokenizer.get();
				operands.push(processing.parser.Statement.SReference(processing.parser.Statement.SLiteral(token.value)));
			}
		}
	}break;
	case processing.parser.TokenType.THIS:{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SThisReference);
	}break;
	case processing.parser.TokenType.NULL:case processing.parser.TokenType.TRUE:case processing.parser.TokenType.FALSE:case processing.parser.TokenType.NUMBER:case processing.parser.TokenType.STRING:case processing.parser.TokenType.CHAR:{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SLiteral(token.value));
	}break;
	case processing.parser.TokenType.LEFT_CURLY:{
		this.tokenizer.get();
		operands.push(processing.parser.Statement.SArrayLiteral(this.parseList(processing.parser.TokenType.RIGHT_CURLY)));
		this.tokenizer.match(processing.parser.TokenType.RIGHT_CURLY,true);
	}break;
	case processing.parser.TokenType.LEFT_PAREN:{
		this.tokenizer.get();
		var isArray = this.tokenizer.peek(2).match(processing.parser.TokenType.ARRAY_DIMENSION);
		if((this.tokenizer.peek().match(processing.parser.TokenType.TYPE) || (isArray && this.tokenizer.peek().match(processing.parser.TokenType.IDENTIFIER))) && this.tokenizer.peek((isArray?3:2)).match(processing.parser.TokenType.RIGHT_PAREN)) {
			operators.push(processing.parser.TokenType.CAST);
			operands.push(this.parseType());
			this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
			return this.scanOperand(operators,operands,stopAt,true);
		}
		else if(this.tokenizer.peek(2).match(processing.parser.TokenType.RIGHT_PAREN) && this.tokenizer.match(processing.parser.TokenType.IDENTIFIER)) {
			var identifier = this.tokenizer.currentToken.value;
			this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
			var tmpOperators = [], tmpOperands = [];
			if(this.scanOperand(tmpOperators,tmpOperands)) {
				operators.push(processing.parser.TokenType.CAST);
				{
					var _g = 0;
					while(_g < tmpOperators.length) {
						var i = tmpOperators[_g];
						++_g;
						operators.push(i);
					}
				}
				operands.push(new processing.parser.Type(identifier));
				{
					var _g = 0;
					while(_g < tmpOperands.length) {
						var i = tmpOperands[_g];
						++_g;
						operands.push(i);
					}
				}
			}
			else {
				operands.push(processing.parser.Statement.SReference(processing.parser.Statement.SLiteral(identifier)));
			}
		}
		else {
			operands.push(this.parseExpression(processing.parser.TokenType.RIGHT_PAREN));
			if(!this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN)) throw new processing.parser.TokenizerSyntaxError("Missing ) in parenthetical",this.tokenizer);
		}
	}break;
	default:{
		if(required) throw new processing.parser.TokenizerSyntaxError("Missing operand",this.tokenizer);
		else return false;
	}break;
	}
	return true;
}
processing.parser.Parser.prototype.scanOperator = function(operators,operands,stopAt) {
	this.tokenizer.scanOperand = false;
	var token = this.tokenizer.peek();
	if(stopAt != null && token.match(stopAt)) return false;
	switch(token.type) {
	case processing.parser.TokenType.ASSIGN:{
		while(operators.length > 0 && operators[operators.length - 1].precedence > token.type.precedence) this.reduceExpression(operators,operands);
		operators.push(this.tokenizer.get().type);
		if(token.assignOp != null) {
			operators.push(token.assignOp);
			operands.push(operands[operands.length - 1]);
		}
		operands.push(this.parseExpression(stopAt));
		return false;
	}break;
	case processing.parser.TokenType.DOT:{
		while(operators.length > 0 && operators[operators.length - 1].precedence >= token.type.precedence) this.reduceExpression(operators,operands);
		operators.push(this.tokenizer.get().type);
		this.tokenizer.match(processing.parser.TokenType.IDENTIFIER,true);
		operands.push(processing.parser.Statement.SLiteral(this.tokenizer.currentToken.value));
		return this.scanOperator(operators,operands,stopAt);
	}break;
	case processing.parser.TokenType.LEFT_BRACKET:{
		while(operators.length > 0 && operators[operators.length - 1].precedence >= processing.parser.TokenType.INDEX.precedence) this.reduceExpression(operators,operands);
		operators.push(processing.parser.TokenType.INDEX);
		this.tokenizer.match(processing.parser.TokenType.LEFT_BRACKET,true);
		operands.push(this.parseExpression(processing.parser.TokenType.RIGHT_BRACKET));
		if(!this.tokenizer.match(processing.parser.TokenType.RIGHT_BRACKET)) throw new processing.parser.TokenizerSyntaxError("Missing ] in index expression",this.tokenizer);
		return this.scanOperator(operators,operands,stopAt);
	}break;
	case processing.parser.TokenType.OR:case processing.parser.TokenType.AND:case processing.parser.TokenType.BITWISE_OR:case processing.parser.TokenType.BITWISE_XOR:case processing.parser.TokenType.BITWISE_AND:case processing.parser.TokenType.EQ:case processing.parser.TokenType.NE:case processing.parser.TokenType.STRICT_EQ:case processing.parser.TokenType.STRICT_NE:case processing.parser.TokenType.LT:case processing.parser.TokenType.LE:case processing.parser.TokenType.GE:case processing.parser.TokenType.GT:case processing.parser.TokenType.INSTANCEOF:case processing.parser.TokenType.LSH:case processing.parser.TokenType.RSH:case processing.parser.TokenType.URSH:case processing.parser.TokenType.PLUS:case processing.parser.TokenType.MINUS:case processing.parser.TokenType.MUL:case processing.parser.TokenType.DIV:case processing.parser.TokenType.MOD:{
		while(operators.length > 0 && operators[operators.length - 1].precedence >= token.type.precedence) this.reduceExpression(operators,operands);
		operators.push(this.tokenizer.get().type);
	}break;
	case processing.parser.TokenType.INCREMENT:case processing.parser.TokenType.DECREMENT:{
		while(operators.length > 0 && operators[operators.length - 1].precedence > token.type.precedence) this.reduceExpression(operators,operands);
		operators.push(this.tokenizer.get().type);
		this.reduceExpression(operators,operands);
		return this.scanOperator(operators,operands,stopAt);
	}break;
	case processing.parser.TokenType.HOOK:{
		this.tokenizer.get();
		while(operators.length > 0) this.reduceExpression(operators,operands);
		var conditional = operands.pop();
		var thenBlock = this.parseExpression(processing.parser.TokenType.COLON);
		this.tokenizer.match(processing.parser.TokenType.COLON,true);
		var elseBlock = this.parseExpression();
		operands.push(processing.parser.Statement.SConditional(conditional,thenBlock,elseBlock));
		return false;
	}break;
	case processing.parser.TokenType.LEFT_PAREN:{
		while(operators.length > 0 && operators[operators.length - 1].precedence > processing.parser.TokenType.NEW.precedence) this.reduceExpression(operators,operands);
		this.tokenizer.match(processing.parser.TokenType.LEFT_PAREN,true);
		operands.push(this.parseList(processing.parser.TokenType.RIGHT_PAREN));
		this.tokenizer.match(processing.parser.TokenType.RIGHT_PAREN,true);
		if(operators.length == 0 || operators[operators.length - 1] != processing.parser.TokenType.NEW) {
			operators.push(processing.parser.TokenType.CALL);
		}
		else if(operators[operators.length - 1] == processing.parser.TokenType.NEW) {
			operators.pop();
			operators.push(processing.parser.TokenType.NEW_WITH_ARGS);
		}
		this.reduceExpression(operators,operands);
		return this.scanOperator(operators,operands,stopAt);
	}break;
	default:{
		return false;
	}break;
	}
	return true;
}
processing.parser.Parser.prototype.tokenizer = null;
processing.parser.Parser.prototype.__class__ = processing.parser.Parser;
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
processing.parser.TokenType.END = new processing.parser.TokenType("END");
processing.parser.TokenType.SCRIPT = new processing.parser.TokenType("SCRIPT");
processing.parser.TokenType.BLOCK = new processing.parser.TokenType("BLOCK");
processing.parser.TokenType.LABEL = new processing.parser.TokenType("LABEL");
processing.parser.TokenType.FOR_IN = new processing.parser.TokenType("FOR_IN");
processing.parser.TokenType.CALL = new processing.parser.TokenType("CALL",0,2);
processing.parser.TokenType.NEW_WITH_ARGS = new processing.parser.TokenType("NEW_WITH_ARGS",0,2);
processing.parser.TokenType.INDEX = new processing.parser.TokenType("INDEX",17,2);
processing.parser.TokenType.ARRAY_INIT = new processing.parser.TokenType("ARRAY_INIT",0,1);
processing.parser.TokenType.OBJECT_INIT = new processing.parser.TokenType("OBJECT_INIT",0,1);
processing.parser.TokenType.PROPERTY_INIT = new processing.parser.TokenType("PROPERTY_INIT");
processing.parser.TokenType.GROUP = new processing.parser.TokenType("GROUP",0,1);
processing.parser.TokenType.LIST = new processing.parser.TokenType("LIST");
processing.parser.TokenType.CONSTRUCTOR = new processing.parser.TokenType("CONSTRUCTOR");
processing.parser.TokenType.IDENTIFIER = new processing.parser.TokenType("IDENTIFIER");
processing.parser.TokenType.TYPE = new processing.parser.TokenType("TYPE");
processing.parser.TokenType.NUMBER = new processing.parser.TokenType("NUMBER");
processing.parser.TokenType.STRING = new processing.parser.TokenType("STRING");
processing.parser.TokenType.REGEXP = new processing.parser.TokenType("REGEXP");
processing.parser.TokenType.ARRAY_DIMENSION = new processing.parser.TokenType("[]");
processing.parser.TokenType.NEWLINE = new processing.parser.TokenType("\n");
processing.parser.TokenType.SEMICOLON = new processing.parser.TokenType(";",0);
processing.parser.TokenType.COMMA = new processing.parser.TokenType(",",1,-2);
processing.parser.TokenType.HOOK = new processing.parser.TokenType("?",2);
processing.parser.TokenType.COLON = new processing.parser.TokenType(":",2);
processing.parser.TokenType.OR = new processing.parser.TokenType("||",4,2);
processing.parser.TokenType.AND = new processing.parser.TokenType("&&",5,2);
processing.parser.TokenType.BITWISE_OR = new processing.parser.TokenType("|",6,2);
processing.parser.TokenType.BITWISE_XOR = new processing.parser.TokenType("^",7,2);
processing.parser.TokenType.BITWISE_AND = new processing.parser.TokenType("&",8,2);
processing.parser.TokenType.STRICT_EQ = new processing.parser.TokenType("===",9,2);
processing.parser.TokenType.EQ = new processing.parser.TokenType("==",9,2);
processing.parser.TokenType.ASSIGN = new processing.parser.TokenType("=",2,2);
processing.parser.TokenType.STRICT_NE = new processing.parser.TokenType("!==",9,2);
processing.parser.TokenType.NE = new processing.parser.TokenType("!=",9,2);
processing.parser.TokenType.LSH = new processing.parser.TokenType("<<",11,2);
processing.parser.TokenType.LE = new processing.parser.TokenType("<=",10,2);
processing.parser.TokenType.LT = new processing.parser.TokenType("<",10,2);
processing.parser.TokenType.URSH = new processing.parser.TokenType(">>>",11,2);
processing.parser.TokenType.RSH = new processing.parser.TokenType(">>",11,2);
processing.parser.TokenType.GE = new processing.parser.TokenType(">=",10,2);
processing.parser.TokenType.GT = new processing.parser.TokenType(">",10,2);
processing.parser.TokenType.INCREMENT = new processing.parser.TokenType("++",15,1);
processing.parser.TokenType.DECREMENT = new processing.parser.TokenType("--",15,1);
processing.parser.TokenType.PLUS = new processing.parser.TokenType("+",12,2);
processing.parser.TokenType.MINUS = new processing.parser.TokenType("-",12,2);
processing.parser.TokenType.MUL = new processing.parser.TokenType("*",13,2);
processing.parser.TokenType.DIV = new processing.parser.TokenType("/",13,2);
processing.parser.TokenType.MOD = new processing.parser.TokenType("%",13,2);
processing.parser.TokenType.NOT = new processing.parser.TokenType("!",14,1);
processing.parser.TokenType.BITWISE_NOT = new processing.parser.TokenType("~",14,1);
processing.parser.TokenType.DOT = new processing.parser.TokenType(".",17,2);
processing.parser.TokenType.LEFT_BRACKET = new processing.parser.TokenType("[");
processing.parser.TokenType.RIGHT_BRACKET = new processing.parser.TokenType("]");
processing.parser.TokenType.LEFT_CURLY = new processing.parser.TokenType("{");
processing.parser.TokenType.RIGHT_CURLY = new processing.parser.TokenType("}");
processing.parser.TokenType.LEFT_PAREN = new processing.parser.TokenType("(");
processing.parser.TokenType.RIGHT_PAREN = new processing.parser.TokenType(")");
processing.parser.TokenType.CONDITIONAL = new processing.parser.TokenType("CONDITIONAL",2,3);
processing.parser.TokenType.UNARY_PLUS = new processing.parser.TokenType("UNARY_PLUS",14,1);
processing.parser.TokenType.UNARY_MINUS = new processing.parser.TokenType("UNARY_MINUS",14,1);
processing.parser.TokenType.CAST = new processing.parser.TokenType("CAST",14,2);
processing.parser.TokenType.BREAK = new processing.parser.TokenType();
processing.parser.TokenType.CLASS = new processing.parser.TokenType();
processing.parser.TokenType.CASE = new processing.parser.TokenType();
processing.parser.TokenType.CATCH = new processing.parser.TokenType();
processing.parser.TokenType.CONST = new processing.parser.TokenType();
processing.parser.TokenType.CONTINUE = new processing.parser.TokenType();
processing.parser.TokenType.DEBUGGER = new processing.parser.TokenType();
processing.parser.TokenType.DEFAULT = new processing.parser.TokenType();
processing.parser.TokenType.DELETE = new processing.parser.TokenType("delete",14,1);
processing.parser.TokenType.DO = new processing.parser.TokenType();
processing.parser.TokenType.ELSE = new processing.parser.TokenType();
processing.parser.TokenType.ENUM = new processing.parser.TokenType();
processing.parser.TokenType.FALSE = new processing.parser.TokenType(false);
processing.parser.TokenType.FINALLY = new processing.parser.TokenType();
processing.parser.TokenType.FOR = new processing.parser.TokenType();
processing.parser.TokenType.FUNCTION = new processing.parser.TokenType();
processing.parser.TokenType.IF = new processing.parser.TokenType();
processing.parser.TokenType.IN = new processing.parser.TokenType("in",10,2);
processing.parser.TokenType.INSTANCEOF = new processing.parser.TokenType("instanceof",10,2);
processing.parser.TokenType.NEW = new processing.parser.TokenType("new",16,1);
processing.parser.TokenType.NULL = new processing.parser.TokenType(null);
processing.parser.TokenType.PUBLIC = new processing.parser.TokenType("public");
processing.parser.TokenType.PRIVATE = new processing.parser.TokenType("private");
processing.parser.TokenType.RETURN = new processing.parser.TokenType();
processing.parser.TokenType.STATIC = new processing.parser.TokenType("static");
processing.parser.TokenType.SWITCH = new processing.parser.TokenType();
processing.parser.TokenType.THIS = new processing.parser.TokenType();
processing.parser.TokenType.THROW = new processing.parser.TokenType();
processing.parser.TokenType.TRUE = new processing.parser.TokenType(true);
processing.parser.TokenType.TRY = new processing.parser.TokenType();
processing.parser.TokenType.TYPEOF = new processing.parser.TokenType("typeof",14,1);
processing.parser.TokenType.VAR = new processing.parser.TokenType();
processing.parser.TokenType.WHILE = new processing.parser.TokenType();
processing.parser.TokenType.WITH = new processing.parser.TokenType();
processing.parser.TokenType.VOID = new processing.parser.TokenType("void");
processing.parser.TokenType.BOOLEAN = new processing.parser.TokenType("boolean");
processing.parser.TokenType.FLOAT = new processing.parser.TokenType("float");
processing.parser.TokenType.INT = new processing.parser.TokenType("int");
processing.parser.TokenType.CHAR = new processing.parser.TokenType("char");
processing.parser.TokenType.TYPES = new processing.parser.TypeTokenTypeList();
processing.parser.TokenType.KEYWORDS = new processing.parser.KeywordTokenTypeList();
processing.parser.TokenType.OPS = new processing.parser.OperatorTokenTypeList();
processing.parser.TokenType.ASSIGNMENT_OPS = new processing.parser.AssignmentTokenTypeList();
processing.parser.TokenizerRegexList.WHITESPACE = new EReg("^\\s+","");
processing.parser.TokenizerRegexList.WHITESPACE_SAME_LINE = new EReg("^[ \\t]+","");
processing.parser.TokenizerRegexList.COMMENT = new EReg("^/(?:\\*(?:.|\\n|\\r)*?\\*/|/.*)","");
processing.parser.TokenizerRegexList.NEWLINES = new EReg("\\n","g");
processing.parser.TokenizerRegexList.EOF = new EReg("^$","");
processing.parser.TokenizerRegexList.COLOR = new EReg("^(?:0[xX]|#)([\\da-fA-F]{6}|[\\da-fA-F]{8})","");
processing.parser.TokenizerRegexList.FLOAT = new EReg("^\\d+(?:\\.\\d*)?[fF]|^\\d+\\.\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|^\\.\\d+(?:[eE][-+]?\\d+)?","");
processing.parser.TokenizerRegexList.INTEGER = new EReg("^0[xX][\\da-fA-F]+|^0[0-7]*|^\\d+","");
processing.parser.TokenizerRegexList.KEYWORD = new EReg("^\\w+","");
processing.parser.TokenizerRegexList.ARRAY_DIMENSIONS = new EReg("^(?:\\[\\]){1,3}","");
processing.parser.TokenizerRegexList.CHAR = new EReg("^'(?:[^']|\\\\.|\\\\u[0-9A-Fa-f]{4})'","");
processing.parser.TokenizerRegexList.STRING = new EReg("^\"(?:\\\\.|[^\"])*\"|^'(?:[^']|\\\\.)*'","");
processing.parser.TokenizerRegexList.OPERATOR = new EReg("^(\\n|\\|\\||&&|===?|!==?|<<|<=|>>>?|>=|\\+\\+|--|\\[\\]|[;,?:|^&=<>+\\-*/%!~.[\\]{}()])(=?)","");
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
