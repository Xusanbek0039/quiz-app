// Home Page Logic
document.addEventListener('DOMContentLoaded', function() {
  const testsContainer = document.getElementById('tests-container');
  const resultsContainer = document.getElementById('results-container');
  
  // Load available tests
  function loadTests() {
    // In a real app, this would fetch from a server
    // For this example, we'll use a hardcoded list
    const tests = getAvailableTests();
    
    // Clear loading skeleton
    testsContainer.innerHTML = '';
    
    if (tests.length === 0) {
      testsContainer.innerHTML = '<p class="empty-message">No tests available.</p>';
      return;
    }
    
    // Add test cards
    tests.forEach(test => {
      const card = createTestCard(test);
      testsContainer.appendChild(card);
    });
  }
  
  // Load user results
  function loadResults() {
    const results = getTestResults();
    
    // Clear loading skeleton
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="empty-message">No results yet. Take a quiz to see your results here.</p>';
      return;
    }
    
    // Sort results by date (newest first)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display only the 5 most recent results
    const recentResults = results.slice(0, 5);
    
    recentResults.forEach(result => {
      const resultItem = createResultItem(result);
      resultsContainer.appendChild(resultItem);
    });
  }
  
  // Create test card element
  function createTestCard(test) {
    const card = document.createElement('div');
    card.className = 'test-card';
    card.innerHTML = `
      <h3 class="test-card-title">${test.title}</h3>
      <p class="test-card-description">${test.description}</p>
      <div class="test-card-meta">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${test.time} ${test.time === 1 ? 'minute' : 'minutes'}
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `quiz.html?id=${test.id}`;
    });
    
    return card;
  }
  
  // Create result item element
  function createResultItem(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    
    // Calculate score percentage
    const percentage = Math.round((result.score / result.total) * 100);
    let scoreClass = 'medium';
    if (percentage >= 80) scoreClass = 'high';
    if (percentage < 50) scoreClass = 'low';
    
    // Format date
    const date = new Date(result.date);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    resultItem.innerHTML = `
      <div class="result-info">
        <div class="result-title">${result.testTitle}</div>
        <div class="result-meta">${formattedDate}</div>
      </div>
      <div class="result-score">
        <span class="score-badge ${scoreClass}">${percentage}%</span>
      </div>
    `;
    
    return resultItem;
  }
  
  // Get available tests
  function getAvailableTests() {
    // In a real app, this would fetch from a server
    // For this demo, we'll return mock data
    return [
      {
        id: 'html-basics',
        title: 'HTML Basics',
        description: 'Test your knowledge of HTML fundamentals, tags, and semantics.',
        time: 5
      },
      {
        id: 'css-basics',
        title: 'CSS Basics',
        description: 'Evaluate your understanding of CSS styling and layout concepts.',
        time: 8
      },
      {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Check your grasp of JavaScript basics, from variables to functions.',
        time: 10
      }
    ];
  }
  
  // Get user test results
  function getTestResults() {
    // Get results from localStorage
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    return results;
  }
  
  // Initialize page
  loadTests();
  loadResults();
});