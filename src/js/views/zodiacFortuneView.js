import { getState, dispatch, birthdateExists } from '../utils/stateManager.js';
import { determineZodiacAnimalAndElement } from '../utils/getZodiacAnimal.js';
import { createBaseLayout } from '../layouts/layout.js';
import { zodiacData } from '../fortune-data.js';
import { createPictureElement } from '../utils/imageUtils.js';
import getDeviceInfo from '../utils/deviceUtils.js';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);
gsap.registerPlugin(TextPlugin);

/**
 * Animate text elements in sequence with optional parent background fade-in.
 * @param {HTMLElement[]} elements - Array of elements to animate.
 * @param {Object} options - Animation options.
 * @param {number} options.typingSpeed - Speed of character typing (default: 0.05s per character).
 * @param {number} options.fadeDuration - Duration for parent fade-in (default: 0.5s).
 * @param {number} options.startDelay - Delay before starting the animation (default: 0.5s).
 */
export function animateTextSequence(elements, { waveSpeed = 0.1, fadeDuration = 0.5, startDelay = 0.5 } = {}) {
    if (!elements || elements.length === 0) return;

    // Ensure elements are hidden initially and split their text content
    elements.forEach((el) => {
        gsap.set(el, { display: 'block', opacity: 0 }); // Hide initially
        if (!el.dataset.text) el.dataset.text = el.textContent.trim(); // Store text in dataset

        // Split text into spans for characters and spaces
        el.innerHTML = el.dataset.text
            .split('') // Split by character
            .map((char) => {
                if (char === ' ') {
                    return `<span class="char space" style="display:inline-block;">&nbsp;</span>`; // Visible space
                }
                return `<span class="char">${char}</span>`; // Wrap each character
            })
            .join('');
    });

    // Create a shared timeline for sequential animations
    const timeline = gsap.timeline({ paused: true, delay: startDelay });

    // Observer to track visibility
    const observer = new IntersectionObserver(
        (entries) => {
            entries
                .filter((entry) => entry.isIntersecting) // Only process visible elements
                .sort((a, b) => a.target.dataset.index - b.target.dataset.index) // Ensure order by index
                .forEach((entry) => {
                    const el = entry.target; // Current visible element
                    const characters = el.querySelectorAll('.char'); // Get all character spans

                    // Add wave animation for this element
                    timeline.add(
                        gsap.timeline()
                            .to(el, { opacity: 1, duration: fadeDuration, ease: 'power1.out' }) // Fade in the element
                            .fromTo(
                                characters,
                                { y: 20, opacity: 0 },
                                {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.5,
                                    stagger: waveSpeed, // Wave effect
                                    ease: 'power1.out',
                                },
                                `-=${fadeDuration / 2}` // Start wave slightly after fade begins
                            ),
                        `+=0.2` // Add delay between animations
                    );

                    observer.unobserve(el); // Stop observing this element
                });

            timeline.play(); // Play the timeline for visible elements
        },
        { threshold: 0.2, rootMargin: '0px 0px -10% 0px' } // Adjust threshold and root margin
    );

    // Add an index to ensure order is maintained
    elements.forEach((el, index) => {
        el.dataset.index = index; // Assign an index for sorting
        observer.observe(el); // Attach observer to each element
    });
}

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
        textAlign: 'left', // Ensure text alignment is left
        color: 'white',
        width: '100%',
        maxWidth: '600px',
    });

    fortunes.forEach((fortune) => {
        const fortuneTitle = document.createElement('h3');
        fortuneTitle.textContent = fortune.title;
        Object.assign(fortuneTitle.style, {
            textAlign: 'left', // Ensure text alignment is left
            width: '100%',
            color: 'white',
            opacity: '0',
            display: 'none',
            transition: 'opacity 0.5s ease-in-out',
        });

        const fortuneBody = document.createElement('p');
        fortuneBody.className = 'text-medium';
        fortuneBody.textContent = fortune.body;
        Object.assign(fortuneBody.style, {
            textAlign: 'left', // Ensure text alignment is left
            width: '100%',
            opacity: '0',
            display: 'none',
            transition: 'opacity 0.5s ease-in-out',
        });

        fortuneSection.appendChild(fortuneTitle);
        fortuneSection.appendChild(fortuneBody);
    });

    // After appending all fortune elements to fortuneSection
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
        const timeline = gsap.timeline({
            onComplete: () => {
                // Prepare elements for animation
                const textElements = Array.from(document.querySelectorAll('h3, p'));
                // Set `data-text` attribute for safety (optional)
                textElements.forEach(el => el.dataset.text = el.textContent);
                animateTextSequence(textElements, { waveSpeed: 0.02, fadeDuration: 0.25 });



            }
        });

        timeline.fromTo(
            fortuneContent,
            { y: '-50%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 1.8, ease: 'power1.out' }
        );

        contentContainer.appendChild(fortuneContent);

        // Enable scrollability after animation completes
        timeline.to(contentContainer, { overflowY: 'auto', delay: 1.8 });
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