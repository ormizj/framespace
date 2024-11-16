<script lang="ts" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtInput from '../UI/nuxt-input.vue';

const props = withDefaults(
	defineProps<{
		title: string;
		id: string;
		type: 'text' | 'number' | 'email';
		required?: boolean;
		min?: number;
		max?: number;
		form?: string;
		setRef?(toSet: HTMLInputElement): void;
		onKeydown?: (event: KeyboardEvent) => void;
	}>(),
	{
		required: false,
		min: undefined,
		max: undefined,
		form: undefined,
		setRef: () => {},
		onKeydown: () => {},
	}
);
const model = defineModel();

const nuxtInputRef = ref<ComponentExposed<typeof NuxtInput>>();
onMounted(() => {
	props.setRef(nuxtInputRef.value!.inputRef!);
});

const focus = () => {
	setTimeout(() => nuxtInputRef.value!.inputRef!.focus());
};

const handleInput = (event: KeyboardEvent) => {
	props.onKeydown?.(event);

	const inputElement = nuxtInputRef.value!.inputRef;
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
			<div class="label-container">
				<label @mousedown="focus" :for="id">{{ title }}</label>
			</div>
			<div class="input-container">
				<NuxtInput
					:form="form"
					:required="required"
					:min="min"
					:max="max"
					v-model="model"
					ref="nuxtInputRef"
					:name="id"
					:id="id"
					:type="type"
					class="input"
					@keydown="handleInput"
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
		justify-content: space-between;
		gap: 1rem;

		.label-container {
			display: flex;
			width: 100%;
			justify-content: end;

			label {
				cursor: pointer;
			}
		}

		.input-container {
			display: flex;
			width: 100%;
			justify-content: start;

			.input {
				width: 75%;
			}
		}
	}
}
</style>
