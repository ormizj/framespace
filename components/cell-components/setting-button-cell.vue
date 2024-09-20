<script lang="ts" setup>
defineProps<{
    title: string;
    onClick(): void;
}>()
</script>

<template>
    <div class="setting-cell">
        <div class="button-block">
            <div class="button-container">
                <button class="button" @mousedown="onClick">{{ title }}</button>
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