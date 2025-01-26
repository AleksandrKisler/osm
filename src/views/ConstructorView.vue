<template>
  <div class="wrapper">
    {{ title }}
    <div class="canvas-wrapper">
      <canvas
        id="plan"
        ref="canvas"
        :height="400"
        :width="100"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
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

import { onMounted, ref } from 'vue'

const title = 'Pool'
const look = ref<boolean>(false)
const drawing = ref<boolean>(false)
const guides = ref<{ x: number; y: number }[]>([])
const strokeType = ref<StrokeType>('line')
const strokes = ref<StrokesInterface>({
  type: strokeType.value,
  from: { x: 0, y: 0 },
  coordinates: [],
  color: '',
  width: '',
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
  if (!look.value) {
    drawing.value = true
    strokes.value = {
      type: strokeType.value,
      from: getCoordinates($event),
      coordinates: [],
      color: 'black',
      width: 2,
      fill: false,
      lineCap: '',
      lineJoin: '',
    }
    guides.value = []
  }
}

function draw($event: Event) {
  console.log($event)
  if (drawing.value) {
    const coordinate = getCoordinates($event)
    switch (strokeType.value) {
      case 'line':
        guides.value = [{ x: coordinate.x, y: coordinate.y }]
        break
      case 'line':
        guides.value = [
          { x: coordinate.x, y: strokes.value.from.y },
          { x: coordinate.x, y: coordinate.y },
          { x: strokes.value.from.x, y: coordinate.y },
          { x: strokes.value.from.x, y: strokes.value.from.y },
        ]
        break
    }
  }
}

function stopDraw($event: Event) {
  console.log($event)
}
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  border: 1px solid grey;
}
</style>
