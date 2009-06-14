package
{
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.system.ApplicationDomain;
	import flash.system.LoaderContext;
	import flash.utils.ByteArray;
	import flash.utils.getTimer;
	
	import it.sephiroth.expr.CompiledExpression;
	import it.sephiroth.expr.Parser;
	import it.sephiroth.expr.Scanner;
	
	public class Test extends Sprite
	{
		private static const ITERATIONS: int = 1000000;
		
		public function Test()
		{
			super();
			
			runEvalTest( ITERATIONS );
			runCompileTest( ITERATIONS );
			runNativeTest( ITERATIONS );
		}
		
		private function runEvalTest( c: int ): void
		{
			var expression: String = "sin( x / ( 4 / 2 * 2 - 2 + 2 * x / x ) ) * 100";
			var scanner: Scanner = new Scanner( expression );
			var parser: Parser = new Parser( scanner );
			
			var compiled: CompiledExpression = parser.parse();
			
			var context: Object = {
				x:		10,
				sin: 	Math.sin
			};
			
			var t: Number = getTimer();
			
			for( var i: int = 0; i < c; ++i )
			{
				compiled.execute( context );
			}
			
			trace( "eval", c, "iterations:", getTimer() - t );
		}
		
		private function runCompileTest( c: int ): void
		{
			var expression: String = "sin( x / ( 4 / 2 * 2 - 2 + 2 * x / x ) ) * 100";
			var scanner: Scanner = new Scanner( expression );
			var parser: Parser = new Parser( scanner );
			
			var compiled: CompiledExpression = parser.parse();
			
			var data: ByteArray = compiled.compile();
			var loader: Loader = new Loader();
			
			loader.contentLoaderInfo.addEventListener( Event.COMPLETE, function( event: Event ): void
			{
				var info: LoaderInfo = ( event.target as LoaderInfo );
				var klass: Class = ( info.applicationDomain.getDefinition( "CompiledExpression" ) as Class );
				
				var cp: Object = new klass();
					
				cp.x = 10;
				cp.sin = Math.sin;
				
				var t: Number = getTimer();
				
				for( var i: int = 0; i < c; ++i )
				{
					cp.execute();
				}
				
				trace( "compiled", c, "iterations:", getTimer() - t );
				
			} );
			
			loader.loadBytes( data, new LoaderContext( false, new ApplicationDomain( ApplicationDomain.currentDomain ) ) );
		}
		
		private function runNativeTest( c: int ): void
		{
			var x: int = 10;
			var sin: Function = Math.sin;
			
			var t: Number = getTimer();
				
			for( var i: int = 0; i < c; ++i )
			{
				var l: int = sin( x / ( 4 / 2 * 2 - 2 + 2 * x / x ) ) * 100;
			}
			
			trace( "native", c, "iterations:", getTimer() - t );
			
		}
	}
}
