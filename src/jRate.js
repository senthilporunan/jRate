/*! The MIT License (MIT)

Copyright (c) 2015 Senthil Porunan<senthilraja39@gmail.com>

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
;
(function($, undefined) {

    $.fn.jRate = function(options) {

        "use strict";
        var $jRate = $(this);

        var defaults = {
            rating: 0,
            shape: "STAR",
            count: 5,
            width: "20",
            height: "20",
            widthGrowth: 0.0,
            heightGrowth: 0.0,
            backgroundColor: "white",
            startColor: "yellow",
            endColor: "green",
            strokeColor: "black",
            shapeGap: "0px",
            opacity: 1,
            min: 0,
            max: 5,
            precision: 1,
            horizontal: true,
            reverse: false,
            readOnly: false,
            onChange: null,
            onSet: null
        };
        var settings = $.extend({}, defaults, options);
        var startColorCoords, endColorCoords, shapes;

        function isDefined(name) {
            return typeof name !== "undefined";
        }

        function getRating() {
            if (isDefined(settings))
                return settings.rating;
        }

        function setRating(rating) {
            if (!isDefined(rating) || rating < settings.min || rating > settings.max)
                throw rating + " is not in range(" + min + "," + max + ")";
            showRating(rating);
        }

        function getShape(currValue) {
            var header = '<svg width="' + settings.width + '" height=' + settings.height + ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
            var hz = settings.horizontal;
            var linearGrad = '<defs><linearGradient id="grad'+currValue+'" x1="0%" y1="0%" x2="' + (hz ? 100 : 0) + '%" y2="' + (hz ? 0 : 100) + '%">' +
                '<stop offset="0%"  stop-color=' + settings.backgroundColor + '/>' +
                '<stop offset="0%" stop-color=' + settings.backgroundColor + '/>' +
                '</linearGradient></defs>';
            var shapeRate;
            switch (settings['shape']) {
                case 'STAR':
                    shapeRate = header + 'viewBox="0 12.705 512 486.59"' + '>' + linearGrad + '<polygon style="fill: url(#grad'+currValue+');stroke:' + settings.strokeColor + ';stroke-width:2px;" ' + 'points="256.814,12.705 317.205,198.566' + ' 512.631,198.566 354.529,313.435 ' + '414.918,499.295 256.814,384.427 ' + '98.713,499.295 159.102,313.435 ' + '1,198.566 196.426,198.566 "/>' + '</svg>';
                    break;
                case 'CIRCLE':
                    shapeRate = header + '>' + linearGrad + '<circle  cx="' + settings.width / 2 + '" cy="' + settings.height / 2 + '" r="' + settings.width / 2 + '" fill="url(#grad'+currValue+')" style="stroke:' + settings.strokeColor + ';stroke-width:2px;"/>' + '</svg>';
                    break;
                case 'RECTANGLE':
                    shapeRate = header + '>' + linearGrad + '<rect width="' + settings.width + '" height="' + settings.height + '" fill="url(#grad'+currValue+')" style="stroke:' + settings.strokeColor + ';stroke-width:2px;"/>' +
                        '</svg>';
                    break;
                case 'TRIANGLE':
                    shapeRate = header + '>' + linearGrad +
                        '<polygon points="' + settings.width / 2 + ',0 0,' + settings.height + ' ' + settings.width + ',' + settings.height + '" fill="url(#grad'+currValue+')" style="stroke:' + settings.strokeColor + ';stroke-width:2px;"/>' +
                        '</svg>';
                    break;
                case 'RHOMBUS':
                    shapeRate = header + '>' + linearGrad + '<polygon points="' + settings.width / 2 + ',0 ' + settings.width + ',' + settings.height / 2 + ' ' + settings.width / 2 + ',' + settings.height + ' 0,' + settings.height / 2 + '" fill="url(#grad'+currValue+')"  style="stroke:' + settings.strokeColor + ';stroke-width:2px;"/>' + '</svg>';
                    break;
                default:
                    throw Error("No such shape as " + settings['shape']);
            }
			return shapeRate;
        }

        function setCSS() {
            // setup css properies
            $jRate.css("white-space", "nowrap");
            $jRate.css("cursor", "pointer");

            $jRate.css('fill', settings['shape']);
        }

        function bindEvents($svg, i) {
            $svg.on("mousemove", onMouseEnter(i))
                .on("mouseenter", onMouseEnter(i))
				.on("click", onMouseClick(i))
                .on("mouseover", onMouseEnter(i))
                .on("hover", onMouseEnter(i))
                .on("mouseleave", onMouseLeave)
                .on("mouseout", onMouseLeave)
                .on("JRate.change", onChange)
                .on("JRate.set", onSet);
        }

        function showNormalRating() {
            for (var i = 0; i < settings.count; i++) {
                shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(0).attr({
                    'offset': '0%'
                });
                shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(0).attr({
                    'stop-color': settings.backgroundColor
                });
                shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(1).attr({
                    'offset': '0%'
                });
                shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(1).attr({
                    'stop-color': settings.backgroundColor
                });
            }
        }

        function showRating(rating) {

            showNormalRating();
            var singleValue = (settings.max - settings.min) / settings.count;
            rating = (rating - settings.min) / singleValue;
            var fillColor = settings.startColor;

            if (settings.reverse) {
                for (var i = 0; i < rating; i++) {
					var j = settings.count - 1 - i;
                    shapes.eq(j).find("#grad"+(j+1)).find("stop").eq(0).attr({
                        'offset': '100%'
                    });
                    shapes.eq(j).find("#grad"+(j+1)).find("stop").eq(0).attr({
                        'stop-color': fillColor
                    });
                    if (parseInt(rating) !== rating) {
						var k = Math.ceil(settings.count - rating) - 1;
                        shapes.eq(k).find("#grad"+(k+1)).find("stop").eq(0).attr({
                            'offset': 100 - (rating * 10 % 10) * 10 + '%'
                        });
                        shapes.eq(k).find("#grad"+(k+1)).find("stop").eq(0).attr({
                            'stop-color': settings.backgroundColor
                        });
                        shapes.eq(k).find("#grad"+(k+1)).find("stop").eq(1).attr({
                            'offset': 100 - (rating * 10 % 10) * 10 + '%'
                        });
                        shapes.eq(k).find("#grad"+(k+1)).find("stop").eq(1).attr({
                            'stop-color': fillColor
                        });
                    }
                    if (isDefined(endColorCoords)) {
                        fillColor = formulateNewColor(settings.count - 1, i);
                    }
                }
            } else {
                for (var i = 0; i < rating; i++) {
                    shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(0).attr({
                        'offset': '100%'
                    });
                    shapes.eq(i).find("#grad"+(i+1)).find("stop").eq(0).attr({
                        'stop-color': fillColor
                    });
                    if (rating * 10 % 10 > 0) {
                        shapes.eq(Math.ceil(rating) - 1).find("#grad"+(i+1)).find("stop").eq(0).attr({
                            'offset': (rating * 10 % 10) * 10 + '%'
                        });
                        shapes.eq(Math.ceil(rating) - 1).find("#grad"+(i+1)).find("stop").eq(0).attr({
                            'stop-color': fillColor
                        });
                    }
                    if (isDefined(endColorCoords)) {
                        fillColor = formulateNewColor(settings.count, i);
                    }
                }
            }
        }

        var formulateNewColor = function(totalCount, currentVal) {
            var avgFill = [];
            for (var i = 0; i < 3; i++) {
                var diff = Math.round((startColorCoords[i] - endColorCoords[i]) / totalCount);
                var newValue = startColorCoords[i] + (diff * (currentVal + 1));
                if (newValue / 256)
                    avgFill[i] = (startColorCoords[i] - (diff * (currentVal + 1))) % 256;
                else
                    avgFill[i] = (startColorCoords[i] + (diff * (currentVal + 1))) % 256;
            }
            return "rgba(" + avgFill[0] + "," + avgFill[1] + "," + avgFill[2] + "," + settings.opacity + ")";
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

        function onMouseLeave() {
            if (!settings.readOnly) {
                showRating(settings.rating);
				onChange(null, {rating : settings.rating});
            }
        }

        function onEnterOrClickEvent(e, ith, label, update) {
            if (settings.readOnly) return;

            var svg = shapes.eq(ith - 1);
            var partial;

            if (settings.horizontal) {
                partial = (e.pageX - svg.offset().left) / svg.width();
            } else {
                partial = (e.pageY - svg.offset().top) / svg.height();
            }

            var count = (settings.max - settings.min) / settings.count;
            partial = (settings.reverse) ? partial : 1 - partial;
            var rating = ((settings.reverse ? (settings.max - settings.min - ith + 1) : ith) - partial) * count;
            rating = settings.min + Number(rating.toFixed(settings.precision));
            if (rating <= settings.max && rating >= settings.min) {
                showRating(rating);
                if (update) settings.rating = rating;
                svg.trigger(label, {
                    rating: rating
                });
            }
        }


        function onMouseEnter(i) {
            return function(e) {
                onEnterOrClickEvent(e, i, "JRate.change");
            };
        }

        function onMouseClick(i) {
            return function(e) {
                onEnterOrClickEvent(e, i, "JRate.set", true);
            };
        }

        function onChange(e, data) {
            if (settings.onChange && typeof settings.onChange === "function") {
                settings.onChange.apply(this, [data.rating]);
            }
        }

        function onSet(e, data) {
            if (settings.onSet && typeof settings.onSet === "function") {
                settings.onSet.apply(this, [data.rating]);
            }
        }

        function drawShape() {
            var svg, i, sw, sh;
            for (i = 0; i < settings.count; i++) {
                $jRate.append(getShape(i+1));
            }
            shapes = $jRate.find('svg');
            for (i = 0; i < settings.count; i++) {
                svg = shapes.eq(i);
                bindEvents(svg, i + 1);
                if (!settings.horizontal) {
                    svg.css({
                        'display': 'block',
                        'margin-bottom': settings.shapeGap || '0px'
                    });
                } else {
                    svg.css('margin-right', (settings.shapeGap || '0px'));
                }
                if (settings.widthGrowth) {
                    sw = 'scaleX(' + (1 + settings.widthGrowth * i) + ')';
                    svg.css({
                        'transform': sw,
                        '-webkit-transform': sw,
                        '-moz-transform': sw,
                        '-ms-transform': sw,
                        '-o-transform': sw,
                    });
                }

                if (settings.heightGrowth) {
                    sh = 'scaleY(' + (1 + settings.heightGrowth * i) + ')';
                    svg.css({
                        'transform': sh,
                        '-webkit-transform': sh,
                        '-moz-transform': sh,
                        '-ms-transform': sh,
                        '-o-transform': sh,
                    });
                }
            }
            showNormalRating();
            showRating(settings.rating);
            shapes.attr({
                width: settings.width,
                height: settings.height
            });
        }

        //TODO
        //Validation implementation
        //Mini to max size

        //TODO Add this as a part of validation
        if (settings.startColor) startColorCoords = colorToRGBA(settings.startColor);
        if (settings.endColor) endColorCoords = colorToRGBA(settings.endColor);

        setCSS();
		drawShape();;

        return $.extend({}, this, {
            "getRating": getRating,
            "setRating": setRating,
            "setReadOnly": function(flag) {
                settings.readOnly = flag;
            },
            "isReadOnly": function() {
                return settings.readOnly;
            },
        });
    };
}(jQuery));