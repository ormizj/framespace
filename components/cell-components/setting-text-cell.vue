<script lang="ts" setup>
const props = defineProps<{
  title: string;
  id: string;
  type: 'text' | 'number';
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
      <div class="label-container">
        <label :for="id">{{ title }}</label>
      </div>
      <div class="input-container">
        <input v-model="model" @keypress="handleInput" :name="id" :id="id" :type="type" class="input" />
      </div>
    </div>
  </div>
</template>

<style>
.setting-cell {
  background-color: var(--background);
  outline: 1px dashed var(--secondary);
  border-radius: 25px;
  overflow: hidden !important;

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
        max-width: 50%;
      }
    }
  }
}
</style>