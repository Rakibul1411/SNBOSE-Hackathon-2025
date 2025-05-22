"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, FileText, Play } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import ReactMarkdown from "react-markdown"

interface TopicListProps {
  subjectId: string
  chapterId: string
}

export default function TopicList({ subjectId, chapterId }: TopicListProps) {
  const { isAuthenticated } = useAuth()

  const getTopics = (subjectId: string, chapterId: string) => {
    if (subjectId === "physics") {
      switch (chapterId) {
        case "introduction to physics":
          return [
            {
              id: "what-is-physics",
              title: "What is Physics?",
              description: "Fundamental concepts and scope of physics",
              duration: "20 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "scientific-method",
              title: "Scientific Method",
              description: "Observation, hypothesis, experimentation, and theory",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "units-measurements",
              title: "Units and Measurements",
              description: "SI units, dimensional analysis, and measurement techniques",
              duration: "30 min",
              difficulty: "Beginner",
              completed: false,
            },
          ];

        case "vector":
          return [
            {
              id: "vector-basics",
              title: "Vector Basics",
              description: "Definition, representation, and properties of vectors",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "vector-operations",
              title: "Vector Operations",
              description: "Addition, subtraction, and multiplication of vectors",
              duration: "30 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "vector-components",
              title: "Vector Components",
              description: "Resolution of vectors into components and applications",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "motion":
          return [
            {
              id: "kinematics",
              title: "Kinematics",
              description: "Study of motion without considering its causes",
              duration: "25 min",
              difficulty: "Beginner",
              completed: true,
            },
            {
              id: "projectile-motion",
              title: "Projectile Motion",
              description: "Motion of objects projected into the air under gravity",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "relative-motion",
              title: "Relative Motion",
              description: "Motion observed from different reference frames",
              duration: "20 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "force":
          return [
            {
              id: "newtons-laws",
              title: "Newton's Laws of Motion",
              description: "Fundamental principles of force and motion",
              duration: "30 min",
              difficulty: "Beginner",
              completed: true,
            },
            {
              id: "friction",
              title: "Friction",
              description: "Types of friction and its effects on motion",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "spring-force",
              title: "Spring Force",
              description: "Hooke's law and elastic forces",
              duration: "20 min",
              difficulty: "Beginner",
              completed: false,
            },
          ];

        case "mechanics":
          return [
            {
              id: "kinematics",
              title: "Kinematics",
              description: "Study of motion without considering its causes",
              duration: "25 min",
              difficulty: "Beginner",
              completed: true,
            },
            {
              id: "newtons-laws",
              title: "Newton's Laws of Motion",
              description: "Fundamental principles of force and motion",
              duration: "30 min",
              difficulty: "Beginner",
              completed: true,
            },
            {
              id: "work-energy",
              title: "Work and Energy",
              description: "Relationship between work, energy, and power",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "energy":
          return [
            {
              id: "work-energy-theorem",
              title: "Work-Energy Theorem",
              description: "Connection between work done and kinetic energy",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "potential-energy",
              title: "Potential Energy",
              description: "Gravitational and elastic potential energy",
              duration: "25 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "energy-conservation",
              title: "Energy Conservation",
              description: "Law of conservation of mechanical energy",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "gravity":
          return [
            {
              id: "universal-gravitation",
              title: "Universal Gravitation",
              description: "Newton's law of gravitation and its applications",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "gravitational-field",
              title: "Gravitational Field",
              description: "Concept of gravitational field and field strength",
              duration: "25 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "orbital-motion",
              title: "Orbital Motion",
              description: "Satellites, Kepler's laws, and circular orbits",
              duration: "35 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        case "waves":
          return [
            {
              id: "wave-properties",
              title: "Wave Properties",
              description: "Amplitude, frequency, wavelength, and speed",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "sound-waves",
              title: "Sound Waves",
              description: "Nature of sound, Doppler effect, and standing waves",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "light-waves",
              title: "Light Waves",
              description: "Electromagnetic spectrum and wave-particle duality",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "ideal gas":
          return [
            {
              id: "gas-laws",
              title: "Gas Laws",
              description: "Boyle's, Charles's, and Avogadro's laws",
              duration: "30 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "kinetic-theory",
              title: "Kinetic Theory",
              description: "Molecular explanation of gas behavior",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "ideal-gas-equation",
              title: "Ideal Gas Equation",
              description: "PV = nRT and its applications",
              duration: "25 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "electricity":
          return [
            {
              id: "electric-charge",
              title: "Electric Charge",
              description: "Properties of charges and Coulomb's law",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "electric-field",
              title: "Electric Field",
              description: "Concept of electric field and field lines",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "electric-potential",
              title: "Electric Potential",
              description: "Voltage, potential difference, and equipotential surfaces",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
          ];

        case "magnetics":
          return [
            {
              id: "magnetic-field",
              title: "Magnetic Field",
              description: "Properties of magnets and magnetic fields",
              duration: "25 min",
              difficulty: "Beginner",
              completed: false,
            },
            {
              id: "electromagnetism",
              title: "Electromagnetism",
              description: "Current-carrying wires and magnetic forces",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "faradays-law",
              title: "Faraday's Law",
              description: "Electromagnetic induction and Lenz's law",
              duration: "35 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        case "relativity":
          return [
            {
              id: "special-relativity",
              title: "Special Relativity",
              description: "Time dilation, length contraction, and E=mc²",
              duration: "40 min",
              difficulty: "Advanced",
              completed: false,
            },
            {
              id: "general-relativity",
              title: "General Relativity",
              description: "Gravity as curvature of spacetime",
              duration: "45 min",
              difficulty: "Advanced",
              completed: false,
            },
            {
              id: "relativity-paradoxes",
              title: "Relativity Paradoxes",
              description: "Twin paradox and other thought experiments",
              duration: "35 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        case "quantum":
          return [
            {
              id: "quantum-basics",
              title: "Quantum Basics",
              description: "Wave-particle duality and the uncertainty principle",
              duration: "30 min",
              difficulty: "Advanced",
              completed: false,
            },
            {
              id: "schrodinger-equation",
              title: "Schrödinger Equation",
              description: "Fundamental equation of quantum mechanics",
              duration: "40 min",
              difficulty: "Advanced",
              completed: false,
            },
            {
              id: "quantum-applications",
              title: "Quantum Applications",
              description: "Lasers, semiconductors, and quantum computing",
              duration: "35 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        case "modern":
          return [
            {
              id: "atomic-models",
              title: "Atomic Models",
              description: "From Bohr to quantum mechanical models",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "nuclear-physics",
              title: "Nuclear Physics",
              description: "Radioactivity, fission, and fusion",
              duration: "35 min",
              difficulty: "Advanced",
              completed: false,
            },
            {
              id: "particle-physics",
              title: "Particle Physics",
              description: "Fundamental particles and the Standard Model",
              duration: "40 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        case "nuclear physics":
          return [
            {
              id: "nuclear-structure",
              title: "Nuclear Structure",
              description: "Protons, neutrons, and nuclear forces",
              duration: "30 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "radioactivity",
              title: "Radioactivity",
              description: "Alpha, beta, gamma decay, and half-life",
              duration: "35 min",
              difficulty: "Intermediate",
              completed: false,
            },
            {
              id: "nuclear-reactions",
              title: "Nuclear Reactions",
              description: "Fission, fusion, and energy release",
              duration: "40 min",
              difficulty: "Advanced",
              completed: false,
            },
          ];

        default:
          return [];
      }
    }
        if (subjectId === "medical science") {
          switch (chapterId) {
            case "human anatomy":
              return [
                {
                  id: "organ-systems",
                  title: "Major Organ Systems",
                  description: "Overview of circulatory, nervous, digestive systems",
                  duration: "40 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "skeletal-muscular",
                  title: "Skeletal & Muscular Systems",
                  description: "Bones, joints, and muscle types/function",
                  duration: "35 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "neuroanatomy",
                  title: "Basic Neuroanatomy",
                  description: "Brain structures and nervous system organization",
                  duration: "45 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "physiology":
              return [
                {
                  id: "homeostasis",
                  title: "Homeostasis",
                  description: "Maintaining internal balance in the body",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "cardio-physiology",
                  title: "Cardiovascular Physiology",
                  description: "Heart function and blood circulation",
                  duration: "40 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "respiratory-physio",
                  title: "Respiratory Physiology",
                  description: "Gas exchange and lung mechanics",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "pathology":
              return [
                {
                  id: "disease-mechanisms",
                  title: "Disease Mechanisms",
                  description: "How diseases develop and progress",
                  duration: "45 min",
                  difficulty: "Advanced",
                  completed: false,
                },
                {
                  id: "inflammation",
                  title: "Inflammation",
                  description: "Body's response to injury and infection",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "cancer-biology",
                  title: "Cancer Biology",
                  description: "Cellular basis of cancer development",
                  duration: "50 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "pharmacology":
              return [
                {
                  id: "drug-classes",
                  title: "Major Drug Classes",
                  description: "Antibiotics, analgesics, antihypertensives etc.",
                  duration: "40 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "pharmacokinetics",
                  title: "Pharmacokinetics",
                  description: "How drugs move through the body (ADME)",
                  duration: "45 min",
                  difficulty: "Advanced",
                  completed: false,
                },
                {
                  id: "drug-interactions",
                  title: "Drug Interactions",
                  description: "How medications affect each other",
                  duration: "35 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "medical diagnostics":
              return [
                {
                  id: "imaging-techniques",
                  title: "Medical Imaging",
                  description: "X-rays, CT, MRI, and ultrasound principles",
                  duration: "40 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "lab-tests",
                  title: "Laboratory Tests",
                  description: "Blood tests, urinalysis, and other common diagnostics",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "clinical-examination",
                  title: "Clinical Examination",
                  description: "Physical exam techniques and vital signs",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: false,
                }
              ];

            default:
              return [];
          }
        }
        if (subjectId === "astronomy") {
          switch (chapterId) {
            case "solar system":
              return [
                {
                  id: "planets-overview",
                  title: "Planetary Overview",
                  description: "Characteristics of all planets in our solar system",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "earth-moon-system",
                  title: "Earth-Moon System",
                  description: "Lunar phases, tides, and orbital mechanics",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "small-bodies",
                  title: "Small Solar System Bodies",
                  description: "Asteroids, comets, and Kuiper belt objects",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "stars and galaxies":
              return [
                {
                  id: "stellar-evolution",
                  title: "Stellar Evolution",
                  description: "Life cycles of stars from birth to death",
                  duration: "40 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "galaxy-types",
                  title: "Galaxy Classification",
                  description: "Spiral, elliptical, and irregular galaxies",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "milky-way",
                  title: "Milky Way Structure",
                  description: "Our home galaxy's composition and features",
                  duration: "35 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "cosmology":
              return [
                {
                  id: "big-bang",
                  title: "Big Bang Theory",
                  description: "Origin and expansion of the universe",
                  duration: "45 min",
                  difficulty: "Advanced",
                  completed: false,
                },
                {
                  id: "dark-matter-energy",
                  title: "Dark Matter & Energy",
                  description: "Invisible components shaping the universe",
                  duration: "40 min",
                  difficulty: "Advanced",
                  completed: false,
                },
                {
                  id: "cosmic-microwave",
                  title: "Cosmic Microwave Background",
                  description: "Afterglow radiation from the early universe",
                  duration: "35 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "space exploration":
              return [
                {
                  id: "space-missions",
                  title: "Historic Space Missions",
                  description: "Apollo, Voyager, Hubble, and other key missions",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "telescopes",
                  title: "Space Telescopes",
                  description: "Hubble, James Webb, and their discoveries",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "future-exploration",
                  title: "Future of Space Travel",
                  description: "Mars colonization, interstellar probes, and new technologies",
                  duration: "40 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "observational astronomy":
              return [
                {
                  id: "telescope-types",
                  title: "Telescope Types",
                  description: "Refractors, reflectors, and radio telescopes",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "star-hopping",
                  title: "Star Hopping",
                  description: "Navigation techniques for amateur astronomers",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "astrophotography",
                  title: "Astrophotography",
                  description: "Techniques for capturing celestial objects",
                  duration: "45 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            default:
              return [];
          }
        }

        if (subjectId === "chemistry") {
          switch (chapterId) {
            case "introduction to chemistry":
              return [
                {
                  id: "matter-classification",
                  title: "Classification of Matter",
                  description: "Elements, compounds, mixtures and their properties",
                  duration: "20 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "physical-chemical-changes",
                  title: "Physical vs Chemical Changes",
                  description: "Understanding differences between physical and chemical transformations",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "scientific-measurement",
                  title: "Scientific Measurement",
                  description: "Units, significant figures, and dimensional analysis",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "atomic":
              return [
                {
                  id: "atomic-models",
                  title: "Atomic Models",
                  description: "Evolution from Dalton to quantum mechanical model",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "subatomic-particles",
                  title: "Subatomic Particles",
                  description: "Protons, neutrons, electrons and their properties",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "electron-configuration",
                  title: "Electron Configuration",
                  description: "Arrangement of electrons in atoms and orbitals",
                  duration: "35 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "bonding":
              return [
                {
                  id: "ionic-bonding",
                  title: "Ionic Bonding",
                  description: "Electron transfer and ionic compound formation",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "covalent-bonding",
                  title: "Covalent Bonding",
                  description: "Electron sharing and molecular compounds",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "lewis-structures",
                  title: "Lewis Structures",
                  description: "Drawing electron dot diagrams for molecules",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "reaction":
              return [
                {
                  id: "reaction-types",
                  title: "Types of Reactions",
                  description: "Synthesis, decomposition, displacement, combustion",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "balancing-equations",
                  title: "Balancing Equations",
                  description: "Techniques for balancing chemical equations",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "stoichiometry",
                  title: "Stoichiometry",
                  description: "Calculating quantities in chemical reactions",
                  duration: "40 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "periodic table":
              return [
                {
                  id: "periodic-trends",
                  title: "Periodic Trends",
                  description: "Atomic radius, ionization energy, electronegativity patterns",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: true,
                },
                {
                  id: "groups-families",
                  title: "Groups and Families",
                  description: "Properties of alkali metals, halogens, noble gases etc.",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "periodic-law",
                  title: "Periodic Law",
                  description: "Organization of elements based on atomic number",
                  duration: "20 min",
                  difficulty: "Beginner",
                  completed: false,
                }
              ];

            case "gases":
              return [
                {
                  id: "gas-properties",
                  title: "Properties of Gases",
                  description: "Basic characteristics and behavior of gases",
                  duration: "20 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "boyles-law",
                  title: "Boyle's Law",
                  description: "Pressure-volume relationship at constant temperature",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "charles-law",
                  title: "Charles's Law",
                  description: "Volume-temperature relationship at constant pressure",
                  duration: "25 min",
                  difficulty: "Intermediate",
                  completed: false,
                }
              ];

            case "organic":
              return [
                {
                  id: "hydrocarbons",
                  title: "Hydrocarbons",
                  description: "Alkanes, alkenes, alkynes and their properties",
                  duration: "30 min",
                  difficulty: "Beginner",
                  completed: true,
                },
                {
                  id: "functional-groups",
                  title: "Functional Groups",
                  description: "Alcohols, carboxylic acids, esters and their characteristics",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "isomerism",
                  title: "Isomerism",
                  description: "Structural and stereoisomers in organic compounds",
                  duration: "40 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "acid-base":
              return [
                {
                  id: "acid-base-theories",
                  title: "Acid-Base Theories",
                  description: "Arrhenius, Brønsted-Lowry, and Lewis definitions",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: true,
                },
                {
                  id: "ph-scale",
                  title: "pH Scale",
                  description: "Measuring acidity and alkalinity",
                  duration: "25 min",
                  difficulty: "Beginner",
                  completed: false,
                },
                {
                  id: "buffers",
                  title: "Buffers",
                  description: "Solutions that resist pH changes",
                  duration: "35 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "chemical energy":
              return [
                {
                  id: "thermochemistry",
                  title: "Thermochemistry",
                  description: "Heat changes in chemical reactions",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: true,
                },
                {
                  id: "enthalpy",
                  title: "Enthalpy",
                  description: "Heat content of chemical systems",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "hess-law",
                  title: "Hess's Law",
                  description: "Calculating enthalpy changes in reactions",
                  duration: "40 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            case "industrial chemistry":
              return [
                {
                  id: "chemical-processes",
                  title: "Chemical Processes",
                  description: "Haber process, Contact process, and other industrial methods",
                  duration: "35 min",
                  difficulty: "Intermediate",
                  completed: true,
                },
                {
                  id: "green-chemistry",
                  title: "Green Chemistry",
                  description: "Environmentally sustainable chemical production",
                  duration: "30 min",
                  difficulty: "Intermediate",
                  completed: false,
                },
                {
                  id: "polymers",
                  title: "Polymers",
                  description: "Synthetic and natural macromolecules",
                  duration: "40 min",
                  difficulty: "Advanced",
                  completed: false,
                }
              ];

            default:
              return [];
          }

          
}

    // Default fallback for demo purposes
    return [
      {
        id: "topic-1",
        title: "Introduction",
        description: "Basic concepts and principles",
        duration: "20 min",
        difficulty: "Beginner",
        completed: false,
      },
      {
        id: "topic-2",
        title: "Core Principles",
        description: "Fundamental theories and applications",
        duration: "30 min",
        difficulty: "Intermediate",
        completed: false,
      },
      {
        id: "topic-3",
        title: "Advanced Concepts",
        description: "Complex ideas and practical applications",
        duration: "40 min",
        difficulty: "Advanced",
        completed: false,
      },
    ]
  }

  const topics = getTopics(subjectId, chapterId)

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={`transition-all hover:shadow-md ${topic.completed ? "border-green-200 dark:border-green-900" : ""}`}
          >
            <div className="flex flex-col md:flex-row">
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {topic.completed && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 md:pt-0 flex items-center">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {topic.duration}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {topic.difficulty}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end items-center">
                <Button asChild variant={topic.completed ? "outline" : "default"} className="w-full md:w-auto">
                  <Link href={`/visualearn/${subjectId}/${chapterId}/topics/${topic.id}`}>
                    {topic.completed ? (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Review
                      </>
                    ) : (
                      <>
                        Start
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
