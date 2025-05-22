"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function WaveSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [amplitude, setAmplitude] = useState(50)
  const [frequency, setFrequency] = useState(1)
  const [waveSpeed, setWaveSpeed] = useState(5)
  const [dampingFactor, setDampingFactor] = useState(0)

  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    const centerY = canvasRef.current.height / 2
    
    // Draw horizontal axis
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(canvasRef.current.width, centerY)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()
    
    // Draw wave
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    
    for (let x = 0; x < canvasRef.current.width; x += 1) {
      const t = timeRef.current * waveSpeed * 0.02
      const damping = Math.exp(-dampingFactor * x / 100)
      const y = centerY - amplitude * damping * Math.sin((x * frequency * 0.01) + t)
      ctx.lineTo(x, y)
    }
    
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Draw vertical axis
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(50, canvasRef.current.height - 50)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()
    
    // Draw amplitude indicators
    ctx.beginPath()
    ctx.moveTo(40, centerY - amplitude)
    ctx.lineTo(60, centerY - amplitude)
    ctx.moveTo(40, centerY + amplitude)
    ctx.lineTo(60, centerY + amplitude)
    ctx.strokeStyle = "#f87171"
    ctx.stroke()
    
    // Labels
    ctx.fillStyle = "#000"
    ctx.font = "14px Arial"
    ctx.fillText("Amplitude", 65, centerY - amplitude)
    ctx.fillText("Wavelength", 200, centerY + 80)
    ctx.fillText("Direction of wave propagation →", canvasRef.current.width - 250, centerY - 30)
    
    timeRef.current += 1
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(requestRef.current!)
  }, [isPlaying, amplitude, frequency, waveSpeed, dampingFactor])

  const reset = () => {
    timeRef.current = 0
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
            <Label>Amplitude</Label>
            <Slider min={10} max={100} step={1} value={[amplitude]} onValueChange={(v) => setAmplitude(v[0])} />
            <p className="text-right mt-2">{amplitude} units</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Frequency</Label>
            <Slider min={0.5} max={5} step={0.1} value={[frequency]} onValueChange={(v) => setFrequency(v[0])} />
            <p className="text-right mt-2">{frequency.toFixed(1)} Hz</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Wave Speed</Label>
            <Slider min={1} max={10} step={0.5} value={[waveSpeed]} onValueChange={(v) => setWaveSpeed(v[0])} />
            <p className="text-right mt-2">{waveSpeed.toFixed(1)} units/s</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Damping Factor</Label>
            <Slider min={0} max={0.5} step={0.01} value={[dampingFactor]} onValueChange={(v) => setDampingFactor(v[0])} />
            <p className="text-right mt-2">{dampingFactor.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
