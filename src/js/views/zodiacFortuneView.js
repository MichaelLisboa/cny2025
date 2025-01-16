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
        height: '55vh',
        marginBottom: '1.5rem',
    });

    // Element background image
    const elementImage = createPictureElement(`element-${element.toLowerCase()}.png`);
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
        willChange: 'transform, opacity',
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
        willChange: 'transform, opacity',
    });
    zodiacImageContainer.appendChild(zodiacImage);

    // Title Section
    const title = document.createElement('h1');
    title.textContent = `${element || 'Unknown Element'} ${zodiac || 'Unknown Zodiac'}`;
    Object.assign(title.style, {
        marginTop: '0',
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
            opacity: '0',
            display: 'none',
            transition: 'opacity 0.5s ease-in-out',
        });

        const fortuneBody = document.createElement('p');
        fortuneBody.textContent = fortune.body;
        Object.assign(fortuneBody.style, {
            opacity: '0',
            display: 'none',
            transition: 'opacity 0.5s ease-in-out',
        });

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

        // Smooth transition for fortuneContent without overshooting
        gsap.fromTo(
            fortuneContent,
            { y: '-50%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 1.8, ease: 'power1.out' }
        );

        contentContainer.appendChild(fortuneContent);

        // Enable scrollability after animation completes
        gsap.to(contentContainer, { overflowY: 'auto', delay: 1.8 });
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
        height: "100vh",
        overflow: "auto", // Prevents overflow glitches during animation
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

                // Timeline for syncing animations
                const timeline = gsap.timeline();

                timeline
                    // Slide pickerComponent out completely before removal
                    .to(birthdatePickerContainer, {
                        y: '100%',
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                    })
                    // Render zodiacPresentation content after picker animation
                    .add(() => {
                        renderMainContent();
                    }, 1.25) // Delayed until pickerComponent is fully off-screen
                    .add(() => {
                        birthdatePickerContainer.remove(); // Remove after zodiac content starts
                    }, 1);

                // Background scroll effect synchronized with pickerComponent
                const backgroundImageElement = container.querySelector('img');
                timeline.to(backgroundImageElement, {
                    top: '0%',
                    duration: 3,
                    ease: 'power1.out',
                }, 0); // Starts concurrently with picker animation
            },
        });
        birthdatePickerContainer.appendChild(pickerComponent);
    })();

    return container;
};