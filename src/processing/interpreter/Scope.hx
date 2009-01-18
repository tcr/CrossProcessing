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
	
	public function findDefinition(name:String):Scope 
	{
		return hasField(name) ? this : (parent != null ? parent.findDefinition(name) : null);
	}
	
	public function getField(name:String, ?deep:Bool):Dynamic
	{
		return hasField(name) ? Reflect.field(scope, name) : (deep ? parent.getField(name, deep) : null);
	}
	
	public function hasField(name:String, ?deep:Bool):Bool 
	{
		return Reflect.hasField(scope, name) || (deep ? parent.hasField(name, deep) : false);
	}
	
	public function setField(name:String, value:Dynamic, ?deep:Bool):Void
	{
		if (!hasField(name) && deep)
		{
			var scope:Scope = findDefinition(name);
			if (scope != null) {
				scope.setField(name, value);
				return;
			}
		}
		Reflect.setField(scope, name, value);
	}
}