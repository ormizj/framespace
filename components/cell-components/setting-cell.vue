<script lang="ts" setup>

</script>

<template>
  <div class="setting-cell">
    <div class="inputs">
      <label>Input</label>
      &nbsp;&nbsp;&nbsp;
      <input class="setting-input" />
    </div>
  </div>
</template>

<style>
.setting-cell {
  background-color: var(--background);
  outline: 1px dashed var(--secondary);
  border-radius: 25px;
  overflow: hidden !important;

  .inputs {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .setting-input {
      width: 100px;
    }
  }
}
</style>