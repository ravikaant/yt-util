const fs = require('fs');
const { createCanvas } = require('canvas');

const size = 256;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');
const imgData = ctx.createImageData(size, size);
const data = imgData.data;

const cx = size / 2;
const cy = size / 2;

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    // Normalize to -1 to 1
    const nx = (x - cx) / cx;
    const ny = (y - cy) / cy;
    
    // Distance from center
    const r = Math.sqrt(nx*nx + ny*ny);
    
    // Magnification profile (like a glass dome)
    // We want maximum magnification at the center, tapering to 0 at edges.
    // The displacement offset is distance to sample point.
    // For magnification, we sample closer to the center.
    // So offset vector points towards center.
    // Offset vector = (-nx, -ny).
    // The intensity of displacement should be smooth. Let's use a dome curve: Math.cos(r * Math.PI / 2)
    const intensity = r < 1 ? Math.cos(r * Math.PI / 2) : 0;
    
    // R > 128 means positive X displacement.
    // On the left (nx < 0), we want to sample towards center (positive X offset), so R > 128.
    // Thus R = 128 - nx * 127 * intensity
    const rVal = 128 - (nx * 127 * intensity);
    const gVal = 128 - (ny * 127 * intensity);
    
    const i = (y * size + x) * 4;
    data[i] = rVal;
    data[i+1] = gVal;
    data[i+2] = 128; // B doesn't matter
    data[i+3] = 255; // A must be 255
  }
}
ctx.putImageData(imgData, 0, 0);

const base64 = canvas.toDataURL();
fs.writeFileSync('displacement.txt', base64);
console.log("Done");
