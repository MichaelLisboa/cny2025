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
    crowdImage.src = new URL('../../assets/images/crowd-scene.png', import.meta.url).href;

    // Adjust styles based on screen size
    const isMobile = window.innerWidth <= 768; // Mobile breakpoint
    Object.assign(crowdImage.style, {
        width: isMobile ? '300%' : '150%', // Larger on mobile, smaller on desktop
        height: 'auto',
        position: 'absolute',
        bottom: isMobile ? '0' : '-1%', // Raise image slightly higher on mobile
        left: isMobile ? '-50%' : '-25%', // Centered for mobile, slight offset for desktop
        transformOrigin: 'center bottom',
    });

    crowdScene.appendChild(crowdImage);
    container.appendChild(crowdScene);

    // Initialize GSAP animation state
    let parallaxX = 0;
    let parallaxY = 0;

    // Helper to clamp values
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

        // Calculate parallax offset
        let xPercent = ((event.clientX / viewportWidth) - 0.5) * (isMobile ? 50 : 30); // Wider shift on mobile
        let yPercent = Math.max(Math.min((event.clientY / viewportHeight - 0.5) * (isMobile ? 25 : 15), 0), -10); // Adjusted vertical shift

        // Clamp xPercent to prevent gaps
        const maxHorizontalShift = isMobile ? 50 : 30; // Match to width scaling
        xPercent = clamp(xPercent, -maxHorizontalShift, maxHorizontalShift);

        // Update the animation state
        parallaxX = xPercent;
        parallaxY = yPercent;

        updateParallax(parallaxX, parallaxY);
    };

    const handleDeviceOrientation = (event) => {
        let xPercent = (event.gamma / 45) * (isMobile ? 20 : 15); // Responsive horizontal parallax
        let yPercent = Math.max(Math.min((event.beta / 90) * (isMobile ? -20 : -15), 0), -10); // Responsive vertical parallax

        // Clamp xPercent to prevent gaps
        const maxHorizontalShift = isMobile ? 20 : 15; // Match to width scaling
        xPercent = clamp(xPercent, -maxHorizontalShift, maxHorizontalShift);

        // Update the animation state
        parallaxX = xPercent;
        parallaxY = yPercent;

        updateParallax(parallaxX, parallaxY);
    };

    // Add event listeners for device type
    if (window.DeviceOrientationEvent && /Mobi/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Floating animation for subtle motion
    const floatingAnimation = createFloatingAnimation({
        minX: -1,
        maxX: 1,
        minY: 0,
        maxY: 1,
    });
    floatingAnimation(crowdScene);

    return crowdScene;
};