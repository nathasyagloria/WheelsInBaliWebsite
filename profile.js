document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        alert('You need to be logged in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    
    const welcomeMessage = document.getElementById('welcome-message');
    const profileDisplayMode = document.getElementById('profileDisplayMode');
    const displayFullName = document.getElementById('display-fullname');
    const displayEmail = document.getElementById('display-email');
    const displayPhone = document.getElementById('display-phone');
    const displayLocation = document.getElementById('display-location');
    const displayDob = document.getElementById('display-dob');
    const displayMemberSince = document.getElementById('display-member-since');
    const editProfileBtn = document.getElementById('editProfileBtn');

  
    const profileEditMode = document.getElementById('profileEditMode');
    const editFullName = document.getElementById('edit-fullname');
    const editEmail = document.getElementById('edit-email');
    const editPhone = document.getElementById('edit-phone');
    const editLocation = document.getElementById('edit-location');
    const editDob = document.getElementById('edit-dob');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

  
    const logoutBtnProfile = document.getElementById('logout-btn-profile');


    let userProfileData = {
        fullName: localStorage.getItem('profileFullName') || '',
        email: localStorage.getItem('loggedInUserEmail') || 'N/A',
        phone: localStorage.getItem('profilePhone') || '',
        location: localStorage.getItem('profileLocation') || '',
        dob: localStorage.getItem('profileDob') || '', 
        memberSince: localStorage.getItem('profileMemberSince') || 'Unknown Date'
    };

    if (!localStorage.getItem('profileMemberSince')) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long' };
        userProfileData.memberSince = today.toLocaleDateString('en-US', options);
        localStorage.setItem('profileMemberSince', userProfileData.memberSince);
    }

    const loggedInUserName = localStorage.getItem('loggedInUserName') || 'Pengguna';
    welcomeMessage.textContent = `Hello, ${loggedInUserName}!`;


    function displayProfileData() {
        displayFullName.textContent = userProfileData.fullName || 'Belum diisi';
        displayEmail.textContent = userProfileData.email; 
        displayPhone.textContent = userProfileData.phone || 'Belum diisi';
        displayLocation.textContent = userProfileData.location || 'Belum diisi';
        displayDob.textContent = userProfileData.dob || 'Belum diisi';
        displayMemberSince.textContent = userProfileData.memberSince;

        profileDisplayMode.classList.remove('hidden');
        profileEditMode.classList.add('hidden');
        editProfileBtn.style.display = 'inline-block';
        if (logoutBtnProfile) logoutBtnProfile.style.display = 'inline-block';
    }

    
    function fillEditForm() {
        editFullName.value = userProfileData.fullName;
        editEmail.value = userProfileData.email; 
        editPhone.value = userProfileData.phone;
        editLocation.value = userProfileData.location;
        editDob.value = userProfileData.dob; 
    }

    
    function enableEditMode() {
        fillEditForm();
        profileDisplayMode.classList.add('hidden');
        profileEditMode.classList.remove('hidden');
        editProfileBtn.style.display = 'none';
        if (logoutBtnProfile) logoutBtnProfile.style.display = 'none';
    }

    
    function saveProfileData() {
        userProfileData.fullName = editFullName.value.trim();
        userProfileData.phone = editPhone.value.trim();
        userProfileData.location = editLocation.value.trim();
        userProfileData.dob = editDob.value;

        localStorage.setItem('profileFullName', userProfileData.fullName);
        localStorage.setItem('profilePhone', userProfileData.phone);
        localStorage.setItem('profileLocation', userProfileData.location);
        localStorage.setItem('profileDob', userProfileData.dob);

        
        if (userProfileData.fullName) {
             const firstName = userProfileData.fullName.split(' ')[0];
             localStorage.setItem('loggedInUserName', firstName);
             welcomeMessage.textContent = `Hello, ${firstName}!`;
        } else {
            localStorage.setItem('loggedInUserName', 'Pengguna');
            welcomeMessage.textContent = `Hello, Pengguna!`;
        }

        alert('Profil berhasil diperbarui!');
        displayProfileData(); // Kembali ke mode tampilan


        window.location.reload(); 
    }

    
    function cancelEdit() {
        displayProfileData();
    }

    
    editProfileBtn.addEventListener('click', enableEditMode);
    saveProfileBtn.addEventListener('click', saveProfileData);
    cancelEditBtn.addEventListener('click', cancelEdit);

    if (logoutBtnProfile) {
        logoutBtnProfile.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUserName');
            localStorage.removeItem('loggedInUserEmail');
            localStorage.removeItem('profileFullName');
            localStorage.removeItem('profilePhone');
            localStorage.removeItem('profileLocation');
            localStorage.removeItem('profileDob');
            localStorage.removeItem('profileMemberSince');

            alert('Anda telah berhasil logout.');
            window.location.href = 'login.html'; 
        });
    }

    displayProfileData();
});