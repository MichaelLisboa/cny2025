export const createDatePicker = () => {
    const datePickerWrapper = document.createElement('div');
    Object.assign(datePickerWrapper.style, {
        position: 'relative',
        maxWidth: '400px',
        margin: '16px auto',
        textAlign: 'center',
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
        outline: 'none',
    });
    inputField.placeholder = 'Enter your birth date';
    inputField.readOnly = true; // Prevent manual typing

    // Date picker container
    const datePicker = document.createElement('div');
    Object.assign(datePicker.style, {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: '1000',
        display: 'none', // Initially hidden
        padding: '16px',
        textAlign: 'center',
        width: '90vw',
        maxWidth: '400px',
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    });

    const monthDropdown = document.createElement('select');
    const yearDropdown = document.createElement('select');

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

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    Object.assign(closeButton.style, {
        marginTop: '16px',
        padding: '8px 16px',
        background: '#f00',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    });

    closeButton.addEventListener('click', () => {
        datePicker.style.display = 'none';
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
    datePicker.appendChild(closeButton);

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
                    datePicker.style.display = 'none';
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

    // Show date picker on input field click
    inputField.addEventListener('click', () => {
        datePicker.style.display = 'block';
    });

    datePickerWrapper.appendChild(inputField);
    datePickerWrapper.appendChild(datePicker);
    document.body.appendChild(datePickerWrapper);
};

// Call the function to add the date picker
createDatePicker();