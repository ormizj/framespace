<script lang="ts" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtInput from '../UI/nuxt-input.vue';

const props = withDefaults(
	defineProps<{
		id: string;
		type: 'text' | 'number' | 'email';
		required?: boolean;
		min?: number;
		max?: number;
		form?: string;
		setRef?(toSet: HTMLInputElement): void;
	}>(),
	{
		required: false,
		min: undefined,
		max: undefined,
		form: undefined,
		setRef: () => {},
	}
);
const model = defineModel();

const nuxtInputRef = ref<ComponentExposed<typeof NuxtInput>>();
onMounted(() => {
	props.setRef(nuxtInputRef.value!.inputRef!);
});

const handleInput = (event: KeyboardEvent) => {
	const inputElement = nuxtInputRef.value?.inputRef;
	inputElement!.setCustomValidity('');

	if (
		props.type === 'number' &&
		!/\d/.test(event.key) &&
		event.key.length === 1 &&
		inputElement
	) {
		inputElement.setCustomValidity('Please enter a number.');
		inputElement.reportValidity();
		event.preventDefault();
	}
};
</script>

<template>
	<div class="setting-cell">
		<div class="input-block">
			<div class="input-container">
				<NuxtInput
					:form="form"
					v-model="model"
					:required="required"
					:min="min"
					:max="max"
					ref="nuxtInputRef"
					@keydown="handleInput"
					:name="id"
					:id="id"
					:type="type"
					class="input"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.setting-cell {
	background-color: var(--background);
	outline: 1px dashed var(--secondary);
	border-radius: var(--border-glow-radius);

	.input-block {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		.input-container {
			display: flex;
			width: 100%;
			justify-content: center;

			.input {
				width: 75%;
			}
		}
	}
}
</style>
