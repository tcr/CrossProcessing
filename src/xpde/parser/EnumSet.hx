/**
 * ...
 * @author 
 */

package xpde.parser;

class EnumSet<T>
{
	private var set:Array<T>;

	public function new(?enums:Array<Dynamic>)
	{
		set = [];
		if (enums != null)
			for (item in enums)
				add(item);
	}
	
	public function add(item:T)
	{
		if (!contains(item))
			set.push(item);
	}

	public function contains(itemA:T)
	{
		for (itemB in set)
			if (Type.enumEq(itemA, itemB))
				return true;
		return false;
	}
	
	public function iterator():Iterator<T>
	{
		return set.iterator();
	}
	
	public function toString():String
	{
		return set.join(' ');
	}
}