"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type Test, type TestResult, saveResult, generateId } from "@/lib/test-utils"

interface QuizComponentProps {
  test: Test
  user: { firstName: string; lastName: string } | null
}

export function QuizComponent({ test, user }: QuizComponentProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswerId: string; isCorrect: boolean }[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(test.time * 60) // Convert minutes to seconds
  const currentQuestion = test.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (quizCompleted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, [timeLeft, quizCompleted])

    return () => clearInterval(timer)
  }, [timeLeft, quizCompleted])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = () => {
    if (!selectedAnswer) return

    // Find the selected answer
    const selectedAnswerObj = currentQuestion.answers.find((a) => a.id === selectedAnswer)
    if (!selectedAnswerObj) return

    // Record answer
    const isCorrect = selectedAnswerObj.isCorrect
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswerId: selectedAnswer,
        isCorrect,
      },
    ])

    // Show feedback
    setShowFeedback(true)

    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestionIndex < test.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)
  }

  const handleFinish = () => {
    // Calculate score
    const correctAnswers = answers.filter((a) => a.isCorrect).length

    // Create result object
    const result = {
      id: generateId(),
      testId: test.id,
      userId: (user?.firstName || "") + (user?.lastName || "") || "anonymous",
      userName: user?.firstName || "Anonymous",
      userLastName: user?.lastName || "User",
      score: correctAnswers,
      totalQuestions: test.questions.length,
      answers: answers,
      date: new Date().toISOString(),
    }

    // Save result to the "testlar" folder
    saveResult(result, "testlar")

    // Store results in session storage for the results page
    sessionStorage.setItem("quizResults", JSON.stringify(result))

    // Navigate to results page
    router.push("/results")
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!quizCompleted ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {currentQuestionIndex + 1} savoldan {test.questions.length} dasiz
              </span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-pink-500 dark:text-pink-400" />
                <span className="text-sm font-medium text-pink-500 dark:text-pink-400">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-pink-100 dark:bg-slate-700">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
            </Progress>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect}>
                    <div className="space-y-3">
                      {currentQuestion.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`relative rounded-lg border border-pink-200 dark:border-slate-700 p-4 transition-all duration-200 hover:border-pink-300 dark:hover:border-pink-700 ${
                            selectedAnswer === answer.id
                              ? "bg-pink-50 dark:bg-slate-700 border-pink-300 dark:border-pink-600"
                              : "bg-white dark:bg-slate-800"
                          } ${
                            showFeedback && selectedAnswer === answer.id
                              ? answer.isCorrect
                                ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                                : "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value={answer.id}
                            id={`option-${answer.id}`}
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                            disabled={showFeedback}
                          />
                          <Label
                            htmlFor={`option-${answer.id}`}
                            className="block pl-8 cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            {answer.text}
                          </Label>
                          {showFeedback && selectedAnswer === answer.id && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {answer.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer || showFeedback}
                    className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {currentQuestionIndex < test.questions.length - 1 ? (
                      <>
                        Keyingisi
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Yakunlash"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center text-slate-800 dark:text-slate-100">Viktorina tugallandi!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Viktorinani yakunladingiz. Natijalaringizni ko'rish uchun pastga bosing.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleFinish}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Natijani ko'rish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}