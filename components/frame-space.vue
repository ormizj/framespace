<script setup lang="ts">
const isOpen = ref(false);
const isOpened = ref(false);
const editMode = ref(false);

const frameSpaceContainer = ref<HTMLDivElement | null>(null);
const handleHideClick = () => {
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  frameSpaceContainer.value!.scrollTop = remSize * 2;
}

watch(isOpen, (newValue) => {
  setTimeout(() => {
    isOpened.value = newValue
  }, 250)
})
</script>


<template>
  <div class="frame-space-container" ref="frameSpaceContainer"
    :class="`${isOpen ? 'open' : 'close'} ${isOpened ? 'opened' : 'closed'}`">
    <div class="frame-space">
      <div class="top-tab">
        <button @click="handleHideClick" :disabled="!isOpened">Hide</button>
        <button @click="isOpen = !isOpen">{{ isOpen ? 'Close' : 'Open' }}</button>
        <button @click="editMode = !editMode" :disabled="!isOpened">Edit</button>
      </div>
      <div class="content" ref="content">
        <!-- actual content will only be relevant to the client-side -->
        <ClientOnly>
          <GridElements v-model:edit="editMode" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame-space-container {
  --tab-height: 2rem;
  height: 100dvh;
  width: 100dvw;
  position: fixed;
  transition: top var(--animation-duration) ease;
  overflow-y: scroll;
  overflow-x: hidden;

  &.open {
    top: 0;
  }

  &.close {
    top: calc(100dvh - var(--tab-height));
  }

  &.closed::-webkit-scrollbar {
    visibility: hidden;
  }

  .frame-space {
    width: 100%;

    .top-tab {
      display: flex;
      justify-content: center;
      height: var(--tab-height);
      background-color: rgba(var(--background-color-values), 0.5);
      width: 100%;
    }

    .content {
      min-height: calc(100dvh - var(--tab-height));
      background-color: var(--background-color);
    }
  }
}
</style>