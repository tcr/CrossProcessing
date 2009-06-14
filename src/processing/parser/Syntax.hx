/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	SBreak(?label:String);
	SConditional(condition:Expression, thenBlock:Array<Statement>, ?elseBlock:Array<Statement>);
	SContinue(?label:String);
	SExpression(expression:Expression);
	SLoop(condition:Expression, body:Array<Statement>);
	SReturn(?value:Expression);
}

enum Expression
{
	// expressions
	EArrayAccess(reference:Expression, index:Expression);
	EArrayInstantiation(type:VariableType, sizes:Array<Expression>);
	EAssignment(reference:Expression, value:Expression);
	ECall(method:Expression, args:Array<Expression>);
	ECallMethod(identifier:String, base:Expression, args:Array<Expression>);
	ECast(type:VariableType, expression:Expression);
	EConditional(condition:Expression, thenExpression:Expression, elseExpression:Expression);
	EObjectInstantiation(method:Expression, ?args:Array<Expression>);
	EOperation(type:Operator, leftOperand:Expression, ?rightOperand:Expression);
	EPrefix(reference:Expression, type:IncrementType);
	EPostfix(reference:Expression, type:IncrementType);
	EReference(identifier:String, ?base:Expression);
	EThisReference;
	
	// literals
	EArrayLiteral(values:Array<Expression>);
	EStringLiteral(value:String);
	EIntegerLiteral(value:Int);
	EFloatLiteral(value:Float);
	ECharLiteral(value:Int);
	EBooleanLiteral(value:Bool);
	ENull;
}

enum Definition
{
	DVariable(identifier:String, visibility:Visibility, isStatic:Bool, type:VariableType);
	DFunction(identifier:String, visibility:Visibility, isStatic:Bool, type:VariableType, params:Array<FunctionParam>, definitions:Array<Definition>, statements:Array<Statement>);
	DClass(identifier:String, visibility:Visibility, isStatic:Bool, definitions:Array<Definition>, statements:Array<Statement>);
	DScript(definitions:Array<Definition>, statements:Array<Statement>);
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

enum IncrementType {
	IIncrement;
	IDecrement;
}

typedef VariableType = {
	var type:Dynamic;
	var dimensions:Int;
}

typedef FunctionParam = {
	var name:String;
	var type:VariableType;
}