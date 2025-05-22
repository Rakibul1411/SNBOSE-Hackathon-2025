"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function DopplerEffectSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sourceSpeed, setSourceSpeed] = useState(0.3)
  const [frequency, setFrequency] = useState(0.3)
  const [direction, setDirection] = useState(1) // 1 = right, -1 = left
  
  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const centerY = height / 2
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw reference line
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Calculate source position
    const sourceX = (width / 2) + direction * (timeRef.current * sourceSpeed * 2) % (width * 1.5) - width * 0.75
    
    // Draw source (sound emitter)
    ctx.beginPath()
    ctx.arc(sourceX, centerY, 15, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.strokeStyle = "#1e40af"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw observer (ear)
    const observerX = width * 0.8
    ctx.beginPath()
    ctx.moveTo(observerX - 10, centerY - 20)
    ctx.quadraticCurveTo(observerX + 15, centerY, observerX - 10, centerY + 20)
    ctx.fillStyle = "#f59e0b"
    ctx.fill()
    ctx.strokeStyle = "#d97706"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw wave propagation
    const maxRadius = 300
    const waveCount = 15
    const baseTime = timeRef.current * 0.5
    
    for (let i = 0; i < waveCount; i++) {
      const progress = (baseTime - i * 10) % maxRadius
      if (progress > 0) {
        const radius = progress
        const alpha = 1 - progress / maxRadius
        
        ctx.beginPath()
        ctx.arc(sourceX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
    
    // Draw frequency indicators
    const perceivedFreq = frequency * (1 + direction * sourceSpeed * (observerX - sourceX < 0 ? -1 : 1) * 0.5)
    
    ctx.fillStyle = "#000"
    ctx.font = "16px Arial"
    ctx.fillText(`Source Frequency: ${frequency.toFixed(1)} Hz`, 50, 50)
    ctx.fillText(`Perceived Frequency: ${perceivedFreq.toFixed(1)} Hz`, 50, 80)
    ctx.fillText(`Effect: ${perceivedFreq > frequency ? "Higher pitch" : perceivedFreq < frequency ? "Lower pitch" : "No change"}`, 50, 110)
    
    timeRef.current += 1
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(requestRef.current!)
  }, [isPlaying, sourceSpeed, frequency, direction])

  const reset = () => {
    timeRef.current = 0
    setIsPlaying(false)
  }
  
  const toggleDirection = () => {
    setDirection(prev => prev * -1)
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
        <Button onClick={toggleDirection} variant="outline">
          {direction === 1 ? "Moving Right →" : "← Moving Left"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Label>Source Speed</Label>
            <Slider min={0.1} max={1} step={0.05} value={[sourceSpeed]} onValueChange={(v) => setSourceSpeed(v[0])} />
            <p className="text-right mt-2">{sourceSpeed.toFixed(2)} units/s</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Source Frequency</Label>
            <Slider min={0.1} max={1} step={0.05} value={[frequency]} onValueChange={(v) => setFrequency(v[0])} />
            <p className="text-right mt-2">{frequency.toFixed(2)} Hz</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
