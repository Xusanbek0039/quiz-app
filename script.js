// Common functions for all pages

// Load navbar
function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container")

  // Fetch navbar HTML
  fetch("nav.html")
    .then((response) => response.text())
    .then((html) => {
      navbarContainer.innerHTML = html

      // Set up navbar functionality after loading
      setupNavbar()
    })
    .catch((error) => {
      console.error("Error loading navbar:", error)
      navbarContainer.innerHTML = `
                <nav class="navbar">
                    <div class="navbar-brand">
                        <a href="index.html">CodeTestX</a>
                    </div>
                    <div class="navbar-end">
                        <div class="theme-toggle">
                            <span class="light-icon">☀️</span>
                            <label class="switch">
                                <input type="checkbox" id="navThemeToggle">
                                <span class="slider round"></span>
                            </label>
                            <span class="dark-icon">🌙</span>
                        </div>
                    </div>
                </nav>
            `
      setupNavbar()
    })
}

// Set up navbar functionality
function setupNavbar() {
  // Mobile menu toggle
  const navbarBurger = document.getElementById("navbarBurger")
  const navbarMenu = document.getElementById("navbarMenu")

  if (navbarBurger && navbarMenu) {
    navbarBurger.addEventListener("click", function () {
      this.classList.toggle("active")
      navbarMenu.classList.toggle("active")
    })
  }

  // Theme toggle
  const navThemeToggle = document.getElementById("navThemeToggle")
  if (navThemeToggle) {
    // Set initial state based on localStorage
    const currentTheme = localStorage.getItem("theme") || "light"
    navThemeToggle.checked = currentTheme === "dark"

    // Add event listener
    navThemeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.setAttribute("data-theme", "dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        localStorage.setItem("theme", "light")
      }
    })
  }

  // Current date and time
  const currentDateTime = document.getElementById("currentDateTime")
  if (currentDateTime) {
    updateDateTime()
    setInterval(updateDateTime, 1000)
  }

  // User profile
  const userProfile = document.getElementById("userProfile")
  const logoutBtn = document.getElementById("logoutBtn")

  if (userProfile) {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userNameElement = userProfile.querySelector(".user-name")
      if (userNameElement) {
        userNameElement.textContent = currentUser
      }
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Haqiqatan ham chiqishni istaysizmi?")) {
        localStorage.removeItem("currentUser")
        window.location.href = "login.html"
      }
    })
  }
}

// Update date and time
function updateDateTime() {
  const currentDateTime = document.getElementById("currentDateTime")
  if (currentDateTime) {
    const now = new Date()
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "numeric",
      month: "short",
    }
    currentDateTime.textContent = now.toLocaleString(undefined, options)
  }
}

// Initialize theme
function initTheme() {
  // Theme toggle in page (not navbar)
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    // Set initial state based on localStorage
    const currentTheme = localStorage.getItem("theme") || "light"
    themeToggle.checked = currentTheme === "dark"

    // Add event listener
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.setAttribute("data-theme", "dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        localStorage.setItem("theme", "light")
      }
    })
  }

  // Apply theme from localStorage
  const currentTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", currentTheme)
}
