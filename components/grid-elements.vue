<script setup lang="ts">
import type GridCell from '~/classes/GridCell';
import { ANIMATION_LONG_DURATION, ANIMATION_REPEAT_COUNT } from '~/constants/style';

const modelGridCells = defineModel<GridCell[]>({ required: true });
const modelEdit = defineModel('edit', { default: false });

const props = withDefaults(defineProps<{
    xGrid: number;
    yGrid: number;
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
const getElementX = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('x')!;
const getElementY = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('y')!;
const getGridCellFromElement = (element: HTMLGridElement | HTMLCellElement) => modelGridCells.value.find(
    gridCell => gridCell.xGrid === getElementX(element) && gridCell.yGrid === getElementY(element)
);
const setGridCellAxisFromCoordinates = (gridCell: GridCell, coordinates: GridCellCoordinates) => {
    gridCell.xGrid = coordinates.strX;
    gridCell.yGrid = coordinates.strY;
}
const setGridCellSizeFromCoordinates = (gridCell: GridCell, coordinates: GridCellCoordinates) => {
    gridCell.width = coordinates.endX - gridCell.xGrid + 1;
    gridCell.height = coordinates.endY - gridCell.yGrid + 1;
}
const isTargetZoneOccupied = (gridCell: GridCell): GridCell | undefined => {
    const coordinates = gridCell.gridCellCoordinates;
    const occupyingGridCell = modelGridCells.value.find((otherGridCell) => {
        const otherCoordinates = otherGridCell.gridCellCoordinates;
        return (
            coordinates.strX <= otherCoordinates.endX &&
            coordinates.endX >= otherCoordinates.strX &&
            coordinates.strY <= otherCoordinates.endY &&
            coordinates.endY >= otherCoordinates.strY
        ) && gridCell !== otherGridCell;
    })
    return occupyingGridCell;
}
const isGridCellInBounds = (gridCell: GridCell): boolean => {
    const coordinates = gridCell.gridCellCoordinates;
    return props.xGrid >= coordinates.endX && props.yGrid >= coordinates.endY;
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
const enforceNoOverlapAxis = (gridCellSource: GridCell, targetCoordinates: GridCellCoordinates): boolean => {
    const occupyingGridCell = isTargetZoneOccupied(gridCellSource);
    if (!occupyingGridCell) return false;
    addGridCellAnimation(occupyingGridCell);
    setGridCellAxisFromCoordinates(gridCellSource, targetCoordinates);
    return true;
}
const enforceBoundsAxis = (gridCellSource: GridCell, targetCoordinates: GridCellCoordinates): boolean => {
    const willBeInBounds = isGridCellInBounds(gridCellSource);
    if (willBeInBounds) return false;
    addGridElementsAnimation();
    setGridCellAxisFromCoordinates(gridCellSource, targetCoordinates);
    return true;
}
const enforceNoOverlapSize = (gridCellSource: GridCell, sourceCoordinates: GridCellCoordinates): boolean => {
    const occupyingGridCell = isTargetZoneOccupied(gridCellSource);
    if (!occupyingGridCell) return false;
    addGridCellAnimation(occupyingGridCell);
    setGridCellSizeFromCoordinates(gridCellSource, sourceCoordinates);
    return true;
}
const enforceNoNegativeSize = (gridCellSource: GridCell, sourceWidth: number, sourceHeight: number): boolean => {
    if (gridCellSource.width > 0 && gridCellSource.height > 0) return false;
    addGridCellAnimation(gridCellSource);
    gridCellSource.width = sourceWidth;
    gridCellSource.height = sourceHeight;
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
    const sourceCoordinates = dragged!.gridCellCoordinates;
    dragged!.xGrid = getElementX(target);
    dragged!.yGrid = getElementY(target);

    // Enforcements
    (
        enforceNoOverlapAxis(dragged!, sourceCoordinates) ||
        enforceBoundsAxis(dragged!, sourceCoordinates)
    )

    clearFutureGridCells();
    dragged = undefined;
}
const handleDragOn = (e: DragEvent) => {
    const target = e.target as HTMLGridElement;
    addFutureGridCellDrag(target, dragged!);
}

let isMouseDown = ref<boolean>(false);
// GridCell Resize
const resized = ref<HTMLCellElement | null>(null);
const gridCellResizeObs = new ResizeObserver((obs) => {
    if (stopResizeMouseUp.value) {
        stopResizeMouseUp.value = false;
        return;
    }
    if (!resized.value && isMouseDown.value && !dragged) resized.value = obs[0].target as HTMLCellElement;
});
const handleMouseEnter = (e: MouseEvent) => {
    if (!resized.value) return;
    const target = e.target as HTMLGridElement;
    addFutureGridCellResize(target, getGridCellFromElement(resized.value)!);
}
const handleMouseUp = (e: MouseEvent) => {
    isMouseDown.value = false;
    nextTick(() => {
        resized.value = null;
    });
    if (!resized.value) return;

    const source = getGridCellFromElement(resized.value)!;
    const target = e.target as HTMLGridElement;
    const sourceCoordinates = source.gridCellCoordinates;

    const sourceWidth = source.width;
    const sourceHeight = source.height;
    source.width = getElementX(target) - source.xGrid + 1;
    source.height = getElementY(target) - source.yGrid + 1;

    // Enforcements
    (
        enforceNoOverlapSize(source, sourceCoordinates),
        enforceNoNegativeSize(source, sourceWidth, sourceHeight)
    );

    const clearFutureGridCellsInterval = setInterval(() => {
        clearFutureGridCells();
    }, 1)
    setTimeout(() => {
        clearInterval(clearFutureGridCellsInterval)
        resized.value = null;
    }, 250);
}
watch(() => gridCellElements.value, () => {
    gridCellElements.value!.forEach((gridCellElement) => gridCellResizeObs.observe(gridCellElement))
}, { deep: true });


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

let previousTargetX: number;
let previousTargetY: number;
const addFutureGridCellDrag = (target: HTMLGridElement, gridCell: GridCell) => {
    const targetX = getElementX(target);
    const targetY = getElementY(target);
    if (previousTargetX === targetX && previousTargetY === targetY) return;
    previousTargetX = targetX;
    previousTargetY = targetY;

    const sourceX = gridCell.xGrid;
    const sourceY = gridCell.yGrid;
    gridCell.xGrid = previousTargetX;
    gridCell.yGrid = previousTargetY;

    const futureGridCellElement = document.createElement('div');
    futureGridCellElement.style.width = `${calcGridCellWidthPx(gridCell)}px`;
    futureGridCellElement.style.height = `${calcGridCellHeightPx(gridCell)}px`;
    futureGridCellElement.classList.add('future-grid-cell');
    if (!isGridCellInBounds(gridCell) || isTargetZoneOccupied(gridCell)) futureGridCellElement.classList.add('error');
    clearFutureGridCells();
    target.appendChild(futureGridCellElement);

    gridCell.xGrid = sourceX;
    gridCell.yGrid = sourceY;
}
const addFutureGridCellResize = (target: HTMLGridElement, gridCell: GridCell) => {
    const sourceWidth = gridCell.width;
    const sourceHeight = gridCell.height;

    gridCell.width = getElementX(target) - gridCell.xGrid + 1;
    gridCell.height = getElementY(target) - gridCell.yGrid + 1;

    const futureGridCellElement = document.createElement('div');
    futureGridCellElement.style.width = `${calcGridCellWidthPx(gridCell)}px`;
    futureGridCellElement.style.height = `${calcGridCellHeightPx(gridCell)}px`;
    futureGridCellElement.classList.add('future-grid-cell');
    if (!isGridCellInBounds(gridCell) || isTargetZoneOccupied(gridCell)) futureGridCellElement.classList.add('error');
    clearFutureGridCells();
    getGridXFromXY(gridCell.xGrid, gridCell.yGrid).appendChild(futureGridCellElement);

    gridCell.width = sourceWidth;
    gridCell.height = sourceHeight;
}
const clearFutureGridCells = () => document.querySelectorAll('.future-grid-cell').forEach((element) => element.remove());
const calcGridCellWidthPx = (gridCell: GridCell) => gridCell.width * cellWidthPx.value;
const calcGridCellHeightPx = (gridCell: GridCell) => gridCell.height * cellHeightPx.value;
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: modelEdit }" @mouseenter="resized = null">
        <!-- GRID Y -->
        <div v-for="y in yGrid" class="y-grid" :style="{ height: `${cellHeight}dvh` }" :key="y">
            <!-- GRID X -->
            <div v-for="x in xGrid" class="x-grid" @drop="handleDragDrop" @mouseup="handleMouseUp"
                @mousedown="isMouseDown = true" @mouseenter="handleMouseEnter" @dragover.prevent="handleDragOn" :x="x"
                :y=y :key="x">
                <!-- GRID CELL -->
                <template v-for="gridCell of modelGridCells" :key="gridCell.id">
                    <template v-if="gridCell.xGrid === x && gridCell.yGrid === y">
                        <div class="grid-cell" ref="gridCellElements"
                            :class="[{ resizing: resized }, ...gridCell.initialClasses]" :draggable="modelEdit"
                            @dragstart="handleDragStart" @dragend="handleDragEnd" :x="x" :y="y" :style="{
                                width: `${calcGridCellWidthPx(gridCell)}px`,
                                height: `${calcGridCellHeightPx(gridCell)}px`
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

    &.error {
        color: var(--error);
    }
}
</style>