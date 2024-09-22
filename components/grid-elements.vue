<script setup lang="ts">
import type GridCell from '~/classes/GridCell';
import { ANIMATION_LONG_DURATION, ANIMATION_REPEAT_COUNT } from '~/constants/style';

const modelGridCells = defineModel<GridCell[]>({ required: true });
const modelEdit = defineModel('edit', { default: false });

const props = withDefaults(defineProps<{
    xGridBoundary: number;
    yGridBoundary: number;
    cellHeight: number;
    alwaysInteractive?: boolean
}>(), {
    alwaysInteractive: false
});

const gridElements = ref<HTMLDivElement | null>(null);
const gridCellElements = ref<null | HTMLGridElement[]>(null);
const cellHeightPx = ref<number>(0);
const cellWidthPx = ref<number>(0);

watch(modelEdit, () => {
    clearAllGridCellAnimations();
    clearGridElementsAnimation();
});


// GridCell Helper Functions
const getGridCellFromElement = (element: HTMLGridElement | HTMLCellElement) => modelGridCells.value.find(
    gridCell => gridCell.xGrid === getGridElementXGrid(element) && gridCell.yGrid === getGridElementYGrid(element)
);
const isTargetZoneOccupied = (gridCellId: string, gridCellCoordinates: GridCellCoordinates): GridCell | undefined => {
    const occupyingGridCell = modelGridCells.value.find((otherGridCell) => {
        const otherCoordinates = otherGridCell.gridCellCoordinates;
        return (
            gridCellCoordinates.strX <= otherCoordinates.endX &&
            gridCellCoordinates.endX >= otherCoordinates.strX &&
            gridCellCoordinates.strY <= otherCoordinates.endY &&
            gridCellCoordinates.endY >= otherCoordinates.strY
        ) && gridCellId !== otherGridCell.id;
    })
    return occupyingGridCell;
}
const isGridCellInBounds = (gridCellYGridEnd: number, gridCellXGridEnd: number): boolean => {
    return props.yGridBoundary >= gridCellYGridEnd && props.xGridBoundary >= gridCellXGridEnd;
}
const isGridCellSizeValid = (gridCellHeight: number, gridCellWidth: number) => {
    return gridCellHeight > 0 && gridCellWidth > 0;
}
const gridCellsAnimationTimeouts = new Map();
const addGridCellAnimation = (gridCell: GridCell) => {
    const className = 'error-animation';
    gridCell.initialClasses.delete(className);
    clearTimeout(gridCellsAnimationTimeouts.get(gridCell));

    setTimeout(() => {
        gridCell.initialClasses.add(className)
    });
    gridCellsAnimationTimeouts.set(gridCell, setTimeout(() => {
        gridCell.initialClasses.delete(className);
    }, ANIMATION_LONG_DURATION * ANIMATION_REPEAT_COUNT * 2));
}
const clearAllGridCellAnimations = () => {
    modelGridCells.value.forEach((gridCell) => {
        gridCell.initialClasses = new Set();
    });
}


// GridCell Enforcements
const enforceNoOverlap = (gridCellId: string, gridCellCoordinates: GridCellCoordinates): boolean => {
    const occupyingGridCell = isTargetZoneOccupied(gridCellId, gridCellCoordinates);
    if (!occupyingGridCell) return false;
    addGridCellAnimation(occupyingGridCell);
    return true;
}
const enforceBoundsAxis = (gridCellYGridEnd: number, gridCellXGridEnd: number): boolean => {
    const willBeInBounds = isGridCellInBounds(gridCellYGridEnd, gridCellXGridEnd);
    if (willBeInBounds) return false;
    addGridElementsAnimation();
    return true;
}
const enforceNoInvalidSize = (gridCell: GridCell, newHeight: number, newWidth: number): boolean => {
    const isValidSize = isGridCellSizeValid(newHeight, newWidth);
    if (isValidSize) return false;
    addGridCellAnimation(gridCell);
    return true;
}


// GridCell Drag
let dragged: GridCell | undefined;
const stopResizeMouseUp = ref(false);
const handleDragStart = (e: DragEvent) => {
    stopResizeMouseUp.value = true;
    const target = e.target as HTMLGridElement;
    dragged = getGridCellFromElement(target);
    setTimeout(() => {
        target.style.pointerEvents = 'none';
    });
}
const handleDragEnd = (e: DragEvent) => {
    const target = e.target as HTMLCellElement
    target.style.pointerEvents = '';
}
const handleDragDrop = (e: DragEvent) => {
    isMouseDown.value = false;
    const target = e.target as HTMLGridElement;
    const targetYGrid = getGridElementYGrid(target);
    const targetXGrid = getGridElementXGrid(target);
    const newCoordinates = getGridCellCoordinates({
        yGrid: targetYGrid,
        xGrid: targetXGrid,
        height: dragged!.height,
        width: dragged!.width,
    })

    // Enforcements
    const wasEnforced = enforceNoOverlap(dragged!.id, newCoordinates) || enforceBoundsAxis(newCoordinates.endY, newCoordinates.endX);
    if (!wasEnforced) {
        dragged!.yGrid = targetYGrid;
        dragged!.xGrid = targetXGrid;
    }

    clearFutureGridCells();
    dragged = undefined;
}
const handleDragOn = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    addFutureGridCellDrag(target);
}
let previousTargetYGrid: number;
let previousTargetXGrid: number;
const addFutureGridCellDrag = (target: HTMLGridElement) => {
    const targetYGrid = getGridElementYGrid(target);
    const targetXGrid = getGridElementXGrid(target);
    if (previousTargetYGrid === targetYGrid && previousTargetXGrid === targetXGrid) return;
    previousTargetYGrid = targetYGrid;
    previousTargetXGrid = targetXGrid;
    const newCoordinates = getGridCellCoordinates({
        yGrid: targetYGrid,
        xGrid: targetXGrid,
        height: dragged!.height,
        width: dragged!.width,
    });

    const futureGridCellElement = document.createElement('div');
    futureGridCellElement.style.width = `${calcGridCellWidthPx(dragged!.width)}px`;
    futureGridCellElement.style.height = `${calcGridCellHeightPx(dragged!.height)}px`;
    futureGridCellElement.classList.add('future-grid-cell');

    // Enforcements
    const invalidZone = isTargetZoneOccupied(dragged!.id, newCoordinates) || !isGridCellInBounds(newCoordinates.endY, newCoordinates.endX);
    if (invalidZone) futureGridCellElement.classList.add('error');

    clearFutureGridCells();
    target.appendChild(futureGridCellElement);
}


// GridCell Resize
let resized = ref<GridCell | undefined>(undefined);
let isMouseDown = ref<boolean>(false);
const gridCellResizeObs = new ResizeObserver((obs) => {
    if (stopResizeMouseUp.value) {
        stopResizeMouseUp.value = false;
        return;
    }
    if (!resized.value && isMouseDown.value && !dragged) {
        resized.value = getGridCellFromElement(obs[0].target as HTMLCellElement);
    }
});
const handleMouseEnter = (e: MouseEvent) => {
    if (!resized.value) return;
    const target = e.target as HTMLGridElement;
    addFutureGridCellResize(resized.value!, target);
}
const handleMouseUp = (e: MouseEvent) => {
    isMouseDown.value = false;
    nextTick(() => {
        resized.value = undefined;
    });
    if (!resized.value) return;

    const target = e.target as HTMLGridElement;
    const newHeight = getGridElementYGrid(target) - resized.value!.yGrid + 1;
    const newWidth = getGridElementXGrid(target) - resized.value!.xGrid + 1;
    const newCoordinates = getGridCellCoordinates({
        yGrid: resized.value!.yGrid,
        xGrid: resized.value!.xGrid,
        height: newHeight,
        width: newWidth,
    });

    // Enforcements
    const wasEnforced = enforceNoOverlap(resized.value!.id, newCoordinates) || enforceNoInvalidSize(resized.value!, newHeight, newWidth);
    if (!wasEnforced) {
        resized.value!.height = newHeight;
        resized.value!.width = newWidth;
    }

    const clearFutureGridCellsInterval = setInterval(() => {
        clearFutureGridCells();
    }, 1)
    setTimeout(() => {
        clearInterval(clearFutureGridCellsInterval)
        resized.value = undefined;
    }, 250);
}
watch(() => gridCellElements.value, () => {
    gridCellElements.value!.forEach((gridCellElement) => gridCellResizeObs.observe(gridCellElement))
}, { deep: true });
const addFutureGridCellResize = (gridCell: GridCell, target: HTMLGridElement) => {
    const targetYGrid = getGridElementYGrid(target);
    const targetXGrid = getGridElementXGrid(target);
    const targetHeight = targetYGrid - gridCell.yGrid + 1;
    const targetWidth = targetXGrid - gridCell.xGrid + 1;
    const newCoordinates = getGridCellCoordinates({
        yGrid: targetYGrid,
        xGrid: targetXGrid,
        height: targetHeight,
        width: targetWidth,
    });

    const futureGridCellElement = document.createElement('div');
    futureGridCellElement.style.height = `${calcGridCellHeightPx(targetHeight)}px`;
    futureGridCellElement.style.width = `${calcGridCellWidthPx(targetWidth)}px`;
    futureGridCellElement.classList.add('future-grid-cell');

    // Enforcements
    const invalidZone = isTargetZoneOccupied(resized.value!.id, newCoordinates) || !isGridCellSizeValid(targetHeight, targetWidth);
    if (invalidZone) futureGridCellElement.classList.add('error');

    clearFutureGridCells();
    getGridXFromXY(gridCell.xGrid, gridCell.yGrid).appendChild(futureGridCellElement);
}


// GridElements Observer
const gridXResizeObs = new ResizeObserver((entries) => {
    const target = entries[0].target as HTMLGridElement;
    const rect = target.getBoundingClientRect();
    cellWidthPx.value = rect.width;
    cellHeightPx.value = rect.height;
});
onMounted(() => {
    const gridX = gridElements.value!.children[0].children[0] as HTMLGridElement;
    gridXResizeObs.observe(gridX);
})

// GridElements Helper Functions
let gridElementsAnimationTimeout: ReturnType<typeof setTimeout>;
const addGridElementsAnimation = () => {
    const className = 'error-animation-inset';
    gridElements.value!.classList.remove(className);
    clearTimeout(gridElementsAnimationTimeout);

    setTimeout(() => {
        gridElements.value!.classList.add(className);
    });
    gridElementsAnimationTimeout = setTimeout(() => {
        gridElements.value!.classList.remove(className);
    }, ANIMATION_LONG_DURATION * ANIMATION_REPEAT_COUNT * 2);
}
const clearGridElementsAnimation = () => {
    const className = 'error-animation-inset';
    gridElements.value!.classList.remove(className);
}
const getGridXFromXY = (x: number, y: number) => {
    return gridElements.value!.children[y - 1].children[x - 1] as HTMLGridElement
}


const clearFutureGridCells = () => document.querySelectorAll('.future-grid-cell').forEach((element) => element.remove());
const calcGridCellHeightPx = (gridCellHeight: number) => gridCellHeight * cellHeightPx.value;
const calcGridCellWidthPx = (gridCellWidth: number) => gridCellWidth * cellWidthPx.value;
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: modelEdit }" @mouseenter="resized = undefined">
        <!-- GRID Y -->
        <div v-for="y in yGridBoundary" class="y-grid" :style="{ height: `${cellHeight}dvh` }" :key="y">
            <!-- GRID X -->
            <div v-for="x in xGridBoundary" class="x-grid" @drop="handleDragDrop" @mouseup="handleMouseUp"
                @mousedown="isMouseDown = true" @mouseenter="handleMouseEnter" @dragover.prevent="handleDragOn" :x="x"
                :y=y :key="x">
                <!-- GRID CELL -->
                <template v-for="gridCell of modelGridCells" :key="gridCell.id">
                    <template v-if="gridCell.xGrid === x && gridCell.yGrid === y">
                        <div class="grid-cell" ref="gridCellElements"
                            :class="[{ resizing: resized }, ...gridCell.initialClasses]" :draggable="modelEdit"
                            @dragstart="handleDragStart" @dragend="handleDragEnd" :y="y" :x="x" :style="{
                                height: `${calcGridCellHeightPx(gridCell.height)}px`,
                                width: `${calcGridCellWidthPx(gridCell.width)}px`,
                            }">
                            <component
                                :class="['cell-component', { 'always-interactive': alwaysInteractive && !isMouseDown }]"
                                :is="gridCell.component.is" v-bind="{
                                    ...gridCell.component.props,
                                    ...gridCell.component.bind,
                                    ...gridCell.component.emits,
                                    ...gridCell.component.exposed,
                                }" />
                            <!-- TODO gridCell slots -->
                            <!-- {{ gridCell.component.slots }} -->
                            <!-- </component> -->
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
    outline: 1px solid var(--secondary);

    &:hover {
        background-color: color-mix(in srgb, var(--secondary), transparent 50%);
    }
}

.grid-elements {
    position: relative;

    .grid-cell {
        position: absolute;
        max-width: 100%;
    }

    .cell-component {
        width: 100%;
        height: 100%;
    }
}

/* gridElements edit */
.grid-elements.edit {
    overflow: hidden;

    .cell-component:not(.always-interactive) {
        pointer-events: none;
    }

    .grid-cell {
        pointer-events: auto;
        resize: both;
        overflow: hidden;
        cursor: grab;

        &.resizing {
            pointer-events: none;
        }

        &::-webkit-scrollbar {
            visibility: hidden;
            cursor: default;
        }

        &::-webkit-scrollbar-corner {
            outline: 1px dashed var(--secondary);
        }
    }
}

/* gridElements not edit */
.grid-elements:not(.edit) {
    .cell-component {
        pointer-events: auto;
    }

    .grid-cell {
        pointer-events: none;
        background-color: var(--background);
    }
}

/* animations */
@keyframes subtle-glow {
    from {
        box-shadow: 0 0 0px transparent;
    }

    to {
        box-shadow: 0 0 100px var(--error);
    }
}

.error-animation {
    animation: subtle-glow var(--animation-long-duration) calc(var(--animation-repeat-count) * 2) alternate;
}

@keyframes subtle-glow-inset {
    from {
        box-shadow: 0 0 0px inset transparent;
    }

    to {
        box-shadow: 0 0 100px inset var(--error);
    }
}

.error-animation-inset {
    animation: subtle-glow-inset var(--animation-long-duration) calc(var(--animation-repeat-count) * 2) alternate;
}

@keyframes subtle-gold {
    from {
        box-shadow: 0 0 0px inset transparent;
    }

    to {
        box-shadow: 0 0 100px inset var(--gold);
    }
}

.golden-animation {
    animation: subtle-glow var(--animation-long-duration) infinite alternate;
}
</style>

<style>
/* target placeholder */
.future-grid-cell {
    position: absolute;
    pointer-events: none;
    box-shadow: 0 0 100px inset;
    color: var(--success);
    z-index: 1;

    &.error {
        color: var(--error);
    }
}
</style>