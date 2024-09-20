<script setup lang="ts">
import { ANIMATION_SHORT_DURATION, TAB_HEIGHT } from '~/constants/style';
import IframeCell from './cell-components/iframe-cell.vue';
import type { GridCell } from '~/types/GridCell';
import OpenCorsSites from '~/enums/OpenCorsSites';

const frameSpaceStore = useFrameSpaceStore();
const { xGrid, yGrid, cellHeight, iframesUpdater } = storeToRefs(frameSpaceStore);

const isOpen = ref(false);
const isOpened = ref(false);
const editMode = ref(false);
const hideScroll = ref(false);

const frameSpaceContainer = ref<HTMLDivElement | null>(null);
const handleHideClick = () => {
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  frameSpaceContainer.value!.scrollTop = remSize * TAB_HEIGHT;
}

watch(isOpen, (newValue) => {
  setTimeout(() => {
    isOpened.value = newValue
  }, ANIMATION_SHORT_DURATION);
})

// iframes handler
const iframes = ref<GridCell<typeof IframeCell>[]>([]);
const initializeIframes = () => {
  iframes.value = structuredClone(toRaw(useFrameSpaceStore().iframes));
  // TODO temp "as" type
  iframes.value.forEach((iframe) => iframe.component.is = shallowRef(IframeCell) as unknown as typeof IframeCell);
}
frameSpaceStore.addIframe({
  cellX: 1,
  cellY: 1,
  cellWidth: 5,
  cellHeight: 3,
  src: OpenCorsSites.calculatorsoup,
  classes: new Set(['golden-animation']),
});
frameSpaceStore.addIframe({
  cellX: 1,
  cellY: 7,
  cellWidth: 1,
  cellHeight: 1,
  src: OpenCorsSites.calculatorsoup
});
initializeIframes();
watch(iframesUpdater, initializeIframes);
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
        <button @click="editMode = !editMode" :disabled="!isOpened">
          {{ editMode ? 'View' : 'Edit' }}
        </button>
        <button @click="handleHideClick" :disabled="!isOpened">
          Hide Tab
        </button>
        <button @click="hideScroll = !hideScroll" :disabled="!isOpened">
          {{ hideScroll ? 'Show Scroll' : 'Hide Scroll' }}
        </button>
      </div>
      <div class="content" ref="content">
        <ClientOnly>
          <!-- TODO temp "as" type -->
          <GridElements class="grid-elements" v-model="iframes as GridCell[]" v-model:edit="editMode" :x-grid="xGrid"
            :y-grid="yGrid" :cell-height="cellHeight" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame-space-container {
  z-index: 1;
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
      border-top: 1px solid var(--secondary);
      min-height: calc(100dvh - var(--tab-height));
      background-color: var(--background);
    }

    .grid-elements {
      min-height: 100dvh;
      width: 100%;
    }
  }
}
</style>