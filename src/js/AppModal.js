import { gsap } from 'gsap';

export const AppModal = ({ title, description, actions }) => {
  const app = document.getElementById('app');

  // Create modal container (full screen overlay)
  const modalContainer = document.createElement('div');
  Object.assign(modalContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Start fully transparent
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Center both vertically and horizontally
    pointerEvents: 'auto', // Prevent interaction with anything behind
  });

  // Create modal box
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    width: '80%',
    maxWidth: '320px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 1000,
    padding: '1.5rem',
    textAlign: 'center',
    transform: 'translate(-50%, 150%)', // Start off-screen bottom
    opacity: 0, // Start hidden
    position: 'absolute',
    left: '50%',
    top: '50%',
  });

  // Create title element
  const modalTitle = document.createElement('p');
  modalTitle.textContent = title;
  Object.assign(modalTitle.style, {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    marginTop: '0',
    color: '#333',
  });

  // Create description element
  const modalDescription = document.createElement('p');
  modalDescription.textContent = description;
  Object.assign(modalDescription.style, {
    fontSize: '1rem',
    fontWeight: "600",
    color: '#555',
    marginBottom: '1.5rem',
  });

  // Create actions container
  const actionsContainer = document.createElement('div');
  Object.assign(actionsContainer.style, {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
  });

  // Add action buttons/links
  actions.forEach(({ text, style, onClick }) => {
    const actionButton = document.createElement('a');
    actionButton.textContent = text;
    Object.assign(actionButton.style, {
      fontSize: '1rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      color: 'rgba(0, 122, 255, 1)',
      cursor: 'pointer',
      ...style, // Allow for custom styling
    });
    actionButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (onClick) onClick();
      // Slide the modal back down and fade out the overlay
      gsap.to(modal, {
        y: '150%', // Slide to off-screen bottom
        duration: 0.5,
        ease: 'power3.in',
      });
      gsap.to(modalContainer, {
        opacity: 0,
        duration: 0.3,
        delay: 0.2,
        onComplete: () => modalContainer.remove(),
      });
    });
    actionsContainer.appendChild(actionButton);
  });

  // Assemble modal
  modal.appendChild(modalTitle);
  modal.appendChild(modalDescription);
  modal.appendChild(actionsContainer);

  // Append modal to modal container
  modalContainer.appendChild(modal);

  // Append modal container to app
  app.appendChild(modalContainer);

  // GSAP animations
  // Step 1: Fade in the modal background overlay
  gsap.to(modalContainer, {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fade in to 50% opacity
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      // Step 2: Slide modal to vertical and horizontal center
      gsap.to(modal, {
        opacity: 1,
        y: '-50%', // Slide to centered position
        duration: 0.5,
        ease: 'power3.out', // Smooth easing
      });
    },
  });

  return modalContainer;
};