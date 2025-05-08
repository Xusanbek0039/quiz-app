"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import type { Test } from "@/lib/test-utils"

interface DownloadTestProps {
  test: Test
  buttonText?: string
}

export function DownloadTest({ test, buttonText = "Test yuklash" }: DownloadTestProps) {
  const handleDownload = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(test, null, 2))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `${test.title.toLowerCase().replace(/\s+/g, "-")}.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (error) {
      console.error("Yuklashda xatolik:", error)
      alert("Qaytadan urinib koring.")
    }
  }

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <FileDown className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  )
}
