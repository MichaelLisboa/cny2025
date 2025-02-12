import { gsap } from 'gsap';
import { createFloatingAnimation } from '../utils/floatingAnimation.js';

export const createButton = (text = 'Continue', onClick = () => {}, floating = false) => {
  // Create the button container div
  const buttonContainer = document.createElement('div');
  Object.assign(buttonContainer.style, {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  });

  // Create the outer wrapper div for the glowing effect
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'relative', // Change to relative for flexibility
    margin: '0 auto', // Ensure horizontal centering within parent
    display: 'inline-block', // Ensure proper centering for inline content
    padding: '8px 32px',
    borderRadius: '25px',
    background: 'rgba(255, 239, 200, 0.2)',
    boxShadow: '0 0 30px rgba(255, 239, 200, 0.4), 0 0 60px rgba(255, 239, 200, 0.2)',
    zIndex: '1',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
    backdropFilter: "blur(4px)",
  });

  // Create the actual link inside the wrapper
  const link = document.createElement('a');
  link.textContent = text;
  Object.assign(link.style, {
    position: 'relative',
    display: 'inline-block',
    fontSize: window.innerWidth <= 768 ? '20px' : '32px',
    fontWeight: '500',
    color: '#ffffff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    zIndex: '2',
    textShadow: '0 2px 10px rgba(255, 255, 255, 0.5)',
  });

  // Add accessibility label
  link.setAttribute('aria-label', text);

  // Append the link to the wrapper
  wrapper.appendChild(link);

  // Add click handler to the wrapper
  wrapper.addEventListener('click', onClick);

  // Append the wrapper to the button container
  buttonContainer.appendChild(wrapper);

  // GSAP Glow Animation for the wrapper
  gsap.to(wrapper, {
    boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)',
    scale: 1.07,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    duration: 5,
  });

  // Add hover interaction for ripple magic
  wrapper.addEventListener('mouseover', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 60px rgba(255, 239, 200, 0.8), 0 0 150px rgba(255, 239, 200, 0.5)',
      scale: 1.1,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });
  });

  wrapper.addEventListener('mouseout', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)',
      scale: 1.07,
      duration: 0.6,
      ease: 'power2.inOut',
      overwrite: true,
    });
  });

  // Apply floating animation if the `floating` parameter is true
  if (floating) {
    const floatingAnimation = createFloatingAnimation({ minX: -10, maxX: 10, minY: -10, maxY: 10 });
    floatingAnimation(wrapper); // Apply to the button wrapper
  }

  return buttonContainer;
};