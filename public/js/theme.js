/**
 * Theme module for IT Ijodkorlari
 * Handles theme switching between light and dark modes
 */

// Local storage keys
const THEME_STORAGE_KEY = 'it_ijodkorlari_theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Initialize theme
function initTheme() {
  setupTheme();
  setupThemeToggle();
}

// Set theme based on user preference or system preference
function setupTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  
  if (savedTheme) {
    // Use saved theme
    setTheme(savedTheme);
  } else {
    // Use system preference or default to light
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? THEMES.DARK : THEMES.LIGHT);
  }
}

// Set theme and save preference
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Update toggle button icons if exists
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (theme === THEMES.DARK) {
      themeToggle.classList.add('dark-active');
    } else {
      themeToggle.classList.remove('dark-active');
    }
  }
}

// Toggle between light and dark themes
function toggleTheme() {
  const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.LIGHT;
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  
  // Add transition animation
  document.documentElement.classList.add('theme-transition');
  
  // Set new theme
  setTheme(newTheme);
  
  // Remove transition class after animation completes
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, 500);
  
  // Update icons
  lucide.createIcons();
}

// Setup theme toggle button
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', toggleTheme);
}

// Add CSS transition for theme change
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .theme-transition {
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .theme-transition * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
  </style>
`);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);