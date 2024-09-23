<script lang="ts" setup>
import type { ComponentExposed } from 'vue-component-type-helpers';
import type NuxtInput from '../UI/nuxt-input.vue';

const props = withDefaults(defineProps<{
  title: string;
  id: string;
  type: 'text' | 'number' | 'email';
  required?: boolean;
  setRef?(toSet: HTMLInputElement): void;
}>(), {
  required: false,
  setRef: () => { },
})
const model = defineModel();

const nuxtInputRef = ref<ComponentExposed<typeof NuxtInput>>();
onMounted(() => {
  props.setRef(nuxtInputRef.value!.inputRef!);
});

const handleInput = (event: KeyboardEvent) => {
  const inputElement = nuxtInputRef.value?.inputRef;
  if (
    props.type === 'number' &&
    !(/\d/).test(event.key) &&
    event.key !== 'Backspace' &&
    event.key !== 'Delete' &&
    inputElement
  ) {
    inputElement.setCustomValidity('Invalid value');
    inputElement.reportValidity();
    event.preventDefault();
  }
};
</script>

<template>
  <div class="setting-cell">
    <div class="input-block">
      <div class="label-container">
        <label :for="id">{{ title }}</label>
      </div>
      <div class="input-container">
        <NuxtInput :required="required" v-model="model" ref="nuxtInputRef" @keypress="handleInput" :name="id" :id="id"
          :type="type" class="input" />
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