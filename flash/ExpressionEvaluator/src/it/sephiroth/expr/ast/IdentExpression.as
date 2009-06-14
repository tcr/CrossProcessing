package it.sephiroth.expr.ast
{
	import hxasm.OpCode;
	
	import it.sephiroth.expr.Ident;
	import it.sephiroth.expr.SWFContext;
	
	public class IdentExpression implements IExpression
	{
		private var _value: Ident;
		
		public function IdentExpression( value: Ident )
		{
			_value = value;
		}
		
		public function evaluate(): Number
		{
			return _value.value;
		}
		
		public function toString(): String
		{
			return "" + _value;
		}
		
		public function compile( c: SWFContext ): void
		{
			c.ctx.op( OpCode.OReg( c.getReg( _value.id ) ) );
			
			c.addStack( 1 );
		}

	}
}