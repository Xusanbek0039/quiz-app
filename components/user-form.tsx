"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function UserForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ firstName: "", lastName: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const newErrors = {
      firstName: firstName.trim() === "" ? "Ism talab qilinadi" : "",
      lastName: lastName.trim() === "" ? "Familiya talab qilinadi" : "",
    }

    setErrors(newErrors)

    if (newErrors.firstName || newErrors.lastName) {
      return
    }

    setLoading(true)

    // Simulate loading
    setTimeout(() => {
      // Store user info in session storage
      sessionStorage.setItem("quizUser", JSON.stringify({ firstName, lastName }))
      router.push("/quiz")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200">
            Ismingiz
          </Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-pink-200 dark:border-slate-700 focus:border-pink-400 dark:focus:border-pink-400 focus:ring-pink-400 dark:focus:ring-pink-400 transition-all duration-300"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200">
            Familiyangiz
          </Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-pink-200 dark:border-slate-700 focus:border-pink-400 dark:focus:border-pink-400 focus:ring-pink-400 dark:focus:ring-pink-400 transition-all duration-300"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iltimos kuting...
          </>
        ) : (
          "Testni boshlash"
        )}
      </Button>
    </form>
  )
}
