import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // High-DPI screens
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

// Load Montserrat Font and Add Text
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('THE YEAR OF THE SNAKE', {
    font: font,
    size: 2.5, // Make the text larger
    height: 0.3,
  });

  const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);

  // Center the text
  textGeometry.computeBoundingBox();
  const centerOffsetX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
  const centerOffsetY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
  textMesh.position.set(centerOffsetX, centerOffsetY, 0);

  // Add rotation interaction
  const handleRotation = (event) => {
    if (event.type === 'mousemove') {
      const rotationX = (event.clientY / window.innerHeight - 0.5) * Math.PI * 0.1;
      const rotationY = (event.clientX / window.innerWidth - 0.5) * Math.PI * 0.1;
      textMesh.rotation.x = rotationX;
      textMesh.rotation.y = rotationY;
    } else if (event.type === 'deviceorientation') {
      textMesh.rotation.x = THREE.MathUtils.degToRad(event.beta / 2);
      textMesh.rotation.y = THREE.MathUtils.degToRad(event.gamma / 2);
    }
  };

  window.addEventListener('mousemove', handleRotation);
  window.addEventListener('deviceorientation', handleRotation);
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render the scene
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();