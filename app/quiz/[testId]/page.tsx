// Client-side sahifa
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { QuizComponent } from "@/components/quiz-component"
import { Loader2 } from "lucide-react"
import { type Test, getTestById } from "@/lib/test-utils"

type TestPageProps = {
  params: {
    testId: string
  }
}

export default function TestPage({ params }: TestPageProps) {
  const router = useRouter()
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null)
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userInfo = sessionStorage.getItem("quizUser")

    if (!userInfo) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userInfo))

    const testData = getTestById(params.testId, "testlar")

    if (!testData) {
      router.push("/quiz")
      return
    }

    setTest(testData)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.testId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500 dark:text-pink-400 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Viktorina yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Test "testlar" jildida topilmadi.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200">{test.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Assalomu alaykum, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <QuizComponent test={test} user={user} />
      </div>
    </main>
  )
}
