/*! The MIT License (MIT)

Copyright (c) 2014 Prince John Wesley <princejohnwesley@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/

;(function ($, undefined) {

    "use strict";
	//Default values
	var Options = [], Node = [];
			
	var defaultValues = {
		rating: "3",
		shape: "STAR",
		count: "5",
		width: "40",
		height: "50",
		normalFill: "red",
		startRatedFill: "green",
		minValue: 0,
		maxValue: 5,
		precision: 1,
		readOnly: false,
		onChange: null,
		onSet: null
	};
	
	function isDefined(name) {
		return typeof name !==  "undefined";
	}
	
	/**
	** Constructor begins here for Rating
	**/

	function JRate(node, options) {
	
		//Validation implementation
		//Mini to max size
		//Left to Right and Right to Left  -- Done
		//Multiple color --- done
		//Event Handling
		//Horizontal and  vertical support 
		

		this.initialize = function (optionName, param) {

			if (!isDefined(optionName) || !isDefined(param)) {
				return options;
			}
			
			//initialize node to some basic css property
			node.css("white-space", "nowrap");
			node.css("cursor","pointer");
			
			Options = options;
			Node = node;
			switch (optionName) {
				case "shape":
					//setShape(node, param);
					break;
				case "normalFill":
					setNormalFill(node, param);
					break;
				default:
					break;
			}

			bindEvents(node);
			return options[optionName];
		};	
	}
	
	function getRating() {
		if (isDefined(Options))
			return Options.rating;
		else	
			return 0;
	}
	
	function getShape(paramValue, currValue) {
		var header = '<svg width="' + Options.width + '" height=' + Options.height +' xmlns="http://www.w3.org/2000/svg" xmlns:xlink=\"http://www.w3.org/1999/xlink\"';
		var linearGrad = '<defs><linearGradient id="grad'+currValue+'">'+
							'<stop offset="0%"  stop-color='+Options.normalFill+'/>'+
							'<stop offset="0%" stop-color='+Options.normalFill+'/>'+
						'</linearGradient></defs>';
		switch(paramValue) {
			case 'STAR':
				var shape = header + 'viewBox="0 12.705 512 486.59"' + '>'
						+ linearGrad 
						+ '<polygon style="fill: url(#grad'+currValue+');stroke:black;stroke-width:2px;" '
                        +  'points="256.814,12.705 317.205,198.566'
									+  ' 512.631,198.566 354.529,313.435 '
                                    +  '414.918,499.295 256.814,384.427 '
                                    +  '98.713,499.295 159.102,313.435 '
                                    +  '1,198.566 196.426,198.566 "/>'
									+ '</svg>';
				break;
			case 'CIRCLE':
				var shape = header + '>' + linearGrad 
						+ '<circle  cx="'+Options.width/2+'" cy="'+Options.height/2+'" r="'+Options.width/2+'" fill="url(#grad'+currValue+')" style="stroke:black;stroke-width:2px;"/>'
						+ '</svg>';
				break;
			case 'RECTANGLE':
				var shape = header + '>' + linearGrad + '<rect width="'+Options.width+'" height="'+Options.height+'" fill="url(#grad'+currValue+')" style="stroke:black;stroke-width:2px;"/>'+
								'</svg>';
				break;
			case 'TRIANGLE':
				var shape = header  + '>' 
						+ linearGrad + 
						'<polygon points="'+Options.width/2+',0 0,'+Options.height+' '+Options.width+','+Options.height+'" fill="url(#grad'+currValue+')" style="stroke:black;stroke-width:2px;"/>'+
						'</svg>';
				break;
			case 'RHOMBUS':
				var shape = header  + '>' 
					+ linearGrad 
					+ '<polygon points="'+Options.width/2+',0 '+Options.width+','+Options.height/2+' '+Options.width/2+','+Options.height+' 0,'+Options.height/2
					+ '" fill="url(#grad'+currValue+')"  style="stroke:black;stroke-width:2px;"/>'
					+ '</svg>';
				break;
			default:
				throw Error("No such shape as " + paramValue);
		}
		return shape;
	}
	
	function setNormalFill(node, paramValue) {
		node.css('fill', paramValue);
	}
	
	function bindEvents(node) {
		node.on("mousemove", onMouseEnter)
			.on("mouseenter", onMouseEnter)
			.on("mouseover", onMouseEnter)
			.on("hover", onMouseEnter)
			.on("mouseleave", onMouseLeave)
			.on("mouseout", onMouseLeave)
			.on("click", onMouseClick)
            .on("JRate.change", onChange)
            .on("JRate.set", onSet);
	}
	
	function showNormalRating(node) {
		for (var i = 0; i < Options.count; i++) {
			node.find("svg").eq(i).find("#grad"+(i+1)).find("stop").eq(0).attr({'offset': '0%'});
			node.find("svg").eq(i).find('#grad'+(i+1)).find("stop").eq(0).attr({'stop-color': Options.normalFill});
			node.find("svg").eq(i).find('#grad'+(i+1)).find("stop").eq(1).attr({'offset': '0%'});
			node.find("svg").eq(i).find('#grad'+(i+1)).find("stop").eq(1).attr({'stop-color': Options.normalFill});
		}
	}
	
	function showRating(rating) {
		showNormalRating(Node);
		var singleValue = (Options.maxValue - Options.minValue)/Options.count;
		rating = (rating-Options.minValue)/singleValue;
		var startFill = Options.startRatedFill;
		
		//Right To Left operation 
		if (Options.rightToLeft) {
			for (var i = 0; i < rating; i++) {
				//console.log("Start Fill: "+startFill);
				Node.find("svg").eq(Options.count-1-i).find('#grad'+(i+1)).find("stop").eq(0).attr({'offset': '100%'});
				Node.find("svg").eq(Options.count-1-i).find('#grad'+(i+1)).find("stop").eq(0).attr({'stop-color': startFill});
				if (rating*10 % 10 > 0) {
					Node.find("svg").eq(Math.ceil(Options.count-rating)-1).find('#grad'+(i+1)).find("stop").eq(0).attr({'offset': 100-(rating*10 %10)*10+'%'});
					Node.find("svg").eq(Math.ceil(Options.count-rating)-1).find('#grad'+(i+1)).find("stop").eq(0).attr({'stop-color': Options.normalFill});
					Node.find("svg").eq(Math.ceil(Options.count-rating)-1).find('#grad'+(i+1)).find("stop").eq(1).attr({'offset': 100-(rating*10 %10)*10+'%'});
					Node.find("svg").eq(Math.ceil(Options.count-rating)-1).find('#grad'+(i+1)).find("stop").eq(1).attr({'stop-color': startFill});
				}
				if (isDefined(Options.endRatedFill)) {
					var startRatedFill = colorToRGBA(Options.startRatedFill);
					var endRatedFill = colorToRGBA(Options.endRatedFill);
					startFill = formulateNewColor(Options.count-1, i, startRatedFill, endRatedFill);
				}
			}
			return;
		}
		
		for (var i=0; i < rating; i++) {
			Node.find("svg").eq(i).find('#grad'+(i+1)).find("stop").eq(0).attr({'offset': '100%'});
			Node.find("svg").eq(i).find('#grad'+(i+1)).find("stop").eq(0).attr({'stop-color': startFill});
			if (rating*10 % 10 > 0) {
				Node.find("svg").eq(Math.ceil(rating)-1).find('#grad'+(i+1)).find("stop").eq(0).attr({'offset': (rating*10 %10)*10+'%'});
				Node.find("svg").eq(Math.ceil(rating)-1).find('#grad'+(i+1)).find("stop").eq(0).attr({'stop-color': startFill});
			}
			if (isDefined(Options.endRatedFill)) {
				var startRatedFill = colorToRGBA(Options.startRatedFill);
				var endRatedFill = colorToRGBA(Options.endRatedFill);
				startFill = formulateNewColor(Options.count, i, startRatedFill, endRatedFill);
			}
		}
	}
	
	var formulateNewColor = function(totalCount, currentVal, startFill, endFill) {
		var avgFill = [];
		for (var i=0; i < 3; i++) {
			//console.log("StartFill: "+startFill[i]+" End Fill: "+endFill[i]);
			var diff = Math.round((startFill[i] - endFill[i])/totalCount);
			var newValue = startFill[i] + (diff * (currentVal+1));
			if (newValue/256)
				avgFill[i] = (startFill[i] - (diff * (currentVal+1)))%256;
			else	
				avgFill[i] = (startFill[i] + (diff * (currentVal+1)))%256;
			//console.log("i = "+i+" Value: "+avgFill[i]+" Diff: "+diff);
		}
		//console.log("rgb("+avgFill[0]+","+avgFill[1]+","+avgFill[2]+",1)");
		return "rgba("+avgFill[0]+","+avgFill[1]+","+avgFill[2]+",1)";
	};
	


	function colorToRGBA(color) {
		var cvs, ctx;
		cvs = document.createElement('canvas');
		cvs.height = 1;
		cvs.width = 1;
		ctx = cvs.getContext('2d');
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 1, 1);
		return ctx.getImageData(0, 0, 1, 1).data;
	}
	
	function onMouseEnter(e) {
		var pageX = Options.rightToLeft ? (Options.count*Options.width)-e.pageX : e.pageX;
		var pageLeft = Node.offset().left;
		
		var singleValue = (Options.maxValue - Options.minValue)/Options.count;
		var rating = (((pageX-pageLeft)/Options.width)) * singleValue;
		rating = Options.minValue + Number(rating.toFixed(Options.precision));
		if (!Options.readOnly) {
			showRating(rating); 
		}
		Node.trigger("JRate.change", {rating: rating});
	}
	
	function onMouseLeave() {
		if (!Options.readOnly) {
			showRating(Options.rating);
		}
	}
	
	function onMouseClick(e) {
		var pageX = Options.rightToLeft ? (Options.count*Options.width)-e.pageX : e.pageX;
		var pageLeft = Node.offset().left;
		
		var singleValue = (Options.maxValue - Options.minValue)/Options.count;
		var rating = (((pageX-pageLeft)/Options.width)) * singleValue;
		if (!Options.readOnly) {
			Options.rating = Options.minValue + Number(rating.toFixed(Options.precision));
			showRating(Options.rating);
		}
		//console.log("Rating: "+Options.rating);
		Node.trigger("JRate.set", {rating: Options.rating});
	}
	
	function onChange(e, data) {
		if(Options.onChange && typeof Options.onChange === "function") {
			Options.onChange.apply(this, [data.rating]);
      }
	}
	
	function onSet(e, data) {
		if(Options.onSet && typeof Options.onSet === "function") {
			Options.onSet.apply(this, [data.rating]);
      }
	}
	function drawShape(node) {
		for (var i = 0; i < Options.count; i++) {
			node.append(getShape(Options.shape, i+1));
		}
		
		showNormalRating(node);
		showRating(Options.rating);
		node.find("svg")
                  .attr({width: Options.width,height: Options.height});
	}
	
	
	function _jRate(options) {
		
		var node = $(this);
		options = $.extend(JSON.parse(JSON.stringify(defaultValues)), options);
		var newObject = new JRate(node, options);
		
		$.each(options, function (paramName, paramValue) {
			newObject.initialize(paramName, paramValue);
		});
		drawShape(node);
	}
		
	function jRate() {
		return _jRate.apply(this, Array.prototype.slice.apply(arguments, []));
	}
		
	$.fn.jRate = jRate;

}(jQuery));

