/**
 * ...
 * @author ...
 */

//[TODO] can we typecast for specific enums? SReference is better than Statement

package processing.parser;

enum Statement 
{
	SArrayInstantiation(type:Type, sizes:Array<Statement>);
	SArrayLiteral(values:Array<Statement>);
	SAssignment(reference:Statement, value:Statement); //SReference
	SBlock(statements:Array<Statement>);
	SBreak(?level:Int);
	SCall(method:Statement, ?args:Array<Dynamic>);
	SCast(type:Type, expression:Statement);
	SClassDefinition(identifier:String, constructorBody:Statement, publicBody:Statement, privateBody:Statement);
	SConditional(condition:Statement, thenBlock:Statement, ?elseBlock:Statement);
	SContinue(?level:Int);
	SDecrement(reference:Statement); // SReference
//[TODO] params should be Param typedef
	SFunctionDefinition(identifier:String, type:Type, params:Array<{name:String, type:Type}> , body:Statement);
	SIncrement(reference:Statement); // SReference
	SLiteral(value:Dynamic);
	SLoop(condition:Statement, body:Statement);
	SObjectInstantiation(method:Statement, ?args:Array<Dynamic>);
	SOperation(type:TokenType, leftOperand:Statement, ?rightOperand:Statement);
	SReference(identifier:Statement, ?base:Statement);
	SReferenceValue(reference:Statement);	// SReference
	SReturn(?value:Statement);
	SThisReference();
	SVariableDefinition(identifier:String, type:Type);
	SValue(value:Statement);
}