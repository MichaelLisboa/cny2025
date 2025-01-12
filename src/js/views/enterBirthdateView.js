import { createDatePicker } from "../components/DatePicker";

export const enterBirthdateView = () => {
    const container = document.createElement("div");
    Object.assign(container.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        color: "#ffffff", // Text color
        textAlign: "center",
    });

    // Content Container
    const contentContainer = document.createElement("div");
    Object.assign(contentContainer.style, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        maxWidth: "400px",
        padding: "20px",
        boxSizing: "border-box",
    });

    // Title
    const title = document.createElement("h1");
    title.textContent = "Enter your birthday for a fortune";
    Object.assign(title.style, {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
    });

    // Subtitle
    const subtitle = document.createElement("p");
    subtitle.textContent = "When did the sky grace us with your presence?";
    Object.assign(subtitle.style, {
        fontSize: "1rem",
        marginBottom: "20px",
    });

    // Input Container
    const inputContainer = document.createElement("div");
    Object.assign(inputContainer.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative", // Ensure the date picker can be positioned relative to this container
    });

    // Create and append the datePicker on load
    const datePicker = createDatePicker();
    inputContainer.appendChild(datePicker);

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    Object.assign(nextButton.style, {
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#ffb703",
        color: "#001d3d",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "20px", // Add some space between the date picker and the button
    });

    // Append elements to content container
    contentContainer.appendChild(title);
    contentContainer.appendChild(subtitle);
    contentContainer.appendChild(inputContainer);
    contentContainer.appendChild(nextButton);

    // Append content container to main container
    container.appendChild(contentContainer);

    // Return the view
    return container;
};