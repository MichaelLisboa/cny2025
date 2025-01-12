const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const inputFolder = path.join(__dirname, '../src/assets/images');
const outputFolder = path.join(__dirname, '../public/assets/images');
const resolutions = [480, 768, 1024, 1440, 1920, 3840];

async function processImages() {
  try {
    // Dynamically import p-limit
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(4);

    await fs.emptyDir(outputFolder);
    console.log('Output folder cleared.');

    const files = glob.sync(`${inputFolder}/*.{jpg,png}`);
    const totalFiles = files.length;

    if (totalFiles === 0) {
      console.log('No images found in the input folder.');
      return;
    }

    await fs.ensureDir(outputFolder);

    const tasks = files.map((file, index) =>
      limit(async () => {
        const fileName = path.basename(file, path.extname(file));
        const percentComplete = Math.round(((index + 1) / totalFiles) * 100);
        console.log(`${fileName} - ${percentComplete}%`);

        const tasks = [];

        for (const resolution of resolutions) {
          tasks.push(
            sharp(file)
              .resize({ width: resolution })
              .toFormat('webp')
              .toFile(path.join(outputFolder, `${fileName}-${resolution}.webp`))
          );
        }

        tasks.push(
          sharp(file)
            .toFormat('webp')
            .toFile(path.join(outputFolder, `${fileName}-original.webp`))
        );

        tasks.push(
          fs.copyFile(file, path.join(outputFolder, `${fileName}-original${path.extname(file)}`))
        );

        await Promise.all(tasks);
      })
    );

    await Promise.all(tasks);
    console.log('Image processing complete!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();