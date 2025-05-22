"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function PendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [angle, setAngle] = useState(30)
  const [length, setLength] = useState(150)
  const [gravity, setGravity] = useState(9.8)
  const [damping, setDamping] = useState(0.01)

  const originX = 400
  const originY = 100

  const toRadians = (deg: number) => (deg * Math.PI) / 180
  const toDegrees = (rad: number) => (rad * 180) / Math.PI

  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const angleRad = toRadians(angle)
    const omega = Math.sqrt(gravity / length)
    const theta = angleRad * Math.exp(-damping * timeRef.current) * Math.cos(omega * timeRef.current)

    const bobX = originX + length * Math.sin(theta)
    const bobY = originY + length * Math.cos(theta)

    // Draw rod
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(bobX, bobY)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw bob
    ctx.beginPath()
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.stroke()

    // Draw energy bars
    const kineticEnergy = 0.5 * (length * omega * Math.sin(theta))**2
    const potentialEnergy = gravity * length * (1 - Math.cos(theta))
    const totalEnergy = kineticEnergy + potentialEnergy

    ctx.fillStyle = "#10b981"
    ctx.fillRect(50, 400, kineticEnergy * 10, 20)
    ctx.fillStyle = "#f59e0b"
    ctx.fillRect(50 + kineticEnergy * 10, 400, potentialEnergy * 10, 20)
    ctx.strokeStyle = "#000"
    ctx.strokeRect(50, 400, totalEnergy * 10, 20)
    ctx.font = "14px Arial"
    ctx.fillStyle = "#000"
    ctx.fillText("Energy Visualization (KE + PE)", 50, 390)

    timeRef.current += 0.016
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(requestRef.current!)
  }, [isPlaying, angle, length, gravity, damping])

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
            <Label>Initial Angle (°)</Label>
            <Slider min={1} max={90} step={1} value={[angle]} onValueChange={(v) => setAngle(v[0])} />
            <p className="text-right mt-2">{angle.toFixed(0)}°</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Length (px ≈ m)</Label>
            <Slider min={50} max={300} step={5} value={[length]} onValueChange={(v) => setLength(v[0])} />
            <p className="text-right mt-2">{length.toFixed(0)} px</p>
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
            <Label>Damping Coefficient</Label>
            <Slider min={0} max={0.1} step={0.001} value={[damping]} onValueChange={(v) => setDamping(v[0])} />
            <p className="text-right mt-2">{damping.toFixed(3)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
