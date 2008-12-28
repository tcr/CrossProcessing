/**
 * ...
 * @author ...
 */

package processing.compiler;

import haxe.io.Bytes;
import processing.parser.Parser;
import processing.parser.Statement;

class FlashCompiler implements ICompiler
{
	public function new() { }

	public function compile(code:String):Bytes
	{
		// parse the code
		var parser = new Parser();
		var script:Statement = parser.parse(code);
		// create a context and compile the code
		var context = new format.abc.Context();
		serialize(script, context);
		context.finalize();
		
		// compile ActionScript bytecode
		var abcOutput = new haxe.io.BytesOutput();
		format.abc.Writer.write(abcOutput, context.getData());
		var abcBytes:haxe.io.Bytes = abcOutput.getBytes();
		
		// return compiled code
		return abcBytes;
	}
	
	private function serialize(statement:Statement, context:format.abc.Context):Void
	{
		switch (statement)
		{
		case ArrayInstantiation(type, size1, size2, size3):
		case ArrayLiteral(value):
		case Assignment(reference, value):
		case Block(statements):
		case Break(level):
		case Call(method, args):
		case Cast(type, expression):
		case ClassDefinition(identifier, constructorBody, publicBody, privateBody):
		case Conditional(condition, thenBlock, elseBlock):
		case Continue(level):
		case Decrement(reference):
		case FunctionDefinition(identifier, type, params, body):
		case Increment(reference):
		case Literal(value):
		case Loop(condition, body):
		case ObjectInstantiation(method, args):
		case Operation(type, leftOperand, rightOperand):
		case Reference(identifier, base):
		case Return(value):
		case ThisReference:
		case VariableDefinition(identifier, type):
		}
	}
}