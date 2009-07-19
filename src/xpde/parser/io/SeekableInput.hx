/**
 * ...
 * @author 
 */

package xpde.parser.io;

import haxe.io.Input;

typedef SeekableInput = {
	function readByte():Int;
	function seek(pos:Int):Void;
};
