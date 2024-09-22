<script lang="ts" setup>
const props = defineProps<{
    id: string;
    type: 'text' | 'number' | 'email';
}>()
const model = defineModel();

const handleInput = (event: KeyboardEvent) => {
    if (
        props.type === 'number' &&
        !/[0-9]/.test(event.key) &&
        event.key !== 'Backspace' &&
        event.key !== 'Delete'
    ) event.preventDefault();
};
</script>

<template>
    <div class="setting-cell">
        <div class="input-block">
            <div class="input-container">
                <input v-model="model" @keypress="handleInput" :name="id" :id="id" :type="type" class="input" />
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