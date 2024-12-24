import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const appDiv = document.getElementById('app');
if (appDiv) {
  appDiv.appendChild(renderer.domElement);
} else {
  console.error('No element with id "app" found.');
}

// Add light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Add test cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Animate
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();