"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2 } from "lucide-react"
import { type Test, getTests } from "@/lib/test-utils"
import { TestSelector } from "@/components/test-selector"

export default function QuizPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    // Check if user info exists in session storage
    const userInfo = sessionStorage.getItem("quizUser")

    if (!userInfo) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userInfo))

    // Load available tests
    setTests(getTests())

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500 dark:text-pink-400 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Viktorena yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200">
              Assalom alekum, {user?.firstName} {user?.lastName}
            </h2>
          </div>
          <ThemeToggle />
        </div>

        <TestSelector tests={tests} user={user} />
      </div>
    </main>
  )
}
