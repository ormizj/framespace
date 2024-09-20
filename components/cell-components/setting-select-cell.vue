<script lang="ts" setup>
defineProps<{
    options: string[];
    id: string;
}>()
const model = defineModel();

</script>

<template>
    <div class="setting-cell">
        <div class="select-block">
            <div class="select-container">
                <select v-model="model" :name="id" :id="id" class="select">
                    <option v-for="option in options" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>
.setting-cell {
    background-color: var(--background);
    outline: 1px dashed var(--secondary);
    border-radius: 25px;
    overflow: hidden !important;

    .select-block {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        .select-container {
            display: flex;
            width: 100%;
            justify-content: center;

            .select {
                max-width: 75%;
            }
        }
    }
}
</style>