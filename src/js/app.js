// Select the app container
const app = document.getElementById('app');

// Create the background image
const backgroundImage = new Image();
backgroundImage.src = new URL('./assets/images/placeholder-bg.jpg', import.meta.url).href;
backgroundImage.style.position = 'absolute';
backgroundImage.style.bottom = '0'; // Stick to the bottom of the viewport
backgroundImage.style.left = '50%'; // Center horizontally
backgroundImage.style.transform = 'translateX(-50%)';
backgroundImage.style.height = '110vh'; // Slightly larger than the viewport height
backgroundImage.style.objectFit = 'cover';
backgroundImage.style.willChange = 'transform';
app.appendChild(backgroundImage);

// Create the text image overlay
const textImage = new Image();
textImage.src = new URL('./assets/images/placeholder-text.jpg', import.meta.url).href;
textImage.style.position = 'absolute';
textImage.style.top = '50%'; // Center vertically
textImage.style.left = '50%'; // Center horizontally
textImage.style.transform = 'translate(-50%, -50%)';
textImage.style.willChange = 'transform';
app.appendChild(textImage);

// Function to dynamically adjust text image width
const adjustTextImageWidth = () => {
  if (window.innerWidth >= 1024) {
    textImage.style.width = '70vw'; // Desktop
  } else {
    textImage.style.width = '80vw'; // Mobile and tablet
  }
};

// Initial adjustment
adjustTextImageWidth();

// Re-adjust on window resize
window.addEventListener('resize', () => {
  adjustTextImageWidth();
  backgroundImage.style.height = `${window.innerHeight * 1.1}px`; // Dynamically update height
});

// Variables to track movement
let xOffset = 0;
let yOffset = 0;

// Common function to update positions
const updatePositions = () => {
  backgroundImage.style.transform = `translateX(calc(-50% + ${xOffset / 6}px))`;
  textImage.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
};

// Handle mouse movement
window.addEventListener('mousemove', (event) => {
  const moveX = (event.clientX / window.innerWidth - 0.5) * 100; // Amplified range for dramatic effect
  const moveY = (event.clientY / window.innerHeight - 0.5) * 100; // Amplified range for dramatic effect

  xOffset = Math.min(Math.max(moveX, -window.innerWidth * 0.2), window.innerWidth * 0.2);
  yOffset = Math.min(Math.max(moveY, -window.innerHeight * 0.2), window.innerHeight * 0.2);

  updatePositions();
});

// Handle touch gestures
window.addEventListener('touchmove', (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const moveX = (touch.clientX / window.innerWidth - 0.5) * 100;
    const moveY = (touch.clientY / window.innerHeight - 0.5) * 100;

    xOffset = Math.min(Math.max(moveX, -window.innerWidth * 0.2), window.innerWidth * 0.2);
    yOffset = Math.min(Math.max(moveY, -window.innerHeight * 0.2), window.innerHeight * 0.2);

    updatePositions();
  }
});

// Handle device orientation
window.addEventListener('deviceorientation', (event) => {
  const moveX = (event.gamma / 45) * 100; // Amplified range
  const moveY = (event.beta / 90) * 100; // Amplified range

  xOffset = Math.min(Math.max(moveX, -window.innerWidth * 0.2), window.innerWidth * 0.2);
  yOffset = Math.min(Math.max(moveY, -window.innerHeight * 0.2), window.innerHeight * 0.2);

  updatePositions();
});