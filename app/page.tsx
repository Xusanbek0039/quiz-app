import { UserForm } from "@/components/user-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-pink-500 dark:text-pink-300 mb-2">ITC Viktorena</h1>
              <p className="text-slate-600 dark:text-slate-300">Viktorinani boshlash uchun ismingizni hamda familiyangizni kiriting</p>
            </div>
            <UserForm />
          </div>
        </div>
      </div>
    </main>
  )
}
