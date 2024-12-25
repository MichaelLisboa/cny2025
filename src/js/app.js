import * as THREE from 'three';
import { gsap } from 'gsap';

// Select the app container
const app = document.getElementById('app');

// Set up Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
app.appendChild(renderer.domElement);

// Create a sphere geometry for the 360-degree background
let sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    new URL('../assets/images/placeholder-bg.jpg', import.meta.url).href
  ),
  side: THREE.BackSide, // Render the texture on the inside
});
const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(skySphere);

// Function to adjust the sphere size dynamically
const adjustSphereSize = () => {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const radius = aspectRatio > 1 ? 500 : 500 / aspectRatio; // Adjust based on aspect ratio
  scene.remove(skySphere); // Remove the old sphere
  sphereGeometry = new THREE.SphereGeometry(radius, 60, 40); // Create a new sphere with the adjusted radius
  skySphere.geometry = sphereGeometry; // Replace the geometry
  scene.add(skySphere); // Add the updated sphere back to the scene
};

// Initial adjustment
adjustSphereSize();

// Resize handler for Three.js canvas and sphere adjustment
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  adjustSphereSize();
});

// Position the camera inside the sphere
camera.position.set(0, 0, 0.1);

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
});

// Variables to track movement
let xRotation = 0; // Horizontal rotation for the sky
let yRotation = 0; // Vertical rotation for the sky
const verticalLimit = Math.PI / 8; // Limit vertical movement to ±22.5 degrees

let textOffsetX = 0; // Text horizontal offset
let textOffsetY = 0; // Text vertical offset

// GSAP Floating Animation for Text
const floatingOffset = { x: 0, y: 0 }; // For subtle floating effect
gsap.to(floatingOffset, {
  y: 10, // Move up and down by 10px
  repeat: -1, // Infinite repetition
  yoyo: true, // Reverse the animation after each cycle
  ease: 'sine.inOut', // Smooth easing
  duration: 3, // 3-second cycle
});

// Handle mouse movement for sky and text rotation
window.addEventListener('mousemove', (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 2 * Math.PI; // Convert to radians
  const moveY = (event.clientY / window.innerHeight - 0.5) * Math.PI;

  xRotation = moveX;
  yRotation = Math.max(Math.min(moveY, verticalLimit), -verticalLimit); // Clamp vertical rotation

  textOffsetX = (event.clientX / window.innerWidth - 0.5) * 20; // Gentle text movement
  textOffsetY = (event.clientY / window.innerHeight - 0.5) * 20; // Gentle text movement
});

// Handle touch gestures for sky and text rotation
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const moveX = (touch.clientX / window.innerWidth - 0.5) * 2 * Math.PI; // Convert to radians
    const moveY = (touch.clientY / window.innerHeight - 0.5) * Math.PI;

    xRotation = moveX;
    yRotation = Math.max(Math.min(moveY, verticalLimit), -verticalLimit); // Clamp vertical rotation

    textOffsetX = (touch.clientX / window.innerWidth - 0.5) * 20; // Gentle text movement
    textOffsetY = (touch.clientY / window.innerHeight - 0.5) * 20; // Gentle text movement
  }
});

// Handle device orientation for sky and text rotation
window.addEventListener('deviceorientation', (event) => {
  const rotateX = (event.beta / 180) * Math.PI; // Convert beta to radians
  const rotateY = (event.gamma / 90) * Math.PI; // Convert gamma to radians

  xRotation = rotateY;
  yRotation = Math.max(Math.min(-rotateX, verticalLimit), -verticalLimit); // Flip and clamp vertical rotation

  textOffsetX = (event.gamma / 90) * 20; // Gentle text movement
  textOffsetY = (event.beta / 180) * 20; // Gentle text movement
});

// Animation Loop
const animate = () => {
  // Rotate the sky
  skySphere.rotation.y = xRotation; // Rotate horizontally
  skySphere.rotation.x = yRotation; // Rotate vertically (clamped)

  // Move the text image with gentle motion and floating effect
  textImage.style.transform = `translate(calc(-50% + ${textOffsetX}px), calc(-50% + ${textOffsetY + floatingOffset.y}px))`;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();