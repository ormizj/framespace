import type { Component, ShallowRef } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';

export interface GridCell<T extends Component | never = never> {
	cellX: number;
	cellY: number;
	cellWidth: number;
	cellHeight: number;
	classes: Set<string>;
	component: {
		is: ShallowRef<T>;
		props?: Partial<ComponentProps<T>>;
		bind?: { [key: string]: string };
	};
}
