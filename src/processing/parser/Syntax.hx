/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	// statements
	SArrayAccess(reference:Statement, index:Statement);
	SArrayInstantiation(type:VariableType, sizes:Array<Statement>);
	SArrayLiteral(values:Array<Statement>);
	SAssignment(reference:Statement, value:Statement);
	SBlock(statements:Array<Statement>, definitions:Array<Definition>);
	SBreak(?level:Int);
	SCall(method:Statement, ?args:Array<Statement>);
	SCast(type:VariableType, expression:Statement);
	SConditional(condition:Statement, thenBlock:Array<Statement>, ?elseBlock:Array<Statement>);
	SContinue(?level:Int);
	SLiteral(value:Dynamic);
	SLoop(condition:Statement, body:Array<Statement>);
	SObjectInstantiation(method:Statement, ?args:Array<Statement>);
	SOperation(type:Operator, leftOperand:Statement, ?rightOperand:Statement);
	SPostfix(reference:Statement, postfix:Statement);
	SReference(identifier:Statement, ?base:Statement);
	SReturn(?value:Statement);
	SThisReference();
}

enum Definition
{
	DVariable(identifier:String, visibility:Visibility, isStatic:Bool, type:VariableType);
	DFunction(identifier:String, visibility:Visibility, isStatic:Bool, type:VariableType, params:Array<FunctionParam>, body:Statement);
	DClass(identifier:String, visibility:Visibility, isStatic:Bool, body:Statement);
}

enum Visibility
{
	VPublic;
	VPrivate;
}

enum Operator {
	// unary operators
	OpNot;				// !a
	OpBitwiseNot;			// ~a
	OpUnaryPlus;			// +a
	OpUnaryMinus;			// -a
	
	// binary operators
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
	OpInstanceOf;			// a instanceof b
	OpLeftShift;			// a << b
	OpRightShift;			// a >> b
	OpZeroRightShift;		// a >>> b
	OpPlus;				// a + b
	OpMinus;			// a - b
	OpMultiply;			// a * b
	OpDivide;			// a / b
	OpModulus;			// a % b
}

typedef VariableType = {
	var type:Dynamic;
	var dimensions:Int;
}

typedef FunctionParam = {
	var name:String;
	var type:VariableType;
}