"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Test } from "@/lib/test-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface TestSelectorProps {
  tests: Test[]
  user: { firstName: string; lastName: string } | null
}

export function TestSelector({ tests, user }: TestSelectorProps) {
  const router = useRouter()
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)

  const handleStartTest = () => {
    if (!selectedTest) return

    // Store selected test in session storage
    sessionStorage.setItem("selectedTest", JSON.stringify(selectedTest))
    router.push(`/quiz/${selectedTest.id}`)
  }

  if (tests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Testlar mavjud emas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300">
            "Testlar" jildida testlar mavjud emas. Iltimos, keyinroq tekshiring yoki quyidagi manzilga murojaat qiling 
            https://t.me/husanbek_coder
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Kerkli mavzudagi testni belgilang</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Testlar papkasida mavjud testlar 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <motion.div key={test.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Card
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    selectedTest?.id === test.id
                      ? "border-pink-400 dark:border-pink-600"
                      : "border-pink-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-800"
                  }`}
                  onClick={() => setSelectedTest(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-slate-800 dark:text-slate-100">{test.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{test.description}</p>
                      </div>
                      <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{test.time} daqiqa</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 text-slate-500 dark:text-slate-400 text-sm">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{test.questions.length} savol</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartTest}
            disabled={!selectedTest}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            Viktorenani boshlash
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
