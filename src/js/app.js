import * as THREE from 'three';
import { gsap } from 'gsap';

// Select the app container
const app = document.getElementById('app');

// Create the background image
const backgroundImage = new Image();
backgroundImage.src = new URL('../assets/images/placeholder-bg.jpg', import.meta.url).href;
backgroundImage.style.position = 'absolute';
backgroundImage.style.top = '0'; // Stick to the top of the viewport
backgroundImage.style.left = '50%'; // Center horizontally
backgroundImage.style.transform = 'translateX(-50%)';
backgroundImage.style.height = '110vh'; // Slightly larger than the viewport height
backgroundImage.style.objectFit = 'cover';
backgroundImage.style.willChange = 'transform';
app.appendChild(backgroundImage);

// Create the text image overlay
const textImage = new Image();
textImage.src = new URL('../assets/images/placeholder-text.png', import.meta.url).href;
textImage.style.position = 'absolute';
textImage.style.top = '50%'; // Center vertically
textImage.style.left = '50%'; // Center horizontally
textImage.style.transform = 'translate(-50%, -50%)';
textImage.style.willChange = 'transform';
app.appendChild(textImage);

// Function to dynamically adjust text image width
const adjustTextImageWidth = () => {
  if (window.innerWidth >= 1024) {
    textImage.style.width = '70vw'; // Desktop
  } else {
    textImage.style.width = '80vw'; // Mobile and tablet
  }
};

// Initial adjustment
adjustTextImageWidth();

// Re-adjust on window resize
window.addEventListener('resize', () => {
  adjustTextImageWidth();
  backgroundImage.style.height = `${window.innerHeight * 1.1}px`; // Dynamically update height
});

// Variables to track movement
let xOffset = 0;
let yOffset = 0;

// GSAP Floating Animation for Logo
gsap.to(textImage, {
  y: 20, // Move up and down by 20px
  repeat: -1, // Infinite repetition
  yoyo: true, // Reverse the animation after each cycle
  ease: 'sine.inOut', // Smooth easing
  duration: 3, // 3-second cycle
});

// Three.js Clock for Smooth Position Updates
const clock = new THREE.Clock();

// Function to smoothly update positions
const updatePositions = () => {
  const elapsedTime = clock.getElapsedTime();
  const waveOffset = Math.sin(elapsedTime * 2) * 5; // Add a subtle wave effect to textImage
  backgroundImage.style.transform = `translateX(-50%) rotateX(${yOffset / 10}deg) rotateY(${xOffset / 10}deg)`;
  textImage.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset + waveOffset}px))`;
};

// Handle mouse movement
window.addEventListener('mousemove', (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 100; // Amplified range for dramatic effect
  const moveY = (event.clientY / window.innerHeight - 0.5) * 100; // Amplified range for dramatic effect

  xOffset = Math.min(Math.max(moveX, -window.innerWidth * 0.2), window.innerWidth * 0.2);
  yOffset = Math.min(Math.max(moveY, -window.innerHeight * 0.2), window.innerHeight * 0.2);

  updatePositions();
});

// Handle touch gestures
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const moveX = (touch.clientX / window.innerWidth - 0.5) * 100;
    const moveY = (touch.clientY / window.innerHeight - 0.5) * 100;

    xOffset = Math.min(Math.max(moveX, -window.innerWidth * 0.2), window.innerWidth * 0.2);
    yOffset = Math.min(Math.max(moveY, -window.innerHeight * 0.2), window.innerHeight * 0.2);

    updatePositions();
  }
});

// Handle device orientation for background rotation
window.addEventListener('deviceorientation', (event) => {
  const rotateX = event.beta - 90; // Tilt along X-axis
  const rotateY = event.gamma; // Tilt along Y-axis

  // Limit rotation to prevent extreme distortion
  const limitedRotateX = Math.min(Math.max(rotateX, -45), 45);
  const limitedRotateY = Math.min(Math.max(rotateY, -45), 45);

  backgroundImage.style.transform = `translateX(-50%) rotateX(${limitedRotateX}deg) rotateY(${limitedRotateY}deg)`;
});

// Animation Loop
const animate = () => {
  updatePositions();
  requestAnimationFrame(animate);
};
animate();