import { createButton } from '../components/Button.js';
import { createFloatingAnimation } from '../floatingAnimation.js';

// Logo image styles
const getLogoImageStyles = () => ({
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '0 auto', // Center horizontally
});

// Text div styles
const getTextDivStyles = () => ({
    textAlign: 'center',
    marginTop: '1rem',
    color: '#ffffff',
});

// Button container styles
const getButtonContainerStyles = () => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
});

// Main container styles
const getMainContainerStyles = () => ({
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -80%)',
    textAlign: 'center',
    width: '80%',
});

export const render = () => {
    const app = document.getElementById('app');
    if (!app) {
        console.error('App container not found!');
        return;
    }

    // Create the main container div
    const mainContainer = document.createElement('div');
    Object.assign(mainContainer.style, getMainContainerStyles());

    // Create the logo image
    const logoImage = new Image();
    logoImage.src = new URL('../../assets/images/logo-text.png', import.meta.url).href;
    Object.assign(logoImage.style, getLogoImageStyles());

    // Create the text div with <p> tag
    const textDiv = document.createElement('div');
    Object.assign(textDiv.style, getTextDivStyles());
    const textParagraph = document.createElement('p');
    textParagraph.className = 'text-medium'; // Assign the CSS class
    textParagraph.textContent = 'Share wishes with your loved ones, slithering into the new year with hope, wisdom, and lucky fortunes.'; // Add your desired text
    textDiv.appendChild(textParagraph);

    // Create the button container div
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, getButtonContainerStyles());

    // Add the button
    createButton(buttonContainer, 'Continue', () => {
        window.history.pushState(null, null, '/about');
        router();
    }, false);

    // Append all elements to the main container
    mainContainer.appendChild(logoImage);
    mainContainer.appendChild(textDiv);
    mainContainer.appendChild(buttonContainer);

    // Append the main container to the app
    app.appendChild(mainContainer);

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

    // Apply floating animation to the main container
    const containerAnimation = createFloatingAnimation({ minX: -5, maxX: 5, minY: -20, maxY: 20 });
    containerAnimation(mainContainer); // Apply to the main container
};