<template>
  <div class="wrapper">
    <div class="canvas-wrapper">
      <canvas
        id="plan"
        ref="canvas"
        :height="400"
        :width="1000"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
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

import { nextTick, onMounted, ref } from 'vue'

const color = '#000'
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

const ctx = ref<CanvasRenderingContext2D | undefined>(undefined)
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  canvas.value = document.getElementById('plan') as HTMLCanvasElement
  if (canvas.value?.getContext) {
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
  console.log('startDraw')

  if (!look.value) {
    drawing.value = true
    strokes.value = {
      type: strokeType.value,
      from: getCoordinates($event),
      coordinates: [],
      color: '#000',
      width: 2,
      fill: false,
      lineCap: 'square',
      lineJoin: 'miter',
    }
    guides.value = []
  }
}

function draw($event: Event) {
  console.log('draw')

  if (drawing.value) {
    const coordinate = getCoordinates($event)
    switch (strokeType.value) {
      case 'line':
        guides.value = [{ x: coordinate.x, y: coordinate.y }]
        break
      case 'square':
        guides.value = [
          { x: coordinate.x, y: strokes.value.from.y },
          { x: coordinate.x, y: coordinate.y },
          { x: strokes.value.from.x, y: coordinate.y },
          { x: strokes.value.from.x, y: strokes.value.from.y },
        ]
        break
    }

    drawGuide(true)
  }
}
function drawGuide(closingPath: boolean) {
  nextTick(() => {
    if (ctx.value) {
      ctx.value.strokeStyle = color
      ctx.value.lineWidth = 1
      ctx.value.lineJoin = 'miter'
      ctx.value.lineCap = 'round'

      ctx.value.beginPath()
      ctx.value.setLineDash([15, 15])
      if (strokes.value.type && ctx.value) {
        ctx.value.moveTo(strokes.value.from.x, strokes.value.from.y)
        guides.value.forEach((coordinate: { x: number; y: number }) => {
          ctx.value?.lineTo(coordinate.x, coordinate.y)
        })
      }
    }

    if (closingPath) {
      ctx.value?.closePath()
    }
  })

  ctx.value?.stroke()
}

function stopDraw() {
  if (drawing.value) {
    strokes.value.coordinates = guides.value.length > 0 ? guides.value : strokes.value.coordinates
    drawing.value = false
  }
}
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  border: 1px solid grey;
}
</style>
