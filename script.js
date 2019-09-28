"use strict";

var colors = [];
$.getJSON("https://raw.githubusercontent.com/flamesdev/chromaticity/master/color palette.json", function (json) {
	Array.prototype.forEach.call(json, i => {
		colors.push(new ColorData(i.Name, i.Color));
	});
});

var headerElement, hexElement, dataElement;
window.onload = function () {
	headerElement = document.getElementById("header");
	hexElement = document.getElementById("hex");
	dataElement = document.getElementById("data");
}

document.addEventListener("keydown", function (event) {
	var key = String.fromCharCode(event.keyCode).toLowerCase();
	if ("0123456789abcdef".includes(key)) {
		if (hexElement.innerHTML.length < 7) {
			hexElement.innerHTML += key;
			if (hexElement.innerHTML.length == 7)
				updateData(hexToRGB(hexElement.innerHTML.substring(1, hexElement.innerHTML.length)));
		}
	} else if (event.keyCode === 8) {
		if (hexElement.innerHTML.length > 1) {
			hexElement.innerHTML =
				hexElement.innerHTML.substring(0, hexElement.innerHTML.length - 1);
			if (hexElement.innerHTML.length === 7)
				dataElement.style.visibility = "hidden";
		}
	}
});

function updateData(color) {
	var brightness = getLuminosity(color);
	Array.prototype.forEach.call([header, hexElement, dataElement], i => {
		i.style.color = brightness <= 0.5 ? "white" : "black";
	});
	dataElement.style.visibility = "visible";
	dataElement.innerHTML = getClosestColor(color).name + "<br>RGB: " +
		color.r + ", " + color.g + ", " + color.b + "<br>Brightness: " +
		Math.round(brightness * 100) + "%<br>Opposite: " + rgbToHex(getOpposite(color));
	document.body.style.backgroundColor = hexElement.innerHTML;
}

function getOpposite(color) {
	return new Color(255 - color.r, 255 - color.g, 255 - color.b);
}

function getLuminosity(color) {
	return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
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
	if (result.length !== 4)
		return null;

	return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

function getClosestColor(color) {
	var closest, colorData;
	Array.prototype.forEach.call(colors, i => {
		var similarity = Math.abs(color.r - i.color.r) + Math.abs(color.g - i.color.g) + Math.abs(color.b - i.color.b);
		if (closest == null || similarity < closest) {
			closest = similarity;
			colorData = i;
		}
	});
	return colorData;
}

function Color(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function ColorData(name, color) {
	this.name = name;
	this.color = hexToRGB(color);
}