
jRate - SVG based Rating jQuery plugin
=======================================

This jquery plugin helps to generate SVG based RATING with various fancy features. Download and include this plugin in your html file.

#####[Demo Page](http://www.toolitup.com/jRate.html)

![Demo](https://rawgit.com/senthilporunan/jRate/master/images/jRate-Star-Demo.gif)

![Twitter Demo](https://rawgit.com/senthilporunan/jRate/master/images/jRate-twitter-demo.gif)

## React jRate component

#### [react-jrate](https://github.com/senthilporunan/react-jrate)

### Including it on your page

Include jQuery and this plugin on your page.
```
<script src="jRate.js"></script>

```
### Basic Usage
```
<div id="jRate"></div>
$("#jRate").jRate();
```
#Features
###Start Color and End Color

Set your favourite start and end color. By giving value in the form of hex value, rgb value or standard color name. We can use one color format also by giving same start and end color.

```js
$("#jRate").jRate({
  startColor: "cyan",
  endColor: "blue"
});
```
###Initial Value
Set your own default initial value.
```js
$("#jRate").jRate({
  rating:2
});
```
###Width and Height
We can customize our own value for width and height.
```js
$("#jRate").jRate({
  width: 70,
  height: 70
});
```
####Shape
We can chooose shape from available list. If you need more shapes, raise feature request in github. Available shapes are STAR, RECTANGLE, SQUARE, CIRCLE, RHOMBUS, TRIANGLE.
```js
$("#jRate").jRate({
  shape: 'RHOMBUS'
});
```
####Width and Height Growth
Make the shapes from smaller to bigger. We can use growth field to make this happen.
```js
$("#jRate").jRate({
  widthGrowth: 0.2,
  heightGrowth: 0.2
});
```

####Count
Number of shapes was decided by the count parameter. We can customize own numeric value for it.
```js
$("#jRate").jRate({
  count: 10
});
```
####Background Color
Set your favourite background color. By giving value in the form of hex value, rgb value or standard color name.
```js
$("#jRate").jRate({
  backgroundColor: 'black'
});
```
####Color Transparency
Set transparency value between 0 and 1.
```js
$("#jRate").jRate({
  transparency: 0.5
});
```
####Gap
We can set our own gap between two shapes. We can customize our own values in it.
```js
$("#jRate").jRate({
  shapeGap: '10px'
});
```
####Opacity
Set opacity value.
```js
$("#jRate").jRate({
  opacity: 0.3
});
```

####Minimum and Maximum Value
Set a desired minimum and maximum value.
```js
$("#jRate").jRate({
  min: 10,
  max: 15
});
```
####Precision
Set the precision value.
```js
$("#jRate").jRate({
  precision: 0
});
```
####Stroke Width
Set the stroke width for STAR, CIRCLE, RECTANGLE, RHOMBUS, TRIANGLE only.
```js
$("#jRate").jRate({
  strokeWidth: '25px'
});
```
####Horizontal
We can set a boolean variable to make horizontal or vertical. And, set a boolean value for reverse.
```js
$("#jRate").jRate({
  horizontal: false
});
```
####Reverse
We can set a boolean variable to make reverse or not.
```js
$("#jRate").jRate({
  reverse: true
});
```
####ReadOnly
Set the readonly value.
```js
$("#jRate").jRate({
  readOnly: true
});
```
####onChange
Write your own methods to do own action when the rating value change action occurs.
```js
$("#jRate").jRate({
  onChange: function(rating) {
    $('#demo-onchange-value').text("Your Rating: "+rating);
  }
});
```
####onSet
Write your own methods to do own action when the rating value click or set action occurs.
```js
$("#jRate").jRate({
  onSet: function(rating) {
    $('#demo-onset-value').text("Selected Rating: "+rating);
  }
});
```
####License
This plugin is licensed under the [MIT license](https://github.com/senthilporunan/jRate/blob/master/LICENSE).

Copyright (c) 2015 [Senthil Porunan](http://www.toolitup.com/)
