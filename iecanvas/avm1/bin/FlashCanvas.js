// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Known Issues:
//
// * only moveTo, lineTo and basic fill/stroke capabilities are implemented
// * see "_canvas_command" function for flash gotcha
// * appears to be leaking memory somewhere on IE
// * has not been testing on IE 6 -- which means it probably doesn't work there
// * dynamic resizing on canvas is probably broken
// * doing "Show All" from Flash player context-menu breaks the full size of the movie clip

//if (!window.CanvasRenderingContext2D) {
if(true) {

(function () {
	// alias some functions to make (compiled) code shorter
	var m = Math;
	var mr = m.round;
	var ms = m.sin;
	var mc = m.cos;

	// this is used for sub pixel precision
	var Z = 10;
	var Z2 = Z / 2;
			
	var G_FlashCanvasManager_ = {
	init: function (opt_doc) {
		var doc = opt_doc || document;
		if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			var self = this;
			doc.attachEvent("onreadystatechange", function () {
				self.init_(doc);
			});
		}
/* Comment this out in production: */
		else	
		{
			// initialize canvas elements for those browsers which already support the canvas tag (for testing):
			var self = this;
			window.addEventListener("load", function() { self.nonIE_init_(doc);	}, false);
		}

	},

	nonIE_init_: function (doc) {
		// find all canvas elements

		var els = doc.getElementsByTagName("canvas");

		for (var i = 0; i < els.length; i++)
		{
			this.initElement(els[i]);
		}
	},
	
	init_: function (doc) {
		if (doc.readyState != "complete")
			return;

		// setup default css
		var ss = doc.createStyleSheet();
		ss.cssText = "canvas{display:inline-block;overflow:hidden;" +
			// default size is 300x150 in Gecko and Opera
			"text-align:left;width:300px;height:150px}"; 


		// find all canvas elements
		var els = doc.getElementsByTagName("canvas");
		for (var i = 0; i < els.length; i++) {
			if (!els[i].getContext)
				this.initElement(els[i]);
		}
	},

    fixElement_: function (el,width,height) {
		var newEl = el.ownerDocument.createElement("div");
		var prev_id = el.id;
		
		el.parentNode.replaceChild(newEl, el);	
		newEl.setAttribute("id",prev_id);	
		newEl.setAttribute("width", width);
		newEl.setAttribute("height", height);	
//		newEl.setAttribute("style", "background-color: #FFF; width: 100px; height: 100px; ");	
		var fb_content = document.createTextNode("Fallback content.");

		// apply that content to the new element
		newEl.appendChild(fb_content);			
		

		return newEl;
    },

	/**
	 * Public initializes a canvas element so that it can be used as canvas
	 * element from now on. This is called automatically before the page is
	 * loaded but if you are creating elements using createElement you need to
	 * make sure this is called on the element.
	 * @param {HTMLElement} el The canvas element to initialize.
	 * @return {HTMLElement} the element that was created.
	 */
	initElement: function (el) {
		var attrs = el.attributes;
		var width = (attrs.width && attrs.width.specified) ? attrs.width.nodeValue : el.clientWidth;
		var height = (attrs.height && attrs.height.specified) ? attrs.height.nodeValue : el.clientHeight;
		var id = el.id;
		var add_random_to_url = true;
		
		/*el = */this.fixElement_(el, width, height);

		swfobject.embedSWF("../FlashCanvas.swf?"+(add_random_to_url?"r="+Math.random() : ""), id, width, height, "8.0.0", null );			
//		var q = swfobject.createSWF( {data:"../FlashCanvas.swf", width:width+"", height:height+"" }, {}, el.id );
		
		el = document.getElementById( el.id );

		el.getContext = function () {
			if (this.context_) {
				return this.context_;
			}
			return this.context_ = new FlashCanvasRenderingContext2D_(this);
		};

		// do not use inline function because that will leak memory
		if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			el.attachEvent('onpropertychange', onPropertyChange);
			el.attachEvent('onresize', onResize);
		}
/*		
		var attrs = el.attributes;
		if (attrs.width && attrs.width.specified) {
			// TODO: use runtimeStyle and coordsize
			// el.getContext().setWidth_(attrs.width.nodeValue);
			el.style.width = attrs.width.nodeValue + "px";
		} else {
			el.width = el.clientWidth;
		}
		if (attrs.height && attrs.height.specified) {
			// TODO: use runtimeStyle and coordsize
			// el.getContext().setHeight_(attrs.height.nodeValue);
			el.style.height = attrs.height.nodeValue + "px";
		} else {
			el.height = el.clientHeight;
		}
*/				
		return el;
	}
	};

	function onPropertyChange(e) {
/*
		var el = e.srcElement;
		switch (e.propertyName) {
		case 'width':
			el.style.width = el.attributes.width.nodeValue + "px";
			el.getContext().clearRect();
			break;
		case 'height':
			el.style.height = el.attributes.height.nodeValue + "px";
			el.getContext().clearRect();
			break;
		}
*/		
	}

	function onResize(e) {
/*		
		var el = e.srcElement;
		if (el.firstChild) {
			el.firstChild.style.width =  el.clientWidth + 'px';
			el.firstChild.style.height = el.clientHeight + 'px';
		}
*/		
	}

 // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

	function copyState(o1, o2) {
		o2.fillStyle     = o1.fillStyle;
		o2.lineCap       = o1.lineCap;
		o2.lineJoin      = o1.lineJoin;
		o2.lineWidth     = o1.lineWidth;
		o2.miterLimit    = o1.miterLimit;
		o2.shadowBlur    = o1.shadowBlur;
		o2.shadowColor   = o1.shadowColor;
		o2.shadowOffsetX = o1.shadowOffsetX;
		o2.shadowOffsetY = o1.shadowOffsetY;
		o2.strokeStyle   = o1.strokeStyle;
		o2.arcScaleX_    = o1.arcScaleX_;
		o2.arcScaleY_    = o1.arcScaleY_;
	}

	function processStyle(styleString) {
		var clr, alpha = 1;

		styleString = String(styleString);
		if (styleString.substring(0, 3) == "rgb") {
			var start = styleString.indexOf("(", 3);
			var end = styleString.indexOf(")", start + 1);
			var guts = styleString.substring(start + 1, end).split(",");

			clr = (Number(guts[0]) << 16) | (Number(guts[1]) << 8) | Number(guts[2]);
		
			if ((guts.length == 4) && (styleString.substr(3, 1) == "a")) {
        		alpha = guts[3];
			}
		} else {
			/* TODO: check for '#' at begining of string */
			clr = Number(styleString.substring(1));
    	}

		return [clr, alpha];
	}

  function processLineCap(lineCap) {
    switch (lineCap) {
      case "butt":
        return "flat";
      case "round":
        return "round";
      case "square":
      default:
        return "square";
    }
  }


	G_FlashCanvasManager_.init();
	
	function FlashCanvasRenderingContext2D_(surfaceElement) {
		
		this.m_ = createMatrixIdentity();

		this.mStack_ = [];
		this.aStack_ = [];
		this.currentPath_ = [];

		// FlashCanvas specific:
		this._fc_cmd_buffer = [];
		// start with immediate-mode, if set to true the buffer must be
		// flushed by calling context.fc_flush() which isn't part of the canvas spec
		this._fc_buffered = false;	
		this._fc_obj = null;	// keep a reference to the flash object
		
		// Canvas context properties
		this.canvas = surfaceElement;
		this.strokeStyle = "#000";
		this.fillStyle = "#000";

		this.lineWidth = 1;
		this.lineJoin = "miter";
		this.lineCap = "butt";
		this.miterLimit = Z * 1;
		this.globalAlpha = 1;	
	};
	
	var contextPrototype = FlashCanvasRenderingContext2D_.prototype;
	contextPrototype._canvas_command_immediate = function( cmd, arg1, arg2, arg3, arg4 ) {
		if( !this._fc_obj )
			this._fc_obj = swfobject.getObjectById(this.canvas.id);

		if( cmd == "batch" && this._fc_obj && typeof this._fc_obj.canvasbatch != "undefined" ) {
			this._fc_obj.canvasbatch( cmd, arg1, arg2, arg3, arg4 );
		}
		else if( this._fc_obj && typeof this._fc_obj.SetVariable != "undefined" ) {
			this._fc_obj.SetVariable('canvascmd', [].slice.call(arguments).join('|'));
			//canvascmd( cmd, arg1, arg2, arg3, arg4 );
		} else {
			/* TODO: queue commands until FlashCanvas is loaded/available */
		}		
	}
	contextPrototype._canvas_command = function( cmd, arg1, arg2, arg3, arg4 ) {
		/* there is clearly a bug in the flash player which prevents this from working
		when calling AS from local JS code -- so this has to be served over the net, if
		served locally you'll get some "ActionScript error use try/catch to debug" even
		when permission is granted to perform the operation */
		try {
			if( this._fc_buffered ) {
				this._fc_cmd_buffer.push( {"cmd":cmd, "arg1":arg1, "arg2":arg2, "arg3":arg3, "arg4":arg4});
			} else {
				this._canvas_command_immediate( cmd, arg1, arg2, arg3, arg4 );
			}
//			var d = document.getElementById("debug");
//			d.innerHTML += "<p>"+cmd+" : "+arg1.toFixed(0)+", "+arg2.toFixed(0)+", "+arg3.toFixed(0)+", "+arg4.toFixed(0)+"</p>";
		} catch(e) {}
		
	};
	contextPrototype.fc_flush = function() {

		this._canvas_command_immediate( "batch", this._fc_cmd_buffer, 0, 0, 0 );
		this._fc_cmd_buffer = [];
	}

	contextPrototype.clearRect = function(aX, aY, aWidth, aHeight) {
		this.currentPath_ = [];
		this._canvas_command( "clear", 0, 0, 0, 0 );

		this.fillStyle = "rgb(0,0,0)";
		this.fillRect( aX,aY, aWidth*1, aHeight*1 );	/* *1 = to number!! */
	};

	contextPrototype.beginPath = function() {
		// TODO: Branch current matrix so that save/restore has no effect
		//       as per safari docs.
		this.currentPath_ = [];
	};

	contextPrototype.moveTo = function(aX, aY) {
		this.currentPath_.push({type: "moveTo", x: aX, y: aY});
		this.currentX_ = aX;
		this.currentY_ = aY;
	};

	contextPrototype.lineTo = function(aX, aY) {
		this.currentPath_.push({type: "lineTo", x: aX, y: aY});
		this.currentX_ = aX;
		this.currentY_ = aY;
	};

	contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
		this.currentPath_.push({type: "bezierCurveTo",
                           cp1x: aCP1x,
                           cp1y: aCP1y,
                           cp2x: aCP2x,
                           cp2y: aCP2y,
                           x: aX,
                           y: aY});
		this.currentX_ = aX;
		this.currentY_ = aY;
	};

	contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
		// the following is lifted almost directly from
		// http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes
		var cp1x = this.currentX_ + 2.0 / 3.0 * (aCPx - this.currentX_);
		var cp1y = this.currentY_ + 2.0 / 3.0 * (aCPy - this.currentY_);
		var cp2x = cp1x + (aX - this.currentX_) / 3.0;
		var cp2y = cp1y + (aY - this.currentY_) / 3.0;
		this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, aX, aY);
	};

	contextPrototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
		aRadius *= Z;
		var arcType = aClockwise ? "at" : "wa";

		var xStart = aX + (mc(aStartAngle) * aRadius) - Z2;
		var yStart = aY + (ms(aStartAngle) * aRadius) - Z2;

		var xEnd = aX + (mc(aEndAngle) * aRadius) - Z2;
		var yEnd = aY + (ms(aEndAngle) * aRadius) - Z2;

		// IE won't render arches drawn counter clockwise if xStart == xEnd.
		if (xStart == xEnd && !aClockwise) {
		  xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
		                   // that can be represented in binary
		}

		this.currentPath_.push({type: arcType,
		                       x: aX,
		                       y: aY,
		                       radius: aRadius,
		                       xStart: xStart,
		                       yStart: yStart,
		                       xEnd: xEnd,
		                       yEnd: yEnd});
	};

	contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
		this.moveTo(aX, aY);
		this.lineTo(aX + aWidth, aY);
		this.lineTo(aX + aWidth, aY + aHeight);
		this.lineTo(aX, aY + aHeight);
		this.closePath();
	};

	contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
		// Will destroy any existing path (same as FF behaviour)
		this.beginPath();
		this.moveTo(aX, aY);
		this.lineTo(aX + aWidth, aY);
		this.lineTo(aX + aWidth, aY + aHeight);
		this.lineTo(aX, aY + aHeight);
		this.closePath();
		this.stroke();
	};

	contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
		// Will destroy any existing path (same as FF behaviour)
		this.beginPath();
		this.moveTo(aX, aY);
		this.lineTo(aX + aWidth, aY);
		this.lineTo(aX + aWidth, aY + aHeight);
		this.lineTo(aX, aY + aHeight);
		this.closePath();
		this.fill();
	};
	
	
	contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;
    var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
    var color = a[0];
    var alpha = (a[1] * this.globalAlpha) * 100;

    var W = 10;
    var H = 10;

	var first_pos = [0,0];
	var have_first = false;

	if(aFill) {
		this._canvas_command( "beginFill", color, alpha, 0, 0 );
	} else {
		this._canvas_command( "lineStyle", this.lineWidth, color, alpha, 0 );	
	}
	
	for (var i = 0; i < this.currentPath_.length; i++) {
		var p = this.currentPath_[i];
//        var c = this.getCoords_(p.x, p.y);
		if(!have_first) {
			first_pos[0] = p.x;
			first_pos[1] = p.y;
			have_first = true;
		}
		switch(p.type) {
		case "lineTo":
		case "moveTo":
//			var c = this.getCoords_(p.x, p.y);
//			this._canvas_command( p.type, mr(c.x), mr(c.y), 0, 0 );
			this._canvas_command( p.type, p.x, p.y, 0, 0 );			
			break;
		case "close":
			if(!have_first)
				break;
			this._canvas_command( "lineTo", first_pos[0], first_pos[1], 0, 0 );			
			have_first = false;
			break;
		case "bezierCurveTo":
			this._canvas_command( p.type, p.x, p.y, p.cp1x, p.cp1y );			
			break;
		case "at":
		case "wa":
			this._canvas_command( "arg_"+p.type,0,0,0,0 );			
			break;
		}
        
		
	}

	if(aFill) {
		this._canvas_command( "endFill", 0, 0, 0, 0 );		
	}
	this.currentPath_ = [];
	/*

    lineStr.push('<g_vml_:shape',
                 ' fillcolor="', color, '"',
                 ' filled="', Boolean(aFill), '"',
                 ' style="position:absolute;width:', W, ';height:', H, ';"',
                 ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' strokeweight="', this.lineWidth, '"',
                 ' strokecolor="', color, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];

      if (p.type == "moveTo") {
        lineStr.push(" m ");
        var c = this.getCoords_(p.x, p.y);
        lineStr.push(mr(c.x), ",", mr(c.y));
      } else if (p.type == "lineTo") {
        lineStr.push(" l ");
        var c = this.getCoords_(p.x, p.y);
        lineStr.push(mr(c.x), ",", mr(c.y));
      } else if (p.type == "close") {
        lineStr.push(" x ");
      } else if (p.type == "bezierCurveTo") {
        lineStr.push(" c ");
        var c = this.getCoords_(p.x, p.y);
        var c1 = this.getCoords_(p.cp1x, p.cp1y);
        var c2 = this.getCoords_(p.cp2x, p.cp2y);
        lineStr.push(mr(c1.x), ",", mr(c1.y), ",",
                     mr(c2.x), ",", mr(c2.y), ",",
                     mr(c.x), ",", mr(c.y));
      } else if (p.type == "at" || p.type == "wa") {
        lineStr.push(" ", p.type, " ");
        var c  = this.getCoords_(p.x, p.y);
        var cStart = this.getCoords_(p.xStart, p.yStart);
        var cEnd = this.getCoords_(p.xEnd, p.yEnd);

        lineStr.push(mr(c.x - this.arcScaleX_ * p.radius), ",",
                     mr(c.y - this.arcScaleY_ * p.radius), " ",
                     mr(c.x + this.arcScaleX_ * p.radius), ",",
                     mr(c.y + this.arcScaleY_ * p.radius), " ",
                     mr(cStart.x), ",", mr(cStart.y), " ",
                     mr(cEnd.x), ",", mr(cEnd.y));
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if(c) {
        if (min.x == null || c.x < min.x) {
          min.x = c.x;
        }
        if (max.x == null || c.x > max.x) {
          max.x = c.x;
        }
        if (min.y == null || c.y < min.y) {
          min.y = c.y;
        }
        if (max.y == null || c.y > max.y) {
          max.y = c.y;
        }
      }
    }
    lineStr.push(' ">');

    if (typeof this.fillStyle == "object") {
      var focus = {x: "50%", y: "50%"};
      var width = (max.x - min.x);
      var height = (max.y - min.y);
      var dimension = (width > height) ? width : height;

      focus.x = mr((this.fillStyle.focus_.x / width) * 100 + 50) + "%";
      focus.y = mr((this.fillStyle.focus_.y / height) * 100 + 50) + "%";

      var colors = [];

      // inside radius (%)
      if (this.fillStyle.type_ == "gradientradial") {
        var inside = (this.fillStyle.radius1_ / dimension * 100);

        // percentage that outside radius exceeds inside radius
        var expansion = (this.fillStyle.radius2_ / dimension * 100) - inside;
      } else {
        var inside = 0;
        var expansion = 100;
      }

      var insidecolor = {offset: null, color: null};
      var outsidecolor = {offset: null, color: null};

      // We need to sort 'colors' by percentage, from 0 > 100 otherwise ie
      // won't interpret it correctly
      this.fillStyle.colors_.sort(function (cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      for (var i = 0; i < this.fillStyle.colors_.length; i++) {
        var fs = this.fillStyle.colors_[i];

        colors.push( (fs.offset * expansion) + inside, "% ", fs.color, ",");

        if (fs.offset > insidecolor.offset || insidecolor.offset == null) {
          insidecolor.offset = fs.offset;
          insidecolor.color = fs.color;
        }

        if (fs.offset < outsidecolor.offset || outsidecolor.offset == null) {
          outsidecolor.offset = fs.offset;
          outsidecolor.color = fs.color;
        }
      }
      colors.pop();

      lineStr.push('<g_vml_:fill',
                   ' color="', outsidecolor.color, '"',
                   ' color2="', insidecolor.color, '"',
                   ' type="', this.fillStyle.type_, '"',
                   ' focusposition="', focus.x, ', ', focus.y, '"',
                   ' colors="', colors.join(""), '"',
                   ' opacity="', opacity, '" />');
    } else if (aFill) {
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity, '" />');
    } else {
      lineStr.push(
        '<g_vml_:stroke',
        ' opacity="', opacity,'"',
        ' joinstyle="', this.lineJoin, '"',
        ' miterlimit="', this.miterLimit, '"',
        ' endcap="', processLineCap(this.lineCap) ,'"',
        ' weight="', this.lineWidth, 'px"',
        ' color="', color,'" />'
      );
    }

    lineStr.push("</g_vml_:shape>");

    this.element_.insertAdjacentHTML("beforeEnd", lineStr.join(""));
*/
    
  };

  contextPrototype.fill = function() {
    this.stroke(true);
  }

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: "close"});
  };	
	
	
  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
    return {
      x: Z * (aX * this.m_[0][0] + aY * this.m_[1][0] + this.m_[2][0]) - Z2,
      y: Z * (aX * this.m_[0][1] + aY * this.m_[1][1] + this.m_[2][1]) - Z2
    }
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };	
	
	
	CanvasRenderingContext2D = FlashCanvasRenderingContext2D_;	
})();

} // if