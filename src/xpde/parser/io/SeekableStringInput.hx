/**
 * ...
 * @author 
 */

package xpde.parser.io;
import haxe.io.StringInput;

class SeekableStringInput extends StringInput, implements Seekable
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
