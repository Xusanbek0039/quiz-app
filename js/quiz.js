// Quiz Page Logic
document.addEventListener('DOMContentLoaded', function() {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get('id');
  
  if (!testId) {
    window.location.href = 'home.html';
    return;
  }
  
  // DOM Elements
  const quizTitle = document.getElementById('quiz-title');
  const timeRemaining = document.getElementById('time-remaining');
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const quizContent = document.getElementById('quiz-content');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const resultsScreen = document.getElementById('results-screen');
  const scoreEl = document.getElementById('score');
  const maxScoreEl = document.getElementById('max-score');
  const percentageEl = document.getElementById('percentage');
  const circleProgress = document.getElementById('circle-progress');
  const timeTakenEl = document.getElementById('time-taken');
  const reviewBtn = document.getElementById('review-btn');
  const homeBtn = document.getElementById('home-btn');
  
  // Quiz state
  let quiz = null;
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let timer = null;
  let timeLeft = 0;
  let startTime = null;
  let endTime = null;
  let isReviewing = false;
  
  // Load quiz data
  loadQuiz(testId);
  
  // Event listeners
  prevBtn.addEventListener('click', showPreviousQuestion);
  nextBtn.addEventListener('click', handleNextClick);
  reviewBtn.addEventListener('click', reviewQuiz);
  homeBtn.addEventListener('click', () => window.location.href = 'home.html');
  
  // Load quiz data
  function loadQuiz(id) {
    // In a real app, this would fetch from a server
    // For this demo, we'll use a mock quiz based on the ID
    quiz = getMockQuiz(id);
    
    if (!quiz) {
      alert('Quiz not found');
      window.location.href = 'home.html';
      return;
    }
    
    // Initialize quiz state
    userAnswers = new Array(quiz.questions.length).fill(null);
    timeLeft = quiz.time * 60; // Convert minutes to seconds
    startTime = new Date();
    
    // Update UI
    quizTitle.textContent = quiz.title;
    currentQuestionEl.textContent = '1';
    totalQuestionsEl.textContent = quiz.questions.length;
    updateTimerDisplay();
    
    // Start timer
    startTimer();
    
    // Show first question
    showQuestion(0);
  }
  
  // Show question
  function showQuestion(index) {
    if (index < 0 || index >= quiz.questions.length) return;
    
    currentQuestionIndex = index;
    currentQuestionEl.textContent = (index + 1).toString();
    
    // Update navigation buttons
    prevBtn.disabled = index === 0;
    if (isReviewing || index === quiz.questions.length - 1) {
      nextBtn.textContent = 'Finish';
    } else {
      nextBtn.textContent = 'Next';
    }
    
    // Create question element with fade animation
    quizContent.innerHTML = '';
    const questionEl = document.createElement('div');
    questionEl.className = 'question fade-enter';
    questionEl.innerHTML = `
      <h3>${quiz.questions[index].text}</h3>
    `;
    
    // Create answers list
    const answersList = document.createElement('div');
    answersList.className = 'answers-list';
    
    quiz.questions[index].answers.forEach((answer, answerIndex) => {
      const answerOption = document.createElement('div');
      answerOption.className = 'answer-option';
      answerOption.dataset.index = answerIndex.toString();
      answerOption.textContent = answer.text;
      
      // Mark selected answer
      if (userAnswers[index] === answerIndex) {
        answerOption.classList.add('selected');
      }
      
      // Show correct/incorrect in review mode
      if (isReviewing) {
        if (answer.isCorrect) {
          answerOption.classList.add('correct');
        } else if (userAnswers[index] === answerIndex) {
          answerOption.classList.add('incorrect');
        }
      } else {
        // Add click event only if not in review mode
        answerOption.addEventListener('click', () => selectAnswer(answerIndex));
      }
      
      answersList.appendChild(answerOption);
    });
    
    questionEl.appendChild(answersList);
    quizContent.appendChild(questionEl);
    
    // Trigger animation
    setTimeout(() => {
      questionEl.classList.remove('fade-enter');
      questionEl.classList.add('fade-enter-active');
    }, 10);
  }
  
  // Select answer
  function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Update UI
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
      option.classList.remove('selected');
      if (parseInt(option.dataset.index) === answerIndex) {
        option.classList.add('selected');
      }
    });
  }
  
  // Show previous question
  function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      showQuestion(currentQuestionIndex - 1);
    }
  }
  
  // Handle next button click
  function handleNextClick() {
    if (currentQuestionIndex === quiz.questions.length - 1 || isReviewing) {
      finishQuiz();
    } else {
      showQuestion(currentQuestionIndex + 1);
    }
  }
  
  // Finish quiz
  function finishQuiz() {
    if (isReviewing) {
      window.location.href = 'home.html';
      return;
    }
    
    // Stop timer
    clearInterval(timer);
    endTime = new Date();
    
    // Calculate score
    const { score, total } = calculateScore();
    const percentage = Math.round((score / total) * 100);
    
    // Update results screen
    scoreEl.textContent = score.toString();
    maxScoreEl.textContent = total.toString();
    percentageEl.textContent = `${percentage}%`;
    
    // Animate progress circle
    circleProgress.setAttribute('stroke-dasharray', `${percentage}, 100`);
    
    // Calculate time taken
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    timeTakenEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Save result
    saveResult(score, total, percentage);
    
    // Show results screen
    document.getElementById('quiz-header').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-navigation').style.display = 'none';
    resultsScreen.classList.remove('hidden');
  }
  
  // Review quiz
  function reviewQuiz() {
    isReviewing = true;
    
    // Hide results screen
    resultsScreen.classList.add('hidden');
    
    // Show quiz components
    document.getElementById('quiz-header').style.display = 'block';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-navigation').style.display = 'flex';
    
    // Update navigation buttons
    prevBtn.disabled = true;
    nextBtn.textContent = 'Finish';
    
    // Show first question in review mode
    showQuestion(0);
  }
  
  // Calculate score
  function calculateScore() {
    let score = 0;
    const total = quiz.questions.length;
    
    for (let i = 0; i < total; i++) {
      const userAnswerIndex = userAnswers[i];
      if (userAnswerIndex !== null && quiz.questions[i].answers[userAnswerIndex].isCorrect) {
        score++;
      }
    }
    
    return { score, total };
  }
  
  // Save result
  function saveResult(score, total, percentage) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const result = {
      userId: currentUser.fullName,
      testId: quiz.id,
      testTitle: quiz.title,
      score,
      total,
      percentage,
      date: new Date().toISOString()
    };
    
    // Get existing results
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    // Add new result
    results.push(result);
    
    // Save back to localStorage
    localStorage.setItem('quizResults', JSON.stringify(results));
  }
  
  // Start timer
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        finishQuiz();
      }
    }, 1000);
  }
  
  // Update timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Add warning class when time is running out
    if (timeLeft <= 60) {
      timeRemaining.parentElement.classList.add('text-error');
    } else if (timeLeft <= 120) {
      timeRemaining.parentElement.classList.add('text-warning');
    }
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
});