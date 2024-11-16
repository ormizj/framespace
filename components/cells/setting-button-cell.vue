<script lang="ts" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtInput from '~/components/UI/nuxt-input.vue';

const props = withDefaults(
	defineProps<{
		title: string;
		onClick(): void;
		type?: 'submit' | 'reset';
		form?: string;
		setRef?(toSet: HTMLInputElement): void;
	}>(),
	{
		type: undefined,
		form: undefined,
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
				<NuxtButton
					class="button"
					ref="nuxtInputRef"
					@mousedown="onClick"
					:form="form"
					:type="type"
				>
					{{ title }}
				</NuxtButton>
			</div>
		</div>

		<form
			class="form"
			@submit.prevent="onClick"
			v-if="form && type === 'submit'"
			:id="form"
		/>
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

	.form {
		display: none;
	}
}
</style>
