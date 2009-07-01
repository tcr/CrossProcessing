/**
 * ...
 * @author ...
 */

package xpde.compiler;

import xpde.parser.AST;
import xpde.parser.Parser;

interface ICompiler
{
	function compileClass(packageDefinition:Array<String>, definition:ClassDefinition):Void;
	function importClass(qualident:Array<String>):Void;
//[TODO] return Class
	function getClass(name:Array<String>):Dynamic;
}
