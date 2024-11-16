<script lang="ts" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtInput from '~/components/UI/nuxt-input.vue';

const props = withDefaults(
	defineProps<{
		title: string;
		onClick(): void;
		setRef?(toSet: HTMLInputElement): void;
	}>(),
	{
		setRef: () => {},
	}
);

const nuxtInputRef = ref<ComponentExposed<typeof NuxtInput>>();
onMounted(() => {
	props.setRef(nuxtInputRef.value!.inputRef!);
});
</script>

<template>
	<div class="setting-cell">
		<div class="button-block">
			<div class="button-container">
				<NuxtButton class="button" ref="nuxtInputRef" @mousedown="onClick">
					{{ title }}
				</NuxtButton>
			</div>
		</div>
	</div>
</template>

<style scoped>
.setting-cell {
	background-color: var(--background);
	outline: 1px dashed var(--secondary);
	border-radius: var(--border-glow-radius);

	.button-block {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;

		.button-container {
			display: flex;
			width: 100%;
			justify-content: center;
		}
	}
}
</style>
