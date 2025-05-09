// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
  
  if (!currentUser && !isLoginPage) {
    // Redirect to login page if not logged in
    window.location.href = 'index.html';
    return;
  }
  
  if (currentUser && isLoginPage) {
    // Redirect to home page if already logged in
    window.location.href = 'home.html';
    return;
  }
  
  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      
      if (!firstName || !lastName) {
        alert('Please enter both first and last name');
        return;
      }
      
      // Save user info to localStorage
      const user = {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Initialize empty results array if doesn't exist
      if (!localStorage.getItem('quizResults')) {
        localStorage.setItem('quizResults', JSON.stringify([]));
      }
      
      // Redirect to home page
      window.location.href = 'home.html';
    });
  }
  
  // Update user name in navbar
  const userNameElement = document.getElementById('user-name');
  if (userNameElement && currentUser) {
    userNameElement.textContent = currentUser.fullName;
  }
  
  // Logout button handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
});