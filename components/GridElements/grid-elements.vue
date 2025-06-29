<script setup lang="ts">
import GridCell from '~/classes/GridCell';
import {
	ANIMATION_LONG_DURATION,
	ANIMATION_REPEAT_COUNT,
} from '~/constants/style';
import type { VNode } from 'vue';
import GridComponent from '~/components/GridElements/grid-component.vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import GridTemplateParser from '~/classes/GridTemplateParser';

const modelGridCells = defineModel<GridCell[]>({ required: true });
const modelEdit = defineModel('edit', { default: false });
const modelScroll = defineModel('scroll', { default: true });

const props = withDefaults(
	defineProps<{
		xGridBoundary: number;
		yGridBoundary: number;
		cellHeight: number;
		scrollAmount?: number;
		alwaysInteractive?: boolean;
		allowOverlap?: boolean;
		useNestedChildren?: boolean;
	}>(),
	{
		scrollAmount: undefined,
		alwaysInteractive: false,
		allowOverlap: false,
		useNestedChildren: false,
	}
);

const debugLog = (message: string) => {
	console.warn(message);
};

/* slot Initialize */
const addSlotToModelGridCells = (
	slot: VNode,
	coordinates: ComponentProps<typeof GridComponent>
) => {
	modelGridCells.value.push(
		new GridCell({
			component: {
				is: slot.type,
				props: slot.props,
				slots: {
					default: () => slot.children,
				},
			},
			yGrid: coordinates.y,
			xGrid: coordinates.x,
			width: coordinates.width,
			height: coordinates.height,
		})
	);
};
const isGridComponent = (slot: VNode): slot is VNode<typeof GridComponent> => {
	return (slot.type as typeof GridComponent).__hmrId === GridComponent.__hmrId;
};
const handleSlots = (slots?: VNode[]) => {
	if (!slots) return;
	slots.forEach((gridComponent: VNode) => {
		if (!isGridComponent(gridComponent)) {
			debugLog('Slot children must be of type GridComponent');
			return;
		}

		const coordinates = gridComponent.props as ComponentProps<
			typeof GridComponent
		>;

		// if using template
		const gridTemplateParser =
			coordinates.template &&
			new GridTemplateParser(coordinates.template, {
				baseX: coordinates.x,
				baseY: coordinates.y,
			});

		const children = gridComponent.children as { default: () => VNode[] };
		children?.default().forEach((slot: VNode) => {
			if (isGridComponent(slot)) {
				debugLog(
					'Nested GridComponents are not supported. GridComponent cannot contain another GridComponent'
				);
				return;
			}

			if (gridTemplateParser) {
				const key = String(slot.key);
				const parsedCoordinates = gridTemplateParser.getCoordinates(key);
				if (!parsedCoordinates) {
					debugLog(
						`GridComponent child's key: "${key}" doesn't exist in the GridComponent template: "${coordinates.template}"`
					);
					return;
				}

				addSlotToModelGridCells(slot, parsedCoordinates);
			} else {
				addSlotToModelGridCells(slot, coordinates);
			}
		});
	});
};
handleSlots(useSlots().default?.());

const gridElements = ref<HTMLDivElement | null>(null);
const gridElementsY = ref<HTMLDivElement[] | null>(null);
const gridCellElements = ref<null | HTMLGridElement[]>(null);
const cellHeightPx = ref<number>(0);
const cellWidthPx = ref<number>(0);
const overlappingGridCells = reactive<Record<string, GridCell>>({});
const futureGridCell = ref<HTMLGridElement | null>(null);

watch(modelEdit, () => {
	clearAllGridCellAnimations();
	clearGridElementsAnimation();
});

/* GridCell helper functions */
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

/* GridCell enforcements */
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

/* GridCell validations */
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

/* GridCell drag */
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
	if (!futureGridCell.value) return;

	const target = futureGridCell.value;
	const targetYGrid = getGridElementYGrid(target);
	const targetXGrid = getGridElementXGrid(target);
	const newCoordinates = getGridCellCoordinates({
		yGrid: targetYGrid,
		xGrid: targetXGrid,
		height: dragged!.height,
		width: dragged!.width,
	});

	// enforcements
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

	clearFutureGridCell();
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

	const futureGridCellElement = document.createElement(
		'div'
	) as HTMLGridElement;
	futureGridCellElement.setAttribute('x', `${newCoordinates.strX}`);
	futureGridCellElement.setAttribute('y', `${newCoordinates.strY}`);
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

	clearFutureGridCell();
	target.appendChild(futureGridCellElement);
	futureGridCell.value = futureGridCellElement;
};

/* GridCell resize */
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

	// enforcements
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

	const clearFutureGridCellInterval = setInterval(() => {
		clearFutureGridCell();
	}, 1);
	setTimeout(() => {
		clearInterval(clearFutureGridCellInterval);
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

	const futureGridCellElement = document.createElement(
		'div'
	) as HTMLGridElement;
	futureGridCellElement.setAttribute('x', `${newCoordinates.strX}`);
	futureGridCellElement.setAttribute('y', `${newCoordinates.strY}`);
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

	clearFutureGridCell();
	gridXElement.appendChild(futureGridCellElement);
	futureGridCell.value = futureGridCellElement;
};

/* GridElements observer */
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

/* GridElements helper functions */
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

const clearFutureGridCell = () => {
	if (!futureGridCell.value) return;
	futureGridCell.value.remove();
	futureGridCell.value = null;
};
const calcGridCellHeightPx = (gridCellHeight: number) =>
	gridCellHeight * cellHeightPx.value;
const calcGridCellWidthPx = (gridCellWidth: number) =>
	gridCellWidth * cellWidthPx.value;

/* additional events */
const handleScroll = (e: WheelEvent) => {
	if (!props.scrollAmount || e.deltaY === 0) return;
	e.preventDefault();

	// scroll amount
	let scrollAmount = props.scrollAmount;
	if (e.deltaY < 0) scrollAmount = -scrollAmount;

	// current scroll
	const cellHeight = cellHeightPx.value;
	const currentScrollTop = gridElements.value!.scrollTop;
	const currentCellPosition = Math.round(currentScrollTop / cellHeight);

	// scroll to element
	const newCoordinate = currentCellPosition + scrollAmount;
	const elementScrollTo = gridElementsY.value![newCoordinate];
	if (elementScrollTo) {
		elementScrollTo.scrollIntoView();
	} else {
		if (newCoordinate < 0) gridElementsY.value![0].scrollIntoView();
		else gridElementsY.value![gridElementsY.value!.length - 1].scrollIntoView();
	}
};

/* additional initializations */
modelGridCells.value.forEach((gridCell) => {
	if (isTargetZoneOccupied(gridCell.id, gridCell.gridCellCoordinates)) {
		gridCell.initialClasses.add('overlap');
		overlappingGridCells[gridCell.id] = gridCell;
	}
});
</script>

<template>
	<div
		class="grid-elements"
		ref="gridElements"
		:class="{ 'edit': modelEdit, 'scroll-hidden': !modelScroll }"
		@wheel="handleScroll"
		@mouseenter="resized = undefined"
	>
		<!-- GRID Y -->
		<div
			v-for="y in yGridBoundary"
			ref="gridElementsY"
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
				@dragend="handleDragDrop"
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

.grid-elements {
	position: relative;
	overflow-y: auto;

	&.scroll-hidden::-webkit-scrollbar {
		display: none;
	}

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

/* gridElements edit */
.grid-elements.edit {
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
