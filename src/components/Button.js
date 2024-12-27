import { gsap } from 'gsap';

export const createButton = (container, text = 'Continue', onClick = () => {}) => {
  // Create the outer wrapper div for the glowing effect
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '12px 32px',
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
    fontSize: '16px',
    fontWeight: '500',
    color: '#ffffff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    zIndex: '2',
    textShadow: '0 2px 10px rgba(255, 255, 255, 0.5)', // Slightly brighter halo
  });

  // Append the link to the wrapper
  wrapper.appendChild(link);

  // Add click handler to the wrapper
  wrapper.addEventListener('click', onClick);

  // Append the wrapper to the container
  container.appendChild(wrapper);

  // GSAP Glow Animation for the wrapper
  gsap.to(wrapper, {
    boxShadow: '0 0 50px rgba(255, 239, 200, 0.6), 0 0 100px rgba(255, 239, 200, 0.4)', // Pulsing soft glow
    scale: 1.05, // Subtle "breathing" effect
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    duration: 2,
  });

  // Add hover interaction for more magic
  wrapper.addEventListener('mouseover', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 70px rgba(255, 239, 200, 0.8), 0 0 120px rgba(255, 239, 200, 0.5)', // Brighter glow
      duration: 0.3,
    });
  });

  wrapper.addEventListener('mouseout', () => {
    gsap.to(wrapper, {
      boxShadow: '0 0 50px rgba(255, 239, 200, 0.6), 0 0 100px rgba(255, 239, 200, 0.4)', // Reset to normal glow
      duration: 0.3,
    });
  });

  return wrapper;
};