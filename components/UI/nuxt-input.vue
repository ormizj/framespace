<script setup lang="ts">
const model = defineModel();
const isHydrating = useIsHydrating();

const inputRef = ref<HTMLInputElement | null>(null);
defineExpose({ inputRef });
</script>

<template>
	<input
		class="nuxt-input"
		v-model="model"
		ref="inputRef"
		:disabled="isHydrating"
	/>
</template>

<style scoped>
.nuxt-input {
	background-color: color-mix(in srgb, var(--background), white 7.5%);
	padding: 0 0.5rem;
	color: var(--secondary);
	border-radius: calc(var(--border-glow-radius) / 4);
	min-height: var(--input-height);

	&:disabled {
		pointer-events: none;
		background-color: color-mix(in srgb, var(--secondary), transparent 50%);
		color: var(--secondary);
		animation: unset;
	}

	/* remove defaults */
	border: unset;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		appearance: none;
		-webkit-appearance: none;
		margin: 0;
	}

	&[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
}

@keyframes very-subtle-glow {
	from {
		box-shadow: 0 0 1px var(--secondary);
	}

	to {
		box-shadow: 0 0 3px var(--secondary);
	}
}

.nuxt-input {
	animation: very-subtle-glow var(--animation-longer-duration) infinite
		alternate;
}
</style>
