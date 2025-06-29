<script setup lang="ts">
import type GridCell from '~/classes/GridCell';
import GridElements from '~/components/GridElements/grid-elements.vue';
import gridAttributes from '../composables/settingsGrid/gridAttributes';
import addIframe from '~/composables/settingsGrid/addIframe';
import removeIframe from '~/composables/settingsGrid/removeIframe';
import auth from '~/composables/settingsGrid/auth';
import unAuth from '~/composables/settingsGrid/unAuth';

const frameSpaceStore = useFrameSpaceStore();
const { outOfBoundIframes } = storeToRefs(frameSpaceStore);

const editMode = ref(true);
const gridCells = ref<GridCell[]>([]);
watch(
	() => [auth(), unAuth()],
	() => {
		gridCells.value = [
			...gridAttributes(),
			...addIframe(),
			...removeIframe(),
			...auth(),
			...unAuth(),
		];
	},
	{ immediate: true }
);
</script>

<template>
	<div class="settings">
		<div class="header">
			<div class="message-container start">
				<h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
					Iframes out of bound: {{ outOfBoundIframes.amount }}
				</h3>
			</div>
			<div class="message-container center">
				<h2>Settings</h2>
			</div>
			<div class="message-container end">
				<h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
					Highest X-Grid: {{ outOfBoundIframes.maxX }}
				</h3>
				&nbsp;&nbsp;&nbsp;
				<h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
					Highest Y-Grid: {{ outOfBoundIframes.maxY }}
				</h3>
			</div>
		</div>
		<ClientOnly>
			<GridElements
				class="grid-elements"
				v-model="gridCells"
				v-model:edit="editMode"
				:xGridBoundary="15"
				:yGridBoundary="15"
				:cell-height="10"
				:always-interactive="true"
				:allow-overlap="true"
				:scroll-amount="1"
				:use-nested-children="true"
			>
				<!-- GridComponent EXAMPLE
				<GridComponent :x="1" :y="1" :width="1" :height="1">
					<div>Example A</div>
				</GridComponent>
				<GridComponent
					:y="2"
					:x="2"
					:template="`one one one
											. two two`"
				>
					<div key="one">Example B: "one"</div>
					<div key="two">Example B: "two"</div>
				</GridComponent>
				-->
			</GridElements>
		</ClientOnly>
	</div>
</template>

<style scoped>
.settings {
	height: 100%;

	.header {
		height: var(--header-height);
		display: flex;
		align-items: center;
	}

	.grid-elements {
		border-bottom: 1px solid var(--secondary);
		border-top: 1px solid var(--secondary);
		height: calc(100% - var(--header-height) - var(--tab-height));
	}

	.message-container {
		display: flex;
		width: 100%;

		&.start {
			justify-content: end;
		}

		&.center {
			justify-content: center;
		}

		&.end {
			justify-content: start;
		}

		.message {
			border-radius: var(--border-glow-radius);
			padding: 0.5rem;

			&.warning {
				animation: subtle-glow-warning var(--animation-long-duration) infinite
					alternate;
			}
		}
	}
}

@keyframes subtle-glow {
	from {
		box-shadow: 0 0 1px var(--secondary);
	}

	to {
		box-shadow: 0 0 10px var(--secondary);
	}
}

:deep(.grid-cell:not(.error-animation)) {
	animation: subtle-glow var(--animation-longer-duration) infinite alternate;
}

@keyframes subtle-glow-warning {
	from {
		box-shadow: 0 0 1px var(--warning) inset;
	}

	to {
		box-shadow: 0 0 calc(var(--border-glow-radius) / 2) var(--warning) inset;
	}
}
</style>
