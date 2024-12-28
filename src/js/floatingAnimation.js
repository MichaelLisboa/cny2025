import { gsap } from 'gsap';

/**
 * Creates a floating animation with specified range for an element.
 * @param {Object} range - The range of motion for the animation.
 * @param {number} range.minX - Minimum X movement.
 * @param {number} range.maxX - Maximum X movement.
 * @param {number} range.minY - Minimum Y movement.
 * @param {number} range.maxY - Maximum Y movement.
 * @returns {Function} - A function that applies the animation to a DOM element.
 */
export const createFloatingAnimation = (range) => {
    return (element) => {
        const animate = () => {
            gsap.to(element, {
                x: gsap.utils.random(range.minX, range.maxX, true), // Random X within range
                y: gsap.utils.random(range.minY, range.maxY, true), // Random Y within range
                ease: 'sine.inOut',
                duration: gsap.utils.random(2, 4, true), // Randomized duration
                onComplete: animate, // Recursively restart the animation
            });
        };
        animate(); // Start the animation
    };
};