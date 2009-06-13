/**
 * ...
 * @author ...
 */

package processing.compiler;

import haxe.io.Bytes;
import format.abc.Data;
import processing.parser.Parser;
import processing.parser.Syntax;

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
	
	private function serializeStatement(statement:Statement, context:format.abc.Context):Dynamic
	{
		switch (statement)
		{
		    case SBlock(statements):
			for (statement in statements)
				serialize(statement, context);
		
		    case SBreak(level):
//[TODO]

		    case SConditional(condition, thenBlock, elseBlock):
			//[TODO] if condition is an operation, we could roll it into jump style
			serialize(condition, context);
			var j = context.jump(JFalse);
			serialize(thenBlock, context);
			if (elseBlock)
			{
				var k = context.jump(JAlways);
				j();
				serialize(elseBlock, context);
				k();
			}
			else
			{
				j();
			}				
		
		    case SContinue(level):
//[TODO]

		    case SLoop(condition, body):
			//[TODO] if condition is an operation, we could roll it into jump style
			var l = context.backwardJump();
			serialize(condition, context);
			var j = context.jump(JFalse);
			serialize(body, context);
			l(JAlways);
			j();
		
		    case SReturn(value):
			if (value)
			{
				serialize(value, context);
				context.ops([ORet]);
			}
			else
			{
				context.ops([ORetVoid]);
			}
		}
	}
	
	private function serializeExpression(expression:Expression, context:format.abc.Context):Dynamic
	{
		switch (statement)
		{
		    case EArrayInstantiation(type, size1, size2, size3):
//[TODO]

		    case EArrayLiteral(value):
//[TODO]

		    case EAssignment(reference, value):
			context.op(OGetScope);
			serialize(identifier, context);
			serialize(value, context);
			context.op(OSetProperty);
		
		    case ECall(method, args):
//[TODO]

		    case ECast(type, expression):
//[TODO]

		    case EConditional(condition, thenStatement, elseStatement):
			//[TODO] if condition is an operation, we could roll it into jump style
			serialize(condition, context);
			var j = context.jump(JFalse);
			serialize(thenBlock, context);
			if (elseBlock)
			{
				var k = context.jump(JAlways);
				j();
				serialize(elseBlock, context);
				k();
			}
			else
			{
				j();
			}				

		    case EDecrement(reference):

		    case EIncrement(reference):
		
		    case ELiteral(value):
		
		    case EObjectInstantiation(method, args):
//[TODO]
		
		    case EOperation(type, leftOperand, rightOperand):
			// handle && and || operators first
			switch (type)
			{
			    case OR:
				serialize(leftOperand, context);
				context.ops([ODup]);
				var j = context.jump(JTrue);
				context.ops([OPop]);
				serialize(rightOperand, context);
				j();
			    case AND:
				serialize(leftOperand, context);
				context.ops([ODup]);
				var j = context.jump(JFalse);
				context.ops([OPop]);
				serialize(rightOperand, context);
				j();
			    default: // disregard
			}
			
			// handle arithmetic operators
			serialize(leftOperand, context);
			if (rightOperand)
				serialize(rightOperand, context);
			switch (type) {
			    case BITWISE_OR: 	context.ops([OpOr]);
			    case BITWISE_XOR: 	context.ops([OpAnd]);
			    case BITWISE_AND: 	context.ops([OpXor]);
//			    case STRICT_EQ: 	context.ops([OpPhysEq]);
			    case EQ: 		context.ops([OpEq]);
//			    case STRICT_NE: 	context.ops([OpPhysEq, OpNeg]);
			    case NE: 		context.ops([OpEq, OpNeg]);
			    case LSH: 		context.ops([OpShl]);
			    case LE: 		context.ops([OpLte]);
			    case LT: 		context.ops([OpLt]);
			    case URSH: 		context.ops([OpUShr]);
			    case RSH: 		context.ops([OpShr]);
			    case GE: 		context.ops([OpGte]);
			    case GT: 		context.ops([OpGt]);
			    case PLUS: 		context.ops([OpAdd]);
			    case MINUS: 	context.ops([OpSub]);
			    case MUL: 		context.ops([OpMul]);
			    case DIV: 		context.ops([OpDiv]);
			    case MOD: 		context.ops([OpMod]);
			    case NOT: 		context.ops([OpNot]);
			    case BITWISE_NOT: 	context.ops([OpBitNot]);
			    case UNARY_PLUS: 	context.ops([OToNumber]);
			    case UNARY_MINUS: 	context.ops([OpNeg]);
//			    case OR, AND: // disregard
			}
			
		    case EReference(identifier, base):
			serialize(base, context);
			serialize(identifier, context);
			context.op(OGetProp(context.nsPublic));
	
		    case EThisReference:
			context.ops([OThis]);
		}
	}
	
	private function serializeDefinition(definition:Definition, context:format.abc.Context):Dynamic
	{
		switch (definition)
		{
		    case DClass(identifier, constructorBody, publicBody, privateBody):
//[TODO]

		    case DFunction(identifier, type, params, body):
//[TODO]

		    case DVariable(identifier, type):
			context.op(OGetScope);
			serialize(identifier, context);
			context.op(OSmallInt(0));
			context.op(OSetProperty);
		}
	}
}