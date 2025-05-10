/**
 * Quiz functionality for the ITC Quiz App
 */

// State variables
let currentQuiz = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizResults = null;
let selectedCategory = null;
let questionCount = 0;
let timeInMinutes = 0;

// DOM Elements
const quizSelectionElement = document.getElementById('quiz-selection');
const quizContainerElement = document.getElementById('quiz-container');
const resultsContainerElement = document.getElementById('results-container');
const questionTextElement = document.getElementById('question-text');
const optionsContainerElement = document.getElementById('options-container');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const quizTitleElement = document.getElementById('quiz-title');
const progressBarElement = document.getElementById('quiz-progress-bar');
const finishQuizButton = document.getElementById('finish-quiz');
const backToQuizButton = document.getElementById('back-to-quiz');

// Example test data (normally would be loaded from JSON files)
const testData = {
  python: [
    {
      id: 1,
      question: "What is the correct way to create a variable 'x' with the value 10 in Python?",
      options: ["x := 10", "var x = 10", "x = 10", "let x = 10"],
      answer: 2 // x = 10
    },
    {
      id: 2,
      question: "Which of the following is the correct way to declare a list in Python?",
      options: ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
      answer: 0 // list = [1, 2, 3]
    },
    {
      id: 3,
      question: "What is the output of the following code?\nprint(2 ** 3)",
      options: ["6", "8", "5", "Error"],
      answer: 1 // 8
    },
    {
      id: 4,
      question: "Which method is used to add an element to a list in Python?",
      options: ["push()", "add()", "append()", "insert()"],
      answer: 2 // append()
    },
    {
      id: 5,
      question: "What is the correct way to import a module in Python?",
      options: ["#include module", "import module", "using module", "require module"],
      answer: 1 // import module
    },
    {
      id: 6,
      question: "Which of the following is NOT a Python built-in function?",
      options: ["len()", "print()", "type()", "size()"],
      answer: 3 // size()
    },
    {
      id: 7,
      question: "How do you create a comment in Python?",
      options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "-- This is a comment"],
      answer: 2 // # This is a comment
    },
    {
      id: 8,
      question: "What is the output of the following code?\nx = 10\ny = 20\nprint(x + y)",
      options: ["30", "1020", "Error", "None"],
      answer: 0 // 30
    },
    {
      id: 9,
      question: "Which of the following is used to define a function in Python?",
      options: ["function", "def", "fun", "define"],
      answer: 1 // def
    },
    {
      id: 10,
      question: "Which loop is guaranteed to execute at least once in Python?",
      options: ["for loop", "while loop", "do-while loop", "None of the above"],
      answer: 3 // None of the above
    },
    {
      id: 11,
      question: "What is the output of the following code?\nprint('Hello' + ' ' + 'World')",
      options: ["HelloWorld", "Hello World", "Error", "None"],
      answer: 1 // Hello World
    },
    {
      id: 12,
      question: "What is the correct way to create a tuple in Python?",
      options: ["tuple = [1, 2, 3]", "tuple = (1, 2, 3)", "tuple = {1, 2, 3}", "tuple = <1, 2, 3>"],
      answer: 1 // tuple = (1, 2, 3)
    },
    {
      id: 13,
      question: "What is the result of 3 * 2 ** 2 in Python?",
      options: ["12", "36", "9", "Error"],
      answer: 0 // 12
    },
    {
      id: 14,
      question: "Which method is used to remove an element from a list in Python?",
      options: ["delete()", "remove()", "pop()", "discard()"],
      answer: 1 // remove()
    },
    {
      id: 15,
      question: "How do you access the first element of a list named 'fruits' in Python?",
      options: ["fruits[0]", "fruits[1]", "fruits.first()", "fruits.get(0)"],
      answer: 0 // fruits[0]
    }
  ],
  'python-basic': [
    {
      id: 1,
      question: "What is the correct way to create a variable 'x' with the value 10 in Python?",
      options: ["x := 10", "var x = 10", "x = 10", "let x = 10"],
      answer: 2 // x = 10
    },
    {
      id: 2,
      question: "Which of the following is the correct way to declare a list in Python?",
      options: ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
      answer: 0 // list = [1, 2, 3]
    },
    {
      id: 3,
      question: "What is the output of the following code?\nprint(2 ** 3)",
      options: ["6", "8", "5", "Error"],
      answer: 1 // 8
    },
    {
      id: 4,
      question: "Which method is used to add an element to a list in Python?",
      options: ["push()", "add()", "append()", "insert()"],
      answer: 2 // append()
    },
    {
      id: 5,
      question: "What is the correct way to import a module in Python?",
      options: ["#include module", "import module", "using module", "require module"],
      answer: 1 // import module
    },
    {
      id: 6,
      question: "How do you create a comment in Python?",
      options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "-- This is a comment"],
      answer: 2 // # This is a comment
    },
    {
      id: 7,
      question: "What is the output of the following code?\nx = 10\ny = 20\nprint(x + y)",
      options: ["30", "1020", "Error", "None"],
      answer: 0 // 30
    }
  ],
  html: [
    {
      id: 1,
      question: "Which tag is used to define an HTML document?",
      options: ["<html>", "<body>", "<doc>", "<root>"],
      answer: 0 // <html>
    },
    {
      id: 2,
      question: "Which attribute is used to define inline styles in HTML?",
      options: ["class", "style", "css", "format"],
      answer: 1 // style
    },
    {
      id: 3,
      question: "Which HTML element is used to define a paragraph?",
      options: ["<paragraph>", "<p>", "<para>", "<text>"],
      answer: 1 // <p>
    },
    {
      id: 4,
      question: "What does HTML stand for?",
      options: ["Hypertext Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hypertext Machine Language"],
      answer: 0 // Hypertext Markup Language
    },
    {
      id: 5,
      question: "Which HTML tag is used to define a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: 1 // <a>
    },
    {
      id: 6,
      question: "Which HTML element is used to define the title of a document?",
      options: ["<header>", "<title>", "<h1>", "<head>"],
      answer: 1 // <title>
    },
    {
      id: 7,
      question: "Which HTML element is used to define an image?",
      options: ["<image>", "<img>", "<picture>", "<src>"],
      answer: 1 // <img>
    }
  ],
  js: [
    {
      id: 1,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["variable x = 10;", "var x = 10;", "x = 10;", "int x = 10;"],
      answer: 1 // var x = 10;
    },
    {
      id: 2,
      question: "Which built-in method is used to convert a string to lowercase in JavaScript?",
      options: ["toLowerCase()", "toLower()", "changeCase(lower)", "lowerCase()"],
      answer: 0 // toLowerCase()
    },
    {
      id: 3,
      question: "How do you create a function in JavaScript?",
      options: ["function:myFunction()", "function myFunction()", "function = myFunction()", "myFunction() = function"],
      answer: 1 // function myFunction()
    },
    {
      id: 4,
      question: "How do you call a function named 'myFunction' in JavaScript?",
      options: ["call myFunction()", "myFunction()", "call function myFunction()", "Call.myFunction()"],
      answer: 1 // myFunction()
    },
    {
      id: 5,
      question: "How do you write a comment in JavaScript?",
      options: ["# This is a comment", "// This is a comment", "/* This is a comment */", "<!-- This is a comment -->"],
      answer: 1 // // This is a comment
    },
    {
      id: 6,
      question: "What is the correct way to write an array in JavaScript?",
      options: ["var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
      answer: 2 // var colors = ['red', 'green', 'blue']
    },
    {
      id: 7,
      question: "How do you access the first element of an array named 'fruits' in JavaScript?",
      options: ["fruits[0]", "fruits[1]", "fruits.first()", "fruits.get(0)"],
      answer: 0 // fruits[0]
    }
  ]
};

// Initialize quiz selection
function initQuizSelection() {
  const quizCards = document.querySelectorAll('.quiz-card');
  
  quizCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedCategory = card.dataset.category;
      questionCount = parseInt(card.dataset.questions);
      timeInMinutes = parseInt(card.dataset.time);
      
      startQuiz(selectedCategory, questionCount, timeInMinutes);
    });
  });
}

// Load questions from JSON/test data
async function loadQuestions(category, count) {
  // In a real app, this would fetch from an API or JSON file
  // For this example, we'll use our test data
  const allQuestions = testData[category] || [];
  
  // Shuffle questions and select the requested count
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Start the quiz
async function startQuiz(category, count, time) {
  try {
    // Load questions
    quizQuestions = await loadQuestions(category, count);
    
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    
    // Update UI elements
    quizTitleElement.textContent = getCategoryTitle(category);
    totalQuestionsElement.textContent = quizQuestions.length;
    
    // Show quiz container, hide selection and results
    quizSelectionElement.classList.add('hidden');
    quizContainerElement.classList.remove('hidden');
    resultsContainerElement.classList.add('hidden');
    
    // Set up finish quiz button
    finishQuizButton.addEventListener('click', () => finishQuiz());
    
    // Start the timer
    window.timerModule.start(time);
    
    // Show first question
    displayQuestion(0);
    
    // Save quiz start in history
    saveQuizStart(category, count, time);
    
  } catch (error) {
    console.error('Error starting quiz:', error);
    alert('Failed to start quiz. Please try again.');
  }
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

// Display current question
function displayQuestion(index) {
  if (index < 0 || index >= quizQuestions.length) return;
  
  const question = quizQuestions[index];
  
  // Update question text
  questionTextElement.textContent = question.question;
  
  // Clear previous options
  optionsContainerElement.innerHTML = '';
  
  // Add options
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option option-appear';
    optionElement.dataset.index = optionIndex;
    optionElement.textContent = option;
    
    // If user already answered this question, show the selected option
    if (userAnswers[index] !== null && userAnswers[index] === optionIndex) {
      optionElement.classList.add('selected');
    }
    
    // Add click event
    optionElement.addEventListener('click', () => selectOption(optionIndex));
    
    optionsContainerElement.appendChild(optionElement);
  });
  
  // Update question counter
  currentQuestionElement.textContent = index + 1;
  
  // Update progress bar
  const progress = ((index + 1) / quizQuestions.length) * 100;
  progressBarElement.style.width = `${progress}%`;
}

// Handle option selection
function selectOption(optionIndex) {
  // Save user's answer
  userAnswers[currentQuestionIndex] = optionIndex;
  
  // Show selected option
  const optionElements = optionsContainerElement.querySelectorAll('.option');
  optionElements.forEach(el => el.classList.remove('selected'));
  optionElements[optionIndex].classList.add('selected');
  
  // Get correct answer
  const correctAnswer = quizQuestions[currentQuestionIndex].answer;
  
  // Show if answer is correct or incorrect
  optionElements.forEach(el => el.classList.remove('correct', 'incorrect'));
  
  if (optionIndex === correctAnswer) {
    optionElements[optionIndex].classList.add('correct');
  } else {
    optionElements[optionIndex].classList.add('incorrect');
    optionElements[correctAnswer].classList.add('correct');
  }
  
  // Move to next question after a short delay
  setTimeout(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    } else {
      // Last question, finish quiz
      finishQuiz();
    }
  }, 800);
}

// Finish the quiz
function finishQuiz(reason = 'completed') {
  // Stop the timer
  const timerResult = window.timerModule.stop();
  
  // Calculate results
  calculateResults(timerResult, reason);
  
  // Update results UI
  updateResultsUI();
  
  // Show results container, hide quiz container
  quizContainerElement.classList.add('hidden');
  resultsContainerElement.classList.remove('hidden');
  
  // Setup back to quiz button
  backToQuizButton.addEventListener('click', () => {
    quizSelectionElement.classList.remove('hidden');
    resultsContainerElement.classList.add('hidden');
  });
  
  // Save quiz completion in history
  saveQuizCompletion(quizResults);
}

// Calculate quiz results
function calculateResults(timerResult, reason) {
  const correct = userAnswers.reduce((count, answer, index) => {
    return answer === quizQuestions[index].answer ? count + 1 : count;
  }, 0);
  
  const incorrect = userAnswers.filter(answer => answer !== null).length - correct;
  const unanswered = userAnswers.filter(answer => answer === null).length;
  const percentage = Math.round((correct / quizQuestions.length) * 100);
  
  quizResults = {
    category: selectedCategory,
    totalQuestions: quizQuestions.length,
    correct,
    incorrect,
    unanswered,
    percentage,
    time: {
      elapsed: timerResult.elapsed,
      remaining: timerResult.remaining,
      formatted: timerResult.formatted
    },
    reason,
    date: new Date().toISOString(),
    answers: userAnswers.map((answer, index) => {
      return {
        question: quizQuestions[index].question,
        options: quizQuestions[index].options,
        userAnswer: answer,
        correctAnswer: quizQuestions[index].answer,
        isCorrect: answer === quizQuestions[index].answer
      };
    })
  };
}

// Update results UI
function updateResultsUI() {
  if (!quizResults) return;
  
  // Update summary
  document.getElementById('correct-count').textContent = quizResults.correct;
  document.getElementById('incorrect-count').textContent = quizResults.incorrect;
  document.getElementById('percentage').textContent = `${quizResults.percentage}%`;
  document.getElementById('time-taken').textContent = quizResults.time.formatted;
  
  // Update questions review
  const reviewContainer = document.getElementById('questions-review');
  reviewContainer.innerHTML = '';
  
  quizResults.answers.forEach((answer, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
    
    const reviewQuestion = document.createElement('div');
    reviewQuestion.className = 'review-question';
    reviewQuestion.textContent = `Q${index + 1}: ${answer.question}`;
    
    const userAnswerDiv = document.createElement('div');
    userAnswerDiv.className = 'review-answer user';
    userAnswerDiv.innerHTML = `<span>Your answer:</span> <span>${answer.userAnswer !== null ? answer.options[answer.userAnswer] : 'Unanswered'}</span>`;
    
    const correctAnswerDiv = document.createElement('div');
    correctAnswerDiv.className = 'review-answer correct';
    correctAnswerDiv.innerHTML = `<span>Correct answer:</span> <span>${answer.options[answer.correctAnswer]}</span>`;
    
    reviewItem.appendChild(reviewQuestion);
    reviewItem.appendChild(userAnswerDiv);
    reviewItem.appendChild(correctAnswerDiv);
    
    reviewContainer.appendChild(reviewItem);
  });
}

// Save quiz start in history
function saveQuizStart(category, count, time) {
  currentQuiz = {
    id: Date.now().toString(),
    category,
    count,
    time,
    startTime: new Date().toISOString(),
    user: getCurrentUser().id
  };
  
  // Save in local storage
  const quizzes = JSON.parse(localStorage.getItem('itc_quiz_history') || '[]');
  quizzes.push(currentQuiz);
  localStorage.setItem('itc_quiz_history', JSON.stringify(quizzes));
}

// Save quiz completion in history
function saveQuizCompletion(results) {
  if (!currentQuiz) return;
  
  // Get quizzes from local storage
  const quizzes = JSON.parse(localStorage.getItem('itc_quiz_history') || '[]');
  
  // Find the current quiz
  const index = quizzes.findIndex(q => q.id === currentQuiz.id);
  if (index !== -1) {
    // Update the quiz with results
    quizzes[index] = {
      ...quizzes[index],
      endTime: new Date().toISOString(),
      correct: results.correct,
      incorrect: results.incorrect,
      percentage: results.percentage,
      timeElapsed: results.time.elapsed,
      completed: true
    };
    
    // Save updated quizzes
    localStorage.setItem('itc_quiz_history', JSON.stringify(quizzes));
  }
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('itc_quiz_user') || '{}');
}

// Initialize the quiz module
function initQuiz() {
  // Only initialize if on the quiz page
  if (!quizContainerElement) return;
  
  // Set up quiz selection
  initQuizSelection();
}

// Export quiz module
window.quizModule = {
  init: initQuiz,
  start: startQuiz,
  finishQuiz
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);