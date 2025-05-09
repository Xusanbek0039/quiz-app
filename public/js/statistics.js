/**
 * Statistics module for IT Ijodkorlari
 * Handles displaying test statistics and history
 */

// Initialize statistics
function initStatistics() {
  if (!window.location.pathname.includes('statistika')) return;
  
  loadAndDisplayStatistics();
  setupFilterFunctionality();
}

// Load and display statistics
function loadAndDisplayStatistics() {
  const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  
  // Update summary cards
  updateSummaryCards(testResults);
  
  // Show results chart
  displayResultsChart(testResults);
  
  // Display test history
  displayTestHistory(testResults);
}

// Update summary cards with test statistics
function updateSummaryCards(results) {
  if (results.length === 0) return;
  
  // Calculate statistics
  const totalTests = results.length;
  const totalScore = results.reduce((sum, result) => sum + result.percentageCorrect, 0);
  const averageScore = Math.round(totalScore / totalTests);
  const bestScore = Math.max(...results.map(result => result.percentageCorrect));
  
  // Update DOM elements
  document.getElementById('totalTestsTaken').textContent = totalTests;
  document.getElementById('averageScore').textContent = `${averageScore}%`;
  document.getElementById('bestScore').textContent = `${bestScore}%`;
  
  // Add animation to numbers
  animateNumbers();
}

// Animate number counters
function animateNumbers() {
  const numberElements = document.querySelectorAll('#totalTestsTaken, #averageScore, #bestScore');
  
  numberElements.forEach(element => {
    const finalValue = element.textContent;
    
    // Only animate pure numbers or percentages
    if (!/^\d+%?$/.test(finalValue)) return;
    
    const isPercentage = finalValue.includes('%');
    let targetValue = parseInt(finalValue.replace('%', ''));
    
    // Start from 0
    element.textContent = isPercentage ? '0%' : '0';
    
    // Animate to target value
    let currentValue = 0;
    const duration = 1500; // ms
    const increment = targetValue / (duration / 16); // ~60fps
    
    const animateCounter = () => {
      currentValue += increment;
      
      if (currentValue < targetValue) {
        element.textContent = isPercentage ? 
          `${Math.floor(currentValue)}%` : 
          Math.floor(currentValue).toString();
        requestAnimationFrame(animateCounter);
      } else {
        element.textContent = finalValue; // Ensure final value is exact
      }
    };
    
    requestAnimationFrame(animateCounter);
  });
}

// Display results chart
function displayResultsChart(results) {
  const chartContainer = document.getElementById('resultsChart');
  if (!chartContainer) return;
  
  if (results.length === 0) {
    // Show placeholder if no results
    return;
  }
  
  // Clear placeholder
  chartContainer.innerHTML = '';
  
  // Get last 10 results or all if less than 10
  const chartData = results.slice(-10);
  
  // Create chart container
  const chartHTML = `
    <div class="result-charts">
      ${chartData.map((result, index) => `
        <div class="chart-bar" style="height: ${result.percentageCorrect}%;">
          <div class="chart-value">${result.percentageCorrect}%</div>
          <div class="chart-label">${formatShortDate(new Date(result.date))}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  chartContainer.innerHTML = chartHTML;
  
  // Animate chart bars
  setTimeout(() => {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.height = `${chartData[index].percentageCorrect}%`;
      }, index * 100);
    });
  }, 300);
}

// Display test history
function displayTestHistory(results) {
  const historyContainer = document.getElementById('testHistory');
  if (!historyContainer) return;
  
  if (results.length === 0) {
    return; // Keep empty state
  }
  
  // Sort results by date (newest first)
  const sortedResults = [...results].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Generate HTML for history items
  const historyHTML = sortedResults.map(result => `
    <div class="history-item" data-test-id="${result.testId}">
      <div class="history-details">
        <h4 class="history-title">${result.testTitle}</h4>
        <div class="history-meta">
          <div class="meta-item">
            <i data-lucide="calendar"></i>
            <span>${formatDate(new Date(result.date))}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="check-circle"></i>
            <span>${result.correctAnswers} / ${result.totalQuestions} to'g'ri</span>
          </div>
        </div>
      </div>
      <div class="history-score">
        <div class="score-badge ${getScoreBadgeClass(result.percentageCorrect)}">
          ${result.percentageCorrect}%
        </div>
        <button class="history-view" data-result-id="${result.date}">
          Batafsil
        </button>
      </div>
    </div>
  `).join('');
  
  historyContainer.innerHTML = historyHTML;
  
  // Initialize icons
  lucide.createIcons();
  
  // Add animation for history items
  const historyItems = document.querySelectorAll('.history-item');
  historyItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
  
  // Add event listeners for "View Details" buttons
  setupHistoryDetailsButtons();
}

// Setup filter functionality
function setupFilterFunctionality() {
  const filterSelect = document.getElementById('filterStats');
  if (!filterSelect) return;
  
  filterSelect.addEventListener('change', () => {
    const filterType = filterSelect.value;
    filterTestHistory(filterType);
  });
}

// Filter test history based on selected filter
function filterTestHistory(filterType) {
  const results = JSON.parse(localStorage.getItem('testResults') || '[]');
  if (results.length === 0) return;
  
  let filteredResults = [...results];
  
  switch (filterType) {
    case 'recent':
      // Sort by date (newest first)
      filteredResults = filteredResults.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5); // Get 5 most recent
      break;
      
    case 'best':
      // Sort by score (highest first)
      filteredResults = filteredResults.sort((a, b) => 
        b.percentageCorrect - a.percentageCorrect
      ).slice(0, 5); // Get 5 best
      break;
      
    default: // 'all' or any other value
      // Keep all results but sort by date
      filteredResults = filteredResults.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }
  
  // Update chart and history
  displayResultsChart(filteredResults);
  displayTestHistory(filteredResults);
}

// Setup detail view buttons
function setupHistoryDetailsButtons() {
  const viewButtons = document.querySelectorAll('.history-view');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const resultId = button.dataset.resultId;
      showResultDetails(resultId);
    });
  });
}

// Show detailed view of a result
function showResultDetails(resultId) {
  const results = JSON.parse(localStorage.getItem('testResults') || '[]');
  const result = results.find(r => r.date === resultId);
  
  if (!result) return;
  
  // Create modal HTML
  const modalHTML = `
    <div class="result-modal-overlay">
      <div class="result-modal">
        <div class="modal-header">
          <h3>${result.testTitle}</h3>
          <button class="close-modal">
            <i data-lucide="x"></i>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="modal-summary">
            <div class="summary-score">
              <div class="score-circle ${getScoreBadgeClass(result.percentageCorrect)}">
                <span>${result.percentageCorrect}%</span>
              </div>
            </div>
            
            <div class="summary-details">
              <div class="detail-item">
                <span class="detail-label">Sana:</span>
                <span class="detail-value">${formatDate(new Date(result.date))}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">To'g'ri javoblar:</span>
                <span class="detail-value">${result.correctAnswers} / ${result.totalQuestions}</span>
              </div>
            </div>
          </div>
          
          <div class="modal-questions">
            <h4>Savol-javoblar tahlili</h4>
            <div class="questions-list">
              ${result.questionDetails.map((detail, index) => `
                <div class="question-item ${detail.isCorrect ? 'correct' : 'incorrect'}">
                  <div class="question-header">
                    <span class="question-number">${index + 1}</span>
                    <span class="question-text">${detail.question}</span>
                  </div>
                  <div class="question-answers">
                    <div class="answer-item">
                      <span class="answer-label">Sizning javobingiz:</span>
                      <span class="answer-value ${detail.isCorrect ? 'correct' : 'incorrect'}">
                        ${detail.userAnswer}
                      </span>
                    </div>
                    ${!detail.isCorrect ? `
                      <div class="answer-item">
                        <span class="answer-label">To'g'ri javob:</span>
                        <span class="answer-value correct">${detail.correctAnswer}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Initialize icons
  lucide.createIcons();
  
  // Setup close button
  const closeButton = document.querySelector('.close-modal');
  const modalOverlay = document.querySelector('.result-modal-overlay');
  
  closeButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  
  // Animate modal in
  setTimeout(() => {
    modalOverlay.style.opacity = '1';
    document.querySelector('.result-modal').style.transform = 'translateY(0)';
  }, 10);
  
  // Add styles for modal
  addModalStyles();
}

// Close modal
function closeModal() {
  const modalOverlay = document.querySelector('.result-modal-overlay');
  const modal = document.querySelector('.result-modal');
  
  // Animate out
  modalOverlay.style.opacity = '0';
  modal.style.transform = 'translateY(20px)';
  
  // Remove from DOM after animation
  setTimeout(() => {
    modalOverlay.remove();
  }, 300);
}

// Add styles for modal
function addModalStyles() {
  // Check if styles already exist
  if (document.getElementById('modal-styles')) return;
  
  const modalStyles = `
    <style id="modal-styles">
      .result-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .result-modal {
        background-color: var(--bg-primary);
        border-radius: var(--border-radius);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
      }
      
      .modal-header h3 {
        font-size: 1.5rem;
        color: var(--text-primary);
      }
      
      .close-modal {
        background: none;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
      }
      
      .close-modal:hover {
        color: var(--text-primary);
      }
      
      .modal-content {
        padding: 1.5rem;
      }
      
      .modal-summary {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border-color);
      }
      
      .score-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.75rem;
      }
      
      .score-circle.excellent {
        background-color: var(--success-color);
      }
      
      .score-circle.good {
        background-color: var(--primary-color);
      }
      
      .score-circle.average {
        background-color: var(--warning-color);
      }
      
      .score-circle.poor {
        background-color: var(--error-color);
      }
      
      .summary-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.75rem;
      }
      
      .detail-item {
        display: flex;
        align-items: center;
      }
      
      .detail-label {
        font-weight: 500;
        color: var(--text-secondary);
        width: 120px;
      }
      
      .detail-value {
        color: var(--text-primary);
      }
      
      .modal-questions h4 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
      }
      
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .question-item {
        background-color: var(--bg-tertiary);
        border-radius: var(--border-radius);
        padding: 1.25rem;
        position: relative;
      }
      
      .question-item.correct {
        border-left: 4px solid var(--success-color);
      }
      
      .question-item.incorrect {
        border-left: 4px solid var(--error-color);
      }
      
      .question-header {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .question-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: var(--bg-secondary);
        font-weight: 600;
        font-size: 0.875rem;
      }
      
      .question-text {
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .question-answers {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .answer-item {
        display: flex;
        gap: 0.5rem;
      }
      
      .answer-label {
        color: var(--text-secondary);
        min-width: 120px;
      }
      
      .answer-value {
        color: var(--text-primary);
      }
      
      .answer-value.correct {
        color: var(--success-color);
      }
      
      .answer-value.incorrect {
        color: var(--error-color);
      }
      
      @media (max-width: 768px) {
        .modal-summary {
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', modalStyles);
}

// Get badge class based on score
function getScoreBadgeClass(score) {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'average';
  return 'poor';
}

// Format date for display
function formatDate(date) {
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format short date for chart
function formatShortDate(date) {
  return date.toLocaleDateString('uz-UZ', {
    month: 'short',
    day: 'numeric'
  });
}

// Initialize statistics when DOM is loaded
document.addEventListener('DOMContentLoaded', initStatistics);