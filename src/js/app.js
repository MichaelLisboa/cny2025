import * as THREE from 'three';
import { gsap } from 'gsap';

// Select the app container
const app = document.getElementById('app');
const isMobile = window.innerWidth <= 1024;

// Parameters for camera positioning, rotation, tilt, and texture settings
const params = {
  camera: {
    position: { x: 0, y: -0.5, z: 0 }, // Camera position (1.6 meters above the ground)
    lookAt: { x: 0, y: 0, z: -1 }, // Camera lookAt position
    mobilePosition: { x: 0, y: -0.3, z: 0.1 }, // Mobile camera position
    mobileLookAt: { x: 0, y: -0.1, z: -1 }, // Mobile camera lookAt position
    maxTiltUp: Math.PI / 6, // Maximum angle to tilt up (30 degrees)
    maxTiltDown: -Math.PI / 6 // Limit to just slightly below the horizon (30 degrees)
  },
  texture: {
    repeat: { x: 1, y: 1 }, // Texture repeat settings
    offset: { x: 1, y: 0 } // Texture offset settings
  },
  sphere: {
    scaleY: 1.5, // Vertical scale of the sphere
    scaleX: 2, // Horizontal scale of the sphere
    initialRotationX: -Math.PI / 8 // Initial rotation of the sphere (22.5 degrees downward)
  }
};

// Set up Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
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
texture.repeat.set(params.texture.repeat.x, params.texture.repeat.y); // Apply texture repeat settings
texture.offset.set(params.texture.offset.x, params.texture.offset.y); // Apply texture offset settings

// Create the sphere geometry for the background
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide, // Render on the inside of the sphere
});

// Create the sphere mesh
const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
skySphere.rotation.x = Math.PI / 2 + params.sphere.initialRotationX; // Rotate sphere to better align with the texture and initial rotation
skySphere.scale.y = params.sphere.scaleY; // Stretch the vertical height
scene.add(skySphere);

// Resize handler for Three.js canvas and sphere adjustment
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Position the camera inside the sphere
camera.position.set(params.camera.position.x, params.camera.position.y, params.camera.position.z);

if (isMobile) {
  camera.position.set(params.camera.mobilePosition.x, params.camera.mobilePosition.y, params.camera.mobilePosition.z);
  camera.lookAt(params.camera.mobileLookAt.x, params.camera.mobileLookAt.y, params.camera.mobileLookAt.z);
} else {
  camera.lookAt(params.camera.lookAt.x, params.camera.lookAt.y, params.camera.lookAt.z);
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
  textImage.style.width = window.innerWidth <= 1024 ? '80vw' : '30vw';
};

// Initial adjustment
adjustTextImageWidth();

// Re-adjust on window resize
window.addEventListener('resize', () => {
  adjustTextImageWidth();
});

// Variables for movement
let xRotation = 0; // Initialize xRotation
let yRotation = 0; // Initialize yRotation
let targetXRotation = 0;
let targetYRotation = 0;

// GSAP Floating Animation for Text
const floatingOffset = { x: 0, y: 0 };
const floatingTimeline = gsap.timeline({ repeat: -1, yoyo: true });
floatingTimeline.to(floatingOffset, {
  y: gsap.utils.random(20, 50, true),
  x: gsap.utils.random(10, 30, true),
  ease: 'sine.inOut',
  duration: gsap.utils.random(2, 4, true),
});

// Function to smooth rotations
const lerp = (start, end, alpha) => start + (end - start) * alpha;

// Function to calculate the shortest path rotation
const shortestPathRotation = (current, target) => {
  const difference = target - current;
  if (difference > Math.PI) {
    return current + (difference - 2 * Math.PI);
  } else if (difference < -Math.PI) {
    return current + (difference + 2 * Math.PI);
  } else {
    return current + difference;
  }
};

// Handle mouse movement for sky rotation
window.addEventListener('mousemove', (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 2 * Math.PI;
  const moveY = (event.clientY / window.innerHeight - 0.5) * Math.PI;

  targetXRotation = moveX;
  targetYRotation = Math.max(Math.min(moveY, params.camera.maxTiltUp), params.camera.maxTiltDown);
});

// Handle touch gestures for sky rotation
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const moveX = (touch.clientX / window.innerWidth - 0.5) * 2 * Math.PI;
    const moveY = (touch.clientY / window.innerHeight - 0.5) * Math.PI;

    targetXRotation = moveX;
    targetYRotation = Math.max(Math.min(moveY, params.camera.maxTiltUp), params.camera.maxTiltDown);
  }
});

// Handle device orientation for sky rotation
window.addEventListener('deviceorientation', (event) => {
  const rotateX = (event.beta - 90) / 90 * (params.camera.maxTiltUp - params.camera.maxTiltDown) + params.camera.maxTiltDown;
  const rotateY = (event.alpha / 180) * Math.PI; // Use alpha for horizontal rotation

  targetXRotation = rotateY;
  targetYRotation = Math.max(Math.min(-rotateX, params.camera.maxTiltUp), params.camera.maxTiltDown);
});

// Animation Loop
const animate = () => {
  const dampingFactor = 0.1; // Damping factor for smoothing

  xRotation = shortestPathRotation(xRotation, targetXRotation) * dampingFactor + xRotation * (1 - dampingFactor);
  yRotation = yRotation * (1 - dampingFactor) + targetYRotation * dampingFactor;

  skySphere.rotation.y = xRotation;
  skySphere.rotation.x = yRotation;

  textImage.style.transform = `translate(calc(-50% + ${floatingOffset.x}px), calc(-50% + ${floatingOffset.y}px))`;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();