const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define source and output directories
const srcDir = path.join(__dirname, '../src/assets/images');
const outputDir = path.join(__dirname, '../dist/assets/images');

// Define responsive sizes
const sizes = [480, 768, 1024, 1440, 1920];

// Create the output directory if it doesn’t exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all files in the source directory
fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error(`Error reading source directory: ${err}`);
    process.exit(1);
  }

  // Process each image
  files.forEach((file) => {
    const inputFile = path.join(srcDir, file);

    // Check if the file is an image
    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      sizes.forEach((size) => {
        const outputFile = path.join(
          outputDir,
          `${path.parse(file).name}-${size}${path.extname(file)}`
        );

        sharp(inputFile)
          .resize({ width: size }) // Resize to specific width
          .toFile(outputFile)
          .then(() => {
            console.log(`Processed: ${file} at ${size}px`);
          })
          .catch((err) => {
            console.error(`Error processing ${file} at ${size}px: ${err}`);
          });
      });
    }
  });
});