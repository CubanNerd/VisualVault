import fs from 'fs';
import path from 'path';

const srcPath = 'public/icon.png';
const buildDir = 'build';
const destIcoPath = path.join(buildDir, 'icon.ico');
const destPngPath = path.join(buildDir, 'icon.png');
const customIcoPath = 'public/icon.ico';

try {
  // Ensure build directory exists
  fs.mkdirSync(buildDir, { recursive: true });

  // Copy PNG as icon.png if it exists
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPngPath);
    console.log(`Copied icon.png to ${destPngPath}`);
  }

  // Check if a custom public/icon.ico exists
  if (fs.existsSync(customIcoPath)) {
    fs.copyFileSync(customIcoPath, destIcoPath);
    console.log(`Successfully copied custom ICO from ${customIcoPath} to ${destIcoPath}`);
  } else if (fs.existsSync(srcPath)) {
    // Generate fallback icon.ico using modern PNG-embedded ICO format (Vista and newer)
    const pngBuffer = fs.readFileSync(srcPath);

    // ICO header: 6 bytes
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);   // Reserved
    header.writeUInt16LE(1, 2);   // Type (1 = ICO)
    header.writeUInt16LE(1, 4);   // Number of images in file

    // ICO directory entry: 16 bytes
    const dir = Buffer.alloc(16);
    dir.writeUInt8(0, 0);         // Width (0 means 256 or larger, i.e., 1024px)
    dir.writeUInt8(0, 1);         // Height (0 means 256 or larger, i.e., 1024px)
    dir.writeUInt8(0, 2);         // Number of colors in palette (0 = no palette)
    dir.writeUInt8(0, 3);         // Reserved (must be 0)
    dir.writeUInt16LE(1, 4);      // Color planes (1)
    dir.writeUInt16LE(32, 6);     // Bits per pixel (32-bit RGBA)
    dir.writeUInt32LE(pngBuffer.length, 8); // Size of the PNG image data
    dir.writeUInt32LE(22, 12);    // Offset of the PNG data (6-byte header + 16-byte directory = 22)

    const icoBuffer = Buffer.concat([header, dir, pngBuffer]);
    fs.writeFileSync(destIcoPath, icoBuffer);
    console.log(`Successfully generated fallback ICO file at ${destIcoPath}`);
  } else {
    console.error(`Neither custom ICO nor source PNG was found.`);
    process.exit(1);
  }
} catch (error) {
  console.error('Error generating icons:', error);
  process.exit(1);
}
