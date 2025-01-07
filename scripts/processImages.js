const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const inputFolder = path.join(__dirname, '../src/assets/images');
const outputFolder = path.join(__dirname, '../public/assets/images');
const resolutions = [480, 768, 1024, 1440, 1920, 3840];

async function processImages() {
  try {
    const files = glob.sync(`${inputFolder}/*.{jpg,png}`);
    await fs.ensureDir(outputFolder);

    for (const file of files) {
      const fileName = path.basename(file, path.extname(file));

      for (const resolution of resolutions) {
        // Generate WebP format
        const webpOutput = path.join(outputFolder, `${fileName}-${resolution}.webp`);
        await sharp(file)
          .resize({ width: resolution })
          .toFormat('webp')
          .toFile(webpOutput);

        // Generate fallback format (use original file's format: JPEG/PNG)
        const fallbackOutput = path.join(outputFolder, `${fileName}-${resolution}${path.extname(file)}`);
        await sharp(file)
          .resize({ width: resolution })
          .toFile(fallbackOutput);
      }

      // Generate original WebP and fallback formats without resizing
      const originalWebpOutput = path.join(outputFolder, `${fileName}-original.webp`);
      await sharp(file)
        .toFormat('webp')
        .toFile(originalWebpOutput);

      const originalFallbackOutput = path.join(outputFolder, `${fileName}-original${path.extname(file)}`);
      await sharp(file)
        .toFile(originalFallbackOutput);

      console.log(`Processed ${fileName}`);
    }
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();