import * as THREE from 'three';
import getDeviceInfo from './utils/deviceUtils';
import { requestDeviceOrientation } from './utils/handleIosPermissions';

// Parameters for camera and sphere settings
const params = {
  camera: {
    position: { x: 0, y: 1.5, z: 0.5 }, // Simulates human eye level
    lookAt: { x: 0, y: 1, z: -2 }, // Tilt slightly upward
    mobilePosition: { x: 0, y: 0.5, z: 0.1 }, // Adjusted for mobile
    mobileLookAt: { x: 0, y: 0, z: -2 },
    maxTiltUp: Math.PI / 6, // Limit upward tilt (30 degrees)
    maxTiltDown: -Math.PI / 24, // Limit downward tilt (-7.5 degrees)
  },
  texture: {
    repeat: { x: 3, y: 1 },
    offset: { x: 1, y: 0 },
  },
  sphere: {
    scaleY: 1,
    scaleX: 1,
    initialRotationX: Math.PI / 8, // Adjusted for proper texture alignment
  },
};

const { isMobile } = getDeviceInfo();

// Add the moon as a separate object to the scene
const addMoonToScene = (scene) => {
  const moonTexture = new THREE.TextureLoader().load(
    new URL('../assets/images/moon.png', import.meta.url).href
  );

  const moonGeometry = new THREE.SphereGeometry(64, 64, 32); // Radius and resolution
  const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
    transparent: true,
    depthTest: false,
    roughness: 0.8,
    metalness: 0.1,
  });

  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.scale.set(1, 1, 1); // Uniform scaling, no inversion
  moon.rotation.x = -Math.PI / 6; // Aggressive forward tilt
  // moon.position.set(0, 1000, -2000); // High and far back

  // Moon adjustments for mobile
  if (isMobile) {
    moon.scale.set(6, 6, 6);
    moon.position.set(-350, 650, -4500);
  } else {
    moon.scale.set(4, 4, 4);
    moon.position.set(-800, 400, -2000);
  }

  // Add directional light for depth
  const moonLight = new THREE.DirectionalLight(0xffffff, 1);
  moonLight.castShadow = false;
  moonLight.position.set(1000, 2000, -1000);
  scene.add(moonLight);

  // Create a pivot point for rotation
  const moonPivot = new THREE.Object3D();
  moonPivot.position.set(0, 0, 0);
  moonPivot.add(moon);
  scene.add(moonPivot);

  return moonPivot;
};

export const initThreeScene = (app, isMobile) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60, // Wider field of view for natural perspective
    window.innerWidth / window.innerHeight,
    0.1,
    5000 // Increased far clipping plane
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.35;
  app.appendChild(renderer.domElement);

  // Create and configure the sky sphere
  const createSkySphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(1500, 60, 40);
    const texture = new THREE.TextureLoader().load(
      new URL('../assets/images/starry-sky-background.png', import.meta.url).href
    );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(params.texture.repeat.x, params.texture.repeat.y);
    texture.offset.set(params.texture.offset.x, params.texture.offset.y);

    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    skySphere.rotation.x = params.sphere.initialRotationX;
    skySphere.scale.y = params.sphere.scaleY;
    skySphere.scale.x = params.sphere.scaleX;
    return skySphere;
  };

  const skySphere = createSkySphere();
  scene.add(skySphere);

  // Add the moon
  const moonPivot = addMoonToScene(scene);

  // Setup camera
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
    }, 150);
  });

  // Input and animation
  let xRotation = 0;
  let yRotation = 0;
  let targetXRotation = 0;
  let targetYRotation = 0;

  const lerp = (start, end, alpha) => start + (end - start) * alpha;

  const handleInput = (deltaX, deltaY) => {
    targetXRotation += deltaX * 0.005;
    targetYRotation = Math.max(
      Math.min(targetYRotation + deltaY * 0.005, params.camera.maxTiltUp),
      params.camera.maxTiltDown
    );
  };

  // Device orientation handling
  let lastAlpha = null;

  const handleDeviceOrientation = (event) => {
    if (event.alpha !== null) {
      const alpha = (event.alpha / 180) * Math.PI; // Convert alpha to radians

      // Calculate the shortest rotation path for alpha
      if (lastAlpha !== null) {
        const deltaAlpha = alpha - lastAlpha;

        // Handle wrapping around 0 and 360 degrees
        if (deltaAlpha > Math.PI) {
          targetXRotation -= 2 * Math.PI - deltaAlpha; // Counter-clockwise
        } else if (deltaAlpha < -Math.PI) {
          targetXRotation += 2 * Math.PI + deltaAlpha; // Clockwise
        } else {
          targetXRotation += deltaAlpha; // Normal incremental change
        }
      }

      lastAlpha = alpha;

      // Process beta (vertical tilt) as before
      const beta = (event.beta / 180) * Math.PI; // Inverted tilt
      targetYRotation = Math.max(
        Math.min(beta, params.camera.maxTiltUp),
        params.camera.maxTiltDown
      );
    }
  };

  // Attach the listener
  requestDeviceOrientation(() => {
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  });

  // Touch gesture handling
  let lastTouchX = 0;
  let lastTouchY = 0;

  window.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;
    }
  });

  window.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      const deltaY = touch.clientY - lastTouchY;

      targetXRotation += deltaX * 0.005;
      targetYRotation = Math.max(
        Math.min(targetYRotation + deltaY * 0.005, params.camera.maxTiltUp),
        params.camera.maxTiltDown
      );

      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;
    }
  });

  window.addEventListener('mousemove', (event) => {
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;
    handleInput(deltaX, deltaY);
  });

  const animate = () => {
    xRotation = lerp(xRotation, targetXRotation, 0.15); // Smooth transition
    yRotation = lerp(yRotation, targetYRotation, 0.1);
    skySphere.rotation.y = xRotation;
    skySphere.rotation.x = yRotation;
    moonPivot.rotation.y = xRotation;
    moonPivot.rotation.x = yRotation;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
};