// stateManager.js

// Helper to get state from localStorage
export const getState = () => {
    const state = localStorage.getItem('appState');
    return state ? JSON.parse(state) : {}; // Return parsed state or default empty object
};

// Helper to update state in localStorage
const updateState = (newState) => {
    localStorage.setItem('appState', JSON.stringify(newState));
};

// Reducer function to handle state transitions
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BIRTHDATE':
            return { ...state, birthdate: action.payload };
        case 'SET_ZODIAC':
            return { ...state, zodiac: action.payload };
        case 'SET_ELEMENT':
            return { ...state, element: action.payload };
        case 'CLEAR':
            return {}; // Clear all state
        default:
            console.error(`Unknown action type: ${action.type}`);
            return state; // Return current state if action type is unknown
    }
};

export const birthdateExists = () => {
    const state = getState();
    return !!state.birthdate; // Returns true if birthdate exists, false otherwise
};

// Dispatch function to apply actions and update state
export const dispatch = (action) => {
    const currentState = getState(); // Get current state
    const newState = reducer(currentState, action); // Generate new state using the reducer
    updateState(newState); // Save updated state to localStorage

    // Optional: Trigger UI updates or callbacks
    console.log('State updated:', newState);
};

// Initialize state (optional default values)
export const initializeState = (defaultState) => {
    if (!localStorage.getItem('appState')) {
        updateState(defaultState);
    }
};

