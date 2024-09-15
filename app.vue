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
  --animation-duration: 0.25s;
  --secondary-color: whitesmoke;

  background-color: var(--background-color);
  color: var(--secondary-color);
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
</style>
