import { gsap } from 'gsap';
import getDeviceInfo from '../utils/deviceUtils';
import { createPictureElement } from '../utils/imageUtils.js';

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export const createCrowdScene = (container) => {
    const { isMobile } = getDeviceInfo();
  
    const settings = {
      image: {
        desktopWidth: 2, // Desktop image width multiplier relative to viewport width
        mobileWidth: 4.0, // Mobile image width multiplier
        desktopBottom: '-1%', // Desktop bottom offset
        mobileBottom: '-1%', // Mobile bottom offset
      },
      parallax: {
        desktop: { maxHorizontalShift: 30 }, // In percentage
        mobile: { maxHorizontalShift: 50 }, // In percentage
      },
      floatingAnimation: {
        minX: -10,
        maxX: 10,
        minY: -5,
        maxY: 2,
      },
    };
  
    // Calculate dynamic image width
    const calculateImageWidth = () => {
      return isMobile
        ? settings.image.mobileWidth * window.innerWidth
        : settings.image.desktopWidth * window.innerWidth;
    };
  
    let imageWidth = calculateImageWidth();
  
    // Create crowd scene container
    const crowdScene = document.createElement('div');
    crowdScene.id = 'crowdScene';
    Object.assign(crowdScene.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '1',
    });
  
    // Create picture element
    const crowdImage = createPictureElement('crowd-scene.png');
    crowdImage.id = 'crowdImage';
  
    // Apply styles to <img> inside the picture element
    const crowdImageElement = crowdImage.querySelector('img');
    if (crowdImageElement) {
      Object.assign(crowdImageElement.style, {
        width: `${imageWidth}px`,
        height: 'auto',
        position: 'absolute',
        bottom: isMobile ? settings.image.mobileBottom : settings.image.desktopBottom,
        left: `${(window.innerWidth - imageWidth) / 2}px`, // Center image
        transformOrigin: 'center bottom',
      });
    }
  
    // Add the picture element to the crowd scene
    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);
  
    // Parallax logic
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  
    let parallaxX = 0;
  
    const updateParallax = (xShift) => {
      if (crowdImageElement) {
        const maxXShift = (imageWidth - window.innerWidth) / 2;
        const clampedX = clamp(xShift, -maxXShift, maxXShift);
  
        gsap.to(crowdImageElement, {
          x: `${clampedX}px`,
          ease: 'power2.out',
          duration: 0.6,
        });
      }
    };
  
    const handleMouseMove = (event) => {
      const viewportWidth = window.innerWidth;
      const xShift = ((event.clientX / viewportWidth) - 0.5) * (imageWidth - window.innerWidth);
      parallaxX = xShift;
      updateParallax(parallaxX);
    };
  
    const handleResize = () => {
      imageWidth = calculateImageWidth();
      if (crowdImageElement) {
        Object.assign(crowdImageElement.style, {
          width: `${imageWidth}px`,
          left: `${(window.innerWidth - imageWidth) / 2}px`,
        });
        updateParallax(parallaxX);
      }
    };
  
    // Attach event listeners
    if (window.DeviceOrientationEvent && isMobile) {
      window.addEventListener('deviceorientation', (event) => {
        const maxXShift = (imageWidth - window.innerWidth) / 2;
        const xShift = (event.gamma / 45) * maxXShift;
        parallaxX = xShift;
        updateParallax(parallaxX);
      });
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }
  
    window.addEventListener('resize', throttle(handleResize, 150));
  
    return crowdScene;
  };