<template>
  <div class="wrapper">
    {{ title }}
    <div class="canvas-wrapper">
      <canvas id="plan" ref="canvas" :height="400" :width="100"></canvas>
    </div>
    <button @click="testMark()">test</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const title = 'Pool'
const ctx = ref<CanvasRenderingContext2D | undefined>(undefined)
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  canvas.value = document.getElementById('plan') as HTMLCanvasElement
  if (canvas.value?.getContext) {
    ctx.value = canvas.value.getContext('2d') ?? undefined
  }
})

function testMark(): void {
  if (canvas.value && ctx.value) {
    const x = Math.floor(Math.random() * canvas.value.width) // случайная координата x
    const y = Math.floor(Math.random() * canvas.value.height) // случайная координата y

    ctx.value.beginPath()
    ctx.value.arc(x, y, 5, 0, Math.PI * 2) // рисуем точку
    ctx.value.fillStyle = 'black'
    ctx.value.fill()
  }
}
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  border: 1px solid grey;
}
</style>
