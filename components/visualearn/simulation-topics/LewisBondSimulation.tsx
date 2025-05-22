// LewisBondSimulation.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function LewisBondSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pulseSpeed, setPulseSpeed] = useState(1)

  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const w = canvasRef.current.width
    const h = canvasRef.current.height
    ctx.clearRect(0, 0, w, h)

    const atom1 = { x: w / 2 - 150, y: h / 2 }
    const atom2 = { x: w / 2 + 150, y: h / 2 }

    ctx.font = "22px monospace"
    ctx.fillStyle = "#000"
    ctx.fillText("N: ••", atom1.x - 20, atom1.y)
    ctx.fillText(":N", atom2.x - 10, atom2.y)

    // Draw pulsing shared pair
    const t = timeRef.current
    const alpha = 0.5 + 0.5 * Math.sin(t * pulseSpeed * 2)
    ctx.globalAlpha = alpha
    ctx.fillStyle = "#10b981"
    ctx.beginPath()
    ctx.arc((atom1.x + atom2.x) / 2, atom1.y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    timeRef.current += 0.016
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [isPlaying, pulseSpeed])

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

      <Card>
        <CardContent className="pt-6">
          <Label>Pulse Speed</Label>
          <Slider min={0.5} max={5} step={0.1} value={[pulseSpeed]} onValueChange={(v) => setPulseSpeed(v[0])} />
          <p className="text-right mt-2">{pulseSpeed.toFixed(1)}x</p>
        </CardContent>
      </Card>
    </div>
  )
}
