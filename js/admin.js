// Admin Page Logic
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked tab
      button.classList.add('active');
      const tabId = button.dataset.tab;
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      // Load tab content
      if (tabId === 'tests') {
        loadTests();
      } else if (tabId === 'results') {
        loadResults();
      }
    });
  });
  
  // Modal handling
  const modal = document.getElementById('test-preview-modal');
  const closeModal = document.querySelector('.close-modal');
  
  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
  
  // Load tests
  function loadTests() {
    const testsList = document.getElementById('admin-tests-list');
    const tests = getAvailableTests();
    
    // Clear loading skeleton
    testsList.innerHTML = '';
    
    if (tests.length === 0) {
      testsList.innerHTML = '<p class="empty-message">No tests available.</p>';
      return;
    }
    
    tests.forEach(test => {
      const testItem = document.createElement('div');
      testItem.className = 'admin-item';
      testItem.innerHTML = `
        <div class="admin-item-details">
          <div class="admin-item-title">${test.title}</div>
          <div class="admin-item-meta">
            ${test.questions.length} questions | ${test.time} minutes
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm preview-test" data-id="${test.id}">Preview</button>
        </div>
      `;
      
      testsList.appendChild(testItem);
    });
    
    // Add event listeners to preview buttons
    const previewButtons = document.querySelectorAll('.preview-test');
    previewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const testId = button.dataset.id;
        previewTest(testId);
      });
    });
  }
  
  // Load results
  function loadResults() {
    const resultsList = document.getElementById('admin-results-list');
    const results = getTestResults();
    
    // Clear loading skeleton
    resultsList.innerHTML = '';
    
    if (results.length === 0) {
      resultsList.innerHTML = '<p class="empty-message">No results available.</p>';
      return;
    }
    
    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'admin-item';
      
      // Calculate score percentage
      const percentage = Math.round((result.score / result.total) * 100);
      let scoreClass = 'medium';
      if (percentage >= 80) scoreClass = 'high';
      if (percentage < 50) scoreClass = 'low';
      
      // Format date
      const date = new Date(result.date);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      resultItem.innerHTML = `
        <div class="admin-item-details">
          <div class="admin-item-title">${result.testTitle}</div>
          <div class="admin-item-meta">
            ${result.userId} | ${formattedDate}
          </div>
        </div>
        <div class="admin-item-actions">
          <span class="score-badge ${scoreClass}">${percentage}% (${result.score}/${result.total})</span>
        </div>
      `;
      
      resultsList.appendChild(resultItem);
    });
  }
  
  // Preview test
  function previewTest(testId) {
    const test = getMockQuiz(testId);
    
    if (!test) {
      alert('Test not found');
      return;
    }
    
    const previewTitle = document.getElementById('preview-title');
    const previewBody = document.getElementById('preview-body');
    
    previewTitle.textContent = test.title;
    
    let previewContent = `
      <div class="preview-description">${test.description}</div>
      <div class="preview-meta">Time limit: ${test.time} minutes | ${test.questions.length} questions</div>
      
      <div class="preview-questions">
        <h4>Questions</h4>
    `;
    
    test.questions.forEach((question, index) => {
      previewContent += `
        <div class="preview-question">
          <h5>Question ${index + 1}: ${question.text}</h5>
          <div class="preview-answers">
      `;
      
      question.answers.forEach((answer, answerIndex) => {
        previewContent += `
          <div class="preview-answer ${answer.isCorrect ? 'correct' : ''}">
            ${String.fromCharCode(65 + answerIndex)}. ${answer.text} ${answer.isCorrect ? '✓' : ''}
          </div>
        `;
      });
      
      previewContent += `
          </div>
        </div>
      `;
    });
    
    previewContent += `</div>`;
    
    previewBody.innerHTML = previewContent;
    modal.classList.add('active');
  }
  
  // Create test form handling
  const createTestForm = document.getElementById('create-test-form');
  const addQuestionBtn = document.querySelector('.add-question');
  const questionsContainer = document.getElementById('questions-container');
  
  if (createTestForm) {
    // Add question button
    addQuestionBtn.addEventListener('click', () => {
      const questionItems = document.querySelectorAll('.question-item');
      const newQuestionIndex = questionItems.length + 1;
      
      const newQuestion = document.createElement('div');
      newQuestion.className = 'question-item';
      newQuestion.innerHTML = `
        <div class="question-header">
          <h5>Question ${newQuestionIndex}</h5>
          <button type="button" class="btn-icon remove-question">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </button>
        </div>
        <div class="form-group">
          <label for="q${newQuestionIndex}-text">Question Text</label>
          <textarea id="q${newQuestionIndex}-text" name="q${newQuestionIndex}-text" placeholder="Enter question text" required></textarea>
        </div>
        <div class="answers-container">
          <div class="answer-item">
            <div class="form-group">
              <label for="q${newQuestionIndex}-a1-text">Answer 1</label>
              <div class="answer-input">
                <input type="text" id="q${newQuestionIndex}-a1-text" name="q${newQuestionIndex}-a1-text" placeholder="Answer text" required>
                <label class="correct-label">
                  <input type="radio" name="q${newQuestionIndex}-correct" value="a1" required checked>
                  Correct
                </label>
              </div>
            </div>
          </div>
          <div class="answer-item">
            <div class="form-group">
              <label for="q${newQuestionIndex}-a2-text">Answer 2</label>
              <div class="answer-input">
                <input type="text" id="q${newQuestionIndex}-a2-text" name="q${newQuestionIndex}-a2-text" placeholder="Answer text" required>
                <label class="correct-label">
                  <input type="radio" name="q${newQuestionIndex}-correct" value="a2" required>
                  Correct
                </label>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-text add-answer">+ Add Answer</button>
      `;
      
      questionsContainer.appendChild(newQuestion);
      
      // Add event listener for remove question button
      const removeBtn = newQuestion.querySelector('.remove-question');
      removeBtn.addEventListener('click', () => {
        newQuestion.remove();
        updateQuestionNumbers();
      });
      
      // Add event listener for add answer button
      const addAnswerBtn = newQuestion.querySelector('.add-answer');
      addAnswerBtn.addEventListener('click', (e) => {
        addAnswer(e.target.closest('.question-item'));
      });
    });
    
    // Add event listener for first question's add answer button
    const firstQuestionAddAnswerBtn = document.querySelector('.question-item .add-answer');
    firstQuestionAddAnswerBtn.addEventListener('click', (e) => {
      addAnswer(e.target.closest('.question-item'));
    });
    
    // Form submission
    createTestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const testId = document.getElementById('test-id').value;
      const title = document.getElementById('test-title').value;
      const description = document.getElementById('test-description').value;
      const time = parseInt(document.getElementById('test-time').value);
      
      // Get questions
      const questions = [];
      let questionItems = document.querySelectorAll('.question-item');
      
      questionItems.forEach((item, qIndex) => {
        const questionText = item.querySelector(`textarea[id^="q"]`).value;
        const answerItems = item.querySelectorAll('.answer-item');
        const correctAnswer = item.querySelector(`input[name^="q"][name$="correct"]:checked`).value;
        
        const answers = [];
        answerItems.forEach((answerItem, aIndex) => {
          const answerText = answerItem.querySelector(`input[type="text"]`).value;
          const answerId = `a${aIndex + 1}`;
          answers.push({
            id: answerId,
            text: answerText,
            isCorrect: correctAnswer === answerId
          });
        });
        
        questions.push({
          id: `q${qIndex + 1}`,
          text: questionText,
          answers: answers
        });
      });
      
      // Create test object
      const test = {
        id: testId,
        title,
        description,
        time,
        questions
      };
      
      // Save test
      saveTest(test);
      
      // Show success message
      alert('Test created successfully!');
      
      // Reset form
      createTestForm.reset();
      
      // Reset questions (keep only the first one)
      questionItems = document.querySelectorAll('.question-item');
      for (let i = 1; i < questionItems.length; i++) {
        questionItems[i].remove();
      }
      
      // Switch to tests tab
      document.querySelector('.tab-btn[data-tab="tests"]').click();
    });
  }
  
  // Add answer to a question
  function addAnswer(questionItem) {
    const answersContainer = questionItem.querySelector('.answers-container');
    const answerItems = answersContainer.querySelectorAll('.answer-item');
    const newAnswerIndex = answerItems.length + 1;
    
    // Get question number from the id of the textarea
    const questionText = questionItem.querySelector('textarea');
    const questionId = questionText.id.split('-')[0];
    
    const newAnswer = document.createElement('div');
    newAnswer.className = 'answer-item';
    newAnswer.innerHTML = `
      <div class="form-group">
        <label for="${questionId}-a${newAnswerIndex}-text">Answer ${newAnswerIndex}</label>
        <div class="answer-input">
          <input type="text" id="${questionId}-a${newAnswerIndex}-text" name="${questionId}-a${newAnswerIndex}-text" placeholder="Answer text" required>
          <label class="correct-label">
            <input type="radio" name="${questionId}-correct" value="a${newAnswerIndex}" required>
            Correct
          </label>
        </div>
      </div>
    `;
    
    answersContainer.appendChild(newAnswer);
  }
  
  // Update question numbers after removal
  function updateQuestionNumbers() {
    const questionItems = document.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
      const questionNumber = index + 1;
      item.querySelector('h5').textContent = `Question ${questionNumber}`;
      
      // Update ids and names
      const textarea = item.querySelector('textarea');
      const oldId = textarea.id;
      const newId = `q${questionNumber}-text`;
      textarea.id = newId;
      textarea.name = newId;
      item.querySelector('label[for="' + oldId + '"]').setAttribute('for', newId);
      
      // Update answer ids, names, and labels
      const answerItems = item.querySelectorAll('.answer-item');
      answerItems.forEach((answerItem, aIndex) => {
        const answerNumber = aIndex + 1;
        const inputText = answerItem.querySelector('input[type="text"]');
        const oldInputId = inputText.id;
        const newInputId = `q${questionNumber}-a${answerNumber}-text`;
        inputText.id = newInputId;
        inputText.name = newInputId;
        answerItem.querySelector('label[for="' + oldInputId + '"]').setAttribute('for', newInputId);
        
        // Update radio button
        const radio = answerItem.querySelector('input[type="radio"]');
        radio.name = `q${questionNumber}-correct`;
      });
    });
  }
  
  // Save test
  function saveTest(test) {
    // In a real app, this would send to a server
    // For this demo, we'll save to localStorage
    
    const existingTests = JSON.parse(localStorage.getItem('customTests')) || [];
    
    // Check if test with same ID already exists
    const existingIndex = existingTests.findIndex(t => t.id === test.id);
    if (existingIndex !== -1) {
      existingTests[existingIndex] = test;
    } else {
      existingTests.push(test);
    }
    
    localStorage.setItem('customTests', JSON.stringify(existingTests));
  }
  
  // Get available tests
  function getAvailableTests() {
    // Get built-in mock tests
    const mockTests = [
      getMockQuiz('html-basics'),
      getMockQuiz('css-basics'),
      getMockQuiz('js-fundamentals')
    ];
    
    // Get custom tests from localStorage
    const customTests = JSON.parse(localStorage.getItem('customTests')) || [];
    
    return [...mockTests, ...customTests];
  }
  
  // Get user test results
  function getTestResults() {
    return JSON.parse(localStorage.getItem('quizResults')) || [];
  }
  
  // Get mock quiz data
  function getMockQuiz(id) {
    const mockQuizzes = {
      'html-basics': {
        id: 'html-basics',
        title: 'HTML Basics',
        description: 'Test your knowledge of HTML fundamentals, tags, and semantics.',
        time: 5,
        questions: [
          {
            id: 'q1',
            text: 'What does HTML stand for?',
            answers: [
              { id: 'a1', text: 'Hyper Text Markup Language', isCorrect: true },
              { id: 'a2', text: 'Hyper Transfer Markup Language', isCorrect: false },
              { id: 'a3', text: 'Hyper Text Markdown Language', isCorrect: false },
              { id: 'a4', text: 'Hyperlink Text Markup Language', isCorrect: false }
            ]
          },
          {
            id: 'q2',
            text: 'Which tag is used to create a hyperlink?',
            answers: [
              { id: 'a1', text: '<link>', isCorrect: false },
              { id: 'a2', text: '<a>', isCorrect: true },
              { id: 'a3', text: '<href>', isCorrect: false },
              { id: 'a4', text: '<url>', isCorrect: false }
            ]
          },
          {
            id: 'q3',
            text: 'Which HTML element is used to define the title of a document?',
            answers: [
              { id: 'a1', text: '<meta>', isCorrect: false },
              { id: 'a2', text: '<header>', isCorrect: false },
              { id: 'a3', text: '<title>', isCorrect: true },
              { id: 'a4', text: '<head>', isCorrect: false }
            ]
          },
          {
            id: 'q4',
            text: 'Which HTML tag is used to create an ordered list?',
            answers: [
              { id: 'a1', text: '<ul>', isCorrect: false },
              { id: 'a2', text: '<ol>', isCorrect: true },
              { id: 'a3', text: '<li>', isCorrect: false },
              { id: 'a4', text: '<dl>', isCorrect: false }
            ]
          },
          {
            id: 'q5',
            text: 'What is the correct HTML element for the largest heading?',
            answers: [
              { id: 'a1', text: '<heading>', isCorrect: false },
              { id: 'a2', text: '<h6>', isCorrect: false },
              { id: 'a3', text: '<h1>', isCorrect: true },
              { id: 'a4', text: '<head>', isCorrect: false }
            ]
          }
        ]
      },
      'css-basics': {
        id: 'css-basics',
        title: 'CSS Basics',
        description: 'Evaluate your understanding of CSS styling and layout concepts.',
        time: 8,
        questions: [
          {
            id: 'q1',
            text: 'What does CSS stand for?',
            answers: [
              { id: 'a1', text: 'Cascading Style Sheets', isCorrect: true },
              { id: 'a2', text: 'Creative Style Sheets', isCorrect: false },
              { id: 'a3', text: 'Computer Style Sheets', isCorrect: false },
              { id: 'a4', text: 'Colorful Style Sheets', isCorrect: false }
            ]
          },
          {
            id: 'q2',
            text: 'Which property is used to change the background color?',
            answers: [
              { id: 'a1', text: 'color', isCorrect: false },
              { id: 'a2', text: 'background-color', isCorrect: true },
              { id: 'a3', text: 'bgcolor', isCorrect: false },
              { id: 'a4', text: 'background', isCorrect: false }
            ]
          },
          {
            id: 'q3',
            text: 'Which CSS property controls the text size?',
            answers: [
              { id: 'a1', text: 'text-size', isCorrect: false },
              { id: 'a2', text: 'font-style', isCorrect: false },
              { id: 'a3', text: 'font-size', isCorrect: true },
              { id: 'a4', text: 'text-style', isCorrect: false }
            ]
          }
        ]
      },
      'js-fundamentals': {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Check your grasp of JavaScript basics, from variables to functions.',
        time: 10,
        questions: [
          {
            id: 'q1',
            text: 'Which keyword is used to declare a variable in JavaScript?',
            answers: [
              { id: 'a1', text: 'var', isCorrect: false },
              { id: 'a2', text: 'Both var and let', isCorrect: false },
              { id: 'a3', text: 'const', isCorrect: false },
              { id: 'a4', text: 'All of the above', isCorrect: true }
            ]
          },
          {
            id: 'q2',
            text: 'How do you write "Hello World" in an alert box?',
            answers: [
              { id: 'a1', text: 'alertBox("Hello World");', isCorrect: false },
              { id: 'a2', text: 'alert("Hello World");', isCorrect: true },
              { id: 'a3', text: 'msg("Hello World");', isCorrect: false },
              { id: 'a4', text: 'msgBox("Hello World");', isCorrect: false }
            ]
          },
          {
            id: 'q3',
            text: 'How do you create a function in JavaScript?',
            answers: [
              { id: 'a1', text: 'function myFunction()', isCorrect: true },
              { id: 'a2', text: 'function:myFunction()', isCorrect: false },
              { id: 'a3', text: 'function = myFunction()', isCorrect: false },
              { id: 'a4', text: 'createMyFunction()', isCorrect: false }
            ]
          },
          {
            id: 'q4',
            text: 'How do you call a function named "myFunction"?',
            answers: [
              { id: 'a1', text: 'call myFunction()', isCorrect: false },
              { id: 'a2', text: 'myFunction()', isCorrect: true },
              { id: 'a3', text: 'call function myFunction()', isCorrect: false },
              { id: 'a4', text: 'execute myFunction()', isCorrect: false }
            ]
          }
        ]
      }
    };
    
    return mockQuizzes[id] || null;
  }
  
  // Initialize page
  loadTests();
});