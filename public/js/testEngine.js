/**
 * Test Engine module for IT Ijodkorlari
 * Handles test loading, display, interaction, and results
 */

// Test data and state
let currentTest = null;
let userAnswers = {};
let currentQuestionIndex = 0;

// Initialize test
async function initTest() {
  const testIdParam = new URLSearchParams(window.location.search).get('id');
  
  if (!testIdParam) {
    redirectToHome();
    return;
  }
  
  await loadTest(testIdParam);
  setupTestInteractions();
}

// Load test data
async function loadTest(testId) {
  try {
    // In a real app, this would load from the file system
    currentTest = await loadSampleTest();
    
    if (!currentTest) {
      showErrorMessage("Test topilmadi");
      return;
    }
    
    displayTestInfo();
  } catch (error) {
    console.error('Error loading test:', error);
    showErrorMessage("Testni yuklashda xatolik yuz berdi");
  }
}

// Display test information
function displayTestInfo() {
  document.getElementById('testTitle').textContent = currentTest.title;
  document.getElementById('testDescription').textContent = currentTest.description;
  document.getElementById('testTime').textContent = currentTest.time;
  document.getElementById('questionsCount').textContent = currentTest.questions.length;
  document.getElementById('totalQuestions').textContent = currentTest.questions.length;
}

// Setup test interactions
function setupTestInteractions() {
  // Start test button
  const startButton = document.getElementById('startTestBtn');
  if (startButton) {
    startButton.addEventListener('click', startTest);
  }
  
  // Navigation buttons
  const prevButton = document.getElementById('prevQuestionBtn');
  const nextButton = document.getElementById('nextQuestionBtn');
  const finishButton = document.getElementById('finishTestBtn');
  
  if (prevButton) prevButton.addEventListener('click', goToPreviousQuestion);
  if (nextButton) nextButton.addEventListener('click', goToNextQuestion);
  if (finishButton) finishButton.addEventListener('click', finishTest);
}

// Start the test
function startTest() {
  // Hide intro, show test content
  document.getElementById('testIntro').classList.add('hidden');
  document.getElementById('testContent').classList.remove('hidden');
  
  // Initialize user answers
  initializeUserAnswers();
  
  // Display first question
  displayQuestion(0);
  
  // Start timer if needed
  // startTimer(currentTest.time);
}

// Initialize user answers array
function initializeUserAnswers() {
  currentTest.questions.forEach(question => {
    userAnswers[question.id] = null; // No answer selected initially
  });
}

// Display the current question
function displayQuestion(index) {
  if (!currentTest || !currentTest.questions[index]) return;
  
  currentQuestionIndex = index;
  const question = currentTest.questions[index];
  const questionContainer = document.getElementById('questionContainer');
  
  // Update progress
  document.getElementById('currentQuestion').textContent = index + 1;
  document.getElementById('progressFill').style.width = `${((index + 1) / currentTest.questions.length) * 100}%`;
  
  // Create question HTML
  const questionHTML = `
    <div class="question">
      <h3 class="question-text">${index + 1}. ${question.text}</h3>
      <div class="answers-list">
        ${question.answers.map(answer => `
          <div class="answer-item ${userAnswers[question.id] === answer.id ? 'selected' : ''}" data-answer-id="${answer.id}">
            <p class="answer-text">${answer.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Update container with animation
  questionContainer.style.opacity = '0';
  questionContainer.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    questionContainer.innerHTML = questionHTML;
    questionContainer.style.opacity = '1';
    questionContainer.style.transform = 'translateY(0)';
    
    // Add click event listeners to answers
    const answerElements = questionContainer.querySelectorAll('.answer-item');
    answerElements.forEach(element => {
      element.addEventListener('click', () => selectAnswer(question.id, element.dataset.answerId));
    });
  }, 200);
  
  // Update navigation buttons
  updateNavigationButtons();
}

// Select an answer
function selectAnswer(questionId, answerId) {
  userAnswers[questionId] = answerId;
  
  // Update UI to show selected answer
  const answerElements = document.querySelectorAll('.answer-item');
  answerElements.forEach(element => {
    if (element.dataset.answerId === answerId) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  });
  
  // Enable next button if it's disabled
  const nextButton = document.getElementById('nextQuestionBtn');
  if (nextButton.disabled) {
    nextButton.disabled = false;
  }
}

// Go to previous question
function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    displayQuestion(currentQuestionIndex - 1);
  }
}

// Go to next question
function goToNextQuestion() {
  if (currentQuestionIndex < currentTest.questions.length - 1) {
    displayQuestion(currentQuestionIndex + 1);
  }
}

// Update navigation buttons state
function updateNavigationButtons() {
  const prevButton = document.getElementById('prevQuestionBtn');
  const nextButton = document.getElementById('nextQuestionBtn');
  const finishButton = document.getElementById('finishTestBtn');
  
  // Disable prev button if on first question
  prevButton.disabled = currentQuestionIndex === 0;
  
  // Show finish button instead of next on last question
  if (currentQuestionIndex === currentTest.questions.length - 1) {
    nextButton.classList.add('hidden');
    finishButton.classList.remove('hidden');
  } else {
    nextButton.classList.remove('hidden');
    finishButton.classList.add('hidden');
  }
}

// Finish the test and show results
function finishTest() {
  // Calculate results
  const results = calculateResults();
  
  // Save results to statistics
  saveTestResults(results);
  
  // Display results
  displayResults(results);
}

// Calculate test results
function calculateResults() {
  const totalQuestions = currentTest.questions.length;
  let correctAnswers = 0;
  const questionDetails = [];
  
  // Check each answer
  currentTest.questions.forEach(question => {
    const userAnswer = userAnswers[question.id];
    const correctAnswer = question.answers.find(a => a.isCorrect).id;
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    questionDetails.push({
      question: question.text,
      userAnswer: userAnswer ? question.answers.find(a => a.id === userAnswer).text : 'Belgilanmagan',
      correctAnswer: question.answers.find(a => a.isCorrect).text,
      isCorrect
    });
  });
  
  // Calculate percentage
  const percentageCorrect = Math.round((correctAnswers / totalQuestions) * 100);
  
  return {
    totalQuestions,
    correctAnswers,
    percentageCorrect,
    questionDetails,
    testId: currentTest.id,
    testTitle: currentTest.title,
    date: new Date().toISOString()
  };
}

// Save test results to local storage
function saveTestResults(results) {
  // Get existing results or initialize empty array
  const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  
  // Add new result
  storedResults.push(results);
  
  // Save back to local storage
  localStorage.setItem('testResults', JSON.stringify(storedResults));
}

// Display test results
function displayResults(results) {
  const testContentElement = document.getElementById('testContent');
  const testResultsElement = document.getElementById('testResults');
  
  // Hide test content
  testContentElement.classList.add('hidden');
  
  // Build results HTML
  const resultsHTML = `
    <div class="results-header">
      <h3>Test yakunlandi</h3>
      <p>${currentTest.title}</p>
    </div>
    
    <div class="results-summary">
      <div class="summary-item">
        <div class="summary-value correct">${results.correctAnswers}</div>
        <div class="summary-label">To'g'ri javoblar</div>
      </div>
      
      <div class="summary-item">
        <div class="summary-value incorrect">${results.totalQuestions - results.correctAnswers}</div>
        <div class="summary-label">Noto'g'ri javoblar</div>
      </div>
      
      <div class="summary-item">
        <div class="summary-value total">${results.totalQuestions}</div>
        <div class="summary-label">Jami savollar</div>
      </div>
    </div>
    
    <div class="score-bar">
      <div class="score-fill" style="width: ${results.percentageCorrect}%"></div>
      <div class="score-percentage">${results.percentageCorrect}%</div>
    </div>
    
    <div class="results-details">
      <h4>Savollar tahlili</h4>
      <div class="questions-review">
        ${results.questionDetails.map((detail, index) => `
          <div class="review-item ${detail.isCorrect ? 'correct' : 'incorrect'}">
            <p class="review-question">${index + 1}. ${detail.question}</p>
            <div class="review-answers">
              <div class="review-answer ${!detail.isCorrect ? 'incorrect' : ''} selected">
                <i data-lucide="${detail.isCorrect ? 'check-circle' : 'x-circle'}"></i>
                <span>Sizning javobingiz: ${detail.userAnswer}</span>
              </div>
              ${!detail.isCorrect ? `
                <div class="review-answer correct">
                  <i data-lucide="check-circle"></i>
                  <span>To'g'ri javob: ${detail.correctAnswer}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="actions">
      <a href="home.html" class="action-btn secondary">
        <i data-lucide="home"></i>
        <span>Asosiy sahifaga</span>
      </a>
      <a href="statistika.html" class="action-btn primary">
        <i data-lucide="bar-chart-2"></i>
        <span>Statistikani ko'rish</span>
      </a>
    </div>
  `;
  
  // Update results container
  testResultsElement.innerHTML = resultsHTML;
  testResultsElement.classList.remove('hidden');
  
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Animate score fill
  setTimeout(() => {
    const scoreFill = document.querySelector('.score-fill');
    if (scoreFill) {
      scoreFill.style.width = `${results.percentageCorrect}%`;
    }
  }, 100);
}

// Show error message
function showErrorMessage(message) {
  const testIntroElement = document.getElementById('testIntro');
  if (testIntroElement) {
    testIntroElement.innerHTML = `
      <div class="error-message">
        <i data-lucide="alert-triangle"></i>
        <p>${message}</p>
        <a href="home.html" class="action-btn secondary">
          <span>Asosiy sahifaga qaytish</span>
        </a>
      </div>
    `;
    lucide.createIcons();
  }
}

// Redirect to home page
function redirectToHome() {
  window.location.href = 'home.html';
}

// Load sample test (for simulation)
async function loadSampleTest() {
  // This would normally fetch from the server
  return {
    "id": "python-basics",
    "title": "Python Basics",
    "description": "Test your knowledge of Python fundamentals, syntax, data types, and basic programming concepts.",
    "time": 5,
    "questions": [
      {
        "id": "q1",
        "text": "Python dasturlash tilini kim yaratgan?",
        "answers": [
          { "id": "a1", "text": "Dennis Ritchie", "isCorrect": false },
          { "id": "a2", "text": "James Gosling", "isCorrect": false },
          { "id": "a3", "text": "Guido van Rossum", "isCorrect": true },
          { "id": "a4", "text": "Bjarne Stroustrup", "isCorrect": false }
        ]
      },
      {
        "id": "q2",
        "text": "Python fayllarining kengaytmasi qanday?",
        "answers": [
          { "id": "a1", "text": ".py", "isCorrect": true },
          { "id": "a2", "text": ".java", "isCorrect": false },
          { "id": "a3", "text": ".cpp", "isCorrect": false },
          { "id": "a4", "text": ".txt", "isCorrect": false }
        ]
      },
      {
        "id": "q3",
        "text": "Quyidagi qaysi operator tenglikni tekshirish uchun ishlatiladi?",
        "answers": [
          { "id": "a1", "text": "=", "isCorrect": false },
          { "id": "a2", "text": "==", "isCorrect": true },
          { "id": "a3", "text": "!=", "isCorrect": false },
          { "id": "a4", "text": "<>", "isCorrect": false }
        ]
      },
      {
        "id": "q4",
        "text": "Python-da komentariy qo'shish uchun qaysi belgidan foydalaniladi?",
        "answers": [
          { "id": "a1", "text": "//", "isCorrect": false },
          { "id": "a2", "text": "/*", "isCorrect": false },
          { "id": "a3", "text": "#", "isCorrect": true },
          { "id": "a4", "text": "--", "isCorrect": false }
        ]
      },
      {
        "id": "q5",
        "text": "print(2 + 3 * 4) natijasi qanday bo'ladi?",
        "answers": [
          { "id": "a1", "text": "14", "isCorrect": false },
          { "id": "a2", "text": "10", "isCorrect": false },
          { "id": "a3", "text": "20", "isCorrect": false },
          { "id": "a4", "text": "14", "isCorrect": true }
        ]
      }
    ]
  };
}

// Add styles for error message
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--error-color);
    }
    
    .error-message i {
      width: 48px;
      height: 48px;
    }
    
    .error-message p {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
  </style>
`);

// Initialize the test module when DOM is loaded
document.addEventListener('DOMContentLoaded', initTest);