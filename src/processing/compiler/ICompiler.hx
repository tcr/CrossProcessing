/**
 * ...
 * @author ...
 */

package processing.compiler;

import processing.parser.Syntax;

interface ICompiler
{
	public function compile(script:Definition):Dynamic;
}