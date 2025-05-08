"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function SampleTestPage() {
  const sampleTest = {
    id: "sample-test-1",
    title: "Viktorina namunasi",
    description: "Test haqida",
    time: 5,
    questions: [
      {
        id: "q1",
        text: "Toshkent qaysi davlat poytaxti?",
        answers: [
          { id: "a1", text: "Qozog'iston", isCorrect: false },
          { id: "a2", text: "Tojikiston", isCorrect: false },
          { id: "a3", text: "Uzbekiston", isCorrect: true },
          { id: "a4", text: "Birlashgan arab amirliklari", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "1 yilda nechta oy bor?",
        answers: [
          { id: "a1", text: "9", isCorrect: false },
          { id: "a2", text: "12", isCorrect: true },
          { id: "a3", text: "10", isCorrect: false },
          { id: "a4", text: "11", isCorrect: false },
        ],
      },
    ],
  }

  const downloadSampleTest = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleTest, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "sample-test.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sinov formati namunasi</h1>
      <p className="mb-4">Bu testlarni yuklash uchun kerakli formatni ko'rsatadigan namunaviy sinov fayli.</p>
      <Button onClick={downloadSampleTest} className="mb-6">
        <FileDown className="mr-2 h-4 w-4" />
        Sinov namunasini yuklab oling
      </Button>
      <pre className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-pink-200 dark:border-slate-700 overflow-x-auto">
        {JSON.stringify(sampleTest, null, 2)}
      </pre>
    </div>
  )
}
