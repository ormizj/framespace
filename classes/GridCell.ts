import type { Component } from 'vue';
import type { VueComponent } from '~/types/VueComponent';

export default class GridCell<T extends Component = Component> {
	component: VueComponent<T>;
	yGrid: number;
	xGrid: number;
	width: number;
	height: number;
	initialClasses: Set<string>;
	id: string;

	constructor({
		component,
		yGrid,
		xGrid,
		width,
		height,
		initialClasses,
		id,
	}: {
		component: VueComponent<T>;
		yGrid: number;
		xGrid: number;
		width?: number;
		height?: number;
		initialClasses?: Set<string>;
		id?: string;
	}) {
		this.component = component;
		this.component.is = shallowRef(this.component.is);
		this.yGrid = yGrid;
		this.xGrid = xGrid;
		this.width = width ?? 1;
		this.height = height ?? 1;
		this.initialClasses = initialClasses ?? new Set();
		this.id = id ?? crypto.randomUUID();
	}

	get gridCellCoordinates(): GridCellCoordinates {
		return {
			strY: this.yGrid,
			endY: this.yGrid + this.height - 1,
			strX: this.xGrid,
			endX: this.xGrid + this.width - 1,
		};
	}

	get yGridEnd() {
		return this.yGrid + this.height - 1;
	}

	get xGridEnd() {
		return this.xGrid + this.width - 1;
	}
}
