package xpde.parser;

import xpde.Rtti;
import xpde.JavaPackage;
import xpde.parser.Scanner;
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
	public static var maxT:Int = 101;

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

function compoundBrackets(type:DataType, bCount:Int):DataType {
	if (bCount == 0)
		return type;
	switch (type) {
	    case DTPrimitive(type): return DTPrimitiveArray(type, bCount);
	    case DTPrimitiveArray(type, dimensions): return DTPrimitiveArray(type, dimensions + bCount);
	    case DTReference(qualident): return DTReferenceArray(qualident, bCount);
	    case DTReferenceArray(qualident, dimensions): return DTReferenceArray(qualident, dimensions + bCount);
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

/*---------------------------- contexts ----------------------------*/

var classContexts:Array<ClassContext>;
var blockContexts:Array<BlockContext>;

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
		blockContexts = [];
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
			classContexts.unshift(new ClassContext(new EnumSet<Modifier>([MPublic]), context.packageDeclaration.slice( -1)[0]));
			classContexts[0].extend = ['xpde', 'core', 'PApplet'];
			
			while (isLocalVarDecl(false)) {
				LocalVariableDeclaration();
				Expect(41);
			}
			if (isActiveProgram()) {
				ClassBodyDeclaration();
				while (StartOf(3)) {
					ClassBodyDeclaration();
				}
			} else if (StartOf(4)) {
				blockContexts.unshift(new BlockContext());
				
				BlockStatement();
				while (StartOf(4)) {
					BlockStatement();
				}
				var methodContext = new MethodContext(new EnumSet<Modifier>(), null, 'setup');
				methodContext.body = blockContexts.shift().getBlockStatement();
				classContexts[0].methods.push(methodContext);
				
			} else SynErr(102);
			context.types.push(classContexts.shift());
				// validate script
			if (la.kind != _EOF)
				error("unexpected script termination");
			
		} else SynErr(103);
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

	function TypeDeclaration():Void {
		if (StartOf(5)) {
			var typeContext:TypeContext = ClassOrInterfaceDeclaration();
			context.types.push(typeContext); 
		} else if (la.kind == 41) {
			Get();
		} else SynErr(104);
	}

	function LocalVariableDeclaration():Void {
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 12) {
			Get();
			modifiers.add(MFinal); 
		}
		var type:DataType = Type();
		var fields:Array<FieldContext> = VariableDeclarators(modifiers, type);
		for (field in fields)
		blockContexts[0].defineVariable(field);
		
	}

	function ClassBodyDeclaration():Void {
		if (la.kind == 41) {
			Get();
		} else if (StartOf(6)) {
			var modifiers = new EnumSet<Modifier>(); 
			if (la.kind == 21) {
				Get();
				addModifier(modifiers, MStatic); 
			}
			if (la.kind == 31) {
				var block:Statement = Block(null);
				classContexts[0].staticConstructor.pushStatement(block); 
			} else if (StartOf(7)) {
				if (StartOf(8)) {
					Modifier1(modifiers);
					while (StartOf(9)) {
						Modifier0(modifiers);
					}
				}
				MemberDecl(modifiers);
			} else SynErr(105);
		} else SynErr(106);
	}

	function BlockStatement():Void {
		if (isLocalVarDecl(false)) {
			LocalVariableDeclaration();
			Expect(41);
		} else if (StartOf(5)) {
			var typeContext:TypeContext = ClassOrInterfaceDeclaration();
		} else if (StartOf(10)) {
			var statement:Statement = Statement0();
			blockContexts[0].pushStatement(statement); 
		} else SynErr(107);
	}

	function CompilationUnit():Void {
		if (la.kind == 42) {
			Get();
			var qualident:Array<String> = Qualident();
			context.packageDeclaration = qualident; 
			Expect(41);
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

	function ClassOrInterfaceDeclaration():TypeContext {
		var typeContext:TypeContext = null;
		var modifiers = new EnumSet<Modifier>(); 
		while (StartOf(11)) {
			ClassModifier(modifiers);
		}
		if (la.kind == 9) {
			var arg:TypeContext = ClassDeclaration(modifiers);
			typeContext = arg; 
		} else if (la.kind == 56) {
			var arg:TypeContext = InterfaceDeclaration(modifiers);
			typeContext = arg; 
		} else SynErr(109);
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
		default: SynErr(110);
		}
	}

	function ClassDeclaration(modifiers:EnumSet<Modifier>):TypeContext {
		var typeContext:TypeContext = null;
		checkModifierPermission(modifiers, ModifierSet.classes); 
		Expect(9);
		Expect(1);
		classContexts.unshift(new ClassContext(modifiers, t.val)); 
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
		} else if (StartOf(8)) {
			Modifier1(modifiers);
		} else SynErr(111);
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

	function VariableDeclarator(modifiers:EnumSet<Modifier>, type:DataType):FieldContext {
		var context:FieldContext = null;
		Expect(1);
		context = new FieldContext(modifiers, type, t.val); 
		VariableDeclaratorRest(context);
		return context;
	}

	function VariableDeclaratorRest(context:FieldContext):Void {
		var bCount:Int = BracketsOpt();
		context.type = compoundBrackets(context.type, bCount); 
		if (la.kind == 52) {
			Get();
			var expression:Expression = VariableInitializer();
			context.initialization = expression; 
		}
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
			    case ELocalReference(identifier): expression = ELocalAssignment(identifier, value);
			    case EReference(identifier, base): expression = EAssignment(identifier, base, value);
			    case EArrayAccess(index, base): expression = EArrayAssignment(index, base, value);
			    case ELexExpression(lexpression):
				switch (lexpression) {
				    case LReference(identifier): expression = ELexExpression(LAssignment(identifier, value));
				    default: error('invalid assignment left-hand side');
				}
			    default: error('invalid assignment left-hand side');
			}
			
		}
		return expression;
	}

	function ClassBody():Void {
		Expect(31);
		while (StartOf(3)) {
			ClassBodyDeclaration();
		}
		Expect(37);
	}

	function Block(parent:DefinesLocalVariables):Statement {
		var statement:Statement = null;
		blockContexts.unshift(new BlockContext(parent)); 
		Expect(31);
		while (StartOf(4)) {
			BlockStatement();
		}
		Expect(37);
		statement = blockContexts.shift().getBlockStatement(); 
		return statement;
	}

	function MemberDecl(modifiers:EnumSet<Modifier>):Void {
		if (identAndLPar()) {
			Expect(1);
			var identifier:String = t.val;
			// validate constructor name
			if (identifier != classContexts[0].identifier) error('invalid function declaration'); 
			ConstructorDeclaratorRest(new MethodContext(modifiers, null, identifier));
		} else if (StartOf(16)) {
			MethodOrFieldDecl(modifiers);
		} else if (la.kind == 25) {
			checkModifierPermission(modifiers, ModifierSet.methods); 
			Get();
			Expect(1);
			var identifier:String = t.val; 
			VoidMethodDeclaratorRest(new MethodContext(modifiers, null, identifier));
		} else if (la.kind == 9) {
			var typeContext:TypeContext = ClassDeclaration(modifiers);
		} else if (la.kind == 56) {
			var typeContext:TypeContext = InterfaceDeclaration(modifiers);
		} else SynErr(116);
	}

	function ConstructorDeclaratorRest(methodContext:MethodContext):Void {
		checkModifierPermission(methodContext.modifiers, ModifierSet.constructors); 
		var arg:Array<FormalParameter> = FormalParameters();
		methodContext.parameters = arg; 
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		var body:Statement = Block(methodContext);
		classContexts[0].defineMethod(methodContext); 
	}

	function MethodOrFieldDecl(modifiers:EnumSet<Modifier>):Void {
		var type:DataType = Type();
		Expect(1);
		var identifier:String = t.val; 
		MethodOrFieldRest(modifiers, identifier, type);
	}

	function VoidMethodDeclaratorRest(methodContext:MethodContext):Void {
		var arg:Array<FormalParameter> = FormalParameters();
		methodContext.parameters = arg; 
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		if (la.kind == 31) {
			var block:Statement = Block(methodContext);
			methodContext.body = block; 
		} else if (la.kind == 41) {
			Get();
		} else SynErr(117);
		classContexts[0].defineMethod(methodContext); 
	}

	function MethodOrFieldRest(modifiers:EnumSet<Modifier>, identifier:String, type:DataType):Void {
		if (StartOf(17)) {
			checkModifierPermission(modifiers, ModifierSet.fields);  
			VariableDeclaratorsRest(modifiers, type, identifier);
			Expect(41);
		} else if (la.kind == 33) {
			checkModifierPermission(modifiers, ModifierSet.methods); 
			MethodDeclaratorRest(new MethodContext(modifiers, type, identifier));
		} else SynErr(118);
	}

	function VariableDeclaratorsRest(modifiers:EnumSet<Modifier>, type:DataType, identifier:String):Void {
		var context = new FieldContext(modifiers, type, identifier); 
		VariableDeclaratorRest(context);
		classContexts[0].defineField(context); 
		while (la.kind == 27) {
			Get();
			var context:FieldContext = VariableDeclarator(modifiers, type);
			classContexts[0].defineField(context); 
		}
	}

	function MethodDeclaratorRest(methodContext:MethodContext):Void {
		var arg:Array<FormalParameter> = FormalParameters();
		methodContext.parameters = arg; 
		var bCount:Int = BracketsOpt();
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
			methodContext.throwsList = arg; 
		}
		if (la.kind == 31) {
			var block:Statement = Block(methodContext);
			methodContext.body = block; 
		} else if (la.kind == 41) {
			Get();
		} else SynErr(119);
		classContexts[0].defineMethod(methodContext); 
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
		var modifiers = new EnumSet<Modifier>(); 
		if (la.kind == 41) {
			Get();
		} else if (StartOf(20)) {
			while (StartOf(9)) {
				Modifier0(modifiers);
			}
			InterfaceMemberDecl(modifiers);
		} else SynErr(120);
	}

	function InterfaceMemberDecl(modifiers:EnumSet<Modifier>):Void {
		if (StartOf(16)) {
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
		} else SynErr(121);
	}

	function InterfaceMethodOrFieldDecl(modifiers:EnumSet<Modifier>):Void {
		var type:DataType = Type();
		Expect(1);
		InterfaceMethodOrFieldRest(modifiers);
	}

	function VoidInterfaceMethodDeclaratorRest():Void {
		var parameters:Array<FormalParameter> = FormalParameters();
		if (la.kind == 55) {
			Get();
			var arg:Array<Array<String>> = QualidentList();
		}
		Expect(41);
	}

	function InterfaceMethodOrFieldRest(modifiers:EnumSet<Modifier>):Void {
		if (la.kind == 32 || la.kind == 52) {
			checkModifierPermission(modifiers, ModifierSet.constants);  
			ConstantDeclaratorsRest();
			Expect(41);
		} else if (la.kind == 33) {
			checkModifierPermission(modifiers, ModifierSet.interfaces); 
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
			var arg:Array<Array<String>> = QualidentList();
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

	function Statement0():Statement {
		var statement:Statement = null;
		if (la.kind == 31) {
			var block:Statement = Block(blockContexts[0]);
			statement = block; 
		} else if (la.kind == 57) {
			Get();
			var condition:Expression = ParExpression();
			var thenStatement:Statement = Statement0();
			var elseStatement:Statement = null; 
			if (la.kind == 58) {
				Get();
				var body:Statement = Statement0();
				elseStatement = body; 
			}
			statement = SConditional(condition, thenStatement, elseStatement); 
		} else if (la.kind == 59) {
			Get();
			Expect(33);
			blockContexts.unshift(new BlockContext(blockContexts[0])); 
			if (StartOf(21)) {
				ForInit();
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
			var arg:Statement = Statement0();
			body = [arg].concat(body);
			blockContexts[0].pushStatement(SLoop(conditional, SBlock(body), false));
			statement = blockContexts.shift().getBlockStatement(); 
		} else if (la.kind == 60) {
			Get();
			var condition:Expression = ParExpression();
			var body:Statement = Statement0();
			statement = SLoop(condition, body, false); 
		} else if (la.kind == 61) {
			Get();
			var body:Statement = Statement0();
			Expect(60);
			var condition:Expression = ParExpression();
			Expect(41);
			statement = SLoop(condition, body, true); 
		} else if (la.kind == 62) {
			Get();
			var body:Statement = Block(blockContexts[0]);
			var catches:Array<Catch> = [], finallyBody:Statement = null; 
			if (la.kind == 69) {
				var _catches:Array<Catch> = Catches();
				catches = _catches; 
				if (la.kind == 63) {
					Get();
					var block:Statement = Block(blockContexts[0]);
					finallyBody = block; 
				}
			} else if (la.kind == 63) {
				Get();
				var block:Statement = Block(blockContexts[0]);
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
			var block:Statement = Block(blockContexts[0]);
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
			var body:Statement = Statement0();
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

	function ForInit():Void {
		if (isLocalVarDecl(true)) {
			LocalVariableDeclaration();
		} else if (StartOf(13)) {
			var statement:Statement = StatementExpression();
			blockContexts[0].pushStatement(statement); 
			var statements:Array<Statement> = MoreStatementExpressions();
			for (statement in statements)
			blockContexts[0].pushStatement(statement);
			
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

	function Catches():Array<Catch> {
		var catches:Array<Catch> = null;
		catches = []; 
		var catchBlock:Catch = CatchClause();
		catches.push(catchBlock); 
		while (la.kind == 69) {
			var catchBlock:Catch = CatchClause();
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

	function VariableDeclarators(modifiers:EnumSet<Modifier>, type:DataType):Array<FieldContext> {
		var fields:Array<FieldContext> = null;
		var field:FieldContext = VariableDeclarator(modifiers, type);
		fields = [field]; 
		while (la.kind == 27) {
			Get();
			var field:FieldContext = VariableDeclarator(modifiers, type);
			fields.push(field); 
		}
		return fields;
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

	function CatchClause():Catch {
		var _catch:Catch = null;
		Expect(69);
		Expect(33);
		var parameter:FormalParameter = FormalParameter0();
		Expect(39);
		var block:Statement = Block(blockContexts[0]);
		_catch = {parameter: parameter, body: block}; 
		return _catch;
	}

	function SwitchBlockStatementGroup():Void {
		SwitchLabel();
		while (StartOf(4)) {
			BlockStatement();
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
			expression = EThisReference; 
			if (la.kind == 33) {
				var arguments:Array<Expression> = Arguments();
				expression = EThisCall(arguments); 
			}
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
				base = base != null ? EReference(identifier, base) :
				blockContexts[0].isVariableDefined(identifier) ? ELocalReference(identifier) : ELexExpression(LReference(identifier));
				  identifier = t.val; 
			}
			expression = base != null ? EReference(identifier, base) :
			blockContexts[0].isVariableDefined(identifier) ? ELocalReference(identifier) : ELexExpression(LReference(identifier)); 
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
				var arg:Expression = ArgumentsOpt(identifier, base);
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

	function SuperSuffix():Expression {
		var expression:Expression = null;
		if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = ESuperCall(arguments); 
		} else if (la.kind == 29) {
			Get();
			Expect(1);
			var identifier:String = t.val; 
			var arg:Expression = ArgumentsOpt(identifier, ESuperReference);
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
			expression = base == null ? ELexExpression(LCall(identifier, arguments)) : ECall(identifier, base, arguments); 
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
				var dummy:Expression = ArgumentsOpt(null, null);
			} else SynErr(140);
			
		} else SynErr(141);
		return expression;
	}

	function ArgumentsOpt(identifier:String, base:Expression):Expression {
		var expression:Expression = null;
		expression = EReference(identifier, base); 
		if (la.kind == 33) {
			var arguments:Array<Expression> = Arguments();
			expression = ECall(identifier, base, arguments); 
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
			ClassBody();
		}
		
		return expression;
	}

	function InnerCreator():Void {
		var qualifier:Array<String> = []; 
		Expect(1);
		var expression:Expression = ClassCreatorRest(qualifier);
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
		[T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,T,x,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,T,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,T,x,T, T,T,T,x, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,T,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,T,T, T,T,T,T, T,T,T,T, T,T,x,T, T,T,T,T, T,T,T,T, T,T,x,x, T,x,T,T, x,T,T,T, T,x,x,x, T,T,x,x, T,T,T,T, x,T,x,x, x,x,x,x, T,T,x,T, T,T,T,x, T,T,T,T, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,T,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,T,x,x, x,T,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,T,x,x, x,x,T,T, T,T,T,x, T,T,x,T, T,x,x,T, T,x,x,x, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, T,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
		[x,x,x,x, x,x,x,x, x,x,x,x, T,x,x,x, x,x,x,T, x,T,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, T,T,T,T, T,T,T,T, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x,x, x,x,x],
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
			case 104: s = "invalid TypeDeclaration";
			case 105: s = "invalid ClassBodyDeclaration";
			case 106: s = "invalid ClassBodyDeclaration";
			case 107: s = "invalid BlockStatement";
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
}

class FatalError
{
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
		}
	}
}

/*-------------------- compilation unit parsing -----------------------------------*/

class ParsedCompilationUnit implements CompilationUnit
{	
	public var packageDeclaration(default, null):Qualident;
	public var dependencies(default, null):Array<Qualident>;
	public var types(default, null):Hash<TypeDefinition>;
	
	private var source:Input;
	
	public function new(packageDeclaration:Qualident, source:Input)
	{
		// public
		this.packageDeclaration = packageDeclaration;
		dependencies = [];
		types = new Hash<TypeDefinition>();
		
		// private
		this.source = source;
		initialized = false;
	}
	
	private var initialized:Bool;
	public var ast:Hash<Statement>;
	
	public function initialize(rootPackage:JavaPackage)
	{
		// initialize once
		if (initialized) return;
		initialized = true;
		
		// create parsing context
		var context = new CompilationUnitContext(packageDeclaration);
		// scan and compile
		var scanner:Scanner = new Scanner(source);
		var parser:Parser = new Parser(scanner, context);
		parser.Parse();
		
		// validate package declaration
		if (packageDeclaration.join('.') != context.packageDeclaration.join('.'))
			throw "incompatible package declaration " + context.packageDeclaration.join('.');
		
		// parser second pass
		var resolver = new LexicalResolver(this);
		resolver.resolve(context, rootPackage);
		
		// save passed AST
		ast = context.ast;
	}
}

/*-------------------- parsing contexts ----------------------------------*/

class CompilationUnitContext
{
	public var packageDeclaration:Array<String>;
	public var imports:Array<Array<String>>;
	public var types:Array<TypeContext>;
	public var ast:Hash<Statement>;
	
	public function new(packageDeclaration:Array<String>)
	{
		this.packageDeclaration = packageDeclaration;
		imports = [];
		types = [];
		ast = new Hash<Statement>();
	}
}

interface TypeContext {
	public var identifier:String;
	public var extend:Qualident;
	public var implement:Array<Qualident>;
}

class ClassContext implements TypeContext
{
	// reference
	public var definition:ClassDefinition;

	// public
	public var identifier:String;
	public var modifiers:EnumSet<Modifier>;
	public var extend:Qualident;
	public var implement:Array<Qualident>;
	public var memberTypes:Hash<Qualident>;
	public var fields:Hash<FieldContext>;
	public var methods:Array<MethodContext>; // array, because we can't resolve similar types until second pass
//[TODO] can we resolve similar types before second pass!?	

	// constructors
	public var staticConstructor:BlockContext;
	public var objectConstructor:BlockContext;
	
	// anonymous class uniqid
	public var anonClassID:Int;

	public function new(modifiers:EnumSet<Modifier>, identifier:String)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.identifier = identifier;	
		implement = [];
		fields = new Hash<FieldContext>();
		memberTypes = new Hash<Qualident>();
		methods = [];
		
		// constructors
		staticConstructor = new BlockContext();
		objectConstructor = new BlockContext();
		
		// anonymous class ID
		anonClassID = 0;
	}
	
	public function defineField(field:FieldContext)
	{
		// prevent redefinition
		if (fields.exists(field.identifier))
			throw "redeclaration of field " + field.identifier + " in class " + this.identifier;
		
		// add definition
		fields.set(field.identifier, field);
		if (field.initialization != null)
			field.modifiers.contains(MStatic) ?
			    staticConstructor.pushStatement(SExpression(EAssignment(field.identifier, ELexExpression(LReference(identifier)), field.initialization))) :
			    objectConstructor.pushStatement(SExpression(EAssignment(field.identifier, EThisReference, field.initialization)));
	}
	
	public function defineMethod(method:MethodContext)
	{
		// push definition
		//[NOTE] check for colliding definitions on second pass
		methods.push(method);
	}
	
	public function defineMemberType(identifier:String, qualident:Qualident)
	{
		// prevent redefinition
		if (memberTypes.exists(identifier))
			throw "redeclaration of member type " + identifier + " in class " + this.identifier;
		memberTypes.set(identifier, qualident);
	}
}

class MethodContext implements DefinesLocalVariables
{
	// typedef: MethodDefinition
	public var identifier:String;
	public var type:Null<DataType>;
	public var modifiers:EnumSet<Modifier>;
	public var throwsList:Array<Qualident>;
	public var parameters:Array<FormalParameter>;
	
	// method body
	public var body:Statement;
	
	public function new(modifiers:EnumSet<Modifier>, type:Null<DataType>, identifier:String)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.type = type;
		this.identifier = identifier;
		throwsList = [];
		parameters = [];
	}
	
	public function isVariableDefined(identifier:String):Bool
	{
		for (param in parameters)
			if (param.identifier == identifier)
				return true;
		return false;
	}
}

class FieldContext
{
	public var identifier:String;
	public var type:Null<DataType>;
	public var modifiers:EnumSet<Modifier>;
	public var initialization:Expression;
	
	public function new(modifiers:EnumSet<Modifier>, type:Null<DataType>, identifier:String)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.type = type;
		this.identifier = identifier;
	}
}

interface DefinesLocalVariables
{
	function isVariableDefined(identifier:String):Bool;
}

class BlockContext implements DefinesLocalVariables
{
	public var statements(default, null):Array<Statement>;
	public var variables:Hash<FieldContext>;
	public var types:Hash<Qualident>;
	
	public function pushStatement(statement:Statement)
	{
		statements.push(statement);
	}
	
	private var parent:DefinesLocalVariables;
	
	public function new(?parent:DefinesLocalVariables)
	{
		this.parent = parent;
		statements = [];
		variables = new Hash<FieldContext>();
		types = new Hash<Qualident>();
	}
	
	public function getBlockStatement():Statement
	{
		return SBlock(statements);
	}
	
	public function isVariableDefined(identifier:String):Bool
	{
		return variables.exists(identifier) || (parent != null ? parent.isVariableDefined(identifier) : false);
	}
	
	public function defineVariable(variable:FieldContext)
	{
		// prevent redefinition
		if (isVariableDefined(variable.identifier))
			throw "redeclaration of variable " + variable.identifier + " in block scope";
		
		// add definition
		variables.set(variable.identifier, variable);
		// add definition
		pushStatement(SDefinition(DVariable(variable.identifier, variable.modifiers, variable.type)));
		if (variable.initialization != null)
			pushStatement(SExpression(ELocalAssignment(variable.identifier, variable.initialization)));
	}
}

/*-------------------- lexical resolution (second pass) ----------------------------------*/

class LexicalResolver
{
	private var unit:ParsedCompilationUnit;
	
	public function new(unit:ParsedCompilationUnit)
	{
		this.unit = unit;
		qualifiers = new Hash<Qualident>();
		imports = new Hash<Qualident>();
	}
	
	/* imports */
	
	private var qualifiers:Hash<Qualident>;
	
	function qualifyDataType(?type:DataType):DataType
	{
		if (type == null)
			return null;
		return switch (type) {
		    case DTPrimitive(_):
			type;
		    case DTPrimitiveArray(_, _):
			type;
		    case DTReference(qualident):
			DTReference(qualifyReference(qualident));
		    case DTReferenceArray(qualident, dimensions):
			DTReferenceArray(qualifyReference(qualident), dimensions);
		}
	}
	
	function addDependency(qualident:Qualident)
	{
		// add dependency
		unit.dependencies.push(qualident);
		// initialize
		(cast(rootPackage.getByQualident(qualident), CompilationUnit)).initialize(rootPackage);
	}
	
	function qualifyReference(qualident:Qualident):Qualident
	{
		if (qualident == null)
			return null;
		
//[TODO] ensure this order is correct
		// check qualifier map
		if (qualifiers.exists(qualident[0]))
			return qualifiers.get(qualident[0]).concat(qualident.slice(1));
			
		// check potenital imports
		if (imports.exists(qualident[0]))
		{
			// add dependency
			addDependency(imports.get(qualident[0]));
			// add lookup
			qualifiers.set(qualident[0], imports.get(qualident[0]));
			// return qualifier
			return imports.get(qualident[0]);
		}
		
		// ensure type exists (or throw exception)
		rootPackage.getByQualident(qualident);
		// add dependency
		addDependency(qualident);
		// return qualifier
		return qualident;
	}
	
	private var imports:Hash<Qualident>;
	
	function loadImports()
	{
		for (ident in context.imports)
		{
			// check ident type
			if (ident[ident.length - 1] != '*')
			{
				// check that the compilation unit exists
				if (!Std.is(rootPackage.getByQualident(ident.slice(0, -1)), CompilationUnit))
					return;
				imports.set(ident[ident.length - 1], ident);
			}
			else
			{
				// iterate namespace
				try {
					var importPackage = cast(rootPackage.getByQualident(ident.slice(0, -1)), JavaPackage);
					for (item in importPackage.contents.keys())
						if (Std.is(importPackage.contents.get(item), CompilationUnit))
							imports.set(item, ident.slice(0, -1).concat([item]));
				}
				catch (e:Dynamic) { }
			}
		}
	}
	
	/* resolvers */
	
	private var context:CompilationUnitContext;
	private var rootPackage:JavaPackage;
	
	public function resolve(context:CompilationUnitContext, rootPackage:JavaPackage)
	{
		// private variables
		this.context = context;
		this.rootPackage = rootPackage;
		
		// add top-level type qualifiers
		for (type in context.types)
			qualifiers.set(type.identifier, context.packageDeclaration.concat([type.identifier]));
		// generate definitions
		for (type in context.types)
			if (Std.is(type, ClassContext))
				unit.types.set(type.identifier, TClass(generateClassDefinition(cast(type, ClassContext))));

//[TODO] we could find competing method names here; better, when definitions are generated!
				
		// lexical resolution
		for (type in context.types)
			if (Std.is(type, ClassContext))
				resolveClass(context, cast(type, ClassContext));
	}
	
	function generateClassDefinition(type:ClassContext):ClassDefinition 
	{
		var definition = {
		    identifier: type.identifier,
		    modifiers: type.modifiers,
		    fields: new Hash<FieldDefinition>(),
		    methods: new Hash<MethodDefinition>(),
		    extend: qualifyReference(type.extend),
		    implement: [],
		};
		if (type.implement != null)
			for (dt in type.implement)
				definition.implement.push(qualifyReference(dt));
		for (field in type.fields)
			definition.fields.set(field.identifier, generateFieldDefinition(field));
		for (method in type.methods)
			definition.methods.set(method.identifier, generateMethodDefinition(method));
		type.definition = definition;
		return definition;
	}
	
	function generateFieldDefinition(field:FieldContext):FieldDefinition
	{
		return {
		    identifier: field.identifier,
		    modifiers: field.modifiers,
		    type: qualifyDataType(field.type)
		};
	}
	
	function generateMethodDefinition(method:MethodContext):MethodDefinition
	{
		var definition = {
		    identifier: method.identifier,
		    type: qualifyDataType(method.type),
		    modifiers: method.modifiers,
		    throwsList: [],
		    parameters: [],
		};
		if (method.throwsList != null)
			for (qualident in method.throwsList)
				definition.throwsList.push(qualifyReference(qualident));
		for (param in method.parameters)
			definition.parameters.push(generateFormalParameter(param));
		return definition;
	}
	
	function generateFormalParameter(param:FormalParameter)
	{
		return {
		    identifier: param.identifier,
		    type: qualifyDataType(param.type),
		    modifiers: param.modifiers
		};
	}
	
	/* lexical resolution */
	
	var methods:Hash<MethodDefinition>;
	var fields:Hash<FieldDefinition>;
	var memberTypes:Hash<Qualident>;
	
	function initializeResolvers(definition:ClassDefinition)
	{
		if (definition.extend != null)
			initializeResolvers(rootPackage.getClassByQualident(definition.extend));
		for (method in definition.methods)
			methods.set(method.identifier, method);
		for (field in definition.fields)
			fields.set(field.identifier, field);
	}
	
	function resolveClass(context:CompilationUnitContext, classContext:ClassContext)
	{
		// initialize resolvers
		methods = new Hash<MethodDefinition>();
		fields = new Hash<FieldDefinition>();
		memberTypes = new Hash<Qualident>();
		// walk inheritance tree
		initializeResolvers(classContext.definition);
		
		// resolve method bodies
		for (methodContext in classContext.methods)
		{
			if (methodContext.body != null)
			{
				context.ast.set(context.packageDeclaration.concat([classContext.identifier]).join('.') + '|' + methodContext.identifier, resolveStatement(methodContext.body));
			}
		}
//		resolveStatement(classContext.staticConstructor.getBlockStatement());
//		resolveStatement(classContext.objectConstructor.getBlockStatement());
	}

	function resolveStatement(statement:Statement):Statement
	{
		if (statement == null)
			return null;
		
		return switch (statement)
		{
		    case SBlock(statements):
			var s = new Array<Statement>();
			for (statement in statements)
				s.push(resolveStatement(statement));
			SBlock(s);
				
		    case SBreak(_):
			statement;
		    
		    case SConditional(condition, thenBlock, elseBlock):
			SConditional(resolveExpression(condition), resolveStatement(thenBlock), resolveStatement(elseBlock));
				
		    case SContinue(_):
			statement;
		    
		    case SDefinition(definition):
			statement;
		    
		    case SExpression(expression):
			SExpression(resolveExpression(expression));
		    
		    case SLabel(label, body):
			SLabel(label, resolveStatement(body));
			
		    case SLoop(condition, body, doLoop):
			SLoop(resolveExpression(condition), resolveStatement(body), doLoop);
			
		    case SReturn(value):
			SReturn(resolveExpression(value));
				
		    case SThrow(expression):
			SThrow(resolveExpression(expression));
			
		    case STry(body, catches, finallyBody):
			for (catchBlock in catches)
				catchBlock.body = resolveStatement(catchBlock.body);
			STry(resolveStatement(body), catches, resolveStatement(finallyBody));
		}
	}
	
	function eArr(arr:Array<Expression>):Array<Expression>
	{
		var n = new Array<Expression>();
		for (e in arr)
			n.push(resolveExpression(e));
		return n;
	}
	
	function resolveExpression(expression):Expression
	{
		if (expression == null)
			return null;
			
		return switch (expression)
		{
		    // instantiation
		    case EArrayInstantiation(type, sizes):
			EArrayInstantiation(qualifyDataType(type), eArr(sizes));
				
		    case EObjectInstantiation(type, args):
			EObjectInstantiation(qualifyReference(type), eArr(args));
		
		    // control
		    case EConditional(condition, trueExp, falseExp):
			EConditional(resolveExpression(condition), resolveExpression(trueExp), resolveExpression(falseExp));
			
		    // references
		    case EArrayAccess(index, base):
			EArrayAccess(resolveExpression(index), resolveExpression(base));
			
		    case ELocalReference(_): expression;
		    
		    case EReference(identifier, base):
			EReference(identifier, resolveExpression(base));
			
		    case EQualifiedReference(_): expression;
		    case ESuperReference: expression;
		    case EThisReference: expression;
		    
		    // calling
		    case ECall(identifier, base, args):
			ECall(identifier, resolveExpression(base), eArr(args));
				
		    case EThisCall(args):
			EThisCall(eArr(args));
			
		    case ESuperCall(args):
			ESuperCall(eArr(args));
			
		    // assignment
		    case EArrayAssignment(index, base, value):
			EArrayAssignment(resolveExpression(index), resolveExpression(base), resolveExpression(value));
			
		    case EAssignment(identifier, base, value):
			EAssignment(identifier, resolveExpression(base), resolveExpression(value));
			
		    case ELocalAssignment(identifier, value):
			ELocalAssignment(identifier, resolveExpression(value));
			
		    // operations
		    case ECast(type, value):
			ECast(qualifyDataType(type), resolveExpression(value));
			
		    case EPrefixOperation(type, reference):
			EPrefixOperation(type, resolveExpression(reference));
			
		    case EInfixOperation(type, left, right):
			EInfixOperation(type, resolveExpression(left), resolveExpression(right));
			
		    case EInstanceOf(expression, type):
			EInstanceOf(resolveExpression(expression), qualifyDataType(type));
			
		    case EPrefix(type, reference):
			EPrefix(type, resolveExpression(reference));
			
		    case EPostfix(type, reference):
			EPostfix(type, resolveExpression(reference));
		
		    // literals
		    case EArrayLiteral(values):
			EArrayLiteral(eArr(values));
				
		    case EStringLiteral(_): expression;
		    case EIntegerLiteral(_): expression;
		    case EFloatLiteral(_): expression;
		    case ECharLiteral(_): expression;
		    case EBooleanLiteral(_): expression;
		    case ENull: expression;
		
		    // second pass
		    case ELexExpression(expression):
			switch (expression) {
			    case LReference(identifier): resolveLexicalReference(identifier);
			    case LCall(identifier, args): resolveLexicalCall(identifier, args);
			    case LAssignment(identifier, value): resolveLexicalAssignment(identifier, value);
			}
		}
	}
	
	/* lexical resolution */
	
//TODO:
// resolve class fields to this.variable accessors
// resolve inner class variables to accessors
// resolve types to qualified references, add dependencies
	
	public function resolveLexicalReference(identifier:String):Expression
	{
		// class fields
		if (fields.exists(identifier))
			return EReference(identifier, EThisReference);

		// no variable found
		throw 'reference to nonexistant variable "' + identifier + '"';
	}
	
	public function resolveLexicalAssignment(identifier:String, value:Expression):Expression
	{
		// class fields
		if (fields.exists(identifier))
			return EAssignment(identifier, EThisReference, value);
			
		// no variable found
		throw 'assignment to nonexistant variable "' + identifier + '"';
	}
	
	public function resolveLexicalCall(identifier:String, args:Array<Expression>):Expression
	{
		// class methods
		if (methods.exists(identifier))
			return ECall(identifier, EThisReference, args);
			
		// no method found
		throw 'call to nonexistant method "' + identifier + '"';
	}
	
/* unit-level lexical resolution 
	
	public function resolveLexicalType(identifier:String):DataType
	{
		// only qualified references should get this far
		if (!importMap.exists(identifier))
			throw "reference to undeclared type " + identifier;
		// add to dependencies map
		unit.dependencies.push(importMap.get(identifier));
		// return datatype
		return DTReference(importMap.get(identifier));
	}
	
	public function resolveLexicalGetter(identifier:String):Expression
	{
		// check for a qualified reference
		if (!importMap.exists(identifier))
			return ELexReference(identifier);
		// add to dependencies map
		unit.dependencies.push(importMap.get(identifier));
		// return expression
		return EQualifiedReference(importMap.get(identifier));
	}
	
	public function resolveLexicalSetter(identifier:String, value:Expression):Expression
	{
		// lexical setter
		return ELexAssignment(identifier, value);
	}*/
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

