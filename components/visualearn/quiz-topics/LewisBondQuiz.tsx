"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const questions = [
  {
    question: "What does a Lewis structure show?",
    options: [
      "Only the atomic number of an element",
      "The sharing or transfer of electrons in bonds",
      "The physical state of compounds"
    ],
    correct: "The sharing or transfer of electrons in bonds"
  },
  {
    question: "What is represented by dots in a Lewis structure?",
    options: [
      "Neutrons",
      "Electrons",
      "Protons"
    ],
    correct: "Electrons"
  },
  {
    question: "In a Lewis structure, what does a line between two atoms represent?",
    options: [
      "A covalent bond",
      "A double bond only",
      "An ionic attraction"
    ],
    correct: "A covalent bond"
  },
  {
    question: "How many electrons are in a single covalent bond?",
    options: ["1", "2", "4"],
    correct: "2"
  },
  {
    question: "Which pair shows a correct Lewis dot structure idea?",
    options: [
      "H:Cl (with dots around Cl)",
      "Na:Cl (with shared dots)",
      "K=O (double line for metal and oxygen)"
    ],
    correct: "H:Cl (with dots around Cl)"
  }
]

export default function LewisBondQuiz() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""))
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const score = answers.filter((ans, i) => ans === questions[i].correct).length

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Lewis Bond Quiz</h2>
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-medium">{q.question}</h3>
            <RadioGroup value={answers[i]} onValueChange={(val) => handleSelect(i, val)}>
              {q.options.map((opt, j) => (
                <div key={j} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`q${i}-${j}`} />
                  <Label htmlFor={`q${i}-${j}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            {submitted && (
              <p className={`${answers[i] === q.correct ? "text-green-600" : "text-red-600"} font-medium`}>
                {answers[i] === q.correct ? "Correct!" : `Incorrect. Answer: ${q.correct}`}
              </p>
            )}
          </div>
        ))}
        <Button onClick={() => setSubmitted(true)} disabled={answers.includes("")}>
          Submit
        </Button>

        {submitted && (
          <p className="mt-4 text-lg font-semibold">
            Score: {score} / {questions.length}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
