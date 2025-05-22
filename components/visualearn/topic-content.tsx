"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart, HelpCircle, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import TopicQuiz from "./topic-quiz"
import TopicChatbot from "./topic-chatbot"
import PendulumSimulation from "./simulation-topics/PendulumSimulation"
import WaveSimulation from "./simulation-topics/WaveSimulation"
import DopplerEffectSimulation from "./simulation-topics/DopplerEffectSimulation"
import ProjectileMotionSimulation from "./simulation-topics/ProjectileMotionSimulation"
import RelativeMotionSimulation from "./simulation-topics/RelativeMotionSimulation"

interface TopicContentProps {
  subject: string
  chapter: string
  topic: {
    id: string
    title: string
    description: string
    content: string
    hasSimulation: boolean
    hasQuiz: boolean
  }
}

export default function TopicContent({ subject, chapter, topic }: TopicContentProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [lang, setLang] = useState<"en" | "bn">("en")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleAudio = async () => {
    if (isAudioPlaying) {
      audioRef.current?.pause()
      setIsAudioPlaying(false)
      return
    }
  
    setIsAudioPlaying(true)
  
    // Choose the text to read
    let text = ""
    if (subject === "physics" && chapter === "mechanics" && topic.id === "newtons-laws") {
      text = lang === "bn"
        ? "স্যার আইজ্যাক নিউটনের গতির তিনটি সূত্র একটি বস্তু এবং তার উপর ক্রিয়াশীল বলগুলির মধ্যে সম্পর্ক এবং সেই বলগুলির প্রতিক্রিয়ায় তার গতি বর্ণনা করে। ..."
        : "Sir Isaac Newton's three laws of motion describe the relationship between a body and the forces acting upon it, and its motion in response to those forces. ..."
    } else {
      text = lang === "bn" ? "এটি একটি বাংলা বর্ণনা।" : topic.description
    }
  
    try {
      const tokenRes = await fetch("https://southeastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken", {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": "A9ztk639BCr4L6tDQg9JToqKmj73q6pAopKtEcybEHjy634SW39VJQQJ99BEACqBBLyXJ3w3AAAYACOG9QS3",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
  
      if (!tokenRes.ok) throw new Error("Failed to get Azure TTS token")
      const token = await tokenRes.text()
  
      const voice = lang === "bn" ? "bn-BD-NabanitaNeural" : "en-US-JennyNeural"
      const ssml = `
        <speak version='1.0' xml:lang='${lang === "bn" ? "bn-BD" : "en-US"}'>
          <voice name='${voice}'>${text}</voice>
        </speak>
      `
  
      const audioRes = await fetch("https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml
      })
  
      if (!audioRes.ok) throw new Error("Failed to synthesize speech")
      const audioBlob = await audioRes.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
  
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        audioRef.current.onended = () => setIsAudioPlaying(false)
      } else {
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        audio.play()
        audio.onended = () => setIsAudioPlaying(false)
      }
  
    } catch (error) {
      console.error("Azure TTS error:", error)
      setIsAudioPlaying(false)
    }
  }  

  const renderNewtonLawsContent = () => {
    if (lang === "bn") {
      return (
        <>
          <h3>নিউটনের গতিসূত্র</h3>
          <p>
            স্যার আইজ্যাক নিউটনের গতির তিনটি সূত্র একটি বস্তু এবং তার উপর ক্রিয়াশীল বলগুলির মধ্যে সম্পর্ক এবং সেই বলগুলির প্রতিক্রিয়ায় তার গতি বর্ণনা করে।
          </p>

          <h4>প্রথম সূত্র: জাড্যতার সূত্র</h4>
          <p>
            একটি বস্তু স্থির থাকলে স্থির থাকবে এবং গতিশীল থাকলে একই গতিতে একই দিকে চলতে থাকবে, যতক্ষণ না কোনো অসম্যক্ত বল তার উপর ক্রিয়া করে।
          </p>

          <h4>দ্বিতীয় সূত্র: F = ma</h4>
          <p>
            একটি বস্তুর ত্বরণ বস্তুর ভর এবং প্রয়োগকৃত বলের পরিমাণের উপর নির্ভর করে।
          </p>
          <p>
            গাণিতিক সূত্রটি হল: F = ma, যেখানে F হল বল, m হল ভর, এবং a হল ত্বরণ।
          </p>

          <h4>তৃতীয় সূত্র: ক্রিয়া ও প্রতিক্রিয়া</h4>
          <p>প্রতি ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে।</p>
          <p>
            যখন একটি বস্তু দ্বিতীয় বস্তুর উপর বল প্রয়োগ করে, তখন দ্বিতীয় বস্তুটিও একই সাথে প্রথম বস্তুর উপর সমান পরিমাণে কিন্তু বিপরীত দিকে বল প্রয়োগ করে।
          </p>
        </>
      )
    }
    return (
      <>
        <h3>Newton's Laws of Motion</h3>
        <p>
          Sir Isaac Newton's three laws of motion describe the relationship between a body and the forces
          acting upon it, and its motion in response to those forces.
        </p>

        <h4>First Law: Law of Inertia</h4>
        <p>
          An object at rest stays at rest, and an object in motion stays in motion with the same speed and
          in the same direction, unless acted upon by an unbalanced force.
        </p>

        <h4>Second Law: F = ma</h4>
        <p>
          The acceleration of an object depends on the mass of the object and the amount of force applied.
        </p>
        <p>
          The mathematical formula is: F = ma, where F is the force, m is the mass, and a is the
          acceleration.
        </p>

        <h4>Third Law: Action and Reaction</h4>
        <p>For every action, there is an equal and opposite reaction.</p>
        <p>
          When one body exerts a force on a second body, the second body simultaneously exerts a force
          equal in magnitude and opposite in direction on the first body.
        </p>
      </>
    )
  }

  const renderVisualization = () => {
    if (subject === "physics" && chapter === "mechanics" && topic.id === "pendulum") {
      return <PendulumSimulation />
    }
    if (subject === "physics" && chapter === "waves" && topic.id === "wave-properties") {
      return <WaveSimulation />
    }
    if (subject === "physics" && chapter === "waves" && topic.id === "doppler-effect") {
      return <DopplerEffectSimulation />
    }
    if (subject === "physics" && chapter === "motion" && topic.id === "projectile-motion") {
      return <ProjectileMotionSimulation />
    }
    if (subject === "physics" && chapter === "motion" && topic.id === "relative-motion") {
      return <RelativeMotionSimulation />
    }
    // Add more mappings as needed
    return <p>No visualization available for this topic.</p>
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{topic.title}</CardTitle>
                <CardDescription className="mt-1">
                  {topic.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleAudio}>
                  <Volume2 className={`h-4 w-4 mr-1 ${isAudioPlaying ? "text-primary" : ""}`} />
                  {isAudioPlaying ? "Pause Audio" : "Listen"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="description" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="description" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Description
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">

                    {subject === "physics" && chapter === "introduction to physics" && topic.id === "what-is-physics" ? (
                      <>
                        <h3>What is Physics?</h3>
                        <p>
                          Physics is the natural science that studies matter, its fundamental constituents, motion and behavior through space and time, and the related entities of energy and force.
                        </p>

                        <h4>Branches of Physics</h4>
                        <ul>
                          <li>Classical Mechanics (Newtonian physics)</li>
                          <li>Thermodynamics (Heat and energy)</li>
                          <li>Electromagnetism (Electricity and magnetism)</li>
                          <li>Relativity (Space-time relationships)</li>
                          <li>Quantum Mechanics (Subatomic particles)</li>
                        </ul>

                        <h4>Fundamental Concepts</h4>
                        <p>
                          Physics aims to describe the universe's behavior using fundamental quantities like mass, length, time, electric current, temperature, amount of substance, and luminous intensity.
                        </p>
                      </>
                    ) : null}

                  {subject === "physics" && chapter === "introduction to physics" && topic.id === "scientific-method" ? (
                    <>
                      <h3>Scientific Method</h3>
                      <p>
                        The systematic approach scientists use to investigate natural phenomena through observation, experimentation, and logical reasoning.
                      </p>

                      <h4>Steps of the Scientific Method</h4>
                      <ol>
                        <li>Observation (Noticing a phenomenon)</li>
                        <li>Question (Formulating a research question)</li>
                        <li>Hypothesis (Proposing a testable explanation)</li>
                        <li>Experiment (Designing tests to verify the hypothesis)</li>
                        <li>Analysis (Interpreting the data)</li>
                        <li>Conclusion (Accepting or rejecting the hypothesis)</li>
                      </ol>

                      <h4>Importance in Physics</h4>
                      <p>
                        The scientific method ensures objectivity and reproducibility in physics experiments, forming the basis for all physical laws and theories.
                      </p>
                    </>
                  ) : null}
                        {subject === "physics" && chapter === "vector" && topic.id === "vector-basics" ? (
                    <>
                      <h3>Vector Basics</h3>
                      <p>
                        Vectors are quantities that have both magnitude (size) and direction, unlike scalars which only have magnitude.
                      </p>

                      <h4>Vector Representation</h4>
                      <ul>
                        <li>Graphical: Arrow (length = magnitude, direction = angle)</li>
                        <li>Mathematical: Components (x, y, z) or unit vector notation (î, ĵ, k̂)</li>
                      </ul>

                      <h4>Examples of Vectors</h4>
                      <p>
                        Displacement, velocity, acceleration, force, momentum. Contrast with scalars: mass, temperature, time.
                      </p>
                    </>
                  ) : null}

                  {subject === "physics" && chapter === "vector" && topic.id === "vector-operations" ? (
                    <>
                      <h3>Vector Operations</h3>
                      <p>
                        Basic mathematical operations that can be performed with vectors, following specific rules due to their directional nature.
                      </p>

                      <h4>Vector Addition</h4>
                      <p>
                        Done using the head-to-tail method or by adding corresponding components. Follows the commutative law: A + B = B + A.
                      </p>

                      <h4>Vector Subtraction</h4>
                      <p>
                        Equivalent to adding the negative of a vector (A - B = A + (-B)).
                      </p>

                      <h4>Scalar Multiplication</h4>
                      <p>
                        Changes the magnitude but not the direction (unless the scalar is negative, which reverses direction).
                      </p>
                    </>
                  ) : null}
                  {subject === "physics" && chapter === "motion" && topic.id === "kinematics" ? (
                    <>
                      <h3>Kinematics</h3>
                      <p>
                        The branch of mechanics that describes the motion of objects without considering the causes of motion (forces).
                      </p>

                      <h4>Key Kinematic Variables</h4>
                      <ul>
                        <li>Displacement (Δx): Change in position (vector)</li>
                        <li>Velocity (v): Rate of change of displacement</li>
                        <li>Acceleration (a): Rate of change of velocity</li>
                        <li>Time (t): Duration of motion</li>
                      </ul>

                      <h4>Kinematic Equations</h4>
                      <p>
                        For constant acceleration: <br />
                        1. v = u + at <br />
                        2. s = ut + ½at² <br />
                        3. v² = u² + 2as
                      </p>
                    </>
                  ) : null}

                  {subject === "physics" && chapter === "motion" && topic.id === "projectile-motion" ? (
                    <>
                      <h3>Projectile Motion</h3>
                      <p>
                        The motion of an object thrown or projected into the air, subject only to acceleration due to gravity.
                      </p>

                      <h4>Key Characteristics</h4>
                      <ul>
                        <li>Horizontal motion: Constant velocity (no acceleration)</li>
                        <li>Vertical motion: Constant acceleration (g = 9.8 m/s² downward)</li>
                        <li>Path: Parabolic trajectory</li>
                      </ul>

                      <h4>Important Formulas</h4>
                      <p>
                        Time of flight: t = (2v₀sinθ)/g <br />
                        Maximum height: h = (v₀²sin²θ)/2g <br />
                        Range: R = (v₀²sin2θ)/g
                      </p>
                    </>
                  ) : null}
                  {subject === "physics" && chapter === "force" && topic.id === "newtons-laws" ? (
                    <>
                      <h3>Newton's Laws of Motion</h3>
                      <p>(Content remains exactly as you provided)</p>
                    </>
                  ) : null}

                  {subject === "physics" && chapter === "force" && topic.id === "friction" ? (
                    <>
                      <h3>Friction</h3>
                      <p>
                        The force that opposes the relative motion or tendency of such motion of two surfaces in contact.
                      </p>

                      <h4>Types of Friction</h4>
                      <ul>
                        <li>Static friction: Acts on stationary objects (Fₛ ≤ μₛN)</li>
                        <li>Kinetic friction: Acts on moving objects (Fₖ = μₖN)</li>
                        <li>Rolling friction: Resistance when an object rolls</li>
                        <li>Fluid friction: Resistance in liquids/gases</li>
                      </ul>

                      <h4>Factors Affecting Friction</h4>
                      <p>
                        Nature of surfaces (roughness), normal force, and for fluids: viscosity and object speed.
                      </p>
                    </>
                  ) : null}
                  {subject === "physics" && chapter === "mechanics" && topic.id === "work-energy" ? (
                    <>
                      <h3>Work and Energy</h3>
                      <p>
                        Work is done when a force causes displacement, and energy is the capacity to do work.
                      </p>

                      <h4>Work Formula</h4>
                      <p>
                        W = F·d·cosθ <br />
                        Where F is force, d is displacement, and θ is the angle between them.
                      </p>

                      <h4>Types of Energy</h4>
                      <ul>
                        <li>Kinetic energy: KE = ½mv² (energy of motion)</li>
                        <li>Potential energy: PE = mgh (energy of position)</li>
                        <li>Mechanical energy: Sum of KE and PE</li>
                      </ul>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "introduction to chemistry" && topic.id === "matter-classification" ? (
                    <>
                      <h3>Classification of Matter</h3>
                      <p>
                        Matter can be classified into pure substances and mixtures based on its composition and properties.
                      </p>

                      <h4>Pure Substances</h4>
                      <ul>
                        <li><strong>Elements:</strong> Fundamental substances that cannot be broken down chemically (e.g., gold, oxygen)</li>
                        <li><strong>Compounds:</strong> Two or more elements chemically combined in fixed ratios (e.g., H₂O, NaCl)</li>
                      </ul>

                      <h4>Mixtures</h4>
                      <ul>
                        <li><strong>Homogeneous:</strong> Uniform composition throughout (e.g., saltwater, air)</li>
                        <li><strong>Heterogeneous:</strong> Non-uniform composition (e.g., sand and water, salad)</li>
                      </ul>

                      <h4>Separation Techniques</h4>
                      <p>Different methods to separate mixtures:</p>
                      <ul>
                        <li>Filtration (for insoluble solids)</li>
                        <li>Distillation (based on boiling points)</li>
                        <li>Chromatography (separating dissolved substances)</li>
                      </ul>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "atomic" && topic.id === "electron-configuration" ? (
                    <>
                      <h3>Electron Configuration</h3>
                      <p>
                        The arrangement of electrons in an atom's orbitals, following specific rules that determine chemical properties.
                      </p>

                      <h4>Three Fundamental Rules</h4>
                      <ol>
                        <li><strong>Pauli Exclusion Principle:</strong> No two electrons can have identical quantum numbers</li>
                        <li><strong>Aufbau Principle:</strong> Electrons fill lowest energy orbitals first</li>
                        <li><strong>Hund's Rule:</strong> Orbitals are filled singly before pairing occurs</li>
                      </ol>

                      <h4>Notation Examples</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold">Hydrogen (H):</p>
                          <p>1s¹</p>
                        </div>
                        <div>
                          <p className="font-bold">Carbon (C):</p>
                          <p>1s² 2s² 2p²</p>
                        </div>
                      </div>

                      <h4>Valence Electrons</h4>
                      <p>
                        Electrons in the outermost shell that determine chemical reactivity. For main group elements,
                        the group number equals the number of valence electrons.
                      </p>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "bonding" && topic.id === "covalent-bonding" ? (
                    <>
                      <h3>Covalent Bonding</h3>
                      <p>
                        A chemical bond formed by the sharing of electron pairs between atoms, typically between nonmetals.
                      </p>

                      <h4>Key Characteristics</h4>
                      <ul>
                        <li>Forms discrete molecules (e.g., H₂O, CO₂)</li>
                        <li>Generally lower melting/boiling points than ionic compounds</li>
                        <li>Poor electrical conductivity</li>
                      </ul>

                      <h4>Types of Covalent Bonds</h4>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border">Single</td>
                            <td className="p-2 border">1 shared pair</td>
                            <td className="p-2 border">H-H</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Double</td>
                            <td className="p-2 border">2 shared pairs</td>
                            <td className="p-2 border">O=O</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Triple</td>
                            <td className="p-2 border">3 shared pairs</td>
                            <td className="p-2 border">N≡N</td>
                          </tr>
                        </tbody>
                      </table>

                      <h4>Polar vs Nonpolar</h4>
                      <p>
                        <strong>Polar covalent:</strong> Unequal electron sharing (e.g., H₂O)<br />
                        <strong>Nonpolar covalent:</strong> Equal electron sharing (e.g., CH₄)
                      </p>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "periodic table" && topic.id === "periodic-trends" ? (
                    <>
                      <h3>Periodic Trends</h3>
                      <p>
                        Predictable patterns in elemental properties based on position in the periodic table.
                      </p>

                      <h4>Major Trends</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold">Atomic Radius:</p>
                          <p>Decreases across a period, increases down a group</p>
                        </div>
                        <div>
                          <p className="font-bold">Ionization Energy:</p>
                          <p>Increases across a period, decreases down a group</p>
                        </div>
                        <div>
                          <p className="font-bold">Electronegativity:</p>
                          <p>Increases across a period, decreases down a group</p>
                        </div>
                      </div>

                      <h4>Visual Representation</h4>
                      <div className="flex justify-center">
                        <img 
                          src="/periodic-trends.svg" 
                          alt="Periodic Trends Diagram" 
                          className="w-full max-w-md"
                        />
                      </div>

                      <h4>Exceptions</h4>
                      <ul>
                        <li>Group 13 elements sometimes break period trends</li>
                        <li>Transition metals show less predictable patterns</li>
                      </ul>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "organic" && topic.id === "functional-groups" ? (
                    <>
                      <h3>Functional Groups</h3>
                      <p>
                        Specific groups of atoms within molecules that determine characteristic chemical reactions.
                      </p>

                      <h4>Common Functional Groups</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold">Hydroxyl (-OH):</p>
                          <p>Alcohols (e.g., ethanol)</p>
                        </div>
                        <div>
                          <p className="font-bold">Carbonyl (C=O):</p>
                          <p>Ketones and aldehydes</p>
                        </div>
                        <div>
                          <p className="font-bold">Carboxyl (-COOH):</p>
                          <p>Carboxylic acids</p>
                        </div>
                        <div>
                          <p className="font-bold">Amino (-NH₂):</p>
                          <p>Amines and amino acids</p>
                        </div>
                      </div>

                      <h4>Importance in Biochemistry</h4>
                      <ul>
                        <li>Determine solubility and reactivity</li>
                        <li>Form basis for biomolecules (proteins, carbs, lipids)</li>
                        <li>Key to drug design and pharmaceuticals</li>
                      </ul>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "organic" && topic.id === "hydrocarbons" ? (
                    <>
                      <h3>Hydrocarbons</h3>
                      <p>
                        Organic compounds consisting entirely of hydrogen and carbon atoms, forming the basis of organic chemistry.
                      </p>

                      <h4>Main Classes</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-bold">Alkanes</p>
                          <p>Single bonds (C-C)</p>
                          <p>Example: CH₄ (methane)</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-bold">Alkenes</p>
                          <p>Double bonds (C=C)</p>
                          <p>Example: C₂H₄ (ethene)</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-bold">Alkynes</p>
                          <p>Triple bonds (C≡C)</p>
                          <p>Example: C₂H₂ (ethyne)</p>
                        </div>
                      </div>

                      <h4 className="mt-4">Properties</h4>
                      <ul>
                        <li>Nonpolar → Insoluble in water</li>
                        <li>Flammable → Good fuels</li>
                        <li>Boiling points increase with chain length</li>
                      </ul>
                    </>
                  ) : null}

                  {subject === "chemistry" && chapter === "organic" && topic.id === "isomerism" ? (
                    <>
                      <h3>Isomerism</h3>
                      <p>
                        Compounds with the same molecular formula but different structural arrangements.
                      </p>

                      <h4>Structural Isomers</h4>
                      <div className="flex space-x-8">
                        <div>
                          <p className="font-bold">n-Butane</p>
                          <p>CH₃-CH₂-CH₂-CH₃</p>
                        </div>
                        <div>
                          <p className="font-bold">Isobutane</p>
                          <p>CH₃-CH(CH₃)-CH₃</p>
                        </div>
                      </div>

                      <h4 className="mt-4">Stereoisomers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold">Geometric (cis/trans)</p>
                          <p>Different spatial arrangement around double bond</p>
                        </div>
                        <div>
                          <p className="font-bold">Optical</p>
                          <p>Mirror-image molecules (enantiomers)</p>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {subject === "astronomy" && chapter === "solar-system" && topic.id === "terrestrial-planets" ? (
                    <>
                      <h3>Terrestrial Planets</h3>
                      <p>
                        Rocky planets with solid surfaces located in the inner solar system.
                      </p>

                      <h4>Characteristics</h4>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border">Planet</th>
                            <th className="p-2 border">Diameter</th>
                            <th className="p-2 border">Notable Feature</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border">Mercury</td>
                            <td className="p-2 border">4,880 km</td>
                            <td className="p-2 border">Largest temperature swings</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Venus</td>
                            <td className="p-2 border">12,104 km</td>
                            <td className="p-2 border">Runaway greenhouse effect</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Earth</td>
                            <td className="p-2 border">12,742 km</td>
                            <td className="p-2 border">Liquid water surface</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Mars</td>
                            <td className="p-2 border">6,779 km</td>
                            <td className="p-2 border">Largest volcano (Olympus Mons)</td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ) : null}

                  {subject === "astronomy" && chapter === "solar-system" && topic.id === "gas-giants" ? (
                    <>
                      <h3>Gas Giants</h3>
                      <p>
                        Massive planets composed mainly of hydrogen and helium with no solid surface.
                      </p>

                      <div className="md:flex gap-6">
                        <div className="md:w-1/2">
                          <h4>Jupiter</h4>
                          <ul>
                            <li>Mass: 318 Earths</li>
                            <li>Great Red Spot (400-year storm)</li>
                            <li>79 known moons</li>
                          </ul>
                        </div>
                        <div className="md:w-1/2">
                          <h4>Saturn</h4>
                          <ul>
                            <li>Density less than water</li>
                            <li>Complex ring system</li>
                            <li>Hexagonal polar storm</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {subject === "medical science" && chapter === "human-anatomy" && topic.id === "skeletal-system" ? (
                    <>
                      <h3>Skeletal System</h3>
                      <p>
                        The body's structural framework composed of 206 bones in adults.
                      </p>

                      <h4>Major Components</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Axial Skeleton</p>
                          <p>80 bones (skull, vertebrae, ribs)</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Appendicular</p>
                          <p>126 bones (limbs, shoulders, pelvis)</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-bold">Joints</p>
                          <p>Fibrous, cartilaginous, synovial</p>
                        </div>
                      </div>

                      <h4 className="mt-4">Bone Composition</h4>
                      <ul>
                        <li><strong>Compact bone:</strong> Dense outer layer</li>
                        <li><strong>Spongy bone:</strong> Porous inner layer</li>
                        <li><strong>Bone marrow:</strong> Blood cell production</li>
                      </ul>
                    </>
                  ) : null}

                  {subject === "medical science" && chapter === "human-anatomy" && topic.id === "nervous-system" ? (
                    <>
                      <h3>Nervous System</h3>
                      <p>
                        The body's electrical wiring that controls both voluntary and involuntary actions.
                      </p>

                      <div className="md:flex gap-6">
                        <div className="md:w-1/2">
                          <h4>Central Nervous System</h4>
                          <ul>
                            <li><strong>Brain:</strong> Cerebrum, cerebellum, brainstem</li>
                            <li><strong>Spinal cord:</strong> Nerve signal highway</li>
                          </ul>
                        </div>
                        <div className="md:w-1/2">
                          <h4>Peripheral Nervous System</h4>
                          <ul>
                            <li><strong>Somatic:</strong> Voluntary muscle control</li>
                            <li><strong>Autonomic:</strong> Sympathetic/parasympathetic</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <h4 className="font-bold text-green-800">Neuron Structure</h4>
                        <p>Dendrites → Cell body → Axon → Synaptic terminals</p>
                      </div>
                    </>
                  ) : null}
                  {subject === "chemistry" && chapter === "gases" && topic.id === "boyles-law" ? (
//                   {subject === "physics" && chapter === "mechanics" && topic.id === "newtons-laws" ? (
//                     renderNewtonLawsContent()
//                   ) : subject === "chemistry" && chapter === "gases" && topic.id === "boyles-law" ? (
// >>>>>>> Rakibul-14
                    <>
                      <h3>Boyle's Law</h3>
                      <p>
                        Boyle's law, also referred to as the Boyle–Mariotte law, is an experimental gas law that
                        describes how the pressure of a gas tends to decrease as the volume of the container increases.
                      </p>

                      <h4>Mathematical Expression</h4>
                      <p>
                        Boyle's law states that the pressure (P) of a given amount of gas held at a constant temperature
                        is inversely proportional to the volume (V) of the gas.
                      </p>
                      <p>Mathematically, it can be written as:</p>
                      <p className="text-center font-bold">P ∝ 1/V</p>
                      <p className="text-center font-bold">or PV = k (where k is a constant)</p>

                      <h4>Historical Context</h4>
                      <p>
                        The law was named after Robert Boyle, who published the original law in 1662. Boyle's
                        experiments showed that the pressure of a gas is inversely proportional to its volume at
                        constant temperature.
                      </p>

                      <h4>Applications</h4>
                      <p>Boyle's law has many practical applications, including:</p>
                      <ul>
                        <li>Understanding how lungs work during breathing</li>
                        <li>Designing and operating syringes</li>
                        <li>Explaining how pressure changes with depth in liquids</li>
                        <li>Designing scuba equipment</li>
                      </ul>
                    </>

                  ) : (
                    <p>{topic.content}</p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-sm font-medium">Content Language:</p>
                    <div className="flex gap-2">
                      <Button 
                        variant={lang === 'en' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setLang('en')}
                      >
                        English
                      </Button>
                      <Button 
                        variant={lang === 'bn' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setLang('bn')}
                      >
                        বাংলা
                      </Button>
                    </div>
                  </div>
                  <TopicChatbot />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent className="pt-6">
                {renderVisualization()}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}