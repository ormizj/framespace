<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });

const gridElements = ref<HTMLDivElement | null>(null);

const xGrid = ref(10);
const yGrid = ref(10);
const cellHeight = ref(10);
const cellHeightPx = ref<number>(0);
const cellWidthPx = ref<number>(0);

const gridCellElements = ref<null | HTMLGridElement[]>(null);
const gridCells = ref<GridCell[]>([{
    cellX: 1,
    cellY: 1,
    cellWidth: 6,
    cellHeight: 3,
    link,
}, {
    cellX: 1,
    cellY: 20,
    cellWidth: 1,
    cellHeight: 1,
    link,
}]);


// helper functions
const calcCellDvw = (gridCell: GridCell) => {
    const gridWidth = gridCell.cellWidth * cellWidthPx.value;
    return gridWidth / window.innerWidth * 100;
}
const calcCellDvh = (gridCell: GridCell) => {
    const gridHeight = gridCell.cellHeight * cellHeightPx.value;
    return gridHeight / window.innerHeight * 100;
}
const getElementX = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('x')!;
const getElementY = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('y')!;
const getSelectedCell = (element: HTMLGridElement) => gridCells.value.find(
    gridCell => gridCell.cellX === getElementX(element) && gridCell.cellY === getElementY(element)
);

// GridCell drag
let dragged: GridCell | undefined;
const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    dragged = getSelectedCell(target);
    setTimeout(() => {
        target.style.pointerEvents = 'none';
    });
}
const handleDragEnd = (e: DragEvent) => {
    const target = e.target as HTMLCellElement
    target.style.pointerEvents = '';
}
const handleDragDrop = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    dragged!.cellX = getElementX(target);
    dragged!.cellY = getElementY(target);
    dragged = undefined;
}

// HTMLGridElement Observer
const gridCellResizeObs = new ResizeObserver((entries) => {
    const target = entries[0].target as HTMLGridElement;
    cellWidthPx.value = target.clientWidth;
    cellHeightPx.value = target.clientHeight;
});
onMounted(() => {
    const gridCell = gridElements.value!.children[0].children[0] as HTMLGridElement;
    gridCellResizeObs.observe(gridCell);
})



const handleMouseUp = () => { }
const resized = ref(null);
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }" @mouseenter="resized = null"
        @mousedown="resized = null">
        <!-- GRID Y -->
        <div v-for="y in yGrid" class="y-grid" :style="{ height: `${cellHeight}dvh` }">
            <!-- GRID X -->
            <div v-for="x in xGrid" class="x-grid" @drop="handleDragDrop" @dragover.prevent @mouseup="handleMouseUp"
                :x="x" :y=y>
                <!-- GRID CELL -->
                <template v-for="gridCell of gridCells">
                    <template v-if="gridCell.cellX === x && gridCell.cellY === y">
                        <div class="grid-cell" ref="gridCellElements" :class="{ resizing: !!resized }"
                            :draggable="editModel" @dragstart="handleDragStart" @dragend="handleDragEnd" :x="x" :y="y"
                            :style="{
                                width: `${calcCellDvw(gridCell)}dvw`,
                                height: `${calcCellDvh(gridCell)}dvh`
                            }">
                            <iframe :src="gridCell.link" class="iframe" />
                        </div>
                    </template>
                </template>
                <!-- GRID CELL -->
            </div>
            <!-- GRID X -->
        </div>
        <!-- GRID Y -->
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

    .grid-cell {
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

    .grid-cell {
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

    .grid-cell {
        pointer-events: none;
    }
}
</style>