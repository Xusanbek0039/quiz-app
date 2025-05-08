"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-pink-200 dark:border-slate-700 hover:bg-pink-100 dark:hover:bg-slate-700 transition-all duration-300"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-pink-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-pink-300" />
          <span className="sr-only">Mavzu tanlash</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-pink-200 dark:border-slate-700"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-pink-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          Tongi
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-pink-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          Tungi
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-pink-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          Tizim
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
