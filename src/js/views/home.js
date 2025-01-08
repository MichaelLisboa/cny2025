import { navigateTo } from '../utils/router.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { createPictureElement } from '../utils/imageUtils.js';
import { gsap } from 'gsap';
import { createFloatingAnimation } from '../utils/floatingAnimation.js';
import { initThreeScene } from '../threeScene.js';
import { createCrowdScene } from '../components/crowdScene';
import { createButton } from '../components/Button.js';

const { isMobile, oS, deviceType, browser } = getDeviceInfo();

export const home = () => {

    // Create the main container div
    const getMainContainerStyles = () => ({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
    });
    const mainContainer = document.createElement('div');
    Object.assign(mainContainer.style, getMainContainerStyles());
    mainContainer.className = 'home-container';

    // Create the content container div
    const getContentContainerStyles = () => ({
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, 0)', // Center horizontally, do not shift vertically
        textAlign: 'center',
        width: '80%',
        maxWidth: '600px',
        opacity: '0', // Start with opacity 0 for fade-in effect
        zIndex: '2', // Ensure it is above the crowd scene
    });
    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, getContentContainerStyles());
    contentContainer.className = 'content-container';

    // Logo image
    const getLogoImageStyles = () => ({
        maxWidth: '100%',
        width: isMobile ? '80vw' : '30vw',
        height: 'auto',
        margin: '0 auto', // Center horizontally
    });
    const logoImage = createPictureElement('logo-text.png');
    const logoImageElement = logoImage.querySelector('img');
    Object.assign(logoImageElement.style, getLogoImageStyles());

    // Create the text div with <p> tag
    // Text div styles
    const getTextDivStyles = () => ({
        textAlign: 'center',
        marginTop: '1rem',
        color: '#ffffff',
    });
    const textDiv = document.createElement('div');
    Object.assign(textDiv.style, getTextDivStyles());
    textDiv.className = 'copy-block';
    const textParagraph = document.createElement('p');
    textParagraph.className = 'text-medium'; // Assign the CSS class
    textParagraph.textContent = 'Share wishes with your loved ones, slithering into the new year with hope, wisdom, and lucky fortunes.'; // Add your desired text
    textDiv.appendChild(textParagraph);

    // Create the button container div
    const getButtonContainerStyles = () => ({
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
    });
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    Object.assign(buttonContainer.style, getButtonContainerStyles());

    // Add the button
    createButton(buttonContainer, 'Continue', () => {
        window.history.pushState(null, null, '/');
        navigateTo('/enter-birthdate');
    }, false);

    // Initialize the Three.js scene
    initThreeScene(mainContainer, isMobile, oS, deviceType, browser); // Pass app & isMobile as needed

    // Create the crowd scene
    createCrowdScene(mainContainer);

    // Append all elements to the main container
    contentContainer.appendChild(logoImage);
    contentContainer.appendChild(textDiv);
    contentContainer.appendChild(buttonContainer);
    mainContainer.appendChild(contentContainer);

    // Append the main container to the app
    const app = document.getElementById('app');
    app.appendChild(mainContainer);

    // Fade in the main container using GSAP
    gsap.to(contentContainer, { opacity: 1, duration: 1.5 });

    // Apply floating animation to the main container
    const containerAnimation = createFloatingAnimation({
        minX: -5,
        maxX: 5,
        minY: -10,
        maxY: 10, // Remove vertical movement to prevent sliding down
    });
    containerAnimation(contentContainer); // Apply to the content container

    return mainContainer;
};