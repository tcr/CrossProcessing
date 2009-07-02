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
	DTPrimitiveArray(type:PrimitiveType, dimensions:Int);
	DTReferenceArray(qualident:Qualident, dimensions:Int);
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

enum TypeDefinition
{
	TClass(definition:ClassDefinition);
	TInterface(definition:InterfaceDefinition);
}

typedef InterfaceDefinition = {
	var identifier:String;	
};

typedef ClassDefinition = {
	var identifier:String;
	var modifiers:EnumSet<Modifier>;
	var fields:Hash<FieldDefinition>;
	var methods:Hash<MethodDefinition>;
	var extend:Null<Qualident>;
	var implement:Array<Qualident>;
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
