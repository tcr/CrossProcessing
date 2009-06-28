package processing.api {
	import processing.parser.ExecutionContext;
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import flash.display.BitmapData;
	import flash.display.Shape;
	import flash.display.CapsStyle;
	import flash.display.StageQuality;
	import flash.geom.Rectangle;
	import flash.geom.Matrix;
	import flash.events.Event;
	import flash.geom.Point;

	public class PGraphics extends PImage {
		// applet object
		public var applet:PApplet;
		
		// constructor
		public function PGraphics(w:int, h:int, a:PApplet = null):void {			
			// call super
			super(w, h);
			// save applet reference
			applet = a;

			// initialize state variables
			start = (new Date).getTime();
		}
	
		// drawing constants
		public const PI = Math.PI;
		public const TWO_PI = 2 * Math.PI;
		public const HALF_PI = Math.PI / 2;
		public const P2D = 2;
		public const P3D = 3;
		public const CORNER = 0;
		public const RADIUS = 1;
		public const CENTER_RADIUS = 1;
		public const CENTER = 2;
		public const POLYGON = 2;
		public const QUADS = 5;
		public const TRIANGLES = 6;
		public const POINTS = 7;
		public const LINES = 8;
		public const TRIANGLE_STRIP = 9;
		public const TRIANGLE_FAN = 4;
		public const QUAD_STRIP = 3;
		public const CORNERS = 10;
		public const CLOSE = true;
		public const RGB = 1;
		public const HSB = 2;

		// private state variables
		private var hasBackground:Boolean = false;
		private var curRectMode:Number = CORNER;
		private var curEllipseMode:Number = CENTER;
		private var curBackground:*;
		private var curShape:Number = POLYGON;
		private var curShapeCount:Number = 0;
		private var opacityRange:Number = 255;
		private var redRange:Number = 255;
		private var greenRange:Number = 255;
		private var blueRange:Number = 255;
		private var pathOpen:Boolean = false;
		private var mousePressed:Boolean = false;
		private var keyPressed:Boolean = false;
		private var firstX:Number, firstY:Number;
		private var secondX:Number, secondY:Number;
		private var prevX:Number, prevY:Number;
		private var curColorMode:Number = RGB;
		private var curTint:Number = -1;
		private var curTextSize:Number = 12;
		private var curTextFont:String = 'Arial';
		private var getLoaded;

		// stroke
		private var doStroke:Boolean = true;
		private var curStrokeWeight:Number = 1;
		private var curStrokeColor:Number = 0xFF000000;
		private var curStrokeCap:String = CapsStyle.ROUND;

		// fill
		private var doFill:Boolean = true;
		private var curFillColor:Number = 0xFFFFFFFF;

		// shape drawing
		private var shape:Shape = new Shape();
		private var shapeMatrix:Matrix = new Matrix();
		private var doSmooth:Boolean = false;

		private function beginShapeDrawing():void {			
			// set stroke
			if (doStroke)
				shape.graphics.lineStyle(curStrokeWeight, curStrokeColor & 0xFFFFFF,
				    alpha(curStrokeColor) / 255, true, 'normal',
				    curStrokeCap, curStrokeCap);
			else
				shape.graphics.lineStyle();

			// set fill
			if (doFill)
				shape.graphics.beginFill(curFillColor & 0xFFFFFF, alpha(curFillColor) / 255);
		}

		private function endShapeDrawing():void {
			// end any open fill
			shape.graphics.endFill();

			// rasterize and clear shape
//[TODO] this is here because of shapeMatrix... fix that later?
			bitmapData.draw(shape, shapeMatrix, null, null, null, doSmooth);
			shape.graphics.clear();
		}
		
		// color conversion
//[TODO] should there be a color datatype?
		public function color(... args):Number {
			var aColor:Number = 0;

			// function overrides
			if (args.length == 1 && args[0] < 256 && args[0] >= 0)
			{
				// color(gray)
				return color( args[0], args[0], args[0], opacityRange );
			}
			else if (args.length == 2 && args[0] < 256 && args[0] >= 0)
			{
				// color(gray, alpha)
				return color( args[0], args[0], args[0], args[1] );
			}
			else if (args.length == 3)
			{
				// color(value1, value2, value3)
				return color(args[0], args[1], args[2], opacityRange );
			}
			else if (args.length == 4)
			{
				// color(value1, value2, value3, alpha)
				var a = getColor(args[3], opacityRange);
	
				// normalize color values
				var colors = (curColorMode == HSB) ?
				    HSBtoRGB(args[0], args[1], args[2]) : args;
				// fit colors into range
				var r = getColor(colors[0], redRange);
				var g = getColor(colors[1], greenRange);
				var b = getColor(colors[2], blueRange);
				
				return (a << 24) + (r << 16) + (g << 8) + b;
			}
			else if ( args.length == 1 )
			{
				// color(hex)
				return args[0];
			}
			else if ( args.length == 2 )
			{
				// color(hex, alpha)
				return args[0] + (args[1] << 24);
			}
			
			// catch-all
			return color( redRange, greenRange, blueRange, opacityRange );
		}
		
		// HSB conversion function from Mootools, MIT Licensed
		private function HSBtoRGB(h, s, b):Array {
			h = (h / redRange) * 100;
			s = (s / greenRange) * 100;
			b = (b / blueRange) * 100;
			if (s != 0) {
				var hue = h % 360;
				var f = hue % 60;
				var br = Math.round(b / 100 * 255);
				var p = Math.round((b * (100 - s)) / 10000 * 255);
				var q = Math.round((b * (6000 - s * f)) / 600000 * 255);
				var t = Math.round((b * (6000 - s * (60 - f))) / 600000 * 255);
				switch (Math.floor(hue / 60)){
					case 0: return [br, t, p];
					case 1: return [q, br, p];
					case 2: return [p, br, t];
					case 3: return [p, q, br];
					case 4: return [t, p, br];
					case 5: return [br, p, q];
				}
			}
			return [b, b, b]
		}
			
		private function getColor( aValue, range ):Number {
			return PMath.constrain(Math.round(255 * (aValue / range)), 0, 255);
		}
		
		public function createImage( w:int, h:int, mode = null ):PImage
		{
			var img:PImage = new PImage(w, h);
			img.loadPixels();
			return img;
		}
		
		public function createGraphics( w:int, h:int, type:int = P2D ):PGraphics
		{
//[TODO] what about type?
			return new PGraphics(w, h);
		}

		public function tint( rgb:Number, a:Number ):void
		{
			//[TODO] rgb?
			curTint = a;
		}
		
		//[TODO] this should be private; see AniSprite
		//[TODO] also, this function needs much work
		private function getImage( img ) {
/*			if ( typeof img == "string" )
			{
				//[TODO] load image from path
			}
			
			if ( img.img || img.canvas )
			{
				return img.img || img.canvas;
			}
			
			// convert pixel color array to ImageData, i guess
			
			img.data = [];
			
			for ( var i = 0, l = img.pixels.length; i < l; i++ )
			{
				var c = (img.pixels[i] || "rgba(0,0,0,1)").slice(5,-1).split(",");
				img.data.push( parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), parseFloat(c[3]) * 100 );
			}
			
			var canvas:Canvas = new Canvas('canvas' + Math.random(), img.width, img.height);
			canvas.getContext('2d').putImageData( img, 0, 0 );
			
			img.canvas = canvas;
			
			return canvas;*/
		}
			
		public function image( img:PImage, x:int = 0, y:int = 0, w:int = undefined, h:int = undefined )
		{
			// create transformaton matrix
			var matrix:Matrix = new Matrix();
			// translation
			matrix.translate(x, y);
			// scaling
			if (arguments.length == 5)
				matrix.scale(w/img.width, h/img.height);
	
			// resync image
			img.updatePixels();
			// draw image
			bitmapData.draw(img.bitmapData, matrix);
	
/*			if ( img._mask )
			{
				var oldComposite = curContext.globalCompositeOperation;
				curContext.globalCompositeOperation = "darker";
				image( img._mask, x, y );
				curContext.globalCompositeOperation = oldComposite;
			}*/
		}
	
		public function loadImage( file:String ):PImage
		{
			// attempt to load preloaded image
			if (!applet || !applet.getImage(file))
				return null;
			
			// create PImage object
			var bitmap:BitmapData = applet.getImage(file);
			var image:PImage = new PImage(bitmap.width, bitmap.height);
			image.bitmapData = bitmap;
			image.loadPixels();
			return image;
		}
		
		// text
//[TODO] this
		
/*		public function loadFont( name )
		{
			return {
				name: name,
				width: function( str )
				{
					if ( curContext.mozMeasureText )
						return curContext.mozMeasureText( typeof str == "number" ?
							String.fromCharCode( str ) :
							str) / curTextSize;
		else
			return 0;
				}
			};
		}
	
		public function textFont( name, size )
		{
			curTextFont = name;
			textSize( size );
		}
	
		public function textSize( size )
		{
			if ( size )
			{
				curTextSize = size;
			}
		}
	
		public function textAlign()
		{
	
		}
	
		public function text( str, x, y )
		{
			if ( str && curContext.mozDrawText )
			{
				curContext.save();
				curContext.mozTextStyle = curTextSize + "px " + curTextFont.name;
				curContext.translate(x, y);
				curContext.mozDrawText( typeof str == "number" ?
					String.fromCharCode( str ) :
		str );
				curContext.restore();
			}
		}*/
		
		public function colorMode( mode:Number, range1:Number = undefined, range2:Number = undefined, range3:Number = undefined, range4:Number = undefined ):void
		{
			curColorMode = mode;

			if ( arguments.length == 2 )
			{
				colorMode( mode, range1, range1, range1, range1 );
			}
			else if ( arguments.length >= 3 )
			{
				redRange = range1 ? range1 : redRange;
				greenRange = range2 ? range2 : greenRange;
				blueRange = range3 ? range3 : blueRange;
				opacityRange = range4 ? range4 : opacityRange;
			}
		}

		public function beginShape( type = POLYGON )
		{
//[TODO] prevent other shapes from drawing until endShape
			curShape = type;
			curShapeCount = 0; 
			curvePoints = [];
		}
		
		public function endShape( close = true )
		{
			if ( curShapeCount != 0 && (close || doFill) ) 
				shape.graphics.lineTo( firstX, firstY );
			
			if ( curShapeCount != 0  || pathOpen ) {
				endShapeDrawing();
				curShapeCount = 0;
				pathOpen = false;
			}
		}
		
		public function vertex( x, y, x2 = null, y2 = null, x3 = null, y3 = null )
		{
			if ( curShapeCount == 0 && curShape != POINTS )
			{
				pathOpen = true;
				beginShapeDrawing();
				shape.graphics.moveTo( x, y );
				firstX = x;
				firstY = y;
			}
			else
			{
				if ( curShape == POINTS )
				{
					point( x, y );
				}
				else if ( arguments.length == 2 )
				{
					if ( curShape != QUAD_STRIP || curShapeCount != 2 )
						shape.graphics.lineTo( x, y );
	
					if ( curShape == TRIANGLE_STRIP ) {
						if ( curShapeCount == 2 ) {
							// finish shape
							endShape(CLOSE);
							pathOpen = true;
							beginShapeDrawing();
							
							// redraw last line to start next shape
							shape.graphics.moveTo( prevX, prevY );
							shape.graphics.lineTo( x, y );
							curShapeCount = 1;
						}
						firstX = prevX;
						firstY = prevY;
					}
	
					if ( curShape == TRIANGLE_FAN && curShapeCount == 2 ) {
						// finish shape
						endShape(CLOSE);
						pathOpen = true;
						beginShapeDrawing();
				
						// redraw last line to start next shape
						shape.graphics.moveTo( firstX, firstY );
						shape.graphics.lineTo( x, y );
						curShapeCount = 1;
					}
			
					if ( curShape == QUAD_STRIP && curShapeCount == 3 ) {
						// finish shape
						shape.graphics.lineTo( prevX, prevY );
						endShape(CLOSE);
						pathOpen = true;
						beginShapeDrawing();
			
						// redraw lines to start next shape
						shape.graphics.moveTo( prevX, prevY );
						shape.graphics.lineTo( x, y );
						curShapeCount = 1;
					}
	
					if ( curShape == QUAD_STRIP) {
						firstX = secondX;
						firstY = secondY;
						secondX = prevX;
						secondY = prevY;
					}
				} else if ( arguments.length == 4 ) {
					if ( curShapeCount > 1 ) {
						shape.graphics.moveTo( prevX, prevY );
						shape.graphics.curveTo(firstX, firstY, x, y);
						curShapeCount = 1;
					}
				} else if ( arguments.length == 6 ) {
					shape.graphics.lineTo(p0.x, p0.y); 
					(new Bezier(shape.graphics)).drawCubicBezier(
						new Point(prevX, prevY), new Point(x, y), new Point(x2, y2), new Point(x3, y3), 4);
					curShapeCount = -1;
					// make sure prevX/prevY are set to next point
					x = x3;
					y = y3;
				}
			}
	
			prevX = x;
			prevY = y;
			curShapeCount++;
			
			if ( curShape == LINES && curShapeCount == 2 ||
					 (curShape == TRIANGLES) && curShapeCount == 3 ||
			 (curShape == QUADS) && curShapeCount == 4 ) {
				endShape(CLOSE);
			}
		}
		
		private var curTightness:Number = 0;
		private var curvePoints:Array = [];

		public function curveVertex( x, y, x2 = null, y2 = null ):void {
			if ( curvePoints.length < 3 ) {
				curvePoints.push([x,y]);
			} else {
				var b = [], s = 1 - curTightness;
	
				/*
				 * Matrix to convert from Catmull-Rom to cubic Bezier
				 * where t = curTightness
				 * |0				 1					0				 0			 |
				 * |(t-1)/6	 1					(1-t)/6	 0			 |
				 * |0				 (1-t)/6		1				 (t-1)/6 |
				 * |0				 0					0				 0			 |
				 */
	
				curvePoints.push([x,y]);
	
				b[0] = [curvePoints[1][0],curvePoints[1][1]];
				b[1] = [curvePoints[1][0]+(s*curvePoints[2][0]-s*curvePoints[0][0])/6,curvePoints[1][1]+(s*curvePoints[2][1]-s*curvePoints[0][1])/6];
				b[2] = [curvePoints[2][0]+(s*curvePoints[1][0]-s*curvePoints[3][0])/6,curvePoints[2][1]+(s*curvePoints[1][1]-s*curvePoints[3][1])/6];
				b[3] = [curvePoints[2][0],curvePoints[2][1]];
	
				if ( !pathOpen ) {
					vertex( b[0][0], b[0][1] );
				} else {
					curShapeCount = 1;
				}
	
				vertex( b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1] );
				curvePoints.shift();
			}
		}
	
		public function curveTightness( tightness:Number ):void {
			curTightness = tightness;
		}
	
		public function bezierVertex(x, y, x2, y2, x3, y3 ) {
//[TODO]
			return vertex(x, y, x2, y2, x3, y3 );
		}
		
		public function rectMode( aRectMode:Number ):void
		{
			curRectMode = aRectMode;
		}
	
		public function imageMode()
		{
	
		}
		
		public function ellipseMode( aEllipseMode:Number ):void
		{
			curEllipseMode = aEllipseMode;
		}
		
		public function ortho()
		{
		
		}

		public function translate( x:Number, y:Number ):void
		{
			var newMatrix = new Matrix();
			newMatrix.translate(x, y);
			newMatrix.concat(shapeMatrix);
			shapeMatrix = newMatrix;
		}
		
		public function scale( x:Number, y:Number = undefined ):void
		{
			var newMatrix = new Matrix();
			newMatrix.scale(x, y == undefined ? x : y);
			newMatrix.concat(shapeMatrix);
			shapeMatrix = newMatrix;
		}
		
		public function rotate( aAngle:Number ):void
		{
			var newMatrix = new Matrix();
			newMatrix.rotate(aAngle);
			newMatrix.concat(shapeMatrix);
			shapeMatrix = newMatrix;
		}
		
		private var matrixStack:Array = [];
		
		public function pushMatrix()
		{
			matrixStack.push(shapeMatrix.clone());
		}
		
		public function popMatrix()
		{
			shapeMatrix = matrixStack.pop();
		}
		
		public function redraw()
		{
//[TODO] what should we do here?
		}
		
		public function beginDraw()
		{
			// clear graphics and reset background
			if ( hasBackground )
			{
				background();
			}
		}
		
		public function endDraw()
		{
//[TODO] rasterize shape
		}
		
		public function background( img = null )
		{
	
			if ( arguments.length )
			{
				if ( img && img.hasOwnProperty('img') )
				{
					curBackground = img;
				}
				else
				{
					curBackground = color.apply( this, arguments );
				}
			}
			
	
			if ( curBackground.hasOwnProperty('img') )
			{
				image( curBackground, 0, 0 );
			}
			else
			{
				// set background color
				bitmapData.fillRect(new Rectangle(0, 0, width, height), curBackground);
			}
		}
	
		public function red( aColor:Number ):Number
		{
			return aColor >> 16 & 0xFF;
		}
	
		public function green( aColor:Number ):Number
		{
			return aColor >> 8 & 0xFF;
		}
	
		public function blue( aColor:Number ):Number
		{
			return aColor & 0xFF;
		}
	
		public function alpha( aColor:Number ):Number
		{
			return aColor >> 24 & 0xFF;
		}
		
		public function noStroke()
		{
			doStroke = false;
		}
		
		public function noFill()
		{
			doFill = false;
		}
		
		public function smooth():void
		{
			doSmooth = true;
			if (applet)
				applet.stage.quality = StageQuality.HIGH;
		}

		public function noSmooth():void
		{
			doSmooth = false;
			if (applet)
				applet.stage.quality = StageQuality.LOW;
		}
		
		public function fill( ... args ):void
		{
			doFill = true;
			curFillColor = color.apply( this, args );
		}
		
		public function stroke( ... args ):void
		{
			doStroke = true;
			curStrokeColor = color.apply( this, args );
		}
	
		public function strokeWeight( w:Number ):void
		{
			curStrokeWeight = w;
		}
		
		public function point( x:Number, y:Number ):void
		{
			bitmapData.setPixel32(x, y, curStrokeColor);
		}

		// credit: http://casaframework.org/docs/org_casaframework_util_DrawUtil.html
		public function arc( x:uint, y:uint, width:int, height:int, start:Number, stop:Number ):void
		{
			if ( curEllipseMode == CORNER )
			{
				x += width / 2;
				y += height / 2;
			}
			else if ( curEllipseMode == RADIUS )
			{
				width /= 2;
				height /= 2;
			}
			
			// calculate variables
			var xRadius:Number = width / 2, yRadius:Number = height / 2;
			var arc:Number = start - stop;
			var segs:Number = Math.ceil(Math.abs(arc) / (Math.PI / 4));
			var theta:Number = arc / segs;
			var ax:Number = x + Math.cos(start + Math.PI/2) * xRadius;
			var ay:Number = y + Math.sin(-(start + Math.PI/2)) * yRadius;
			var angle:Number = -(start + Math.PI/2), angleMid:Number;
		
			// start drawing from center
			beginShapeDrawing();
			shape.graphics.moveTo(x, y);
			shape.graphics.lineTo(ax, ay);
			// draw curve segments
			for (var i:int = 0; i < segs; i++)
			{
				angle += theta;
				angleMid = angle - (theta * .5);
			    
				shape.graphics.curveTo(
				    x + Math.cos(angleMid) * (xRadius / Math.cos(theta * .5)),
				    y + Math.sin(angleMid) * (yRadius / Math.cos(theta * .5)),
				    x + Math.cos(angle) * xRadius,
				    y + Math.sin(angle) * yRadius
				);
			}
			// end shape
			shape.graphics.lineTo(x, y);
			endShapeDrawing();
		}
		
		public function line( x1:Number = 0, y1:Number = 0, x2:Number = 0, y2:Number = 0):void
		{
			beginShapeDrawing();
			shape.graphics.moveTo( x1, y1 );
			shape.graphics.lineTo( x2, y2 );
			endShapeDrawing();
		}
	
		public function bezier( x1, y1, x2, y2, x3, y3, x4, y4 )
		{
//			curContext.lineCap = "butt";
			beginShapeDrawing();
                        shape.graphics.moveTo(x1, y1);
                        (new Bezier(shape.graphics)).drawCubicBezier(
			    new Point(x1, y1), new Point(x2, y2), new Point(x3, y3), new Point(x4, y4), 4);
			endShapeDrawing();
                }
	
		public function triangle( x1, y1, x2, y2, x3, y3 )
		{
			beginShape();
			vertex( x1, y1 );
			vertex( x2, y2 );
			vertex( x3, y3 );
			endShape();
		}
	
		public function quad( x1, y1, x2, y2, x3, y3, x4, y4 )
		{
			beginShape();
			vertex( x1, y1 );
			vertex( x2, y2 );
			vertex( x3, y3 );
			vertex( x4, y4 );
			endShape();
		}
		
		public function rect( x:Number, y:Number, width:Number, height:Number )
		{
			// modify rectange mode
			switch (curRectMode)
			{
			    case CORNERS:
				width -= x;
				height -= y;
				break;

			    case RADIUS:
				width *= 2;
				height *= 2;
			    case CENTER:
				x -= (width / 2);
				y -= (height / 2);
				break;

			    default:
				break;
			}

			// draw shape
			beginShapeDrawing();
			shape.graphics.drawRect(x, y, width, height);
			endShapeDrawing();
		}
		
		public function ellipse( x:Number, y:Number, width:Number, height:Number )
		{
			// modify ellipse mode
			switch (curEllipseMode)
			{
			    case RADIUS:
				width *= 2;
				height *= 2;
			    case CENTER:
				x -= (width / 2);
				y -= (height / 2);
				break;
			}

			// draw shape
			beginShapeDrawing();
			shape.graphics.drawEllipse(x, y, width, height);
			endShapeDrawing();
		}

		//=========================================================
		// Environment
		//=========================================================

		public function frameRate( aRate:Number ):void
		{
			if (applet)
				applet.stage.frameRate = aRate;
		}

		public function size( aWidth:Number, aHeight:Number, type:Number = P2D ):void
		{
//[TODO] type?
			// change image size (no need to preserve data)
			bitmapData = new BitmapData( aWidth, aHeight);
			dispatchEvent(new Event(flash.events.Event.RESIZE));
			if (applet)
				applet.bitmapData = bitmapData;
		}

//[TODO] these might have to be moved out of this class
		public function loop()
		{
			if (applet)
				applet.enableLoop = true;
		}
		
		public function noLoop()
		{
			if (applet)
				applet.enableLoop = false;
		}

		public function link( href:String, target ):void
		{
			var request:URLRequest;
			request = new URLRequest(href);
			navigateToURL(request);
		}

		public function exit()
		{
			// stop applet
			if (applet)
				applet.stop();
		}

		public function print(data:String)
		{
//[TODO] this shouldn't add a newline... (i'm so picky.)
			trace(data);
		}

		public function println(data:String)
		{
			trace(data);
		}

		//=========================================================
		// Input
		//=========================================================

		// Time & Date

		private var start:Number;

		public function hour():Number
		{
			return (new Date).getHours();
		}
	
		public function millis():Number
		{
			return (new Date).getTime() - start;
		}
	
		public function year():Number
		{
			return (new Date).getFullYear();
		}

		public function minute():Number
		{
			return (new Date).getMinutes();
		}
	
		public function month():Number
		{
			return (new Date).getMonth();
		}
	
		public function day():Number
		{
			return (new Date).getDay();
		}
	
		public function second():Number
		{
			return (new Date).getSeconds();
		}
	}
}

/*////////////////////////////////////////////////////////////////////////
 * orginal from Timothee Groleau, 
 * more information: http://timotheegroleau.com/Flash/articles/cubic_bezier_in_flash.htm
//
// Bezier_lib.as - v1.2 - 19/05/02
// Timothee Groleau
//
// The purpose of this file is mainly to provide a function drawCubicBezier
// for the MovieClip prototype to approximate a cubic Bezier curve
// from the quadratic curveTo of the Flash drawing API
//
// By doing so, several useful functions are created to calculate cubic
// bezier points and derivative. Other Bezier functions can be added to
// the _global.Bezier object, like quadratic or quartic function as necessary.
//
// Also a few functions are added to the Math object to handle 2D line equations
//
////////////////////////////////////////////////////////////////////////*/

import flash.display.Graphics;
import flash.geom.Point;

class Bezier {
	public var graphics : Graphics;
	
	public function Bezier(graphics:Graphics=null){
		this.graphics = graphics;
	}
	
	// Return the bezier location at t based on the 4 parameters
	// c0, c1, c2, c3 are respectively the position of the four bezier controls (1D)
	private function getCubicPt(c0:Number, c1:Number, c2:Number, c3:Number, t:Number):Number{
		var ts:Number = t*t;
		var g:Number = 3 * (c1 - c0);
		var b:Number = (3 * (c2 - c1)) - g;
		var a:Number = c3 - c0 - b - g;
		return ( a*ts*t + b*ts + g*t + c0 );
	}
	
	// Return the value of the derivative of the cubic bezier at t
	// c0, c1, c2, c3 are respectively the position of the four bezier controls (1D)
	private function getCubicDerivative(c0:Number, c1:Number, c2:Number, c3:Number, t:Number):Number {
		var g:Number = 3 * (c1 - c0);
		var b:Number = (3 * (c2 - c1)) - g;
		var a:Number = c3 - c0 - b - g;
		return ( 3*a*t*t + 2*b*t + g );
	}
	
	// returns a tangent object of a cubic Bezier curve at t
	// A tangent object comprises two properties, P and l
	// P is a point with two propertiesx and y
	// l is a line with two properties a and b
	private function getCubicTgt(P0:Point, P1:Point, P2:Point, P3:Point, t:Number):Tangent {
		// calculates the position of the cubic bezier at t
		var P:Point = new Point();
		P.x = getCubicPt(P0.x, P1.x, P2.x, P3.x, t);
		P.y = getCubicPt(P0.y, P1.y, P2.y, P3.y, t);
		
		// calculates the tangent values of the cubic bezier at t
		var V:Point = new Point();
		V.x = getCubicDerivative(P0.x, P1.x, P2.x, P3.x, t);
		V.y = getCubicDerivative(P0.y, P1.y, P2.y, P3.y, t);
	
		// calculates the line equation for the tangent at t
		var l:Line = getLine2(P, V);
	
		// return the Point/Tangent object 
		return new Tangent(P,l);
	}
	
	/////////////////////////////////////////////////////////////////////////
	//
	// Draw a cubic Bezier as a Spline approximation
	// (Very fast processing, but clearly far from the true cubic bezier)
	//
	/////////////////////////////////////////////////////////////////////////
	
	// This function draws a approximation of a cubic bezier curve
	// It is very fast but does not look quite the real one
	public function drawCubicBezier_spline(P0:Point, P1:Point, P2:Point, P3:Point) : void {
	
		// calculates middle point of the two control points segment
		var midP_x:Number = (P1.x + P2.x) / 2;
		var midP_y:Number = (P1.y + P2.y) / 2;
		
		// draw fake cubic bezier curve lines (in two parts)
		graphics.curveTo(P1.x, P1.y, midP_x, midP_y);
		graphics.curveTo(P2.x, P2.y, P3.x, P3.y);
	}
	
	/////////////////////////////////////////////////////////////////////////
	//
	// Add a draw cubic bezier curve to the MovieClip prototype
	//
	/////////////////////////////////////////////////////////////////////////
	
	// this function recursively slice down a cubic Bezier segment to avoid parallel tangents
	// the function returns the number of sub segment used to draw the current segment
	private function sliceCubicBezierSegment(P0:Point, P1:Point, P2:Point, P3:Point, u1:Number, u2:Number, Tu1:Tangent, Tu2 : Tangent, recurs:Number) : Number {
	
		// prevents infinite recursion (no more than 10 levels)
		// if 10 levels are reached the latest subsegment is 
		// approximated with a line (no quadratic curve). It should be good enough.
		if (recurs > 10) {
			var P:Point = Tu2.p;
			graphics.lineTo(P.x, P.y);
			return 1;
		}
	
		// recursion level is OK, process current segment
		var ctrlPt:Point = getLineCross(Tu1.l, Tu2.l);
		var d:Number = 0;
		
		// A control point is considered misplaced if its distance from one of the anchor is greater 
		// than the distance between the two anchors.
		if (	(ctrlPt == null) || 
				(distance(Tu1.p, ctrlPt) > (d = distance(Tu1.p, Tu2.p))) ||
				(distance(Tu2.p, ctrlPt) > d) ) {
	
			// total for this subsegment starts at 0
			var tot:Number = 0;
	
			// If the Control Point is misplaced, slice the segment more
			var uMid:Number = (u1 + u2) / 2;
			var TuMid:Tangent = getCubicTgt(P0, P1, P2, P3, uMid);
			tot += sliceCubicBezierSegment(P0, P1, P2, P3, u1, uMid, Tu1, TuMid, recurs+1);
			tot += sliceCubicBezierSegment(P0, P1, P2, P3, uMid, u2, TuMid, Tu2, recurs+1);
			
			// return number of sub segments in this segment
			return tot;
	
		} else {
			// if everything is OK draw curve
			P = Tu2.p;
			graphics.curveTo(ctrlPt.x, ctrlPt.y, P.x, P.y);
			return 1;
		}
	}
	
	// Draws a cubic bezier point approximation, P0 and P3 are the anchor points
	// P1 and P2 are the handle points
	// nSegments denotes how many quadratic bezier segments will be used to
	// approximate the cubic bezier (default is 4);
	public function drawCubicBezier(P0:Point, P1:Point, P2:Point, P3:Point, nSegment:Number):Number {
		//define the local variables
		var curP:Point; // holds the current Point
		var nextP:Point; // holds the next Point
		var ctrlP:Point; // holds the current control Point
		var curT:Tangent; // holds the current Tangent object
		var nextT:Tangent; // holds the next Tangent object
		var total:Number = 0; // holds the number of slices used
		
		// make sure nSegment is within range (also create a default in the process)
		if (nSegment < 2) nSegment = 4;
	
		// get the time Step from nSegment
		var tStep:Number = 1 / nSegment;
		
		// get the first tangent Object
		curT = new Tangent(P0,getLine(P0, P1));
		
		// move to the first point
		// this.moveTo(P0.x, P0.y);
	
		// get tangent Objects for all intermediate segments and draw the segments
		for (var i:int=1; i<=nSegment; i++) {
			// get Tangent Object for next point
			nextT = getCubicTgt(P0, P1, P2, P3, i*tStep);
	
			// get segment data for the current segment
			total += sliceCubicBezierSegment(P0, P1, P2, P3, (i-1)*tStep, i*tStep, curT, nextT, 0)
	
			// prepare for next round
			curT = nextT;
		}
		return total;
	}
	
	/////////////////////////////////////////////////////////////////////////
	//
	// Add a drawCubicBezier2 to the movieClip prototype based on a MidPoint 
	// simplified version of the midPoint algorithm by Helen Triolo
	//
	/////////////////////////////////////////////////////////////////////////
	
	// This function will trace a cubic approximation of the cubic Bezier
	// It will calculate a serie of [control point/Destination point] which 
	// will be used to draw quadratic Bezier starting from P0
	public function drawCubicBezier2(P0:Point, P1:Point, P2:Point, P3:Point):void {
	
		// calculates the useful base points
		var PA:Point = getPointOnSegment(P0, P1, 3/4);
		var PB:Point = getPointOnSegment(P3, P2, 3/4);
		
		// get 1/16 of the [P3, P0] segment
		var dx:Number = (P3.x - P0.x)/16;
		var dy:Number = (P3.y - P0.y)/16;
		
		// calculates control point 1
		var Pc_1:Point = getPointOnSegment(P0, P1, 3/8);
		
		// calculates control point 2
		var Pc_2:Point = getPointOnSegment(PA, PB, 3/8);
		Pc_2.x -= dx;
		Pc_2.y -= dy;
		
		// calculates control point 3
		var Pc_3:Point = getPointOnSegment(PB, PA, 3/8);
		Pc_3.x += dx;
		Pc_3.y += dy;
		
		// calculates control point 4
		var Pc_4:Point = getPointOnSegment(P3, P2, 3/8);
		
		// calculates the 3 anchor points
		var Pa_1:Point = getMiddle(Pc_1, Pc_2);
		var Pa_2:Point = getMiddle(PA, PB);
		var Pa_3:Point = getMiddle(Pc_3, Pc_4);
	
		// draw the four quadratic subsegments
		graphics.curveTo(Pc_1.x, Pc_1.y, Pa_1.x, Pa_1.y);
		graphics.curveTo(Pc_2.x, Pc_2.y, Pa_2.x, Pa_2.y);
		graphics.curveTo(Pc_3.x, Pc_3.y, Pa_3.x, Pa_3.y);
		graphics.curveTo(Pc_4.x, Pc_4.y, P3.x, P3.y);
	}

	/////////////////////////////////////////////////////////////////////////
	//
	// Add a few line functions to the Math object
	//
	/////////////////////////////////////////////////////////////////////////
	
	// Gets a line equation as two properties (a,b) such that (y = a*x + b) for any x
	// or a unique c property such that (x = c) for all y
	// The function takes two points as parameter, P0 and P1 containing two properties x and y
	private function getLine(P0:Point, P1:Point):Line{
		var l:Line = new Line();
		var x0 : Number = P0.x;
		var y0 : Number = P0.y;
		var x1 : Number = P1.x;
		var y1 : Number = P1.y;
		
		if (x0 == x1) {
			if (y0 == y1) {
				// P0 and P1 are same point, return null
				l = null;
			} else {
				// Otherwise, the line is a vertical line
				l.c = x0;
			}
		} else {
			l.a = (y0 - y1) / (x0 - x1);
			l.b = y0 - (l.a * x0);
		}

		// returns the line object
		return l;
	}
		
	// Gets a line equation as two properties (a,b) such that (y = a*x + b) for any x
	// or a unique c property such that (x = c) for all y
	// The function takes two parameters, a point P0 (x,y) through which the line passes
	// and a direction vector v0 (x,y)
	private function getLine2(P0 : Point, v0:Point) : Line {
		var l:Line = new Line;
		var x0:Number = P0.x;
		var vx0:Number = v0.x;
		
		if (vx0 == 0) {
			// the line is vertical
			l.c = x0
		} else {
			l.a = v0.y / vx0;
			l.b = P0.y - (l.a * x0);
		}
		
		// returns the line object
		return l;
	}
		
	// return a point (x,y) that is the intersection of two lines
	// a line is defined either by a and b parameters such that (y = a*x + b) for any x
	// or a single parameter c such that (x = c) for all y
	private function getLineCross(l0:Line, l1:Line):Point {
		// define local variables
		var a0:Number = (l0 == null)?0:l0.a;
		var b0:Number = (l0 == null)?0:l0.b;
		var c0:Number = (l0 == null)?NaN:l0.c;
		var a1:Number = (l1 == null)?0:l1.a;
		var b1:Number = (l1 == null)?0:l1.b;
		var c1:Number = (l1 == null)?NaN:l1.c;
		var u:Number;

		// checks whether both lines are vertical
		if ((isNaN(c0)) && (isNaN(c1))) {
	
			// lines are not verticals but parallel, intersection does not exist
			if (a0 == a1) return null; 
	
			// calculate common x value.
			u = (b1 - b0) / (a0 - a1);		
			
			// return the new Point
			return new Point(u,(a0*u + b0));
	
		} else {
	
			if (isNaN(c0) != true) {
				if (isNaN(c1) != true) {
					// both lines vertical, intersection does not exist
					return null;
				} else {
					// return the point on l1 with x = c0
					return new Point(c0,(a1*c0 + b1));
				}
	
			} else if (isNaN(c1) != true) {
				// no need to test c0 as it was tested above
				// return the point on l0 with x = c1
				return new Point(c1,(a0*c1 + b0));
			}
		}

		return null;
	}

	// return the distance between two points
	private function distance(P0:Point, P1:Point):Number{
		var dx:Number = P0.x - P1.x;
		var dy:Number = P0.y - P1.y;
		
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	// return the middle of a segment define by two points
	private function getMiddle(P0:Point, P1:Point):Point {
		return new Point(((P0.x + P1.x) / 2),((P0.y + P1.y) / 2));
	}
	
	// return a point on a segment [P0, P1] which distance from P0
	// is ratio of the length [P0, P1]
	private function getPointOnSegment(P0:Point, P1:Point, ratio:Number):Point {
		return new Point((P0.x + ((P1.x - P0.x) * ratio)),(P0.y + ((P1.y - P0.y) * ratio)));
	}
}

import flash.geom.Point;
class Line {
	public var a : Number=0;
	public var b : Number=0;
	public var c : Number=NaN;
	public function Line(a:Number=0,b:Number=0,c:Number=NaN){
		this.a = a;
		this.b = b;
		this.c = c;
	}
}

class Tangent {
	public var p:Point;
	public var l:Line;

	public function Tangent(pt:Point,line:Line){
		this.p = pt;
		this.l = line;
	}
}
