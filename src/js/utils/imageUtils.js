const generateSrcset = (imageName, sizes, format) => {
  return sizes
    .map((size) => `/assets/images/${imageName}-${size}.${format} ${size}w`)
    .join(', ');
};

export const createPictureElement = (imageNameWithExtension) => {
  if (!imageNameWithExtension || !imageNameWithExtension.includes('.')) {
    console.warn(`Invalid image name: ${imageNameWithExtension}. Using default fallback.`);
    imageNameWithExtension = 'default.jpg'; // Fallback image
  }

  const [name, extension] = imageNameWithExtension.split('.');
  const sizes = [480, 768, 1024, 1440, 1920, 3840]; // Define responsive breakpoints

  const picture = document.createElement('picture');

  // Add WebP source
  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = generateSrcset(name, sizes, 'webp');
  sourceWebP.type = 'image/webp';
  sourceWebP.sizes = '(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw'; // Adjust sizes for responsive behavior
  picture.appendChild(sourceWebP);

  // Add fallback source
  const sourceFallback = document.createElement('source');
  sourceFallback.srcset = generateSrcset(name, sizes, extension);
  sourceFallback.type = `image/${extension}`;
  picture.appendChild(sourceFallback);

  // Add fallback <img> tag
  const img = document.createElement('img');
  img.src = `/assets/images/${name}-original.${extension}`;
  img.alt = name;
  img.loading = 'lazy'; // Lazy load
  picture.appendChild(img);

  return picture;
};