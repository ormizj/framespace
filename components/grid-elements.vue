<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });
const gridElements = ref<HTMLDivElement | null>(null);

onMounted(() => {

});
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }">
        <div class="grid-snap block1">
            <iframe :src="link" class="iframe" />
        </div>
        <div class="grid-snap block2">
            <iframe :src="link" class="iframe" />
        </div>
        <div class="grid-snap block3">
            <iframe :src="link" class="iframe" />
        </div>
    </div>
</template>

<style scoped>
.grid-elements {
    width: 100%;
    min-height: 100dvh;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(auto-fill, 10vh);

    .iframe {
        border: unset;
        width: 100%;
        height: 100%;
    }
}

.grid-elements.edit {
    .iframe {
        pointer-events: none;
    }

    .grid-snap {
        pointer-events: auto;
    }
}

.grid-elements:not('.edit') {
    .iframe {
        pointer-events: auto;
    }

    .grid-snap {
        pointer-events: none;
    }
}
</style>