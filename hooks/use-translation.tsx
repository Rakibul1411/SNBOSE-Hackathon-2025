"use client"

import { useTranslationContext } from "@/components/language-provider"

export function useTranslation() {
  const { language, setLanguage, translations } = useTranslationContext()

  const t = (key: string) => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")
    let value = translations

    // Traverse the translations object
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value]
      } else {
        // Return the key if translation not found
        return key
      }
    }

    return value as string
  }

  return { t, language, setLanguage }
}
