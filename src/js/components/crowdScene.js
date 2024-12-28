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
        overflow: 'hidden',
        zIndex: '0',
        pointerEvents: 'none', // Prevent interactions
    });

    // Load the crowd image
    const crowdImage = new Image();
    crowdImage.src = new URL('../../assets/images/crowd-scene.png', import.meta.url).href; // Dynamic path
    Object.assign(crowdImage.style, {
        width: '200%', // Extra-wide for horizontal parallax
        height: 'auto',
        position: 'absolute',
        bottom: '0', // Stick to the bottom
        left: '-50%', // Center the image horizontally
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Parallax effect using GSAP
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

        const xPercent = ((event.clientX / viewportWidth) - 0.5) * 30; // Horizontal shift up to ±30%
        const yPercent = Math.max(Math.min((event.clientY / viewportHeight - 0.5) * 20, 0), -10); // Vertical shift within bounds

        updateParallax(xPercent, yPercent);
    };

    const handleDeviceOrientation = (event) => {
        const xPercent = (event.gamma / 45) * 15; // Map tilt left/right to horizontal parallax
        const yPercent = Math.max(Math.min((event.beta / 90) * -15, 0), -10); // Map tilt up/down to vertical parallax

        updateParallax(xPercent, yPercent);
    };

    // Add event listeners for device type
    if (window.DeviceOrientationEvent && /Mobi/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Optional floating animation
    const floatingAnimation = createFloatingAnimation({
        minX: -1,
        maxX: 1,
        minY: 0,
        maxY: 1,
    });
    floatingAnimation(crowdScene);

    return crowdScene;
};