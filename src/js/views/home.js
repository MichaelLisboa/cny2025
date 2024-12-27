import { gsap } from 'gsap';
import { createButton } from '../../components/Button.js';

const getTextImageStyles = () => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  willChange: 'transform',
  maxWidth: '100%',
  height: 'auto',
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

  // Dynamically adjust text image width
  const adjustTextImageWidth = () => {
    textImage.style.width = window.innerWidth <= 1024 ? '80vw' : '30vw';
  };

  adjustTextImageWidth();
  window.addEventListener('resize', adjustTextImageWidth);

  // Add button using the new ButtonComponent
  createButton(app, 'Continue', () => {
    window.history.pushState(null, null, '/about');
    router();
  });

  // Floating Animations
  const textImageOffset = setupFloatingAnimation(textImage, { x: 0, y: 0 }, { minX: 10, maxX: 30, minY: 20, maxY: 50 });

  // Animation Loop
  const animate = () => {
    textImage.style.transform = `translate(calc(-50% + ${textImageOffset.x}px), calc(-50% + ${textImageOffset.y}px))`;
    requestAnimationFrame(animate);
  };
  animate();
};