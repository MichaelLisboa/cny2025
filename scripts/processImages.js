const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const pLimit = require('p-limit');

const inputFolder = path.join(__dirname, '../src/assets/images');
const outputFolder = path.join(__dirname, '../public/assets/images');
const resolutions = [480, 768, 1024, 1440, 1920, 3840];
const concurrencyLimit = 5; // Adjust this value based on your system's capabilities
const limit = pLimit(concurrencyLimit);

async function processImage(file, index, total) {
  const fileName = path.basename(file, path.extname(file));

  const tasks = resolutions.map((resolution) => {
    const webpOutput = path.join(outputFolder, `${fileName}-${resolution}.webp`);
    return limit(() =>
      sharp(file)
        .resize({ width: resolution })
        .toFormat('webp')
        .toFile(webpOutput)
    );
  });

  // Generate original WebP format
  const originalWebpOutput = path.join(outputFolder, `${fileName}-original.webp`);
  tasks.push(
    limit(() =>
      sharp(file)
        .toFormat('webp')
        .toFile(originalWebpOutput)
    )
  );

  // Copy the original image without resizing
  const originalFallbackOutput = path.join(outputFolder, `${fileName}-original${path.extname(file)}`);
  tasks.push(limit(() => fs.copyFile(file, originalFallbackOutput)));

  await Promise.all(tasks);
  const percentComplete = ((index + 1) / total) * 100;
  console.log(`${fileName} - ${percentComplete.toFixed(2)}%`);
}

async function processImages() {
  try {
    // Clear out old files and create new folders
    await fs.emptyDir(outputFolder);

    const files = glob.sync(`${inputFolder}/*.{jpg,png}`);
    await fs.ensureDir(outputFolder);

    const totalFiles = files.length;
    const tasks = files.map((file, index) => limit(() => processImage(file, index, totalFiles)));
    await Promise.all(tasks);
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();