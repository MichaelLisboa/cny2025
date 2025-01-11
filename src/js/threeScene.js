import * as THREE from 'three';
import getDeviceInfo from './utils/deviceUtils';
import { requestDeviceOrientation } from './utils/handleIosPermissions';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Parameters for camera and sphere settings
const params = {
  camera: {
    position: { x: 0, y: 0, z: 0.5 }, // Simulates human eye level
    lookAt: { x: 0, y: -0.5, z: -2 }, // Tilt slightly upward
    mobilePosition: { x: 0, y: 0, z: 0.1 }, // Adjusted for mobile
    mobileLookAt: { x: 0, y: -1, z: -2 },
    maxTiltUp: Math.PI / 8, // Limit upward tilt (30 degrees)
    maxTiltDown: -Math.PI / 4, // Limit downward tilt (-7.5 degrees)
  },
  // camera: {
  //   position: { x: 0, y: 1.5, z: 0.5 }, // Simulates human eye level
  //   lookAt: { x: 0, y: 1, z: -2 }, // Tilt slightly upward
  //   mobilePosition: { x: 0, y: 0.5, z: 0.1 }, // Adjusted for mobile
  //   mobileLookAt: { x: 0, y: 0, z: -2 },
  //   maxTiltUp: Math.PI / 6, // Limit upward tilt (30 degrees)
  //   maxTiltDown: -Math.PI / 24, // Limit downward tilt (-7.5 degrees)
  // },
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
  // Load the moon texture and normal map
  const moonTexture = new THREE.TextureLoader().load(
    new URL('../assets/images/moon.jpg', import.meta.url).href
  );
  const moonNormalMap = new THREE.TextureLoader().load(
    new URL('../assets/images/moon_normal.jpg', import.meta.url).href
  );

  // Create high-resolution sphere geometry
  const moonGeometry = new THREE.SphereGeometry(100, 64, 64);

  // Use a standard material for the moon with a normal map
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalMap, // Adds depth to craters
    roughness: 0.6, // Matte finish for realism
    metalness: 0.0, // No metallic sheen
  });

  // Create the moon mesh
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.rotation.x = Math.PI / 6; // Slight tilt for visual interest

  // Create a pivot for the moon
  const moonPivot = new THREE.Object3D();
  scene.add(moonPivot); // Add pivot to the scene
  moonPivot.add(moon); // Add the moon to the pivot

  // Position the moon relative to the pivot
  if (isMobile) {
    moon.position.set(-350, 2000, -4500); // Mobile position
    moon.scale.set(1.5, 1.5, 1.5); // Mobile scale
  } else {
    moon.position.set(-700, 700, -2000); // Desktop position
    moon.scale.set(2, 2, 2); // Desktop scale
  }

  // Add a glow effect around the moon
  const glowGeometry = new THREE.SphereGeometry(115, 72, 72); // Slightly larger than the moon
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffcc, // Pale yellow glow
    transparent: true,
    opacity: 0.3, // Glow visibility
    side: THREE.BackSide, // Only visible from the outside
    depthWrite: false, // Avoid depth conflicts
  });

  const moonGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  moon.add(moonGlow); // Attach glow to the moon
  moonGlow.renderOrder = 1; // Ensure glow renders first

  // Add ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Softer ambient light
  scene.add(ambientLight);

  // Add a directional light to simulate sunlight
  const sunlight = new THREE.DirectionalLight(0xffffff, 1.5); // Simulate sunlight
  sunlight.position.set(1000, 1000, -1000); // Sun position
  sunlight.castShadow = false; // Shadows not needed
  scene.add(sunlight);

  // Function to rotate the moon pivot with the scene
  const animateMoon = (xRotation, yRotation) => {
    moonPivot.rotation.y = xRotation; // Rotate horizontally
    moonPivot.rotation.x = yRotation; // Rotate vertically
  };

  return { moonPivot, animateMoon };
};

export const initThreeScene = (app, isMobile) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    80, // Wider field of view for natural perspective
    window.innerWidth / window.innerHeight,
    0.1,
    5000 // Increased far clipping plane
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.25;
  app.appendChild(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5, // strength
    0.2, // radius
    0.8 // threshold
  );
  composer.addPass(bloomPass);

  // Create and configure the sky sphere
  const createSkySphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(1500, 60, 40);
    const texture = new THREE.TextureLoader().load(
      new URL('../assets/images/starry-sky-background-original.webp', import.meta.url).href
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
      const beta = -(event.beta / 180) * Math.PI; // Inverted tilt
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

  const { moonPivot, animateMoon } = addMoonToScene(scene);

const animate = () => {
  // Smoothly interpolate rotations
  xRotation = lerp(xRotation, targetXRotation, 0.15);
  yRotation = lerp(yRotation, targetYRotation, 0.1);

  // Rotate the sky sphere
  skySphere.rotation.y = xRotation;
  skySphere.rotation.x = yRotation;

  // Synchronize the moon's pivot with the scene
  animateMoon(xRotation, yRotation);

  // Render the scene
  composer.render();
  requestAnimationFrame(animate);
};
animate();
};