import { gsap } from 'gsap';
import { createFloatingAnimation } from '../floatingAnimation.js';

export const createCrowdScene = (container) => {
    // Create the crowd scene container
    const crowdScene = document.createElement('div');
    Object.assign(crowdScene.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100vw', // Full viewport width
        height: '100vh', // Match viewport height
        // overflow: 'hidden',
        zIndex: '0',
        pointerEvents: 'none', // Ensure no interference with other inputs
    });

    // Load the crowd image
    const crowdImage = new Image();
    crowdImage.src = new URL('../../assets/images/crowd-scene.png', import.meta.url).href; // Dynamic path resolution
    Object.assign(crowdImage.style, {
        width: '150%', // Wider than viewport for parallax
        height: 'auto',
        position: 'absolute',
        bottom: '-1%', // Stick to the bottom
        left: '-25%', // Center the image horizontally
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Initialize GSAP animation state
    let parallaxX = 0;
    let parallaxY = 0;

    // Update parallax using GSAP
    const updateParallax = (xPercent, yPercent) => {
        gsap.to(crowdImage, {
            x: `${xPercent}px`, // Horizontal shift in pixels
            y: `${yPercent}px`, // Vertical shift in pixels
            ease: 'power2.out',
            duration: 0.6, // Smooth transition
        });
    };

    // Input handling for mouse movement (desktop)
    const handleMouseMove = (event) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const xOffset = ((event.clientX / viewportWidth) - 0.5) * 50; // Up to ±50px horizontal
        const yOffset = Math.max(Math.min((event.clientY / viewportHeight - 0.5) * 30, 0), -15); // Vertical shift range

        parallaxX = xOffset;
        parallaxY = yOffset;

        updateParallax(parallaxX, parallaxY);
    };

    // Input handling for device orientation (mobile)
    const handleDeviceOrientation = (event) => {
        const xOffset = (event.gamma / 45) * 25; // Map tilt left/right to horizontal shift
        const yOffset = Math.max(Math.min((event.beta / 90) * -30, 0), -15); // Map tilt up/down to vertical shift

        parallaxX = xOffset;
        parallaxY = yOffset;

        updateParallax(parallaxX, parallaxY);
    };

    // Add event listeners
    if (window.DeviceOrientationEvent && /Mobi/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Optional floating animation for subtle motion
    const floatingAnimation = createFloatingAnimation({
        minX: -5,
        maxX: 5,
        minY: -10,
        maxY: 10,
    });
    floatingAnimation(crowdScene);

    return crowdScene;
};