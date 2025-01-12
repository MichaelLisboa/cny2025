import { getState } from '../utils/stateManager.js';
import { createPictureElement } from '../utils/imageUtils.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { gsap } from 'gsap';

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
        overflowY: 'auto', // Parent container is scrollable
        padding: '128px 1rem 172px', // Pushed down by 128px, with 172px padding at the bottom
        boxSizing: 'border-box',
    });

    // Content container for layout and styling
    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, {
        maxWidth: '600px', // Limit width
        width: '100%', // Allow full width within max-width
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: isMobile ? '0 16px' : '0', // Add padding for mobile devices
    });

    // Fetch the zodiac animal and element from state
    const state = getState();
    const { zodiac, element } = state || { zodiac: 'Unknown', element: 'Unknown' }; // Fallback values

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
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        textAlign: 'center',
        color: 'white', // Text color
    });

    // Fortune Section
    const fortuneSection = document.createElement('div');
    Object.assign(fortuneSection.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'left',
        color: 'white', // Text color
    });

    const fortunes = [
        {
            title: "What the Year of the Dragon brings for You",
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt libero nec ligula sollicitudin ultrices.",
        },
        {
            title: "How’s the Career going?",
            body: "Phasellus nec nisl et ipsum elementum varius sed a lacus. Suspendisse potenti. Nulla facilisi.",
        },
        {
            title: "What about the Health outlook?",
            body: "Fusce nec nisi sit amet elit vehicula feugiat. Nulla fringilla lorem vel ex laoreet posuere.",
        },
        {
            title: "Let’s talk about Love",
            body: "Quisque id elit eget felis sagittis efficitur. Etiam auctor purus quis quam sodales tincidunt.",
        },
        {
            title: "Any advice?",
            body: "Duis aliquet odio et libero pellentesque, ac accumsan orci aliquam. Nulla convallis mi et nisl tincidunt lacinia.",
        },
    ];

    fortunes.forEach((fortune) => {
        const fortuneTitle = document.createElement('h3');
        fortuneTitle.textContent = fortune.title;
        Object.assign(fortuneTitle.style, {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
        });

        const fortuneBody = document.createElement('p');
        fortuneBody.textContent = fortune.body;
        fortuneBody.className = 'medium-text'; // Added medium-text class
        Object.assign(fortuneBody.style, {
            fontSize: '1rem',
            lineHeight: '1.5',
        });

        fortuneSection.appendChild(fortuneTitle);
        fortuneSection.appendChild(fortuneBody);
    });

    // Append everything to the content container
    contentContainer.appendChild(zodiacImageContainer); // Images first
    contentContainer.appendChild(title); // Title after images
    contentContainer.appendChild(fortuneSection);

    // Add the content container to the main scrollable container
    container.appendChild(contentContainer);

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