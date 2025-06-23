<script setup lang="ts">
type Props = {
	y: number;
	x: number;
} & (
	| {
			/** @see GridTemplateParser.constructor */
			template: string;
			width?: number;
			height?: number;
	  }
	| {
			/** @see GridTemplateParser.constructor */
			template?: undefined;
			width: number;
			height: number;
	  }
);

defineProps<Props>();
</script>

<template>
	<slot />
</template>

<style scoped></style>
