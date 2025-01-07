/**
 * Generate srcset for all responsive sizes
 * @param {string} imageName - Image name without extension
 * @param {string} format - Desired format (e.g., "webp", "png", "jpg")
 * @param {Array<number>} sizes - Array of sizes to include in srcset
 * @returns {string} - srcset string for <source>
 */
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
export const createPictureElement = (imageNameWithExtension) => {
    if (!imageNameWithExtension || !imageNameWithExtension.includes('.')) {
        console.error('Invalid image name provided:', imageNameWithExtension);
        return null;
    }

    const [name, extension] = imageNameWithExtension.split('.');
    const sizes = `(max-width: 480px) 100vw, 
                   (max-width: 768px) 100vw, 
                   (max-width: 1440px) 50vw, 
                   100vw`; // Tailored for responsive widths
    const breakpoints = [480, 768, 1024, 1440, 1920, 3840]; // Expected sizes generated during build

    const picture = document.createElement('picture');

    // Add WebP source
    const sourceWebP = document.createElement('source');
    sourceWebP.srcset = generateSrcset(name, 'webp', breakpoints);
    sourceWebP.type = 'image/webp';
    sourceWebP.sizes = sizes;
    picture.appendChild(sourceWebP);

    // Add fallback source
    const sourceFallback = document.createElement('source');
    sourceFallback.srcset = generateSrcset(name, extension, breakpoints);
    sourceFallback.type = `image/${extension}`;
    sourceFallback.sizes = sizes;
    picture.appendChild(sourceFallback);

    // Add fallback <img> tag
    const img = document.createElement('img');
    img.src = `/assets/images/${name}-original.${extension}`; // Fallback to original image
    img.alt = name;
    img.loading = 'lazy'; // Lazy load for performance
    picture.appendChild(img);

    return picture;
};