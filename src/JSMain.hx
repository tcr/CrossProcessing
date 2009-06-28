package ;

import haxe.io.StringInput;
import js.Lib;
import xpde.compiler.JSCompiler;
import xpde.interpreter.JSInterpreter;

import xpde.parser.Parser;
import xpde.parser.Scanner;

/**
 * ...
 * @author 
 */

class JSMain 
{
	static function main() 
	{
	}
	
	static function getSource():String
	{
		return untyped js.Lib.document.getElementById('script').value;
	}
	
	static function compile()
	{
		var scanner:Scanner = new Scanner(new StringInput(getSource()));
		var parser:Parser = new Parser(scanner);
		var program:PdeProgram = parser.Parse();
		
		var compiler = new JSCompiler();
		trace(compiler.compile(program.getCompilationUnit('Sketch')));
		trace('#DONE#');
	}
	
	static function interpret()
	{
		var scanner:Scanner = new Scanner(new StringInput(getSource()));
		var parser:Parser = new Parser(scanner);
		var program:PdeProgram = parser.Parse();
		
		var interpreter = new JSInterpreter();
		interpreter.interpret(program.getCompilationUnit('Sketch'));
	}
}
