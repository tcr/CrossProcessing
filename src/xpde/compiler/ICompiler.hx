/**
 * ...
 * @author ...
 */

package xpde.compiler;

import xpde.parser.AST;
import xpde.Rtti;

interface ICompiler
{
	function compileClass(packageDeclaration:Array<String>, definition:ClassDefinition, ast:Hash<Statement>):Void;
//	function importClass(qualident:Array<String>, klass:Class):Void;
//[TODO] return Class?
//	function getClass(name:Array<String>):Dynamic;
}
