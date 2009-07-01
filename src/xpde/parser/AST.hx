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
	// instantiation
	EArrayInstantiation(type:DataType, sizes:Array<Expression>);
	EObjectInstantiation(qualifier:Qualident, args:Array<Expression>);
	
	// control
	EConditional(condition:Expression, thenExpression:Expression, elseExpression:Expression);
	
	// references
	EArrayAccess(index:Expression, base:Expression);
	ELexReference(identifier:String);
	EReference(identifier:String, base:Expression);
	EQualifiedReference(qualident:Qualident);
	ESuperReference;
	EThisReference;
	// calling
	ELexCall(identifier:String, args:Array<Expression>);
	ECall(identifier:String, base:Expression, args:Array<Expression>);
	EThisCall(args:Array<Expression>);
	ESuperCall(args:Array<Expression>);
	// assignment
	EArrayAssignment(index:Expression, base:Expression, value:Expression);
	EAssignment(identifier:String, base:Expression, value:Expression);
	ELexAssignment(identifier:String, value:Expression);
	
	// operations
	ECast(type:DataType, expression:Expression);
	EPrefixOperation(operation:PrefixOperator, operand:Expression);
	EInfixOperation(operation:InfixOperator, leftOperand:Expression, rightOperand:Expression);
	EInstanceOf(expression:Expression, type:DataType);
	EPrefix(type:IncrementType, reference:Expression);
	EPostfix(type:IncrementType, reference:Expression);
	
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
	SBlock(definitions:Array<FieldDefinition>, statements:Array<Statement>);
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
	DTReference(qualident:Qualident);
	DTArray(type:DataType, dimensions:Int);	//[TODO] disallow DTArray in datatype (or make cumulation an innate part of its notation?)
}

typedef Qualident = Array<String>;

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


enum TopLevelDefinition
{
	DClass(definition:ClassDefinition);
//	DInterface(identifier:String, modifiers:EnumSet<Modifier>, definitions:Array<Definition>, ?extend:DataType, ?implement:Array<DataType>, ?clinit:Statement, ?init:Statement);
}

typedef ClassDefinition = {
	var identifier:String;
	var modifiers:EnumSet<Modifier>;
	var fields:Array<FieldDefinition>;
	var methods:Array<MethodDefinition>;
	var extend:DataType;
	var implement:Array<DataType>;
	var clinit:Statement;
	var init:Statement;
};

typedef FieldDefinition = {
	var identifier:String;
	var type:DataType;
	var modifiers:EnumSet<Modifier>;
};

typedef MethodDefinition = {
	var identifier:String;
	var type:DataType;
	var modifiers:EnumSet<Modifier>;
	var params:Array<FormalParameter>;
	var body:Statement;
};

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
