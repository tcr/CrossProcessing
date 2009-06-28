package ;

import haxe.io.StringInput;
import js.Lib;
import xpde.compiler.SourceCompiler;

import xpde.parser.Parser;
import xpde.parser.Scanner;

/**
 * ...
 * @author 
 */

class ParserMain 
{
	static function main() 
	{
	}
	
	static function start()
	{
		var script:String = untyped js.Lib.document.getElementById('script').value;
		var scanner:Scanner = new Scanner(new StringInput(script));
		var parser:Parser = new Parser(scanner);
		var program:PdeProgram = parser.Parse();
		
		var compiler = new SourceCompiler();
		trace(compiler.compile(program.getCompilationUnit('Sketch')));
//		untyped console.dir(serialize(parser.compilationUnit));
		trace('#DONE#');
	}
	
	static function serialize(arg:Dynamic, ?count:Int = 0):Dynamic {
if (count == 99)
	return null;
		if (Std.is(arg, Array))
		{
			var ret:Dynamic = untyped __js__('{}');
			for (i in Reflect.fields(arg))
				ret[Std.parseInt(i)] = serialize(Reflect.field(arg, i));
			return ret;
		} else if (Type.getEnum(arg) != null) {
			var ret:Dynamic = untyped __js__('{}');
			Reflect.setField(ret, '#TYPE#', Type.enumConstructor(arg));
			var args:String = untyped Reflect.field(Type.getEnum(arg), Type.enumConstructor(arg)).toString();
			var argsA:Array<String> = ~/^function \(|\)[\s\S]+$|\s+/g.replace(args, '').split(','), j:Int = 0;
			for (i in argsA)
				Reflect.setField(ret, i, serialize(Type.enumParameters(arg)[j++], count + 1));
//			for (i in Reflect.fields(arg))
//				ret[Std.parseInt(i)] = serialize(Reflect.field(arg, i));
			return ret;
		} else if (Std.is(arg, String)) {
			return arg;
		} else if (Std.is(arg, Hash)) {
			var ret:Dynamic = untyped __js__('{}');
			var keys:Iterator<String> = untyped arg.keys();
			for (i in keys)
				Reflect.setField(ret, i, serialize(arg.get(i), count + 1));
			return ret;
		}/* else if (Std.is(arg, Modifiers)) {
			return arg.cur;
		}*/ else {
			var ret:Dynamic = untyped __js__('{}');
			for (i in Reflect.fields(arg)) {
				Reflect.setField(ret, i, serialize(Reflect.field(arg, i), count + 1));
			}
			return ret;
		}
	}
}
