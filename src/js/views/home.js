import { createButton } from '../components/Button.js';
import { createFloatingAnimation } from '../floatingAnimation.js';

// Logo image styles
const getLogoImageStyles = () => ({
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -70%)',
    willChange: 'transform',
    maxWidth: '100%',
    height: 'auto',
});

// Render function
export const render = () => {
    const app = document.getElementById('app');
    if (!app) {
        console.error('App container not found!');
        return;
    }

    // Create the text image overlay
    const logoImage = new Image();
    logoImage.src = new URL('../../assets/images/logo-text.png', import.meta.url).href;
    Object.assign(logoImage.style, getLogoImageStyles());
    app.appendChild(logoImage);

    // Dynamically adjust logo image width (with throttling)
    const adjustLogoImageWidth = () => {
        logoImage.style.width = window.innerWidth <= 1024 ? '80vw' : '30vw';
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustLogoImageWidth, 150); // Throttle to 150ms
    });
    adjustLogoImageWidth();

    // Add button using the new ButtonComponent
    createButton(app, 'Continue', () => {
        window.history.pushState(null, null, '/about');
        router();
    }, false);

    // Apply floating animations
    const logoAnimation = createFloatingAnimation({ minX: -5, maxX: 5, minY: -20, maxY: 20 });
    logoAnimation(logoImage); // Apply to logo
};