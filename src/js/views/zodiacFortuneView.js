import {getState} from '../utils/stateManager.js';

export default function zodiacFortuneView() {

    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        color: '#ffffff',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        zIndex: '1',
    });

    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    });

    const title = document.createElement('h1');
    title.textContent = 'Zodiac Fortune';
    Object.assign(title.style, {
        fontSize: '2rem',
        marginTop: '1rem',
        marginBottom: '1rem',
    });

    // Get the zodiac animal and element from state (localStorage)
    const state = getState();
    const { zodiac, element } = state;

    const zodiacInfo = document.createElement('h1');
    zodiacInfo.textContent = `${element} ${zodiac}`;
    Object.assign(zodiacInfo.style, {
        fontSize: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1rem',
    });

    contentContainer.appendChild(title);
    contentContainer.appendChild(zodiacInfo);
    container.appendChild(contentContainer);

    return container;
}
