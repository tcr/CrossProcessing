/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	SArrayInstantiation(type:VariableType, sizes:Array<Statement>);
	SArrayLiteral(values:Array<Statement>);
	SAssignment(type:AssignOperator, reference:Statement, ?value:Statement);
	SBlock(statements:Array<Statement>);
	SBreak(?level:Int);
	SCall(method:Statement, ?args:Array<Dynamic>);
	SCast(type:VariableType, expression:Statement);
	SClassDefinition(identifier:String, constructorBody:Statement, publicBody:Statement, privateBody:Statement);
	SConditional(condition:Statement, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?level:Int);
	SFunctionDefinition(identifier:String, type:VariableType, params:Array<FunctionParam> , body:Statement);
	SLiteral(value:Dynamic);
	SLoop(condition:Statement, body:Statement);
	SObjectInstantiation(method:Statement, ?args:Array<Dynamic>);
	SOperation(type:Operator, leftOperand:Statement, ?rightOperand:Statement);
	SReference(identifier:Statement, ?base:Statement);
	SReturn(?value:Statement);
	SThisReference();
	SVariableDefinition(identifier:String, type:VariableType);
}

enum Operator {
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
	OpZeroRightShift;	// a >>> b
	OpPlus;			// a + b
	OpMinus;		// a - b
	OpMultiply;		// a * b
	OpDivide;		// a / b
	OpModulus;		// a % b
}

enum AssignOperator {
	AssignOp;		// a = b
	AssignOpBitwiseOr;	// a |= b
	AssignOpBitwiseXor;	// a ^= b
	AssignOpBitewiseAnd;	// a &= b
	AssignOpLeftShift;	// a <<= b
	AssignOpRightShift;	// a >>= b
	AssignOpZeroRightShift;	// a >>>= b
	AssignOpPlus;		// a += b
	AssignOpMinus;		// a -= b
	AssignOpMul;		// a *= b
	AssignOpDiv;		// a /= b
	AssignOpMod;		// a %= b
	AssignOpIncrement;	// a++;
	AssignOpDecrement;	// a--;
}

typedef FunctionParam = {
	var name:String;
	var type:VariableType;
}

typedef VariableType = {
	var type:Dynamic;
	var dimensions:Int;
}