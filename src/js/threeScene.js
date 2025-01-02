import * as THREE from 'three';
import { requestDeviceOrientation } from './handleIosPermissions';

// Parameters for camera and sphere settings
const params = {
  camera: {
    position: { x: 0, y: -0.25, z: -2 },
    lookAt: { x: 0, y: -0.5, z: -4 },
    mobilePosition: { x: 0, y: -0.3, z: 0.1 },
    mobileLookAt: { x: 0, y: -0.3, z: -4 },
    maxTiltUp: Math.PI / 12,
    maxTiltDown: -Math.PI / 8,
  },
  texture: {
    repeat: { x: 3, y: 1 },
    offset: { x: 1, y: 0 },
  },
  sphere: {
    scaleY: 0.5,
    scaleX: 1,
    initialRotationX: -Math.PI / 8,
  },
};

export const initThreeScene = (app, isMobile) => {
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
    const sphereGeometry = new THREE.SphereGeometry(1000, 60, 40);
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
    skySphere.scale.x = params.sphere.scaleX;
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
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150); // Throttle to 150ms
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

  // Define the device orientation handler
  const handleDeviceOrientation = (event) => {
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
  };

  // Use the iOS permission handler
  requestDeviceOrientation(() => {
    console.log('Adding deviceorientation listener');
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  });

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
};