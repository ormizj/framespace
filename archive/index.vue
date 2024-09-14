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
    <div>
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
iframe {
    height: 100%;
    width: 100%;
    border: unset;
}
</style>