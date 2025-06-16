document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const serverError = document.getElementById('server-error'); 

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        emailError.textContent = '';
        passwordError.textContent = '';
        serverError.textContent = '';
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        serverError.style.display = 'none'; 

        let isValid = true;


        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email cannot be empty.';
            emailInput.classList.add('invalid');
            emailError.style.display = 'block'; 
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('invalid');
            emailError.style.display = 'block'; 
            isValid = false;
        }

        
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Password cannot be empty.';
            passwordInput.classList.add('invalid');
            passwordError.style.display = 'block'; 
            isValid = false;
        } else if (passwordInput.value.length < 6) { 
            passwordError.textContent = 'Password must be at least 6 characters long.';
            passwordInput.classList.add('invalid');
            passwordError.style.display = 'block'; 
            isValid = false;
        }

        if (isValid) {
            console.log('Login attempt with:', {
                email: emailInput.value,
                password: passwordInput.value
            });
    
            serverError.textContent = 'Logging in...';
            serverError.style.display = 'block'; 
            serverError.style.color = '#28a745'; 
    
    
            setTimeout(() => {
                const simulationSuccess = true; 

                if (simulationSuccess) {
                    const userEmail = emailInput.value.trim();
                    const userName = userEmail.split('@')[0];
    
                   
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('loggedInUserName', userName);
                    localStorage.setItem('loggedInUserEmail', userEmail);
                    window.location.href = 'afterLogin.html';
                } else {
                    
                    serverError.textContent = 'Invalid email or password.';
                    serverError.style.display = 'block';
                    serverError.style.color = '#e74c3c'; 
                }
            }, 50); 
        }
    });

    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});