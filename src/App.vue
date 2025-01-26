<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Constructor</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  display: flex;
  width: 100%;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: left;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
