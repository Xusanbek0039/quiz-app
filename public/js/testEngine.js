/**
 * IT Ijodkorlari uchun Test Tizimi
 * Bu modul test yuklash, savolni ko'rsatish, javoblarni qabul qilish,
 * natija hisoblash hamda statistikaga saqlash vazifalarini bajaradi.
 */

// Hozirgi test ma'lumotlari, foydalanuvchi javoblari va joriy savol indeksini saqlaydi
let currentTest = null;         // Joriy testning to'liq ma'lumoti
let userAnswers = {};           // Foydalanuvchi javoblari { questionId: answerId }
let currentQuestionIndex = 0;   // Joriy savol raqami

/**
 * Testni ishga tushirish funksiyasi
 * URL-dan test ID ni olib, testni yuklaydi
 */
async function initTest() {
  const urlParams = new URLSearchParams(window.location.search);
  const testIdParam = urlParams.get('id'); // Masalan: ?id=python-basics

  if (!testIdParam) {
    redirectToHome(); // Agar test ID yo'q bo'lsa, bosh sahifaga o'tkazadi
    return;
  }

  await loadTest(testIdParam); // Test ma'lumotlarini yuklaydi
  setupTestInteractions();     // Tugmalar bilan aloqani sozlaydi
}

/**
 * Test ma'lumotlarini yuklaydi
 * @param {string} testId - Yuklanadigan test identifikatori
 */
async function loadTest(testId) {
  try {
    // Haqiqiy ilovada bu serverdan yuklanadi
    currentTest = await loadSampleTest(); // Namuna testni yuklaydi

    if (!currentTest) {
      showErrorMessage("Test topilmadi");
      return;
    }

    displayTestInfo(); // Test sarlavhasi, tavsifi, vaqt va savollar sonini ko'rsatadi
  } catch (error) {
    console.error("Test yuklashda xato:", error);
    showErrorMessage("Testni yuklashda xatolik yuz berdi");
  }
}

/**
 * Test sarlavhasi, tavsifi vaqt kabi ma'lumotlarni HTML-ga chiqaradi
 */
function displayTestInfo() {
  document.getElementById('testTitle').textContent = currentTest.title;
  document.getElementById('testDescription').textContent = currentTest.description;
  document.getElementById('testTime').textContent = currentTest.time;
  document.getElementById('questionsCount').textContent = currentTest.questions.length;
  document.getElementById('totalQuestions').textContent = currentTest.questions.length;
}

/**
 * Test bilan o'zaro ta'sir tugmalari (boshlash, keyingi, oldingi, yakunlash)
 */
function setupTestInteractions() {
  const startButton = document.getElementById('startTestBtn');
  if (startButton) {
    startButton.addEventListener('click', startTest); // Testni boshlash tugmasi
  }

  const prevButton = document.getElementById('prevQuestionBtn');
  const nextButton = document.getElementById('nextQuestionBtn');
  const finishButton = document.getElementById('finishTestBtn');

  if (prevButton) prevButton.addEventListener('click', goToPreviousQuestion);
  if (nextButton) nextButton.addEventListener('click', goToNextQuestion);
  if (finishButton) finishButton.addEventListener('click', finishTest);
}

/**
 * Testni boshlaydi:
 * Kirish ekranini yashiradi, savollarni ko'rsatishni boshlaydi
 */
function startTest() {
  document.getElementById('testIntro').classList.add('hidden');
  document.getElementById('testContent').classList.remove('hidden');

  initializeUserAnswers(); // Barcha savollar uchun "javob berilmagan" holatini sozlaydi
  displayQuestion(0);        // Birinchi savolni ekranga chiqaradi
}

/**
 * Har bir savol uchun javob joyini tayyorlaydi
 */
function initializeUserAnswers() {
  currentTest.questions.forEach(question => {
    userAnswers[question.id] = null; // Dastlab hech qanday javob tanlanmagan
  });
}

/**
 * Berilgan savolni ekranga chiqaradi
 * @param {number} index - Savol tartib raqami
 */
function displayQuestion(index) {
  if (!currentTest || !currentTest.questions[index]) return;

  currentQuestionIndex = index;
  const question = currentTest.questions[index];

  // Progress bar yangilanadi
  document.getElementById('currentQuestion').textContent = index + 1;
  document.getElementById('progressFill').style.width = `${((index + 1) / currentTest.questions.length) * 100}%`;

  // HTML hosil qilish
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

  const questionContainer = document.getElementById('questionContainer');
  questionContainer.innerHTML = questionHTML;

  // Javob tanlash hodisasi
  const answerElements = questionContainer.querySelectorAll('.answer-item');
  answerElements.forEach(element => {
    element.addEventListener('click', () => selectAnswer(question.id, element.dataset.answerId));
  });

  updateNavigationButtons(); // Oldingi/Keyingi tugmalar holatini yangilaydi
}

/**
 * Foydalanuvchi javobini saqlaydi
 * @param {string} questionId - Savol ID si
 * @param {string} answerId - Tanlangan javob ID si
 */
function selectAnswer(questionId, answerId) {
  userAnswers[questionId] = answerId;

  // UI yangilash: tanlangan javobga stil berish
  const answerElements = document.querySelectorAll('.answer-item');
  answerElements.forEach(element => {
    if (element.dataset.answerId === answerId) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  });

  // Keyingi savol tugmasini faollashtirish
  const nextButton = document.getElementById('nextQuestionBtn');
  if (nextButton.disabled) {
    nextButton.disabled = false;
  }
}

/**
 * Oldingi savolga o'tish
 */
function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    displayQuestion(currentQuestionIndex - 1);
  }
}

/**
 * Keyingi savolga o'tish
 */
function goToNextQuestion() {
  if (currentQuestionIndex < currentTest.questions.length - 1) {
    displayQuestion(currentQuestionIndex + 1);
  }
}

/**
 * Navigatsiya tugmalari (oldingi, keyingi, yakunlash) holatini yangilaydi
 */
function updateNavigationButtons() {
  const prevButton = document.getElementById('prevQuestionBtn');
  const nextButton = document.getElementById('nextQuestionBtn');
  const finishButton = document.getElementById('finishTestBtn');

  prevButton.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === currentTest.questions.length - 1) {
    nextButton.classList.add('hidden');
    finishButton.classList.remove('hidden');
  } else {
    nextButton.classList.remove('hidden');
    finishButton.classList.add('hidden');
  }
}

/**
 * Testni yakunlab, natijani hisoblaydi
 */
function finishTest() {
  const results = calculateResults();
  saveTestResults(results); // Natijani localStorage ga saqlaydi
  displayResults(results);  // Natijani ekranga chiqaradi
}

/**
 * To'g'ri va noto'g'ri javoblarni hisoblaydi
 * @returns {Object} - Hisoblangan natija obyekti
 */
function calculateResults() {
  let correctAnswers = 0;
  const questionDetails = [];

  currentTest.questions.forEach(question => {
    const userAnswer = userAnswers[question.id];
    const correctAnswer = question.answers.find(a => a.isCorrect).id;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) correctAnswers++;

    questionDetails.push({
      question: question.text,
      userAnswer: userAnswer ? question.answers.find(a => a.id === userAnswer).text : 'Belgilanmagan',
      correctAnswer: question.answers.find(a => a.isCorrect).text,
      isCorrect
    });
  });

  const percentageCorrect = Math.round((correctAnswers / currentTest.questions.length) * 100);

  return {
    totalQuestions: currentTest.questions.length,
    correctAnswers,
    percentageCorrect,
    questionDetails,
    testId: currentTest.id,
    testTitle: currentTest.title,
    date: new Date().toISOString()
  };
}

/**
 * Test natijasini localStorage ga saqlaydi
 * @param {Object} results - Hisoblangan natija
 */
function saveTestResults(results) {
  const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  storedResults.push(results);
  localStorage.setItem('testResults', JSON.stringify(storedResults));
}

/**
 * Test natijasini ekranga chiqaradi
 * @param {Object} results - Hisoblangan natija
 */
function displayResults(results) {
  const testContentElement = document.getElementById('testContent');
  const testResultsElement = document.getElementById('testResults');

  testContentElement.classList.add('hidden');
  testResultsElement.classList.remove('hidden');

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

  testResultsElement.innerHTML = resultsHTML;
  lucide.createIcons();
}

/**
 * Xatolik xabarini ko'rsatadi
 * @param {string} message - Ko'rsatiladigan xabar matni
 */
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

/**
 * Foydalanuvchini asosiy sahifaga yo'naltiradi
 */
function redirectToHome() {
  window.location.href = 'home.html';
}

/**
 * Namuna test ma'lumotlarini qaytaradi (haqiqiy ilovada serverdan yuklanadi)
 */
async function loadSampleTest() {
  return {
    "id": "python-basics",
    "title": "Python Basics",
    "description": "Python asoslari haqida test",
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
      }
    ]
  };
}

// Xatolik xabarini ushlab turish uchun CSS
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: red;
    }
    .error-message i {
      width: 48px;
      height: 48px;
    }
    .error-message p {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
  </style>
`);

// DOM yuklanganda testni ishga tushiradi
document.addEventListener('DOMContentLoaded', initTest);