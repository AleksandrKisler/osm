<template>
  <div class="wrapper">
    <ul class="offices">
      <li
        v-for="office of offices"
        :key="`ol-${office.id}`"
        :class="{ active: office.id === select }"
        @click="select = office.id"
        @dblclick.stop="select = undefined"
      >
        <h3 v-text="office.name" />
      </li>
      <button @click="router.push('/office/create')">add office</button>
    </ul>
    <div class="office-view">{{ select }}</div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
const offices = [
  {
    id: 1,
    name: 'Office name 1',
    childrens: [],
    slug: 'offce-1',
    plan: {
      graphicalRepresentation: {},
      description: {},
    },
    description: 'office descriptions',
  },
  {
    id: 2,
    name: 'Office name 2',
    childrens: [],
    slug: 'offce-2',
    plan: {
      graphicalRepresentation: {},
      description: {},
    },
    description: 'office descriptions more',
  },
]

const select = ref<number | undefined>()
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  padding: 1rem;
  height: 100%;

  .offices {
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: 4px;
    margin: 0;
    height: 100%;
    min-width: 320px;

    li {
      text-transform: uppercase;
      border: 1px solid darkgrey;
      border-radius: 16px;
      cursor: pointer;
      user-select: none;

      h3 {
        padding: 0.5rem 2.5rem;
      }
    }

    .active,
    li:active,
    li:hover {
      border-radius: 16px;
      border-color: rgb(70, 70, 70);
      background-color: #eeeeee;
    }
  }
}
</style>
