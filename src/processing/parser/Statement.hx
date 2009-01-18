/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	SArrayInstantiation(type:{type:Dynamic, dimensions:Int}, sizes:Array<Statement>);
	SArrayLiteral(values:Array<Statement>);
//	SAssignment(reference:Statement, value:Statement); //SReference
	SBlock(statements:Array<Statement>);
	SBreak(?level:Int);
	SCall(method:Statement, ?args:Array<Dynamic>);
	SCast(type:{type:Dynamic, dimensions:Int}, expression:Statement);
	SClassDefinition(identifier:String, constructorBody:Statement, publicBody:Statement, privateBody:Statement);
	SConditional(condition:Statement, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?level:Int);
//	SDecrement(reference:Statement); // SReference
//[TODO] params should be Param typedef
	SFunctionDefinition(identifier:String, type:{type:Dynamic, dimensions:Int}, params:Array<{name:String, type:{type:Dynamic, dimensions:Int}}> , body:Statement);
//	SIncrement(reference:Statement); // SReference
	SLiteral(value:Dynamic);
	SLoop(condition:Statement, body:Statement);
	SObjectInstantiation(method:Statement, ?args:Array<Dynamic>);
	SOperation(type:TokenType, leftOperand:Statement, ?rightOperand:Statement);
	SReference(identifier:Statement, ?base:Statement);
	SReturn(?value:Statement);
	SThisReference();
	SVariableDefinition(identifier:String, type:{type:Dynamic, dimensions:Int});
	SValue(value:Statement);
}

enum Operators {
	// unary operators
	OpNot;			// !a
	OpBitwiseNot;		// ~a
	OpUnaryPlus;		// +a
	OpUnaryMinus;		// -a
	
	// binary operators
	OpOr;			// a || b
	OpAnd;			// a && b
	OpBitwiseOr;		// a | b
	OpBitwiseXor;		// a ^ b
	OpBitwiseAnd;		// a & b
	OpEqual;		// a == b
	OpUnequal;		// a != b
	OpStrictEqual;		// a === b
	OpStrictUnequal;	// a !== b
	OpLessThan;		// a < b
	OpLessThanOrEqual;	// a <= b
	OpGreaterThan;		// a > b
	OpGreaterThanOrEqual;	// a >= b
	OpIn;			// a in b
	OpInstanceOf;		// a instanceof b
	OpLeftShift;		// a << b
	OpRightShift;		// a >> b
	OpZeroFillRightShift;	// a >>> b
	OpPlus;			// a + b
	OpMinus;		// a - b
	OpMultiply;		// a * b
	OpDivide;		// a / b
	OpModulus;		// a % b
	
	//[TODO] increment/decrement?
}