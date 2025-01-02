import { home } from './views/home';
import { enterBirthdateView } from './views/enterBirthdateView';

// Define your routes
const routes = {
    '/': home,
    '/enter-birthdate': enterBirthdateView,
    // Add additional routes as needed
};

// Function to load the correct view
export const loadView = (path) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found!");
        return;
    }

    // 1) Create or select a router-view container
    let routerContainer = document.getElementById('router-view');
    if (!routerContainer) {
        routerContainer = document.createElement('div');
        routerContainer.id = 'router-view';
        Object.assign(routerContainer.style, {
            position: 'relative',
            zIndex: '3', // Ensure it is above the crowd scene
        });
        app.appendChild(routerContainer);
    }

    // 2) Clear only the routerContainer
    routerContainer.innerHTML = '';

    // 3) Load the view if it exists
    if (routes[path]) {
        const viewNode = routes[path]();
        if (viewNode) {
            routerContainer.appendChild(viewNode);
        } else {
            console.error(`Route at "${path}" didn't return a valid DOM node.`);
        }
    } else {
        console.error(`No view found for path: ${path}`);
    }
};

// Set up navigation
export const navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    loadView(path);
};

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    loadView(window.location.pathname);
});

// Load the initial view
loadView(window.location.pathname || '/');