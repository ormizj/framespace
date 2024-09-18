<script setup lang="ts">

</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.app {
  width: 100dvw;
  height: 100dvh;
}
</style>

<style>
body {
  --background-color-values: 25, 25, 25;
  --background-color: rgb(var(--background-color-values));
  --secondary-color: rgb(230, 230, 230);
  --error-color: rgb(230, 25, 25);
  --short-animation-duration: 0.25s;
  --long-animation-duration: 1s;

  background-color: var(--background-color);
  color: var(--secondary-color);
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
</style>
