/**
 * Generate srcset for all responsive sizes
 * @param {string} imageName - Image name without extension
 * @param {string} format - Desired format (e.g., "webp", "png", "jpg")
 * @param {Array<number>} sizes - Array of sizes to include in srcset
 * @returns {string} - srcset string for <source>
 */

const sizes = `(max-width: 480px) 80vw, 
               (max-width: 768px) 80vw, 
               (max-width: 1440px) 50vw, 
               (max-width: 1920px) 60vw, 
               (min-width: 1921px) 60vw`; // Tailored for responsive widths
const breakpoints = [480, 768, 1024, 1440, 1920, 3840, 960, 1536, 2048, 2880]; // Added 2x and 3x sizes

const generateSrcset = (imageName, format, sizes) => {
  return sizes
    .map((size) => `/assets/images/${imageName}-${size}.${format} ${size}w`)
    .join(', ');
};

/**
 * Create a <picture> element with WebP and fallback sources
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.png")
 * @returns {HTMLPictureElement} - The created <picture> element
 */
export const createPictureElement = (imageNameWithExtension, customAlt = "") => {
  if (!imageNameWithExtension || !imageNameWithExtension.includes('.')) {
      console.error('Invalid image name provided:', imageNameWithExtension);
      return null;
  }

  const [name, extension] = imageNameWithExtension.split('.');

  const picture = document.createElement('picture');

  // Add WebP source
  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = generateSrcset(name, 'webp', breakpoints);
  sourceWebP.type = 'image/webp';
  sourceWebP.sizes = sizes;
  picture.appendChild(sourceWebP);

  // Add fallback <img> tag with low-resolution placeholder
  const img = document.createElement('img');
  img.src = `/assets/images/${name}-lowres.webp`; // Low-resolution placeholder

  // Generate meaningful alt text
  img.alt = customAlt || name
      .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letters

  img.classList.add('blur-up'); // Add a class for styling the blur-up effect
  img.loading = 'lazy'; // Lazy load for better performance

  // Placeholder styles
  Object.assign(img.style, {
      width: '100%',
      height: '100%',
      objectFit: 'cover', // Ensure the placeholder matches final image dimensions
      transition: 'opacity 0.5s ease, filter 0.5s ease', // Smooth transition
      filter: 'blur(10px)', // Initial blur for placeholder
  });

  // Onload event for smooth blur-up transition
  img.onload = () => {
      img.style.filter = 'none'; // Remove the blur effect
      img.classList.remove('blur-up'); // Remove blur-up class once loaded
      img.src = `/assets/images/${name}-original.${extension}`; // Replace with original image
  };

  picture.appendChild(img);

  return picture;
};