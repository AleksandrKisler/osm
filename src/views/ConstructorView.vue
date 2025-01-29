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
import { onMounted, ref } from 'vue'
import canvasConstructorTools from '@/helper/canvas'
interface StrokesInterface {
  type: StrokeType
  from: {
    x: number
    y: number
  }
  to: { x: number; y: number } | undefined
}

type StrokeType = 'line' | 'square'

// const color = '#000'
// const lineWidth = 1
const look = ref<boolean>(false)
const drawing = ref<boolean>(false)
// const guides = ref<{ x: number; y: number }[]>([])
const lastDraftPointPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const strokeType = ref<StrokeType>('line')
const stroke = ref<StrokesInterface>({
  type: strokeType.value,
  from: { x: 0, y: 0 },
  to: undefined,
})
const strokeList = ref<StrokesInterface[]>([])

const width = 1000
const height = 600

const ctx = ref<CanvasRenderingContext2D | undefined>(undefined)
const canvas = ref<HTMLCanvasElement | null>(null)
const tools = canvasConstructorTools(ctx)

onMounted(async () => {
  canvas.value = document.getElementById('plan') as HTMLCanvasElement
  const grid = document.getElementById('grid') as HTMLCanvasElement
  canvas.value.height = grid.height = height
  canvas.value.width = grid.width = width
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
  const from = tools.lauchDraw(getCoordinates($event))
  if (!look.value && from) {
    drawing.value = true
    stroke.value = {
      type: 'line',
      from,
      to: undefined,
    }
  }
}

function draw($event: Event) {
  if (drawing.value) {
    if (ctx.value) ctx.value.lineWidth = 1
    const coordinate = getCoordinates($event)
    ctx.value?.clearRect(0, 0, width, height)
    drawShape()
    tools.drawDottedtLine(stroke.value.from, coordinate)
    const to = tools.lauchDraw(coordinate)
    if (to) {
      lastDraftPointPosition.value = to
    }
  }
}
// function drawGuide(closingPath: boolean) {
//   console.log(closingPath)
//   nextTick(() => {
//     console.log('is next tick')
//   })
// }

function stopDraw() {
  if (drawing.value) {
    drawing.value = false
    if (ctx.value) ctx.value.lineWidth = 3
    stroke.value.to = lastDraftPointPosition.value
    strokeList.value.push(stroke.value)
    drawShape()

    // tools.drawLine(strokes.value.from, strokes.value.coordinates[0])
  }
}

function drawShape() {
  ctx.value?.clearRect(0, 0, width, height)
  strokeList.value.forEach((stroke: StrokesInterface) => {
    if (stroke.to) {
      tools.drawLine(stroke.from, stroke.to)
    }
  })
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
