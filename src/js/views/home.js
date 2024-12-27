import { gsap } from 'gsap';

const getTextImageStyles = () => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  willChange: 'transform',
  maxWidth: '100%',
  height: 'auto',
});

const getButtonStyles = () => ({
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '15px 50px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: '25px',
    background: 'radial-gradient(circle, rgba(255, 255, 204, 0.3) 30%, rgba(255, 255, 153, 0.25) 60%, rgba(255, 255, 153, 0.2) 100%)', // Softer glow fade
    boxShadow: '0 0 40px rgba(255, 255, 153, 0.3), 0 0 80px rgba(255, 255, 204, 0.125)', // Fainter outer glow
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  });

const setupFloatingAnimation = (element, offset, range) => {
  const timeline = gsap.timeline({ repeat: -1, yoyo: true });
  timeline.to(offset, {
    y: gsap.utils.random(range.minY, range.maxY, true),
    x: gsap.utils.random(range.minX, range.maxX, true),
    ease: 'sine.inOut',
    duration: gsap.utils.random(2, 4, true),
  });
  return offset;
};

export const render = () => {
  const app = document.getElementById('app');

  // Create the text image overlay
  const textImage = new Image();
  textImage.src = new URL('../../assets/images/placeholder-text.png', import.meta.url).href;
  Object.assign(textImage.style, getTextImageStyles());
  app.appendChild(textImage);

  // Create a button to continue
  const button = document.createElement('button');
  button.textContent = 'Continue';
  Object.assign(button.style, getButtonStyles());
  button.addEventListener('mouseover', () => {
    button.style.boxShadow = '0 0 40px rgba(255, 255, 204, 1), 0 0 80px rgba(255, 255, 153, 0.6)';
    button.style.transform = 'scale(1.05)'; // Slight zoom
  });
  button.addEventListener('mouseout', () => {
    button.style.boxShadow = '0 0 30px rgba(255, 255, 153, 0.8), 0 0 60px rgba(255, 255, 204, 0.5)';
    button.style.transform = 'scale(1)'; // Reset zoom
  });
  button.addEventListener('click', () => {
    window.history.pushState(null, null, '/about');
    router();
  });
  app.appendChild(button);

  // Dynamically adjust text image width
  const adjustTextImageWidth = () => {
    textImage.style.width = window.innerWidth <= 1024 ? '80vw' : '30vw';
  };

  adjustTextImageWidth();
  window.addEventListener('resize', adjustTextImageWidth);

  // Floating Animations
  const textImageOffset = setupFloatingAnimation(textImage, { x: 0, y: 0 }, { minX: 10, maxX: 30, minY: 20, maxY: 50 });
  const buttonOffset = setupFloatingAnimation(button, { x: 0, y: 0 }, { minX: 5, maxX: 10, minY: 10, maxY: 20 });

  // Pulsing Glow Animation for Button
  gsap.to(button, {
    boxShadow: '0 0 40px rgba(255, 255, 204, 1), 0 0 80px rgba(255, 255, 153, 0.6)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    duration: 1.5,
  });

  // Animation Loop
  const animate = () => {
    textImage.style.transform = `translate(calc(-50% + ${textImageOffset.x}px), calc(-50% + ${textImageOffset.y}px))`;
    button.style.transform = `translate(calc(-50% + ${buttonOffset.x}px), calc(-50% + ${buttonOffset.y}px))`;
    requestAnimationFrame(animate);
  };
  animate();
};