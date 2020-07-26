let colors = [];
data.forEach(x => colors.push({
  name: x.Name,
  color: hexToRgb(x.Color),
}));

document.addEventListener("keydown", function (event) {
  let key = String.fromCharCode(event.keyCode).toLowerCase();
  if ("0123456789abcdef".includes(key)) {
    if (hex.innerHTML.length < 7) {
      hex.innerHTML += key;
      if (hex.innerHTML.length === 7) {
        updateData(hexToRgb(hex.innerHTML.substring(1, hex.innerHTML.length)));
      }
    }
  } else if (event.keyCode === 8) {
    if (hex.innerHTML.length > 1) {
      hex.innerHTML = hex.innerHTML.substring(0, hex.innerHTML.length - 1);
      if (hex.innerHTML.length === 7) {
        colorData.style.visibility = "hidden";
      }
    }
  }
});

function updateData(color) {
  let brightness = getLuminosity(color);
  [header, hex, colorData].forEach(x => x.style.color = brightness <= 0.5 ? "white" : "black");
  colorData.style.visibility = "visible";
  colorData.innerHTML = getClosestColor(color).name + "<br>RGB: " + color[0] + ", " + color[1] + ", " + color[2] + "<br>Brightness: " + Math.round(brightness * 100) + "%<br>Opposite: " +
    rgbToHex(getOpposite(color));
  document.body.style.backgroundColor = hex.innerHTML;
}

function getOpposite(color) {
  return color.map(x => 255 - x);
}

function getLuminosity(color) {
  return (0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]) / 255;
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
  return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result.length !== 4) {
    return null;
  }

  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function getClosestColor(color) {
  let closest;
  let closestColor;
  colors.forEach(x => {
    let similarity = Math.abs(color[0] - x.color[0]) + Math.abs(color[1] - x.color[1]) + Math.abs(color[2] - x.color[2]);
    if (closest === null || similarity < closest) {
      closest = similarity;
      closestColor = x;
    }
  });
  return closestColor;
}
