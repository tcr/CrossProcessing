/**
 * ...
 * @author ...
 */

package ;

import format.abc.Data;
import format.swf.Data;

class Test
{
	static var loader : flash.display.Loader;
	
	static function main() {
		var ctx = new format.abc.Context();
		// defines a class called Main
		ctx.beginClass("Main");
		// the type 'int' in Flash9
		var tint = ctx.type("int");
		// create a member method called 'test'
		// with 0 arguments and return type 'int'
		var m = ctx.beginMethod("test",[],tint);
		// the maximum size of the stack in this method
		m.maxStack = 1;
		// write bytecode into the current method
		ctx.ops([
			OInt(666),
			ORet,
		]);
		// we are done with all the bytecode writing
		ctx.finalize();

		// compile ActionScript bytecode
		var abcOutput = new haxe.io.BytesOutput();
		format.abc.Writer.write(abcOutput, ctx.getData());
		var abcBytes:haxe.io.Bytes = abcOutput.getBytes();
		
		// create a new SWF
		var swfOutput:haxe.io.BytesOutput = new haxe.io.BytesOutput();
		var swfFile:format.swf.SWF = {
			header: {
				version : 9,
				compressed : false,
				width : 400,
				height : 300,
				fps : 30,
				nframes : 1
			},
			tags: [
				TSandBox(25),			// Flash9 Sandbox
				TActionScript3(abcBytes),	// ActionScript block
				TShowFrame			// Show frame
			]
			
		}
		// write SWF
		var writer:format.swf.Writer = new format.swf.Writer(swfOutput);
		writer.write(swfFile);
		var swfBytes:haxe.io.Bytes = swfOutput.getBytes();

		// load locally
		loader = new flash.display.Loader();
		loader.contentLoaderInfo.addEventListener(flash.events.Event.COMPLETE, onLoaded);
		loader.loadBytes(swfBytes.getData());
	}
	
	// the data has been succesfully loaded
	public static function onLoaded(e) {
		// get the Main class
		var m = loader.contentLoaderInfo.applicationDomain.getDefinition("Main");
		// create an instance of it
		var inst : Dynamic = Type.createInstance(m,[]);
		// call the 'test' method
		trace(inst.test());
		// this should display '666'
	}
}