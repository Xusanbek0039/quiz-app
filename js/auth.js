/**
 * Authentication module for IT Ijodkorlari
 * Handles user authentication and session management
 */

// Local storage keys
const STORAGE_KEYS = {
  USER: 'it_ijodkorlari_user',
  THEME: 'it_ijodkorlari_theme'
};

// Check if user is logged in
function checkAuth() {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  
  // If on index page and user exists, redirect to home
  if (window.location.pathname.includes('index') && user) {
    window.location.href = 'home.html';
    return;
  }
  
  // If on other pages and user doesn't exist, redirect to index
  if (!window.location.pathname.includes('index') && !user) {
    window.location.href = 'index.html';
    return;
  }
  
  // Update user display name if on other pages
  if (!window.location.pathname.includes('index') && user) {
    updateUserDisplay(JSON.parse(user));
  }
}

// Login form submission handler
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    
    if (!firstName || !lastName) {
      alert('Iltimos, ism va familiyangizni kiriting');
      return;
    }
    
    // Save user info to local storage
    const user = { firstName, lastName };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // Add animation before redirect
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'fadeOutUp 0.5s forwards';
    
    // Redirect to home page after animation
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 500);
  });
}

// Update user display in header
function updateUserDisplay(user) {
  const userFullNameElement = document.getElementById('userFullName');
  if (!userFullNameElement) return;
  
  userFullNameElement.textContent = `${user.firstName} ${user.lastName}`;
}

// Setup logout functionality
function setupLogout() {
  // We can add a logout button later if needed
}

// Initialize authentication
function initAuth() {
  checkAuth();
  setupLoginForm();
  setupLogout();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Animation for login form out
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fadeOutUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-30px);
      }
    }
  </style>
`);