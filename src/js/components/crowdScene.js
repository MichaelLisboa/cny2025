import { gsap } from 'gsap';
import getDeviceInfo from '../deviceUtils';

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
            desktop: {
                maxHorizontalShift: 30, // In percentage
            },
            mobile: {
                maxHorizontalShift: 50, // In percentage
            },
        },
        floatingAnimation: {
            minX: -10,
            maxX: 10,
            minY: -5,
            maxY: 2,
        },
    };

    // Calculate image width and offsets dynamically
    const imageWidth = isMobile
        ? settings.image.mobileWidth * window.innerWidth
        : settings.image.desktopWidth * window.innerWidth;

    const crowdScene = document.createElement('div');
    Object.assign(crowdScene.style, {
        position: 'absolute',
        bottom: isMobile ? settings.image.mobileBottom : settings.image.desktopBottom,
        left: '0',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: '1', // Ensure it is below the router view
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

    const createFloatingAnimation = (range) => {
        return (element) => {
            const animate = () => {
                gsap.to(element, {
                    x: gsap.utils.random(range.minX, range.maxX, true), // Random X within range
                    y: gsap.utils.random(range.minY, range.maxY, true), // Random Y within range
                    ease: 'sine.inOut',
                    duration: gsap.utils.random(0.5, 2, true), // Randomized duration
                    onComplete: animate, // Recursively restart the animation
                });
            };
            animate(); // Start the animation
        };
    };

    const floatingAnimation = createFloatingAnimation(settings.floatingAnimation);
    floatingAnimation(crowdImage);

    return crowdScene;
};