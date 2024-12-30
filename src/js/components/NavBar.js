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
        maxWidth: "clamp(480px, 40vw, 1200px)",
        gap: "0px",
    });

    const createLink = (text) => {
        const link = document.createElement("a");
        link.textContent = text;
        Object.assign(link.style, {
            fontSize: "clamp(14px, 2vw, 18px)", // Responsive text size
            fontWeight: "bold",
            color: "#fff",
            textDecoration: "none",
            whiteSpace: "nowrap", // Prevent text from wrapping
        });
        return link;
    };

    const leftLink = createLink("MAKE A WISH");
    const rightLink = createLink("YOUR FORTUNE");

    const logoContainer = document.createElement("div");
    Object.assign(logoContainer.style, {
        width: "80px",
        height: "80px",
        backgroundColor: "#fff",
        flexShrink: "0",
        margin: "48px auto 0 auto", // Ensure center alignment
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    });

    const logoContent = document.createElement("div");
    Object.assign(logoContent.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    });

    const logoText = document.createElement("div");
    logoText.textContent = "LOGO"; // Replace with your desired text or image
    Object.assign(logoText.style, {
        fontSize: "clamp(14px, 2vw, 18px)", // Responsive text size
        fontWeight: "bold",
        color: "#000", // Black text color
    });

    logoContent.appendChild(logoText);
    logoContainer.appendChild(logoContent);

    navContent.appendChild(leftLink);
    navContent.appendChild(logoContainer);
    navContent.appendChild(rightLink);
    navbar.appendChild(navContent);
    document.body.appendChild(navbar);

    const adjustNavbarStyles = () => {
        const width = window.innerWidth;

        if (width >= 2560) {
            navbar.style.height = "120px";
            logoContainer.style.width = "120px";
            logoContainer.style.height = "120px";
            leftLink.style.fontSize = "2.25rem";
            rightLink.style.fontSize = "2.25rem";
            logoText.style.fontSize = "1.5rem";
        } else if (width >= 1024) {
            navbar.style.height = "72px";
            logoContainer.style.width = "100px";
            logoContainer.style.height = "100px";
            leftLink.style.fontSize = "1.25rem";
            rightLink.style.fontSize = "1.25rem";
            logoText.style.fontSize = "1.25rem";
        } else {
            navbar.style.height = "56px";
            logoContainer.style.width = "72px";
            logoContainer.style.height = "72px";
            leftLink.style.fontSize = "0.9rem";
            rightLink.style.fontSize = "0.9rem";
            logoText.style.fontSize = "0,.9rem";
        }
    };

    // Initial adjustment
    adjustNavbarStyles();

    // Re-adjust on window resize
    window.addEventListener('resize', adjustNavbarStyles);
};

// Call the function to add the navbar
createNavBar();