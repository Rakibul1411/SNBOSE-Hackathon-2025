"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const questions = [
  {
    question: "What is the shape of a projectile's path (neglecting air resistance)?",
    options: ["Circular", "Parabolic", "Linear", "Elliptical"],
    correct: "Parabolic",
  },
  {
    question: "What is the vertical acceleration of a projectile on Earth (near surface)?",
    options: ["0 m/s²", "9.8 m/s² upward", "9.8 m/s² downward", "Varies with velocity"],
    correct: "9.8 m/s² downward",
  },
  {
    question: "At the top of its trajectory, the vertical velocity of a projectile is:",
    options: ["Maximum", "Zero", "Equal to horizontal velocity", "Negative"],
    correct: "Zero",
  },
  {
    question: "The horizontal velocity of a projectile (without air resistance):",
    options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
    correct: "Remains constant",
  },
  {
    question: "Which factor directly affects the time of flight of a projectile?",
    options: ["Horizontal velocity", "Vertical initial velocity", "Launch angle only", "Mass of the object"],
    correct: "Vertical initial velocity",
  },
  {
    question: "A ball is thrown horizontally from a height of 20 m. What affects how far it lands from the base?",
    options: ["Its vertical speed", "Gravity only", "Its horizontal speed", "Its mass"],
    correct: "Its horizontal speed",
  },
  {
    question: "If two objects are launched at the same speed but at angles 30° and 60°, which will go farther?",
    options: ["30°", "60°", "Same distance", "Not enough info"],
    correct: "Same distance",
  },
  {
    question: "A projectile is launched with speed v at angle θ. What is the range formula?",
    options: [
      "R = v²·sinθ / g",
      "R = (v²·sin2θ) / g",
      "R = vt·cosθ",
      "R = v·sinθ·t",
    ],
    correct: "R = (v²·sin2θ) / g",
  },
  {
    question: "A ball is launched at 45° with a speed of 20 m/s. What is the total time of flight?",
    options: ["1.41 s", "2.88 s", "3.21 s", "4.05 s"],
    correct: "2.88 s",
  },
  {
    question: "Which of the following increases the maximum height of a projectile the most?",
    options: [
      "Increasing mass",
      "Increasing launch speed",
      "Launching at a lower angle",
      "Increasing horizontal velocity only",
    ],
    correct: "Increasing launch speed",
  },
]

export default function ProjectileMotionQuiz() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""))
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const score = answers.filter((ans, i) => ans === questions[i].correct).length

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Projectile Motion Quiz</h2>
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-medium">{i + 1}. {q.question}</h3>
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
                {answers[i] === q.correct ? "✅ Correct!" : `❌ Incorrect. Answer: ${q.correct}`}
              </p>
            )}
          </div>
        ))}
        <Button onClick={() => setSubmitted(true)} disabled={answers.includes("")}>
          Submit
        </Button>

        {submitted && (
          <p className="mt-4 text-lg font-semibold">
            Final Score: {score} / {questions.length}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
