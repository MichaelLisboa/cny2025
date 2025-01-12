import { initializeState, dispatch } from '../utils/stateManager.js';
import { createDatePicker } from "../components/DatePicker";
import { determineZodiacAnimalAndElement } from '../utils/GetZodiacAnimal.js';
import { createPictureElement } from '../utils/imageUtils.js';
import { gsap } from 'gsap';

export const enterBirthdateView = () => {
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
        color: "#ffffff", // Text color
        textAlign: "center",
        position: "relative", // Ensure the background image is positioned correctly
        overflow: "hidden", // Prevent overflow
    });

    // Add the background image
    const backgroundImage = createPictureElement('land-and-sky-background.png');
    const backgroundImageElement = backgroundImage.querySelector('img');
    Object.assign(backgroundImageElement.style, {
        position: 'absolute',
        bottom: '-10%', // Fix the bottom of the image
        left: '0',
        width: '125%', // Maintain aspect ratio
        height: 'auto', // Ensure the image fills the viewport height
        minWidth: '200vw', // Ensure the image is larger than the viewport width
        overflow: 'hidden',
        zIndex: '-1', // Ensure it is behind other content
    });
    container.appendChild(backgroundImage);

    // Content Container
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
        zIndex: "1", // Ensure it is above the background image
    });

    // Title
    const title = document.createElement("h1");
    title.textContent = "Enter your birthday for a fortune";
    Object.assign(title.style, {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
    });

    // Subtitle
    const subtitle = document.createElement("p");
    subtitle.textContent = "When did the sky grace us with your presence?";
    Object.assign(subtitle.style, {
        fontSize: "1rem",
        marginBottom: "20px",
    });

    // Input Container
    const inputContainer = document.createElement("div");
    Object.assign(inputContainer.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative", // Ensure the date picker can be positioned relative to this container
    });

    // Create and append the datePicker on load
    const datePicker = createDatePicker((submittedDate) => {
        dispatch({ type: 'SET_BIRTHDATE', payload: submittedDate });

        const { animal, element } = determineZodiacAnimalAndElement(submittedDate);
        dispatch({ type: 'SET_ZODIAC', payload: animal });
        dispatch({ type: 'SET_ELEMENT', payload: element });
    });
    inputContainer.appendChild(datePicker);

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    Object.assign(nextButton.style, {
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#ffb703",
        color: "#001d3d",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "20px", // Add some space between the date picker and the button
    });

    // Append elements to content container
    contentContainer.appendChild(title);
    contentContainer.appendChild(subtitle);
    contentContainer.appendChild(inputContainer);
    contentContainer.appendChild(nextButton);

    // Append content container to main container
    container.appendChild(contentContainer);

    // Handle mouse movement and device orientation
    const handleMovement = (moveX) => {
        const maxMoveX = (backgroundImageElement.clientWidth - window.innerWidth);
        const constrainedMoveX = Math.max(-maxMoveX, Math.min(0, moveX));
        gsap.to(backgroundImageElement, {
            x: constrainedMoveX,
            duration: 1, // Increase duration for smoother motion
            ease: 'power2.out', // Use a smoother easing function
        });
    };

    // Handle mouse movement
    document.addEventListener('mousemove', (event) => {
        const { clientX } = event;
        const { innerWidth } = window;
        const moveX = ((clientX / innerWidth) * 100 - 50) * 2; // Adjust multiplier for desired effect
        handleMovement(moveX);
    });

    // Handle device orientation
    window.addEventListener('deviceorientation', (event) => {
        const { gamma } = event;
        const moveX = (gamma / 45) * 50;
        handleMovement(moveX);
    });

    // Handle touch events for swipe gestures
    let touchStartX = 0;
    let touchMoveX = 0;

    container.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    container.addEventListener('touchmove', (event) => {
        touchMoveX = event.touches[0].clientX;
        const moveX = ((touchMoveX - touchStartX) / window.innerWidth) * 100;
        handleMovement(moveX);
    });

    container.addEventListener('touchend', () => {
        touchStartX = 0;
        touchMoveX = 0;
    });

    // Return the view
    return container;
};