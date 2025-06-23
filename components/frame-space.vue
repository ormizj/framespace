<script setup lang="ts">
import { ANIMATION_SHORT_DURATION, TAB_HEIGHT } from '~/constants/style';
import GridElements from '~/components/GridElements/grid-elements.vue';

const frameSpaceStore = useFrameSpaceStore();
const {
	yGridBoundary,
	xGridBoundary,
	cellHeight,
	scrollAmount,
	iframeGridCells,
} = storeToRefs(frameSpaceStore);

const isOpen = ref(false);
const isOpened = ref(false);
const editMode = ref(false);
const showScroll = ref(true);

const frameSpaceContainer = ref<HTMLDivElement | null>(null);
const handleHideClick = () => {
	const remSize = parseFloat(
		getComputedStyle(document.documentElement).fontSize
	);
	frameSpaceContainer.value!.scrollTop = remSize * TAB_HEIGHT;
};

watch(isOpen, (newValue) => {
	setTimeout(() => {
		isOpened.value = newValue;
	}, ANIMATION_SHORT_DURATION);
});
</script>

<template>
	<div
		class="frame-space-container scroll-hidden"
		ref="frameSpaceContainer"
		:class="[isOpen ? 'open' : 'close', isOpened ? 'opened' : 'closed']"
	>
		<div class="frame-space">
			<div class="top-tab">
				<NuxtButton class="start" location="start" @click="isOpen = !isOpen">
					{{ isOpen ? 'Close' : 'Open' }}
				</NuxtButton>
				<NuxtButton
					location="center"
					@click="editMode = !editMode"
					:disabled="!isOpened"
				>
					{{ editMode ? 'View' : 'Edit' }}
				</NuxtButton>
				<NuxtButton
					location="center"
					@click="handleHideClick"
					:disabled="!isOpened"
				>
					Hide Tab
				</NuxtButton>
				<NuxtButton
					class="end"
					location="end"
					@click="showScroll = !showScroll"
					:disabled="!isOpened"
				>
					{{ showScroll ? 'Hide Scroll' : 'Show Scroll' }}
				</NuxtButton>
			</div>
			<ClientOnly>
				<GridElements
					class="grid-elements"
					v-model="iframeGridCells"
					v-model:edit="editMode"
					v-model:scroll="showScroll"
					:yGridBoundary="yGridBoundary"
					:xGridBoundary="xGridBoundary"
					:cell-height="cellHeight"
					:scroll-amount="scrollAmount"
				/>
			</ClientOnly>
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
			background-color: rgba(var(--background-values), 0.5);
			border-bottom: 1px solid var(--secondary);
			width: 100%;

			.start {
				border-end-start-radius: unset;
			}

			.end {
				border-end-end-radius: unset;
			}
		}

		.grid-elements {
			width: 100%;
			min-height: 100dvh;
			background-color: var(--background);
			height: 0;
		}
	}
}
</style>
