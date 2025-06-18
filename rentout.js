document.addEventListener('DOMContentLoaded', () => {
    const rentOutForm = document.getElementById('rent-out-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressBarSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const prevButtons = document.querySelectorAll('.prev-step-btn');
    const successMessage = document.getElementById('success-message');
    const formServerError = document.getElementById('form-server-error');

    let currentStep = 0;
    
    let selectedFiles = []; 
    const summaryVehicleType = document.getElementById('summary-vehicle-type');
    const summaryMakeModel = document.getElementById('summary-make-model');
    const summaryYear = document.getElementById('summary-year');
    const summaryLicensePlate = document.getElementById('summary-license-plate');
    const summaryDescription = document.getElementById('summary-description');
    const summaryDailyRate = document.getElementById('daily-rate'); 
    const summaryAvailability = document.getElementById('summary-availability');
    const summaryPickupDelivery = document.getElementById('summary-pickup-delivery');
    const summaryPhotosContainer = document.getElementById('summary-photos');
    const ownerInfoSection = document.getElementById('owner-info-section');
    const step3Title = document.getElementById('step3-title');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loggedInUserName = localStorage.getItem('loggedInUserName');
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    const ownerPhoneInput = document.getElementById('owner-phone'); 


    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        updateProgressBar(stepIndex);
        window.scrollTo(0, 0); 
    }

    function updateProgressBar(stepIndex) {
        progressBarSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < stepIndex) {
                step.classList.add('completed');
            } else if (index === stepIndex) {
                step.classList.add('active');
            }
        });
    }

    function validateStep(stepIndex) {
        let isValid = true;
        const currentFormStep = formSteps[stepIndex];
        // Hanya pilih input required yang tidak disembunyikan oleh display:none dan tidak disabled
        const inputs = currentFormStep.querySelectorAll('input[required]:not([style*="display: none"]):not([disabled]), select[required]:not([style*="display: none"]):not([disabled]), textarea[required]:not([style*="display: none"]):not([disabled])');

        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`);
            input.classList.remove('invalid');
            if (errorElement) errorElement.style.display = 'none';

            // Logika validasi untuk setiap input
            if (input.value.trim() === '' && input.type !== 'file') { 
                isValid = false;
                input.classList.add('invalid');
                if (errorElement) {
                    errorElement.textContent = `${input.previousElementSibling ? input.previousElementSibling.textContent : 'This field'} cannot be empty.`;
                    errorElement.style.display = 'block';
                }
            } else if (input.id === 'vehicle-photos') {
                if (selectedFiles.length < 1) { 
                    isValid = false;
                    input.classList.add('invalid');
                    if (errorElement) {
                        errorElement.textContent = 'Please upload at least one photo.';
                        errorElement.style.display = 'block';
                    }
                }
            } else if (input.id === 'vehicle-year') {
                const year = parseInt(input.value);
                const currentYear = new Date().getFullYear();
                if (isNaN(year) || year < 1900 || year > (currentYear + 2)) { 
                    isValid = false;
                    input.classList.add('invalid');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid year (e.g., 2020).';
                        errorElement.style.display = 'block';
                    }
                }
            } else if (input.id === 'daily-rate') {
                const rate = parseInt(input.value);
                if (isNaN(rate) || rate <= 0) {
                    isValid = false;
                    input.classList.add('invalid');
                    if (errorElement) {
                        errorElement.textContent = 'Daily rate must be a positive number.';
                        errorElement.style.display = 'block';
                    }
                }
            } else if (input.id === 'available-start-date' || input.id === 'available-end-date') {
                const startDateInput = document.getElementById('available-start-date');
                const endDateInput = document.getElementById('available-end-date');
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                const today = new Date();
                today.setHours(0,0,0,0); 

                if (startDateInput.value.trim() === '') {
                    isValid = false;
                    startDateInput.classList.add('invalid');
                    document.getElementById('available-start-date-error').textContent = 'Start date cannot be empty.';
                    document.getElementById('available-start-date-error').style.display = 'block';
                } else if (startDate < today) {
                    isValid = false;
                    startDateInput.classList.add('invalid');
                    document.getElementById('available-start-date-error').textContent = 'Start date cannot be in the past.';
                    document.getElementById('available-start-date-error').style.display = 'block';
                }
                
                if (endDateInput.value.trim() === '') {
                    isValid = false;
                    endDateInput.classList.add('invalid');
                    document.getElementById('available-end-date-error').textContent = 'End date cannot be empty.';
                    document.getElementById('available-end-date-error').style.display = 'block';
                } else if (endDate < startDate) {
                    isValid = false;
                    endDateInput.classList.add('invalid');
                    document.getElementById('available-end-date-error').textContent = 'End date cannot be before start date.';
                    document.getElementById('available-end-date-error').style.display = 'block';
                }
            } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                isValid = false;
                input.classList.add('invalid');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address.';
                    errorElement.style.display = 'block';
                }
            } else if (input.type === 'tel' && !isValidPhoneNumber(input.value.trim())) {
                isValid = false;
                input.classList.add('invalid');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid phone number (e.g., +628123...).';
                    errorElement.style.display = 'block';
                }
            }
        });
        return isValid;
    }


    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                    if (currentStep === 2) {
                        updateSummary();
                        if (isLoggedIn) {
                            ownerInfoSection.style.display = 'none';
                            step3Title.textContent = 'Step 3: Review Your Listing';
                            document.getElementById('owner-name').value = loggedInUserName || '';
                            document.getElementById('owner-email').value = loggedInUserEmail || '';
                            // Menonaktifkan input owner-phone dan mengosongkan nilainya
                            ownerPhoneInput.setAttribute('disabled', 'true');
                            ownerPhoneInput.removeAttribute('required'); // Tetap hapus required untuk jaga-jaga
                            ownerPhoneInput.value = ''; 
                        } else {
                            ownerInfoSection.style.display = 'block';
                            step3Title.textContent = 'Step 3: Your Contact & Review';
                            // Memastikan input owner-phone aktif dan required jika tidak login
                            ownerPhoneInput.removeAttribute('disabled');
                            ownerPhoneInput.setAttribute('required', 'true');
                        }
                    }
                }
            }
        });
    });

    
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    
    const vehiclePhotosInput = document.getElementById('vehicle-photos');
    const photoPreviewContainer = document.getElementById('photo-preview');

    vehiclePhotosInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        
        const newFilesToAdd = files.filter(file => !selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size));

        selectedFiles = [...selectedFiles, ...newFilesToAdd];

        renderPhotoPreviews();
        
        vehiclePhotosInput.value = ''; 
    });

    function renderPhotoPreviews() {
        photoPreviewContainer.innerHTML = ''; 
        if (selectedFiles.length === 0) return;

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.classList.add('photo-preview-item');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Vehicle Photo ${index + 1}`;

                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-photo');
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', () => {
                    selectedFiles.splice(index, 1); 
                    renderPhotoPreviews(); 
                    validateStep(currentStep); 
                });

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                photoPreviewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    
    function updateSummary() {
        summaryVehicleType.textContent = document.getElementById('vehicle-type').value || '-';
        summaryMakeModel.textContent = document.getElementById('vehicle-make-model').value || '-';
        summaryYear.textContent = document.getElementById('vehicle-year').value || '-';
        summaryLicensePlate.textContent = document.getElementById('license-plate').value || '-';
        summaryDescription.textContent = document.getElementById('vehicle-description').value || '-';
        
        const dailyRateValue = document.getElementById('daily-rate').value;
        summaryDailyRate.textContent = dailyRateValue ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dailyRateValue) : 'IDR 0';


        const startDate = document.getElementById('available-start-date').value;
        const endDate = document.getElementById('available-end-date').value;
        summaryAvailability.textContent = `${startDate} to ${endDate}`;

        const pickupDeliverySelect = document.getElementById('pickup-delivery-preference');
        summaryPickupDelivery.textContent = pickupDeliverySelect.options[pickupDeliverySelect.selectedIndex].text || '-';

        summaryPhotosContainer.innerHTML = '';
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Vehicle Photo';
                    summaryPhotosContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        } else {
            summaryPhotosContainer.textContent = 'No photos uploaded.';
        }
    }


    rentOutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Pastikan owner-phone dinonaktifkan dan tidak dianggap required jika disembunyikan
        if (isLoggedIn) {
            ownerPhoneInput.setAttribute('disabled', 'true');
            ownerPhoneInput.removeAttribute('required');
            ownerPhoneInput.value = ''; 
        } else {
            ownerPhoneInput.removeAttribute('disabled');
            ownerPhoneInput.setAttribute('required', 'true');
        }

        if (!validateStep(currentStep)) {
            return;
        }

        formServerError.style.display = 'block';
        formServerError.style.color = '#28a745';
        formServerError.textContent = 'Submitting your listing... Please wait.';

        setTimeout(() => {
            const formData = new FormData();
            formData.append('vehicleType', document.getElementById('vehicle-type').value);
            formData.append('makeModel', document.getElementById('vehicle-make-model').value);
            formData.append('year', document.getElementById('vehicle-year').value);
            formData.append('licensePlate', document.getElementById('license-plate').value);
            formData.append('description', document.getElementById('vehicle-description').value);
            formData.append('dailyRate', document.getElementById('daily-rate').value);
            formData.append('availableStartDate', document.getElementById('available-start-date').value);
            formData.append('availableEndDate', document.getElementById('available-end-date').value);
            formData.append('pickupDeliveryPreference', document.getElementById('pickup-delivery-preference').value);

           
            if (!isLoggedIn) { 
                formData.append('ownerName', document.getElementById('owner-name').value);
                formData.append('ownerEmail', document.getElementById('owner-email').value);
                formData.append('ownerPhone', document.getElementById('owner-phone').value);
            } else {
                 formData.append('ownerName', loggedInUserName);
                 formData.append('ownerEmail', loggedInUserEmail);
                 formData.append('ownerPhone', ownerPhoneInput.value || 'N/A'); 
            }

            selectedFiles.forEach((file, index) => {
                formData.append(`vehiclePhoto${index}`, file);
            });
            
            
            rentOutForm.style.display = 'none';
            successMessage.style.display = 'block';
            formServerError.style.display = 'none';

        }, 1500); 
    });

    function isValidEmail(email) {
        const re = /^[^.\s@]+@[^.\s@]+\.[^.\s@]+$/; 
        return re.test(String(email).toLowerCase());
    }

    function isValidPhoneNumber(phone) {
        const re = /^[0-9\s\+]{8,}$/; 
        return re.test(String(phone));
    }

    showStep(currentStep);
});