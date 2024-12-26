const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define source and output directories
const srcDir = path.join(__dirname, '../src/assets/images');
const outputDir = path.join(__dirname, '../dist/assets/images');

// Define desired output sizes (width in pixels)
const sizes = [480, 768, 1024, 1440, 1920, 3840]; // Includes 4K (3840px)

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all files in the source directory
fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error(`Error reading source directory: ${err}`);
    process.exit(1);
  }

  // Filter and process image files
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  if (imageFiles.length === 0) {
    console.log('No image files found to process.');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to process.`);

  // Process each image file for all sizes and formats
  Promise.all(
    imageFiles.flatMap(file => {
      const inputFile = path.join(srcDir, file);
      const fileNameWithoutExt = path.parse(file).name;

      // Create a promise array for all processing tasks
      const processingTasks = [];

      // Generate 20px-wide low-res placeholder as WebP
      const lowResOutputFile = path.join(outputDir, `${fileNameWithoutExt}-20.webp`);
      const lowResPromise = sharp(inputFile)
        .resize({ width: 20 }) // Resize to 20px width
        .toFormat('webp') // Convert to WebP for transparency support
        .toFile(lowResOutputFile)
        .then(() => {
          console.log(`Processed: ${file} at 20px (Low-res placeholder in WebP)`);
        })
        .catch(err => {
          console.error(`Error processing ${file} at 20px (WebP): ${err.message}`);
        });
      processingTasks.push(lowResPromise);

      // Generate resized images for all sizes
      sizes.forEach(size => {
        const outputFileOriginal = path.join(outputDir, `${fileNameWithoutExt}-${size}${path.extname(file)}`);
        const outputFileWebP = path.join(outputDir, `${fileNameWithoutExt}-${size}.webp`);

        // Process original format
        const originalPromise = sharp(inputFile)
          .resize({ width: size }) // Resize to specific width
          .toFile(outputFileOriginal)
          .then(() => {
            console.log(`Processed: ${file} at ${size}px (Original)`);
          })
          .catch(err => {
            console.error(`Error processing ${file} at ${size}px (Original): ${err.message}`);
          });

        // Process WebP format
        const webpPromise = sharp(inputFile)
          .resize({ width: size }) // Resize to specific width
          .toFormat('webp') // Convert to WebP
          .toFile(outputFileWebP)
          .then(() => {
            console.log(`Processed: ${file} at ${size}px (WebP)`);
          })
          .catch(err => {
            console.error(`Error processing ${file} at ${size}px (WebP): ${err.message}`);
          });

        // Add promises to the task list
        processingTasks.push(originalPromise, webpPromise);
      });

      return processingTasks;
    })
  )
    .then(() => {
      console.log('Image processing complete.');
    })
    .catch(err => {
      console.error(`Unexpected error during processing: ${err.message}`);
    });
});