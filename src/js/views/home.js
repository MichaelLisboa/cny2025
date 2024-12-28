import { gsap } from 'gsap';
import { createButton } from '../../components/Button.js';

const getlogoImageStyles = () => ({
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -70%)',
    willChange: 'transform',
    maxWidth: '100%',
    height: 'auto',
});

const setupFloatingAnimation = (element, range) => {
    console.log('Animation range:', range);

    // Create floating animation with recalculated values per iteration
    const animate = () => {
        gsap.to(element, {
            x: gsap.utils.random(range.minX, range.maxX, true), // Random X within range
            y: gsap.utils.random(range.minY, range.maxY, true), // Random Y within range
            ease: 'sine.inOut',
            duration: gsap.utils.random(2, 4, true), // Randomized duration
            onComplete: animate, // Recursively restart the animation
        });
    };

    // Start the animation loop
    animate();
};

export const render = () => {
    const app = document.getElementById('app');
    if (!app) {
        console.error('App container not found!');
        return;
    }

    // Create the text image overlay
    const logoImage = new Image();
    logoImage.src = new URL('../../assets/images/logo-text.png', import.meta.url).href;
    Object.assign(logoImage.style, getlogoImageStyles());
    app.appendChild(logoImage);

    // Dynamically adjust text image width (with throttling)
    const adjustlogoImageWidth = () => {
        logoImage.style.width = window.innerWidth <= 1024 ? '80vw' : '30vw';
    };

    // Throttle resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustlogoImageWidth, 150); // Throttle to 150ms
    });
    adjustlogoImageWidth();

    // Add button using the new ButtonComponent
    createButton(app, 'Continue', () => {
        window.history.pushState(null, null, '/about');
        router();
    });

    // Floating Animations
    setupFloatingAnimation(logoImage, { minX: -5, maxX: 5, minY: -20, maxY: 20 });
};