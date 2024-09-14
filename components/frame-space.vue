<script setup lang="ts">
const isOpen = ref(false);
</script>


<template>
  <div class="frame-space" :class="`${isOpen ? 'open' : 'close'}`">
    <div class="top-tab">
      <button class="top-tab-button" @click="isOpen = true">Open Frames</button>
    </div>
    <div class="content"></div>
  </div>
</template>

<style scoped>
.frame-space {
  --tab-height: 2rem;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background-color);

  &.open {
    top: calc(var(--tab-height) * -1);
  }

  &.close {
    top: calc(100dvh - var(--tab-height));
  }

  .content {
    width: 100dvw;
    height: 100dvh;
  }

  .top-tab {
    height: var(--tab-height);
    pointer-events: none;

    .top-tab-button {
      pointer-events: auto;
      height: 100%;
    }
  }
}
</style>