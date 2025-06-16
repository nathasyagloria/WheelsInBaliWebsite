document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rent-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const orderStatusMessage = document.createElement('div');
    orderStatusMessage.id = 'order-status-message';
    document.body.appendChild(orderStatusMessage);

    let currentStep = 0;
    const vehicleData = {
        car: [
            { model: "Grand New Avanza 1.3L CVT", price: 600000, image: "image/avanza.png" },
            { model: "Daihatsu Xenia MPV", price: 600000, image: "image/xenia.png" },
            { model: "Toyota Rush", price: 600000, image: "image/rush.png" },
            { model: "Daihatsu Terios R Deluxe 1.5 AT", price: 600000, image: "image/terios.png" },
            { model: "Toyota Grand New Kijang Innova", price: 800000, image: "image/innova.png" },
            { model: "Toyota Kijang Innova Reborn G-AT Diesel", price: 900000, image: "image/reborn.png" },
            { model: "Toyota Raize 1.0 Turbo G CVT", price: 1700000, image: "image/raize.png" },
            { model: "Mazda CX-3 1.5L Sport", price: 1800000, image: "image/cx3.png" },
        ],
        motorcycle: [
            { model: "Yamaha NMAX 155", price: 120000, image: "image/nmax.png" },
            { model: "Honda PCX 160", price: 130000, image: "image/pcx.png" },
            { model: "Honda Vario 125", price: 90000, image: "image/vario.png" },
            { model: "Yamaha Aerox 155", price: 100000, image: "image/aerox.png" },
            { model: "Yamaha XMAX 250", price: 180000, image: "image/xmax.png" },
            { model: "Honda Scoopy", price: 85000, image: "image/scoopy.png" },
            { model: "Honda Beat Street", price: 80000, image: "image/beat.png" },
            { model: "Yamaha Lexi 125", price: 95000, image: "image/lexi.png" },
            { model: "Honda Revo FI", price: 70000, image: "image/revo.png" },
            { model: "Honda CRF 150L", price: 160000, image: "image/crf.png" },
            { model: "Kawasaki KLX 150", price: 160000, image: "image/klx.png" },
            { model: "Vespa LX 125 i-Get", price: 190000, image: "image/vespa.png" },
        ],
        'e-bike': [
            { model: "GESITS G1", price: 120000, image: "image/gesits.png" },
            { model: "Viar Q1", price: 110000, image: "image/viar.png" },
            { model: "Alva One", price: 140000, image: "image/alvaone.png" },
            { model: "Selis E-Max", price: 100000, image: "image/selix.png" }, 
            { model: "Smoot Tempur", price: 115000, image: "image/smoot.png" },
            { model: "Uwinfly Neoz", price: 105000, image: "image/uwinfly.png" },
        ],
        bike: [
            { model: "Polygon Xtrada 6", price: 80000, image: "image/polygon.png" },
            { model: "United Miami 4.0", price: 75000, image: "image/united.png" },
            { model: "Polygon Helios LT3", price: 90000, image: "image/helios.png" },
            { model: "Element MTB FS", price: 70000, image: "image/element.png" },
            { model: "Pasific NORIS NEXX 3.0", price: 65000, image: "image/pasific.png" },
            { model: "Brompton M6L", price: 150000, image: "image/brompton.png" },
        ]
    };

   
    const summaryVehicleImage = document.getElementById('summary-vehicle-image');
    const summaryVehicleType = document.getElementById('summary-vehicle-type');
    const summaryVehicleModel = document.getElementById('summary-vehicle-model');
    const summaryPickupAddress = document.getElementById('summary-pickup-address');
    const summaryRentalPeriod = document.getElementById('summary-rental-period');
    const summaryRentalDays = document.getElementById('summary-rental-days');
    const summaryDailyRate = document.getElementById('summary-daily-rate');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotalToPay = document.getElementById('summary-total-to-pay');

   
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    const vehicleModelSelect = document.getElementById('vehicle-model');
    const vehiclePreviewContainer = document.getElementById('vehicle-preview-container');
    const pickupAddressInput = document.getElementById('pickup-address');
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');

   
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    pickupDateInput.setAttribute('min', todayString);
    returnDateInput.setAttribute('min', todayString);


    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        progressSteps.forEach((pStep, index) => {
            if (index <= stepIndex) {
                pStep.classList.add('active');
            } else {
                pStep.classList.remove('active');
            }
        });
    }

    function validateStep(stepIndex) {
        const currentActiveStep = formSteps[stepIndex];
        const inputs = currentActiveStep.querySelectorAll('[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) { 
                allValid = false;
                input.reportValidity(); 
            }
        });

       
        if (stepIndex === 0) { 
            const pickupDate = new Date(pickupDateInput.value);
            const returnDate = new Date(returnDateInput.value);
            if (returnDate < pickupDate) {
                returnDateInput.setCustomValidity('Return date cannot be before pickup date.');
                returnDateInput.reportValidity();
                allValid = false;
            } else {
                returnDateInput.setCustomValidity(''); 
            }
        }
        
       
        if (stepIndex === 2) {
            const paymentMethodSelected = document.querySelector('input[name="paymentMethod"]:checked');
            if (!paymentMethodSelected) {
                alert('Please select a payment method.');
                allValid = false;
            }
        }

        return allValid;
    }

    function updateSummary() {
        
        const selectedVehicleType = vehicleTypeSelect.value;
        const selectedVehicleModel = vehicleModelSelect.value;
        const pickupAddress = pickupAddressInput.value;
        const pickupDate = pickupDateInput.value;
        const returnDate = returnDateInput.value;

        
        summaryVehicleType.textContent = selectedVehicleType ? selectedVehicleType.charAt(0).toUpperCase() + selectedVehicleType.slice(1) : 'N/A';
        summaryVehicleModel.textContent = selectedVehicleModel || 'N/A';
        summaryPickupAddress.textContent = pickupAddress || 'N/A';

        
        const selectedVehicle = vehicleData[selectedVehicleType]?.find(v => v.model === selectedVehicleModel);
        if (selectedVehicle && selectedVehicle.image) {
            summaryVehicleImage.src = selectedVehicle.image;
            summaryVehicleImage.classList.remove('hidden');
        } else {
            summaryVehicleImage.src = '';
            summaryVehicleImage.classList.add('hidden');
        }

       
        let dailyRate = 0;
        let rentalDays = 0;
        if (pickupDate && returnDate) {
            const start = new Date(pickupDate);
            const end = new Date(returnDate);

            
            if (start.getTime() === end.getTime()) {
                rentalDays = 1;
            } else {
                const diffTime = Math.abs(end - start);
                rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
            }
            
            summaryRentalPeriod.textContent = `${formatDate(start)} - ${formatDate(end)}`;
            summaryRentalDays.textContent = `${rentalDays} Day(s)`;

            if (selectedVehicle) {
                dailyRate = selectedVehicle.price;
            }
        } else {
            summaryRentalPeriod.textContent = 'N/A';
            summaryRentalDays.textContent = '0 Day(s)';
        }

        const subtotal = dailyRate * rentalDays;
        const totalToPay = subtotal; 

        summaryDailyRate.textContent = `IDR ${dailyRate.toLocaleString('en-ID')}`;
        summarySubtotal.textContent = `IDR ${subtotal.toLocaleString('en-ID')}`;
        summaryTotalToPay.textContent = `IDR ${totalToPay.toLocaleString('en-ID')}`;
    }

    function formatDate(date) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    vehicleTypeSelect.addEventListener('change', () => {
        const type = vehicleTypeSelect.value;
        vehicleModelSelect.innerHTML = '<option value="">Select Vehicle Model</option>'; 
        vehicleModelSelect.disabled = true;
        vehiclePreviewContainer.innerHTML = ''; 

        if (type && vehicleData[type]) {
            vehicleData[type].forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.model;
                option.textContent = vehicle.model;
                vehicleModelSelect.appendChild(option);
            });
            vehicleModelSelect.disabled = false;
        }
        updateSummary();
    });

    vehicleModelSelect.addEventListener('change', () => {
        const type = vehicleTypeSelect.value;
        const model = vehicleModelSelect.value;
        const selectedVehicle = vehicleData[type]?.find(v => v.model === model);
        
        vehiclePreviewContainer.innerHTML = ''; 
        if (selectedVehicle && selectedVehicle.image) {
            const img = document.createElement('img');
            img.src = selectedVehicle.image;
            img.alt = selectedVehicle.model;
            img.classList.remove('hidden'); 
            vehiclePreviewContainer.appendChild(img);
        }
        updateSummary();
    });

    pickupAddressInput.addEventListener('input', updateSummary);
    pickupDateInput.addEventListener('change', updateSummary);
    returnDateInput.addEventListener('change', updateSummary);


    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        if (!validateStep(currentStep)) {
            orderStatusMessage.className = 'error';
            orderStatusMessage.textContent = 'Please correct the errors in the form.';
            orderStatusMessage.style.display = 'block';
            setTimeout(() => orderStatusMessage.style.display = 'none', 3000);
            return;
        }

        
        orderStatusMessage.className = '';
        orderStatusMessage.textContent = 'Processing your order...';
        orderStatusMessage.style.display = 'block';
        
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        console.log("Form Data Submitted:", data);

        try {
            
            await new Promise(resolve => setTimeout(resolve, 2000)); 

           
            orderStatusMessage.className = '';
            orderStatusMessage.textContent = 'Order successful! Your order is being processed.';
            orderStatusMessage.style.backgroundColor = '#28a745'; 
            orderStatusMessage.style.display = 'block';

            
            setTimeout(() => {
                orderStatusMessage.style.display = 'none';
                form.reset();
                currentStep = 0;
                showStep(currentStep);
                updateSummary(); 
                vehicleModelSelect.disabled = true; 
                vehiclePreviewContainer.innerHTML = ''; 
            }, 3000);

        } catch (error) {
            console.error('Order submission failed:', error);
            orderStatusMessage.className = 'error';
            orderStatusMessage.textContent = 'Order failed. Please try again.';
            orderStatusMessage.style.backgroundColor = '#dc3545'; 
            orderStatusMessage.style.display = 'block';
            setTimeout(() => orderStatusMessage.style.display = 'none', 3000);
        }
    });


    showStep(currentStep);
    updateSummary(); 
});