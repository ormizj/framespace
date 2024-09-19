import type { Component, DefineComponent, ShallowRef } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';

export interface GridCell<T extends Component = DefineComponent> {
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
