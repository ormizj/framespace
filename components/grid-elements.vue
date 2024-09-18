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
    cellWidth: 5,
    cellHeight: 3,
    link,
    classes: new Set(),
}, {
    cellX: 1,
    cellY: 7,
    cellWidth: 1,
    cellHeight: 1,
    link,
    classes: new Set(),
}]);
watch(editModel, () => {
    gridCells.value.forEach((gridCell) => {
        clearGridCellAnimations(gridCell);
    });
});


// GridCell Helper Functions
const getElementX = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('x')!;
const getElementY = (element: HTMLGridElement | HTMLCellElement) => +element.getAttribute('y')!;
const getGridCellFromElement = (element: HTMLGridElement | HTMLCellElement) => gridCells.value.find(
    gridCell => gridCell.cellX === getElementX(element) && gridCell.cellY === getElementY(element)
);
const getGridCellCoordinates = (gridCell: GridCell): GridCellCoordinates => ({
    strX: gridCell.cellX,
    endX: gridCell.cellX + gridCell.cellWidth - 1,
    strY: gridCell.cellY,
    endY: gridCell.cellY + gridCell.cellHeight - 1,
});
const setGridCellAxisFromCoordinates = (gridCell: GridCell, coordinates: GridCellCoordinates) => {
    gridCell.cellX = coordinates.strX;
    gridCell.cellY = coordinates.strY;
}
const setGridCellSizeFromCoordinates = (gridCell: GridCell, coordinates: GridCellCoordinates) => {
    gridCell.cellWidth = coordinates.endX - gridCell.cellX + 1;
    gridCell.cellHeight = coordinates.endY - gridCell.cellY + 1;
}
const isTargetZoneOccupied = (gridCell: GridCell): GridCell | undefined => {
    const coordinates = getGridCellCoordinates(gridCell);
    const occupyingGridCell = gridCells.value.find((otherGridCell) => {
        const otherCoordinates = getGridCellCoordinates(otherGridCell);
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
    const coordinates = getGridCellCoordinates(gridCell);
    return xGrid.value < coordinates.endX || yGrid.value < coordinates.endY;
}
const addGridCellAnimation = (gridCell: GridCell, className: string) => {
    gridCell.classes.delete(className);
    setTimeout(() => {
        gridCell.classes.add(className)
    });
}
const clearGridCellAnimations = (gridCell: GridCell) => {
    gridCell.classes = new Set();
}


// GridCell Enforcements
const enforceNoOverlapAxis = (gridCellTarget: GridCell, gridCellSourceCoordinates: GridCellCoordinates): boolean => {
    const occupyingGridCell = isTargetZoneOccupied(gridCellTarget);
    if (!occupyingGridCell) return false;
    addGridCellAnimation(occupyingGridCell, 'error-animation');
    setGridCellAxisFromCoordinates(gridCellTarget, gridCellSourceCoordinates);
    return true;
}
const enforceBoundsAxis = (gridCellTarget: GridCell, gridCellSourceCoordinates: GridCellCoordinates): boolean => {
    const willBeInBounds = isGridCellInBounds(gridCellTarget);
    if (!willBeInBounds) return false;
    addGridElementsAnimation('error-animation-inset');
    setGridCellAxisFromCoordinates(gridCellTarget, gridCellSourceCoordinates);
    return true;
}
const enforceNoOverlapSize = (gridCellTarget: GridCell, gridCellSourceCoordinates: GridCellCoordinates): boolean => {
    const occupyingGridCell = isTargetZoneOccupied(gridCellTarget);
    if (!occupyingGridCell) return false;
    addGridCellAnimation(occupyingGridCell, 'error-animation');
    setGridCellSizeFromCoordinates(gridCellTarget, gridCellSourceCoordinates);
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
    const target = e.target as HTMLGridElement;
    const sourceCoordinates = getGridCellCoordinates(dragged!);
    dragged!.cellX = getElementX(target);
    dragged!.cellY = getElementY(target);

    // Enforcements
    (
        enforceNoOverlapAxis(dragged!, sourceCoordinates) ||
        enforceBoundsAxis(dragged!, sourceCoordinates)
    );
    clearGridElementsAnimation('error-animation-inset');
    clearGridCellAnimations(dragged!);

    dragged = undefined;
}


// GridCell Resize
const resized = ref<HTMLCellElement | null>(null);
const gridCellResizeObs = new ResizeObserver((obs) => {
    if (stopResizeMouseUp.value) {
        stopResizeMouseUp.value = false;
        return;
    }
    if (!resized.value) resized.value = obs[0].target as HTMLCellElement;
});
const handleMouseUp = (e: MouseEvent) => {
    nextTick(() => {
        resized.value = null;
    });
    if (!resized.value) return;

    const source = resized.value;
    const target = e.target as HTMLGridElement
    const gridCell = getGridCellFromElement(source)!;
    const sourceCoordinates = getGridCellCoordinates(gridCell!);
    gridCell!.cellWidth = getElementX(target) - getElementX(source) + 1;
    gridCell!.cellHeight = getElementY(target) - getElementY(source) + 1;

    // Enforcements
    (
        enforceNoOverlapSize(gridCell, sourceCoordinates)
    );
    clearGridCellAnimations(gridCell);

    setTimeout(() => {
        resized.value = null;
    }, 250);
}
watch(() => gridCellElements.value, () => {
    gridCellElements.value!.forEach((gridCellElement) => gridCellResizeObs.observe(gridCellElement))
}, { deep: true });


// HTMLGridElement Observer
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
const addGridElementsAnimation = (className: string) => {
    gridElements.value!.classList.remove(className);
    setTimeout(() => {
        gridElements.value!.classList.add(className);
    });
}
const clearGridElementsAnimation = (className: string) => {
    gridElements.value!.classList.remove(className);
}
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }" @mouseenter="resized = null">
        <!-- GRID Y -->
        <div v-for="y in yGrid" class="y-grid" :style="{ height: `${cellHeight}dvh` }" :key="y">
            <!-- GRID X -->
            <div v-for="x in xGrid" class="x-grid" @drop="handleDragDrop" @dragover.prevent @mouseup="handleMouseUp"
                :x="x" :y=y :key="x">
                <!-- GRID CELL -->
                <template v-for="gridCell of gridCells" :key="`${gridCell.cellX}|${gridCell.cellY}`">
                    <template v-if="gridCell.cellX === x && gridCell.cellY === y">
                        <div class="grid-cell" ref="gridCellElements"
                            :class="[{ resizing: resized }, ...gridCell.classes]" :draggable="editModel"
                            @dragstart="handleDragStart" @dragend="handleDragEnd" :x="x" :y="y" :style="{
                                width: `${gridCell.cellWidth * cellWidthPx}px`,
                                height: `${gridCell.cellHeight * cellHeightPx}px`
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
    outline: 1px solid var(--secondary);

    &:hover {
        background-color: color-mix(in srgb, var(--secondary), transparent 50%);
    }
}

.grid-elements {
    width: 100%;
    min-height: 100dvh;

    .grid-cell {
        position: absolute;
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
            outline: 1px dashed var(--secondary);
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
</style>