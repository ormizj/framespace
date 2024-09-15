<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });
const gridElements = ref<HTMLDivElement | null>(null);
const yGrid = ref(10);
const xGrid = ref(10);
const gridHeight = ref(10);


let dragged = null as HTMLElement | null;
const handleDrag = (e: DragEvent) => {
    dragged = e.target as HTMLElement;
}

const handleDrop = (e: DragEvent) => {
    const target = e.target! as HTMLElement;
    for (const el of target.children) if (el.parentNode === dragged) return;
    target.appendChild(dragged!)
}
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }">
        <div v-for="i in yGrid" class="y-grid" :style="`height: ${gridHeight}dvh;`">
            <div v-for="j in xGrid" class="x-grid" @drop="handleDrop" @dragover.prevent>

                <template v-if="i === 1 && j === 1">
                    <div class="grid-snap" :draggable="editModel" @dragstart="handleDrag">
                        <iframe :src="link" class="iframe" />
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<style scoped>
.y-grid {
    display: flex;
    width: 100%;
}

.x-grid {
    height: 100%;
    width: 100%;

    outline: 1px solid whitesmoke;
}

.grid-elements {
    width: 100%;
    min-height: 100dvh;

    .grid-snap {
        width: 100%;
        height: 100%;
    }

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