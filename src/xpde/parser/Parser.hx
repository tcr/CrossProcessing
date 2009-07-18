package xpde.parser;

import xpde.Rtti;
import xpde.parser.Scanner;
import xpde.parser.Context;
import xpde.parser.AST;
import haxe.io.Input;

class Parser
{
	public static var _EOF:Int = 0;
	public static var _ident:Int = 1;
	public static var _intLit:Int = 2;
	public static var _floatLit:Int = 3;
	public static var _charLit:Int = 4;
	public static var _stringLit:Int = 5;
	public static var _boolean:Int = 6;
	public static var _byte:Int = 7;
	public static var _char:Int = 8;
	public static var _class:Int = 9;
	public static var _double:Int = 10;
	public static var _false:Int = 11;
	public static var _final:Int = 12;
	public static var _float:Int = 13;
	public static var _import_:Int = 14;
	public static var _int:Int = 15;
	public static var _long:Int = 16;
	public static var _new:Int = 17;
	public static var _null:Int = 18;
	public static var _public:Int = 19;
	public static var _short:Int = 20;
	public static var _static:Int = 21;
	public static var _super:Int = 22;
	public static var _this:Int = 23;
	public static var _true:Int = 24;
	public static var _void:Int = 25;
	public static var _colon:Int = 26;
	public static var _comma:Int = 27;
	public static var _dec:Int = 28;
	public static var _dot:Int = 29;
	public static var _inc:Int = 30;
	public static var _lbrace:Int = 31;
	public static var _lbrack:Int = 32;
	public static var _lpar:Int = 33;
	public static var _minus:Int = 34;
	public static var _not:Int = 35;
	public static var _plus:Int = 36;
	public static var _rbrace:Int = 37;
	public static var _rbrack:Int = 38;
	public static var _rpar:Int = 39;
	public static var _tilde:Int = 40;
	public static var maxT:Int = 57;

	static var minErrDist:Int = 2;

	public var t:Token;    // last recognized token
	public var la:Token;   // lookahead token
	var errDist:Int;
	
	public var scanner:Scanner;
	public var errors:Errors;

	static var maxTerminals:Int = 160;  // set size

static function newSet(values:Array<Int>):BitSet {
  var s:BitSet = new BitSet(maxTerminals);
  for (i in 0...values.length) s.set(values[i]);
  return s;
}

static function or(s1:BitSet, s2:BitSet):BitSet {
  s1.or(s2);
  return s1;
}

static var typeKWarr:Array<Int> = [_byte, _short, _char, _int, _long, _float, _double, 
                          _boolean];
static var castFollowerArr:Array<Int> = [_ident, _new, _super, _this, _void, _intLit,
                                _floatLit, _charLit, _stringLit, _true, _false,
                                _null, _lpar, _not, _tilde];
static var prefixArr:Array<Int> = [_inc, _dec, _not, _tilde, _plus, _minus];                                

static var typeKW:BitSet       = newSet(typeKWarr);
static var castFollower:BitSet = or(newSet(castFollowerArr), typeKW);
static var prefix:BitSet       = newSet(prefixArr);

/*---------------------------- auxiliary methods ----------------------------*/

public function error (s:String):Void {
  if (errDist >= minErrDist) errors.SemErr(la.line, la.col, s);
  errDist = 0;
}

// "(" BasicType {"[""]"} ")"
function isSimpleTypeCast ():Bool {
  // assert: la.kind == _lpar
  scanner.ResetPeek();
  var pt1:Token = scanner.Peek();
  
  if (typeKW.get(pt1.kind)) {
    var pt:Token = scanner.Peek();
    pt = skipDims(pt);
    if (pt != null) {
      return pt.kind == _rpar;
    }
  }
  return false;
}

// "(" Qualident {"[" "]"} ")" castFollower
function guessTypeCast ():Bool {
  // assert: la.kind == _lpar
  scanner.ResetPeek();
  var pt:Token = scanner.Peek();
  pt = rdQualident(pt);
  if (pt != null) {
    pt = skipDims(pt);
    if (pt != null) {
      var pt1:Token = scanner.Peek();
      return pt.kind == _rpar && castFollower.get(pt1.kind);
    }
  }
  return false;
}

// "[" "]"
function skipDims (pt:Token):Token {
  if (pt.kind != _lbrack) return pt;
  do {
     pt = scanner.Peek();
    if (pt.kind != _rbrack) return null;
     pt = scanner.Peek();
  } while (pt.kind == _lbrack);  
  return pt;
}

/* Checks whether the next sequence of tokens is a qualident *
 * and returns the qualident string                          *
 * !!! Proceeds from current peek position !!!               */
function rdQualident (pt:Token):Token {
  var qualident:String = "";
  
  if (pt.kind == _ident) {
    qualident = pt.val;
    pt = scanner.Peek();
    while (pt.kind == _dot) {
      pt = scanner.Peek();
      if (pt.kind != _ident) return null;
      qualident += "." + pt.val;
      pt = scanner.Peek();
    }
    return pt;
  } else return null;
}

// Return the n-th token after the current lookahead token
function peek(n:Int):Token {
  scanner.ResetPeek();
  var x:Token = la;
  while (n > 0) { x = scanner.Peek(); n--; }
  return x;
}


function checkExprStat(expression:Expression):Void {
	switch (expression)
	{
	    // instantiation
	    case EObjectInstantiation(_, _):
	    
	    // calling
	    case ECall(_, _, _):
	    case EThisCall(_):
	    case ESuperCall(_):
	    // assignment
	    case EArrayAssignment(_, _, _):
	    case EAssignment(_, _, _):
	    case ELocalAssignment(_, _):
	    
	    // operations
	    case EPrefix(_, _):
	    case EPostfix(_, _):
	    
	    // second pass
	    case ELexExpression(expression):
		switch (expression) {
		    case LCall(_, _):
		    case LAssignment(_, _):
		    default: error("not a statement" + " (" + expression + ")");
		}
	    
	    default: error("not a statement" + " (" + expression + ")");
	}
}

/*---------------------------- type ----------------------------*/
/*
function compoundBrackets(type:ParserDataType, bCount:Int):ParserDataType {
	if (bCount == 0)
		return type;
	switch (type) {
	    case DTPrimitive(type): return DTPrimitiveArray(type, bCount);
	    case DTPrimitiveArray(type, dimensions): return DTPrimitiveArray(type, dimensions + bCount);
	    case DTReference(qualident): return DTReferenceArray(qualident, bCount);
	    case DTReferenceArray(qualident, dimensions): return DTReferenceArray(qualident, dimensions + bCount);
	}
}
*/
/*---------------------------- modifiers ----------------------------*/

function addModifier(set:EnumSet<Modifier>, modifier:Modifier):Void {
	if (set.contains(modifier))
		error("repeated modifier " + modifier);
	else
		set.add(modifier);
}

function checkModifierPermission(set:EnumSet<Modifier>, permission:EnumSet<Modifier>):Void {
	for (modifier in set)
		if (!permission.contains(modifier))
			error("modifier(s) " + set + "not allowed here");
	else
		checkModifierAccess(set);
}

function checkModifierAccess(set:EnumSet<Modifier>):Void {
	var access:Int = 0;
	if (set.contains(MPublic))
		access++;
	if (set.contains(MPrivate))
		access++;
	if (set.contains(MProtected))
		access++;
	if (access > 1)
		error("illegal combination of modifiers: " + set);
}

/*---------------------------- contexts ----------------------------*/

var classContexts:Array<ClassContext>;
//var blockContexts:Array<BlockContext>;

function getClassPrefix():String
{
	var prefix = '';
	for (context in classContexts)
		prefix = context.identifier + '$' + prefix;
	return prefix;
}

/*-----------------------------------------------------------------*
 * Resolver routines to resolve LL(1) conflicts:                   *
 * These routines return a boolean value that indicates            *
 * whether the alternative at hand shall be choosen or not.        *
 * They are used in IF ( ... ) expressions.                        *       
 *-----------------------------------------------------------------*/

// ',' (no '}')
function commaAndNoRBrace():Bool {
  return (la.kind == _comma && peek(1).kind != _rbrace);
}

// '.' ident
function dotAndIdent():Bool {
  return la.kind == _dot && peek(1).kind == _ident;
}

// ident '('
function identAndLPar ():Bool {
  return la.kind == _ident && peek(1).kind == _lpar;
}

// ident ':'
function isLabel():Bool {
  return la.kind == _ident && peek(1).kind == _colon;
}

// '[' (no ']')
function nonEmptyBracket():Bool {
  return (la.kind == _lbrack && peek(1).kind != _rbrack);
}

// '['']'
function emptyBracket():Bool {
  return (la.kind == _lbrack && peek(1).kind == _rbrack);
}

// final or Type ident
function isLocalVarDecl(finalIsSuccess:Bool):Bool {
  var pt:Token = la;
  scanner.ResetPeek();
  
  if (la.kind == _final) 
    if (finalIsSuccess) return true;
    else pt = scanner.Peek();

  // basicType | ident
  if (typeKW.get(pt.kind))
    pt = scanner.Peek();
  else
    pt = rdQualident(pt);
    
  if (pt != null) {
    pt = skipDims(pt);
    if (pt != null) {
      return pt.kind == _ident;
    }
  }
  return false;
}

function isTypeCast():Bool {
  if (la.kind != _lpar) return false;
  if (isSimpleTypeCast()) return true;
  return guessTypeCast();
}

// '.' ("super" '.' | "class" | "this") | '(' | '['']'
function isIdentSuffix():Bool {
  if (la.kind == _dot) {
    scanner.ResetPeek();
    var pt:Token = scanner.Peek();
    if (pt.kind == _super) return scanner.Peek().kind == _dot;
    return (pt.kind == _class || pt.kind == _this);
  }
  return (la.kind == _lpar || emptyBracket());
}

/*--------------------------- program type -------------------------*/

/* http://dev.processing.org/source/index.cgi/trunk/processing/app/src/processing/app/preproc/pde.g?view=markup */

function isJavaProgram():Bool {
	return (la.kind == _public && peek(1).kind == _class);
}

function isActiveProgram():Bool {
	return (la.kind == _void && peek(1).kind == _ident && peek(2).kind == _lpar);
}

/*[NOTE] pde vs. java changes are available here:
http://dev.processing.org/source/index.cgi/trunk/processing/app/src/processing/app/preproc/pde.g?view=markup */

/*-------------------------------------------------------------------------*/


	
	public var context:CompilationUnitContext;

	public function new(scanner:Scanner, context:CompilationUnitContext) {
		errDist = minErrDist;
		this.scanner = scanner;
		this.context = context;
		errors = new Errors();
		
		// parsing contexts
		classContexts = [];
//		blockContexts = [];
	}

	function SynErr (n:Int):Void {
		if (errDist >= minErrDist) errors.SynErr(la.line, la.col, n);
		errDist = 0;
	}

	public function SemErr (msg:String):Void {
		if (errDist >= minErrDist) errors.SemErr(t.line, t.col, msg);
		errDist = 0;
	}
	
	function Get ():Void {
		while (true) {
			t = la;
			la = scanner.Scan();
			if (la.kind <= maxT) {
				++errDist;
				break;
			}

			la = t;
		}
	}
	
	function Expect (n:Int):Void {
		if (la.kind==n) Get(); else { SynErr(n); }
	}
	
	function StartOf (s:Int):Bool {
		return set[s][la.kind];
	}
	
	function ExpectWeak (n:Int, follow:Int):Void {
		if (la.kind == n) Get();
		else {
			SynErr(n);
			while (!StartOf(follow)) Get();
		}
	}
	
	function WeakSeparator (n:Int, syFol:Int, repFol:Int):Bool {
		var kind:Int = la.kind;
		if (kind == n) { Get(); return true; }
		else if (StartOf(repFol)) return false;
		else {
			SynErr(n);
			while (!(set[syFol][kind] || set[repFol][kind] || set[0][kind])) {
				Get();
				kind = la.kind;
			}
			return StartOf(syFol);
		}
	}
	
	function PdeProgram():Void {
		while (la.kind == 14) {
			var importIdent:Array<String> = ImportDeclaration();
			context.imports.push(importIdent); 
		}
		if (isJavaProgram()) {
			TypeDeclaration();
			while (StartOf(1)) {
				TypeDeclaration();
			}
		} else if (StartOf(2)) {
			context.imports.push(['xpde', 'core', '*']);
			context.imports.push(['xpde', 'xml', '*']);
					// initialize active program
			classContexts.unshift(new ClassContext(new EnumSet<Modifier>([MPublic]), context.identifier));
			classContexts[0].extend = ['xpde', 'core', 'PApplet'];
			
			ClassBodyDeclaration();
			while (StartOf(2)) {
				ClassBodyDeclaration();
			}
			context.types.push(classContexts.shift());
				// validate script
			if (la.kind != _EOF)
				error("unexpected script termination");
			
		} else SynErr(58);
	}

	function ImportDeclaration():Array<String> {
		var importIdent:Array<String> = null;
		Expect(14);
		Expect(1);
		importIdent = [t.val]; 
		var arg:Array<String> = QualifiedImport();
		Expect(42);
		importIdent = importIdent.concat(arg); 
		return importIdent;
	}

	function TypeDeclaration():Void {
		if (StartOf(3)) {
			var typeContext:TypeContext = ClassOrInterfaceDeclaration();
			context.types.push(typeContext); 
		} else if (la.kind == 42) {
			Get();
		} else SynErr(59);
	}

	function ClassBodyDeclaration():Void {
		if (la.kind == 42) {
			Get();
		} else if (StartOf(4)) {
			var modifiers = new EnumSet<Modifier>(); 
			if (la.kind == 21) {
				Get();
				addModifier(modifiers, MStatic); 
			}
			if (StartOf(5)) {
				UnparsedSegment(new StringBuf());
			} else if (StartOf(6)) {
				if (StartOf(7)) {
					Modifier1(modifiers);
					while (StartOf(8)) {
						Modifier0(modifiers);
					}
				}
				MemberDecl(modifiers);
			} else SynErr(60);
		} else SynErr(61);
	}

	function CompilationUnit():Void {
		if (la.kind == 41) {
			Get();
			var qualident:Array<String> = Qualident();
			context.packageDeclaration = qualident; 
			Expect(42);
		}
		while (la.kind == 14) {
			var importIdent:Array<String> = ImportDeclaration();
			context.imports.push(importIdent); 
		}
		while (StartOf(1)) {
			TypeDeclaration();
		}
		if (la.kind != _EOF) error("'class' or 'interface' expected"); 
	}

	function Qualident():Array<String> {
		var qualident:Array<String> = null;
		qualident = []; 
		Expect(1);
		qualident.push(t.val); 
		while (la.kind == 29) {
			Get();
			Expect(1);
			qualident.push(t.val); 
		}
		return qualident;
	}

	function UnparsedSegment(buffer:StringBuf):Void {
		if (la.kind == 33) {
			Get();
			buffer.add('('); 
			while (StartOf(9)) {
				if (StartOf(5)) {
					UnparsedSegment(buffer);
				} else {
					Get();
					buffer.add(t.val); 
				}
			}
			Expect(39);
			buffer.add(')'); 
		} else if (la.kind == 32) {
			Get();
			buffer.add('['); 
			while (StartOf(10)) {
				if (StartOf(5)) {
					UnparsedSegment(buffer);
				} else {
					Get();
					buffer.add(t.val); 
				}
			}
			Expect(38);
			buffer.add(']'); 
		} else if (la.kind == 31) {
			UnparsedBlock(buffer);
		} else if (la.kind == 5) {
			Get();
			buffer.add(t.val); 
		} else SynErr(62);
	}

	function UnparsedBlock(buffer:StringBuf):Void {
		Expect(31);
		buffer.add('{'); 
		while (StartOf(11)) {
			if (StartOf(5)) {
				UnparsedSegment(buffer);
			} else {
				Get();
				buffer.add(t.val); 
			}
		}
		Expect(37);
		buffer.add('}'); 
	}

	function UnparsedExpression(buffer:StringBuf):Void {
		while (StartOf(12)) {
			if (StartOf(5)) {
				UnparsedSegment(buffer);
			} else {
				Get();
				buffer.add(t.val); 
			}
		}
		Expect(42);
	}

	function QualifiedImport():Array<String> {
		var importIdent:Array<String> = null;
		Expect(29);
		if (la.kind == 1) {
			Get();
			importIdent = [t.val]; 
			if (la.kind == 29) {
				var arg:Array<String> = QualifiedImport();
				importIdent = importIdent.concat(arg); 
			}
		} else if (la.kind == 43) {
			Get();
			importIdent = ['*']; 
		} else SynErr(63);
		return importIdent;
	}

	function ClassOrInterfaceDeclaration():TypeContext {
		var typeContext:TypeContext = null;
		var modifiers = new EnumSet<Modifier>(); 
		while (StartOf(13)) {
			ClassModifier(modifiers);
		}
		if (la.kind == 9) {
			var arg:TypeContext = ClassDeclaration(modifiers);
			typeContext = arg; 
		} else if (la.kind == 56) {
			var arg:TypeContext = InterfaceDeclaration(modifiers);
			typeContext = arg; 
		} else SynErr(64);
		return typeContext;
	}

	function ClassModifier(modifiers:EnumSet<Modifier>):Void {
		switch (la.kind) {
		case 19: 
			Get();
			addModifier(modifiers, MPublic); 
		case 44: 
			Get();
			addModifier(modifiers, MProtected); 
		case 45: 
			Get();
			addModifier(modifiers, MPrivate); 
		case 46: 
			Get();
			addModifier(modifiers, MAbstract); 
		case 21: 
			Get();
			addModifier(modifiers, MStatic); 
		case 12: 
			Get();
			addModifier(modifiers, MFinal); 
		case 47: 
			Get();
			addModifier(modifiers, MStrictfp); 
		default: SynErr(65);
		}
	}

	function ClassDeclaration(modifiers:EnumSet<Modifier>):TypeContext {
		var typeContext:TypeContext = null;
		checkModifierPermission(modifiers, ModifierSet.classes); 
		Expect(9);
		Expect(1);
		classContexts.unshift(new ClassContext(modifiers, t.val, classContexts[0])); 
		if (la.kind == 53) {
			Get();
			var arg:Array<String> = Qualident();
			classContexts[0].extend = arg; 
		}
		if (la.kind == 54) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			classContexts[0].implement = arg; 
		}
		ClassBody();
		typeContext = classContexts.shift(); 
		return typeContext;
	}

	function InterfaceDeclaration(modifiers:EnumSet<Modifier>):TypeContext {
		var typeContext:TypeContext = null;
		checkModifierPermission(modifiers, ModifierSet.interfaces); 
		Expect(56);
		Expect(1);
		if (la.kind == 53) {
			Get();
			var extend:Array<Array<String>> = QualidentList();
		}
		InterfaceBody();
		return typeContext;
	}

	function Modifier0(modifiers:EnumSet<Modifier>):Void {
		if (la.kind == 21) {
			Get();
			addModifier(modifiers, MStatic); 
		} else if (StartOf(7)) {
			Modifier1(modifiers);
		} else SynErr(66);
	}

	function Modifier1(modifiers:EnumSet<Modifier>):Void {
		switch (la.kind) {
		case 19: 
			Get();
			addModifier(modifiers, MPublic); 
		case 44: 
			Get();
			addModifier(modifiers, MProtected); 
		case 45: 
			Get();
			addModifier(modifiers, MPrivate); 
		case 46: 
			Get();
			addModifier(modifiers, MAbstract); 
		case 12: 
			Get();
			addModifier(modifiers, MFinal); 
		case 48: 
			Get();
			addModifier(modifiers, MNative); 
		case 49: 
			Get();
			addModifier(modifiers, MSynchronized); 
		case 50: 
			Get();
			addModifier(modifiers, MTransient); 
		case 51: 
			Get();
			addModifier(modifiers, MVolatile); 
		case 47: 
			Get();
			addModifier(modifiers, MStrictfp); 
		default: SynErr(67);
		}
	}

	function Type():ParserDataType {
		var type:ParserDataType = null;
		if (la.kind == 1) {
			var qualident:Array<String> = Qualident();
			type = PReference(qualident); 
		} else if (StartOf(14)) {
			var primitive:PrimitiveType = BasicType();
			type = PPrimitive(primitive); 
		} else SynErr(68);
		var bCount:Int = BracketsOpt();
		if (bCount > 0) type = PArray(type, bCount); 
		return type;
	}

	function BasicType():PrimitiveType {
		var type:PrimitiveType = null;
		switch (la.kind) {
		case 7: 
			Get();
			type = PTByte; 
		case 20: 
			Get();
			type = PTShort; 
		case 8: 
			Get();
			type = PTChar; 
		case 15: 
			Get();
			type = PTInt; 
		case 16: 
			Get();
			type = PTLong; 
		case 13: 
			Get();
			type = PTFloat; 
		case 10: 
			Get();
			type = PTDouble; 
		case 6: 
			Get();
			type = PTBoolean; 
		default: SynErr(69);
		}
		return type;
	}

	function BracketsOpt():Int {
		var bCount:Int = null;
		bCount = 0; 
		while (la.kind == 32) {
			Get();
			Expect(38);
			bCount++; 
		}
		return bCount;
	}

	function FormalParameter0():FormalParameterContext {
		var parameter:FormalParameterContext = null;
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 12) {
			Get();
			modifiers.add(MFinal); 
		}
		var type:ParserDataType = Type();
		Expect(1);
		var identifier:String = t.val; 
		var bCount:Int = BracketsOpt();
		if (bCount > 0) type = PArray(type, bCount); 
		parameter = new FormalParameterContext(modifiers, type, identifier); 
		return parameter;
	}

	function QualidentList():Array<Array<String>> {
		var list:Array<Array<String>> = null;
		list = []; 
		var qualident:Array<String> = Qualident();
		list.push(qualident); 
		while (la.kind == 27) {
			Get();
			var qualident:Array<String> = Qualident();
			list.push(qualident); 
		}
		return list;
	}

	function VariableDeclarator(modifiers:EnumSet<Modifier>, type:ParserDataType):FieldContext {
		var context:FieldContext = null;
		Expect(1);
		context = new FieldContext(modifiers, type, t.val); 
		VariableDeclaratorRest(context);
		return context;
	}

	function VariableDeclaratorRest(context:FieldContext):Void {
		var bCount:Int = BracketsOpt();
		if (bCount > 0) context.type = PArray(context.type, bCount); 
		if (la.kind == 52) {
			Get();
			UnparsedExpression(new StringBuf());
		}
	}

	function ClassBody():Void {
		Expect(31);
		while (StartOf(2)) {
			ClassBodyDeclaration();
		}
		Expect(37);
	}

	function MemberDecl(modifiers:EnumSet<Modifier>):Void {
		if (identAndLPar()) {
			Expect(1);
			var identifier:String = t.val;
			// validate constructor name
			if (identifier != classContexts[0].identifier) error('invalid function declaration'); 
			ConstructorDeclaratorRest(new MethodContext(modifiers, null, identifier));
		} else if (StartOf(15)) {
			MethodOrFieldDecl(modifiers);
		} else if (la.kind == 25) {
			checkModifierPermission(modifiers, ModifierSet.methods); 
			Get();
			Expect(1);
			var identifier:String = t.val; 
			VoidMethodDeclaratorRest(new MethodContext(modifiers, null, identifier));
		} else if (la.kind == 9) {
			var typeContext:TypeContext = ClassDeclaration(modifiers);
			classContexts[0].types.push(typeContext); 
		} else if (la.kind == 56) {
			var typeContext:TypeContext = InterfaceDeclaration(modifiers);
			classContexts[0].types.push(typeContext); 
		} else SynErr(70);
	}

	function ConstructorDeclaratorRest(methodContext:MethodContext):Void {
		checkModifierPermission(methodContext.modifiers, ModifierSet.constructors); 
		var arg:Array<FormalParameterContext> = FormalParameters();
		methodContext.parameters = arg; 
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		UnparsedBlock(new StringBuf());
		classContexts[0].methods.push(methodContext); 
	}

	function MethodOrFieldDecl(modifiers:EnumSet<Modifier>):Void {
		var type:ParserDataType = Type();
		Expect(1);
		var identifier:String = t.val; 
		MethodOrFieldRest(modifiers, identifier, type);
	}

	function VoidMethodDeclaratorRest(methodContext:MethodContext):Void {
		var arg:Array<FormalParameterContext> = FormalParameters();
		methodContext.parameters = arg; 
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		if (la.kind == 31) {
			var buffer:StringBuf = new StringBuf(); 
			UnparsedBlock(buffer);
			trace(buffer); 
		} else if (la.kind == 42) {
			Get();
		} else SynErr(71);
		classContexts[0].methods.push(methodContext); 
	}

	function MethodOrFieldRest(modifiers:EnumSet<Modifier>, identifier:String, type:ParserDataType):Void {
		if (StartOf(16)) {
			checkModifierPermission(modifiers, ModifierSet.fields);  
			VariableDeclaratorsRest(modifiers, type, identifier);
			Expect(42);
		} else if (la.kind == 33) {
			checkModifierPermission(modifiers, ModifierSet.methods); 
			MethodDeclaratorRest(new MethodContext(modifiers, type, identifier));
		} else SynErr(72);
	}

	function VariableDeclaratorsRest(modifiers:EnumSet<Modifier>, type:ParserDataType, identifier:String):Void {
		var context = new FieldContext(modifiers, type, identifier); 
		VariableDeclaratorRest(context);
		classContexts[0].fields.push(context); 
		while (la.kind == 27) {
			Get();
			var context:FieldContext = VariableDeclarator(modifiers, type);
			classContexts[0].fields.push(context); 
		}
	}

	function MethodDeclaratorRest(methodContext:MethodContext):Void {
		var arg:Array<FormalParameterContext> = FormalParameters();
		methodContext.parameters = arg; 
		var bCount:Int = BracketsOpt();
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		if (la.kind == 31) {
			var buffer:StringBuf = new StringBuf(); 
			UnparsedBlock(buffer);
			trace(buffer); 
		} else if (la.kind == 42) {
			Get();
		} else SynErr(73);
		classContexts[0].methods.push(methodContext); 
	}

	function FormalParameters():Array<FormalParameterContext> {
		var parameters:Array<FormalParameterContext> = null;
		parameters = []; 
		Expect(33);
		if (StartOf(17)) {
			var parameter:FormalParameterContext = FormalParameter0();
			parameters.push(parameter); 
			while (la.kind == 27) {
				Get();
				var parameter:FormalParameterContext = FormalParameter0();
				parameters.push(parameter); 
			}
		}
		Expect(39);
		return parameters;
	}

	function InterfaceBody():Void {
		Expect(31);
		while (StartOf(18)) {
			InterfaceBodyDeclaration();
		}
		Expect(37);
	}

	function InterfaceBodyDeclaration():Void {
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 42) {
			Get();
		} else if (StartOf(19)) {
			while (StartOf(8)) {
				Modifier0(modifiers);
			}
			InterfaceMemberDecl(modifiers);
		} else SynErr(74);
	}

	function InterfaceMemberDecl(modifiers:EnumSet<Modifier>):Void {
		if (StartOf(15)) {
			InterfaceMethodOrFieldDecl(modifiers);
		} else if (la.kind == 25) {
			checkModifierPermission(modifiers, ModifierSet.interfaces); 
			Get();
			Expect(1);
			VoidInterfaceMethodDeclaratorRest();
		} else if (la.kind == 9) {
			var typeContext:TypeContext = ClassDeclaration(modifiers);
		} else if (la.kind == 56) {
			var typeContext:TypeContext = InterfaceDeclaration(modifiers);
		} else SynErr(75);
	}

	function InterfaceMethodOrFieldDecl(modifiers:EnumSet<Modifier>):Void {
		var type:ParserDataType = Type();
		Expect(1);
		InterfaceMethodOrFieldRest(modifiers);
	}

	function VoidInterfaceMethodDeclaratorRest():Void {
		var parameters:Array<FormalParameterContext> = FormalParameters();
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
		}
		Expect(42);
	}

	function InterfaceMethodOrFieldRest(modifiers:EnumSet<Modifier>):Void {
		if (la.kind == 32 || la.kind == 52) {
			checkModifierPermission(modifiers, ModifierSet.constants);  
			ConstantDeclaratorsRest();
			Expect(42);
		} else if (la.kind == 33) {
			checkModifierPermission(modifiers, ModifierSet.interfaces); 
			InterfaceMethodDeclaratorRest();
		} else SynErr(76);
	}

	function ConstantDeclaratorsRest():Void {
		ConstantDeclaratorRest();
		while (la.kind == 27) {
			Get();
			ConstantDeclarator();
		}
	}

	function InterfaceMethodDeclaratorRest():Void {
		var parameters:Array<FormalParameterContext> = FormalParameters();
		var bCount:Int = BracketsOpt();
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
		}
		Expect(42);
	}

	function ConstantDeclaratorRest():Void {
		var bCount:Int = BracketsOpt();
		Expect(52);
		UnparsedExpression(new StringBuf());
	}

	function ConstantDeclarator():Void {
		Expect(1);
		ConstantDeclaratorRest();
	}



	public function Parse():Void {
		// parse AST
		la = new Token();
		la.val = "";		
		Get();
		PdeProgram();

		Expect(0);
	}

	inline static var T:Bool = true;
	inline static var x:Bool = false;
	private static var set:Array<Array<Bool>> = [
		[T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,T,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x],
		[x,T,x,x, x,T,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, T,T,x,x, x,x,x,x, x,x,T,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x],
		[x,T,x,x, x,T,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, T,T,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x],
		[x,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,T, T,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,x, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,x,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,T,T, T,T,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,T,T, T,x,T,x, x,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,x,T,x, x,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,T,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,x,T,x, T,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,T,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x]

	];
}

class Errors
{
	public var count:Int;                                    // number of errors detected
	static var errMsgFormat:String = "-- line {0} col {1}: {2}"; // 0=line, 1=column, 2=text
	
	public function new() {
		count = 0;
	}
	
	public function printMsg(line:Int, column:Int, msg:String):Void {
		var b:String = errMsgFormat;
		b = StringTools.replace(b, '{0}', Std.string(line));
		b = StringTools.replace(b, '{1}', Std.string(column));
		b = StringTools.replace(b, '{2}', msg);
		trace(b);
	}
	
	public function SynErr (line:Int, col:Int, n:Int):Void {
		var s:String;
		switch (n) {
			case 0: s = "EOF expected";
			case 1: s = "ident expected";
			case 2: s = "intLit expected";
			case 3: s = "floatLit expected";
			case 4: s = "charLit expected";
			case 5: s = "stringLit expected";
			case 6: s = "boolean expected";
			case 7: s = "byte expected";
			case 8: s = "char expected";
			case 9: s = "class expected";
			case 10: s = "double expected";
			case 11: s = "false expected";
			case 12: s = "final expected";
			case 13: s = "float expected";
			case 14: s = "import_ expected";
			case 15: s = "int expected";
			case 16: s = "long expected";
			case 17: s = "new expected";
			case 18: s = "null expected";
			case 19: s = "public expected";
			case 20: s = "short expected";
			case 21: s = "static expected";
			case 22: s = "super expected";
			case 23: s = "this expected";
			case 24: s = "true expected";
			case 25: s = "void expected";
			case 26: s = "colon expected";
			case 27: s = "comma expected";
			case 28: s = "dec expected";
			case 29: s = "dot expected";
			case 30: s = "inc expected";
			case 31: s = "lbrace expected";
			case 32: s = "lbrack expected";
			case 33: s = "lpar expected";
			case 34: s = "minus expected";
			case 35: s = "not expected";
			case 36: s = "plus expected";
			case 37: s = "rbrace expected";
			case 38: s = "rbrack expected";
			case 39: s = "rpar expected";
			case 40: s = "tilde expected";
			case 41: s = "\"package\" expected";
			case 42: s = "\";\" expected";
			case 43: s = "\"*\" expected";
			case 44: s = "\"protected\" expected";
			case 45: s = "\"private\" expected";
			case 46: s = "\"abstract\" expected";
			case 47: s = "\"strictfp\" expected";
			case 48: s = "\"native\" expected";
			case 49: s = "\"synchronized\" expected";
			case 50: s = "\"transient\" expected";
			case 51: s = "\"volatile\" expected";
			case 52: s = "\"=\" expected";
			case 53: s = "\"extends\" expected";
			case 54: s = "\"implements\" expected";
			case 55: s = "\"throws\" expected";
			case 56: s = "\"interface\" expected";
			case 57: s = "??? expected";
			case 58: s = "invalid PdeProgram";
			case 59: s = "invalid TypeDeclaration";
			case 60: s = "invalid ClassBodyDeclaration";
			case 61: s = "invalid ClassBodyDeclaration";
			case 62: s = "invalid UnparsedSegment";
			case 63: s = "invalid QualifiedImport";
			case 64: s = "invalid ClassOrInterfaceDeclaration";
			case 65: s = "invalid ClassModifier";
			case 66: s = "invalid Modifier0";
			case 67: s = "invalid Modifier1";
			case 68: s = "invalid Type";
			case 69: s = "invalid BasicType";
			case 70: s = "invalid MemberDecl";
			case 71: s = "invalid VoidMethodDeclaratorRest";
			case 72: s = "invalid MethodOrFieldRest";
			case 73: s = "invalid MethodDeclaratorRest";
			case 74: s = "invalid InterfaceBodyDeclaration";
			case 75: s = "invalid InterfaceMemberDecl";
			case 76: s = "invalid InterfaceMethodOrFieldRest";
			default: s = "error " + n;
		}
		printMsg(line, col, s);
		count++;
		throw new FatalError(s);
	}

	public function SemErr (?line:Int, ?col:Int, s:String):Void {
		line == null ? printMsg(line, col, s) : trace(s);
		count++;
		throw new FatalError(s);
	}
	
	public function Warning (?line:Int, ?col:Int, s:String):Void {	
		line == null ? printMsg(line, col, s): trace(s);
	}
}

class FatalError
{
	public var message:String;
	public static var serialVersionUID:Float = 1.0;
	public function new(s:String) { this.message = s; }
}
  
/*-------------------- bit array ----------------------------------*/

class BitSet 
{
	private var bitset:Array < Bool >;

	public function new(nbits:Int) 
	{
		bitset = [];
		for (i in 0...nbits)
			bitset.push(false);
	}
	
	inline public function get(bitIndex:Int):Bool
	{
		return bitset[bitIndex];
	}
	
	inline public function set(bitIndex:Int)
	{
		bitset[bitIndex] = true;
	}
	
	public function or(bitset2:BitSet)
	{
		for (i in 0...bitset.length)
			bitset[i] = bitset[i] || bitset2.get(i);
	}
}

/*------------------- enum set -----------------------------*/

class EnumSet<T>
{
	private var set:Array<T>;

	public function new(?enums:Array<Dynamic>)
	{
		set = [];
		if (enums != null)
			for (item in enums)
				add(item);
	}
	
	public function add(item:T)
	{
		if (!contains(item))
			set.push(item);
	}

	public function contains(itemA:T)
	{
		for (itemB in set)
			if (Type.enumEq(itemA, itemB))
				return true;
		return false;
	}
	
	public function iterator():Iterator<T>
	{
		return set.iterator();
	}
	
	public function toString():String
	{
		return set.join(' ');
	}
}

