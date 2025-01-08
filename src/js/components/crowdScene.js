import { gsap } from 'gsap';
import getDeviceInfo from '../utils/deviceUtils';
import { createPictureElement } from '../utils/imageUtils.js';

// Utility: Clamp value between min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const createCrowdScene = (container) => {
    const { isMobile } = getDeviceInfo();

    const settings = {
        image: {
            desktopWidth: 2, // Multiplier for desktop relative to viewport
            mobileWidth: 4, // Multiplier for mobile relative to viewport
            minWidth: 1920, // Minimum width for large displays
            maxWidth: 3840, // Maximum width for 4K displays
            desktopBottom: '-1%',
            mobileBottom: '-1%',
        },
        parallax: {
            maxShiftMultiplier: 0.5, // Limits horizontal parallax shift
        },
    };

    // Calculate dynamic image width
    const calculateImageWidth = () => {
        const multiplier = isMobile ? settings.image.mobileWidth : settings.image.desktopWidth;
        const viewportWidth = window.innerWidth;
        const rawWidth = multiplier * viewportWidth;

        return clamp(rawWidth, settings.image.minWidth, settings.image.maxWidth); // Clamp width
    };

    // Create parallax container
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
    const crowdImageElement = crowdImage.querySelector('img');

    // Apply styles to <img>
    let imageWidth = calculateImageWidth();
    Object.assign(crowdImageElement.style, {
        width: `${imageWidth}px`,
        height: 'auto',
        position: 'absolute',
        bottom: isMobile ? settings.image.mobileBottom : settings.image.desktopBottom,
        left: `${(window.innerWidth - imageWidth) / 2}px`, // Center horizontally
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Parallax logic
    let parallaxX = 0;

    const updateParallax = (xShift) => {
        const maxShift = (imageWidth - window.innerWidth) * settings.parallax.maxShiftMultiplier;
        const clampedShift = clamp(xShift, -maxShift, maxShift);

        gsap.to(crowdImageElement, {
            x: `${clampedShift}px`,
            ease: 'power2.out',
            duration: 0.6,
        });
    };

    const handleMouseMove = (event) => {
        const xShift = ((event.clientX / window.innerWidth) - 0.5) * (imageWidth - window.innerWidth);
        parallaxX = xShift;
        updateParallax(parallaxX);
    };

    const handleDeviceOrientation = (event) => {
        const maxShift = (imageWidth - window.innerWidth) * settings.parallax.maxShiftMultiplier;
        const xShift = (event.gamma / 45) * maxShift;
        parallaxX = xShift;
        updateParallax(parallaxX);
    };

    const handleResize = () => {
        imageWidth = calculateImageWidth();

        Object.assign(crowdImageElement.style, {
            width: `${imageWidth}px`,
            left: `${(window.innerWidth - imageWidth) / 2}px`, // Recenter image
        });

        updateParallax(parallaxX); // Reapply parallax logic
    };

    // Attach event listeners
    if (window.DeviceOrientationEvent && isMobile) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return crowdScene;
};