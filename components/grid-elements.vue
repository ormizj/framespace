<script setup lang="ts">
import GridCell from '~/classes/GridCell';
import {
	ANIMATION_LONG_DURATION,
	ANIMATION_REPEAT_COUNT,
} from '~/constants/style';

const modelGridCells = defineModel<GridCell[]>({ required: true });
const modelEdit = defineModel('edit', { default: false });
const modelScroll = defineModel('scroll', { default: true });

const props = withDefaults(
	defineProps<{
		xGridBoundary: number;
		yGridBoundary: number;
		cellHeight: number;
		alwaysInteractive?: boolean;
		allowOverlap?: boolean;
	}>(),
	{
		alwaysInteractive: false,
		allowOverlap: false,
	}
);

// Slot Initialize
useSlots()
	.default?.()
	.forEach((slot) => {
		modelGridCells.value.push(
			new GridCell({
				component: {
					is: slot.type,
					props: slot.props,
					slots: {
						default: () => slot.children,
					},
				},
				yGrid: slot.props?.y ?? 1,
				xGrid: slot.props?.x ?? 1,
				width: slot.props?.width ?? 1,
				height: slot.props?.height ?? 1,
			})
		);
	});

const gridElements = ref<HTMLDivElement | null>(null);
const gridCellElements = ref<null | HTMLGridElement[]>(null);
const cellHeightPx = ref<number>(0);
const cellWidthPx = ref<number>(0);
const overlappingGridCells = reactive<Record<string, GridCell>>({});

watch(modelEdit, () => {
	clearAllGridCellAnimations();
	clearGridElementsAnimation();
});

// GridCell Helper Functions
const getGridCellFromElement = (element: HTMLGridElement | HTMLCellElement) =>
	modelGridCells.value.find(
		(gridCell) =>
			gridCell.xGrid === getGridElementXGrid(element) &&
			gridCell.yGrid === getGridElementYGrid(element)
	);
const gridCellsAnimationTimeouts = new Map();
const addGridCellAnimation = (gridCell: GridCell) => {
	const className = 'error-animation';
	gridCell.initialClasses.delete(className);
	clearTimeout(gridCellsAnimationTimeouts.get(gridCell));

	setTimeout(() => {
		gridCell.initialClasses.add(className);
	});
	gridCellsAnimationTimeouts.set(
		gridCell,
		setTimeout(
			() => {
				gridCell.initialClasses.delete(className);
			},
			ANIMATION_LONG_DURATION * ANIMATION_REPEAT_COUNT * 2
		)
	);
};
const clearAllGridCellAnimations = () => {
	modelGridCells.value.forEach((gridCell) => {
		gridCell.initialClasses = new Set();
	});
};

// GridCell Enforcements
/**
 * @param gridCellId
 * @param gridCellCoordinates
 * @returns {(GridCell[]|[GridCell]|null)}
 */
const enforceNoOverlap = (
	gridCellId: string,
	gridCellCoordinates: GridCellCoordinates
): GridCell[] | [GridCell] | null => {
	let occupyingGridCells: (GridCell | undefined)[] = [];
	if (props.allowOverlap) {
		occupyingGridCells = isTargetZoneOccupiedAll(
			gridCellId,
			gridCellCoordinates
		);
	} else {
		occupyingGridCells = [
			isTargetZoneOccupied(gridCellId, gridCellCoordinates),
		];
	}
	if (!occupyingGridCells[0]) return null;
	if (!props.allowOverlap) addGridCellAnimation(occupyingGridCells[0]);
	return occupyingGridCells as GridCell[];
};
const enforceBoundsAxis = (
	gridCellYGridEnd: number,
	gridCellXGridEnd: number
): boolean => {
	const willBeInBounds = isGridCellInBounds(gridCellYGridEnd, gridCellXGridEnd);
	if (willBeInBounds) return false;
	addGridElementsAnimation();
	return true;
};
const enforceNoInvalidSize = (
	gridCell: GridCell,
	newHeight: number,
	newWidth: number
): boolean => {
	const isValidSize = isGridCellSizeValid(newHeight, newWidth);
	if (isValidSize) return false;
	addGridCellAnimation(gridCell);
	return true;
};
const removeOverlapping = () => {
	for (let key in overlappingGridCells) {
		if (!Object.hasOwn(overlappingGridCells, key)) continue;
		const gridCell = overlappingGridCells[key];
		if (isTargetZoneOccupied(gridCell.id, gridCell.gridCellCoordinates)) {
			continue;
		}
		gridCell.initialClasses.delete('overlap');
		delete overlappingGridCells[key];
	}
};
const addOverlapping = (gridCell: GridCell, otherGridCells: GridCell[]) => {
	gridCell.initialClasses.add('overlap');
	overlappingGridCells[gridCell.id] = gridCell;
	otherGridCells.forEach((gridCell) => {
		gridCell.initialClasses.add('overlap');
		overlappingGridCells[gridCell.id] = gridCell;
	});
};

// GridCell Validations
const isTargetZoneOccupied = (
	gridCellId: string,
	gridCellCoordinates: GridCellCoordinates
): GridCell | undefined => {
	return modelGridCells.value.find((otherGridCell) => {
		return otherGridCell.isCoordinatesOverlap(gridCellId, gridCellCoordinates);
	});
};
const isTargetZoneOccupiedAll = (
	gridCellId: string,
	gridCellCoordinates: GridCellCoordinates
): GridCell[] => {
	return modelGridCells.value.filter((otherGridCell) =>
		otherGridCell.isCoordinatesOverlap(gridCellId, gridCellCoordinates)
	);
};
const isGridCellInBounds = (
	gridCellYGridEnd: number,
	gridCellXGridEnd: number
): boolean => {
	return (
		props.yGridBoundary >= gridCellYGridEnd &&
		props.xGridBoundary >= gridCellXGridEnd
	);
};
const isGridCellSizeValid = (gridCellHeight: number, gridCellWidth: number) => {
	return gridCellHeight > 0 && gridCellWidth > 0;
};

// GridCell Drag
let dragged: GridCell | undefined;
const isDragging = ref<boolean>(false);
const stopResizeMouseUp = ref(false);
const handleDragStart = (e: DragEvent) => {
	stopResizeMouseUp.value = true;
	const target = e.target as HTMLGridElement;
	dragged = getGridCellFromElement(target);
	setTimeout(() => {
		isDragging.value = true;
	});
};
const handleDragDrop = (e: DragEvent) => {
	isMouseDown.value = false;
	isDragging.value = false;
	const target = e.target as HTMLGridElement;
	const targetYGrid = getGridElementYGrid(target);
	const targetXGrid = getGridElementXGrid(target);
	const newCoordinates = getGridCellCoordinates({
		yGrid: targetYGrid,
		xGrid: targetXGrid,
		height: dragged!.height,
		width: dragged!.width,
	});

	// Enforcements
	const overlappedElements = enforceNoOverlap(dragged!.id, newCoordinates);
	const wasEnforced =
		(!props.allowOverlap && overlappedElements) ||
		enforceBoundsAxis(newCoordinates.endY, newCoordinates.endX);
	if (!wasEnforced) {
		dragged!.yGrid = targetYGrid;
		dragged!.xGrid = targetXGrid;
	}

	// handle overlapping
	removeOverlapping();
	if (overlappedElements) addOverlapping(dragged!, overlappedElements);

	clearFutureGridCells();
	dragged = undefined;
};
const handleDragOn = (e: DragEvent) => {
	const target = e.target as HTMLGridElement;
	addFutureGridCellDrag(target);
};
let previousTargetYGrid: number;
let previousTargetXGrid: number;
const addFutureGridCellDrag = (target: HTMLGridElement) => {
	const targetYGrid = getGridElementYGrid(target);
	const targetXGrid = getGridElementXGrid(target);
	if (
		previousTargetYGrid === targetYGrid &&
		previousTargetXGrid === targetXGrid
	)
		return;
	previousTargetYGrid = targetYGrid;
	previousTargetXGrid = targetXGrid;
	const newCoordinates = getGridCellCoordinates({
		yGrid: targetYGrid,
		xGrid: targetXGrid,
		height: dragged!.height,
		width: dragged!.width,
	});

	const gridXElement = getGridXElementFromXY(dragged!.xGrid, dragged!.yGrid);
	const gridCellElement = getGridCellElementFromGridXElement(gridXElement);

	const futureGridCellElement = document.createElement('div');
	futureGridCellElement.style.height = `${calcGridCellHeightPx(dragged!.height)}px`;
	futureGridCellElement.style.width = `${calcGridCellWidthPx(dragged!.width)}px`;
	futureGridCellElement.style.borderRadius = getComputedProperty(
		gridCellElement,
		'border-radius'
	);
	futureGridCellElement.classList.add('future-grid-cell');

	// Enforcements
	const boundError = !isGridCellInBounds(
		newCoordinates.endY,
		newCoordinates.endX
	);
	const invalidZone =
		isTargetZoneOccupied(dragged!.id, newCoordinates) || boundError;
	if (invalidZone) {
		if (!boundError && props.allowOverlap) {
			futureGridCellElement.classList.add('warning');
		} else {
			futureGridCellElement.classList.add('error');
		}
	}

	clearFutureGridCells();
	target.appendChild(futureGridCellElement);
};

// GridCell Resize
let resized = ref<GridCell | undefined>(undefined);
const isMouseDown = ref<boolean>(false);
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
};
const handleMouseUp = (e: MouseEvent) => {
	isMouseDown.value = false;
	nextTick(() => {
		resized.value = undefined;
	});
	if (!resized.value) return;

	const target = e.target as HTMLGridElement;
	const newHeight = getGridElementYGrid(target) - resized.value.yGrid + 1;
	const newWidth = getGridElementXGrid(target) - resized.value.xGrid + 1;
	const newCoordinates = getGridCellCoordinates({
		yGrid: resized.value.yGrid,
		xGrid: resized.value.xGrid,
		height: newHeight,
		width: newWidth,
	});

	// Enforcements
	const overlappedElements = enforceNoOverlap(resized.value.id, newCoordinates);
	const wasEnforced =
		(!props.allowOverlap && overlappedElements) ||
		enforceNoInvalidSize(resized.value, newHeight, newWidth);
	if (!wasEnforced) {
		resized.value.height = newHeight;
		resized.value.width = newWidth;
	}

	// handle overlapping
	removeOverlapping();
	if (overlappedElements) addOverlapping(resized.value, overlappedElements);

	const clearFutureGridCellsInterval = setInterval(() => {
		clearFutureGridCells();
	}, 1);
	setTimeout(() => {
		clearInterval(clearFutureGridCellsInterval);
		resized.value = undefined;
	}, 250);
};
const addFutureGridCellResize = (
	gridCell: GridCell,
	target: HTMLGridElement
) => {
	const targetHeight = getGridElementYGrid(target) - gridCell.yGrid + 1;
	const targetWidth = getGridElementXGrid(target) - gridCell.xGrid + 1;
	const newCoordinates = getGridCellCoordinates({
		yGrid: resized.value!.yGrid,
		xGrid: resized.value!.xGrid,
		height: targetHeight,
		width: targetWidth,
	});

	const gridXElement = getGridXElementFromXY(gridCell.xGrid, gridCell.yGrid);
	const gridCellElement = getGridCellElementFromGridXElement(gridXElement);

	const futureGridCellElement = document.createElement('div');
	futureGridCellElement.style.height = `${calcGridCellHeightPx(targetHeight)}px`;
	futureGridCellElement.style.width = `${calcGridCellWidthPx(targetWidth)}px`;
	futureGridCellElement.style.borderRadius = getComputedProperty(
		gridCellElement,
		'border-radius'
	);
	futureGridCellElement.classList.add('future-grid-cell');

	// Enforcements
	const sizeError = !isGridCellSizeValid(targetHeight, targetWidth);
	const invalidZone =
		isTargetZoneOccupied(resized.value!.id, newCoordinates) || sizeError;
	if (invalidZone) {
		if (!sizeError && props.allowOverlap) {
			futureGridCellElement.classList.add('warning');
		} else {
			futureGridCellElement.classList.add('error');
		}
	}

	clearFutureGridCells();
	gridXElement.appendChild(futureGridCellElement);
};

// GridElements Observer
watch(
	() => gridCellElements.value,
	() => {
		gridCellElements.value!.forEach((gridCellElement) =>
			gridCellResizeObs.observe(gridCellElement)
		);
	},
	{ deep: true }
);
const gridXResizeObs = new ResizeObserver((entries) => {
	const target = entries[0].target as HTMLGridElement;
	const rect = target.getBoundingClientRect();
	cellWidthPx.value = rect.width;
	cellHeightPx.value = rect.height;
});
onMounted(() => {
	const gridX = gridElements.value!.children[0].children[0] as HTMLGridElement;
	gridXResizeObs.observe(gridX);
});

// GridElements Helper Functions
let gridElementsAnimationTimeout: ReturnType<typeof setTimeout>;
const addGridElementsAnimation = () => {
	const className = 'error-animation-inset';
	gridElements.value!.classList.remove(className);
	clearTimeout(gridElementsAnimationTimeout);

	setTimeout(() => {
		gridElements.value!.classList.add(className);
	});
	gridElementsAnimationTimeout = setTimeout(
		() => {
			gridElements.value!.classList.remove(className);
		},
		ANIMATION_LONG_DURATION * ANIMATION_REPEAT_COUNT * 2
	);
};
const clearGridElementsAnimation = () => {
	const className = 'error-animation-inset';
	gridElements.value!.classList.remove(className);
};
const getGridXElementFromXY = (x: number, y: number): HTMLGridElement => {
	return gridElements.value!.children[y - 1].children[x - 1] as HTMLGridElement;
};
const getGridCellElementFromGridXElement = (
	element: HTMLGridElement
): HTMLCellElement => {
	return element.children[0].children[0] as HTMLCellElement;
};

const clearFutureGridCells = () =>
	document
		.querySelectorAll('.future-grid-cell')
		.forEach((element) => element.remove());
const calcGridCellHeightPx = (gridCellHeight: number) =>
	gridCellHeight * cellHeightPx.value;
const calcGridCellWidthPx = (gridCellWidth: number) =>
	gridCellWidth * cellWidthPx.value;

// Additional Initializations
modelGridCells.value.forEach((gridCell) => {
	if (isTargetZoneOccupied(gridCell.id, gridCell.gridCellCoordinates)) {
		gridCell.initialClasses.add('overlap');
		overlappingGridCells[gridCell.id] = gridCell;
	}
});

const handleScroll = () => {
	console.log('WIP');
};
</script>

<template>
	<div
		class="grid-elements-container"
		:class="{ 'scroll-hidden': !modelScroll }"
		@scroll="handleScroll"
	>
		<div
			class="grid-elements"
			ref="gridElements"
			:class="{ edit: modelEdit }"
			@mouseenter="resized = undefined"
		>
			<!-- GRID Y -->
			<div
				v-for="y in yGridBoundary"
				class="y-grid"
				:style="{ height: `${cellHeight}dvh` }"
				:key="y"
			>
				<!-- GRID X -->
				<div
					v-for="x in xGridBoundary"
					class="x-grid"
					:class="{ resizing: resized }"
					@drop="handleDragDrop"
					@mouseup="handleMouseUp"
					@mousedown="isMouseDown = true"
					@mouseenter="handleMouseEnter"
					@dragover.prevent="handleDragOn"
					:x="x"
					:y="y"
					:key="x"
				>
					<!-- GRID CELL -->
					<template v-for="gridCell of modelGridCells" :key="gridCell.id">
						<template v-if="gridCell.xGrid === x && gridCell.yGrid === y">
							<div
								class="grid-cell"
								ref="gridCellElements"
								:class="[
									{ resizing: resized, dragging: isDragging },
									...gridCell.initialClasses,
								]"
								:draggable="modelEdit"
								@dragstart="handleDragStart"
								:y="y"
								:x="x"
								:style="{
									height: `${calcGridCellHeightPx(gridCell.height)}px`,
									width: `${calcGridCellWidthPx(gridCell.width)}px`,
								}"
							>
								<component
									:class="[
										'cell-component',
										{ 'always-interactive': alwaysInteractive && !isMouseDown },
									]"
									:is="gridCell.component.is"
									v-bind="gridCell.component.props"
								>
									<component
										v-for="(child, index) in gridCell.component.slots"
										:key="index"
										:is="child"
									/>
								</component>
							</div>
						</template>
					</template>
					<!-- GRID CELL -->
				</div>
				<!-- GRID X -->
			</div>
			<!-- GRID Y -->
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
	outline: 1px solid var(--secondary);

	&:hover:not(:has(:hover)):not(.resizing) {
		background-color: color-mix(in srgb, var(--secondary), transparent 50%);
	}
}

.grid-elements-container {
	overflow-y: auto;

	&.scroll-hidden::-webkit-scrollbar {
		display: none;
	}

	.grid-elements {
		position: relative;

		.grid-cell {
			position: absolute;
			max-width: 100%;

			&.overlap::after {
				content: '!';
				--size: 1rem;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: var(--size);
				width: var(--size);
				height: var(--size);
				border-radius: 50%;
				animation: overlap var(--animation-longer-duration) alternate infinite;
			}
		}

		.cell-component {
			width: 100%;
			height: 100%;
		}
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

		&.resizing,
		&.dragging {
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
		box-shadow: 0 0 0 transparent;
	}

	to {
		box-shadow: 0 0 100px var(--error);
	}
}

.error-animation {
	animation: subtle-glow var(--animation-long-duration)
		calc(var(--animation-repeat-count) * 2) alternate;
}

@keyframes subtle-glow-inset {
	from {
		box-shadow: 0 0 0 inset transparent;
	}

	to {
		box-shadow: 0 0 100px inset var(--error);
	}
}

.error-animation-inset {
	animation: subtle-glow-inset var(--animation-long-duration)
		calc(var(--animation-repeat-count) * 2) alternate;
}

@keyframes subtle-gold {
	from {
		box-shadow: 0 0 0 inset transparent;
	}

	to {
		box-shadow: 0 0 100px inset var(--gold);
	}
}

.golden-animation {
	animation: subtle-glow var(--animation-long-duration) infinite alternate;
}

@keyframes overlap {
	from {
		opacity: 1;
		box-shadow: 0 0 0.5rem inset rgba(var(--gold-values), 1);
		color: rgba(var(--warning-values), 1);
	}

	to {
		box-shadow: 0 0 0.1rem inset rgba(var(--gold-values), 0.5);
		color: rgba(var(--warning-values), 0.5);
	}
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

	&.warning {
		color: var(--warning);
	}
}
</style>
