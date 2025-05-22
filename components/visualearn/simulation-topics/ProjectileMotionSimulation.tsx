"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function ProjectileMotionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [initialVelocity, setInitialVelocity] = useState(30)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.8)
  const [timeScale, setTimeScale] = useState(1)
  
  // Current time in the simulation
  const [time, setTime] = useState(0)
  
  // Constants for drawing
  const groundY = 350
  const startX = 50
  const scale = 7

  // Calculate projectile motion parameters
  const calculateTrajectory = () => {
    const velocityX = initialVelocity * Math.cos(angle * Math.PI / 180)
    const velocityY = initialVelocity * Math.sin(angle * Math.PI / 180)
    
    // Time of flight: t = (2 * v₀ * sinθ) / g
    const timeOfFlight = (2 * velocityY) / gravity
    
    // Maximum height: h = (v₀² * sin²θ) / (2g)
    const maxHeight = (velocityY * velocityY) / (2 * gravity)
    
    // Range: R = (v₀² * sin2θ) / g
    const range = (initialVelocity * initialVelocity * Math.sin(2 * angle * Math.PI / 180)) / gravity
    
    return { velocityX, velocityY, timeOfFlight, maxHeight, range }
  }
  
  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw ground
    ctx.beginPath()
    ctx.moveTo(0, groundY)
    ctx.lineTo(width, groundY)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()
    
    const { velocityX, velocityY, timeOfFlight, maxHeight, range } = calculateTrajectory()
    
    // Draw trajectory path (dots)
    ctx.fillStyle = "#ccc"
    for (let t = 0; t <= timeOfFlight; t += 0.1) {
      const x = startX + velocityX * t * scale
      const y = groundY - (velocityY * t - 0.5 * gravity * t * t) * scale
      
      if (y <= groundY) {
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Calculate current position based on elapsed time
    const currentX = startX + velocityX * time * scale
    const currentY = groundY - (velocityY * time - 0.5 * gravity * time * time) * scale
    
    // Draw projectile
    if (currentY <= groundY) {
      // Projectile hasn't landed yet
      ctx.beginPath()
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#1d4ed8"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw velocity vectors
      const currVelocityX = velocityX
      const currVelocityY = velocityY - gravity * time
      
      // Horizontal velocity vector
      ctx.beginPath()
      ctx.moveTo(currentX, currentY)
      ctx.lineTo(currentX + currVelocityX * 0.7, currentY)
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Vertical velocity vector
      ctx.beginPath()
      ctx.moveTo(currentX, currentY)
      ctx.lineTo(currentX, currentY - currVelocityY * 0.7)
      ctx.strokeStyle = "#ef4444"  
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Increment time
      setTime(prevTime => {
        if (prevTime >= timeOfFlight) {
          // Reset time if projectile has landed
          return 0
        }
        return prevTime + 0.016 * timeScale
      })
    } else {
      // Projectile has landed - reset
      setTime(0)
    }
    
    // Draw key points
    // Start point
    ctx.beginPath()
    ctx.arc(startX, groundY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#000"
    ctx.fill()
    
    // Landing point
    const landingX = startX + range * scale
    ctx.beginPath()
    ctx.arc(landingX, groundY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#000"
    ctx.fill()
    
    // Highest point
    const highestPointX = startX + velocityX * (velocityY / gravity) * scale
    const highestPointY = groundY - maxHeight * scale
    ctx.beginPath()
    ctx.arc(highestPointX, highestPointY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#000"
    ctx.fill()
    
    // Draw labels
    ctx.fillStyle = "#000"
    ctx.font = "14px Arial"
    
    ctx.fillText(`Range: ${range.toFixed(1)} m`, width - 150, 30)
    ctx.fillText(`Max Height: ${maxHeight.toFixed(1)} m`, width - 150, 55)
    ctx.fillText(`Flight Time: ${timeOfFlight.toFixed(1)} s`, width - 150, 80)
    
    // Current time
    ctx.fillText(`Time: ${time.toFixed(1)} s`, 20, 30)
    
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isPlaying, initialVelocity, angle, gravity, timeScale, time])

  const reset = () => {
    setTime(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline">
          {isPlaying ? <><Pause className="h-4 w-4 mr-2" /> Pause</> : <><Play className="h-4 w-4 mr-2" /> Play</>}
        </Button>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Label>Initial Velocity (m/s)</Label>
            <Slider min={10} max={50} step={1} value={[initialVelocity]} onValueChange={(v) => setInitialVelocity(v[0])} />
            <p className="text-right mt-2">{initialVelocity.toFixed(0)} m/s</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Launch Angle (°)</Label>
            <Slider min={5} max={85} step={1} value={[angle]} onValueChange={(v) => setAngle(v[0])} />
            <p className="text-right mt-2">{angle.toFixed(0)}°</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Gravity (m/s²)</Label>
            <Slider min={1} max={20} step={0.1} value={[gravity]} onValueChange={(v) => setGravity(v[0])} />
            <p className="text-right mt-2">{gravity.toFixed(1)} m/s²</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Time Scale</Label>
            <Slider min={0.1} max={3} step={0.1} value={[timeScale]} onValueChange={(v) => setTimeScale(v[0])} />
            <p className="text-right mt-2">{timeScale.toFixed(1)}x</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
