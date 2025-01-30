<template>
  <div class="page-wrapper">
    <div class="constructor-wrapper">
      <div class="konva-wrapper" id="konva-wrapper" ref="konvaWrapper">
        <div id="container"></div>
      </div>
      <div class="entytes">
        <!-- <div class="entyty" @click="addShape('cabinet')">С</div> -->
        <div class="entyty" @click="addShape('workplace')">WP</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { onMounted, ref } from 'vue'

const konvaWrapper = ref<HTMLElement | null>(null)
const stage = ref<Konva.Stage | null>(null)
const layer = ref<Konva.Layer>(new Konva.Layer())
const group = ref<Konva.Group>(new Konva.Group())

onMounted(() => {
  const height = konvaWrapper.value?.clientHeight
  const widht = konvaWrapper.value?.clientWidth
  stage.value = new Konva.Stage({
    container: 'container',
    width: widht,
    height: height,
  })
  layer.value.add(group.value as Konva.Group)
  const cabinet = new Konva.Rect({
    x: 25,
    y: 25,
    width: 500,
    height: 350,
    fill: '#f5f5f5',
    cornerRadius: 12,
    strokeWidth: 2,
    stroke: '#474747',
    draggable: true,
  })
  group.value?.add(cabinet)
  stage.value.add(layer.value as Konva.Layer)
})

function addShape(type: string) {
  console.log(type)
  const workplace = new Konva.Rect({
    x: 0,
    y: 50,
    width: 50,
    height: 50,
    fill: '#292929',
    cornerRadius: 4,
    draggable: true,
  })

  group.value?.add(workplace)
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.constructor-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;

  .konva-wrapper {
    width: 100%;
    height: 600px;
    border: 1px solid gray;

    .konva-p {
      border: 1px solid gray;
    }
  }

  .entytes {
    display: flex;
    align-items: center;
    gap: 4px;

    .entyty {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background-color: #acacac;
      font-size: medium;
      cursor: pointer;
    }
  }
}
</style>
