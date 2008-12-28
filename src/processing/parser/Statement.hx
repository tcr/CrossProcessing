/**
 * ...
 * @author ...
 */

package processing.parser;

enum Statement 
{
	ArrayInstantiation(type:Type, size1:Statement, ?size2:Statement, ?size3:Statement);
	ArrayLiteral(values:Array<Statement>);
//[TODO] should force Reference
	Assignment(reference:Statement, value:Statement);
	Block(statements:Array<Statement>);
	Break(level:Int);
	Call(method:Statement, ?args:Array<Dynamic>);
	Cast(type:Type, expression:Statement);
	ClassDefinition(identifier:String, constructorBody:Statement, publicBody:Statement, privateBody:Statement);
	Conditional(condition:Statement, thenBlock:Statement, ?elseBlock:Statement);
	Continue(level:Int);
//[TODO] should force Reference
	Decrement(reference:Statement);
	FunctionDefinition(identifier:String, type:Type, params:Array < Array < Dynamic >> , body:Statement);
//[TODO] should force Reference
	Increment(reference:Statement);
	Literal(value:Dynamic);
	Loop(condition:Statement, body:Statement);
	ObjectInstantiation(method:Statement, ?args:Array<Dynamic>);
	Operation(type:TokenType, leftOperand:Statement, ?rightOperand:Statement);
	Reference(identifier:Statement, ?base:Statement);
	Return(?value:Statement);
	ThisReference();
	VariableDefinition(identifier:String, type:Type);
}