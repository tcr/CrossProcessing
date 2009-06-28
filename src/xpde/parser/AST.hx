/**
 * ...
 * @author ...
 */

// http://help.eclipse.org/help32/index.jsp?topic=/org.eclipse.jdt.doc.isv/reference/api/org/eclipse/jdt/core/dom/package-summary.html

//[TODO] can we typecast for specific enums? EReference is better than Statement

package xpde.parser;

import xpde.parser.Parser;

/* expressions */

enum PrefixOperator
{
	OpNot;				// !a
	OpBitwiseNot;			// ~a
	OpUnaryPlus;			// +a
	OpUnaryMinus;			// -a
}

enum InfixOperator
{	
	OpOr;				// a || b
	OpAnd;				// a && b
	OpBitwiseOr;			// a | b
	OpBitwiseXor;			// a ^ b
	OpBitwiseAnd;			// a & b
	OpEqual;			// a == b
	OpUnequal;			// a != b
	OpLessThan;			// a < b
	OpLessThanOrEqual;		// a <= b
	OpGreaterThan;			// a > b
	OpGreaterThanOrEqual;		// a >= b
	OpLeftShift;			// a << b
	OpRightShift;			// a >> b
	OpZeroRightShift;		// a >>> b
	OpAdd;				// a + b
	OpSubtract;			// a - b
	OpMultiply;			// a * b
	OpDivide;			// a / b
	OpModulus;			// a % b
}

enum IncrementType
{
	IIncrement;
	IDecrement;
}

enum Expression
{
	// expressions
	EArrayAccess(index:Expression, base:Expression);
	EArrayInstantiation(type:DataType, sizes:Array<Expression>);
	EArrayAssignment(index:Expression, base:Expression, value:Expression);
	EAssignment(identifier:String, base:Expression, value:Expression);
	ECall(method:Expression, args:Array<Expression>);
	ECallMethod(identifier:String, base:Expression, args:Array<Expression>);
	ECast(type:DataType, expression:Expression);
	EConditional(condition:Expression, thenExpression:Expression, elseExpression:Expression);
	EInstanceOf(expression:Expression, type:DataType);
	EObjectInstantiation(qualifier:Array<String>, args:Array<Expression>);
	EPrefix(type:IncrementType, reference:Expression);
	EPostfix(type:IncrementType, reference:Expression);
	EReference(identifier:String, ?base:Expression);
	ESuperReference;
	EThisReference;
	
	// operations
	EPrefixOperation(operation:PrefixOperator, operand:Expression);
	EInfixOperation(operation:InfixOperator, leftOperand:Expression, rightOperand:Expression);
	
	// literals
	EArrayLiteral(values:Array<Expression>);
	EStringLiteral(value:String);
	EIntegerLiteral(value:Int);
	EFloatLiteral(value:Float);
	ECharLiteral(value:Int);
	EBooleanLiteral(value:Bool);
	ENull;
}

/* statements */

enum Statement 
{
	SBlock(definitions:Array<Definition>, statements:Array<Statement>);
	SBreak(?label:String);
	SConditional(condition:Expression, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?label:String);
	SExpression(expression:Expression);
	SLabel(label:String, body:Statement);
	SLoop(condition:Expression, body:Statement, doLoop:Bool);
	SReturn(?value:Expression);
//	SSwitch();
	SThrow(expression:Expression);
	STry(body:Statement, ?catches:Array<Catch>, ?finallyBody:Statement);
}

typedef Catch = {
	var parameter:FormalParameter;
	var body:Statement;
}

/* definitions */

enum Visibility
{
	VPublic;
	VPrivate;
}

enum DataType
{
	DTPrimitive(type:PrimitiveType);
	DTReference(qualident:Array<String>);
	DTArray(type:DataType, dimensions:Int);	//[TODO] disallow DTArray in datatype, or make it part of syntax notation?
}

enum PrimitiveType
{
	PTByte;
	PTShort;
	PTInt;
	PTLong;
	PTFloat;
	PTDouble;
	PTChar;
	PTBoolean;
}

enum Definition
{
//	DVariable(identifier:String, type:DataType);
	DMethod(identifier:String, type:DataType, modifiers:EnumSet<Modifier>, params:Array<FormalParameter>, body:Statement);
	DField(identifier:String, type:DataType, modifiers:EnumSet<Modifier>);
	DClass(identifier:String, modifiers:EnumSet<Modifier>, definitions:Array<Definition>, ?extend:DataType, ?implement:Array<DataType>, ?clinit:Statement, ?init:Statement);
}

enum Modifier {
	MPublic;
	MPrivate;
	MProtected;
	MStatic;
	MFinal;
	MSynchronized;
	MVolatile;
	MTransient;
	MNative;
	MAbstract;
	MStrictfp;
}

typedef FormalParameter = {
	var identifier:String;
	var type:DataType;
	var modifiers:EnumSet<Modifier>;
}

/* compilation unit */

typedef CompilationUnit = {
	var packageIdent:Array<String>;
	var importIdents:Array < Array < String >> ;
	var definitions:Array<Definition>;
}
