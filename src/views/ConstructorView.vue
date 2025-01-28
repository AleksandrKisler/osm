<template>
  <div class="wrapper">
    <div class="canvas-wrapper">
      <canvas
        id="plan"
        ref="canvas"
        @dblclick="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import canvasConstructorTools from '@/helper/canvas'
interface StrokesInterface {
  type: StrokeType
  from: {
    x: number
    y: number
  }
  coordinates: { x: number; y: number }[]
  color: string
  width: number | string
  fill: boolean
  lineCap: string
  lineJoin: string
}

type StrokeType = 'line' | 'square'

// const color = '#000'
// const lineWidth = 1
const look = ref<boolean>(false)
const drawing = ref<boolean>(false)
const guides = ref<{ x: number; y: number }[]>([])
const strokeType = ref<StrokeType>('line')
const strokes = ref<StrokesInterface>({
  type: strokeType.value,
  from: { x: 0, y: 0 },
  coordinates: [],
  color: '',
  width: 1,
  fill: false,
  lineCap: '',
  lineJoin: '',
})

const width = 1000
const height = 600

const ctx = ref<CanvasRenderingContext2D | undefined>(undefined)
const canvas = ref<HTMLCanvasElement | null>(null)
const tools = canvasConstructorTools(ctx)

onMounted(async () => {
  canvas.value = document.getElementById('plan') as HTMLCanvasElement
  if (canvas.value?.getContext) {
    ctx.value = canvas.value.getContext('2d') ?? undefined
    canvas.value.height = height
    canvas.value.width = width
    await tools.createGridTemplate(width, height)
  }
})

function getCoordinates(event: Event) {
  return {
    x: (<MouseEvent>event).offsetX,
    y: (<MouseEvent>event).offsetY,
  }
}

function startDraw($event: Event) {
  if (!look.value) {
    drawing.value = true
    const from = tools.lauchDraw(getCoordinates($event))
    if (!from) {
      return
    }
    // just check logic
    strokes.value = {
      type: 'line',
      from,
      coordinates: [],
      color: '#000',
      width: 2,
      fill: false,
      lineCap: 'rounded',
      lineJoin: 'miter',
    }
    guides.value = []
  }
}

function draw($event: Event) {
  if (drawing.value) {
    const coordinate = getCoordinates($event)
    guides.value = [{ x: coordinate.x, y: coordinate.y }]
    drawGuide(true)
    tools.drawDottedtLine(strokes.value.from, coordinate)
  }
}
function drawGuide(closingPath: boolean) {
  console.log(closingPath)

  // nextTick(() => {
  //   if (ctx.value) {
  //     ctx.value.strokeStyle = color
  //     ctx.value.lineWidth = 1
  //     // ctx.value.lineJoin = 'miter'
  //     // ctx.value.lineCap = 'round'

  //     ctx.value.beginPath()
  //     ctx.value.setLineDash([15, 15])
  //     if (strokes.value.type && ctx.value) {
  //       ctx.value.moveTo(strokes.value.from.x, strokes.value.from.y)
  //       guides.value.forEach((coordinate: { x: number; y: number }) => {
  //         ctx.value?.lineTo(coordinate.x, coordinate.y)
  //       })
  //     }
  //     if (closingPath) {
  //       ctx.value?.closePath()
  //     }
  //   }
  //   ctx.value?.stroke()
  // })
}

function stopDraw() {
  console.log('stop draw')

  if (drawing.value) {
    strokes.value.coordinates = guides.value.length > 0 ? guides.value : strokes.value.coordinates
    drawing.value = false
  }
}
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  display: flex;
  border: 1px solid grey;
  width: max-content;
}
</style>
