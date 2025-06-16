document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const fullnameError = document.getElementById('fullname-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const serverError = document.getElementById('server-error');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

    
        fullnameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        serverError.textContent = '';

        fullnameInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        confirmPasswordInput.classList.remove('invalid');
        serverError.style.display = 'none';

        let isValid = true;

        
        if (fullnameInput.value.trim() === '') {
            fullnameError.textContent = 'Full Name cannot be empty.';
            fullnameInput.classList.add('invalid');
            isValid = false;
        }

        
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email cannot be empty.';
            emailInput.classList.add('invalid');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('invalid');
            isValid = false;
        }

       
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Password cannot be empty.';
            passwordInput.classList.add('invalid');
            isValid = false;
        } else if (passwordInput.value.length < 8) { // Contoh: minimal 8 karakter
            passwordError.textContent = 'Password must be at least 8 characters long.';
            passwordInput.classList.add('invalid');
            isValid = false;
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(passwordInput.value)) { // Contoh: harus ada angka, huruf kecil, huruf besar
            passwordError.textContent = 'Password must include uppercase, lowercase, and a number.';
            passwordInput.classList.add('invalid');
            isValid = false;
        }


       
        if (confirmPasswordInput.value.trim() === '') {
            confirmPasswordError.textContent = 'Confirm Password cannot be empty.';
            confirmPasswordInput.classList.add('invalid');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            confirmPasswordInput.classList.add('invalid');
            isValid = false;
        }

        
        if (isValid) {
            
            console.log('Register attempt with:', {
                fullname: fullnameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            });

    
            serverError.textContent = 'Registering...';
            serverError.style.display = 'block';
            serverError.style.color = '#28a745'; 

            setTimeout(() => {
                const simulationSuccess = true; 

                if (simulationSuccess) {
                    window.location.href = 'afterLogin.html';
                } else {
                    serverError.textContent = 'Registration failed. Email might already be in use.'; 
                    serverError.style.display = 'block';
                    serverError.style.color = '#e74c3c'; 
                }
            }, 1500); 
        }
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});