"use client"

// Types for our test data
export interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  answers: Answer[]
}

export interface Test {
  id: string
  title: string
  description: string
  time: number
  questions: Question[]
}

export interface TestResult {
  id: string
  testId: string
  userId: string
  userName: string
  userLastName: string
  score: number
  totalQuestions: number
  answers: {
    questionId: string
    selectedAnswerId: string
    isCorrect: boolean
  }[]
  date: string
}

// Get the localStorage key for tests based on folder
function getTestsKey(folder = "default"): string {
  return `${folder}_tests`
}

// Get the localStorage key for results based on folder
function getResultsKey(folder = "default"): string {
  return `${folder}_results`
}

// Load tests from localStorage
export function getTests(folder = "testlar"): Test[] {
  if (typeof window === "undefined") return []

  try {
    const testsJson = localStorage.getItem(getTestsKey(folder))
    if (!testsJson) return []
    return JSON.parse(testsJson)
  } catch (error) {
    console.error(`Testlarni tahlil qilishda xatolik yuz berdi ${folder}:`, error)
    return []
  }
}

// Save a test to localStorage
export function saveTest(test: Test, folder = "testlar"): void {
  if (typeof window === "undefined") return

  try {
    const tests = getTests(folder)
    const existingIndex = tests.findIndex((t) => t.id === test.id)

    if (existingIndex >= 0) {
      tests[existingIndex] = test
    } else {
      tests.push(test)
    }

    localStorage.setItem(getTestsKey(folder), JSON.stringify(tests))
    console.log(`Sinov quyidagi manzilga muvaffaqiyatli saqlandi ${folder}:`, test.id)
  } catch (error) {
    console.error(`Testni saqlashda xatolik yuz berdi${folder}:`, error)
  }
}

// Get a specific test by ID
export function getTestById(id: string, folder = "testlar"): Test | null {
  try {
    const tests = getTests(folder)
    return tests.find((test) => test.id === id) || null
  } catch (error) {
    console.error(`ID orqali test olishda xatolik yuz berdi ${folder}:`, error)
    return null
  }
}

// Load results from localStorage
export function getResults(folder = "testlar"): TestResult[] {
  if (typeof window === "undefined") return []

  try {
    const resultsJson = localStorage.getItem(getResultsKey(folder))
    if (!resultsJson) return []
    return JSON.parse(resultsJson)
  } catch (error) {
    console.error(`Natijalarni tahlil qilishda xatolik yuz berdi ${folder}:`, error)
    return []
  }
}

// Save a result to localStorage
export function saveResult(result: TestResult, folder = "testlar"): void {
  if (typeof window === "undefined") return

  try {
    const results = getResults(folder)
    results.push(result)
    localStorage.setItem(getResultsKey(folder), JSON.stringify(results))
    console.log(`Natija muvaffaqiyatli saqlandi ${folder}:`, result.id)
  } catch (error) {
    console.error(`Natijani saqlashda xatolik yuz berdi ${folder}:`, error)
  }
}

// Get results for a specific test
export function getResultsByTestId(testId: string, folder = "testlar"): TestResult[] {
  try {
    const results = getResults(folder)
    return results.filter((result) => result.testId === testId)
  } catch (error) {
    console.error(`Test identifikatori boʻyicha natijalarni olishda xatolik yuz berdi${folder}:`, error)
    return []
  }
}

// Get results for a specific user
export function getResultsByUserId(userId: string, folder = "testlar"): TestResult[] {
  try {
    const results = getResults(folder)
    return results.filter((result) => result.userId === userId)
  } catch (error) {
    console.error(`Foydalanuvchi identifikatori bo‘yicha natijalarni olishda xatolik yuz berdi ${folder}:`, error)
    return []
  }
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
