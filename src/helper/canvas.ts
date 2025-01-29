import type { Ref } from 'vue'
const step = 25

type CoordinateType = { x: number; y: number }

export default function canvasConstructorTools(ctx: Ref<CanvasRenderingContext2D | undefined>) {
  async function createGridTemplate(width: number, height: number) {
    // todo: add
    setStrokeColor('#ebe8e8')
    setFillColor('#a1a1a1')
    let i = 0,
      j = 0
    while (i < width) {
      ctx.value?.beginPath()
      ctx.value?.moveTo(i, 0)
      ctx.value?.lineTo(i, height)
      ctx.value?.stroke()
      i = i + step
    }
    while (j < height) {
      ctx.value?.beginPath()
      ctx.value?.moveTo(0, j)
      ctx.value?.lineTo(width, j)
      ctx.value?.stroke()
      j = j + step
    }

    for (let x = 25; x < width; x = x + 25) {
      for (let y = 25; y < height; y = y + 25) {
        drawPoint(x, y, 2)
      }
    }
    setStrokeColor('#000')
    setFillColor('#000')
  }

  function setStrokeColor(color: string) {
    if (ctx.value) {
      ctx.value.strokeStyle = color
    }
  }

  function setFillColor(color: string) {
    if (ctx.value) {
      ctx.value.fillStyle = color
    }
  }

  function lauchDraw(coordinate: CoordinateType): CoordinateType | undefined {
    const dirtX = coordinate.x % step
    const dirtY = coordinate.y % step
    if ((dirtX > 5 && dirtX < 20) || (dirtY > 5 && dirtY < 20)) {
      return //check valid click coordinate
    }
    const nearsetPoint: CoordinateType = {
      x: Math.round(coordinate.x / step) * step,
      y: Math.round(coordinate.y / step) * step,
    }
    drawPoint(nearsetPoint.x, nearsetPoint.y, 4)
    return nearsetPoint
  }

  function drawPoint(x: number, y: number, r: number) {
    ctx.value?.beginPath()
    ctx.value?.moveTo(x, y)
    ctx.value?.arc(x, y, r, 0, 2 * Math.PI)
    ctx.value?.fill()
  }

  function drawDottedtLine(from: CoordinateType, to: CoordinateType) {
    drawPoint(from.x, from.y, 4)
    ctx.value?.beginPath()
    ctx.value?.setLineDash([15, 15])
    ctx.value?.moveTo(from.x, from.y)
    ctx.value?.lineTo(to.x, to.y)
    ctx.value?.stroke()
  }

  function drawLine(from: CoordinateType, to: CoordinateType) {
    ctx.value?.beginPath()
    ctx.value?.setLineDash([])
    ctx.value?.moveTo(from.x, from.y)
    ctx.value?.lineTo(to.x, to.y)
    ctx.value?.stroke()
  }
  return { createGridTemplate, setFillColor, setStrokeColor, lauchDraw, drawDottedtLine, drawLine }
}
