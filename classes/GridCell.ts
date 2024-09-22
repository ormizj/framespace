import type { Component, ShallowRef, ShallowUnwrapRef } from 'vue';
import type { VueComponent } from '~/types/VueComponent';

export default class GridCell<T extends Component = Component> {
	id: string;
	component: ShallowUnwrapRef<VueComponent<T>>;
	yGrid: number;
	xGrid: number;
	width: number;
	height: number;
	initialClasses: Set<string>;

	constructor({
		id,
		component,
		yGrid,
		xGrid,
		width,
		height,
		initialClasses,
	}: {
		id: string;
		component: VueComponent<T>;
		yGrid: number;
		xGrid: number;
		width?: number;
		height?: number;
		initialClasses?: Set<string>;
	}) {
		this.id = id;
		/* TODO temporary "as" */
		this.component = shallowRef(component) as unknown as ShallowUnwrapRef<
			typeof component
		>;
		this.yGrid = yGrid;
		this.xGrid = xGrid;
		this.width = width ?? 1;
		this.height = height ?? 1;
		this.initialClasses = initialClasses ?? new Set();
	}

	get gridCellCoordinates() {
		return {
			strY: this.yGrid,
			endY: this.yGrid + this.height - 1,
			strX: this.xGrid,
			endX: this.xGrid + this.width - 1,
		};
	}
}
