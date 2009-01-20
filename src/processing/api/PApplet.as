package processing.api {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.events.MouseEvent;
	import flash.events.KeyboardEvent;
	import flash.events.Event;
	import processing.api.PGraphics;
	import processing.parser.ExecutionContext;
	import flash.net.URLRequest;
	import flash.display.Loader;

	public class PApplet extends Bitmap {
		public var graphics:PGraphics;
		public var context:ExecutionContext;

		public function PApplet() {
			// create main graphics object
			graphics = new PGraphics(100, 100, this);

			// create evaluation context
			context = new ExecutionContext(
			    {
				Math: PMath,
				ArrayList: ArrayList,
				AniSprite: AniSprite,
				pmouseX: 0,
				pmouseY: 0,
				mouseX: 0,
				mouseY: 0
			    }, new ExecutionContext(PMath, new ExecutionContext(graphics)));
			    
			// initialize images array
			images = {};
		}
		
		public function start():void {
			// attach event listeners
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
		
			// setup function
			if (context.scope.setup)
			{
				context.scope.setup();
			}

			// draw function
			if (context.scope.draw)
			{
				redrawFrame();
			}
		}
		
		public function stop():void {
			// remove event listeners
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			stage.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.removeEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			stage.removeEventListener(KeyboardEvent.KEY_UP, onKeyUp);
			removeEventListener(Event.ENTER_FRAME, onEnterFrame);
		}
		
		private var isMousePressed:Boolean = false;

		private function onMouseMove( e:MouseEvent )
		{
			context.scope.pmouseX = context.scope.mouseX;
			context.scope.pmouseY = context.scope.mouseY;
			context.scope.mouseX = mouseX;
			context.scope.mouseY = mouseY;

			if ( typeof context.scope.mouseMoved == "function" )
			{
				context.scope.mouseMoved();
			}
			if ( isMousePressed && typeof context.scope.mouseDragged == "function" )
			{
				context.scope.mouseDragged();
			}			
		}
		
		private function onMouseDown( e:MouseEvent )
		{
			isMousePressed = true;
		
			if ( typeof context.scope.mousePressed == "function" )
			{
				context.scope.mousePressed();
			}
			else
//[TODO] do this with var/function differences
			{
				context.scope.mousePressed = true;
			}
		}
		
		private function onMouseUp( e:MouseEvent )
		{
			isMousePressed = false;
		
			if ( typeof context.scope.mouseReleased == "function" )
			{
				context.scope.mouseReleased();
			}
			
			if ( typeof context.scope.mousePressed != "function" )
			{
				context.scope.mousePressed = false;
			}
		}
		
		private var isKeyDown:Boolean = false;
		
		private function onKeyDown( e:KeyboardEvent )
		{
			isKeyDown = true;

			context.scope.key = e.keyCode + 32;

			if ( e.shiftKey )
			{
				context.scope.key = String.fromCharCode(context.scope.key).toUpperCase().charCodeAt(0);
			}

			if ( typeof context.scope.keyPressed == "function" )
			{
				context.scope.keyPressed();
			}
			else
			{
				context.scope.keyPressed = true;
			}
		}
		
		private function onKeyUp( e:KeyboardEvent )
		{
			isKeyDown = false;

			if ( typeof context.scope.keyPressed != "function" )
			{
				context.scope.keyPressed = false;
			}

			if ( typeof context.scope.keyReleased == "function" )
			{
				context.scope.keyReleased();
			}
		}

		public var enableLoop:Boolean = true;

		private function onEnterFrame( e:Event )
		{
			if (enableLoop && context.scope.draw)
			{
				redrawFrame();
			}
		}

		public function redrawFrame():void {
			// begin drawing
			graphics.beginDraw()
			graphics.pushMatrix();
			// call user-defined draw functon
			context.scope.draw();
			// end drawing
			graphics.popMatrix();
			graphics.endDraw();
		}
		
		// image reference object
		private var images:Object;
		
		public function loadImage(path:String, image:BitmapData):void {
			images[path] = image;
		}
		
		public function getImage(path:String):BitmapData {
			return images[path];
		}
	}
}