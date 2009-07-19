/**
 * ...
 * @author 
 */

package xpde.parser.io;
import haxe.io.StringInput;

class SeekableStringInput extends StringInput, implements Seekable, implements SeekableInput
{
	public function seek(pos:Int):Void
	{
		#if flash9
		this.b.position = pos;
		#else
		this.pos = pos;
		#end
	}	
}
