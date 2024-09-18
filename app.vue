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
  background-color: var(--background);
  color: var(--secondary);
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
</style>

<style>
body {
  /* color */
  --background-values: 25, 25, 25;
  --background: rgb(var(--background-values));
  --secondary: rgb(230, 230, 230);
  --success: rgb(25, 230, 25);
  --error: rgb(230, 25, 25);
  /* animation */
  --animation-short-duration: 0.25s;
  --animation-long-duration: 1s;
  --animation-repeat-count: 3;
}
</style>
