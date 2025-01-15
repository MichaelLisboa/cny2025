import { createPictureElement } from '../utils/imageUtils.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { gsap } from 'gsap';

export const createBaseLayout = ({
    backgroundImage = 'default-image.png',
    contentContainerStyles = {},
    scrollable = true,
    animationSettings = { intensity: 0.2, easing: 'power2.out' },
    additionalLayers = [],
    gradientBackground = null,
    onMouseMove = null,
    onTouchStart = null,
}) => {
    const { isMobile } = getDeviceInfo();

    // Main container
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
    });

    // Add gradient background if provided
    if (gradientBackground) {
        container.style.background = gradientBackground;
    }

    // Background image
    const background = createPictureElement(backgroundImage);
    const backgroundImageElement = background.querySelector('img');
    Object.assign(backgroundImageElement.style, {
        position: 'absolute',
        bottom: isMobile ? '-2%' : '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '300%' : '125%',
        height: 'auto',
        zIndex: '-1',
    });
    container.appendChild(background);

    // Add additional layers
    additionalLayers.forEach((layer) => container.appendChild(layer));

    // Content container
    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '128px 24px',
        boxSizing: 'border-box',
        zIndex: '1',
        overflowY: scrollable ? 'scroll' : 'hidden',
        ...contentContainerStyles,
    });
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

    // Return both the container and the contentContainer
    return { container, contentContainer };
};