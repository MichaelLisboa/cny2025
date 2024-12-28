import { gsap } from 'gsap';
import { createFloatingAnimation } from '../floatingAnimation.js';

export const createCrowdScene = (container) => {
    const settings = {
        isMobile: window.innerWidth <= 768,
        image: {
            desktopWidth: 1.5, // Desktop image width multiplier relative to viewport width
            mobileWidth: 3.0, // Mobile image width multiplier
            desktopBottom: '-1%', // Desktop bottom offset
            mobileBottom: '0%', // Mobile bottom offset
        },
        parallax: {
            desktop: {
                maxHorizontalShift: 30, // In percentage
            },
            mobile: {
                maxHorizontalShift: 50, // In percentage
            },
        },
        floatingAnimation: {
            minX: -1,
            maxX: 1,
            minY: 0,
            maxY: 1,
        },
    };

    const isMobile = settings.isMobile;

    // Calculate image width and offsets dynamically
    const imageWidth = isMobile
        ? settings.image.mobileWidth * window.innerWidth
        : settings.image.desktopWidth * window.innerWidth;

    const crowdScene = document.createElement('div');
    Object.assign(crowdScene.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: '0',
        pointerEvents: 'none',
    });

    const crowdImage = new Image();
    crowdImage.src = new URL('../../assets/images/crowd-scene.png', import.meta.url).href;

    Object.assign(crowdImage.style, {
        width: `${imageWidth}px`, // Dynamically set image width
        height: 'auto',
        position: 'absolute',
        bottom: isMobile ? settings.image.mobileBottom : settings.image.desktopBottom,
        left: `${(window.innerWidth - imageWidth) / 2}px`, // Center image initially
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    let parallaxX = 0;

    const updateParallax = (xShift) => {
        const maxXShift = (imageWidth - window.innerWidth) / 2; // Calculate clamping based on image and viewport width
        const clampedX = clamp(xShift, -maxXShift, maxXShift); // Clamp horizontal shift

        gsap.to(crowdImage, {
            x: `${clampedX}px`, // Horizontal parallax in pixels
            ease: 'power2.out',
            duration: 0.6,
        });
    };

    const handleMouseMove = (event) => {
        const viewportWidth = window.innerWidth;

        const xShift = ((event.clientX / viewportWidth) - 0.5) * (imageWidth - window.innerWidth);

        parallaxX = xShift;

        updateParallax(parallaxX);
    };

    const handleDeviceOrientation = (event) => {
        const maxXShift = (imageWidth - window.innerWidth) / 2;
        const xShift = (event.gamma / 45) * maxXShift;

        parallaxX = xShift;

        updateParallax(parallaxX);
    };

    let startTouch = { x: 0 };

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        startTouch = { x: touch.clientX };
    };

    const handleTouchMove = (event) => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - startTouch.x;

            const maxXShift = (imageWidth - window.innerWidth) / 2;
            const xShift = parallaxX + deltaX * 0.2; // Adjust sensitivity for touch

            parallaxX = clamp(xShift, -maxXShift, maxXShift);

            startTouch = { x: touch.clientX }; // Reset touch reference

            updateParallax(parallaxX);
        }
    };

    if (window.DeviceOrientationEvent && /Mobi/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    const floatingAnimation = createFloatingAnimation(settings.floatingAnimation);
    floatingAnimation(crowdScene);

    return crowdScene;
};