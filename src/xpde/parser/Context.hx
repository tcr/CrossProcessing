/**
 * ...
 * @author 
 */

package xpde.parser;

import xpde.JavaPackage;
import xpde.Rtti;
import xpde.parser.Parser;
import xpde.parser.AST;
import haxe.io.Input;

/*------------------------- modifier handling -----------------------------*/

class ModifierSet
{
	static public var none		= new EnumSet<Modifier>([]);
	static public var access	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate]);
	static public var classes	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MStatic, MFinal, MStrictfp]);
	static public var fields	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MStatic, MFinal, MTransient, MVolatile]);
	static public var methods	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MSynchronized, MNative, MStatic, MFinal, MStrictfp]);
	static public var constructors	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate]);
	static public var interfaces	= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MStatic, MStrictfp]);
	static public var constants	= new EnumSet<Modifier>([MPublic, MStatic, MFinal]);
	static public var all		= new EnumSet<Modifier>([MPublic, MProtected, MPrivate, MAbstract, MVolatile, MTransient, MSynchronized, MNative, MStatic, MFinal, MStrictfp]);
}

/*-------------------- expression building ----------------------------------*/

class OperationBuilder
{
	private var operators:Array<InfixOperator>;
	private var operands:Array<Expression>;
	
	public function new() {
		operators = [];
		operands = [];
	}
	
	public function operator(operator:InfixOperator)
	{
		reduce(lookupOperatorPrecedence(operator));
		operators.push(operator);
	}
	
	public function operand(operand:Expression)
	{
		operands.push(operand);
	}
	
	public function reduce(?precedence:Int = 0):Expression
	{
		while (operators.length > 0 && lookupOperatorPrecedence(operators[operators.length - 1]) >= precedence)
			reduceOperator(operators.pop());
		return operands[0];
	}

	private function reduceOperator(operator:InfixOperator):Void
	{
		var b:Expression = operands.pop(), a:Expression = operands.pop();
		operands.push(EInfixOperation(operator, a, b));
	}
	
// http://www.particle.kth.se/~lindsey/JavaCourse/Book/Part1/Java/Chapter02/operators.html

	private function lookupOperatorPrecedence(operator:InfixOperator):Int
	{
		return switch (operator)
		{
		    case OpOr: 3;
		    case OpAnd: 4;
		    case OpBitwiseOr: 5;
		    case OpBitwiseXor: 6;
		    case OpBitwiseAnd: 7;
		    case OpEqual, OpUnequal: 8;
		    case OpLessThan, OpLessThanOrEqual, OpGreaterThan, OpGreaterThanOrEqual: 9;
		    case OpLeftShift, OpRightShift, OpZeroRightShift: 10;
		    case OpAdd, OpSubtract: 11;
		    case OpMultiply, OpDivide, OpModulus: 12;
		}
	}
}

/*-------------------- compilation unit parsing -----------------------------------*/

class ParsedCompilationUnit implements CompilationUnit
{	
	// compilation unit interface
	public var identifier:String;
	public var dependencies:Array<Qualident>;
	public var types:Hash<TypeDefinition>;
	
	private var source:Input;
	
	public function new(identifier:String, source:Input)
	{
		// public
		this.identifier = identifier;
		dependencies = [];
		types = new Hash<TypeDefinition>();
		
		// private
		this.source = source;
		initialized = false;
	}
	
	private var initialized:Bool;
	public var ast:Hash<Statement>;
	
	public function initialize(rootPackage:JavaPackage)
	{
		// initialize once
		if (initialized) return;
		initialized = true;
		
		// create parsing context
		var context = new CompilationUnitContext(identifier);
		// scan and compile
		var scanner:Scanner = new Scanner(source);
		var parser:Parser = new Parser(scanner, context);
		parser.Parse();
		
		// validate package declaration
/*		try {
			if (rootPackage.getCompilationUnit(context.packageDeclaration.concat([identifier])) != this)
				throw false;
		} catch (e:Dynamic) {
			throw "incompatible package declaration " + context.packageDeclaration.join('.');
		}*/
		
		// parser second pass
		var resolver = new LexicalResolver(this);
		resolver.resolve(context, rootPackage);
		
		// save passed AST
		ast = context.ast;
	}
}

/*-------------------- parsing contexts ----------------------------------*/

class CompilationUnitContext
{
	public var identifier:String;
	public var packageDeclaration:Array<String>;
	public var imports:Array<Array<String>>;
	public var types:Array<TypeContext>;
	public var ast:Hash<Statement>;
	
	public function new(identifier:String)
	{
		this.identifier = identifier;
		packageDeclaration = [];
		imports = [];
		types = [];
		ast = new Hash<Statement>();
	}
}

interface TypeContext {
	public var identifier:String;
	public var extend:Qualident;
	public var implement:Array<Qualident>;
}

class ClassContext implements TypeContext
{
	// reference
	public var definition:ClassDefinition;

	// public
	public var identifier:String;
	public var modifiers:EnumSet<Modifier>;
	public var extend:Qualident;
	public var implement:Array<Qualident>;
	public var memberTypes:Hash<TypeContext>;
	public var fields:Hash<FieldContext>;
	public var methods:Array<MethodContext>; // array, because we can't resolve similar types until second pass
//[TODO] can we resolve similar types before second pass!?	

	// constructors
	public var staticConstructor:BlockContext;
	public var objectConstructor:BlockContext;
	
	// anonymous class uniqid
	public var anonClassID:Int;
	
	// owner class context
	public var ownerClass:ClassContext;

	public function new(modifiers:EnumSet<Modifier>, identifier:String, ?ownerClass:ClassContext)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.identifier = identifier;	
		implement = [];
		fields = new Hash<FieldContext>();
		memberTypes = new Hash<TypeContext>();
		methods = [];
		this.ownerClass = ownerClass;
		
		// constructors
		staticConstructor = new BlockContext();
		objectConstructor = new BlockContext();
		
		// anonymous class ID
		anonClassID = 0;
	}
	
	public function defineField(field:FieldContext)
	{
		// prevent redefinition
		if (fields.exists(field.identifier))
			throw "redeclaration of field " + field.identifier + " in class " + this.identifier;
		
		// add definition
		fields.set(field.identifier, field);
		if (field.initialization != null)
			field.modifiers.contains(MStatic) ?
			    staticConstructor.pushStatement(SExpression(EAssignment(field.identifier, ELexExpression(LReference(identifier)), field.initialization))) :
			    objectConstructor.pushStatement(SExpression(EAssignment(field.identifier, EThisReference, field.initialization)));
	}
	
	public function defineMethod(method:MethodContext)
	{
		// push definition
		//[NOTE] check for colliding definitions on second pass
		methods.push(method);
	}
	
	public function defineMemberType(type:TypeContext)
	{
		// prevent redefinition
		if (memberTypes.exists(type.identifier))
			throw "redeclaration of member type " + type.identifier + " in class " + this.identifier;
		memberTypes.set(type.identifier, type);
	}
}

class MethodContext implements DefinesLocalVariables
{
	// typedef: MethodDefinition
	public var identifier:String;
	public var type:Null<DataType>;
	public var modifiers:EnumSet<Modifier>;
	public var throwsList:Array<Qualident>;
	public var parameters:Array<FormalParameter>;
	
	// method body
	public var body:Statement;
	
	public function new(modifiers:EnumSet<Modifier>, type:Null<DataType>, identifier:String)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.type = type;
		this.identifier = identifier;
		throwsList = [];
		parameters = [];
	}
	
	public function isVariableDefined(identifier:String):Bool
	{
		for (param in parameters)
			if (param.identifier == identifier)
				return true;
		return false;
	}
}

class FieldContext
{
	public var identifier:String;
	public var type:Null<DataType>;
	public var modifiers:EnumSet<Modifier>;
	public var initialization:Expression;
	
	public function new(modifiers:EnumSet<Modifier>, type:Null<DataType>, identifier:String)
	{
		// definition defaults
		this.modifiers = modifiers;
		this.type = type;
		this.identifier = identifier;
	}
	
	public function getDefinition():FieldDefinition
	{
		return { modifiers: modifiers, type: type, identifier: identifier };
	}
}

interface DefinesLocalVariables
{
	function isVariableDefined(identifier:String):Bool;
}

class BlockContext implements DefinesLocalVariables
{
	public var statements(default, null):Array<Statement>;
	public var variables:Hash<FieldDefinition>;
//	public var types:Hash<Qualident>;
	
	public function pushStatement(statement:Statement)
	{
		statements.push(statement);
	}
	
	private var parent:DefinesLocalVariables;
	
	public function new(?parent:DefinesLocalVariables)
	{
		this.parent = parent;
		statements = [];
		variables = new Hash<FieldDefinition>();
//		types = new Hash<Qualident>();
	}
	
	public function getBlockStatement():Statement
	{
		return SBlock(variables, statements);
	}
	
	public function isVariableDefined(identifier:String):Bool
	{
		return variables.exists(identifier) || (parent != null ? parent.isVariableDefined(identifier) : false);
	}
	
	public function defineVariable(variable:FieldContext)
	{
		// prevent redefinition
		if (isVariableDefined(variable.identifier))
			throw "redeclaration of variable " + variable.identifier + " in block scope";
		
		// add definition
		variables.set(variable.identifier, variable.getDefinition());
		// add definition
		if (variable.initialization != null)
			pushStatement(SExpression(ELocalAssignment(variable.identifier, variable.initialization)));
	}
}

/*-------------------- lexical resolution (second pass) ----------------------------------*/

class LexicalResolver
{
	private var unit:ParsedCompilationUnit;
	
	public function new(unit:ParsedCompilationUnit)
	{
		this.unit = unit;
		qualifiers = new Hash<Qualident>();
		imports = new Hash<Qualident>();
		classPrefix = '';
	}
	
	/* imports */
	
	private var qualifiers:Hash<Qualident>;
	
	function qualifyDataType(?type:DataType):DataType
	{
		if (type == null)
			return null;
		return switch (type) {
		    case DTPrimitive(_):
			type;
		    case DTPrimitiveArray(_, _):
			type;
		    case DTReference(qualident):
			DTReference(qualifyReference(qualident));
		    case DTReferenceArray(qualident, dimensions):
			DTReferenceArray(qualifyReference(qualident), dimensions);
		}
	}
	
	function addDependency(qualident:Qualident)
	{
		// add dependency
		unit.dependencies.push(qualident);
		// initialize
		(cast(rootPackage.getByQualident(qualident), CompilationUnit)).initialize(rootPackage);
	}
	
	function qualifyReference(qualident:Qualident):Qualident
	{
		if (qualident == null)
			return null;
		
//[TODO] ensure this order is correct
		// check qualifier map
		if (qualifiers.exists(qualident[0]))
			return qualifiers.get(qualident[0]).concat(qualident.slice(1));
			
		// check potenital imports
		if (imports.exists(qualident[0]))
		{
			// add dependency
			addDependency(imports.get(qualident[0]));
			// add lookup
			qualifiers.set(qualident[0], imports.get(qualident[0]));
			// return qualifier
			return imports.get(qualident[0]);
		}
		
		// ensure type exists (or throw exception)
		rootPackage.getByQualident(qualident);
		// add dependency
		addDependency(qualident);
		// return qualifier
		return qualident;
	}
	
	private var imports:Hash<Qualident>;
	
	function loadImports()
	{
		for (ident in context.imports)
		{
			// check ident type
			if (ident[ident.length - 1] != '*')
			{
				// check that the compilation unit exists
				if (!Std.is(rootPackage.getByQualident(ident.slice(0, -1)), CompilationUnit))
					return;
				imports.set(ident[ident.length - 1], ident);
			}
			else
			{
				// iterate namespace
				try {
					var importPackage = cast(rootPackage.getByQualident(ident.slice(0, -1)), JavaPackage);
					for (item in importPackage.contents.keys())
						if (Std.is(importPackage.contents.get(item), CompilationUnit))
							imports.set(item, ident.slice(0, -1).concat([item]));
				}
				catch (e:Dynamic) { }
			}
		}
	}
	
	/* resolvers */
	
	private var context:CompilationUnitContext;
	private var rootPackage:JavaPackage;
	
	public function resolve(context:CompilationUnitContext, rootPackage:JavaPackage)
	{
		// private variables
		this.context = context;
		this.rootPackage = rootPackage;
		
		// add top-level type qualifiers
		for (type in context.types)
			qualifiers.set(type.identifier, context.packageDeclaration.concat([type.identifier]));
		// generate definitions
		for (type in context.types)
			addTypeDefinition(type);

//[TODO] we could find competing method names here; better, when definitions are generated!
				
		// lexical resolution
		for (type in context.types)
			if (Std.is(type, ClassContext))
				resolveClass(context, cast(type, ClassContext));
	}
	
	var classPrefix:String;
	
	function addTypeDefinition(type:TypeContext)
	{
		// class definition
		if (Std.is(type, ClassContext))
		{
			// cast class type
			var classType:ClassContext = untyped type;
			
			// add type definition
			unit.types.set(type.identifier, TClass(generateClassDefinition(classType)));
			// add member types
			var tmpClassPrefix = classPrefix;
			classPrefix += type.identifier + '$';
			for (memberType in classType.memberTypes)
				addTypeDefinition(memberType);
			classPrefix = tmpClassPrefix;
		}
//		else
//			unit.types.set(type.identifier, TClass(generateClassDefinition(cast(type, ClassContext))));
	}
	
	function generateClassDefinition(type:ClassContext):ClassDefinition 
	{
		var tmpQualifiers = qualifiers;
		
		var definition = {
		    identifier: classPrefix + type.identifier,
		    modifiers: type.modifiers,
		    fields: new Hash<FieldDefinition>(),
		    methods: new Hash<MethodDefinition>(),
		    types: new Hash<String>(),
		    extend: qualifyReference(type.extend),
		    implement: [],
		};
		if (type.implement != null)
			for (dt in type.implement)
				definition.implement.push(qualifyReference(dt));
		for (type in type.memberTypes) {
			definition.types.set(type.identifier, classPrefix + type.identifier + '$' + type.identifier);
//[TODO] unit.getQualifiedReference(type.identifier)
			qualifiers.set(type.identifier, [definition.types.get(type.identifier)]);
		}
		for (field in type.fields)
			definition.fields.set(field.identifier, generateFieldDefinition(field));
		for (method in type.methods)
			definition.methods.set(method.identifier, generateMethodDefinition(method));
		type.definition = definition;
		
		// restore qualifier list
		qualifiers = tmpQualifiers;
		
		return definition;
	}
	
	function generateFieldDefinition(field:FieldContext):FieldDefinition
	{
		return {
		    identifier: field.identifier,
		    modifiers: field.modifiers,
		    type: qualifyDataType(field.type)
		};
	}
	
	function generateMethodDefinition(method:MethodContext):MethodDefinition
	{
		var definition = {
		    identifier: method.identifier,
		    type: qualifyDataType(method.type),
		    modifiers: method.modifiers,
		    throwsList: [],
		    parameters: [],
		};
		if (method.throwsList != null)
			for (qualident in method.throwsList)
				definition.throwsList.push(qualifyReference(qualident));
		for (param in method.parameters)
			definition.parameters.push(generateFormalParameter(param));
		return definition;
	}
	
	function generateFormalParameter(param:FormalParameter)
	{
		return {
		    identifier: param.identifier,
		    type: qualifyDataType(param.type),
		    modifiers: param.modifiers
		};
	}
	
	/* lexical resolution */
	
	var methods:Hash<MethodDefinition>;
	var fields:Hash<FieldDefinition>;
	var memberTypes:Hash<String>;
	
	function initializeResolvers(definition:ClassDefinition)
	{
		if (definition.extend != null)
			initializeResolvers(rootPackage.getClass(definition.extend));
		for (method in definition.methods)
			methods.set(method.identifier, method);
		for (field in definition.fields)
			fields.set(field.identifier, field);
		for (type in definition.types.keys())
//[TODO] this should be recursive descent, compounding all member types of parents &c.
			memberTypes.set(type, definition.types.get(type));
	}
	
	function resolveClass(context:CompilationUnitContext, classContext:ClassContext)
	{
		// initialize resolvers
		methods = new Hash<MethodDefinition>();
		fields = new Hash<FieldDefinition>();
		memberTypes = new Hash<String>();
		// walk inheritance tree
		initializeResolvers(classContext.definition);
		
		// resolve method bodies
		for (methodContext in classContext.methods)
		{
			if (methodContext.body != null)
			{
				context.ast.set(context.packageDeclaration.concat([classContext.identifier]).join('.') + '|' + methodContext.identifier, resolveStatement(methodContext.body));
			}
		}
//		resolveStatement(classContext.staticConstructor.getBlockStatement());
//		resolveStatement(classContext.objectConstructor.getBlockStatement());
	}

	function resolveStatement(statement:Statement):Statement
	{
		if (statement == null)
			return null;
		
		return switch (statement)
		{
		    case SBlock(variables, statements):
			var v = new Hash<FieldDefinition>();
			for (key in variables.keys()) {
				var variable = variables.get(key);
				v.set(key, { identifier: variable.identifier, type: resolveLexicalDataType(variable.type), modifiers: variable.modifiers } );
			}
			var s = new Array<Statement>();
			for (statement in statements)
				s.push(resolveStatement(statement));
			SBlock(v, s);
				
		    case SBreak(_):
			statement;
		    
		    case SConditional(condition, thenBlock, elseBlock):
			SConditional(resolveExpression(condition), resolveStatement(thenBlock), resolveStatement(elseBlock));
				
		    case SContinue(_):
			statement;
		    
		    case SExpression(expression):
			SExpression(resolveExpression(expression));
		    
		    case SLabel(label, body):
			SLabel(label, resolveStatement(body));
			
		    case SLoop(condition, body, doLoop):
			SLoop(resolveExpression(condition), resolveStatement(body), doLoop);
			
		    case SReturn(value):
			SReturn(resolveExpression(value));
				
		    case SThrow(expression):
			SThrow(resolveExpression(expression));
			
		    case STry(body, catches, finallyBody):
			for (catchBlock in catches)
				catchBlock.body = resolveStatement(catchBlock.body);
			STry(resolveStatement(body), catches, resolveStatement(finallyBody));
		}
	}
	
	function eArr(arr:Array<Expression>):Array<Expression>
	{
		var n = new Array<Expression>();
		for (e in arr)
			n.push(resolveExpression(e));
		return n;
	}
	
	function resolveExpression(expression):Expression
	{
		if (expression == null)
			return null;
			
		return switch (expression)
		{
		    // instantiation
		    case EArrayInstantiation(type, sizes):
			EArrayInstantiation(resolveLexicalDataType(type), eArr(sizes));
				
		    case EObjectInstantiation(type, args):
			EObjectInstantiation(resolveQualifiedReference(type), eArr(args));
		
		    // control
		    case EConditional(condition, trueExp, falseExp):
			EConditional(resolveExpression(condition), resolveExpression(trueExp), resolveExpression(falseExp));
			
		    // references
		    case EArrayAccess(index, base):
			EArrayAccess(resolveExpression(index), resolveExpression(base));
			
		    case ELocalReference(_): expression;
		    
		    case EReference(identifier, base):
			EReference(identifier, resolveExpression(base));
			
		    case EQualifiedReference(_): expression;
		    case ESuperReference: expression;
		    case EThisReference: expression;
		    
		    // calling
		    case ECall(identifier, base, args):
			ECall(identifier, resolveExpression(base), eArr(args));
				
		    case EThisCall(args):
			EThisCall(eArr(args));
			
		    case ESuperCall(args):
			ESuperCall(eArr(args));
			
		    // assignment
		    case EArrayAssignment(index, base, value):
			EArrayAssignment(resolveExpression(index), resolveExpression(base), resolveExpression(value));
			
		    case EAssignment(identifier, base, value):
			EAssignment(identifier, resolveExpression(base), resolveExpression(value));
			
		    case ELocalAssignment(identifier, value):
			ELocalAssignment(identifier, resolveExpression(value));
			
		    // operations
		    case ECast(type, value):
			ECast(resolveLexicalDataType(type), resolveExpression(value));
			
		    case EPrefixOperation(type, reference):
			EPrefixOperation(type, resolveExpression(reference));
			
		    case EInfixOperation(type, left, right):
			EInfixOperation(type, resolveExpression(left), resolveExpression(right));
			
		    case EInstanceOf(expression, type):
			EInstanceOf(resolveExpression(expression), resolveLexicalDataType(type));
			
		    case EPrefix(type, reference):
			EPrefix(type, resolveExpression(reference));
			
		    case EPostfix(type, reference):
			EPostfix(type, resolveExpression(reference));
		
		    // literals
		    case EArrayLiteral(values):
			EArrayLiteral(eArr(values));
				
		    case EStringLiteral(_): expression;
		    case EIntegerLiteral(_): expression;
		    case EFloatLiteral(_): expression;
		    case ECharLiteral(_): expression;
		    case EBooleanLiteral(_): expression;
		    case ENull: expression;
		
		    // second pass
		    case ELexExpression(expression):
			switch (expression) {
			    case LReference(identifier): resolveLexicalReference(identifier);
			    case LCall(identifier, args): resolveLexicalCall(identifier, args);
			    case LAssignment(identifier, value): resolveLexicalAssignment(identifier, value);
			}
		}
	}
	
	/* lexical resolution */
	
//TODO:
// resolve class fields to this.variable accessors
// resolve inner class variables to accessors
// resolve types to qualified references, add dependencies
	
	public function resolveLexicalReference(identifier:String):Expression
	{
		// class fields
		if (fields.exists(identifier))
			return EReference(identifier, EThisReference);

		// no variable found
		throw 'reference to nonexistant variable "' + identifier + '"';
	}
	
	public function resolveLexicalAssignment(identifier:String, value:Expression):Expression
	{
		// class fields
		if (fields.exists(identifier))
			return EAssignment(identifier, EThisReference, value);
			
		// no variable found
		throw 'assignment to nonexistant variable "' + identifier + '"';
	}
	
	public function resolveLexicalCall(identifier:String, args:Array<Expression>):Expression
	{
		// class methods
		if (methods.exists(identifier))
			return ECall(identifier, EThisReference, args);
			
		// no method found
		throw 'call to nonexistant method "' + identifier + '"';
	}
	
	function resolveLexicalDataType(?type:DataType):DataType
	{
		if (type == null)
			return null;
		return switch (type) {
		    case DTPrimitive(_):
			type;
		    case DTPrimitiveArray(_, _):
			type;
		    case DTReference(qualident):
			DTReference(resolveQualifiedReference(qualident));
		    case DTReferenceArray(qualident, dimensions):
			DTReferenceArray(resolveQualifiedReference(qualident), dimensions);
		}
	}
	
	function resolveQualifiedReference(?qualident:Qualident):Qualident
	{
		if (qualident == null)
			return null;
		if (qualident.length == 0 && memberTypes.exists(qualident[0]))
//[TODO] return unit.getQualifiedReference(qualident[0])
			return [memberTypes.get(qualident[0])];
		return qualifyReference(qualident);
	}
	
/* unit-level lexical resolution 
	
	public function resolveLexicalType(identifier:String):DataType
	{
		// only qualified references should get this far
		if (!importMap.exists(identifier))
			throw "reference to undeclared type " + identifier;
		// add to dependencies map
		unit.dependencies.push(importMap.get(identifier));
		// return datatype
		return DTReference(importMap.get(identifier));
	}
	
	public function resolveLexicalGetter(identifier:String):Expression
	{
		// check for a qualified reference
		if (!importMap.exists(identifier))
			return ELexReference(identifier);
		// add to dependencies map
		unit.dependencies.push(importMap.get(identifier));
		// return expression
		return EQualifiedReference(importMap.get(identifier));
	}
	
	public function resolveLexicalSetter(identifier:String, value:Expression):Expression
	{
		// lexical setter
		return ELexAssignment(identifier, value);
	}*/
}
