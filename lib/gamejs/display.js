var Surface = require('../gamejs').Surface;

/**
 * @fileoverview Methods to create, access and manipulate the display Surface.
 *
 * ## Fullscreen mode
 *
 * is enabled by a checkbox with the DOM id `gjs-fullscreen-toggle`. This is
 * to prevent malicious scripts from triggering fullscreen.
 *
 * If the user presses a key, not listed below, a message similar to 'Exit
 * Fullscreen mode with ESC' will be displayed:
 *
 *  * left arrow, right arrow, up arrow, down arrow
 *  * space
 *  * shift, control, alt
 *  * page up, page down
 *  * home, end, tab, meta
 * 
 * @see https://developer.mozilla.org/en/DOM/Using_full-screen_mode
 *
 * @example
 * var display = gamejs.display.setMode([800, 600]);
 * // blit sunflower picture in top left corner of display
 * var sunflower = gamejs.image.load("images/sunflower");
 * display.blit(sunflower);
 *
 */

var CANVAS_ID = "gjs-canvas";
var LOADER_ID = "gjs-loader";
var SURFACE = null;

/**
 * @returns {document.Element} the canvas dom element
 * @ignore
 */
var getCanvas = exports._getCanvas = function() {
   var jsGameCanvas = null;
   var canvasList = Array.prototype.slice.call(document.getElementsByTagName("canvas"));
   canvasList.every(function(canvas) {
      if (canvas.getAttribute("id") == CANVAS_ID) {
         jsGameCanvas = canvas;
         return false;
      }
      return true;
   });
   return jsGameCanvas;
};

/**
 * Create the master Canvas plane.
 * @ignore
 */
exports.init = function() {
   // create canvas element if not yet present
   var jsGameCanvas = null;
   if ((jsGameCanvas = getCanvas()) === null) {
      jsGameCanvas = document.createElement("canvas");
      jsGameCanvas.setAttribute("id", CANVAS_ID);
      document.body.appendChild(jsGameCanvas);
   }
   // remove loader if any;
   var $loader = document.getElementById('gjs-loader');
   if ($loader) {
       $loader.parentNode.removeChild($loader);
   }
   // attach fullscreen toggle checkbox
   var fullScreenCheckbox = document.getElementById('gjs-fullscreen-toggle');
   if (fullScreenCheckbox) {
      fullScreenCheckbox.addEventListener('change', function(event) {
         if (fullScreenCheckbox.checked !== isFullScreen()) {
            toggleFullScreen();
         }
         event.preventDefault();
      }, false);
   }
   //document.addEventListener('mozfullscreenchange', onFullScreenChange, false);
   //document.addEventListener('webkitfullscreenchange', onFullScreenChange, false);
   return;
};

/**
 * Set the width and height of the Display. Conviniently this will
 * return the actual display Surface - the same as calling [gamejs.display.getSurface()](#getSurface))
 * later on.
 * @param {Array} dimensions [width, height] of the display surface
 */
var setMode = exports.setMode = function(dimensions) {
   var canvas = getCanvas();
   canvas.width = dimensions[0];
   canvas.height = dimensions[1];
   return getSurface();
};

/**
 * Set the Caption of the Display (document.title)
 * @param {String} title the title of the app
 * @param {gamejs.Image} icon FIXME implement favicon support
 */
exports.setCaption = function(title, icon) {
   document.title = title;
};

var isFullScreen = function() {
   return (document.fullScreenElement || document.mozFullScreenElement || document.webkitIsFullScreen || document.webkitDisplayingFullscreen);
};

/**
 * Switches the display window normal browser mode and fullscreen.
 * @ignore
 * @returns {Boolean} true if operation was successfull, false otherwise
 */
var toggleFullScreen = function(event) {
   var canvas = getCanvas();
   if (isFullScreen()) {
      if (document.cancelFullScreen) {  
         document.cancelFullScreen();  
      } else if (document.mozCancelFullScreen) {  
         document.mozCancelFullScreen();  
      } else if (document.webkitCancelFullScreen) {  
         document.webkitCancelFullScreen();
      } else {
         return false;
      }
   } else {
      if (canvas.requestFullScreen) {  
         canvas.requestFullScreen();  
      } else if (canvas.mozRequestFullScreen) {  
         canvas.mozRequestFullScreen();  
      } else if (canvas.webkitRequestFullScreen) {  
         canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
      } else {
         return false;
      }
   }
   return true;
};

/**
 * Drawing on the Surface returned by `getSurface()` will draw on the screen.
 * @returns {gamejs.Surface} the display Surface
 */
var getSurface = exports.getSurface = function() {
   var canvas = getCanvas();
   if (SURFACE === null) {
      SURFACE = new Surface([canvas.width, canvas.height]);
      SURFACE._canvas = canvas;
      SURFACE._context = canvas.getContext('2d');
      SURFACE._smooth();
   }
   return SURFACE;
};
