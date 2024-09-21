import type { Component, ShallowUnwrapRef } from 'vue';
import type { VueComponent } from './VueComponent';

export interface GridCell<T extends Component | unknown = unknown> {
	cellX: number;
	cellY: number;
	cellWidth: number;
	cellHeight: number;
	classes: Set<string>;
	component: VueComponent<T>;
}
