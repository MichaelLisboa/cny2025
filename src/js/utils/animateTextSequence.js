// utils/animateTextSequence.js
/*
// USAGE EXAMPLE
    const timeline = gsap.timeline({
        onComplete: () => {
            const textElements = Array.from(fortuneContent.querySelectorAll('h3, p'));
            animateTextSequence(textElements, { waveSpeed: 0.02, fadeDuration: 0.25 });
        }
    });
*/
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export function animateTextSequence(elements, { waveSpeed = 0.1, fadeDuration = 0.5, startDelay = 0 } = {}) {
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
                    return ` `; // Visible space
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
                                { y: 40, opacity: 0, scale: 0.05 },
                                {
                                    y: 0,
                                    scale: 1,
                                    opacity: 1,
                                    duration: 0.5,
                                    stagger: waveSpeed, // Wave effect
                                    ease: 'power1.out',
                                },
                                `-=${fadeDuration / 4}` // Start wave slightly after fade begins
                            )
                    );

                    observer.unobserve(el); // Stop observing this element
                });

            timeline.play(); // Play the timeline for visible elements
        },
        { threshold: 0.2, rootMargin: '0px 0px -2% 0px' } // Adjust threshold and root margin
    );

    // Add an index to ensure order is maintained
    elements.forEach((el, index) => {
        el.dataset.index = index; // Assign an index for sorting
        observer.observe(el); // Attach observer to each element
    });
}
