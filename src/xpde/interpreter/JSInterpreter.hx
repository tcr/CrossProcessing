/**
 * ...
 * @author ...
 */

package xpde.interpreter;
import js.Lib;
import xpde.compiler.JSCompiler;
import xpde.parser.AST;

class JSInterpreter 
{
	private var compiler:JSCompiler;

	public function new() 
	{
		// create new compiler
		compiler = new JSCompiler();
	}

	public function interpret(unit:CompilationUnit)
	{
		// compile javascript
		var source:String = compiler.compile(unit);
		// evaluate in global context
		Lib.eval(source);
		Lib.eval('window.sketch = new Sketch("pde"); window.sketch.main()');
	}
}