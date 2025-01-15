import { getState, initializeState, dispatch } from '../utils/stateManager.js';
import { createDatePicker } from "./DatePicker.js";
import { createButton } from './Button.js';

export const captureBirthDate = ({ title, subtitle, onSubmit }) => {

    initializeState({
        birthdate: null,
    });

    // Main container
    const formContainer = document.createElement("div");
    Object.assign(formContainer.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        boxSizing: "border-box",
    });
    formContainer.className = "capture-birthdate-container";

    // Title and subtitle
    const formTitle = document.createElement("h1");
    formTitle.textContent = title;
    formTitle.className = "capture-birthdate-title";

    const formSubtitle = document.createElement("p");
    formSubtitle.textContent = subtitle;
    formSubtitle.className = "capture-birthdate-subtitle";

    // Input container
    const inputContainer = document.createElement("div");
    inputContainer.className = "capture-birthdate-input-container";

    // Date Picker
    const datePicker = createDatePicker((selectedDate) => {
        // Save submitted date to state
        dispatch({ type: "SET_BIRTHDATE", payload: selectedDate });
        nextButton.style.display = "block"; // Enable the "Next" button
    });

    inputContainer.appendChild(datePicker);

    // Submit Button (Next Button)
    const nextButton = createButton("Next", () => {
        const state = getState(); // Fetch the current state
        const selectedDate = state.birthdate; // Submitted date from state

        if (selectedDate) {
            onSubmit(selectedDate); // Pass the date to the callback
        } else {
            console.error("No valid date selected.");
        }
    });

    nextButton.setAttribute("aria-label", "Submit your birthdate and proceed");
    nextButton.style.display = "none"; // Initially hidden
    nextButton.className = "capture-birthdate-submit-button";

    // Assemble form
    formContainer.appendChild(formTitle);
    formContainer.appendChild(formSubtitle);
    formContainer.appendChild(inputContainer);
    formContainer.appendChild(nextButton);

    return formContainer;
};