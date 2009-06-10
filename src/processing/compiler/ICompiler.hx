/**
 * ...
 * @author ...
 */

package processing.compiler;

import processing.parser.Syntax;

interface ICompiler
{
	public function compile(code:Statement):Dynamic;
}