// Navbar Loader
document.addEventListener('DOMContentLoaded', function() {
  const navbarContainer = document.getElementById('navbar-container');
  
  if (navbarContainer) {
    // Fetch and insert navbar
    fetch('nav.html')
      .then(response => response.text())
      .then(html => {
        navbarContainer.innerHTML = html;
        
        // Initialize theme toggle after navbar is loaded
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.body.classList.add('dark-theme');
        }
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
          });
        }
        
        // Update user name in navbar
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
        navbarContainer.innerHTML = '<p>Error loading navigation</p>';
      });
  }
});