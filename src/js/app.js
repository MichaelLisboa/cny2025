// Select the app container
const app = document.getElementById('app');

// Create the image element for the background
const backgroundImage = new Image();
backgroundImage.src = './src/assets/images/placeholder-bg.jpg'; // Path to your image
backgroundImage.style.position = 'absolute';
backgroundImage.style.bottom = '0'; // Always stick to the bottom
backgroundImage.style.left = '50%'; // Start horizontally centered
backgroundImage.style.transform = 'translateX(-50%)'; // Center the image horizontally
backgroundImage.style.width = 'auto'; // Maintain aspect ratio for width
backgroundImage.style.height = '110vh'; // Slightly larger than viewport height
backgroundImage.style.objectFit = 'cover';
backgroundImage.style.willChange = 'transform';
app.appendChild(backgroundImage);

// Variables to track movement
let xOffset = 0;

// Handle mouse move event
const handleMouseMove = (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 20; // Adjust range
  xOffset = moveX;
  updateBackgroundPosition();
};

// Handle device orientation for mobile
const handleDeviceOrientation = (event) => {
  const moveX = (event.gamma / 45) * 20; // Adjust range
  xOffset = moveX;
  updateBackgroundPosition();
};

// Update the background position
const updateBackgroundPosition = () => {
  backgroundImage.style.transform = `translateX(calc(-50% + ${xOffset}px))`; // Keep bottom fixed
};

// Handle window resize
window.addEventListener('resize', () => {
  backgroundImage.style.height = `${window.innerHeight * 1.1}px`; // Update height dynamically
  updateBackgroundPosition();
});

// Add event listeners for desktop and mobile
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('deviceorientation', handleDeviceOrientation);

// Set initial height and position
backgroundImage.style.height = `${window.innerHeight * 1.1}px`;
updateBackgroundPosition();