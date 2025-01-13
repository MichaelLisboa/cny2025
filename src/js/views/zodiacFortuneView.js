import { getState } from '../utils/stateManager.js';
import { createPictureElement } from '../utils/imageUtils.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { gsap } from 'gsap';
import { zodiacData } from '../fortune-data.js';

export default function zodiacFortuneView() {
    const { isMobile } = getDeviceInfo(); // Determine if the device is mobile

    // Main container for the view
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
    });

    // Add the background image
    const backgroundImage = createPictureElement('land-and-sky-background.png');
    const backgroundImageElement = backgroundImage.querySelector('img');
    Object.assign(backgroundImage.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
    });
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

    // Content container for layout and styling
    const contentContainer = document.createElement("div");
    Object.assign(contentContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: '128px 24px 172px', // Pushed down by 128px, with 172px padding at the bottom
        boxSizing: "border-box",
        zIndex: "1",
        overflowX: 'hidden',
        overflowY: 'scroll',
    });

    const fortuneContainer = document.createElement("div");
    Object.assign(contentContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
    });



    // Fetch the zodiac animal and element from state
    const state = getState();
    const { zodiac, element } = state || { zodiac: 'Snake', element: 'Metal' }; // Fallback values

    // Find matching zodiac entry in fortune-data
    const currentZodiac = zodiacData.find(
        item => item.slug.toLowerCase() === (zodiac || '').toLowerCase()
    ) || {};

    // Replace the static fortunes array with dynamic data
    const fortunes = [
        {
            title: "Your Yearly Outlook",
            body: currentZodiac.story || "No story available."
        },
        {
            title: "Career",
            body: currentZodiac.careerDescription || "No career info available."
        },
        {
            title: "Health",
            body: currentZodiac.healthDescription || "No health info available."
        },
        {
            title: "Relationships",
            body: currentZodiac.relationshipDescription || "No relationship info available."
        }
    ];

    // Zodiac image section
    const zodiacImageContainer = document.createElement('div');
    Object.assign(zodiacImageContainer.style, {
        position: 'relative',
        width: '100%',
        height: '70vh', // Images take up 70% of vertical height
        marginBottom: '1.5rem',
    });

    // Element background image
    const elementImage = createPictureElement(`${element.toLowerCase()}.png`);
    const elementImageElement = elementImage.querySelector('img');
    Object.assign(elementImageElement.style, {
        position: 'absolute',
        top: isMobile ? '-256px' : '-128px', // Fixed to 72px from the top of the viewport
        left: isMobile ? '-25%' : '-15%', // Offset to the left for mobile devices
        width: isMobile ? '130%' : '110%', // Larger size for mobile devices
        height: isMobile ? '130%' : '110%',
        opacity: '0.5', // Semi-transparent
        objectFit: 'contain',
        zIndex: '1',
    });
    zodiacImageContainer.appendChild(elementImage);

    // Zodiac foreground image
    const zodiacImage = createPictureElement(`zodiac-${zodiac.toLowerCase()}.png`);
    const zodiacImageElement = zodiacImage.querySelector('img');
    Object.assign(zodiacImageElement.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%', // Zodiac image is larger
        height: '100%',
        objectFit: 'contain',
        zIndex: '2',
    });
    zodiacImageContainer.appendChild(zodiacImage);

    // Title Section
    const title = document.createElement('h1');
    title.textContent = `${element} ${zodiac}`;
    Object.assign(title.style, {
        textAlign: 'center',
        color: 'white', // Text color
    });

    // Fortune Section
    const fortuneSection = document.createElement('div');
    Object.assign(fortuneSection.style, {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        color: 'white', // Text color
        maxWidth: '600px',
    });

    fortunes.forEach((fortune) => {
        const fortuneTitle = document.createElement('h3');
        fortuneTitle.textContent = fortune.title;
        Object.assign(fortuneTitle.style, {
            textAlign: 'center',
            color: 'white', // Text color
        });

        const fortuneBody = document.createElement('p');
        fortuneBody.textContent = fortune.body;
        fortuneBody.className = 'text-medium'; // Added medium-text class

        fortuneSection.appendChild(fortuneTitle);
        fortuneSection.appendChild(fortuneBody);
    });

    // Append everything to the content container
    fortuneContainer.appendChild(zodiacImageContainer); // Images first
    fortuneContainer.appendChild(title); // Title after images
    fortuneContainer.appendChild(fortuneSection);

    // Add the content container to the main scrollable container
    contentContainer.appendChild(fortuneContainer);
    container.appendChild(contentContainer);

    // Add smooth background motion logic
const handleBackgroundMovement = (moveX) => {
    const maxMoveX = (backgroundImageElement.clientWidth - window.innerWidth) / 2;
    const constrainedMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, moveX));
    gsap.to(backgroundImageElement, {
        x: constrainedMoveX,
        duration: 0.5, // Smooth following
        ease: 'power2.out',
    });
};

// Mouse movement for background
document.addEventListener('mousemove', (event) => {
    const { clientX } = event;
    const moveX = ((clientX / window.innerWidth) - 0.5) * (backgroundImageElement.clientWidth - window.innerWidth) * 0.2;
    handleBackgroundMovement(moveX);
});

// Device orientation for background
window.addEventListener('deviceorientation', (event) => {
    const { gamma } = event;
    const moveX = (gamma / 45) * (backgroundImageElement.clientWidth - window.innerWidth) / 4;
    handleBackgroundMovement(moveX);
});

// Touch gestures for background
let touchStartX = 0;
container.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

container.addEventListener('touchmove', (event) => {
    const touchMoveX = event.touches[0].clientX;
    const moveX = ((touchMoveX - touchStartX) / window.innerWidth) * (backgroundImageElement.clientWidth - window.innerWidth) * 0.4;
    handleBackgroundMovement(moveX);
});

    // GSAP Parallax Logic
    const parallaxEffect = () => {
        const elementMovement = isMobile ? 40 : 30; // Subtle movement for mobile vs desktop
        const animalMovement = isMobile ? 20 : 15;
    
        // Store the initial touch positions for gestures
        let initialTouchX = 0;
    
        // Mouse move listener
        const handleMouseMove = (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 2; // Normalize between -1 and 1
            gsap.to(elementImageElement, {
                x: xPos * elementMovement,
                duration: 0.5,
                ease: 'power2.out',
            });
            gsap.to(zodiacImageElement, {
                x: xPos * animalMovement,
                duration: 0.5,
                ease: 'power2.out',
            });
        };
    
        // Gesture (Touch Input) Listener
        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                initialTouchX = e.touches[0].clientX;
            }
        };
    
        const handleTouchMove = (e) => {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - initialTouchX;
                const xPos = deltaX / window.innerWidth; // Normalize deltaX to a small range
                gsap.to(elementImageElement, {
                    x: xPos * elementMovement,
                    duration: 0.5,
                    ease: 'power2.out',
                });
                gsap.to(zodiacImageElement, {
                    x: xPos * animalMovement,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
        };
    
        // Device orientation listener
        const handleDeviceOrientation = (event) => {
            const xPos = event.gamma / 45; // Normalize gamma between -1 and 1
            gsap.to(elementImageElement, {
                x: xPos * elementMovement,
                duration: 0.5,
                ease: 'power2.out',
            });
            gsap.to(zodiacImageElement, {
                x: xPos * animalMovement,
                duration: 0.5,
                ease: 'power2.out',
            });
        };
    
        // Event listeners
        if (isMobile) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            window.addEventListener('touchstart', handleTouchStart);
            window.addEventListener('touchmove', handleTouchMove);
        } else {
            window.addEventListener('mousemove', handleMouseMove);
        }
    };
    parallaxEffect();

    return container;
}