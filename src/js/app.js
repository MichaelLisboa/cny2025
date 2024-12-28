import * as THREE from 'three';
import './router';
import { createCrowdScene } from './components/crowdScene';

// Select the app container
const app = document.getElementById('app');
if (!app) {
  console.error('App container not found!');
  throw new Error('App container is missing.');
}

createCrowdScene(app);

const isMobile = window.innerWidth <= 1024;

// Parameters for camera and sphere settings
const params = {
  camera: {
    position: { x: 0, y: -0.5, z: 0 },
    lookAt: { x: 0, y: 0, z: -1 },
    mobilePosition: { x: 0, y: -0.3, z: 0.1 },
    mobileLookAt: { x: 0, y: -0.1, z: -1 },
    maxTiltUp: Math.PI / 6,
    maxTiltDown: -Math.PI / 6,
  },
  texture: {
    repeat: { x: 1, y: 1 },
    offset: { x: 1, y: 0 },
  },
  sphere: {
    scaleY: 2,
    initialRotationX: -Math.PI / 8,
  },
};

// Initialize Three.js components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.35;
app.appendChild(renderer.domElement);

// Create and configure the sphere
const createSkySphere = () => {
  const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
  const texture = new THREE.TextureLoader().load(
    new URL('../assets/images/starry-sky-background.png', import.meta.url).href
  );

  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(params.texture.repeat.x, params.texture.repeat.y);
  texture.offset.set(params.texture.offset.x, params.texture.offset.y);

  const sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });

  const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  skySphere.rotation.x = Math.PI / 2 + params.sphere.initialRotationX;
  skySphere.scale.y = params.sphere.scaleY;
  return skySphere;
};

const skySphere = createSkySphere();
scene.add(skySphere);

// Position the camera
const setupCamera = () => {
  if (isMobile) {
    camera.position.set(
      params.camera.mobilePosition.x,
      params.camera.mobilePosition.y,
      params.camera.mobilePosition.z
    );
    camera.lookAt(
      params.camera.mobileLookAt.x,
      params.camera.mobileLookAt.y,
      params.camera.mobileLookAt.z
    );
  } else {
    camera.position.set(
      params.camera.position.x,
      params.camera.position.y,
      params.camera.position.z
    );
    camera.lookAt(
      params.camera.lookAt.x,
      params.camera.lookAt.y,
      params.camera.lookAt.z
    );
  }
};
setupCamera();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Device orientation permission handling
const requestDeviceOrientationPermission = () => {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
          console.warn('Device orientation permission denied.');
        }
      })
      .catch((error) => {
        console.error('Error requesting device orientation permission:', error);
      });
  } else {
    console.warn('DeviceOrientationEvent.requestPermission() is not supported.');
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  }
};

const createPermissionButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Enable Motion';
  Object.assign(button.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '1rem 2rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: '1000'
  });

  button.addEventListener('click', () => {
    requestDeviceOrientationPermission();
    button.remove(); // Remove button after permission is requested
  });

  app.appendChild(button);
};

// Check if it's iOS
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  createPermissionButton();
} else {
  window.addEventListener('deviceorientation', handleDeviceOrientation);
}

// Variables for movement
let xRotation = 0;
let yRotation = 0;
let targetXRotation = 0;
let targetYRotation = 0;

const handleDeviceOrientation = (event) => {
  const alpha = (event.alpha / 180) * Math.PI; // Map alpha to radians
  const beta = (event.beta - 90) / 90; // Normalize beta to [-1, 1]
  const maxTiltUp = params.camera.maxTiltUp;
  const maxTiltDown = params.camera.maxTiltDown;

  targetXRotation = alpha;
  targetYRotation = Math.max(
    Math.min(-beta * (maxTiltUp - maxTiltDown), maxTiltUp),
    maxTiltDown
  );
};

// Animation loop
const animate = () => {
  const dampingFactor = 0.1;
  xRotation += (targetXRotation - xRotation) * dampingFactor;
  yRotation += (targetYRotation - yRotation) * dampingFactor;

  skySphere.rotation.y = xRotation;
  skySphere.rotation.x = yRotation;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();