package ;

import haxe.io.StringInput;
import haxe.Serializer;
import js.Lib;
import xpde.core.PApplet;
import xpde.Rtti;
//import xpde.compiler.JSCompiler;
//import xpde.interpreter.JSInterpreter;

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
/*		var scanner:Scanner = new Scanner(new StringInput(getSource()));
		var parser:Parser = new Parser(scanner);
		parser.Parse();
		
		var compiler = new JSCompiler();
		trace(compiler.compile(program.getCompilationUnit('Sketch')));
		trace('#DONE#');*/
	}
	
	static function interpret()
	{
		// initialize root packages
		var rootPackage = new JavaPackage();
		new ParsedCompilationUnit(rootPackage, ['xpde', 'core', 'PApplet'], new StringInput(PApplet.__javartti__));
		
		// initialize main sketch
		var sketch:CompilationUnit = new ParsedCompilationUnit(rootPackage, ['Sketch'], new StringInput(getSource()));
		sketch.initialize();
		
		// compile main sketch
//		var interpreter:IInterpreter = new JSInterpreter();
//		interpreter.interpret(rootPackage, ['Sketch']);
		
/*		var a:ClassDefinition = {
		    identifier: 'PApplet',
		    modifiers: new EnumSet<Modifier>([MPublic]),
		    fields: new Hash<FieldDefinition>(),
		    methods: {
			var methods = new Hash<MethodDefinition>();
			methods.set('size', {
			    identifier: 'size',
			    type: null,
			    modifiers: new EnumSet<Modifier>(),
			    throwsList: new Array<Qualident>(),
			    parameters: [{identifier: 'width', type: DTPrimitive(PTInt), modifiers: new EnumSet<Modifier>()}, {identifier: 'height', type: DTPrimitive(PTInt), modifiers: new EnumSet<Modifier>()}]
			});
		        methods; },
		    extend: null,
		    implement: []
		};
		var serializer = new Serializer();
		serializer.serialize(a);
		trace(serializer);*/
		
/*		var scanner:Scanner = new Scanner(new StringInput(getSource()));
		var parser:Parser = new Parser(scanner);
		var program:PdeProgram = parser.Parse();
		
		var interpreter = new JSInterpreter();
		interpreter.interpret(program.getCompilationUnit('Sketch'));*/
	}
}
