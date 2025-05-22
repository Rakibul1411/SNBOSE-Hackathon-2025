"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface TopicQuizProps {
  subject: string
  chapter: string
  topicId: string
}

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

export default function TopicQuiz({ subject, chapter, topicId }: TopicQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const getQuestions = (): Question[] => {
    if (subject === "physics" && topicId === "what-is-physics") {
      return [
        {
          id: 1,
          text: "Which of these is NOT a fundamental quantity in physics?",
          options: ["Mass", "Length", "Time", "Volume"],
          correctAnswer: 3,
        },
        {
          id: 2,
          text: "Which branch of physics deals with the behavior of subatomic particles?",
          options: ["Classical Mechanics", "Thermodynamics", "Quantum Mechanics", "Electromagnetism"],
          correctAnswer: 2,
        }
      ]
    }
    else if (subject === "physics" && topicId === "scientific-method") {
      return [
        {
          id: 1,
          text: "What is the first step in the scientific method?",
          options: ["Formulating a hypothesis", "Conducting experiments", "Making observations", "Analyzing data"],
          correctAnswer: 2,
        },
        {
          id: 2,
          text: "A testable explanation for an observed phenomenon is called:",
          options: ["Theory", "Law", "Hypothesis", "Conclusion"],
          correctAnswer: 2,
        }
      ]
    }
    else if (subject === "physics" && topicId === "vector-basics") {
      return [
        {
          id: 1,
          text: "Which of these quantities is a vector?",
          options: ["Mass", "Temperature", "Displacement", "Time"],
          correctAnswer: 2,
        },
        {
          id: 2,
          text: "What does the direction of a vector arrow represent?",
          options: ["The magnitude of the vector", "The direction of the quantity", "The unit of measurement", "The time duration"],
          correctAnswer: 1,
        }
      ]
    }
    else if (subject === "physics" && topicId === "vector-operations") {
      return [
        {
          id: 1,
          text: "What is the result of adding two vectors A and B if A = 3 units east and B = 4 units north?",
          options: ["5 units northeast", "7 units northeast", "5 units at 53° north of east", "7 units at 53° north of east"],
          correctAnswer: 2,
        },
        {
          id: 2,
          text: "When you multiply a vector by -2, what happens?",
          options: [
            "Its direction reverses and magnitude doubles",
            "Its direction stays same and magnitude halves",
            "Its direction reverses and magnitude halves",
            "Its direction stays same and magnitude doubles"
          ],
          correctAnswer: 0,
        }
      ]
    }
    else if (subject === "physics" && topicId === "kinematics") {
      return [
        {
          id: 1,
          text: "Which kinematic equation would you use to find final velocity when you know initial velocity, acceleration, and time?",
          options: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "All of the above"],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "What does the slope of a position-time graph represent?",
          options: ["Acceleration", "Velocity", "Displacement", "Force"],
          correctAnswer: 1,
        }
      ]
    }
    else if (subject === "physics" && topicId === "projectile-motion") {
      return [
        {
          id: 1,
          text: "At what angle should a projectile be launched to achieve maximum range (ignoring air resistance)?",
          options: ["30°", "45°", "60°", "90°"],
          correctAnswer: 1,
        },
        {
          id: 2,
          text: "What remains constant throughout a projectile's flight?",
          options: ["Vertical velocity", "Horizontal velocity", "Acceleration", "Both horizontal velocity and acceleration"],
          correctAnswer: 3,
        }
      ]
    }
    else if (subject === "physics" && topicId === "newtons-laws") {
      return [
        {
          id: 1,
          text: "Which law explains why passengers lurch forward when a car suddenly stops?",
          options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "If you double the net force on an object, what happens to its acceleration (assuming mass is constant)?",
          options: ["Halves", "Stays same", "Doubles", "Quadruples"],
          correctAnswer: 2,
        }
      ]
    }
    else if (subject === "physics" && topicId === "work-energy") {
      return [
        {
          id: 1,
          text: "When is work done on an object?",
          options: [
            "When force is applied",
            "When displacement occurs",
            "When force causes displacement",
            "When energy is transferred"
          ],
          correctAnswer: 2,
        },
        {
          id: 2,
          text: "What is the kinetic energy of a 2 kg object moving at 3 m/s?",
          options: ["3 J", "6 J", "9 J", "18 J"],
          correctAnswer: 2,
        }
      ]
    }
    else if (subject === "physics" && topicId === "friction") {
      return [
        {
          id: 1,
          text: "Which type of friction is generally greater for the same surfaces?",
          options: ["Static friction", "Kinetic friction", "Rolling friction", "They're all equal"],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "What happens to friction if you double the normal force?",
          options: ["Halves", "Stays same", "Doubles", "Quadruples"],
          correctAnswer: 2,
        }
      ]
    }
    else if (subject === "physics" && topicId === "newtons-laws") {
      return [
        {
          id: 1,
          text: "Which of Newton's laws states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force?",
          options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Newton's Law of Gravitation"],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "The equation F = ma represents which of Newton's laws?",
          options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Newton's Law of Gravitation"],
          correctAnswer: 1,
        },
        {
          id: 3,
          text: "For every action, there is an equal and opposite reaction. This statement represents:",
          options: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "The Law of Conservation of Energy",
          ],
          correctAnswer: 2,
        },
        {
          id: 4,
          text: "A book is at rest on a table. According to Newton's First Law, why doesn't the book move?",
          options: [
            "Because the book has no mass",
            "Because no forces are acting on the book",
            "Because the net force on the book is zero",
            "Because the book has too much inertia",
          ],
          correctAnswer: 2,
        },
        {
          id: 5,
          text: "If you push against a wall, the wall pushes back with equal force. This is an example of:",
          options: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "The Law of Conservation of Momentum",
          ],
          correctAnswer: 2,
        },
      ]
    } else if (subject === "chemistry" && topicId === "boyles-law") {
      return [
        {
          id: 1,
          text: "Boyle's Law describes the relationship between:",
          options: ["Pressure and temperature", "Volume and temperature", "Pressure and volume", "Mass and volume"],
          correctAnswer: 2,
        },
        {
          id: 2,
          text: "According to Boyle's Law, if the pressure of a gas increases, what happens to its volume (assuming temperature remains constant)?",
          options: ["Volume increases", "Volume decreases", "Volume remains the same", "Volume becomes zero"],
          correctAnswer: 1,
        },
        {
          id: 3,
          text: "The mathematical expression of Boyle's Law is:",
          options: ["P = kV", "P = k/V", "PV = k", "P/V = k"],
          correctAnswer: 2,
        },
        {
          id: 4,
          text: "If the volume of a gas is halved, what happens to its pressure according to Boyle's Law?",
          options: ["Pressure is halved", "Pressure is doubled", "Pressure remains the same", "Pressure becomes zero"],
          correctAnswer: 1,
        },
        {
          id: 5,
          text: "Boyle's Law applies under which condition?",
          options: ["Constant temperature", "Constant pressure", "Constant volume", "Constant mass and temperature"],
          correctAnswer: 0,
        },
      ]
    } else {
      // Default questions
      return [
        {
          id: 1,
          text: "Sample question 1?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "Sample question 2?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 1,
        },
        {
          id: 3,
          text: "Sample question 3?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 2,
        },
      ]
    }
  }

  const questions = getQuestions()

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index)
    }
  }

  const handleCheckAnswer = () => {
    if (selectedOption === null) return

    setIsAnswered(true)
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">
              {score}/{questions.length}
            </div>
            <p className="text-xl">
              {score === questions.length
                ? "Perfect score! Excellent work!"
                : score >= questions.length / 2
                  ? "Good job! You're on the right track."
                  : "Keep practicing to improve your understanding."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Quiz
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{questions[currentQuestion].text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption?.toString()} className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors ${
                  isAnswered && index === questions[currentQuestion].correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : isAnswered && index === selectedOption && index !== questions[currentQuestion].correctAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : selectedOption === index
                        ? "border-primary"
                        : ""
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {isAnswered && index === questions[currentQuestion].correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isAnswered && index === selectedOption && index !== questions[currentQuestion].correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isAnswered ? (
            <Button onClick={handleCheckAnswer} disabled={selectedOption === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
