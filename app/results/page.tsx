"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Home, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { type Test, type TestResult, getTestById } from "@/lib/test-utils"

export default function ResultsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null)
  const [result, setResult] = useState<TestResult | null>(null)
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user info and results exist in session storage
    const userInfo = sessionStorage.getItem("quizUser")
    const quizResults = sessionStorage.getItem("quizResults")

    if (!userInfo || !quizResults) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userInfo))
    const resultData = JSON.parse(quizResults) as TestResult
    setResult(resultData)

    // Get the test data
    if (resultData.testId) {
      const testData = getTestById(resultData.testId)
      setTest(testData)
    }

    setLoading(false)
  }, [router])

  const handleReturnHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center transition-colors duration-500">
        <p className="text-slate-600 dark:text-slate-300">Natijalar yuklanmoqda...</p>
      </div>
    )
  }

  if (!result || !test) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center transition-colors duration-500">
        <p className="text-slate-600 dark:text-slate-300">Natijalar mavjud emas..</p>
      </div>
    )
  }

  const correctAnswers = result.score
  const totalQuestions = result.totalQuestions
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {user?.firstName} {user?.lastName} natijalari
            </h2>
          </div>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-center text-slate-800 dark:text-slate-100">
                  {test.title} Natijalar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-6">
                    <div className="w-full h-full rounded-full bg-pink-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-pink-500 dark:text-pink-400">{score}%</span>
                    </div>
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-pink-100 dark:text-slate-700 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-pink-500 dark:text-pink-400 stroke-current"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                        strokeDasharray={`${score * 2.89}, 289`}
                        strokeDashoffset="0"
                      ></circle>
                    </svg>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-center mb-4">
                  <span className="font-bold text-pink-500 dark:text-pink-400">{totalQuestions}</span> ta savol dan {" "}
                    <span className="font-bold text-pink-500 dark:text-pink-400">{correctAnswers}</span> ta to'g'ri javob.
                  </p>

                  <Button
                    onClick={handleReturnHome}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Bosh saxifaga qaytish
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
                >
                  Barcha viktorenalar
                </TabsTrigger>
                <TabsTrigger
                  value="correct"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
                >
                  Tog'ri bajarilganlar
                </TabsTrigger>
                <TabsTrigger
                  value="incorrect"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
                >
                  Xato bajarilganlar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-4">
                {result.answers.map((answer, index) => (
                  <ResultCard key={index} questionNumber={index + 1} answer={answer} test={test} />
                ))}
              </TabsContent>

              <TabsContent value="correct" className="mt-4 space-y-4">
                {result.answers
                  .filter((answer) => answer.isCorrect)
                  .map((answer, index) => (
                    <ResultCard
                      key={index}
                      questionNumber={result.answers.findIndex((a) => a.questionId === answer.questionId) + 1}
                      answer={answer}
                      test={test}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="incorrect" className="mt-4 space-y-4">
                {result.answers
                  .filter((answer) => !answer.isCorrect)
                  .map((answer, index) => (
                    <ResultCard
                      key={index}
                      questionNumber={result.answers.findIndex((a) => a.questionId === answer.questionId) + 1}
                      answer={answer}
                      test={test}
                    />
                  ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

interface ResultCardProps {
  questionNumber: number
  answer: {
    questionId: string
    selectedAnswerId: string
    isCorrect: boolean
  }
  test: Test
}

function ResultCard({ questionNumber, answer, test }: ResultCardProps) {
  // Get question details from test
  const question = test.questions.find((q) => q.id === answer.questionId)

  if (!question) return null

  const selectedAnswer = question.answers.find((a) => a.id === answer.selectedAnswerId)
  const correctAnswer = question.answers.find((a) => a.isCorrect)

  return (
    <Card
      className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-l-4 ${
        answer.isCorrect
          ? "border-l-green-500 border-green-200 dark:border-green-800"
          : "border-l-red-500 border-red-200 dark:border-red-800"
      } shadow-sm`}
    >
      <CardContent className="p-4">
        <div className="flex items-start">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              answer.isCorrect
                ? "bg-green-100 dark:bg-green-900/30 text-green-500"
                : "bg-red-100 dark:bg-red-900/30 text-red-500"
            }`}
          >
            {answer.isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-1">{questionNumber} savol</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">{question.text}</p>

            <div className="mt-2 space-y-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sizning javobingiz:{" "}
                <span className={answer.isCorrect ? "text-green-500" : "text-red-500"}>{selectedAnswer?.text}</span>
              </p>

              {!answer.isCorrect && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  To'g'ri javob: <span className="text-green-500">{correctAnswer?.text}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
