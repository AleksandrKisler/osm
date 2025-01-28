<template>
  <div class="wrapper">
    <div class="canvas-wrapper">
      <canvas id="grid" class="grid" />
      <canvas
        id="plan"
        class="plan"
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
import { nextTick, onMounted, ref } from 'vue'
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
  canvas.value.height = height
  canvas.value.width = width
  const grid = document.getElementById('grid') as HTMLCanvasElement
  grid.height = height
  grid.width = width
  if (canvas.value?.getContext) {
    ctx.value = grid.getContext('2d') ?? undefined
    await tools.createGridTemplate(width, height)
    ctx.value = canvas.value.getContext('2d') ?? undefined
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
    if (ctx.value) ctx.value.lineWidth = 1
    const coordinate = getCoordinates($event)
    ctx.value?.clearRect(0, 0, width, height)
    tools.drawDottedtLine(strokes.value.from, coordinate)
    const to = tools.lauchDraw(coordinate)
    if (to) {
      strokes.value.coordinates = [to]
    }
    drawGuide(true)
  }
}
function drawGuide(closingPath: boolean) {
  nextTick(() => {
    console.log('is next tick', closingPath)
  })
}

function stopDraw() {
  if (drawing.value) {
    drawing.value = false
    if (ctx.value) ctx.value.lineWidth = 3
    ctx.value?.clearRect(0, 0, width, height)
    tools.drawLine(strokes.value.from, strokes.value.coordinates[0])
  }
}
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  display: flex;
  border: 1px solid grey;
  width: max-content;
  position: relative;

  .grid {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .plan {
    position: relative;
    z-index: 10;
  }
}
</style>
