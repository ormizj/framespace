<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title: string;
  id: string;
  type: 'text' | 'number' | 'email';
  setRef?(toSet: typeof inputRef): void;
}>(), {
  setRef: () => { },
})
const model = defineModel();
const inputRef = ref<HTMLInputElement | null>(null);
const handleInput = (event: KeyboardEvent) => {
  if (
    props.type === 'number' &&
    !(/\d/).test(event.key) &&
    event.key !== 'Backspace' &&
    event.key !== 'Delete'
  ) {
    inputRef.value!.setCustomValidity('Invalid value');
    inputRef.value!.reportValidity();
    event.preventDefault();
  }
};

onMounted(() => {
  props.setRef(inputRef);
});
</script>

<template>
  <div class="setting-cell">
    <div class="input-block">
      <div class="label-container">
        <label :for="id">{{ title }}</label>
      </div>
      <div class="input-container">
        <input v-model="model" ref="inputRef" @keypress="handleInput" :name="id" :id="id" :type="type" class="input" />
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