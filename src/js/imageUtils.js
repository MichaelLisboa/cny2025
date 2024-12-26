const isProduction = import.meta.env.PROD;

/**
 * Get the responsive image path based on the screen width and environment
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.jpg")
 * @param {number} screenWidth - Screen width to determine appropriate size
 * @param {boolean} isProduction - Whether the environment is production
 * @param {string} format - Desired format in production (e.g., "webp" or "jpg")
 * @returns {string} - Path to the responsive image
 */
export const getResponsiveImagePath = (
  imageNameWithExtension,
  screenWidth,
  isProduction = false,
  format = 'webp'
) => {
  // Parse the image name and extension
  const [name, extension] = imageNameWithExtension.split('.');
  if (!name || !extension) {
    throw new Error(`Invalid image name provided: ${imageNameWithExtension}`);
  }

  // Define breakpoints for responsive images
  const sizes = [480, 768, 1024, 1440, 1920, 3840];
  const closestSize = sizes.reduce((prev, curr) => (Math.abs(curr - screenWidth) < Math.abs(prev - screenWidth) ? curr : prev));

  // Development: Use the original image
  if (!isProduction) {
    return new URL(`../assets/images/${imageNameWithExtension}`, import.meta.url).href;
  }

  // Production: Use the responsive image
  return `assets/images/${name}-${closestSize}.${format}`;
};

/**
 * Get the low-resolution placeholder image path
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.jpg")
 * @returns {string} - Path to the low-res placeholder
 */
export const getPlaceholderImagePath = (imageNameWithExtension) => {
  const [name] = imageNameWithExtension.split('.');
  if (!name) {
    throw new Error(`Invalid image name provided: ${imageNameWithExtension}`);
  }
  return `assets/images/${name}-20.webp`; // Assuming low-res images are suffixed with "-20"
};

/**
 * Utility to handle image paths based on environment and use cases
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.jpg")
 * @param {number} screenWidth - Screen width for responsive images
 * @param {boolean} isProduction - Whether the environment is production
 * @param {boolean} usePlaceholder - Whether to use the placeholder image
 * @returns {string} - Path to the appropriate image
 */
export const getImagePath = (imageNameWithExtension, screenWidth, isProduction, usePlaceholder = false) => {
  if (usePlaceholder) {
    return getPlaceholderImagePath(imageNameWithExtension);
  }
  return getResponsiveImagePath(imageNameWithExtension, screenWidth, isProduction);
};

/**
 * Create an image element with the appropriate source and blur-up effect
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.jpg")
 * @param {number} screenWidth - Screen width for responsive images
 * @param {boolean} isProduction - Whether the environment is production
 * @returns {HTMLImageElement} - The created image element
 */
export const createImageElement = (imageNameWithExtension, screenWidth, isProduction) => {
  const placeholderImageUrl = getImagePath(imageNameWithExtension, screenWidth, isProduction, true);
  const fullImageUrl = getImagePath(imageNameWithExtension, screenWidth, isProduction, false);

  const img = document.createElement('img');
  img.src = isProduction ? placeholderImageUrl : fullImageUrl;
  img.alt = imageNameWithExtension;
  if (isProduction) {
    img.className = 'blur-up'; // Add blur-up class for initial blur effect in production
    img.onload = () => {
      img.src = fullImageUrl;
      img.classList.remove('blur-up'); // Remove blur-up class once high-res image is loaded
    };
  }
  return img;
};

/**
 * Create a picture element with the appropriate sources for responsive images
 * @param {string} imageNameWithExtension - Full image name with extension (e.g., "example.jpg")
 * @param {number} screenWidth - Screen width for responsive images
 * @param {boolean} isProduction - Whether the environment is production
 * @returns {HTMLPictureElement} - The created picture element
 */
export const createPictureElement = (imageNameWithExtension, screenWidth, isProduction) => {
  const fullImageUrl = getImagePath(imageNameWithExtension, screenWidth, isProduction, false);
  const originalImageUrl = new URL(`../assets/images/${imageNameWithExtension}`, import.meta.url).href;

  const picture = document.createElement('picture');
  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = fullImageUrl;
  sourceWebP.type = 'image/webp';
  const img = createImageElement(imageNameWithExtension, screenWidth, isProduction);
  picture.appendChild(sourceWebP);
  picture.appendChild(img);

  if (!isProduction) {
    const fallbackImg = document.createElement('img');
    fallbackImg.src = originalImageUrl;
    fallbackImg.alt = imageNameWithExtension;
    picture.appendChild(fallbackImg);
  }

  return picture;
};
