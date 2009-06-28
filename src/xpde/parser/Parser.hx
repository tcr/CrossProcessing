package xpde.parser;

import xpde.parser.Scanner;
import xpde.parser.AST;
import xpde.parser.EnumSet;

class Parser {
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
	public static var maxT:Int = 101;

	inline static var T:Bool = true;
	inline static var x:Bool = false;
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
	    case ECall(_, _):
	    case ECallMethod(_, _, _):
	    case EObjectInstantiation(_, _):
	    case EAssignment(_, _, _):
	    case EPrefix(_, _):
	    case EPostfix(_, _):
	    default: error("not a statement" + " (" + expression + ")");
	}
}

/*---------------------------- type ----------------------------*/

function compoundBrackets(type:DataType, bCount:Int):DataType {
	if (bCount == 0)
		return type;
	switch (type) {
	    case DTArray(type, dimensions): return DTArray(type, dimensions + bCount);
	    default: return DTArray(type, bCount);
	}
}

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
	return (la.kind == _public && peek(1).kind == _class) || (la.kind == _import_);
}

function isActiveProgram():Bool {
	return (la.kind == _void && peek(1).kind == _ident && peek(2).kind == _lpar);
}

/*[NOTE] pde vs. java changes are available here:
http://dev.processing.org/source/index.cgi/trunk/processing/app/src/processing/app/preproc/pde.g?view=markup */

/*-------------------------------------------------------------------------*/



	public function new(scanner:Scanner) {
		errDist = minErrDist;
		this.scanner = scanner;
		errors = new Errors();
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
	
	function PdeProgram():PdeProgram {
		var program:PdeProgram = null;
		if (isJavaProgram()) {
			program = new JavaProgram(); 
			CompilationUnit(cast(program, CompilationUnitScope));
		} else if (StartOf(1)) {
			var tempScope:BlockScope = new BlockScope(); 
			while (isLocalVarDecl(false)) {
				LocalVariableDeclaration(tempScope);
				Expect(41);
			}
			if (isActiveProgram()) {
				program = new ActiveProgram(); (cast(program, Scope)).concat(tempScope); 
				ClassBodyDeclaration(cast(program, ClassScope));
				while (StartOf(2)) {
					ClassBodyDeclaration(cast(program, ClassScope));
				}
			} else if (StartOf(3)) {
				program = new StaticProgram(); (cast(program, Scope)).concat(tempScope); 
				BlockStatement(cast(program, BlockScope));
				while (StartOf(3)) {
					BlockStatement(cast(program, BlockScope));
				}
			} else SynErr(102);
			if (la.kind != _EOF) error("unexpected script termination"); 
		} else SynErr(103);
		return program;
	}

	function CompilationUnit(scope:CompilationUnitScope):Void {
		if (la.kind == 42) {
			Get();
			var qualident:Array<String> = Qualident();
			scope.setPackage(qualident); 
			Expect(41);
		}
		while (la.kind == 14) {
			var importIdent:Array<String> = ImportDeclaration();
			scope.pushImport(importIdent); 
		}
		while (StartOf(4)) {
			TypeDeclaration(scope);
		}
		if (la.kind != _EOF) error("'class' or 'interface' expected"); 
	}

	function LocalVariableDeclaration(scope:BlockScope):Void {
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 12) {
			Get();
			modifiers.add(MFinal); 
		}
		var type:DataType = Type();
		VariableDeclarators(scope, modifiers, type);
	}

	function ClassBodyDeclaration(scope:ClassScope):Void {
		if (la.kind == 41) {
			Get();
		} else if (StartOf(5)) {
			var m = new EnumSet<Modifier>(); 
			if (la.kind == 21) {
				Get();
				addModifier(m, MStatic); 
			}
			if (la.kind == 31) {
				var block:Statement = Block(null);
				scope.pushStatement(block); 
			} else if (StartOf(6)) {
				if (StartOf(7)) {
					Modifier1(m);
					while (StartOf(8)) {
						Modifier0(m);
					}
				}
				MemberDecl(scope, m);
			} else SynErr(104);
		} else SynErr(105);
	}

	function BlockStatement(scope:BlockScope):Void {
		if (isLocalVarDecl(false)) {
			LocalVariableDeclaration(scope);
			Expect(41);
		} else if (StartOf(9)) {
			ClassOrInterfaceDeclaration(scope);
		} else if (StartOf(10)) {
			var statement:Statement = Statement0(scope);
			scope.pushStatement(statement); 
		} else SynErr(106);
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

	function ImportDeclaration():Array<String> {
		var importIdent:Array<String> = null;
		Expect(14);
		Expect(1);
		importIdent = [t.val]; 
		var arg:Array<String> = QualifiedImport();
		Expect(41);
		importIdent = importIdent.concat(arg); 
		return importIdent;
	}

	function TypeDeclaration(scope:Scope):Void {
		if (StartOf(9)) {
			ClassOrInterfaceDeclaration(scope);
		} else if (la.kind == 41) {
			Get();
		} else SynErr(107);
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
		} else SynErr(108);
		return importIdent;
	}

	function ClassOrInterfaceDeclaration(scope:Scope):Void {
		var m = new EnumSet<Modifier>(); 
		while (StartOf(11)) {
			ClassModifier(m);
		}
		if (la.kind == 9) {
			ClassDeclaration(scope, m);
		} else if (la.kind == 56) {
			InterfaceDeclaration(scope, m);
		} else SynErr(109);
	}

	function ClassModifier(m:EnumSet<Modifier>):Void {
		switch (la.kind) {
		case 19: 
			Get();
			addModifier(m, MPublic); 
		case 44: 
			Get();
			addModifier(m, MProtected); 
		case 45: 
			Get();
			addModifier(m, MPrivate); 
		case 46: 
			Get();
			addModifier(m, MAbstract); 
		case 21: 
			Get();
			addModifier(m, MStatic); 
		case 12: 
			Get();
			addModifier(m, MFinal); 
		case 47: 
			Get();
			addModifier(m, MStrictfp); 
		default: SynErr(110);
		}
	}

	function ClassDeclaration(scope:Scope, m:EnumSet<Modifier>):Void {
		checkModifierPermission(m, ModifierSet.classes); 
		Expect(9);
		Expect(1);
		var identifier:String = t.val, extend:DataType = null, implement:Array<DataType> = null; 
		if (la.kind == 53) {
			Get();
			var arg:DataType = Type();
			extend = arg; 
		}
		if (la.kind == 54) {
			Get();
			var arg:Array<DataType> = TypeList();
			implement = arg; 
		}
		var classScope:ClassScope = ClassBody();
		scope.pushDefinition(DClass(identifier, m, classScope.getDefinitions(), extend, implement, null, classScope.getStatement())); 
	}

	function InterfaceDeclaration(scope:Scope, m:EnumSet<Modifier>):Void {
		checkModifierPermission(m, ModifierSet.interfaces); 
		Expect(56);
		Expect(1);
		if (la.kind == 53) {
			Get();
			var extend:Array<DataType> = TypeList();
		}
		InterfaceBody();
	}

	function Modifier0(m:EnumSet<Modifier>):Void {
		if (la.kind == 21) {
			Get();
			addModifier(m, MStatic); 
		} else if (StartOf(7)) {
			Modifier1(m);
		} else SynErr(111);
	}

	function Modifier1(m:EnumSet<Modifier>):Void {
		switch (la.kind) {
		case 19: 
			Get();
			addModifier(m, MPublic); 
		case 44: 
			Get();
			addModifier(m, MProtected); 
		case 45: 
			Get();
			addModifier(m, MPrivate); 
		case 46: 
			Get();
			addModifier(m, MAbstract); 
		case 12: 
			Get();
			addModifier(m, MFinal); 
		case 48: 
			Get();
			addModifier(m, MNative); 
		case 49: 
			Get();
			addModifier(m, MSynchronized); 
		case 50: 
			Get();
			addModifier(m, MTransient); 
		case 51: 
			Get();
			addModifier(m, MVolatile); 
		case 47: 
			Get();
			addModifier(m, MStrictfp); 
		default: SynErr(112);
		}
	}

	function Type():DataType {
		var type:DataType = null;
		if (la.kind == 1) {
			var qualident:Array<String> = Qualident();
			type = DTReference(qualident); 
		} else if (StartOf(12)) {
			var primitive:PrimitiveType = BasicType();
			type = DTPrimitive(primitive); 
		} else SynErr(113);
		var bCount:Int = BracketsOpt();
		type = compoundBrackets(type, bCount); 
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
		default: SynErr(114);
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

	function TypeList():Array<DataType> {
		var list:Array<DataType> = null;
		list = []; 
		var type:DataType = Type();
		list.push(type); 
		while (la.kind == 27) {
			Get();
			var type:DataType = Type();
			list.push(type); 
		}
		return list;
	}

	function FormalParameter0():FormalParameter {
		var parameter:FormalParameter = null;
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 12) {
			Get();
			modifiers.add(MFinal); 
		}
		var type:DataType = Type();
		Expect(1);
		var identifier:String = t.val; 
		var bCount:Int = BracketsOpt();
		type = compoundBrackets(type, bCount); 
		parameter = {identifier: identifier, type: type, modifiers: modifiers}; 
		return parameter;
	}

	function QualidentList():Void {
		var list:Array<Array<String>> = []; 
		var qualident:Array<String> = Qualident();
		list.push(qualident); 
		while (la.kind == 27) {
			Get();
			var qualident:Array<String> = Qualident();
			list.push(qualident); 
		}
	}

	function VariableDeclarator(scope:BlockScope, modifiers:EnumSet<Modifier>, type:DataType):Void {
		Expect(1);
		var identifier:String = t.val; 
		VariableDeclaratorRest(scope, modifiers, type, identifier);
	}

	function VariableDeclaratorRest(scope:BlockScope, modifiers:EnumSet<Modifier>, type:DataType, identifier:String):Void {
		var bCount:Int = BracketsOpt();
		type = compoundBrackets(type, bCount); 
		var init:Expression = null; 
		if (la.kind == 52) {
			Get();
			var expression:Expression = VariableInitializer();
			scope.pushStatement(SExpression(EAssignment(identifier, null, expression))); 
		}
		scope.pushDefinition(DField(identifier, type, modifiers)); 
	}

	function VariableInitializer():Expression {
		var expression:Expression = null;
		if (la.kind == 31) {
			var arg:Expression = ArrayInitializer();
			expression = arg; 
		} else if (StartOf(13)) {
			var arg:Expression = Expression0();
			expression = arg; 
		} else SynErr(115);
		return expression;
	}

	function ArrayInitializer():Expression {
		var expression:Expression = null;
		var values:Array<Expression> = []; 
		Expect(31);
		if (StartOf(14)) {
			var arg:Expression = VariableInitializer();
			values.push(arg); 
			while (commaAndNoRBrace()) {
				Expect(27);
				var arg:Expression = VariableInitializer();
				values.push(arg); 
			}
		}
		if (la.kind == 27) {
			Get();
		}
		Expect(37);
		return expression;
	}

	function Expression0():Expression {
		var expression:Expression = null;
		var expression:Expression = Expression1();
		while (StartOf(15)) {
			var operator:InfixOperator = AssignmentOperator();
			var value:Expression = Expression1();
			if (operator != null)
			value = EInfixOperation(operator, expression, value);
			// extract reference type
			switch (expression) {
			    case EReference(identifier, base): expression = EAssignment(identifier, base, value);
			    case EArrayAccess(index, base): expression = EArrayAssignment(index, base, value);
			    default: error('invalid assignment left-hand side');
			}
			
		}
		return expression;
	}

	function ClassBody():ClassScope {
		var classScope:ClassScope = null;
		classScope = new ClassScope(); 
		Expect(31);
		while (StartOf(2)) {
			ClassBodyDeclaration(classScope);
		}
		Expect(37);
		return classScope;
	}

	function Block(parent:BlockScope):Statement {
		var statement:Statement = null;
		var scope:BlockScope = new BlockScope(); 
		Expect(31);
		while (StartOf(3)) {
			BlockStatement(scope);
		}
		Expect(37);
		statement = scope.getStatement(); 
		return statement;
	}

	function MemberDecl(scope:ClassScope, m:EnumSet<Modifier>):Void {
		if (identAndLPar()) {
			Expect(1);
			var identifier:String = t.val; 
			ConstructorDeclaratorRest(scope, m, identifier);
		} else if (StartOf(16)) {
			MethodOrFieldDecl(scope, m);
		} else if (la.kind == 25) {
			checkModifierPermission(m, ModifierSet.methods); 
			Get();
			Expect(1);
			var identifier:String = t.val; 
			VoidMethodDeclaratorRest(scope, m, identifier);
		} else if (la.kind == 9) {
			ClassDeclaration(scope, m);
		} else if (la.kind == 56) {
			InterfaceDeclaration(scope, m);
		} else SynErr(116);
	}

	function ConstructorDeclaratorRest(scope:ClassScope, m:EnumSet<Modifier>, identifier:String):Void {
		checkModifierPermission(m, ModifierSet.constructors);
		var throwsList:Array<Array<String>> = []; 
		var parameters:Array<FormalParameter> = FormalParameters();
		if (la.kind == 55) {
			Get();
			QualidentList();
		}
		var body:Statement = Block(null);
		scope.pushDefinition(DMethod(identifier, null, m, parameters, body)); 
	}

	function MethodOrFieldDecl(scope:ClassScope, m:EnumSet<Modifier>):Void {
		var type:DataType = Type();
		Expect(1);
		var identifier:String = t.val; 
		MethodOrFieldRest(scope, m, identifier, type);
	}

	function VoidMethodDeclaratorRest(scope:ClassScope, m:EnumSet<Modifier>, identifier:String):Void {
		var body:Statement = null; 
		var parameters:Array<FormalParameter> = FormalParameters();
		if (la.kind == 55) {
			Get();
			QualidentList();
		}
		if (la.kind == 31) {
			var block:Statement = Block(null);
			body = block; 
		} else if (la.kind == 41) {
			Get();
		} else SynErr(117);
		scope.pushDefinition(DMethod(identifier, null, m, parameters, body)); 
	}

	function MethodOrFieldRest(scope:ClassScope, m:EnumSet<Modifier>, identifier:String, type:DataType):Void {
		if (StartOf(17)) {
			checkModifierPermission(m, ModifierSet.fields);  
			VariableDeclaratorsRest(scope, m, type, identifier);
			Expect(41);
		} else if (la.kind == 33) {
			checkModifierPermission(m, ModifierSet.methods); 
			MethodDeclaratorRest(scope, m, identifier, type);
		} else SynErr(118);
	}

	function VariableDeclaratorsRest(scope:BlockScope, m:EnumSet<Modifier>, type:DataType, identifier:String):Void {
		VariableDeclaratorRest(scope, m, type, identifier);
		while (la.kind == 27) {
			Get();
			VariableDeclarator(scope, m, type);
		}
	}

	function MethodDeclaratorRest(scope:ClassScope, m:EnumSet<Modifier>, identifier:String, type:DataType):Void {
		var body:Statement = null; 
		var parameters:Array<FormalParameter> = FormalParameters();
		var bCount:Int = BracketsOpt();
		if (la.kind == 55) {
			Get();
			QualidentList();
		}
		if (la.kind == 31) {
			var block:Statement = Block(null);
			body = block; 
		} else if (la.kind == 41) {
			Get();
		} else SynErr(119);
		scope.pushDefinition(DMethod(identifier, type, m, parameters, body)); 
	}

	function FormalParameters():Array<FormalParameter> {
		var parameters:Array<FormalParameter> = null;
		parameters = []; 
		Expect(33);
		if (StartOf(18)) {
			var parameter:FormalParameter = FormalParameter0();
			parameters.push(parameter); 
			while (la.kind == 27) {
				Get();
				var parameter:FormalParameter = FormalParameter0();
				parameters.push(parameter); 
			}
		}
		Expect(39);
		return parameters;
	}

	function InterfaceBody():Void {
		Expect(31);
		while (StartOf(19)) {
			InterfaceBodyDeclaration();
		}
		Expect(37);
	}

	function InterfaceBodyDeclaration():Void {
		var m = new EnumSet<Modifier>(); 
		if (la.kind == 41) {
			Get();
		} else if (StartOf(20)) {
			while (StartOf(8)) {
				Modifier0(m);
			}
			InterfaceMemberDecl(m);
		} else SynErr(120);
	}

	function InterfaceMemberDecl(m:EnumSet<Modifier>):Void {
		if (StartOf(16)) {
			InterfaceMethodOrFieldDecl(m);
		} else if (la.kind == 25) {
			checkModifierPermission(m, ModifierSet.interfaces); 
			Get();
			Expect(1);
			VoidInterfaceMethodDeclaratorRest();
		} else if (la.kind == 9) {
			ClassDeclaration(null, m);
		} else if (la.kind == 56) {
			InterfaceDeclaration(null, m);
		} else SynErr(121);
	}

	function InterfaceMethodOrFieldDecl(m:EnumSet<Modifier>):Void {
		var type:DataType = Type();
		Expect(1);
		InterfaceMethodOrFieldRest(m);
	}

	function VoidInterfaceMethodDeclaratorRest():Void {
		var parameters:Array<FormalParameter> = FormalParameters();
		if (la.kind == 55) {
			Get();
			QualidentList();
		}
		Expect(41);
	}

	function InterfaceMethodOrFieldRest(m:EnumSet<Modifier>):Void {
		if (la.kind == 32 || la.kind == 52) {
			checkModifierPermission(m, ModifierSet.constants);  
			ConstantDeclaratorsRest();
			Expect(41);
		} else if (la.kind == 33) {
			checkModifierPermission(m, ModifierSet.interfaces); 
			InterfaceMethodDeclaratorRest();
		} else SynErr(122);
	}

	function ConstantDeclaratorsRest():Void {
		ConstantDeclaratorRest();
		while (la.kind == 27) {
			Get();
			ConstantDeclarator();
		}
	}

	function InterfaceMethodDeclaratorRest():Void {
		var parameters:Array<FormalParameter> = FormalParameters();
		var bCount:Int = BracketsOpt();
		if (la.kind == 55) {
			Get();
			QualidentList();
		}
		Expect(41);
	}

	function ConstantDeclaratorRest():Void {
		var bCount:Int = BracketsOpt();
		Expect(52);
		var expression:Expression = VariableInitializer();
	}

	function ConstantDeclarator():Void {
		Expect(1);
		ConstantDeclaratorRest();
	}

	function Statement0(scope:BlockScope):Statement {
		var statement:Statement = null;
		if (la.kind == 31) {
			var block:Statement = Block(scope);
			statement = block; 
		} else if (la.kind == 57) {
			Get();
			var condition:Expression = ParExpression();
			var thenStatement:Statement = Statement0(scope);
			var elseStatement:Statement = null; 
			if (la.kind == 58) {
				Get();
				var body:Statement = Statement0(scope);
				elseStatement = body; 
			}
			statement = SConditional(condition, thenStatement, elseStatement); 
		} else if (la.kind == 59) {
			Get();
			Expect(33);
			var forScope:BlockScope = new BlockScope(); 
			if (StartOf(21)) {
				ForInit(forScope);
			}
			Expect(41);
			var conditional:Expression = EBooleanLiteral(true); 
			if (StartOf(13)) {
				var expression:Expression = Expression0();
				conditional = expression; 
			}
			Expect(41);
			var body:Array<Statement> = []; 
			if (StartOf(13)) {
				var updates:Array<Statement> = ForUpdate();
				body = updates; 
			}
			Expect(39);
			var arg:Statement = Statement0(scope);
			body = [arg].concat(body);
			forScope.pushStatement(SLoop(conditional, SBlock([], body), false));
			statement = forScope.getStatement(); 
		} else if (la.kind == 60) {
			Get();
			var condition:Expression = ParExpression();
			var body:Statement = Statement0(scope);
			statement = SLoop(condition, body, false); 
		} else if (la.kind == 61) {
			Get();
			var body:Statement = Statement0(scope);
			Expect(60);
			var condition:Expression = ParExpression();
			Expect(41);
			statement = SLoop(condition, body, true); 
		} else if (la.kind == 62) {
			Get();
			var body:Statement = Block(scope);
			var catches:Array<Catch> = [], finallyBody:Statement = null; 
			if (la.kind == 69) {
				var _catches:Array<Catch> = Catches(scope);
				catches = _catches; 
				if (la.kind == 63) {
					Get();
					var block:Statement = Block(scope);
					finallyBody = block; 
				}
			} else if (la.kind == 63) {
				Get();
				var block:Statement = Block(scope);
				finallyBody = block; 
			} else SynErr(123);
			statement = STry(body, catches, finallyBody); 
		} else if (la.kind == 64) {
			Get();
			var expression:Expression = ParExpression();
			Expect(31);
			SwitchBlockStatementGroups();
			Expect(37);
		} else if (la.kind == 49) {
			Get();
			var expression:Expression = ParExpression();
			var block:Statement = Block(null);
		} else if (la.kind == 65) {
			Get();
			var value:Expression = null; 
			if (StartOf(13)) {
				var expression:Expression = Expression0();
				value = expression; 
			}
			Expect(41);
			statement = SReturn(value); 
		} else if (la.kind == 66) {
			Get();
			var expression:Expression = Expression0();
			Expect(41);
			statement = SThrow(expression); 
		} else if (la.kind == 67) {
			Get();
			var label:String = null; 
			if (la.kind == 1) {
				Get();
				label = t.val; 
			}
			Expect(41);
			statement = SBreak(label); 
		} else if (la.kind == 68) {
			Get();
			var label:String = null; 
			if (la.kind == 1) {
				Get();
				label = t.val; 
			}
			Expect(41);
			statement = SContinue(label); 
		} else if (la.kind == 41) {
			Get();
		} else if (isLabel()) {
			Expect(1);
			var label:String = t.val; 
			Expect(26);
			var body:Statement = Statement0(scope);
			statement = SLabel(label, body); 
		} else if (StartOf(13)) {
			var arg:Statement = StatementExpression();
			Expect(41);
			statement = arg; 
		} else SynErr(124);
		return statement;
	}

	function ParExpression():Expression {
		var expression:Expression = null;
		Expect(33);
		var expression:Expression = Expression0();
		Expect(39);
		return expression;
	}

	function ForInit(scope:BlockScope):Void {
		if (isLocalVarDecl(true)) {
			LocalVariableDeclaration(scope);
		} else if (StartOf(13)) {
			var statement:Statement = StatementExpression();
			scope.pushStatement(statement); 
			var statements:Array<Statement> = MoreStatementExpressions();
			for (statement in statements)
			scope.pushStatement(statement);
			
		} else SynErr(125);
	}

	function ForUpdate():Array<Statement> {
		var statements:Array<Statement> = null;
		var statement:Statement = StatementExpression();
		statements = [statement]; 
		var arg:Array<Statement> = MoreStatementExpressions();
		statements = statements.concat(arg); 
		return statements;
	}

	function Catches(scope:BlockScope):Array<Catch> {
		var catches:Array<Catch> = null;
		catches = []; 
		var catchBlock:Catch = CatchClause(scope);
		catches.push(catchBlock); 
		while (la.kind == 69) {
			var catchBlock:Catch = CatchClause(scope);
			catches.push(catchBlock); 
		}
		return catches;
	}

	function SwitchBlockStatementGroups():Void {
		while (la.kind == 70 || la.kind == 71) {
			SwitchBlockStatementGroup();
		}
	}

	function StatementExpression():Statement {
		var statement:Statement = null;
		var expression:Expression = Expression0();
		checkExprStat(expression);
		statement = SExpression(expression); 
		return statement;
	}

	function VariableDeclarators(scope:BlockScope, modifiers:EnumSet<Modifier>, type:DataType):Void {
		VariableDeclarator(scope, modifiers, type);
		while (la.kind == 27) {
			Get();
			VariableDeclarator(scope, modifiers, type);
		}
	}

	function MoreStatementExpressions():Array<Statement> {
		var statements:Array<Statement> = null;
		statements = []; 
		while (la.kind == 27) {
			Get();
			var statement:Statement = StatementExpression();
			statements.push(statement); 
		}
		return statements;
	}

	function CatchClause(scope:BlockScope):Catch {
		var _catch:Catch = null;
		Expect(69);
		Expect(33);
		var parameter:FormalParameter = FormalParameter0();
		Expect(39);
		var block:Statement = Block(scope);
		_catch = {parameter: parameter, body: block}; 
		return _catch;
	}

	function SwitchBlockStatementGroup():Void {
		SwitchLabel();
		while (StartOf(3)) {
			BlockStatement(null);
		}
	}

	function SwitchLabel():Void {
		if (la.kind == 70) {
			Get();
			var expression:Expression = Expression0();
			Expect(26);
		} else if (la.kind == 71) {
			Get();
			Expect(26);
		} else SynErr(126);
	}

	function Expression1():Expression {
		var expression:Expression = null;
		var expression:Expression = Expression2();
		if (la.kind == 72) {
			var rest:Expression = ConditionalExpr(expression);
			expression = rest; 
		}
		return expression;
	}

	function AssignmentOperator():InfixOperator {
		var operator:InfixOperator = null;
		switch (la.kind) {
		case 52: 
			Get();
			operator = null; 
		case 74: 
			Get();
			operator = OpAdd; 
		case 75: 
			Get();
			operator = OpSubtract; 
		case 76: 
			Get();
			operator = OpMultiply; 
		case 77: 
			Get();
			operator = OpDivide; 
		case 78: 
			Get();
			operator = OpBitwiseAnd; 
		case 79: 
			Get();
			operator = OpBitwiseOr; 
		case 80: 
			Get();
			operator = OpBitwiseXor; 
		case 81: 
			Get();
			operator = OpModulus; 
		case 82: 
			Get();
			operator = OpLeftShift; 
		case 83: 
			Get();
			operator = OpRightShift; 
		case 84: 
			Get();
			operator = OpZeroRightShift; 
		default: SynErr(127);
		}
		return operator;
	}

	function Expression2():Expression {
		var expression:Expression = null;
		var expression:Expression = Expression3();
		if (StartOf(22)) {
			var rest:Expression = Expression2Rest(expression);
			expression = rest; 
		}
		return expression;
	}

	function ConditionalExpr(conditional:Expression):Expression {
		var expression:Expression = null;
		Expect(72);
		var thenExpression:Expression = Expression0();
		Expect(26);
		var elseExpression:Expression = Expression1();
		expression = EConditional(conditional, thenExpression, elseExpression); 
		return expression;
	}

	function Expression3():Expression {
		var expression:Expression = null;
		if (StartOf(23)) {
			if (la.kind == 28 || la.kind == 30) {
				var type:IncrementType = Increment();
				var rest:Expression = Expression3();
				expression = EPrefix(type, rest); 
			} else {
				var operator:PrefixOperator = PrefixOp();
				var rest:Expression = Expression3();
				expression = EPrefixOperation(operator, rest); 
			}
		} else if (isTypeCast()) {
			Expect(33);
			var type:DataType = Type();
			Expect(39);
			var rest:Expression = Expression3();
			expression = ECast(type, rest); 
		} else if (StartOf(24)) {
			var rest:Expression = Primary();
			expression = rest; 
			while (la.kind == 29 || la.kind == 32) {
				var rest:Expression = Selector(expression);
				expression = rest; 
			}
			while (la.kind == 28 || la.kind == 30) {
				var type:IncrementType = Increment();
				expression = EPostfix(type, expression); 
			}
		} else SynErr(128);
		return expression;
	}

	function Expression2Rest(operand:Expression):Expression {
		var expression:Expression = null;
		if (StartOf(25)) {
			var builder = new OperationBuilder(); builder.operand(operand); 
			var operator:InfixOperator = Infixop();
			builder.operator(operator); 
			var operand:Expression = Expression3();
			builder.operand(operand); 
			while (StartOf(25)) {
				var operator:InfixOperator = Infixop();
				builder.operator(operator); 
				var operand:Expression = Expression3();
				builder.operand(operand); 
			}
			expression = builder.reduce(); 
		} else if (la.kind == 73) {
			Get();
			var type:DataType = Type();
			expression = EInstanceOf(expression, type); 
		} else SynErr(129);
		return expression;
	}

	function Infixop():InfixOperator {
		var operator:InfixOperator = null;
		switch (la.kind) {
		case 85: 
			Get();
			operator = OpOr; 
		case 86: 
			Get();
			operator = OpAnd; 
		case 87: 
			Get();
			operator = OpBitwiseOr; 
		case 88: 
			Get();
			operator = OpBitwiseXor; 
		case 89: 
			Get();
			operator = OpBitwiseAnd; 
		case 90: 
			Get();
			operator = OpEqual; 
		case 91: 
			Get();
			operator = OpUnequal; 
		case 92: 
			Get();
			operator = OpLessThan; 
		case 93: 
			Get();
			operator = OpGreaterThan; 
		case 94: 
			Get();
			operator = OpLessThanOrEqual; 
		case 95: 
			Get();
			operator = OpGreaterThanOrEqual; 
		case 96: 
			Get();
			operator = OpLeftShift; 
		case 97: 
			Get();
			operator = OpRightShift; 
		case 98: 
			Get();
			operator = OpZeroRightShift; 
		case 36: 
			Get();
			operator = OpAdd; 
		case 34: 
			Get();
			operator = OpSubtract; 
		case 43: 
			Get();
			operator = OpMultiply; 
		case 99: 
			Get();
			operator = OpDivide; 
		case 100: 
			Get();
			operator = OpModulus; 
		default: SynErr(130);
		}
		return operator;
	}

	function Increment():IncrementType {
		var type:IncrementType = null;
		if (la.kind == 30) {
			Get();
			type = IIncrement; 
		} else if (la.kind == 28) {
			Get();
			type = IDecrement; 
		} else SynErr(131);
		return type;
	}

	function PrefixOp():PrefixOperator {
		var operator:PrefixOperator = null;
		if (la.kind == 35) {
			Get();
			operator = OpNot; 
		} else if (la.kind == 40) {
			Get();
			operator = OpBitwiseNot; 
		} else if (la.kind == 36) {
			Get();
			operator = OpUnaryPlus; 
		} else if (la.kind == 34) {
			Get();
			operator = OpUnaryMinus; 
		} else SynErr(132);
		return operator;
	}

	function Primary():Expression {
		var expression:Expression = null;
		switch (la.kind) {
		case 33: 
			Get();
			var arg:Expression = Expression0();
			Expect(39);
			expression = arg; 
		case 23: 
			Get();
			var arg:Expression = ArgumentsOpt(EThisReference);
			expression = arg; 
		case 22: 
			Get();
			var arg:Expression = SuperSuffix();
			expression = arg; 
		case 2, 3, 4, 5, 11, 18, 24: 
			var arg:Expression = Literal();
			expression = arg; 
		case 17: 
			Get();
			var arg:Expression = Creator();
			expression = arg; 
		case 1: 
			Get();
			var identifier:String = t.val, base:Expression = null; 
			while (dotAndIdent()) {
				Expect(29);
				Expect(1);
				base = EReference(identifier, base); identifier = t.val; 
			}
			expression = EReference(identifier, base); 
			if (isIdentSuffix()) {
				var arg:Expression = IdentifierSuffix(identifier, base);
				expression = arg; 
			}
		case 6, 7, 8, 10, 13, 15, 16, 20: 
			var type:PrimitiveType = BasicType();
			var bCount:Int = BracketsOpt();
			Expect(29);
			Expect(9);
		case 25: 
			Get();
			Expect(29);
			Expect(9);
		default: SynErr(133);
		}
		return expression;
	}

	function Selector(base:Expression):Expression {
		var expression:Expression = null;
		if (la.kind == 29) {
			Get();
			if (la.kind == 1) {
				Get();
				var identifier:String = t.val; 
				var arg:Expression = ArgumentsMethodOpt(identifier, base);
				expression = arg; 
			} else if (la.kind == 22) {
				Get();
				var arguments:Array<Expression> = Arguments();
				
			} else if (la.kind == 17) {
				Get();
				InnerCreator();
			} else SynErr(134);
		} else if (la.kind == 32) {
			Get();
			var index:Expression = Expression0();
			Expect(38);
			expression = EArrayAccess(index, base); 
		} else SynErr(135);
		return expression;
	}

	function ArgumentsOpt(method:Expression):Expression {
		var expression:Expression = null;
		expression = method; 
		if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = ECall(method, arguments); 
		}
		return expression;
	}

	function SuperSuffix():Expression {
		var expression:Expression = null;
		if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = ECall(ESuperReference, arguments); 
		} else if (la.kind == 29) {
			Get();
			Expect(1);
			var identifier:String = t.val; 
			var arg:Expression = ArgumentsMethodOpt(identifier, ESuperReference);
			expression = arg; 
		} else SynErr(136);
		return expression;
	}

	function Literal():Expression {
		var expression:Expression = null;
		switch (la.kind) {
		case 2: 
			Get();
			expression = EIntegerLiteral(Std.parseInt(t.val)); 
		case 3: 
			Get();
			expression = EFloatLiteral(Std.parseFloat(t.val)); 
		case 4: 
			Get();
			expression = ECharLiteral(t.val.charCodeAt(0)); 
		case 5: 
			Get();
			expression = EStringLiteral(t.val); 
		case 24: 
			Get();
			expression = EBooleanLiteral(true); 
		case 11: 
			Get();
			expression = EBooleanLiteral(false); 
		case 18: 
			Get();
			expression = ENull; 
		default: SynErr(137);
		}
		return expression;
	}

	function Creator():Expression {
		var expression:Expression = null;
		if (StartOf(12)) {
			var type:PrimitiveType = BasicType();
			var arg:Expression = ArrayCreatorRest(DTPrimitive(type));
			expression = arg; 
		} else if (la.kind == 1) {
			var qualifier:Array<String> = Qualident();
			if (la.kind == 32) {
				var arg:Expression = ArrayCreatorRest(DTReference(qualifier));
				expression = arg; 
			} else if (la.kind == 33) {
				var arg:Expression = ClassCreatorRest(qualifier);
				expression = arg; 
			} else SynErr(138);
		} else SynErr(139);
		return expression;
	}

	function IdentifierSuffix(identifier:String, base:Expression):Expression {
		var expression:Expression = null;
		if (la.kind == 32) {
			Get();
			Expect(38);
			var bCount:Int = BracketsOpt();
			Expect(29);
			Expect(9);
			
		} else if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = base == null ? ECall(EReference(identifier), arguments) : ECallMethod(identifier, base, arguments); 
		} else if (la.kind == 29) {
			Get();
			if (la.kind == 9) {
				Get();
			} else if (la.kind == 23) {
				Get();
			} else if (la.kind == 22) {
				Get();
				Expect(29);
				Expect(1);
				var dummy:Expression = ArgumentsMethodOpt(null, null);
			} else SynErr(140);
			
		} else SynErr(141);
		return expression;
	}

	function Arguments():Array<Expression> {
		var arguments:Array<Expression> = null;
		arguments = []; 
		Expect(33);
		if (StartOf(13)) {
			var expression:Expression = Expression0();
			arguments.push(expression); 
			while (la.kind == 27) {
				Get();
				var expression:Expression = Expression0();
				arguments.push(expression); 
			}
		}
		Expect(39);
		return arguments;
	}

	function ArgumentsMethodOpt(identifier:String, base:Expression):Expression {
		var expression:Expression = null;
		expression = EReference(identifier, base); 
		if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = ECallMethod(identifier, base, arguments); 
		}
		return expression;
	}

	function ArrayCreatorRest(type:DataType):Expression {
		var expression:Expression = null;
		Expect(32);
		if (la.kind == 38) {
			Get();
			var bCount:Int = BracketsOpt();
			var expression:Expression = ArrayInitializer();
		} else if (StartOf(13)) {
			var dummy:Expression = Expression0();
			Expect(38);
			while (nonEmptyBracket()) {
				Expect(32);
				var dummy:Expression = Expression0();
				Expect(38);
			}
			while (emptyBracket()) {
				Expect(32);
				Expect(38);
			}
		} else SynErr(142);
		return expression;
	}

	function ClassCreatorRest(qualifier:Array<String>):Expression {
		var expression:Expression = null;
		var arguments:Array<Expression> = Arguments();
		expression = EObjectInstantiation(qualifier, arguments); 
		if (la.kind == 31) {
			var classScope:ClassScope = ClassBody();
		}
		
		return expression;
	}

	function InnerCreator():Void {
		var qualifier:Array<String> = []; 
		Expect(1);
		var expression:Expression = ClassCreatorRest(qualifier);
	}



	public function Parse():PdeProgram {
		la = new Token();
		la.val = "";		
		Get();
		
		var ret:PdeProgram = 		PdeProgram();

		Expect(0);
		return ret;
	}

	private static var set:Array<Array<Bool>> = [
		[T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,T,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,T,x,T, T,T,T,x, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,T,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,T,x,x, T,T,T,T, x,T,x,x, x,x,x,x, T,T,x,T, T,T,T,x, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,T,x,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,x,T,T, x,T,x,T, T,T,T,x, T,x,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,T,x,x, x,x,x,x, x,T,x,x, x,x,x,x, x,T,x,T, T,T,T,x, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,T,T, T,x,T,x, x,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,x,T,T, x,T,x,T, T,T,T,x, T,x,T,T, T,T,x,x, T,x,T,x, x,T,T,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,x,T,T, x,T,x,T, T,T,T,x, T,x,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,T,T, T,T,T,T, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,x,T,x, x,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,T, x,x,x,x, T,x,x,x, x,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,x,T,x, T,T,x,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,T,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,x,T,T, T,T,x,T, T,T,T,x, T,x,T,T, T,T,x,x, T,x,T,x, x,T,T,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,T,x, T,x,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,x,T,x, x,x,T,T, T,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,x,T,T, x,T,x,T, T,T,T,x, T,x,T,T, T,T,x,x, x,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,T,x, T,x,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,T,T,T, T,T,T,T, T,T,T,T, T,T,T,T, T,x,x]

	];
} // end Parser


class Errors {
	public var count:Int;                                    // number of errors detected
//	public java.io.PrintStream errorStream = System.out;     // error messages go to this stream
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
			case 41: s = "\";\" expected";
			case 42: s = "\"package\" expected";
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
			case 57: s = "\"if\" expected";
			case 58: s = "\"else\" expected";
			case 59: s = "\"for\" expected";
			case 60: s = "\"while\" expected";
			case 61: s = "\"do\" expected";
			case 62: s = "\"try\" expected";
			case 63: s = "\"finally\" expected";
			case 64: s = "\"switch\" expected";
			case 65: s = "\"return\" expected";
			case 66: s = "\"throw\" expected";
			case 67: s = "\"break\" expected";
			case 68: s = "\"continue\" expected";
			case 69: s = "\"catch\" expected";
			case 70: s = "\"case\" expected";
			case 71: s = "\"default\" expected";
			case 72: s = "\"?\" expected";
			case 73: s = "\"instanceof\" expected";
			case 74: s = "\"+=\" expected";
			case 75: s = "\"-=\" expected";
			case 76: s = "\"*=\" expected";
			case 77: s = "\"/=\" expected";
			case 78: s = "\"&=\" expected";
			case 79: s = "\"|=\" expected";
			case 80: s = "\"^=\" expected";
			case 81: s = "\"%=\" expected";
			case 82: s = "\"<<=\" expected";
			case 83: s = "\">>=\" expected";
			case 84: s = "\">>>=\" expected";
			case 85: s = "\"||\" expected";
			case 86: s = "\"&&\" expected";
			case 87: s = "\"|\" expected";
			case 88: s = "\"^\" expected";
			case 89: s = "\"&\" expected";
			case 90: s = "\"==\" expected";
			case 91: s = "\"!=\" expected";
			case 92: s = "\"<\" expected";
			case 93: s = "\">\" expected";
			case 94: s = "\"<=\" expected";
			case 95: s = "\">=\" expected";
			case 96: s = "\"<<\" expected";
			case 97: s = "\">>\" expected";
			case 98: s = "\">>>\" expected";
			case 99: s = "\"/\" expected";
			case 100: s = "\"%\" expected";
			case 101: s = "??? expected";
			case 102: s = "invalid PdeProgram";
			case 103: s = "invalid PdeProgram";
			case 104: s = "invalid ClassBodyDeclaration";
			case 105: s = "invalid ClassBodyDeclaration";
			case 106: s = "invalid BlockStatement";
			case 107: s = "invalid TypeDeclaration";
			case 108: s = "invalid QualifiedImport";
			case 109: s = "invalid ClassOrInterfaceDeclaration";
			case 110: s = "invalid ClassModifier";
			case 111: s = "invalid Modifier0";
			case 112: s = "invalid Modifier1";
			case 113: s = "invalid Type";
			case 114: s = "invalid BasicType";
			case 115: s = "invalid VariableInitializer";
			case 116: s = "invalid MemberDecl";
			case 117: s = "invalid VoidMethodDeclaratorRest";
			case 118: s = "invalid MethodOrFieldRest";
			case 119: s = "invalid MethodDeclaratorRest";
			case 120: s = "invalid InterfaceBodyDeclaration";
			case 121: s = "invalid InterfaceMemberDecl";
			case 122: s = "invalid InterfaceMethodOrFieldRest";
			case 123: s = "invalid Statement0";
			case 124: s = "invalid Statement0";
			case 125: s = "invalid ForInit";
			case 126: s = "invalid SwitchLabel";
			case 127: s = "invalid AssignmentOperator";
			case 128: s = "invalid Expression3";
			case 129: s = "invalid Expression2Rest";
			case 130: s = "invalid Infixop";
			case 131: s = "invalid Increment";
			case 132: s = "invalid PrefixOp";
			case 133: s = "invalid Primary";
			case 134: s = "invalid Selector";
			case 135: s = "invalid Selector";
			case 136: s = "invalid SuperSuffix";
			case 137: s = "invalid Literal";
			case 138: s = "invalid Creator";
			case 139: s = "invalid Creator";
			case 140: s = "invalid IdentifierSuffix";
			case 141: s = "invalid IdentifierSuffix";
			case 142: s = "invalid ArrayCreatorRest";
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
} // Errors

class FatalError {
	public var message:String;
	public static var serialVersionUID:Float = 1.0;
	public function new(s:String) { this.message = s; }
}

/*------------------------- modifier handling -----------------------------*/

class ModifierSet
{
	static public var none		= new EnumSet<Modifier>([]);
	static public var access	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate]);
	static public var classes	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MStatic, MFinal, MStrictfp]);
	static public var fields	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MStatic, MFinal, MTransient, MVolatile]);
	static public var methods	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MSynchronized, MNative, MStatic, MFinal, MStrictfp]);
	static public var constructors	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate]);
	static public var interfaces	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MStatic, MStrictfp]);
	static public var constants	= new EnumSet<Modifier>([MPublic, MStatic, MFinal]);
	static public var all		= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MVolatile, MTransient, MSynchronized, MNative, MStatic, MFinal, MStrictfp]);
}

/*-------------------- expression building ----------------------------------*/

class OperationBuilder
{
	private var operators:Array<InfixOperator>;
	private var operands:Array<Expression>;
	
	public function new() {
		operators = [];
		operands = [];
	}
	
	public function operator(operator:InfixOperator)
	{
		reduce(lookupOperatorPrecedence(operator));
		operators.push(operator);
	}
	
	public function operand(operand:Expression)
	{
		operands.push(operand);
	}
	
	public function reduce(?precedence:Int = 0):Expression
	{
		while (operators.length > 0 && lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence)
			reduceOperator(operators.pop());
		return operands[0];
	}

	private function reduceOperator(operator:InfixOperator):Void
	{
		var b:Expression = operands.pop(), a:Expression = operands.pop();
		operands.push(EInfixOperation(operator, a, b));
	}
	
// http://www.particle.kth.se/~lindsey/JavaCourse/Book/Part1/Java/Chapter02/operators.html

	private function lookupOperatorPrecedence(operator:InfixOperator):Int
	{
		return switch (operator)
		{
		    case OpOr: 3;
		    case OpAnd: 4;
		    case OpBitwiseOr: 5;
		    case OpBitwiseXor: 6;
		    case OpBitwiseAnd: 7;
		    case OpEqual, OpUnequal: 8;
		    case OpLessThan, OpLessThanOrEqual, OpGreaterThan, OpGreaterThanOrEqual: 9;
		    case OpLeftShift, OpRightShift, OpZeroRightShift: 10;
		    case OpAdd, OpSubtract: 11;
		    case OpMultiply, OpDivide, OpModulus: 12;
//		    case OpNot, OpBitwiseNot, OpUnaryPlus, OpUnaryMinus: 14;
		}
	}
}

/*-------------------- block scope ----------------------------------*/

class Scope
{
	var parent:Scope;
	var definitions:Array<Definition>;
	
	public function new() {
		definitions = [];
	}
	
	public function pushDefinition(definition:Definition) {
		definitions.push(definition);
	}
	
	public function getDefinitions():Array<Definition> {
		return definitions;
	}
	
	public function concat(block:Scope) {
		for (definition in block.definitions)
			pushDefinition(definition);
	}
}

class CompilationUnitScope extends Scope
{
	public var _package:Array<String>;
	public var _imports:Array<Array<String>>;
	
	public function new() {
		super();
		_package = [];
		_imports = [];
	}
	
	public function setPackage(ident:Array<String>) { _package = ident; }	
	public function getPackage():Array<String> { return _package; }
	
	public function pushImport(ident:Array<String>) { _imports.push(ident); }
	public function getImports():Array<Array<String>> { return _imports; }
}

class BlockScope extends Scope
{
	var statements:Array<Statement>;
	
	public function new() {
		super();
		statements = [];
	}
		
	public function pushStatement(statement:Statement) {
		statements.push(statement);
	}
	
	override public function concat(block:Scope) {
		super.concat(block);
		var block:BlockScope = cast(block, BlockScope);
		for (statement in block.statements)
			pushStatement(statement);
	}
	
	public function getStatement():Statement {
		return SBlock(definitions, statements);
	}
}

class ClassScope extends BlockScope
{
	override public function getStatement():Statement {
		return SBlock([], statements);
	}
}

/*-------------------- PdeProgram ----------------------------------*/

interface PdeProgram
{
	public function getCompilationUnit(identifier:String):CompilationUnit;
}

//[TODO] writeImports: http://dev.processing.org/source/index.cgi/trunk/processing/app/src/processing/app/preproc/PdePreprocessor.java?view=markup

class JavaProgram extends CompilationUnitScope, implements PdeProgram
{
	public function getCompilationUnit(identifier:String):CompilationUnit
	{
		// create straight compilation unit
		return {
		    packageIdent: _package,
		    importIdents: _imports,
		    definitions: definitions
		};
	}
}

class ActiveProgram extends ClassScope, implements PdeProgram
{
	public function getCompilationUnit(identifier:String):CompilationUnit
	{
		// create class extension
		var classDefinition = DClass(identifier, new EnumSet<Modifier>([MPublic]), definitions, DTReference(['PApplet']));

		// create compilation unit
		return {
		    packageIdent: [],
		    importIdents: [['xpde', 'core', '*'], ['xpde', 'xml', '*']],
		    definitions: [classDefinition]
		};
	}
}

class StaticProgram extends BlockScope, implements PdeProgram
{
	public function getCompilationUnit(identifier:String):CompilationUnit
	{
		// create setup function
		var setupDefinition = DMethod('setup', null, new EnumSet<Modifier>(), [], getStatement());
	
		// create class extension
		var classDefinition = DClass(identifier, new EnumSet<Modifier>([MPublic]), [setupDefinition], DTReference(['PApplet']));

		// create compilation unit
		return {
		    packageIdent: [],
		    importIdents: [],
		    definitions: [classDefinition]
		};
	}
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

