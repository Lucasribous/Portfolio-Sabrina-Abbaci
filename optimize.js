// optimize.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/images/base";
const outputDir = "./public/images/optimized";
const sizes = [320, 640, 1024, 1600];

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function optimizeImages(dir) {
  fs.readdirSync(dir).forEach(file => {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      optimizeImages(inputPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        sizes.forEach(size => {
          sharp(inputPath)
            .resize(size)
            .toFormat("webp", { quality: 80 })
            .toFile(path.join(outputDir, `${baseName}-${size}.webp`))
            .then(() => console.log(`✅ ${file} → ${baseName}-${size}.webp`))
            .catch(err => console.error(err));
        });
      }
    }
  });
}

optimizeImages(inputDir);
// Run this script with `node optimize.js` to generate optimized images.