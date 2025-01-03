import './router';
import { createNavBar } from './components/NavBar.js';

// Select the app container
const app = document.getElementById('app');
if (!app) {
  console.error('App container not found!');
  throw new Error('App container is missing.');
}

// Create the navbar
createNavBar(app);

// 1) Create the overlay div
const orientationOverlay = document.createElement('div');
Object.assign(orientationOverlay.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 1)',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  textAlign: 'center',
  opacity: '0',
  pointerEvents: 'none',
  transition: 'opacity 0.5s ease-in-out',
  zIndex: '10000',
});

orientationOverlay.textContent = 'Please rotate back to portrait mode for the best experience.';
document.body.appendChild(orientationOverlay);

// 2) Show/hide overlay in landscape only for touch devices
const checkOrientation = () => {
  // Only show overlay if device has touch capability
  if (!('ontouchstart' in window)) return;
  
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) {
    orientationOverlay.style.opacity = '1';
    orientationOverlay.style.pointerEvents = 'auto';
  } else {
    orientationOverlay.style.opacity = '0';
    orientationOverlay.style.pointerEvents = 'none';
  }
};

// 3) Listen for orientation or resize changes
window.addEventListener('resize', checkOrientation);
checkOrientation();

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