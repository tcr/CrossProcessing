/**
 * ...
 * @author ...
 */

package processing.evaluator;

import processing.parser.Parser;
import processing.parser.Syntax;

#if js
import processing.compiler.JavaScriptCompiler;
#elseif flash
import flash.display.Loader;
import format.abc.Data;
import format.swf.Data;
import processing.compiler.FlashCompiler;
#else
import processing.interpreter.Interpreter;
import processing.interpreter.Scope;
#end

class Evaluator {
	
	private var contexts:Array<Dynamic>;
	
	public function new(?_contexts:Array < Dynamic > ) {
		contexts = _contexts != null ? _contexts : [];
	}

	public function evaluate(code) {
		// create parser
		var parser:Parser = new Parser();
		var script:Definition = parser.parse(code);

#if js
		// compile script
		var compiler:JavaScriptCompiler = new JavaScriptCompiler();
		var compiled:String = compiler.compile(script);

		// build with wrapping
		var func:String = '(function (code, contexts) { ';
		for (i in 0...contexts.length)
			func += 'with (contexts.shift()) ';
		func += 'return eval(code); })';
		// evaluate
		var evaluator:String -> Array <Dynamic> -> Dynamic = js.Lib.eval(func);
		return evaluator(compiled, contexts);
#elseif flash
		// compile script
		var compiler:FlashCompiler = new FlashCompiler();
		var compiled:haxe.io.Bytes = compiler.compile(script);

		// create a new SWF
		var swfOutput:haxe.io.BytesOutput = new haxe.io.BytesOutput();
		var swfFile:format.swf.SWF = {
			header: {
				version : 9,
				compressed : false,
				width : 1,
				height : 1,
				fps : 30,
				nframes : 1
			},
			tags: [
				TSandBox(25),			// Flash9 Sandbox
				TActionScript3(compiled),	// ActionScript block
				TShowFrame			// Show frame
			]
			
		}
		// write SWF
		var writer:format.swf.Writer = new format.swf.Writer(swfOutput);
		writer.write(swfFile);
		var swfBytes:haxe.io.Bytes = swfOutput.getBytes();

		// load locally
		var loader:Loader = new Loader();
		loader.contentLoaderInfo.addEventListener(flash.events.Event.COMPLETE, function (e)
		{
			// get the main class
			var Sketch = loader.contentLoaderInfo.applicationDomain.getDefinition('ProcessingSketch');
			trace(Sketch);
			// create an instance of it
			var sketch:Dynamic = Type.createInstance(Sketch, []);
			// call initialization method
			trace(sketch.test());
		});
		loader.loadBytes(swfBytes.getData());
#else
		// build scope
		var globalScope:Scope = new Scope(), currentScope:Scope = globalScope;
		globalScope.thisObject = globalScope;
		for (context in contexts)
			currentScope = new Scope(context, currentScope);

		// interpret code
		var interpreter:Interpreter = new Interpreter();
		interpreter.interpret(script, currentScope);
#end
	}
}
