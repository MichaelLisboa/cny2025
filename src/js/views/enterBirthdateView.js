export const enterBirthdateView = () => {
    const container = document.createElement("div");
    Object.assign(container.style, {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        padding: "20px",
        boxSizing: "border-box",
        color: "#ffffff", // Text color
        textAlign: "center",
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
        maxWidth: "400px",
    });

    // Input Field
    const input = document.createElement("input");
    Object.assign(input.style, {
        width: "100%",
        padding: "10px",
        border: "1px solid #ffffff",
        borderRadius: "5px",
        backgroundColor: "transparent",
        color: "#ffffff",
        fontSize: "1rem",
        textAlign: "center",
        marginBottom: "20px",
    });
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter birthday here");

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
    });

    // Append elements
    inputContainer.appendChild(input);
    inputContainer.appendChild(nextButton);
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(inputContainer);

    // Return the view
    return container;
};