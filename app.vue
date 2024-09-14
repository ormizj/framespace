<script setup lang="ts">
const iframe = ref<IframeHTMLAttributes | null>(null);
const link = ""
const input = ref('www.youtube.com');

const formatUrl = (url: string) => {
  return url.startsWith('https://') ? url : `https://${url}`
}

const setIframeSrc = async (url: string) => {
  iframe.value!.src = formatUrl(url);
}

const handleSubmit = async () => {
  setIframeSrc(input.value);
}
</script>

<template>
  <div class="app">
    <div>
      <form @submit.prevent="handleSubmit">
        <input v-model="input" />
        <button type="submit">Load Iframe</button>
      </form>
    </div>
    <iframe ref="iframe" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
}

iframe {
  height: 100%;
  width: 100%;
  border: unset;
}
</style>

<style>
body {
  background-color: rgb(25, 25, 25);
  margin: 0;
}
</style>
