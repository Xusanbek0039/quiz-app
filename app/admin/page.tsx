"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, Eye, FolderOpen } from "lucide-react"
import { motion } from "framer-motion"
import { type Test, type TestResult, getTests, saveTest, getResults, generateId } from "@/lib/test-utils"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminPage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [tests, setTests] = useState<Test[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [debugInfo, setDebugInfo] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load tests and results from localStorage
    setTests(getTests())
    setResults(getResults())
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setUploadSuccess(false)
      setUploadError(null)
      setDebugInfo(`Faylni belgilash: ${e.target.files[0].name}`)
    }
  }

  const handleBrowseClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleUpload = () => {
    if (!uploadedFile) return

    setIsUploading(true)
    setUploadError(null)
    setDebugInfo("Yuklash jarayoni boshlanmoqda...")

    // Read the file
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setDebugInfo((prev) => `${prev}\nFile kontenti muvaffaqiyatli yuklandi.`)

        const testData = JSON.parse(content)
        setDebugInfo((prev) => `${prev}\nJSON muvaffaqiyatli tahlil qilindi.`)

        // Validate the test data
        if (!testData.id || !testData.title || !testData.questions || !Array.isArray(testData.questions)) {
          throw new Error("Test formati noto‘g‘ri. Majburiy maydonlar yetishmayapti.")
        }

        // Ensure the test has a unique ID
        if (!testData.id) {
          testData.id = generateId()
        }

        // Add the test to localStorage in the "testlar" folder
        saveTest(testData, "testlar")
        setDebugInfo((prev) => `${prev}\nTest "testlar" papkasiga saqlandi!`)

        // Update the tests state
        setTests(getTests("testlar"))
        setDebugInfo((prev) => `${prev}\nYangilangan test holati`)

        setIsUploading(false)
        setUploadSuccess(true)

        // Reset after some time
        setTimeout(() => {
          setUploadedFile(null)
          setUploadSuccess(false)
        }, 3000)
      } catch (error) {
        console.error("Sinov faylini tahlil qilishda xatolik yuz berdi:", error)
        setIsUploading(false)
        setUploadError(`Xatolik: ${error instanceof Error ? error.message : "Nomalum xatolik"}`)
        setDebugInfo((prev) => `${prev}\Xatolik: ${error instanceof Error ? error.message : "Nomalum xatolik"}`)
      }
    }

    reader.onerror = (error) => {
      setIsUploading(false)
      setUploadError("Faylni o‘qishda xatolik yuz berdi. Iltimos, qayta urinib koʻring.")
      setDebugInfo(`Xatoni o'qish: ${error}`)
    }

    try {
      reader.readAsText(uploadedFile)
      setDebugInfo((prev) => `${prev}\nFaylni o'qish boshlandi`)
    } catch (error) {
      setIsUploading(false)
      setUploadError(`Faylni o'qishda xatolik: ${error instanceof Error ? error.message : "Noma'lum xato"}`)
      setDebugInfo(`O'qishda xatolik: ${error instanceof Error ? error.message : "Noma'lum xato"}`)
    }
  }

  const handleDeleteTest = (testId: string) => {
    // Delete test from the "testlar" folder
    const updatedTests = tests.filter((test) => test.id !== testId)
    localStorage.setItem("testlar_tests", JSON.stringify(updatedTests))
    setTests(updatedTests)
  }

  const handleViewTest = (testId: string) => {
    router.push(`/admin/test/${testId}`)
  }

  const handleViewResult = (resultId: string) => {
    router.push(`/admin/result/${resultId}`)
  }

  // Create a sample test
  const createSampleTest = () => {
    const sampleTest: Test = {
      id: generateId(),
      title: "Viktorina namunasi",
      description: "Bu formatni ko'rsatish uchun namunaviy viktorina",
      time: 5,
      questions: [
        {
          id: "q1",
          text: "O'zbekiston poxtatxti qayer?",
          answers: [
            { id: "a1", text: "Andijon", isCorrect: false },
            { id: "a2", text: "Jizzax", isCorrect: false },
            { id: "a3", text: "Toshkent", isCorrect: true },
            { id: "a4", text: "Samarqand", isCorrect: false },
          ],
        },
        {
          id: "q2",
          text: "Python nima?",
          answers: [
            { id: "a1", text: "Yegulik", isCorrect: false },
            { id: "a2", text: "Dasturlash tili", isCorrect: true },
            { id: "a3", text: "Davlat tili", isCorrect: false },
            { id: "a4", text: "Ilon", isCorrect: false },
          ],
        },
      ],
    }

    saveTest(sampleTest, "testlar")
    setTests(getTests("testlar"))
    setUploadSuccess(true)
    setTimeout(() => {
      setUploadSuccess(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Boshqaruv paneli</h1>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="upload" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
            >
              Test yuklash
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
            >
              Testlarni ko'rish
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-slate-700"
            >
              Natijalar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Yangi testni yuklash</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Testni JSOn formatda xotirangizdan belgilang hamda yuklang.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-pink-200 dark:border-slate-700 rounded-lg bg-pink-50/50 dark:bg-slate-800/50 mb-6">
                    <Upload className="h-12 w-12 text-pink-400 dark:text-pink-500 mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 mb-4 text-center">
                      JSON formatda testni belgilash uchun bu yerga bosing
                    </p>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".json"
                      onChange={handleFileChange}
                    />

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="cursor-pointer border-pink-300 dark:border-slate-600 hover:bg-pink-100 dark:hover:bg-slate-700"
                        onClick={handleBrowseClick}
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Faylni belgilash
                      </Button>
                      <Button
                        variant="outline"
                        className="cursor-pointer border-pink-300 dark:border-slate-600 hover:bg-pink-100 dark:hover:bg-slate-700"
                        onClick={createSampleTest}
                      >
                        Testni yuklash
                      </Button>
                    </div>
                  </div>

                  {uploadError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                  )}

                  {uploadedFile && (
                    <div className="flex items-center justify-between p-3 bg-pink-100 dark:bg-slate-700 rounded-lg mb-6">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-2" />
                        <span className="text-slate-700 dark:text-slate-200 text-sm">{uploadedFile.name}</span>
                      </div>
                      {uploadSuccess ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white"
                        >
                          {isUploading ? "Iltimos kuting..." : "Yuklash"}
                        </Button>
                      )}
                    </div>
                  )}

                  {uploadSuccess && (
                    <Alert className="mb-6 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-800 dark:text-green-300">Muvafaqiyatli</AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-400">
                      Sinov "testlar" jildiga muvaffaqiyatli yuklandi!
                      </AlertDescription>
                    </Alert>
                  )}

                  {debugInfo && (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border border-pink-200 dark:border-slate-600 mb-6 overflow-x-auto">
                      <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">Nosozliklarni tuzatish ma'lumotlari</h4>
                      <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{debugInfo}</pre>
                    </div>
                  )}

                  <div className="bg-pink-50 dark:bg-slate-700/50 p-4 rounded-lg border border-pink-200 dark:border-slate-600">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">JSON formatiga qo'yiladigan talablar</h4>
                    <pre className="text-xs bg-white dark:bg-slate-800 p-3 rounded border border-pink-200 dark:border-slate-600 overflow-x-auto">
                      {`{
  "id": "test-id",
  "title": "Test nomi",
  "description": "Test haqida",
  "time": 5,
  "questions": [
    {
      "id": "q1",
      "text": "Savolingiz?",
      "answers": [
        {"id": "a1", "text": "Javob 1", "isCorrect": false},
        {"id": "a2", "text": "Javob 2", "isCorrect": true}
      ]
    }
  ]
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Testlarni ko'rish hamda boshqarish</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                  "testlar" jildidagi barcha mavjud testlarni ko'ring va boshqaring.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        Jildda xech qanday test mavjud emas!
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test nomi</TableHead>
                          <TableHead>Test haqida</TableHead>
                          <TableHead>Savol</TableHead>
                          <TableHead>Vaqt (min)</TableHead>
                          <TableHead className="text-right">Qo'shimcha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.title}</TableCell>
                            <TableCell>{test.description}</TableCell>
                            <TableCell>{test.questions.length}</TableCell>
                            <TableCell>{test.time}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewTest(test.id)}
                                >
                                  <span className="sr-only">Ko'rish</span>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                  onClick={() => handleDeleteTest(test.id)}
                                >
                                  <span className="sr-only">O'chirish</span>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Natijalar</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                  Barcha foydalanuvchi test natijalarini ko'ring.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">Natijalar hali mavjud emas.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Foydalanuvchi</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Natija</TableHead>
                          <TableHead>Topshirilgan vaqt</TableHead>
                          <TableHead className="text-right">Qo'shimcha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => {
                          const test = tests.find((t) => t.id === result.testId)
                          return (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">
                                {result.userName} {result.userLastName}
                              </TableCell>
                              <TableCell>{test?.title || "Noma'lum test"}</TableCell>
                              <TableCell>{Math.round((result.score / result.totalQuestions) * 100)}%</TableCell>
                              <TableCell>{format(new Date(result.date), "MMM d, yyyy")}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewResult(result.id)}
                                >
                                  <span className="sr-only">Ko'rish</span>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
