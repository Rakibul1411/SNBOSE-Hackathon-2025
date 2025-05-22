# Physics Simulation Components

This folder contains interactive physics simulation components that can be used in the VisualEarn platform to help students understand complex physics concepts through visual demonstrations.

## Available Simulations

1. **Pendulum Simulation** (`PendulumSimulation.tsx`)
   - Simple Harmonic Motion demonstration
   - Adjustable parameters: Initial Angle, Length, Gravity, Damping
   - Energy visualization (Kinetic + Potential)

2. **Wave Simulation** (`WaveSimulation.tsx`)
   - Demonstrates wave properties
   - Adjustable parameters: Amplitude, Frequency, Wave Speed, Damping Factor

3. **Doppler Effect Simulation** (`DopplerEffectSimulation.tsx`)
   - Shows how sound frequency changes based on movement
   - Adjustable parameters: Source Speed, Source Frequency, Direction

## How to Add a New Simulation

1. Create a new file in this folder with a descriptive name (e.g., `NewtonsCradleSimulation.tsx`)
2. Implement your simulation component using the Canvas API
3. Export your component as default
4. Add the component to the `index.ts` file for easier importing
5. Update the `topic-simulation.tsx` file to include your new simulation by adding a condition for the appropriate subject and topicId

## Component Structure

Each simulation should follow this general structure:

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
// Import necessary UI components

export default function YourSimulationName() {
  // Define state variables for simulation parameters
  // Use refs for animation frames and canvas

  // Animation function
  const animate = () => {
    // Draw simulation on canvas
  }

  // Set up animation loop
  useEffect(() => {
    // Start/stop animation based on isPlaying state
    return () => cancelAnimationFrame(requestRef.current!)
  }, [/* dependencies */])

  return (
    <div className="space-y-6">
      {/* Canvas for visualization */}
      {/* Controls for parameters */}
    </div>
  )
}
```

## Integration with Topics

In the `topic-simulation.tsx` file, add a condition for your simulation:

```tsx
if (subject === "physics" && topicId === "your-topic-id") {
  return <YourSimulationName />
}
```
