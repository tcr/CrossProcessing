/**
 * ...
 * @author 
 */

package xpde;

import xpde.Rtti;

interface JavaPackageItem {
	var identifier:String;
}

/*

class JavaPackage extends Hash<JavaPackageItem>, implements JavaPackageItem
{
	
}

*/

class JavaPackage implements JavaPackageItem
{
	public var identifier:String;
	public var contents(default, null):Hash<JavaPackageItem>;
	
	public function new(?identifier:String)
	{
		this.identifier = identifier;
		contents = new Hash<JavaPackageItem>();
	}
	
	public function addCompilationUnit(pack:Array<String>, unit:CompilationUnit)
	{
		if (pack.length == 0)
			if (contents.exists(unit.identifier))
				throw "redefinition of " + unit.identifier;
			else
				contents.set(unit.identifier, unit);
		else {
			if (contents.exists(pack[0]) && !Std.is(contents.get(pack[0]), JavaPackage))
				throw pack.join('.') + " is not a package";
			else if (!contents.exists(pack[0]))
				contents.set(pack[0], new JavaPackage(pack[0]));
			(cast(contents.get(pack[0]), JavaPackage)).addCompilationUnit(pack.slice(1), unit);
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
	
	public function getCompilationUnit(qualident:Qualident):CompilationUnit
	{
		try {
			return cast(getByQualident(qualident), CompilationUnit);
		} catch (e:Dynamic) {
			throw "invalid compilation unit " + qualident.join('.');
		}
	}
	
	public function getClass(qualident:Qualident):ClassDefinition
	{
		var type = getCompilationUnit(qualident).types.get(qualident[qualident.length - 1]);
		switch (type) {
		    case TClass(definition): return definition;
		    default: throw "invalid class name " + qualident.join('.');
		}
	}
}

interface CompilationUnit implements JavaPackageItem
{
	var identifier:String;
	var dependencies:Array<Qualident>;
	var types:Hash<TypeDefinition>;
	function initialize(rootPackage:JavaPackage):Void;
//	function compile(compiler:ICompiler):Void;
}
