/**
 * Test List module for IT Ijodkorlari
 * Handles fetching and displaying tests from the specified JSON files
 */

// Constants
const TEST_FILE_PATH = [
  '/public/testlar/python-beginner-test.json'
];

const TEST_LIST_ELEMENT_ID = 'testsList';

// Initialize test list
async function initTestList() {
  if (!document.getElementById(TEST_LIST_ELEMENT_ID)) return;

  setupSearchFunctionality();
  await loadAndDisplayTests();
}

// Search functionality
function setupSearchFunctionality() {
  const searchInput = document.getElementById('searchTests');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterTests(searchTerm);
  });
}

// Filter tests based on search term
function filterTests(searchTerm) {
  const testCards = document.querySelectorAll('.test-card');

  testCards.forEach(card => {
    const title = card.querySelector('.test-title').textContent.toLowerCase();
    const description = card.querySelector('.test-description').textContent.toLowerCase();

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = '';
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 500);
    } else {
      card.style.display = 'none';
    }
  });
}

// Load and display multiple test files
async function loadAndDisplayTests() {
  const testsContainer = document.getElementById(TEST_LIST_ELEMENT_ID);
  if (!testsContainer) return;

  try {
    // Fetch tests from all specified JSON files
    const testDataArray = await fetchTestData(TEST_FILE_PATH);

    // Clear container
    testsContainer.innerHTML = '';

    if (!testDataArray || testDataArray.length === 0) {
      showEmptyState(testsContainer);
      return;
    }

    // Loop through each test and add to container
    testDataArray.forEach(test => {
      const testCard = createTestCard(test);
      testsContainer.appendChild(testCard);

      setTimeout(() => {
        testCard.style.opacity = '1';
        testCard.style.transform = 'translateY(0)';
      }, 100);
    });

  } catch (error) {
    console.error('Error loading tests:', error);
    testsContainer.innerHTML = `
      <div class="empty-tests">
        <i data-lucide="alert-triangle"></i>
        <p>Testlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.</p>
      </div>
    `;
    lucide.createIcons();
  }
}

// Fetch data from multiple test files
async function fetchTestData(filePaths) {
  const results = [];

  for (const filePath of filePaths) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to fetch from ${filePath}`);
      const data = await response.json();
      results.push(data);
    } catch (error) {
      console.error(`Error fetching data from ${filePath}:`, error);
    }
  }

  return results;
}

// Create a test card element
function createTestCard(test) {
  const card = document.createElement('div');
  card.className = 'test-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  card.innerHTML = `
    <h3 class="test-title">${test.title}</h3>
    <p class="test-description">${test.description}</p>
    <div class="test-meta">
      <div class="meta-item">
        <i data-lucide="clock"></i>
        <span>${test.time} daqiqa</span>
      </div>
      <div class="meta-item">
        <i data-lucide="help-circle"></i>
        <span>${test.questions.length} ta savol</span>
      </div>
    </div>
    <a href="test.html?id=${test.id}" class="test-button">
      <span>Testni boshlash</span>
      <i data-lucide="arrow-right"></i>
    </a>
  `;

  return card;
}

// Show empty state when no tests are available
function showEmptyState(container) {
  container.innerHTML = `
    <div class="empty-tests">
      <i data-lucide="file-question"></i>
      <p>Hozircha testlar mavjud emas. Yangi testlar tez orada qo'shiladi.</p>
    </div>
  `;
  lucide.createIcons();
}

// Add highlight animation style
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes highlight {
      0% { background-color: var(--bg-primary); }
      50% { background-color: rgba(59, 130, 246, 0.1); }
      100% { background-color: var(--bg-primary); }
    }

    .highlight {
      animation: highlight 0.5s ease;
    }
  </style>
`);

// Initialize module when DOM is loaded
document.addEventListener('DOMContentLoaded', initTestList);
