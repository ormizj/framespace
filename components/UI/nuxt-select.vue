<script setup lang="ts">
const model = defineModel();
const isHydrating = useIsHydrating();

const selectRef = ref<HTMLSelectElement | null>(null);
defineExpose({ selectRef: selectRef });
</script>

<template>
	<select
		class="nuxt-select"
		v-model="model"
		ref="selectRef"
		:disabled="isHydrating"
	>
		<slot />
	</select>
</template>

<style scoped>
.nuxt-select {
	background-color: color-mix(in srgb, var(--background), white 7.5%);
	padding-inline-start: calc(0.5rem - 4px);
	color: var(--secondary);
	border-radius: calc(var(--border-glow-radius) / 4);
	cursor: pointer;
	min-height: var(--input-height);

	&:disabled {
		pointer-events: none;
		background-color: color-mix(in srgb, var(--secondary), transparent 29%);
		color: var(--secondary);
		animation: unset;
	}

	/* remove defaults */
	border: unset;
}

@keyframes very-subtle-glow {
	from {
		box-shadow: 0 0 1px var(--secondary);
	}

	to {
		box-shadow: 0 0 3px var(--secondary);
	}
}

.nuxt-select {
	animation: very-subtle-glow var(--animation-longer-duration) infinite
		alternate;
}
</style>
