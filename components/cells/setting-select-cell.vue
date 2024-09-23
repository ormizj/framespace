<script lang="ts" generic="T" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtSelect from '../UI/nuxt-select.vue';

const props = withDefaults(defineProps<{
    id: string;
    formatter?(option: T): string;
    setRef?(toSet: HTMLSelectElement): void;
}>(), {
    formatter: (option: T) => option as string,
    setRef: () => { },
});
const model = defineModel();
const modelOptions = defineModel('options');

const nuxtSelectRef = ref<ComponentExposed<typeof NuxtSelect>>();
onMounted(() => {
    props.setRef(nuxtSelectRef.value!.selectRef!);
});
</script>

<template>
    <div class="setting-cell">
        <div class="select-block">
            <div class="select-container">
                <NuxtSelect v-model="model" :name="id" ref="nuxtSelectRef" :id="id" class="select">
                    <option v-for="option in modelOptions" :key="option" :value="option">
                        {{ formatter(option) }}
                    </option>
                </NuxtSelect>
            </div>
        </div>
    </div>
</template>

<style scoped>
.setting-cell {
    background-color: var(--background);
    outline: 1px dashed var(--secondary);
    border-radius: var(--border-glow-radius);

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
                width: 75%;
            }
        }
    }
}
</style>