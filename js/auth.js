/**
 * Authentication functionality for the ITC Quiz App
 */

// Check if user is already authenticated
function checkAuth() {
  const userData = localStorage.getItem('itc_quiz_user');
  if (userData) {
    // If on index page and already authenticated, redirect to test page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
      window.location.href = 'test.html';
    }
    return true;
  }
  
  // If on test page but not authenticated, redirect to index page
  if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/stats.html' && window.location.pathname !== 'stats.html') {
    window.location.href = 'index.html';
  }
  return false;
}

// Handle auth form submission
function setupAuthForm() {
  const authForm = document.getElementById('auth-form');
  if (!authForm) return;
  
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    
    if (!firstName || !lastName) {
      alert('Please enter both first name and last name');
      return;
    }
    
    // Save user data
    const userData = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      id: Date.now().toString(),
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('itc_quiz_user', JSON.stringify(userData));
    
    // Redirect to the test page
    window.location.href = 'test.html';
  });
}

// Get current user data
function getCurrentUser() {
  const userData = localStorage.getItem('itc_quiz_user');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
}

// Display user name in the UI
function displayUserInfo() {
  const userNameElement = document.getElementById('user-name');
  const userNameStatsElement = document.getElementById('user-name-stats');
  
  const user = getCurrentUser();
  
  if (user) {
    if (userNameElement) {
      userNameElement.textContent = user.fullName;
    }
    
    if (userNameStatsElement) {
      userNameStatsElement.textContent = user.fullName;
    }
  }
}

// Initialize auth functionality
function initAuth() {
  // Check auth status
  checkAuth();
  
  // Setup auth form if on auth page
  setupAuthForm();
  
  // Display user info if authenticated
  displayUserInfo();
  
  // Setup stats link
  const statsLink = document.getElementById('stats-link');
  if (statsLink) {
    statsLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'stats.html';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);