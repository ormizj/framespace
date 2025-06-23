<script setup lang="ts">
type Props = {
	y: number;
	x: number;
} & (
	| {
			template: string;
			width?: number;
			height?: number;
	  }
	| {
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
