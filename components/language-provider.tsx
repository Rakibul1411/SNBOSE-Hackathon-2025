"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { en } from "@/translations/en"
import { bn } from "@/translations/bn"

type Language = "en" | "bn"
type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  translations: typeof en
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  translations: en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState(en)

  useEffect(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "en" ? en : bn)
    // Save to localStorage
    localStorage.setItem("language", language)
  }, [language])

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslationContext = () => useContext(TranslationContext)
