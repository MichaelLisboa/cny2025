import { getState, dispatch, birthdateExists } from '../utils/stateManager.js';
import { determineZodiacAnimalAndElement } from '../utils/getZodiacAnimal.js';
import { createBaseLayout } from '../layouts/layout.js';
import { zodiacData } from '../fortune-data.js';
import { createPictureElement } from '../utils/imageUtils.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { gsap } from 'gsap';

const { isMobile } = getDeviceInfo();

const zodiacPresentation = () => {
    const fortuneContainer = document.createElement("div");
    Object.assign(fortuneContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
    });

    // Fetch the zodiac animal and element from state
    const state = getState();
    const { zodiac, element } = state || { zodiac: 'Snake', element: 'Metal' };

    // Find matching zodiac entry in fortune-data
    const currentZodiac = zodiacData.find(
        item => item.slug.toLowerCase() === (zodiac || '').toLowerCase()
    ) || {};

    // Fortunes data
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
        height: '70vh',
        marginBottom: '1.5rem',
    });

    // Element background image
    const elementImage = createPictureElement(`${element.toLowerCase()}.png`);
    const elementImageElement = elementImage.querySelector('img');
    Object.assign(elementImageElement.style, {
        position: 'absolute',
        top: isMobile ? '-256px' : '-128px',
        left: isMobile ? '-25%' : '-15%',
        width: isMobile ? '130%' : '110%',
        height: isMobile ? '130%' : '110%',
        opacity: '0.5',
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
        width: '100%',
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
        color: 'white',
    });

    // Fortune Section
    const fortuneSection = document.createElement('div');
    Object.assign(fortuneSection.style, {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        color: 'white',
        maxWidth: '600px',
    });

    fortunes.forEach((fortune) => {
        const fortuneTitle = document.createElement('h3');
        fortuneTitle.textContent = fortune.title;
        Object.assign(fortuneTitle.style, {
            textAlign: 'center',
            color: 'white',
        });

        const fortuneBody = document.createElement('p');
        fortuneBody.textContent = fortune.body;
        fortuneBody.className = 'text-medium';

        fortuneSection.appendChild(fortuneTitle);
        fortuneSection.appendChild(fortuneBody);
    });

    fortuneContainer.appendChild(zodiacImageContainer);
    fortuneContainer.appendChild(title);
    fortuneContainer.appendChild(fortuneSection);

    return fortuneContainer;
};

export const zodiacFortuneView = () => {
    const { container, contentContainer } = createBaseLayout({
        backgroundImage: 'land-and-sky-background.png',
        scrollable: false,
        backgroundPositionY: '100%',
    });

    const renderMainContent = () => {
        // Animate the Zodiac Fortune into view
        const fortuneContent = zodiacPresentation();
        gsap.fromTo(
            fortuneContent,
            { y: '-100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 2, ease: 'ease-in-out' }
        );

        contentContainer.appendChild(fortuneContent);

        // Enable scrollability after animation completes
        setTimeout(() => {
            contentContainer.style.overflowY = 'auto';
        }, 500);
    };

    if (birthdateExists()) {
        renderMainContent();
        return container;
    }

    const birthdatePickerContainer = document.createElement('div');
    Object.assign(birthdatePickerContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    });
    birthdatePickerContainer.className = "birthdate-picker-container";

    contentContainer.appendChild(birthdatePickerContainer);

    (async () => {
        const { captureBirthDate } = await import('../components/captureBirthDate.js');
        const pickerComponent = captureBirthDate({
            title: "Enter your birthdate",
            subtitle: "When did the sky grace us with your presence?",
            onSubmit: (birthdate) => {
                if (!birthdate) {
                    console.error("No valid date submitted.");
                    return;
                }

                const { animal, element } = determineZodiacAnimalAndElement(birthdate);
                if (!animal || !element) {
                    console.error("Failed to determine Zodiac data.");
                    return;
                }

                console.log(`Zodiac animal: ${animal}, Element: ${element}`);

                dispatch({ type: "SET_ZODIAC", payload: animal });
                dispatch({ type: "SET_ELEMENT", payload: element });

                // Animate the transition from the picker to Zodiac fortune
                gsap.to(birthdatePickerContainer, {
                    y: '100%',
                    opacity: 0,
                    duration: 2,
                    ease: 'ease-in-out',
                    onComplete: () => {
                        birthdatePickerContainer.remove();
                        renderMainContent();
                    },
                });

                // Get the background image element from the layout
                const backgroundImageElement = container.querySelector('img');

                // Background scroll effect
                gsap.to(backgroundImageElement, {
                    top: '0%',         // Move the background image to align its top with the container's top
                    duration: 3,          // Slow, dramatic effect
                    ease: 'ease-in-out',  // Smooth animation
                });
            },
        });
        birthdatePickerContainer.appendChild(pickerComponent);
    })();

    return container;
};