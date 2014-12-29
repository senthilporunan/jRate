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
;
(function($, undefined) {

    $.fn.jRate = function(options) {

        "use strict";
        var $jRate = $(this);

        var defaults = {
            rating: 0,
            shape: "STAR",
            count: "5",
            width: "20",
            height: "20",
            normalColor: "white",
            startColor: "yellow",
            endColor: "green",
            opacity: 1,
            min: 0,
            max: 5,
            precision: 1,
            readOnly: false,
            onChange: null,
            onSet: null
        };
        var settings = $.extend({}, defaults, options);
        var startColorCoords, endColorCoords;

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

        function setShape() {
            var header = '<svg width="' + settings.width + '" height=' + settings.height + ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink=\"http://www.w3.org/1999/xlink\"';
            var linearGrad = '<defs><linearGradient id="grad">' +
                '<stop offset="0%"  stop-color=' + settings.normalColor + '/>' +
                '<stop offset="0%" stop-color=' + settings.normalColor + '/>' +
                '</linearGradient></defs>';
            var shapeRate;
            switch (settings['shape']) {
                case 'STAR':
                    shapeRate = header + 'viewBox="0 12.705 512 486.59"' + '>' + linearGrad + '<polygon style="fill: url(#grad);stroke:black;stroke-width:2px;" ' + 'points="256.814,12.705 317.205,198.566' + ' 512.631,198.566 354.529,313.435 ' + '414.918,499.295 256.814,384.427 ' + '98.713,499.295 159.102,313.435 ' + '1,198.566 196.426,198.566 "/>' + '</svg>';
                    break;
                case 'CIRCLE':
                    shapeRate = header + '>' + linearGrad + '<circle  cx="' + settings.width / 2 + '" cy="' + settings.height / 2 + '" r="' + settings.width / 2 + '" fill="url(#grad)" style="stroke:black;stroke-width:2px;"/>' + '</svg>';
                    break;
                case 'RECTANGLE':
                    shapeRate = header + '>' + linearGrad + '<rect width="' + settings.width + '" height="' + settings.height + '" fill="url(#grad)" style="stroke:black;stroke-width:2px;"/>' +
                        '</svg>';
                    break;
                case 'TRIANGLE':
                    shapeRate = header + '>' + linearGrad +
                        '<polygon points="' + settings.width / 2 + ',0 0,' + settings.height + ' ' + settings.width + ',' + settings.height + '" fill="url(#grad)" style="stroke:black;stroke-width:2px;"/>' +
                        '</svg>';
                    break;
                case 'RHOMBUS':
                    shapeRate = header + '>' + linearGrad + '<polygon points="' + settings.width / 2 + ',0 ' + settings.width + ',' + settings.height / 2 + ' ' + settings.width / 2 + ',' + settings.height + ' 0,' + settings.height / 2 + '" fill="url(#grad)"  style="stroke:black;stroke-width:2px;"/>' + '</svg>';
                    break;
                default:
                    throw Error("No such shape as " + settings['shape']);
            }

            drawShape(shapeRate);
        }

        function setCSS() {
            // setup css properies
            $jRate.css("white-space", "nowrap");
            $jRate.css("cursor", "pointer");

            $jRate.css('fill', settings['shape']);
        }

        function bindEvents() {
            $jRate.on("mousemove", onMouseEnter)
                .on("mouseenter", onMouseEnter)
                .on("mouseover", onMouseEnter)
                .on("hover", onMouseEnter)
                .on("mouseleave", onMouseLeave)
                .on("mouseout", onMouseLeave)
                .on("click", onMouseClick)
                .on("JRate.change", onChange)
                .on("JRate.set", onSet);
        }

        function showNormalRating() {
            for (var i = 0; i < settings.count; i++) {
                $jRate.find("svg").eq(i).find("#grad").find("stop").eq(0).attr({
                    'offset': '0%'
                });
                $jRate.find("svg").eq(i).find("#grad").find("stop").eq(0).attr({
                    'stop-color': settings.normalColor
                });
                $jRate.find("svg").eq(i).find("#grad").find("stop").eq(1).attr({
                    'offset': '0%'
                });
                $jRate.find("svg").eq(i).find("#grad").find("stop").eq(1).attr({
                    'stop-color': settings.normalColor
                });
            }
        }

        function showRating(rating) {

            showNormalRating();
            var singleValue = (settings.max - settings.min) / settings.count;
            rating = (rating - settings.min) / singleValue;
            var fillColor = settings.startColor;

            //Right To Left operation
            if (settings.rightToLeft) {
                for (var i = 0; i < rating; i++) {
                    $jRate.find("svg").eq(settings.count - 1 - i).find("#grad").find("stop").eq(0).attr({
                        'offset': '100%'
                    });
                    $jRate.find("svg").eq(settings.count - 1 - i).find("#grad").find("stop").eq(0).attr({
                        'stop-color': fillColor
                    });
                    if (rating * 10 % 10 > 0) {
                        console.log('inside if ' + rating);
                        $jRate.find("svg").eq(Math.ceil(settings.count - rating) - 1).find("#grad").find("stop").eq(0).attr({
                            'offset': 100 - (rating * 10 % 10) * 10 + '%'
                        });
                        $jRate.find("svg").eq(Math.ceil(settings.count - rating) - 1).find("#grad").find("stop").eq(0).attr({
                            'stop-color': settings.normalColor
                        });
                        $jRate.find("svg").eq(Math.ceil(settings.count - rating) - 1).find("#grad").find("stop").eq(1).attr({
                            'offset': 100 - (rating * 10 % 10) * 10 + '%'
                        });
                        $jRate.find("svg").eq(Math.ceil(settings.count - rating) - 1).find("#grad").find("stop").eq(1).attr({
                            'stop-color': fillColor
                        });
                    } else {
                        console.log('inside else');
                        console.log(rating);
                    }
                    if (isDefined(endColorCoords)) {
                        fillColor = formulateNewColor(settings.count - 1, i, startColorCoords, endColorCoords);
                    }
                }
            } else {
                for (var i = 0; i < rating; i++) {
                    $jRate.find("svg").eq(i).find("#grad").find("stop").eq(0).attr({
                        'offset': '100%'
                    });
                    $jRate.find("svg").eq(i).find("#grad").find("stop").eq(0).attr({
                        'stop-color': fillColor
                    });
                    if (rating * 10 % 10 > 0) {
                        $jRate.find("svg").eq(Math.ceil(rating) - 1).find("#grad").find("stop").eq(0).attr({
                            'offset': (rating * 10 % 10) * 10 + '%'
                        });
                        $jRate.find("svg").eq(Math.ceil(rating) - 1).find("#grad").find("stop").eq(0).attr({
                            'stop-color': fillColor
                        });
                    }
                    if (isDefined(endColorCoords)) {
                        fillColor = formulateNewColor(settings.count, i, startColorCoords, endColorCoords);
                    }
                }
            }
            // set current rating
            settings.rating = rating;
        }

        var formulateNewColor = function(totalCount, currentVal, startFill, endFill) {
            var avgFill = [];
            for (var i = 0; i < 3; i++) {
                var diff = Math.round((startFill[i] - endFill[i]) / totalCount);
                var newValue = startFill[i] + (diff * (currentVal + 1));
                if (newValue / 256)
                    avgFill[i] = (startFill[i] - (diff * (currentVal + 1))) % 256;
                else
                    avgFill[i] = (startFill[i] + (diff * (currentVal + 1))) % 256;
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

        function onMouseEnter(e) {
            if (settings.readOnly) return;
            var pageX = settings.rightToLeft ? (settings.count * settings.width) - e.pageX : e.pageX;
            var pageLeft = $jRate.offset().left;

            var singleValue = (settings.max - settings.min) / settings.count;
            var rating = (((pageX - pageLeft) / settings.width)) * singleValue;
            rating = settings.min + Number(rating.toFixed(settings.precision));
            showRating(rating);
            $jRate.trigger("JRate.change", {
                rating: rating
            });
        }

        function onMouseLeave() {
            if (!settings.readOnly) {
                showRating(settings.rating);
            }
        }

        function onMouseClick(e) {
            if (settings.readOnly) return;

            var pageX = settings.rightToLeft ? (settings.count * settings.width) - e.pageX : e.pageX;
            var pageLeft = $jRate.offset().left;

            var singleValue = (settings.max - settings.min) / settings.count;
            var rating = (((pageX - pageLeft) / settings.width)) * singleValue;
            settings.rating = settings.min + Number(rating.toFixed(settings.precision));
            showRating(settings.rating);
            $jRate.trigger("JRate.set", {
                rating: settings.rating
            });
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

        function drawShape(shapeRate) {
            for (var i = 0; i < settings.count; i++) {
                $jRate.append(shapeRate);
            }

            showNormalRating();
            showRating(settings.rating);
            $jRate.find("svg").attr({
                width: settings.width,
                height: settings.height
            });
        }

        //TODO
        //Validation implementation
        //Mini to max size
        //Horizontal and  vertical support

        //TODO Add this as a part of validation
        if (settings.startColor) startColorCoords = colorToRGBA(settings.startColor);
        if (settings.endColor) endColorCoords = colorToRGBA(settings.endColor);

        setCSS();
        setShape();
        bindEvents();

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
