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

	public function compile(script:Definition):Dynamic
	{
		// create a context and compile the code
		var context = new format.abc.Context();
		serializeDefinition(script, context);
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
		    case SBreak(level):
//[TODO]

		    case SConditional(condition, thenBlock, elseBlock):
			//[TODO] if condition is an operation, we could roll it into jump style
			serializeExpression(condition, context);
			var j = context.jump(JFalse);
			for (statement in thenBlock)
				serializeStatement(statement, context);
			if (elseBlock.length > 0)
			{
				var k = context.jump(JAlways);
				j();
				for (statement in elseBlock)
					serializeStatement(statement, context);
				k();
			}
			else
			{
				j();
			}				
		
		    case SContinue(level):
//[TODO]

		    case SExpression(expression):
			serializeExpression(expression, context);

		    case SLoop(condition, body):
/*			//[TODO] if condition is an operation, we could roll it into jump style
			var l = context.backwardJump();
			serializeExpression(condition, context);
			var j = context.jump(JFalse);
			serialize(body, context);
			l(JAlways);
			j();*/
		
		    case SReturn(value):
			if (value != null)
			{
				serializeExpression(value, context);
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
		switch (expression)
		{
		    case EArrayAccess(reference, index):
//[TODO]
			
		    case EArrayInstantiation(type, sizes):
//[TODO]

		    case EAssignment(reference, value):
/*			context.op(OGetScope);
			serializeExpression(identifier, context);
			serializeExpression(value, context);
			context.op(OSetProperty);*/
		
		    case ECall(method, args):
//[TODO]

		    case ECallMethod(identifier, base, args):
			trace('hi');
//[TODO]

		    case ECast(type, expression):
//[TODO]

		    case EConditional(condition, thenStatement, elseStatement):
			//[TODO] if condition is an operation, we could roll it into jump style
			serializeExpression(condition, context);
			var j = context.jump(JFalse);
			serializeExpression(thenStatement, context);
			if (elseStatement != null)
			{
				var k = context.jump(JAlways);
				j();
				serializeExpression(elseStatement, context);
				k();
			}
			else
			{
				j();
			}
		
		    case EObjectInstantiation(method, args):
//[TODO]
		
		    case EOperation(type, leftOperand, rightOperand):
/*			// handle && and || operators first
			switch (type)
			{
			    case OR:
				serializeExpression(leftOperand, context);
				context.ops([ODup]);
				var j = context.jump(JTrue);
				context.ops([OPop]);
				serializeExpression(rightOperand, context);
				j();
			    case AND:
				serializeExpression(leftOperand, context);
				context.ops([ODup]);
				var j = context.jump(JFalse);
				context.ops([OPop]);
				serializeExpression(rightOperand, context);
				j();
			    default: // disregard
			}*/
			
			// handle arithmetic operators
			serializeExpression(leftOperand, context);
			if (rightOperand != null)
				serializeExpression(rightOperand, context);
			switch (type)
			{
			    // unary operators
			    case Operator.OpNot:		context.ops([OOp(Operation.OpNot)]);
			    case Operator.OpBitwiseNot:		context.ops([OOp(Operation.OpBitNot)]);
			    case Operator.OpUnaryPlus:		context.ops([OToNumber]);
			    case Operator.OpUnaryMinus:		context.ops([OOp(Operation.OpNeg)]);
	
			    // binary operators
			    case Operator.OpOr:			// a || b
			    case Operator.OpAnd:		// a && b
			    case Operator.OpBitwiseOr:		context.ops([OOp(Operation.OpOr)]);
			    case Operator.OpBitwiseXor:		context.ops([OOp(Operation.OpXor)]);
			    case Operator.OpBitwiseAnd:		context.ops([OOp(Operation.OpAnd)]);
			    case Operator.OpEqual:		context.ops([OOp(Operation.OpEq)]);
			    case Operator.OpUnequal:		context.ops([OOp(Operation.OpEq), OOp(Operation.OpNeg)]);
			    case Operator.OpLessThan:		context.ops([OOp(Operation.OpLt)]);
			    case Operator.OpLessThanOrEqual:	context.ops([OOp(Operation.OpLte)]);
			    case Operator.OpGreaterThan:	context.ops([OOp(Operation.OpGt)]);
			    case Operator.OpGreaterThanOrEqual:	context.ops([OOp(Operation.OpGte)]);
			    case Operator.OpInstanceOf:		// a instanceof b
			    case Operator.OpLeftShift:		context.ops([OOp(Operation.OpShl)]);
			    case Operator.OpRightShift:		context.ops([OOp(Operation.OpShr)]);
			    case Operator.OpZeroRightShift:	context.ops([OOp(Operation.OpUShr)]);
			    case Operator.OpPlus:		context.ops([OOp(Operation.OpAdd)]);
			    case Operator.OpMinus:		context.ops([OOp(Operation.OpSub)]);
			    case Operator.OpMultiply:		context.ops([OOp(Operation.OpMul)]);
			    case Operator.OpDivide:		context.ops([OOp(Operation.OpDiv)]);
			    case Operator.OpModulus:		context.ops([OOp(format.abc.Operation.OpMod)]);
//			    case STRICT_EQ: 	context.ops([OpPhysEq]);
//			    case STRICT_NE: 	context.ops([OpPhysEq, OpNeg]);
			}
			
		    case EPrefix(reference, type):
//[TODO]

		    case EPostfix(reference, type):
//[TODO]
			
		    case EReference(identifier, base):
//			context.op(OGetLex(context.property('constructor')));
			context.op(ONull);
			context.op(OGetLex(context.property('ProcessingSketch')));
//			serializeExpression(base, context);
//			context.op(OString(context.string(identifier)));
//			context.op(OGetProp(context.nsPublic));
	
		    case EThisReference:
			context.op(OThis);

		    case EArrayLiteral(values):
//[TODO]

		    case EStringLiteral(value):
			context.op(OString(context.string(value)));

		    case EIntegerLiteral(value):
			context.op(OInt(value));

		    case EFloatLiteral(value):
//[TODO]

		    case ECharLiteral(value):
//[TODO]

		    case EBooleanLiteral(value):
//[TODO]

		    case ENull:
//[TODO]
		}
	}
	
	private function serializeDefinition(definition:Definition, context:format.abc.Context):Dynamic
	{
		switch (definition)
		{
		    case DScript(definitions, statements):
		        // define classes
			for (definition in definitions)
				if (Type.enumConstructor(definition) == 'DClass')
					serializeDefinition(definition, context);
			// begin main class
			context.beginClass('ProcessingSketch');
			// define methods
			context.defineField('a', null);
			for (definition in definitions)
				if (Type.enumConstructor(definition) == 'DFunction')
					serializeDefinition(definition, context);
			// main function
/*			var variables:Array<Definition> = [];
			for (definition in definitions)
				if (Type.enumConstructor(definition) == 'DVariable')
					variables.push(definition);
			serializeDefinition(DFunction('__init__', VPublic, false, { type: 'void', dimensions: 0 }, [], variables, statements), context);*/
			// finalize class
			context.endClass();
		
		    case DClass(identifier, visibility, isStatic, definitions, statements):
//[TODO]

		    case DFunction(identifier, visibility, isStatic, type, params, definitions, statements):
			// create a member method with defined type
			var method = context.beginMethod(identifier, [], null/*context.type(type.type)*/);
			// set maximum size of the stack
//[TODO] what to do with this!?
			method.maxStack = 10;
			// write bytecode into the current method
//			for (definition in definitions)
//				serializeDefinition(definition, context);
			for (statement in statements)
				serializeStatement(statement, context);
			// finalize method
			context.endMethod();

		    case DVariable(identifier, visibility, isStatic, type):
//			context.op(OGetScope);
//			serialize(identifier, context);
//			context.op(OSmallInt(0));
//			context.op(OSetProperty);
		}
	}
}