import { gsap } from 'gsap';
import { createFloatingAnimation } from '../floatingAnimation.js';

export const createCrowdScene = (container) => {
    // Centralized settings for crowd scene
    const settings = {
        isMobile: window.innerWidth <= 768, // Define mobile breakpoint
        image: {
            desktopWidth: '150%', // Image width for desktop
            mobileWidth: '300%', // Image width for mobile
            desktopLeft: '-25%', // Horizontal offset for desktop
            mobileLeft: '-50%', // Horizontal offset for mobile
            desktopBottom: '-1%', // Vertical alignment for desktop
            mobileBottom: '0%', // Vertical alignment for mobile
        },
        parallax: {
            desktop: {
                maxHorizontalShift: 30, // Max horizontal parallax for desktop
                maxVerticalShift: 15, // Max vertical parallax for desktop
            },
            mobile: {
                maxHorizontalShift: 50, // Max horizontal parallax for mobile
                maxVerticalShift: 25, // Max vertical parallax for mobile
            },
        },
        floatingAnimation: {
            minX: -1, // Minimum horizontal float
            maxX: 1, // Maximum horizontal float
            minY: 0, // Minimum vertical float
            maxY: 1, // Maximum vertical float
        },
    };

    // Determine if the device is mobile or desktop
    const isMobile = settings.isMobile;

    // Create the crowd scene container
    const crowdScene = document.createElement('div');
    Object.assign(crowdScene.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100vw', // Full viewport width
        height: '100vh', // Match viewport height
        overflow: 'hidden',
        zIndex: '0',
        pointerEvents: 'none', // Prevent interactions
    });

    // Load the crowd image
    const crowdImage = new Image();
    crowdImage.src = new URL('../../assets/images/crowd-scene.png', import.meta.url).href;

    // Apply image styles based on settings
    Object.assign(crowdImage.style, {
        width: isMobile ? settings.image.mobileWidth : settings.image.desktopWidth,
        height: 'auto',
        position: 'absolute',
        bottom: isMobile ? settings.image.mobileBottom : settings.image.desktopBottom,
        left: isMobile ? settings.image.mobileLeft : settings.image.desktopLeft,
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Helper function to clamp values
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Initialize GSAP animation state
    let parallaxX = 0;
    let parallaxY = 0;

    // Update parallax using GSAP
    const updateParallax = (xPercent, yPercent) => {
        gsap.to(crowdImage, {
            x: `${xPercent}%`, // Horizontal parallax
            y: `${yPercent}px`, // Vertical parallax
            ease: 'power2.out',
            duration: 0.6,
        });
    };

    // Input handling for parallax (mouse or device tilt)
    const handleMouseMove = (event) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxHorizontalShift = isMobile
            ? settings.parallax.mobile.maxHorizontalShift
            : settings.parallax.desktop.maxHorizontalShift;
        const maxVerticalShift = isMobile
            ? settings.parallax.mobile.maxVerticalShift
            : settings.parallax.desktop.maxVerticalShift;

        let xPercent = ((event.clientX / viewportWidth) - 0.5) * maxHorizontalShift;
        let yPercent = Math.max(Math.min((event.clientY / viewportHeight - 0.5) * maxVerticalShift, 0), -10);

        xPercent = clamp(xPercent, -maxHorizontalShift, maxHorizontalShift);
        yPercent = clamp(yPercent, -maxVerticalShift, maxVerticalShift);

        parallaxX = xPercent;
        parallaxY = yPercent;

        updateParallax(parallaxX, parallaxY);
    };

    const handleDeviceOrientation = (event) => {
        const maxHorizontalShift = isMobile
            ? settings.parallax.mobile.maxHorizontalShift
            : settings.parallax.desktop.maxHorizontalShift;
        const maxVerticalShift = isMobile
            ? settings.parallax.mobile.maxVerticalShift
            : settings.parallax.desktop.maxVerticalShift;

        let xPercent = (event.gamma / 45) * maxHorizontalShift;
        let yPercent = Math.max(Math.min((event.beta / 90) * -maxVerticalShift, 0), -10);

        xPercent = clamp(xPercent, -maxHorizontalShift, maxHorizontalShift);
        yPercent = clamp(yPercent, -maxVerticalShift, maxVerticalShift);

        parallaxX = xPercent;
        parallaxY = yPercent;

        updateParallax(parallaxX, parallaxY);
    };

    // New: Gesture-based parallax for mobile
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleTouchMove = (event) => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];

            const deltaX = touch.clientX - lastTouchX;
            const deltaY = touch.clientY - lastTouchY;

            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;

            const maxHorizontalShift = settings.parallax.mobile.maxHorizontalShift;
            const maxVerticalShift = settings.parallax.mobile.maxVerticalShift;

            let xPercent = clamp(parallaxX + deltaX * 0.2, -maxHorizontalShift, maxHorizontalShift);
            let yPercent = clamp(parallaxY - deltaY * 0.2, -maxVerticalShift, maxVerticalShift);

            parallaxX = xPercent;
            parallaxY = yPercent;

            updateParallax(parallaxX, parallaxY);
        }
    };

    // Add event listeners for device type
    if (window.DeviceOrientationEvent && /Mobi/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        window.addEventListener('touchmove', handleTouchMove); // Add touchmove listener for gestures
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Floating animation for subtle motion
    const floatingAnimation = createFloatingAnimation(settings.floatingAnimation);
    floatingAnimation(crowdScene);

    return crowdScene;
};