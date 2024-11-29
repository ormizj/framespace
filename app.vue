<script setup lang="ts"></script>

<template>
	<div class="app">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<style scoped>
.app {
	width: 100dvw;
	height: 100dvh;
}
</style>

<style>
body {
	background-color: var(--background);
	color: var(--secondary);
	margin: 0;

	* {
		box-sizing: border-box;
	}
}
</style>

<style>
body {
	/* color */
	--background-values: 25, 25, 25;
	--background: rgb(var(--background-values));
	--secondary-values: 230, 230, 230;
	--secondary: rgb(var(--secondary-values));
	--success: rgb(25, 230, 25);
	--error: rgb(230, 25, 25);
	--gold-values: 255, 215, 0;
	--gold: rgb(var(--gold-values));
	--warning-values: 230, 128, 0;
	--warning: rgb(var(--warning-values));
	/* animation */
	--animation-short-duration: 0.25s;
	--animation-long-duration: 1s;
	--animation-longer-duration: 5s;
	--animation-repeat-count: 3;
	/* border */
	/*
	--border-glow-radius: 25px;

	 */
	/* layout */
	--tab-height: 2rem;
	--header-height: 4rem;
	--input-height: 1.5rem;
}
</style>
