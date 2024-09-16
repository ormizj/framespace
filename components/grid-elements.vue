<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });

const gridElements = ref<HTMLDivElement | null>(null);
const yGrid = ref(10);
const xGrid = ref(10);
const gridHeight = ref(10);

// gridSnaps drag
let dragged = ref<null | HTMLDivElement>(null);

const handleDragStart = (e: DragEvent) => {
    dragged.value = e.target as HTMLDivElement;
    setTimeout(() => {
        dragged.value!.style.pointerEvents = 'none';
    });
}
const handleDragEnd = () => {
    dragged.value!.style.pointerEvents = '';
    dragged.value = null;
}
const handleDrop = (e: DragEvent) => {
    const target = e.target! as HTMLElement;
    for (const el of target.children) if (el.parentNode === dragged.value) return;
    target.appendChild(dragged.value!);
}

// gridSnaps resize
const gridSnaps = ref<null | HTMLDivElement[]>(null)
const resized = ref<null | HTMLDivElement>(null);
const gridSnapResizeObs = new ResizeObserver((obs) => {
    if (!resized.value) resized.value = obs[0].target as HTMLDivElement;
});

const handleMouseUp = (e: MouseEvent) => {
    if (!resized.value) return;

    const source = resized.value as HTMLDivElement
    const target = e.target as HTMLDivElement

    const targetRect = target.getBoundingClientRect();
    const height = Math.abs(source.offsetTop - target.offsetTop) + targetRect.height;
    const width = Math.abs(source.offsetLeft - target.offsetLeft) + targetRect.width;

    const HeightDvh = (height / window.innerHeight) * 100;
    const widthDvw = (width / window.innerWidth) * 100;

    source.style.height = `${HeightDvh}dvh`;
    source.style.width = `${widthDvw}dvw`;

    setTimeout(() => {
        resized.value = null;
    }, 250);
}

// gridElements resize
let prevOffset = 0;
const gridElementsResizeObs = new ResizeObserver((entries) => {
    const source = entries[0].target as HTMLDivElement;
    const newOffset = window.innerWidth - source.clientWidth;
    const offsetBy = prevOffset;
    prevOffset = newOffset;

    gridSnaps.value!.forEach((gridSnap) => {
        const target = gridSnap;

        const widthDiff = (target.clientWidth / (source.clientWidth + offsetBy)) * 100;
        const currentWidth = parseFloat(target.style.width);
        const widthToSub = widthDiff - currentWidth;
        const widthDvw = currentWidth - widthToSub;

        target.style.width = `${widthDvw}dvw`
    });
});

onMounted(() => {
    gridElementsResizeObs.observe(gridElements.value!);
    gridSnaps.value!.forEach((gridSnap) => {
        gridSnapResizeObs.observe(gridSnap);
    })
});
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }" @mouseenter="resized = null"
        @mousedown="resized = null">
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

/* gridElements edit */
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

/* gridElements not edit */
.grid-elements:not('.edit') {
    .iframe {
        pointer-events: auto;
    }

    .grid-snap {
        pointer-events: none;
    }
}
</style>