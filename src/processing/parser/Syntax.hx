/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	// statements
	SArrayInstantiation(type:VariableType, sizes:Array<Statement>);
	SArrayLiteral(values:Array<Statement>);
	SAssignment(reference:Statement, value:Statement);
	SBlock(statements:Array<Statement>, definitions:Array<Statement>);
	SBreak(?level:Int);
	SCall(method:Statement, ?args:Array<Statement>);
	SCast(type:VariableType, expression:Statement);
	SConditional(condition:Statement, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?level:Int);
	SLiteral(value:Dynamic);
	SLoop(condition:Statement, body:Statement);
	SObjectInstantiation(method:Statement, ?args:Array<Statement>);
	SOperation(type:Operator, leftOperand:Statement, ?rightOperand:Statement);
	SReference(identifier:Statement, ?base:Statement);
	SReturn(?value:Statement);
	SThisReference();
	
	// definitions
	SFunctionDefinition(identifier:String, type:VariableType, params:Array<FunctionParam> , body:Statement);
	SClassDefinition(identifier:String, constructorBody:Statement, publicBody:Statement, privateBody:Statement);
	SVariableDefinition(identifier:String, type:VariableType);
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
	OpStrictEqual;			// a === b
	OpStrictUnequal;		// a !== b
	OpLessThan;			// a < b
	OpLessThanOrEqual;		// a <= b
	OpGreaterThan;			// a > b
	OpGreaterThanOrEqual;		// a >= b
	OpIn;				// a in b
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

typedef FunctionParam = {
	var name:String;
	var type:VariableType;
}

typedef VariableType = {
	var type:Dynamic;
	var dimensions:Int;
}