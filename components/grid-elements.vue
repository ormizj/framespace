<script setup lang="ts">
// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"
const editModel = defineModel('edit', { default: false });

const gridElements = ref(null);

const xGrid = ref(10);
const yGrid = ref(10);
const cellHeight = ref(10);

const gridCellElements = ref<null | HTMLGridElement[]>(null);
const gridCells = ref<GridCell[]>([{
    strX: 1,
    strY: 1,
    endX: 1,
    endY: 1,
    link,
}, {
    strX: 1,
    strY: 20,
    endX: 1,
    endY: 1,
    link
}]);


const getElementX = (element: HTMLGridElement) => +element.getAttribute('x')!;
const getElementY = (element: HTMLGridElement) => +element.getAttribute('y')!;
const getSelectedCell = (element: HTMLGridElement) => gridCells.value.find(
    gridCell => gridCell.strX === getElementX(element) && gridCell.strY === getElementY(element)
);


// gridSnaps drag
let dragged: GridCell | undefined;
const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    dragged = getSelectedCell(target);

    setTimeout(() => {
        target.style.pointerEvents = 'none';
    });
}
const handleDragDrop = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    target.style.pointerEvents = '';
    dragged!.strX = getElementX(target);
    dragged!.strY = getElementY(target);
    dragged = undefined;
}


const handleMouseUp = () => { }
const resized = ref(null);
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }" @mouseenter="resized = null"
        @mousedown="resized = null">
        <!-- GRID Y -->
        <div v-for="y in yGrid" class="y-grid" :style="`height: ${cellHeight}dvh;`">
            <!-- GRID X -->
            <div v-for="x in xGrid" class="x-grid" @drop="handleDragDrop" @dragover.prevent @mouseup="handleMouseUp"
                :x="x" :y=y>
                <!-- GRID CELL -->
                <template v-for="gridCell of gridCells">
                    <template v-if="gridCell.strX === x && gridCell.strY === y">
                        <div class="grid-snap" ref="gridCellElements" :class="{ resizing: !!resized }"
                            :draggable="editModel" @dragstart="handleDragStart" :x="x" :y="y">
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