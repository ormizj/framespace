<script setup lang="ts">
import IframeCell from './cell-components/iframe-cell.vue';

const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const gridCells = ref<GridCell[]>([{
  cellX: 1,
  cellY: 1,
  cellWidth: 5,
  cellHeight: 3,
  link,
  classes: new Set(),
  component: {
    is: shallowRef(IframeCell),
    bind: {
      src: link
    }
  }
}, {
  cellX: 1,
  cellY: 7,
  cellWidth: 1,
  cellHeight: 1,
  link,
  classes: new Set(),
  component: {
    is: shallowRef(IframeCell),
    bind: {
      src: link
    },
  }
}]);

const isOpen = ref(false);
const isOpened = ref(false);
const editMode = ref(false);
const hideScroll = ref(false);

const frameSpaceContainer = ref<HTMLDivElement | null>(null);
const handleHideClick = () => {
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  frameSpaceContainer.value!.scrollTop = remSize * 2 /* --tab-height */;
}

watch(isOpen, (newValue) => {
  setTimeout(() => {
    isOpened.value = newValue
  }, 250 /* --animation-short-duration */);
})
</script>

<template>
  <div class="frame-space-container" ref="frameSpaceContainer" :class="[
    isOpen ? 'open' : 'close',
    isOpened ? 'opened' : 'closed',
    { ['scroll-hidden']: hideScroll }
  ]">
    <div class="frame-space">
      <div class="top-tab">
        <button @click="isOpen = !isOpen">
          {{ isOpen ? 'Close' : 'Open' }}
        </button>
        <button @click="handleHideClick" :disabled="!isOpened">
          Hide
        </button>
        <button @click="editMode = !editMode" :disabled="!isOpened">
          {{ editMode ? 'View' : 'Edit' }}
        </button>
        <button @click="hideScroll = !hideScroll" :disabled="!isOpened">
          {{ hideScroll ? 'Show Scroll' : 'Hide Scroll' }}
        </button>
      </div>
      <div class="content" ref="content">
        <ClientOnly>
          <!-- component doesn't support SSR -->
          <GridElements v-model="gridCells" v-model:edit="editMode" :x-grid="10" :y-grid="10" :cell-height="10" />
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
  transition: top var(--animation-short-duration) ease;
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

  &.scroll-hidden::-webkit-scrollbar {
    display: none;
  }

  .frame-space {
    width: 100%;

    .top-tab {
      display: flex;
      justify-content: center;
      height: var(--tab-height);
      background-color: rgba(var(--background-values), 0.5);
      width: 100%;
    }

    .content {
      min-height: calc(100dvh - var(--tab-height));
      background-color: var(--background);
    }
  }
}
</style>