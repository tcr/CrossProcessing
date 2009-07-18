package xpde.parser;

import haxe.io.Input;
import haxe.io.Eof;

class Token
{
	public var kind:Int;    // token kind
	public var pos:Int;     // token position in the source text (starting at 0)
	public var col:Int;     // token column (starting at 1)
	public var line:Int;    // token line (starting at 1)
	public var val:String;  // token value
	public var next:Token;  // ML 2005-03-11 Peek tokens are kept in linked list
	public function new() {}
}

//-----------------------------------------------------------------------------------
// Buffer
//-----------------------------------------------------------------------------------

class Buffer
{
	public static var EOF:Int = 0xFFFF;

	private var stream:Input;
	
	public function new(s:Input)
	{
		pos = 0;
		bufChar = 0;
		stream = s;
		Read();
	}
	
	private var pos:Int;
	
	public function getPos():Int
	{
		return pos;
	}
	
	private var bufChar:Int;
	
	public function Read():Int
	{
		pos++;
		var ret:Int = bufChar;
		try {
			bufChar = stream.readByte();
		} catch (e:Eof) {
			bufChar = EOF;
		}
		return ret;
	}
	
	public function Peek():Int
	{
		return bufChar;
	}
}

//-----------------------------------------------------------------------------------
// StartStates  -- maps characters to start states of tokens
//-----------------------------------------------------------------------------------

class StartStates {
	private var tab:Array<Elem>;
	
	public function new() {
		tab = []; //new Elem[128]
	}

	public function set(key:Int, val:Int):Void {
		var e:Elem = new Elem(key, val);
		var k:Int = key % 128;
		e.next = tab[k]; tab[k] = e;
	}

	public function state(key:Int):Int {
		var e:Elem = tab[key % 128];
		while (e != null && e.key != key) e = e.next;
		return e == null ? 0: e.val;
	}
}

class Elem {
	public var key:Int;
	public var val:Int;
	public var next:Elem;
	public function new(key:Int, val:Int) { this.key = key; this.val = val; }
}

//-----------------------------------------------------------------------------------
// Scanner
//-----------------------------------------------------------------------------------

class Scanner {
	static var EOL:Int = 10; // \n
	static var eofSym:Int = 0;
	static var maxT:Int = 57;
	static var noSym:Int = 57;


	public var buffer:Buffer; // scanner buffer

	var t:Token;           // current token
	var ch:Int;            // current input character
	var pos:Int;           // byte position of current character
	var col:Int;           // column number of current character
	var line:Int;          // line number of current character
	var oldEols:Int;       // EOLs that appeared in a comment;

	var tokens:Token;      // list of tokens already peeked (first token is a dummy)
	var pt:Token;          // current peek token
	
	var tval:StringBuf;	// token text used in NextToken(), dynamically enlarged
	var tlen:Int;		// length of current token

	static var start = new StartStates();	// maps initial token character to start state
	static var literals = {			// maps literal strings to literal kinds
		var literals = new Hash<Int>();
		start.set(36, 1);
		for (i in 65...91) start.set(i, 1);
		start.set(95, 1);
		for (i in 97...123) start.set(i, 1);
		start.set(48, 47);
		for (i in 49...58) start.set(i, 48);
		start.set(46, 49); 
		start.set(39, 18); 
		start.set(34, 27); 
		start.set(58, 35); 
		start.set(44, 36); 
		start.set(45, 50); 
		start.set(43, 51); 
		start.set(123, 39); 
		start.set(91, 40); 
		start.set(40, 41); 
		start.set(33, 42); 
		start.set(125, 43); 
		start.set(93, 44); 
		start.set(41, 45); 
		start.set(126, 46); 
		start.set(59, 57); 
		start.set(42, 58); 
		start.set(61, 59); 
		start.set(Buffer.EOF, -1);
		literals.set("boolean", 6);
		literals.set("byte", 7);
		literals.set("char", 8);
		literals.set("class", 9);
		literals.set("double", 10);
		literals.set("false", 11);
		literals.set("final", 12);
		literals.set("float", 13);
		literals.set("import", 14);
		literals.set("int", 15);
		literals.set("long", 16);
		literals.set("new", 17);
		literals.set("null", 18);
		literals.set("public", 19);
		literals.set("short", 20);
		literals.set("static", 21);
		literals.set("super", 22);
		literals.set("this", 23);
		literals.set("true", 24);
		literals.set("void", 25);
		literals.set("package", 41);
		literals.set("protected", 44);
		literals.set("private", 45);
		literals.set("abstract", 46);
		literals.set("strictfp", 47);
		literals.set("native", 48);
		literals.set("synchronized", 49);
		literals.set("transient", 50);
		literals.set("volatile", 51);
		literals.set("extends", 53);
		literals.set("implements", 54);
		literals.set("throws", 55);
		literals.set("interface", 56);

		literals;
	};
	
	public function new (s:Input) {
		tval = new StringBuf();
		buffer = new Buffer(s);
		Init();
	}
	
	function Init ():Void {
		pos = -1; line = 1; col = 0;
		oldEols = 0;
		NextCh();
/*		if (ch == 0xEF) { // check optional byte order mark for UTF-8
			NextCh(); int ch1 = ch;
			NextCh(); int ch2 = ch;
			if (ch1 != 0xBB || ch2 != 0xBF) {
				throw new FatalError("Illegal byte order mark at start of file");
			}
			buffer = new UTF8Buffer(buffer); col = 0;
			NextCh();
		}*/
		pt = tokens = new Token();  // first token is a dummy
	}
	
	function NextCh():Void {
		if (oldEols > 0) { ch = EOL; oldEols--; }
		else {
			pos = buffer.getPos();
			ch = buffer.Read(); col++;
			// replace isolated '\r' by '\n' in order to make
			// eol handling uniform across Windows, Unix and Mac
			if (ch == 13 && buffer.Peek() != 10) ch = EOL; // \r, \n
			if (ch == EOL) { line++; col = 0; }
		}

	}
	
	function AddCh():Void {
		if (ch != Buffer.EOF) {
			tval.addChar(ch); 

			NextCh();
		}

	}
	

	function Comment0():Bool {
		var level:Int = 1, pos0:Int = pos, line0:Int = line, col0:Int = col, nch:Int = buffer.Peek();
		if (nch == 47) {
			NextCh(); NextCh();
			while (true) {
				if (ch == 10) {
					level--;
					if (level == 0) { oldEols = line - line0; NextCh(); return true; }
					NextCh();
				} else if (ch == Buffer.EOF) return false;
				else NextCh();
			}
		}
		return false;
	}

	function Comment1():Bool {
		var level:Int = 1, pos0:Int = pos, line0:Int = line, col0:Int = col, nch:Int = buffer.Peek();
		if (nch == 42) {
			NextCh(); NextCh();
			while (true) {
				if (ch == 42) {
					NextCh();
					if (ch == 47) {
						level--;
						if (level == 0) { oldEols = line - line0; NextCh(); return true; }
						NextCh();
					}
				} else if (ch == Buffer.EOF) return false;
				else NextCh();
			}
		}
		return false;
	}


	function CheckLiteral():Void {
		var val:String = t.val;

		var kind:Int = literals.get(val);
		if (kind != null) {
			t.kind = kind;
		}
	}

	function NextToken():Token {
		while (ch == 32 || // ' '
			ch >= 9 && ch <= 10 || ch == 13
		) NextCh();
		if (ch == 47 && Comment0() ||ch == 47 && Comment1()) return NextToken();
		t = new Token();
		t.pos = pos; t.col = col; t.line = line; 
		var state:Int = start.state(ch);
		tlen = 0; AddCh();

		while (true) {
			switch (state) {
				case -1: t.kind = eofSym; break; // NextCh already done 
				case 0: t.kind = noSym; break;  // NextCh already done
				case 1:
					if (ch == 36 || ch >= 48 && ch <= 57 || ch >= 65 && ch <= 90 || ch == 95 || ch >= 97 && ch <= 122) {AddCh(); state = 1;}
					else {t.kind = 1; t.val = tval.toString(); tval = new StringBuf(); CheckLiteral(); return t;}
				case 2:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 3;}
					else {t.kind = noSym; break;}
				case 3:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 3;}
					else if (ch == 76 || ch == 108) {AddCh(); state = 4;}
					else {t.kind = 2; break;}
				case 4:
					{t.kind = 2; break;}
				case 5:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 5;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 6;}
					else {t.kind = 3; break;}
				case 6:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 8;}
					else if (ch == 43 || ch == 45) {AddCh(); state = 7;}
					else {t.kind = noSym; break;}
				case 7:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 8;}
					else {t.kind = noSym; break;}
				case 8:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 8;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 3; break;}
				case 9:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 9;}
					else if (ch == 46) {AddCh(); state = 10;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 14;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = noSym; break;}
				case 10:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 10;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 11;}
					else {t.kind = 3; break;}
				case 11:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 13;}
					else if (ch == 43 || ch == 45) {AddCh(); state = 12;}
					else {t.kind = noSym; break;}
				case 12:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 13;}
					else {t.kind = noSym; break;}
				case 13:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 13;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 3; break;}
				case 14:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 16;}
					else if (ch == 43 || ch == 45) {AddCh(); state = 15;}
					else {t.kind = noSym; break;}
				case 15:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 16;}
					else {t.kind = noSym; break;}
				case 16:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 16;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 3; break;}
				case 17:
					{t.kind = 3; break;}
				case 18:
					if (ch <= 9 || ch >= 11 && ch <= 12 || ch >= 14 && ch <= 38 || ch >= 40 && ch <= 91 || ch >= 93 && ch <= 65535) {AddCh(); state = 19;}
					else if (ch == 92) {AddCh(); state = 20;}
					else {t.kind = noSym; break;}
				case 19:
					if (ch == 39) {AddCh(); state = 26;}
					else {t.kind = noSym; break;}
				case 20:
					if (ch >= 48 && ch <= 51) {AddCh(); state = 52;}
					else if (ch >= 52 && ch <= 55) {AddCh(); state = 25;}
					else if (ch == 34 || ch == 39 || ch == 92 || ch == 98 || ch == 102 || ch == 110 || ch == 114 || ch == 116) {AddCh(); state = 19;}
					else if (ch == 117) {AddCh(); state = 21;}
					else {t.kind = noSym; break;}
				case 21:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 22;}
					else if (ch == 117) {AddCh(); state = 21;}
					else {t.kind = noSym; break;}
				case 22:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 23;}
					else {t.kind = noSym; break;}
				case 23:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 24;}
					else {t.kind = noSym; break;}
				case 24:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 19;}
					else {t.kind = noSym; break;}
				case 25:
					if (ch >= 48 && ch <= 55) {AddCh(); state = 19;}
					else if (ch == 39) {AddCh(); state = 26;}
					else {t.kind = noSym; break;}
				case 26:
					{t.kind = 4; break;}
				case 27:
					if (ch <= 9 || ch >= 11 && ch <= 12 || ch >= 14 && ch <= 33 || ch >= 35 && ch <= 91 || ch >= 93 && ch <= 65535) {AddCh(); state = 27;}
					else if (ch == 34) {AddCh(); state = 34;}
					else if (ch == 92) {AddCh(); state = 28;}
					else {t.kind = noSym; break;}
				case 28:
					if (ch >= 48 && ch <= 51) {AddCh(); state = 54;}
					else if (ch >= 52 && ch <= 55) {AddCh(); state = 33;}
					else if (ch == 34 || ch == 39 || ch == 92 || ch == 98 || ch == 102 || ch == 110 || ch == 114 || ch == 116) {AddCh(); state = 27;}
					else if (ch == 117) {AddCh(); state = 29;}
					else {t.kind = noSym; break;}
				case 29:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 30;}
					else if (ch == 117) {AddCh(); state = 29;}
					else {t.kind = noSym; break;}
				case 30:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 31;}
					else {t.kind = noSym; break;}
				case 31:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 32;}
					else {t.kind = noSym; break;}
				case 32:
					if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {AddCh(); state = 27;}
					else {t.kind = noSym; break;}
				case 33:
					if (ch <= 9 || ch >= 11 && ch <= 12 || ch >= 14 && ch <= 33 || ch >= 35 && ch <= 91 || ch >= 93 && ch <= 65535) {AddCh(); state = 27;}
					else if (ch == 34) {AddCh(); state = 34;}
					else if (ch == 92) {AddCh(); state = 28;}
					else {t.kind = noSym; break;}
				case 34:
					{t.kind = 5; break;}
				case 35:
					{t.kind = 26; break;}
				case 36:
					{t.kind = 27; break;}
				case 37:
					{t.kind = 28; break;}
				case 38:
					{t.kind = 30; break;}
				case 39:
					{t.kind = 31; break;}
				case 40:
					{t.kind = 32; break;}
				case 41:
					{t.kind = 33; break;}
				case 42:
					{t.kind = 35; break;}
				case 43:
					{t.kind = 37; break;}
				case 44:
					{t.kind = 38; break;}
				case 45:
					{t.kind = 39; break;}
				case 46:
					{t.kind = 40; break;}
				case 47:
					if (ch >= 48 && ch <= 55) {AddCh(); state = 56;}
					else if (ch >= 56 && ch <= 57) {AddCh(); state = 9;}
					else if (ch == 76 || ch == 108) {AddCh(); state = 4;}
					else if (ch == 88 || ch == 120) {AddCh(); state = 2;}
					else if (ch == 46) {AddCh(); state = 10;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 14;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 2; break;}
				case 48:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 48;}
					else if (ch == 76 || ch == 108) {AddCh(); state = 4;}
					else if (ch == 46) {AddCh(); state = 10;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 14;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 2; break;}
				case 49:
					if (ch >= 48 && ch <= 57) {AddCh(); state = 5;}
					else {t.kind = 29; break;}
				case 50:
					if (ch == 45) {AddCh(); state = 37;}
					else {t.kind = 34; break;}
				case 51:
					if (ch == 43) {AddCh(); state = 38;}
					else {t.kind = 36; break;}
				case 52:
					if (ch >= 48 && ch <= 55) {AddCh(); state = 53;}
					else if (ch == 39) {AddCh(); state = 26;}
					else {t.kind = noSym; break;}
				case 53:
					if (ch >= 48 && ch <= 55) {AddCh(); state = 19;}
					else if (ch == 39) {AddCh(); state = 26;}
					else {t.kind = noSym; break;}
				case 54:
					if (ch <= 9 || ch >= 11 && ch <= 12 || ch >= 14 && ch <= 33 || ch >= 35 && ch <= 47 || ch >= 56 && ch <= 91 || ch >= 93 && ch <= 65535) {AddCh(); state = 27;}
					else if (ch >= 48 && ch <= 55) {AddCh(); state = 55;}
					else if (ch == 34) {AddCh(); state = 34;}
					else if (ch == 92) {AddCh(); state = 28;}
					else {t.kind = noSym; break;}
				case 55:
					if (ch <= 9 || ch >= 11 && ch <= 12 || ch >= 14 && ch <= 33 || ch >= 35 && ch <= 91 || ch >= 93 && ch <= 65535) {AddCh(); state = 27;}
					else if (ch == 34) {AddCh(); state = 34;}
					else if (ch == 92) {AddCh(); state = 28;}
					else {t.kind = noSym; break;}
				case 56:
					if (ch >= 48 && ch <= 55) {AddCh(); state = 56;}
					else if (ch >= 56 && ch <= 57) {AddCh(); state = 9;}
					else if (ch == 76 || ch == 108) {AddCh(); state = 4;}
					else if (ch == 46) {AddCh(); state = 10;}
					else if (ch == 69 || ch == 101) {AddCh(); state = 14;}
					else if (ch == 68 || ch == 70 || ch == 100 || ch == 102) {AddCh(); state = 17;}
					else {t.kind = 2; break;}
				case 57:
					{t.kind = 42; break;}
				case 58:
					{t.kind = 43; break;}
				case 59:
					{t.kind = 52; break;}

			}
		}
		t.val = tval.toString();
		tval = new StringBuf();
		return t;
	}
	
	// get the next token (possibly a token already seen during peeking)
	public function Scan ():Token {
		if (tokens.next == null) {
			return NextToken();
		} else {
			pt = tokens = tokens.next;
			return tokens;
		}
	}

	// get the next token, ignore pragmas
	public function Peek ():Token {
		do {
			if (pt.next == null) {
				pt.next = NextToken();
			}
			pt = pt.next;
		} while (pt.kind > maxT); // skip pragmas

		return pt;
	}

	// make sure that peeking starts at current scan position
	public function ResetPeek ():Void { pt = tokens; }

} // end Scanner

