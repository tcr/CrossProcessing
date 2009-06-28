/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? EReference is better than Expression

package processing.parser;

enum Statement 
{
	SBlock(definitions:Hash<BlockDefinition>, statements:Array<Statement>);
	SBreak(?label:String);
	SConditional(condition:Expression, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?label:String);
	SExpression(expression:Expression);
	SLoop(condition:Expression, body:Statement);
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

enum ClassDefinition
{
	DProperty(identifier:String, visibility:Visibility, isStatic:Bool, type:DataType, ?init:Expression);
	DMethod(identifier:String, visibility:Visibility, isStatic:Bool, type:DataType, params:Array<FunctionParam>, body:Statement);
	DClass(identifier:String, visibility:Visibility, isStatic:Bool, definitions:Hash<ClassDefinition>);
}

enum BlockDefinition
{
	DVariable(identifier:String, type:VariableType);
}

enum DataType
{
	DTPrimitive(type:PrimitiveType, dimensions:Int);
	//[TODO] identifier be a reference?
	DTReference(identifier:String, dimensions:Int);
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

typedef FunctionParam = {
	var identifier:String;
	var type:DataType;
}

enum Visibility
{
	VPublic;
	VPrivate;
}