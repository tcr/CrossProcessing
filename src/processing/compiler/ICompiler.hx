/**
 * ...
 * @author ...
 */

package processing.compiler;

import processing.parser.Statement;

interface ICompiler
{
	public function compile(code:Statement):Dynamic;
}