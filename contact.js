document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactStatusMessage = document.getElementById('contact-status-message');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        if (!name || !email || !subject || !message) {
            contactStatusMessage.classList.add('error');
            contactStatusMessage.classList.remove('success');
            contactStatusMessage.textContent = 'Please fill in all required fields.';
            contactStatusMessage.style.display = 'block';
            return;
        }

       
        contactStatusMessage.classList.remove('success', 'error');
        contactStatusMessage.textContent = 'Sending your message...';
        contactStatusMessage.style.display = 'block';

        
        try {
            
            await new Promise(resolve => setTimeout(resolve, 2000));

          
                contactStatusMessage.classList.add('success');
                contactStatusMessage.classList.remove('error');
                contactStatusMessage.textContent = 'Your message has been sent successfully! We will get back to you soon.';
                contactForm.reset(); 
            

        } catch (error) {
            console.error('Contact form submission error:', error);
            contactStatusMessage.classList.add('error');
            contactStatusMessage.classList.remove('success');
            contactStatusMessage.textContent = `Error sending message: ${error.message || 'Please try again.'}`;
        } finally {
           
            setTimeout(() => {
                contactStatusMessage.style.display = 'none';
            }, 5000); 
        }
    });
});