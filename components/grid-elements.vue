<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });

const gridElements = ref<HTMLDivElement | null>(null);

const yGrid = ref(30);
const xGrid = ref(10);
const gridHeight = ref(10);

// drag event
let dragged = ref<null | HTMLDivElement>(null);

const handleDragStart = (e: DragEvent) => {
    dragged.value = e.target as HTMLDivElement;
    setTimeout(() => {
        dragged.value!.style.pointerEvents = 'none';
    });
}
const handleDragEnd = () => {
    dragged.value!.style.pointerEvents = '';
}
const handleDrop = (e: DragEvent) => {
    const target = e.target! as HTMLElement;
    for (const el of target.children) if (el.parentNode === dragged.value) return;
    target.appendChild(dragged.value!);
    dragged.value = null;
}

// const snapToGrid = (element: HTMLElement) => {
//     if (!gridElements.value) return;

//     const gridRect = gridElements.value.getBoundingClientRect();
//     const cellWidth = gridRect.width / xGrid.value;
//     const cellHeight = gridRect.height / yGrid.value;

//     const rect = element.getBoundingClientRect();
//     const parentRect = element.parentElement!.getBoundingClientRect();

//     const left = Math.round((rect.left - parentRect.left) / cellWidth) * cellWidth;
//     const top = Math.round((rect.top - parentRect.top) / cellHeight) * cellHeight;
//     const width = Math.round(rect.width / cellWidth) * cellWidth;
//     const height = Math.round(rect.height / cellHeight) * cellHeight;

//     element.style.left = `${left}px`;
//     element.style.top = `${top}px`;
//     element.style.width = `${width}px`;
//     element.style.height = `${height}px`;
// }

// resize event
const gridSnaps = ref<null | HTMLDivElement[]>(null)
const resized = ref<null | HTMLDivElement>(null);
const resizeObserver = new ResizeObserver((obs) => {
    if (!resized.value) resized.value = obs[0].target as HTMLDivElement;
});

const handleMouseUp = (e: MouseEvent) => {
    if (!resized.value) return;
    const el = e.target! as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    console.log(rect.height);
    console.log(rect.width);
}
onMounted(() => {
    gridSnaps.value!.forEach((gridSnap) => {
        resizeObserver.observe(gridSnap);
    })
});
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }" @mouseup="resized = null"
        @mouseenter="resized = null">
        <div v-for="i in yGrid" class="y-grid" :style="`height: ${gridHeight}dvh;`">
            <div v-for="j in xGrid" class="x-grid" @drop="handleDrop" @dragover.prevent @mouseup="handleMouseUp">

                <template v-if="i === 1 && j === 1">
                    <div class="grid-snap" ref="gridSnaps" :class="{ resizing: !!resized }" :draggable="editModel"
                        @dragstart="handleDragStart" @dragend="handleDragEnd">
                        <iframe :src="link" class="iframe" />
                    </div>
                </template>

                <template v-if="i === 20 && j === 1">
                    <div class="grid-snap" ref="gridSnaps" :class="{ resizing: !!resized }" :draggable="editModel"
                        @dragstart="handleDragStart" @dragend="handleDragEnd">
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
    outline: 1px solid var(--secondary-color);

    &:hover {
        background-color: color-mix(in srgb, var(--secondary-color), transparent 50%);
    }
}

.grid-elements {
    width: 100%;
    min-height: 100dvh;

    .grid-snap {
        position: absolute;
        height: 100%;
        width: 100%;
        max-width: 100%;
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
        resize: both;
        overflow: auto;

        &.resizing {
            pointer-events: none;
        }

        &::-webkit-scrollbar {
            visibility: hidden;
        }

        &::-webkit-scrollbar-corner {
            outline: 1px dashed var(--secondary-color);
        }
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