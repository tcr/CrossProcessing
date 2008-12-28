/**
 * ...
 * @author ...
 */

package processing.interpreter;

class Scope 
{
	public var scope:Dynamic;
	public var parent:Scope;
	public var thisObject:Dynamic;

	public function new(?s:Dynamic, ?p:Scope, ?t:Dynamic):Void {
		scope = (s != null) ? s : { };
		parent = p;
		thisObject = t;
	}
}