function hexToRgb(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  const result = {
    r,
    g,
    b,
  };

  if (alpha) {
    result.a = alpha;
  }

  return result;
}

function rgbStrToObject(rgbStr) {
  if (typeof rgbStr === 'object') {
    return rgbStr;
  }
  if (!rgbStr.includes('rgb')) {
    return {};
  }

  const rgb = rgbStr
    .replace(/rgb(a)?\(/, '')
    .replace(')', '')
    .split(',');
  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);

  const result = { r, g, b };

  if (typeof rgb[3] !== 'undefined') {
    result.a = rgb[3];
  } else {
    result.a = 1;
  }

  return result;
}

function hslStrToObject(hslStr) {
  if (typeof hslStr === 'object') {
    return hslStr;
  }
  if (!hslStr.includes('hsl')) {
    return {};
  }

  const hsl = hslStr
    .replace(/hsl(a)?\(/, '')
    .replace(')', '')
    .split(',');
  const h = parseInt(hsl[0]);
  const s = parseInt(hsl[1]);
  const l = parseInt(hsl[2]);

  const result = { h, s, l };

  if (typeof hsl[3] !== 'undefined') {
    result.a = hsl[3];
  } else {
    result.a = 1;
  }

  return result;
}

function colorObjectToString(color) {
  if (color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b')) {
    if (color.hasOwnProperty('a')) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    } else {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
  } else if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('l')) {
    return `hsl(${color.h}deg, ${color.s}%, ${color.l}%)`;
  }
}

function rgbToHex(rgb) {
  const { r, g, b } = rgbStrToObject(rgb);

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
}

function rgbToHsl(rgb) {
  let { r, g, b } = rgbStrToObject(rgb);

  r /= 255;
  g /= 255;
  b /= 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const l = (min + max) / 2;
  const s = (max - min) / (max + min);
  let h = 0;
  if (r === max) {
    h = (g - b) / (max - min);
  } else if (g === max) {
    h = 2 + (b - r) / (max - min);
  } else if (b === max) {
    h = 4 + (r - g) / (max - min);
  }

  if (h < 0) {
    h += 360;
  }

  h *= 60;

  h = Math.round(h);

  if (h > 360) {
    h %= 360;
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl) {
  let { h, s, l } = hslStrToObject(hsl);

  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function stringToColor(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const num = ('00' + value.toString(16));
    color += num.substring(num.length, 2);
  }
  return color;
}

function generateGradient(hexColor) {
  const from = rgbToHsl(hexToRgb(hexColor));
  const to = { ...from };

  to.h += 90;

  if (to.h > 360) {
    to.h -= 360;
  }

  return {
    from: colorObjectToString(from),
    to: colorObjectToString(to),
  };
}

function invertRgb(color) {
  if (!color.includes('rgb')) {
    return '';
  }

  const rgb = color
    .replace(/rgb(a)?\(/, '')
    .replace(')', '')
    .split(',');
  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);

  let isRgba = false;
  if (typeof rgb[3] !== 'undefined') {
    isRgba = true;
  }

  return `rgb${isRgba ? 'a' : ''}(${255 - r}, ${255 - g}, ${255 - b}${isRgba ? `, ${rgb[3]}` : ''})`;
}

function getBrightness(color) {
  let rgb = color;
  if (typeof color === 'string') {
    if (color.includes('rgb')) {
      rgb = rgbStrToObject(color);
    } else if (color.includes('hsl')) {
      rgb = hslToRgb(color);
    } else if (color.includes('#')) {
      rgb = hexToRgb(color);
    }
  }
  if (!rgb.hasOwnProperty('r') || !rgb.hasOwnProperty('g') || !rgb.hasOwnProperty('b')) {
    if (color.hasOwnProperty('h')) {
      rgb = hslToRgb(color);
    } else {
      rgb = hexToRgb(color);
    }
  }
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

function isDark(color) {
  return getBrightness(color) < 128;
}

function isLight(color) {
  return !isDark(color);
}

export {
  hexToRgb,
  rgbStrToObject,
  hslStrToObject,
  colorObjectToString,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  stringToColor,
  invertRgb,
  generateGradient,
  getBrightness,
  isDark,
  isLight,
};
