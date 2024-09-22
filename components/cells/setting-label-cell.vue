<script lang="ts" setup>
defineProps<{
    title: string;
    id: string;
}>()
</script>

<template>
    <div class="setting-cell">
        <div class="input-block">
            <div class="label-container">
                <label :for="id">{{ title }}</label>
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
        }
    }}
</style>