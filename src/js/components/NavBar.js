import getDeviceInfo from "../utils/deviceUtils";

export const createNavBar = () => {

    // Get device information
    const { isMobile } = getDeviceInfo();

    const navbar = document.createElement("div");
    Object.assign(navbar.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "72px",
        background: "linear-gradient(180deg, rgba(7, 28, 57, 0.6), rgba(7, 28, 57, 0.25) 30%, rgba(7, 28, 57, 0.075) 60%, rgba(7, 28, 57, 0) 100%)",
        zIndex: "10000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(6px)",
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
    app.appendChild(navbar);

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
    window.addEventListener("resize", adjustNavbarStyles);

    if (isMobile) {
        // Drag-to-refresh logic
        const refreshIndicator = document.createElement("div");
        Object.assign(refreshIndicator.style, {
            position: "absolute",
            top: "32",
            left: "0",
            right: "0",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            fontWeight: "700",
            zIndex: "1000",
            opacity: "0",
            transition: "opacity 0.3s ease",
        });
        refreshIndicator.textContent = "Refreshing...";
        document.body.appendChild(refreshIndicator);

        const appContainer = document.body;

        let isDragging = false;
        let startY = 0;
        let currentY = 0;

        const onDragStart = (event) => {
            isDragging = true;
            startY = event.touches ? event.touches[0].clientY : event.clientY;
        };

        const onDragMove = (event) => {
            if (!isDragging) return;

            currentY = event.touches ? event.touches[0].clientY : event.clientY;
            const offsetY = currentY - startY;

            if (offsetY > 0) {
                appContainer.style.transform = `translateY(${Math.min(offsetY, 150)}px)`;
            }
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            const offsetY = currentY - startY;
            if (offsetY > 100) {
                refreshIndicator.style.opacity = "1";
                setTimeout(() => {
                    location.reload(); // Basic browser refresh
                }, 500);
            } else {
                appContainer.style.transition = "transform 0.3s ease";
                appContainer.style.transform = "translateY(0)";
            }
        };

        // Attach event listeners only to navbar
        navbar.addEventListener("touchstart", onDragStart);
        navbar.addEventListener("touchmove", onDragMove);
        navbar.addEventListener("touchend", onDragEnd);
    }
};

// Call the function to add the navbar
createNavBar();