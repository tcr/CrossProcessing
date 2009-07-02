/**
 * ...
 * @author 
 */

package xpde;

import xpde.Rtti;

class JavaPackage implements JavaPackageItem
{
	public var contents(default, null):Hash<JavaPackageItem>;
	
	public function new()
	{
		contents = new Hash<JavaPackageItem>();
	}
	
	public function addCompilationUnit(qualident:Qualident, unit:CompilationUnit)
	{
		if (qualident.length == 1)
			if (contents.exists(qualident[0]))
				throw "redefinition of " + qualident.join('.');
			else
				contents.set(qualident[0], unit);
		else {
			if (contents.exists(qualident[0]) && !Std.is(contents.get(qualident[0]), JavaPackage))
				throw qualident.join('.') + " is not a package";
			else if (!contents.exists(qualident[0]))
				contents.set(qualident[0], new JavaPackage());
			(cast(contents.get(qualident[0]), JavaPackage)).addCompilationUnit(qualident.slice(1), unit);
		}
	}
	
	public function getByQualident(qualident:Qualident):JavaPackageItem
	{
		try {
			if (!contents.exists(qualident[0]))
				throw false;
			if (qualident.length == 1)
				return contents.get(qualident[0]);
			else
				return cast(contents.get(qualident[0]), JavaPackage).getByQualident(qualident.slice(1));
			
		} catch (e:Dynamic)
		{
			throw "invalid qualified reference " + qualident.join('.');
		}
	}
}

interface JavaPackageItem { }

interface CompilationUnit implements JavaPackageItem
{
	var packageDeclaration(default, null):Qualident;
	var dependencies(default, null):Array<Qualident>;
	var types(default, null):Array<TypeDefinition>;
	function initialize(rootPackage:JavaPackage):Void;
//	function compile(compiler:ICompiler):Void;
}
