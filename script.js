function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result.length !== 4 ? null : [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ];
}

const colors = [];
data.forEach((x) => colors.push({
  name : x.name,
  color : hexToRgb(x.color),
}));

function getLuminosity(color) {
  return [ 0.2126, 0.7152, 0.0722 ].map((x, i) => color[i] * x).reduce((x1, x2) => x1 + x2) / 255;
}

function getClosestColor(color) {
  console.log(colors.map((x) => {
    let difference = 0;
    for (let i = 0; i < 3; i++) {
      difference += Math.abs(color[i] - x.color[i]);
    }
    return { difference, data : x };
  }).sort((x) => x.difference));
  return colors.map((x) => {
    let difference = 0;
    for (let i = 0; i < 3; i++) {
      difference += Math.abs(color[i] - x.color[i]);
    }
    return { difference, data : x };
  }).sort((x1, x2) => x1.difference - x2.difference)[0].data;
}

function getOpposite(color) {
  return color.map((x) => 255 - x);
}

function updateData(color) {
  const brightness = getLuminosity(color);
  [ header, hex, colorData ].forEach((x) => { x.style.color = brightness <= 0.5 ? 'white' : 'black'; });
  colorData.style.visibility = 'visible';
  colorData.innerHTML = `${getClosestColor(color).name}<br>RGB: ${color[0]}, ${color[1]}, ${color[2]}<br>Brightness: ${Math.round(brightness * 100)}%<br>Opposite: ${
    rgbToHex(getOpposite(color))}`;
  document.body.style.backgroundColor = hex.innerHTML;
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if ('0123456789abcdef'.includes(key)) {
    if (hex.innerHTML.length < 7) {
      hex.innerHTML += key;
      if (hex.innerHTML.length === 7) {
        updateData(hexToRgb(hex.innerHTML.substring(1, hex.innerHTML.length)));
      }
    }
  } else if (key === 'backspace') {
    if (hex.innerHTML.length > 1) {
      hex.innerHTML = hex.innerHTML.substring(0, hex.innerHTML.length - 1);
      if (hex.innerHTML.length === 7) {
        colorData.style.visibility = 'hidden';
      }
    }
  }
});


function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(color) {
  return `#${componentToHex(color[0])}${componentToHex(color[1])}${componentToHex(color[2])}`;
}
