// Script to generate PWA icons using sharp (built-in) or SVG fallback
const fs = require('fs');
const path = require('path');

function createSvgIcon(size) {
  const r = Math.round(size * 0.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size*0.62}" font-size="${size*0.52}" text-anchor="middle" font-family="serif">🎵</text>
</svg>`;
}

const dir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

[192, 512].forEach(size => {
  const svgPath = path.join(dir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, createSvgIcon(size));
  console.log(`Written ${svgPath}`);
});

console.log('SVG icons generated. Copy them as PNG or use as-is for development.');
