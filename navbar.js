document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('loggedInUserName');
    const navActions = document.querySelector('.main-navbar .nav-actions');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (isLoggedIn && userName) {

        if (!isAuthPage) {
            const loginBtn = navActions.querySelector('.login-btn');
            const registerBtn = navActions.querySelector('.register-btn');
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';

            const langBtn = navActions.querySelector('.lang-btn');
            let userProfileLink = navActions.querySelector('.user-profile-link');

            if (!userProfileLink) {
                userProfileLink = document.createElement('a');
                userProfileLink.href = 'profile.html'; 
                userProfileLink.className = 'user-profile-link';

                const userIcon = document.createElement('i');
                userIcon.className = 'fa-solid fa-user user-profile-icon'; 

                userProfileLink.appendChild(userIcon); 
                userProfileLink.appendChild(document.createTextNode(userName)); 


                if (langBtn) {
                    langBtn.after(userProfileLink);
                } else {
                    navActions.appendChild(userProfileLink);
                }
            } else {
                const existingTextNode = Array.from(userProfileLink.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (existingTextNode) {
                    existingTextNode.nodeValue = userName;
                } else {
                    userProfileLink.appendChild(document.createTextNode(userName));
                }
            }
            if (langBtn) langBtn.style.display = 'inline-block';
        } else {
        
        }

    } else {
        
        const loginBtn = navActions.querySelector('.login-btn');
        const registerBtn = navActions.querySelector('.register-btn');
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';

        
        const userProfileLink = navActions.querySelector('.user-profile-link');
        if (userProfileLink) userProfileLink.remove();

        const logoutNavBtn = navActions.querySelector('.logout-nav-btn');
        if (logoutNavBtn) logoutNavBtn.remove();
    }
});