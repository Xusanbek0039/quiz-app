/**
 * Statistics functionality for the ITC Quiz App
 */

// Function to get quiz history from local storage
function getQuizHistory() {
  const history = JSON.parse(localStorage.getItem('itc_quiz_history') || '[]');
  const userId = getCurrentUser()?.id;
  
  // Filter by current user
  return history.filter(quiz => quiz.user === userId && quiz.completed);
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('itc_quiz_user') || '{}');
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format time in MM:SS format
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Calculate average time
function calculateAverageTime(quizzes) {
  if (quizzes.length === 0) return 0;
  
  const totalTime = quizzes.reduce((sum, quiz) => sum + quiz.timeElapsed, 0);
  return Math.round(totalTime / quizzes.length);
}

// Calculate average score
function calculateAverageScore(quizzes) {
  if (quizzes.length === 0) return 0;
  
  const totalScore = quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0);
  return Math.round(totalScore / quizzes.length);
}

// Calculate total correct answers
function calculateTotalCorrect(quizzes) {
  return quizzes.reduce((sum, quiz) => sum + quiz.correct, 0);
}

// Update stats summary
function updateStatsSummary(quizzes) {
  document.getElementById('total-quizzes').textContent = quizzes.length;
  document.getElementById('total-correct').textContent = calculateTotalCorrect(quizzes);
  document.getElementById('avg-score').textContent = `${calculateAverageScore(quizzes)}%`;
  document.getElementById('avg-time').textContent = formatTime(calculateAverageTime(quizzes));
}

// Get category title for display
function getCategoryTitle(category) {
  const titles = {
    'python': 'Python',
    'python-basic': 'Python Basic',
    'html': 'HTML',
    'js': 'JavaScript'
  };
  return titles[category] || category;
}

// Render quiz history
function renderQuizHistory(quizzes, filter = 'all') {
  const historyListElement = document.getElementById('history-list');
  if (!historyListElement) return;
  
  // Clear existing history
  historyListElement.innerHTML = '';
  
  // Filter quizzes if needed
  let filteredQuizzes = quizzes;
  if (filter !== 'all') {
    filteredQuizzes = quizzes.filter(quiz => quiz.category === filter);
  }
  
  // Sort by date (newest first)
  filteredQuizzes.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
  
  // If no quizzes, show message
  if (filteredQuizzes.length === 0) {
    const noHistoryElement = document.createElement('div');
    noHistoryElement.className = 'no-history';
    noHistoryElement.textContent = 'Xech qanday test natijalari mavjud emas.';
    historyListElement.appendChild(noHistoryElement);
    return;
  }
  
  // Create history items
  filteredQuizzes.forEach(quiz => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const historyDetails = document.createElement('div');
    historyDetails.className = 'history-details';
    
    const historyTitle = document.createElement('div');
    historyTitle.className = 'history-title';
    
    const titleText = document.createElement('span');
    titleText.textContent = getCategoryTitle(quiz.category);
    
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'category-badge';
    categoryBadge.textContent = quiz.count + ' questions';
    
    historyTitle.appendChild(titleText);
    historyTitle.appendChild(categoryBadge);
    
    const historyDate = document.createElement('div');
    historyDate.className = 'history-date';
    historyDate.textContent = formatDate(quiz.endTime);
    
    historyDetails.appendChild(historyTitle);
    historyDetails.appendChild(historyDate);
    
    const historyScore = document.createElement('div');
    historyScore.className = 'history-score';
    
    const scoreValue = document.createElement('div');
    scoreValue.className = 'history-score-value';
    scoreValue.textContent = `${quiz.percentage}%`;
    
    const scoreMeta = document.createElement('div');
    scoreMeta.className = 'history-score-meta';
    scoreMeta.textContent = `${quiz.correct}/${quiz.correct + quiz.incorrect} • ${formatTime(quiz.timeElapsed)}`;
    
    historyScore.appendChild(scoreValue);
    historyScore.appendChild(scoreMeta);
    
    historyItem.appendChild(historyDetails);
    historyItem.appendChild(historyScore);
    
    historyListElement.appendChild(historyItem);
  });
}

// Setup filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const history = getQuizHistory();
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter history
      const filter = button.dataset.filter;
      renderQuizHistory(history, filter);
    });
  });
}

// Display user name
function displayUserName() {
  const userNameElement = document.getElementById('user-name-stats');
  if (!userNameElement) return;
  
  const user = getCurrentUser();
  if (user && user.fullName) {
    userNameElement.textContent = user.fullName;
  }
}

// Initialize stats
function initStats() {
  // Display user name
  displayUserName();
  
  // Get quiz history
  const history = getQuizHistory();
  
  // Update stats summary
  updateStatsSummary(history);
  
  // Render quiz history
  renderQuizHistory(history);
  
  // Setup filter buttons
  setupFilterButtons();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initStats);