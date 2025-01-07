import { gsap } from 'gsap';
import { home } from '../views/home';
import { enterBirthdateView } from '../views/enterBirthdateView';
// import { createLanternView } from './views/createLanternView';
// import { previewLanternView } from './views/previewLanternView';
// import { shareLanternView } from './views/shareLanternView';
// import { viewLanternsView } from './views/viewLanternsView';
// import { zodiacFortuneView } from './views/zodiacFortuneView';

// Define your routes
const routes = {
    '/': home,
    '/enter-birthdate': enterBirthdateView,
    // '/create-lantern': createLanternView,
    // '/view-lantern': previewLanternView,
    // '/share-lantern': shareLanternView,
    // '/view-lanterns': viewLanternsView,
    // '/fortune': zodiacFortuneView,
    '/404': () => {
        const container = document.createElement('div');
        container.textContent = 'Page not found!';
        return container;
    },
};

// 1. Load the correct view with transitions
export const loadView = async (path) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found!");
        return;
    }

    // Create or select a router-view container
    let routerContainer = document.getElementById('router-view');
    if (!routerContainer) {
        routerContainer = document.createElement('div');
        routerContainer.id = 'router-view';
        Object.assign(routerContainer.style, {
            position: 'relative',
            zIndex: '3', // Ensure it is above the crowd scene
            overflow: 'hidden',
        });
        app.appendChild(routerContainer);
    }

    // Animate the outgoing view using GSAP
    if (routerContainer.children.length > 0) {
        await gsap.to(routerContainer.children, {
            opacity: 0,
            y: 50,
            duration: 0.5,
        });
    }

    // Clear only the routerContainer
    routerContainer.innerHTML = '';

    // Load the new view if it exists
    if (routes[path]) {
        const viewNode = routes[path]();
        if (viewNode) {
            routerContainer.appendChild(viewNode);

            // Animate the incoming view using GSAP
            gsap.from(viewNode, {
                opacity: 0,
                y: -50,
                duration: 0.5,
            });
        } else {
            console.error(`Route at "${path}" didn't return a valid DOM node.`);
        }
    } else {
        console.error(`No view found for path: ${path}`);
        navigateTo('/404'); // Redirect to 404 page if route doesn't exist
    }
};

// 2. Navigation function with dynamic route matching
export const navigateTo = (path) => {
    // Dynamic route matching (e.g., /user/:id)
    const matchedRoute = Object.keys(routes).find((route) => {
        const routeParts = route.split('/');
        const pathParts = path.split('/');
        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) =>
            part.startsWith(':') || part === pathParts[index]
        );
    });

    if (matchedRoute) {
        const params = {};
        const routeParts = matchedRoute.split('/');
        const pathParts = path.split('/');

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = pathParts[index];
            }
        });

        // Save params in history state for access in views
        window.history.pushState({ params }, '', window.location.origin + path);
    } else {
        window.history.pushState({}, '', window.location.origin + path);
    }

    loadView(path);
};

// 3. Middleware/hook support (e.g., route guards)
// export const useRouteGuard = (beforeNavigate) => {
//     const originalNavigateTo = navigateTo;

//     navigateTo = (path) => {
//         if (beforeNavigate(path)) {
//             originalNavigateTo(path);
//         }
//     };
// };

// 4. Lazy loading for performance optimization
const lazyLoadView = async (viewPath) => {
    const module = await import(viewPath);
    return module.default();
};

// Add lazy-loaded route example
routes['/settings'] = async () => {
    const settingsView = await lazyLoadView('./views/settingsView.js');
    return settingsView();
};

// 5. Scroll position management
const scrollPositions = {};
window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    loadView(path);

    // Restore scroll position
    if (scrollPositions[path]) {
        window.scrollTo(0, scrollPositions[path]);
    } else {
        window.scrollTo(0, 0);
    }
});

// Save scroll position on navigation
document.addEventListener('scroll', () => {
    const path = window.location.pathname;
    scrollPositions[path] = window.scrollY;
});

// 6. Error handling for undefined routes
routes['/404'] = () => {
    const container = document.createElement('div');
    container.innerHTML = '<h1>404 - Page Not Found</h1>';
    return container;
};

// Load the initial view
loadView(window.location.pathname || '/');