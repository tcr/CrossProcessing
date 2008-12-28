package processing.parser;

class Type
{
	public var type:Dynamic;
	public var dimensions:Int;

	public function new(t:Dynamic, d:Int = 0) {
		type = t;
		dimensions = d;
	}
}