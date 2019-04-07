"use strict";

var colors = [];
$.getJSON("https://raw.githubusercontent.com/flamesdev/chromaticity/master/color palette.json", function (json) {
	for (var i = 0; i < json.length; i++) {
		var item = json[i];
		colors.push(new ColorData(item.Name, item.Color));
	}
});

var hexElement;
var nameElement;
var rgbElement;
var brightnessElement;
var oppositeElement;
window.onload = function () {
	INIT();
}

function INIT() {
	hexElement = document.getElementById("hex");
	nameElement = document.getElementById("name");
	rgbElement = document.getElementById("rgb");
	brightnessElement = document.getElementById("brightness");
	oppositeElement = document.getElementById("opposite");
	textElements = [document.getElementById("header"), hexElement, nameElement, rgbElement, brightnessElement, nameElement, oppositeElement];
	dataElements = [nameElement, rgbElement, brightnessElement, oppositeElement];
}

document.addEventListener("keydown", function (event) {
	var key = String.fromCharCode(event.keyCode).toLowerCase();
	if ("0123456789abcdef".includes(key)) {
		if (hexElement.innerHTML.length < 7) {
			hexElement.innerHTML += key;
			if (hexElement.innerHTML.length == 7)
				UpdateData(hexToRGB(hexElement.innerHTML.substring(1, hexElement.innerHTML.length)));
		}
	} else
	if (event.keyCode === 8) {
		var length = hexElement.innerHTML.length;
		if (length > 1) {
			hexElement.innerHTML =
				hexElement.innerHTML.substring(0, hexElement.innerHTML.length - 1);
			if (length === 7)
				Array.prototype.forEach.call(dataElements, i => {
					i.style.visibility = "hidden";
				});
		}
	}
});

var textElements;
var dataElements;

function UpdateData(color) {
	var brightness = GetLuminosity(color);
	var setColor;
	if (brightness <= 0.5)
		setColor = "white";
	else
		setColor = "black";
	Array.prototype.forEach.call(textElements, i => {
		i.style.color = setColor;
	});
	Array.prototype.forEach.call(dataElements, i => {
		i.style.visibility = "visible";
	});
	nameElement.innerHTML = GetClosestColor(color).Name;
	rgbElement.innerHTML = "RGB: " +
		color.r + ", " + color.g + ", " + color.b;
	brightnessElement.innerHTML = "Brightness: " +
		Math.round(brightness * 100) + "%";
	oppositeElement.innerHTML = "Opposite: " + rgbToHex(GetOpposite(color));
	document.body.style.backgroundColor = hexElement.innerHTML;
}

function GetOpposite(color) {
	return new Color(255 - color.r, 255 - color.g, 255 - color.b);
}

function GetLuminosity(color) {
	return (0.2126 * color.r +
		0.7152 * color.g +
		0.0722 * color.b) / 255;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
	return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function hexToRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result.length === 4)
		return new Color(
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16));
	else
		return null;
}

function GetClosestColor(color) {
	var closest;
	var index;
	for (var i = 0; i < colors.length; i++) {
		var item = colors[i];
		var similarity = Math.abs(color.r - item.Color.r) +
			Math.abs(color.g - item.Color.g) +
			Math.abs(color.b - item.Color.b);
		if (closest == null || similarity < closest) {
			closest = similarity;
			index = i;
		}
	}
	return colors[index];
}

function Color(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function ColorData(Name, Color) {
	this.Name = Name;
	this.Color = hexToRGB(Color);
}