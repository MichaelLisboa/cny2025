import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { requestDeviceOrientation } from './utils/handleIosPermissions';

function setupPostProcessing(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.4,
        1,
        0.75
    );
    composer.addPass(bloomPass);

    return composer;
}

const cameraParams = {
    desktop: {
        fov: 80,
        position: { x: 0, y: 1.5, z: 0 },
        lookAt: { x: 0, y: 0.5, z: -50 },
        maxTiltUp: THREE.MathUtils.degToRad(15),
        maxTiltDown: THREE.MathUtils.degToRad(-30),
    },
    mobile: {
        fov: 60,
        position: { x: 0, y: 4.5, z: 0 },
        lookAt: { x: 0, y: 8, z: -40 },
        maxTiltUp: THREE.MathUtils.degToRad(15),
        maxTiltDown: THREE.MathUtils.degToRad(-30),
    },
};

const objectParams = {
    desktop: {
        moon: { radius: 5 },
        starrySky: { radius: 500 },
    },
    mobile: {
        moon: { radius: 3.5 },
        starrySky: { radius: 400 },
    },
};

function addLighting(scene) {
    const sun = new THREE.DirectionalLight(0xffd27f, 2);
    sun.position.set(50, 100, -50);
    sun.target.position.set(100, 50, -180);
    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.bias = -0.0001;

    scene.add(sun);
    scene.add(sun.target);

    const ambientLight = new THREE.AmbientLight(0xdfdfdf, 0.36);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffcc, 0xdfdfdf, 0.8);
    scene.add(hemiLight);
}

function loadStarrySky(isMobile) {
    const skyRadius = isMobile ? objectParams.mobile.starrySky.radius : objectParams.desktop.starrySky.radius;
    const geometry = new THREE.SphereGeometry(skyRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const starrySkyTexture = textureLoader.load(new URL('../assets/images/equirectangular_starry_sky.webp', import.meta.url).href);
    starrySkyTexture.encoding = THREE.sRGBEncoding;
    const material = new THREE.MeshBasicMaterial({
        map: starrySkyTexture,
        side: THREE.BackSide,
        toneMapped: false,
    });

    return new THREE.Mesh(geometry, material);
}

function loadMoon(isMobile) {
    const moonRadius = isMobile ? objectParams.mobile.moon.radius : objectParams.desktop.moon.radius;
    const geometry = new THREE.SphereGeometry(moonRadius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(new URL('../assets/images/moon.webp', import.meta.url).href);
    moonTexture.encoding = THREE.sRGBEncoding;
    moonTexture.anisotropy = 16;
    const material = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.8,
        metalness: 0,
        emissive: 0xFFF6A4,
        emissiveIntensity: 0.5,
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.position.set(-10, 15, -50); // Adjusted height
    moon.receiveShadow = true;
    return moon;
}

export default function threeSkyScene(app, isMobile) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.25;
    app.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        isMobile ? cameraParams.mobile.fov : cameraParams.desktop.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(
        isMobile ? cameraParams.mobile.position.x : cameraParams.desktop.position.x,
        isMobile ? cameraParams.mobile.position.y : cameraParams.desktop.position.y,
        isMobile ? cameraParams.mobile.position.z : cameraParams.desktop.position.z
    );

    addLighting(scene);
    const starrySky = loadStarrySky(isMobile);
    const moon = loadMoon(isMobile);
    scene.add(starrySky);
    scene.add(moon);

    const maxTiltUp = isMobile ? cameraParams.mobile.maxTiltUp : cameraParams.desktop.maxTiltUp;
    const maxTiltDown = isMobile ? cameraParams.mobile.maxTiltDown : cameraParams.desktop.maxTiltDown;

    let targetRotationX = 0;
    let targetRotationY = 0;
    let lastAlpha = null;

    // Smoothing factors
    const smoothingFactor = 0.9; // Adjust for responsiveness
    const noiseThreshold = THREE.MathUtils.degToRad(0.5); // Ignore changes below 0.5 degrees

    const handleDeviceOrientation = (event) => {
        if (event.alpha !== null && event.beta !== null) {
            const alpha = THREE.MathUtils.degToRad(event.alpha); // Horizontal rotation
            const beta = THREE.MathUtils.degToRad(event.beta);   // Vertical tilt

            if (lastAlpha !== null) {
                let deltaAlpha = alpha - lastAlpha;

                // Handle wrapping around 0 and 360 degrees
                if (deltaAlpha > Math.PI) {
                    deltaAlpha -= 2 * Math.PI;
                } else if (deltaAlpha < -Math.PI) {
                    deltaAlpha += 2 * Math.PI;
                }

                // Apply smoothing and thresholding
                if (Math.abs(deltaAlpha) > noiseThreshold) {
                    targetRotationY += deltaAlpha * smoothingFactor;
                }
            }

            lastAlpha = alpha; // Update lastAlpha for the next frame

            // Clamp beta (vertical tilt) to max/min tilt parameters
            const clampedBeta = Math.max(
                Math.min(beta - Math.PI / 2, maxTiltUp),
                maxTiltDown
            );

            // Apply smoothing and ignore minor changes
            if (Math.abs(clampedBeta - targetRotationX) > noiseThreshold) {
                targetRotationX += (clampedBeta - targetRotationX) * smoothingFactor;
            }

            // Optional Debugging Logs
            console.log(`Alpha: ${event.alpha}, Beta: ${event.beta}`);
            console.log(`Target X Rotation: ${targetRotationX}, Target Y Rotation: ${targetRotationY}`);
        }
    };

    const limitVerticalTilt = () => {
        if (targetRotationX > maxTiltUp) targetRotationX = maxTiltUp;
        if (targetRotationX < maxTiltDown) targetRotationX = maxTiltDown;
    };

    if (isMobile) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);

        let lastTouchX = 0;
        let lastTouchY = 0;
        window.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                lastTouchX = event.touches[0].clientX;
                lastTouchY = event.touches[0].clientY;
            }
        });
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                const deltaX = event.touches[0].clientX - lastTouchX;
                const deltaY = event.touches[0].clientY - lastTouchY;

                targetRotationY += deltaX * 0.005;
                targetRotationX += deltaY * 0.005;
                limitVerticalTilt();

                lastTouchX = event.touches[0].clientX;
                lastTouchY = event.touches[0].clientY;
            }
        });

        requestDeviceOrientation(() => {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
        });
    } else {
        window.addEventListener('mousemove', (event) => {
            targetRotationY = (event.clientX / window.innerWidth - 0.5) * Math.PI * 2;
            targetRotationX = (event.clientY / window.innerHeight - 0.5) * Math.PI;
            limitVerticalTilt();
        });
    }

    const composer = setupPostProcessing(renderer, scene, camera);

    function animate() {
        camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.075;
        camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.075;

        composer.render();
        requestAnimationFrame(animate);
    }
    animate();
}