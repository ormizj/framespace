<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		title: string;
		forId?: string;
	}>(),
	{
		forId: undefined,
	}
);

const focus = () => {
	if (!props.forId) return;
	const element = document.getElementById(props.forId);
	if (!element) return;
	setTimeout(() => element.focus());
};
</script>

<template>
	<div class="setting-cell">
		<div class="input-block">
			<div class="label-container">
				<label @mousedown="focus" :for="forId">{{ title }}</label>
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

		.label-container {
			display: flex;
			width: 100%;
			justify-content: center;

			label {
				cursor: pointer;
			}
		}
	}
}
</style>
