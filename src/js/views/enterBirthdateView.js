import { initializeState, dispatch } from '../utils/stateManager.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { createDatePicker } from "../components/DatePicker";
import { determineZodiacAnimalAndElement } from '../utils/getZodiacAnimal.js';
import { createPictureElement } from '../utils/imageUtils.js';
import { createButton } from '../components/Button.js';
import { navigateTo } from '../utils/router.js';
import { gsap } from 'gsap';

export const enterBirthdateView = () => {
    const { isMobile } = getDeviceInfo();

    // Initialize the app state
    initializeState({
        birthdate: null,
        zodiac: null,
        element: null,
    });

    const container = document.createElement("div");
    Object.assign(container.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        color: "#ffffff",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
    });

    // Add the background image
    const backgroundImage = createPictureElement('land-and-sky-background.png');
    const backgroundImageElement = backgroundImage.querySelector('img');
    Object.assign(backgroundImageElement.style, {
        position: 'absolute',
        bottom: isMobile ? '-2%' : '-20%', // Adjusted for desktop responsiveness
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '300%' : '125%', // Adjusted for desktop responsiveness
        height: 'auto',
        minWidth: isMobile ? '200vw' : '120vw', // Dynamic scaling
        overflow: 'hidden',
        zIndex: '-1',
    });
    container.appendChild(backgroundImage);

    const contentContainer = document.createElement("div");
    Object.assign(contentContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        maxWidth: "400px",
        padding: "20px",
        boxSizing: "border-box",
        zIndex: "1",
        marginTop: '-80px',
    });

    const title = document.createElement("h1");
    title.textContent = "Enter your birthday for a fortune";
    Object.assign(title.style, {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
    });

    const subtitle = document.createElement("p");
    subtitle.textContent = "When did the sky grace us with your presence?";
    Object.assign(subtitle.style, {
        fontSize: "1rem",
        marginBottom: "20px",
    });

    const inputContainer = document.createElement("div");
    Object.assign(inputContainer.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative",
    });

    const datePicker = createDatePicker((submittedDate) => {
        dispatch({ type: 'SET_BIRTHDATE', payload: submittedDate });

        const { animal, element } = determineZodiacAnimalAndElement(submittedDate);
        dispatch({ type: 'SET_ZODIAC', payload: animal });
        dispatch({ type: 'SET_ELEMENT', payload: element });

        // Show the next button once a birthdate is selected
        nextButton.style.display = 'block';
    });
    inputContainer.appendChild(datePicker);

    const nextButton = createButton("Next", () => {
        navigateTo('/fortune');
    });
    nextButton.style.display = 'none'; // Hide the button initially

    contentContainer.appendChild(title);
    contentContainer.appendChild(subtitle);
    contentContainer.appendChild(inputContainer);
    contentContainer.appendChild(nextButton);
    container.appendChild(contentContainer);

    // Background movement handler
    const handleBackgroundMovement = (moveX) => {
        const maxMoveX = (backgroundImageElement.clientWidth - window.innerWidth) / 2;
        const constrainedMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, moveX));
        gsap.to(backgroundImageElement, {
            x: constrainedMoveX,
            duration: 1, // Increased duration for smoother transition
            ease: 'power2.out',
        });
    };

    // Mouse movement
    document.addEventListener('mousemove', (event) => {
        const { clientX } = event;
        const moveX = ((clientX / window.innerWidth) - 0.5) * (backgroundImageElement.clientWidth - window.innerWidth) * 0.2; // Reduced sensitivity
        handleBackgroundMovement(moveX);
    });

    // Device orientation
    window.addEventListener('deviceorientation', (event) => {
        const { gamma } = event; // Horizontal tilt
        const moveX = (gamma / 45) * (backgroundImageElement.clientWidth - window.innerWidth) / 4; // Reduced sensitivity
        handleBackgroundMovement(moveX);
    });

    // Touch gestures
    let touchStartX = 0;

    container.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    container.addEventListener('touchmove', (event) => {
        const touchMoveX = event.touches[0].clientX;
        const moveX = ((touchMoveX - touchStartX) / window.innerWidth) * (backgroundImageElement.clientWidth - window.innerWidth) * 0.4; // Reduced sensitivity
        handleBackgroundMovement(moveX);
    });

    return container;
};