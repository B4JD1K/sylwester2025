"use client"

import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {cn} from "@/lib/utils"

export function ModeToggle({className}: { className?: string }) {
  const {setTheme, theme} = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 hover:bg-muted transition-colors text-foreground/80 hover:text-foreground",
        className
      )}
      title="Przełącz motyw"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
      <span className="sr-only">Przełącz motyw</span>
    </button>
  )
}
