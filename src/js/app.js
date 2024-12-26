import * as THREE from 'three';
import { gsap } from 'gsap';

// Select the app container
const app = document.getElementById('app');
const isMobile = window.innerWidth <= 1024;

// Set up Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.outputEncoding = THREE.sRGBEncoding; // Ensure correct color encoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
app.appendChild(renderer.domElement);

// Create a sphere geometry for the 360-degree background
const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
// Create the texture with adjustments for alignment
const texture = new THREE.TextureLoader().load(
  new URL('../assets/images/starry-sky.jpg', import.meta.url).href
);
texture.encoding = THREE.sRGBEncoding; // Ensure correct color encoding
texture.wrapS = THREE.RepeatWrapping; // Allow horizontal tiling
texture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical tiling
texture.repeat.set(1, 1.1); // Slight horizontal stretch
texture.offset.set(1, -0.225); // Adjust vertical alignment (move upward slightly)

// Create the sphere geometry for the background
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide, // Render on the inside of the sphere
});

// Create the sphere mesh
const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
skySphere.rotation.x = Math.PI / 2; // Rotate sphere to better align with the texture
skySphere.scale.y = 1.5; // Stretch the vertical height
scene.add(skySphere);

// Resize handler for Three.js canvas and sphere adjustment
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Position the camera inside the sphere
camera.position.set(0, 0, 0); // Lower the camera position to simulate standing on the ground

if (isMobile) {
  camera.position.set(0, 0, 0.1); // Slightly move the camera forward on mobile
  camera.lookAt(0, -100, -200); // Look at the center of the sphere on mobile
} else {
  camera.lookAt(0, 0, -1); // Look at the center of the sphere
}

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
    textImage.style.width = '30vw'; // Desktop
  } else {
    textImage.style.width = '80vw'; // Mobile and tablet
  }
};

// Initial adjustment
adjustTextImageWidth();

// Re-adjust on window resize
window.addEventListener('resize', () => {
  adjustTextImageWidth();
});

// Variables for movement
let targetXRotation = 0; // Target horizontal rotation for the sky
let targetYRotation = 0; // Target vertical rotation for the sky
const verticalLimit = Math.PI / 8; // Limit vertical movement to ±22.5 degrees

let xRotation = 0; // Smoothed horizontal rotation
let yRotation = 0; // Smoothed vertical rotation

// GSAP Floating Animation for Text
const floatingOffset = { x: 0, y: 0 }; // For subtle floating effect
const floatingTimeline = gsap.timeline({ repeat: -1, yoyo: true });
floatingTimeline.to(floatingOffset, {
  y: gsap.utils.random(20, 50, true), // Randomize vertical movement
  x: gsap.utils.random(10, 30, true), // Randomize horizontal movement
  ease: 'sine.inOut', // Smooth easing
  duration: gsap.utils.random(2, 4, true) // Randomize duration
});

// Function to smooth rotations
const lerp = (start, end, alpha) => start + (end - start) * alpha;

// Handle mouse movement for sky rotation
window.addEventListener('mousemove', (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 2 * Math.PI; // Convert to radians
  const moveY = (event.clientY / window.innerHeight - 0.5) * Math.PI;

  targetXRotation = moveX;
  targetYRotation = Math.max(Math.min(moveY, verticalLimit), -verticalLimit); // Clamp vertical rotation
});

// Handle touch gestures for sky rotation
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const moveX = (touch.clientX / window.innerWidth - 0.5) * 2 * Math.PI; // Convert to radians
    const moveY = (touch.clientY / window.innerHeight - 0.5) * Math.PI;

    targetXRotation = moveX;
    targetYRotation = Math.max(Math.min(moveY, verticalLimit), -verticalLimit); // Clamp vertical rotation
  }
});

// Handle device orientation for sky rotation
window.addEventListener('deviceorientation', (event) => {
  const rotateX = (event.beta / 180) * Math.PI; // Convert beta to radians
  const rotateY = (event.gamma / 90) * Math.PI; // Convert gamma to radians

  targetXRotation = rotateY;
  targetYRotation = Math.max(Math.min(-rotateX, verticalLimit), -verticalLimit); // Flip and clamp vertical rotation
});

// Animation Loop
const animate = () => {
  // Smooth the rotations using lerp
  xRotation = lerp(xRotation, targetXRotation, 0.05); // Smooth horizontal rotation
  yRotation = lerp(yRotation, targetYRotation, 0.05); // Smooth vertical rotation

  // Rotate the sky
  skySphere.rotation.y = xRotation; // Rotate horizontally
  skySphere.rotation.x = yRotation; // Rotate vertically (clamped)

  // Move the text image with gentle motion and floating effect
  textImage.style.transform = `translate(calc(-50% + ${floatingOffset.x}px), calc(-50% + ${floatingOffset.y}px))`;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();