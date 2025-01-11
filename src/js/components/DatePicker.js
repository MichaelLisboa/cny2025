import { gsap } from 'gsap';

export const createDatePicker = () => {
    const datePickerWrapper = document.createElement('div');
    Object.assign(datePickerWrapper.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '600px', // Set max-width to 600px
        width: '100%', // Ensure it fits within the container
        margin: '16px auto',
        textAlign: 'center',
    });

    // Full-screen translucent overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        zIndex: '999', // Lower z-index than the calendar
        display: 'none', // Initially hidden
    });

    // Input field for birthdate
    const inputField = document.createElement('input');
    Object.assign(inputField.style, {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        outline: 'none', // Remove focus border
        marginBottom: '16px', // Add some space between the input field and the date picker
    });
    inputField.placeholder = 'Enter your birth date';
    inputField.readOnly = true; // Prevent manual typing

    // Date picker container
    const datePicker = document.createElement('div');
    Object.assign(datePicker.style, {
        position: 'fixed', // Change to fixed to ensure it is above the overlay
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: '1000', // Higher z-index than the overlay
        display: 'none', // Make it hidden initially
        padding: '16px',
        textAlign: 'center',
        width: '100%', // Ensure it fits within the container
        maxWidth: '600px', // Set max-width to 600px
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    });

    const monthDropdown = document.createElement('select');
    Object.assign(monthDropdown.style, {
        fontSize: '1.5rem',
        border: 'none',
        background: 'none',
        appearance: 'none',
        paddingRight: '40px', // Adjust padding to ensure the arrow is 16px to the right of the text
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23000\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center', // Ensure the arrow is 16px to the right of the text
        outline: 'none', // Remove focus border
        width: 'auto', // Ensure it adjusts to the content
    });

    const yearDropdown = document.createElement('select');
    Object.assign(yearDropdown.style, {
        fontSize: '1.5rem',
        border: 'none',
        background: 'none',
        appearance: 'none',
        paddingRight: '40px', // Adjust padding to ensure the arrow is 16px to the right of the text
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23000\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center', // Ensure the arrow is 16px to the right of the text
        outline: 'none', // Remove focus border
        width: 'auto', // Ensure it adjusts to the content
    });

    const daysGrid = document.createElement('div');
    Object.assign(daysGrid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', // 7 days in a week
        gap: '4px',
    });

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.textAlign = 'center';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.paddingBottom = '4px';
        daysGrid.appendChild(dayHeader);
    });

    // Populate year dropdown
    const currentYear = new Date().getFullYear();
    for (let i = 1900; i <= currentYear; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearDropdown.appendChild(option);
    }

    // Populate month dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthDropdown.appendChild(option);
    });

    header.appendChild(monthDropdown);
    header.appendChild(yearDropdown);
    datePicker.appendChild(header);
    datePicker.appendChild(daysGrid);
    // datePicker.appendChild(closeButton);

    // Function to update days based on selected month and year
    const updateDays = (month, year) => {
        daysGrid.innerHTML = '';
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.textAlign = 'center';
            dayHeader.style.fontWeight = 'bold';
            daysGrid.appendChild(dayHeader);
        });

        const today = new Date();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Add empty divs for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            daysGrid.appendChild(emptyDay);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('button');
            day.textContent = i;
            Object.assign(day.style, {
                textAlign: 'center',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                background: '#f5f5f5',
                color: '#333',
                borderRadius: '4px',
                fontSize: '1.25rem', // Set font size to 1.25rem
            });

            const isFuture = new Date(year, month, i) > today;
            if (isFuture) {
                day.style.cursor = 'not-allowed';
                day.style.color = '#999';
                day.style.background = '#ddd';
            } else {
                day.addEventListener('click', () => {
                    const selectedDate = new Date(year, month, i);
                    const formattedDate = `${i} ${months[month]}, ${year}`;
                    const submittedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                    inputField.value = formattedDate;
                    console.log(`Submitted Date: ${submittedDate}`);
                    gsap.to(datePicker, { opacity: 0, duration: 0.5, onComplete: () => {
                        datePicker.style.display = 'none';
                    }});
                    gsap.to(overlay, { opacity: 0, duration: 0.5, onComplete: () => {
                        overlay.style.display = 'none';
                    }});
                });
            }

            daysGrid.appendChild(day);
        }
    };

    // Initialize with current month/year
    const now = new Date();
    monthDropdown.value = now.getMonth();
    yearDropdown.value = now.getFullYear();
    updateDays(now.getMonth(), now.getFullYear());

    // Event Listeners for Dropdowns
    monthDropdown.addEventListener('change', () => {
        updateDays(Number(monthDropdown.value), Number(yearDropdown.value));
    });

    yearDropdown.addEventListener('change', () => {
        updateDays(Number(monthDropdown.value), Number(yearDropdown.value));
    });

    // Restore the input field click listener
    inputField.addEventListener('click', () => {
        overlay.style.display = 'block';
        datePicker.style.display = 'block';
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(datePicker, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    });

    // Add event listener to close the date picker when clicking outside
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            gsap.to(datePicker, { opacity: 0, duration: 0.3, onComplete: () => {
                datePicker.style.display = 'none';
            }});
            gsap.to(overlay, { opacity: 0, duration: 0.5, onComplete: () => {
                overlay.style.display = 'none';
            }});
        }
    });

    datePickerWrapper.appendChild(inputField);
    document.body.appendChild(overlay); 
    document.body.appendChild(datePicker); // Append the date picker to the body to ensure it is above the overlay
    
    // Return the wrapper so it can be appended elsewhere
    return datePickerWrapper;
};