export const createNavBar = () => {
    const navbar = document.createElement("div");
    Object.assign(navbar.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "72px",
        background: "linear-gradient(180deg, rgba(7, 28, 57, 0.7), rgba(7, 28, 57, 0))",
        zIndex: "10000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
    });

    const navContent = document.createElement("div");
    Object.assign(navContent.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "90%",
        maxWidth: "640px",
        gap: "0px",
    });

    const leftLink = document.createElement("a");
    leftLink.textContent = "MAKE A WISH";
    Object.assign(leftLink.style, {
        fontSize: "clamp(14px, 2vw, 18px)", // Responsive text size
        fontWeight: "bold",
        color: "#fff",
        textAlign: "right",
        textDecoration: "none",
    });

    const rightLink = document.createElement("a");
    rightLink.textContent = "YOUR FORTUNE";
    Object.assign(rightLink.style, {
        fontSize: "clamp(14px, 2vw, 18px)", // Responsive text size
        fontWeight: "bold",
        color: "#fff",
        textDecoration: "none",
    });

    const logoContainer = document.createElement("div");
    Object.assign(logoContainer.style, {
        width: "80px",
        height: "80px",
        backgroundColor: "#fff",
        flexShrink: "0",
        margin: "48px auto 0 auto", // Ensure center alignment
    });

    navContent.appendChild(leftLink);
    navContent.appendChild(logoContainer);
    navContent.appendChild(rightLink);
    navbar.appendChild(navContent);
    document.body.appendChild(navbar);
};

// Call the function to add the navbar
createNavBar();