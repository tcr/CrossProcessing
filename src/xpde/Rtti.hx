/**
 * Java Runtime type informations
 * @author 
 */

package xpde;

import xpde.parser.Parser;

/* types */

enum DataType
{
	DTPrimitive(type:PrimitiveType);
	DTReference(qualident:Qualident);
	DTArray(type:DataType, dimensions:Int);	//[TODO] disallow DTArray in datatype (or make cumulation an innate part of its notation?)
	
	// second pass
	DTLexReference(qualident:Qualident);
}

typedef Qualident = Array<String>;

enum PrimitiveType
{
	PTByte;
	PTShort;
	PTInt;
	PTLong;
	PTFloat;
	PTDouble;
	PTChar;
	PTBoolean;
}

/* access modifiers */

enum Modifier {
	MPublic;
	MPrivate;
	MProtected;
	MStatic;
	MFinal;
	MSynchronized;
	MVolatile;
	MTransient;
	MNative;
	MAbstract;
	MStrictfp;
}

/* definitions */

enum TopLevelDefinition
{
	DClass(definition:ClassDefinition);
//	DInterface(identifier:String, modifiers:EnumSet<Modifier>, definitions:Array<Definition>, ?extend:DataType, ?implement:Array<DataType>, ?clinit:Statement, ?init:Statement);
}

typedef ClassDefinition = {
	var identifier:String;
	var modifiers:EnumSet<Modifier>;
	var fields:Hash<FieldDefinition>;
	var methods:Hash<MethodDefinition>;
	var extend:Null<DataType>;
	var implement:Array<DataType>;
};

typedef FieldDefinition = {
	var identifier:String;
	var type:DataType;
	var modifiers:EnumSet<Modifier>;
};

typedef MethodDefinition = {
	var identifier:String;
	var type:Null<DataType>;
	var modifiers:EnumSet<Modifier>;
	var throwsList:Array<Qualident>;
	var parameters:Array<FormalParameter>;
};

typedef FormalParameter = {
	var identifier:String;
	var type:DataType;
	var modifiers:EnumSet<Modifier>;
}
