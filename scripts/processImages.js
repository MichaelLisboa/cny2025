const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const inputFolder = path.join(__dirname, '../src/assets/images');
const publicOutputFolder = path.join(__dirname, '../public/assets/images');
const distOutputFolder = path.join(__dirname, '../dist/assets/images');
const resolutions = [480, 768, 1024, 1440, 1920, 3840, 960, 1536, 2048, 2880];
const lowResWidth = 20;
const MAX_DIMENSION = 16383; // WebP format limit for width and height

async function processImages() {
  try {
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(8);

    console.log('Starting image processing...');

    // Clear directories
    await fs.emptyDir(publicOutputFolder);
    console.log('Public output folder cleared.');
    await fs.emptyDir(distOutputFolder);
    console.log('Dist output folder cleared.');

    const files = glob.sync(`${inputFolder}/*.{jpg,png}`);
    const totalFiles = files.length;

    if (totalFiles === 0) {
      console.log('No images found in the input folder.');
      return;
    }

    console.log(`Found ${totalFiles} images to process.`);

    await fs.ensureDir(publicOutputFolder);
    await fs.ensureDir(distOutputFolder);

    const tasks = files.map((file, index) =>
      limit(async () => {
        const fileName = path.basename(file, path.extname(file));
        const percentComplete = Math.round(((index + 1) / totalFiles) * 100);
        console.log(`${fileName} - ${percentComplete}%`);

        try {
          // Read image metadata
          const metadata = await sharp(file).metadata();
          const { width, height } = metadata;

          console.log(`Processing ${fileName}: Dimensions ${width}x${height}`);

          // Automatically resize large images to fit within WebP limits
          let resizeOptions = {};
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
            resizeOptions = {
              width: Math.floor(width * scale),
              height: Math.floor(height * scale),
            };
            console.log(
              `Resizing ${fileName} to fit within WebP limits: New dimensions ${resizeOptions.width}x${resizeOptions.height}`
            );
          }

          const tasks = [];

          // Resize for multiple resolutions
          for (const resolution of resolutions) {
            tasks.push(
              sharp(file)
                .resize(resizeOptions.width ? resizeOptions : { width: resolution })
                .toFormat('webp')
                .toFile(path.join(publicOutputFolder, `${fileName}-${resolution}.webp`))
                .catch((err) =>
                  console.error(`Error processing ${fileName} at resolution ${resolution}:`, err.message)
                )
            );
          }

          // Generate low-resolution placeholder
          tasks.push(
            sharp(file)
              .resize({ width: lowResWidth })
              .blur()
              .toFormat('webp')
              .toFile(path.join(publicOutputFolder, `${fileName}-lowres.webp`))
              .catch((err) =>
                console.error(`Error creating low-resolution placeholder for ${fileName}:`, err.message)
              )
          );

          // Generate original WebP version
          tasks.push(
            sharp(file)
              .resize(resizeOptions.width ? resizeOptions : null)
              .toFormat('webp')
              .toFile(path.join(publicOutputFolder, `${fileName}-original.webp`))
              .catch((err) =>
                console.error(`Error creating original WebP for ${fileName}:`, err.message)
              )
          );

          // Copy the original file
          tasks.push(
            fs.copyFile(file, path.join(publicOutputFolder, `${fileName}-original${path.extname(file)}`))
              .then(() => console.log(`Copied ${fileName} to output folder.`))
              .catch((err) => console.error(`Error copying ${fileName}:`, err.message))
          );

          await Promise.all(tasks);
        } catch (error) {
          console.error(`Error processing ${fileName}:`, error.message);
        }
      })
    );

    await Promise.all(tasks);
    console.log('Image processing complete!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();