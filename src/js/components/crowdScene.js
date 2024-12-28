import { gsap } from 'gsap';
import { createFloatingAnimation } from '../floatingAnimation.js';

export const createCrowdScene = (container, imagePath) => {
    // Create the crowd scene container
    const crowdScene = document.createElement('div');
    Object.assign(crowdScene.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '100vh', // Match the viewport height
        overflow: 'hidden',
        zIndex: '2',
        pointerEvents: 'none', // Ensure no interference with other inputs
    });

    // Create the image
    const crowdImage = new Image();
    crowdImage.src = imagePath;
    Object.assign(crowdImage.style, {
        width: '120%', // Make the image larger than the viewport for parallax
        height: 'auto',
        position: 'absolute',
        bottom: '0', // Stick to the bottom
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Initialize GSAP animation state
    let parallaxX = 0;
    let parallaxY = 0;

    // Parallax effect using GSAP
    const updateParallax = (xOffset, yOffset) => {
        gsap.to(crowdImage, {
            x: `${xOffset}px`, // Horizontal movement
            y: `${yOffset}px`, // Vertical movement
            ease: 'power2.out', // Smooth easing
            duration: 0.6, // Smooth transition duration
        });
    };

    // Input handling for parallax
    const handleMouseMove = (event) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate offset in pixels for horizontal and vertical movement
        const xOffset = ((event.clientX / viewportWidth) - 0.5) * (viewportWidth * 0.05); // Horizontal shift
        const yOffset = Math.max(Math.min((event.clientY / viewportHeight - 0.5) * 50, 0), -20); // Vertical shift

        parallaxX = xOffset;
        parallaxY = yOffset;

        updateParallax(parallaxX, parallaxY);
    };

    const handleDeviceOrientation = (event) => {
        const xOffset = (event.gamma / 45) * (window.innerWidth * 0.05); // Map tilt left/right to horizontal shift
        const yOffset = Math.max(Math.min((event.beta / 90) * -30, 0), -20); // Map tilt up/down to vertical shift

        parallaxX = xOffset;
        parallaxY = yOffset;

        updateParallax(parallaxX, parallaxY);
    };

    // Add listeners based on device type
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Optional floating animation for subtle randomness
    const floatingAnimation = createFloatingAnimation({
        minX: -2,
        maxX: 2,
        minY: 0,
        maxY: 2,
    });
    floatingAnimation(crowdScene);

    return crowdScene;
};