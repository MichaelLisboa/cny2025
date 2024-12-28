import * as THREE from 'three';
import './router';
import { requestDeviceOrientation } from './handleIosPermissions';
import { createCrowdScene } from './components/crowdScene';
import getDeviceInfo from './deviceUtils';

// Select the app container
const app = document.getElementById('app');
if (!app) {
  console.error('App container not found!');
  throw new Error('App container is missing.');
}

createCrowdScene(app);

const { isMobile, OS, deviceType } = getDeviceInfo();
console.log(`Device Info: isMobile=${isMobile}, OS=${OS}, deviceType=${deviceType}`);

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

// Variables for movement
let xRotation = 0;
let yRotation = 0;
let targetXRotation = 0;
let targetYRotation = 0;

// Dead zone threshold for reducing shake
const threshold = 0.02; // Adjust as needed to filter minor shakes

// Smooth rotations using lerp
const lerp = (start, end, alpha) => start + (end - start) * alpha;

// Calculate the shortest rotation path
const shortestPath = (current, target) => {
  const delta = target - current;
  if (delta > Math.PI) {
    return current + (delta - 2 * Math.PI);
  } else if (delta < -Math.PI) {
    return current + (delta + 2 * Math.PI);
  }
  return target;
};

// Handle mouse and touch input
let lastTouchX = 0;
let lastTouchY = 0;

const handleInput = (deltaX, deltaY) => {
  targetXRotation += deltaX * 0.005; // Adjust sensitivity
  targetYRotation = Math.max(
    Math.min(targetYRotation + deltaY * 0.005, params.camera.maxTiltUp),
    params.camera.maxTiltDown
  );
};

// Mouse input
window.addEventListener('mousemove', (event) => {
  if (!isMobile) {
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;
    handleInput(deltaX, deltaY);
  }
});

// Touch input
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const deltaX = touch.clientX - lastTouchX;
    const deltaY = touch.clientY - lastTouchY;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    handleInput(deltaX, deltaY);
  }
});

// Handle device orientation for mobile
if (isMobile && window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    if (event.alpha !== null) {
      const alpha = (event.alpha / 180) * Math.PI;

      // Smooth horizontal rotation (alpha)
      if (Math.abs(alpha - targetXRotation) > threshold) {
        targetXRotation = shortestPath(xRotation, alpha);
      }

      // Smooth vertical rotation (beta)
      const betaRaw = (event.beta - 90) / 90; // Normalize beta to [-1, 1]
      const beta = betaRaw * (params.camera.maxTiltUp - params.camera.maxTiltDown);

      if (Math.abs(beta - targetYRotation) > threshold) {
        targetYRotation = Math.max(
          Math.min(-beta, params.camera.maxTiltUp),
          params.camera.maxTiltDown
        );
      }
    }
  });
}

// Use the iOS permission handler
if (OS === 'iOS' && window.DeviceOrientationEvent) {
requestDeviceOrientation(() => {
  window.addEventListener('deviceorientation', requestDeviceOrientation);
});
}

// Animation loop with refined damping and smoothing
const animate = () => {
  const dampingFactorX = 0.3; // Horizontal damping factor
  const dampingFactorY = 0.15; // Vertical damping factor (even smoother for vertical motions)

  // Smoothly transition rotations
  xRotation = lerp(xRotation, targetXRotation, dampingFactorX);

  // Apply low-pass filtering to reduce jitter in yRotation
  const smoothY = yRotation + (targetYRotation - yRotation) * dampingFactorY;
  yRotation = Math.max(
    Math.min(smoothY, params.camera.maxTiltUp),
    params.camera.maxTiltDown
  );

  // Apply rotations to the sphere
  skySphere.rotation.y = xRotation;
  skySphere.rotation.x = yRotation;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// Register the service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/src/js/serviceWorker.js').then((registration) => {
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, (err) => {
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }