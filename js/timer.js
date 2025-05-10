/**
 * Timer functionality for the ITC Quiz App
 */

let timerInterval = null;
let startTime = null;
let timeLimit = null;
let pauseTime = null;
let isPaused = false;

// Format time in MM:SS format
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start the timer
function startTimer(minutes) {
  // Clear any existing interval
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // Set time limit in seconds
  timeLimit = minutes * 60;
  startTime = Date.now();
  isPaused = false;
  pauseTime = null;
  
  // Get timer element
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;
  
  // Update timer text
  timerElement.textContent = formatTime(timeLimit);
  
  // Setup interval to update every second
  timerInterval = setInterval(() => {
    // Skip update if timer is paused
    if (isPaused) return;
    
    // Calculate elapsed time in seconds
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds);
    
    // Update timer display
    timerElement.textContent = formatTime(remainingSeconds);
    
    // Add warning class when less than 1 minute remaining
    if (remainingSeconds <= 60) {
      timerElement.classList.add('time-warning');
    }
    
    // Handle time up event
    if (remainingSeconds === 0) {
      clearInterval(timerInterval);
      // Trigger finish quiz event
      const quizModule = window.quizModule;
      if (quizModule && typeof quizModule.finishQuiz === 'function') {
        quizModule.finishQuiz('timeout');
      }
    }
  }, 1000);
}

// Pause the timer
function pauseTimer() {
  if (!isPaused && timerInterval) {
    isPaused = true;
    pauseTime = Date.now();
  }
}

// Resume the timer
function resumeTimer() {
  if (isPaused && pauseTime) {
    isPaused = false;
    // Adjust start time to account for pause duration
    const pauseDuration = Date.now() - pauseTime;
    startTime += pauseDuration;
    pauseTime = null;
  }
}

// Stop the timer and return elapsed time
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Calculate elapsed time in seconds
  let elapsedSeconds = 0;
  if (startTime) {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  }
  
  // Remove timer warning class if present
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.classList.remove('time-warning');
  }
  
  return {
    elapsed: elapsedSeconds,
    remaining: timeLimit ? Math.max(0, timeLimit - elapsedSeconds) : 0,
    formatted: formatTime(elapsedSeconds)
  };
}

// Export timer functions as a module
window.timerModule = {
  start: startTimer,
  pause: pauseTimer,
  resume: resumeTimer,
  stop: stopTimer,
  formatTime: formatTime
};