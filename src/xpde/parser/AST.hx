/**
 * ...
 * @author ...
 */

// http://help.eclipse.org/help32/index.jsp?topic=/org.eclipse.jdt.doc.isv/reference/api/org/eclipse/jdt/core/dom/package-summary.html

//[TODO] can we typecast for specific enums? EReference is better than Statement

package xpde.parser;

import xpde.Rtti;

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
	ELocalReference(identifier:String);
	EReference(identifier:String, base:Expression);
	EQualifiedReference(qualident:Qualident);
	ESuperReference;
	EThisReference;
	// calling
	ECall(identifier:String, base:Expression, args:Array<Expression>);
	EThisCall(args:Array<Expression>);
	ESuperCall(args:Array<Expression>);
	// assignment
	EArrayAssignment(index:Expression, base:Expression, value:Expression);
	EAssignment(identifier:String, base:Expression, value:Expression);
	ELocalAssignment(identifier:String, value:Expression);
	
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
	
	// second pass
	ELexExpression(expression:LexicalExpression);
}

enum LexicalExpression
{
	LReference(identifier:String);
	LCall(identifier:String, args:Array<Expression>);
	LAssignment(identifier:String, value:Expression);
}

/* statements */

enum Statement 
{
	SBlock(definitions:Hash<FieldDefinition>, statements:Array<Statement>);
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
