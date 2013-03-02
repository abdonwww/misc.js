/*****************************************
 *
 *  Cross browser requestAnimationFrame
 *  To know more detail, go to the following link
 *  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
*****************************************/
window.requestAnimFrame = (function(callback) {
	var agent = navigator.userAgent
	if(agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1){
		return function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	}
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

/*****************************************
 *
 *  AnimFrame Constructor
 *  For manageing the plural animation canvases.
 *  Usage:
 *   1. Instantiate this Constructor: var animeFrame = new AnimFrame();
 *   2. Set animation objects extended from AnimCanvas Constructor: animeFrame.push(anim01); animeFrame.push(anim02); ...
 *   3. Call the start method: animeFrame.start();
 *   4. Be able to stop animations by calling the stop method (no used in Clocklinks): animeFrame.stop();
 *
*****************************************/
var AnimFrame = (function(){
	function F(){}
	var stack = [];
	var isAnimating;
	
	F.prototype.push = function(instance){
		stack.push(instance);
	};
	F.prototype.stop = function(){
		isAnimating = false;
	};
	F.prototype.start = function(){
		isAnimating = true;
		init();
		animate();
	};
	
	function init(){
		for(var i=0, l=stack.length; i<l; i++) {
			stack[i].init();
		}
	}
	
	function animate(){
		if(isAnimating) {
			requestAnimFrame(function() {
				animate();
			});
		}
		for(var i=0, l=stack.length; i<l; i++) {
			stack[i].render();
		}
	};
	return F;
})();

/*****************************************
 *
 *  AnimCanvas Constructor
 *  This is used as a base of animation canvas.
 *
*****************************************/
var AnimCanvas = (function(){
	/* Constructor */
	function F(){
		this.id;
	    this.canvas;
	    this.context;
		this.time;
	    this.startTime;
		this.fps;
		this.fpsStep;
		this.fpsTime;
	}
	
	/* Public Methods */	
	// setCanvas() is required to call for identifying the canvas to use
	F.prototype.setCanvas = function(canvasId){
		this.id = canvasId;
		this.canvas = document.getElementById(this.id);
		this.context = this.canvas.getContext("2d");
	};
	
	// createCanvas() is required to call for 
	F.prototype.createCanvas = function(width, height){
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = width;
		this.canvas.height = height;
	};
	
	// setFps() is arbitrary to change the fps
	// if not called, the canvas is rendered right when animation gets ready
	F.prototype.setFps = function(fps){
		this.fps = fps;
		this.fpsStep = 1000 / fps;
		this.fpsFrame;
	};
	
	// init() is called by the AnimFrame constructor when starting Animation
	F.prototype.init = function(){
		this.startTime = (new Date()).getTime();
	};
	
	// render() is called by the AnimFrame constructor each time to render
	F.prototype.render = function(){
		this.time = (new Date()).getTime() - this.startTime;
		
		if(this.fps){
			var millisecond = this.time % 1000;
			var currentFpsFrame = Math.floor(millisecond / this.fpsStep);
			if(this.fpsFrame != currentFpsFrame){
				this.fpsFrame = currentFpsFrame;
				this.draw();
			}
		} else {
			this.draw();
		}
	};
	return F;
})();



/*****************************************
 *
 *	Sample Constructor extended by AnimCanvas
 *
*****************************************/
var Sample = (function(){
	/* Constructor */
	function F(){}
	
	/* Inheritance */
	F.prototype = new AnimCanvas();
	F.prototype.__super__ = AnimCanvas.prototype;
	F.prototype.init = function(){
		this.__super__.init.apply(this, arguments);
	};
	
	/* Private Valuables (don't change the values) */
	var canvas, context, time;
	
	/* Private Functions */
	
	/* Public Methods */
	F.prototype.draw = function(){
		canvas = this.canvas;
		context = this.context;
		time = this.time;
		
		/* Clear and save initial setting  */
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		
		/********* Draw from here *********/
		
		
		
		/********* Revert to initial setting *********/
		context.restore();
	}
	return F;
})();




/* Create Instance */
var sample = new Sample();
sample.setCanvas("id"); // or sample.createCanvas(width, height);

/* Start Animation */
var animFrame = new AnimFrame();
animFrame.push(sample);
animFrame.start();
