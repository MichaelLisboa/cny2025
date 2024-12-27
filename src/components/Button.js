import { gsap } from 'gsap';

export const createButton = (container, text = 'Continue', onClick = () => {}) => {
  // Create the outer wrapper div for the glowing effect
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '8px 32px', // Adjusted padding for better proportions
    borderRadius: '25px',
    background: 'rgba(255, 239, 200, 0.2)', // Softer warm tone
    boxShadow: '0 0 30px rgba(255, 239, 200, 0.4), 0 0 60px rgba(255, 239, 200, 0.2)', // Softer outer glow
    zIndex: '1',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
  });

  // Create the actual link inside the wrapper
  const link = document.createElement('a');
  link.textContent = text;
  Object.assign(link.style, {
    position: 'relative',
    display: 'inline-block',
    fontSize: window.innerWidth <= 768 ? '14px' : '16px', // Responsive font size
    fontWeight: '500',
    color: '#ffffff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    zIndex: '2',
    textShadow: '0 2px 10px rgba(255, 255, 255, 0.5)', // Slightly brighter halo
  });

  // Add accessibility label
  link.setAttribute('aria-label', text);

  // Append the link to the wrapper
  wrapper.appendChild(link);

  // Add click handler to the wrapper
  wrapper.addEventListener('click', onClick);

  // Append the wrapper to the container
  container.appendChild(wrapper);

  // GSAP Glow Animation for the wrapper
  gsap.to(wrapper, {
    boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)', // Soft outer glow
    scale: 1.07, // Slightly increased scale for subtle breathing
    repeat: -1, // Infinite loop
    yoyo: true, // Back-and-forth animation
    ease: 'power2.inOut', // Smooth easing for natural transitions
    duration: 5, // Longer duration for gradual pulsing
  });

  // Add hover interaction for ripple magic
  wrapper.addEventListener('mouseover', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 60px rgba(255, 239, 200, 0.8), 0 0 150px rgba(255, 239, 200, 0.5)', // Bright glow
      scale: 1.1, // Subtle zoom
      duration: 0.25, // Smooth transition
      ease: 'power2.out', // Smooth easing for hover
      overwrite: true, // Stop the pulsing animation during hover
    });
  });
  
  wrapper.addEventListener('mouseout', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)', // Return to idle glow
      scale: 1.07, // Reset scale
      duration: 0.6, // Smooth reset
      ease: 'power2.inOut', // Match idle animation easing
      overwrite: true, // Stop hover animation when resetting
    });
  });

  return wrapper;
};