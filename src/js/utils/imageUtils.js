export const createPictureElement = (imageNameWithExtension) => {
  const [name, extension] = imageNameWithExtension.split('.');

  const sizes = `(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 200vw`; // Account for large displays
  const breakpoints = [480, 768, 1024, 1440, 1920, 3840];

  const picture = document.createElement('picture');

  // Add WebP source
  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = breakpoints
      .map((size) => `/assets/images/${name}-${size}.webp ${size}w`)
      .join(', ');
  sourceWebP.type = 'image/webp';
  sourceWebP.sizes = sizes;
  picture.appendChild(sourceWebP);

  // Add fallback source
  const sourceFallback = document.createElement('source');
  sourceFallback.srcset = breakpoints
      .map((size) => `/assets/images/${name}-${size}.${extension} ${size}w`)
      .join(', ');
  sourceFallback.type = `image/${extension}`;
  sourceFallback.sizes = sizes;
  picture.appendChild(sourceFallback);

  // Add fallback <img>
  const img = document.createElement('img');
  img.src = `/assets/images/${name}-original.${extension}`;
  img.alt = name;
  img.loading = 'lazy'; // Lazy loading for performance
  picture.appendChild(img);

  return picture;
};