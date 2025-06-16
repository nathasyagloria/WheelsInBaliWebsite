document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const sidebar = document.getElementById('sidebar');
  const logoutBtn = document.getElementById('logout');
  const loginBtn = document.querySelector('.login-btn');

  
  loginSection.style.display = 'none';
  dashboardSection.style.display = 'block'; 

  
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
  });


  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (email && password) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      sidebar.style.left = '-250px'; 
    } else {
      alert('Silakan masukkan email dan kata sandi.');
    }
  });


  logoutBtn.addEventListener('click', () => {
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
    sidebar.style.left = '-250px';
  });

  
  const navLinks = document.querySelectorAll('#sidebar ul li a[href="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      loginSection.style.display = 'flex';
      dashboardSection.style.display = 'none';
    });
  });
});
