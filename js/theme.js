/**
 * Theme toggler functionality for the ITC Quiz App
 */

// Check user's preferred color scheme
function getPreferredColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Toggle theme function
function toggleTheme() {
  const currentTheme = localStorage.getItem('itc_quiz_theme') || getPreferredColorScheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  applyTheme(newTheme);
  localStorage.setItem('itc_quiz_theme', newTheme);
  
  // Update binary background opacity based on theme
  updateBinaryBackground(newTheme);
}

// Apply theme to the document
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Update binary background based on theme
function updateBinaryBackground(theme) {
  const binaryBackground = document.querySelector('.binary-background');
  if (binaryBackground) {
    binaryBackground.style.opacity = theme === 'dark' ? '0.06' : '0.03';
  }
}

// Initialize theme
function initTheme() {
  // Get saved theme or user's preferred color scheme
  const savedTheme = localStorage.getItem('itc_quiz_theme');
  const theme = savedTheme || getPreferredColorScheme();
  
  // Apply the theme
  applyTheme(theme);
  
  // Update binary background
  updateBinaryBackground(theme);
  
  // Setup theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);

// Listen for changes in the user's preferred color scheme
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    if (!localStorage.getItem('itc_quiz_theme')) {
      applyTheme(newTheme);
      updateBinaryBackground(newTheme);
    }
  });
}