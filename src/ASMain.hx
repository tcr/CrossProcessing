/**
 * ...
 * @author ...
 */

package ;
import processing.evaluator.Evaluator;

class ASMain
{
	static function main()
	{
		var evaluator:Evaluator = new Evaluator();
		evaluator.evaluate('int five() { return 5; } int test() { return five; } test();');
	}
}