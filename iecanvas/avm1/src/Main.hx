package ;

import flash.Lib;
import flash.MovieClip;
import flash.Stage;

/**
 * ...
 * @author ...
 */

class Main 
{
	static function main() 
	{
		trace('started');
		
		Stage.scaleMode = "noScale";	/* Stage.width and height will be the width and height of the container */
		Stage.align = "TL";
		
		// current movie clip
		Lib.current.opaqueBackground = 0xFF0000;
		Lib.current.onEnterFrame = function () {
			for (command in commandCache)
				canvasCommand(command[0], command[1], command[2], command[3], command[4]);
			commandCache = [];
		}
		
		// add "callback"
/*		Lib._root.watch('canvascmd', function (id:String, oldVal:String, newVal:String) {
			var args = newVal.split('|');
			canvasCommand(args[0], args[1], args[2], args[3], args[4]);
		});*/
		Lib._root.watch('canvascmd', function (id:String, oldVal:String, newVal:String) {
			commandCache.push(newVal.split('|'));
//			canvasCommand(args[0], args[1], args[2], args[3], args[4]);
		});
	}
	
	static public var commandCache:Array < Array < String >> = [];
	
	static function canvasCommand(type:String, arg1:String, arg2:String, arg3:String, arg4:String)
	{
		switch (type) {
			case "clear":
//				self.should_redraw = true;
				Lib.current.clear();
			case "lineStyle":
				Lib.current.lineStyle(Std.parseFloat(arg1), Std.parseInt(arg2), Std.parseInt(arg3));
			case "beginFill":
				Lib.current.beginFill(Std.parseInt(arg1), Std.parseFloat(arg2));
			case "endFill":
				Lib.current.endFill();
			case "moveTo":
				Lib.current.moveTo(Std.parseFloat(arg1), Std.parseFloat(arg2));
			case "lineTo":
				Lib.current.lineTo(Std.parseFloat(arg1), Std.parseFloat(arg2));
		}
	}
	
}