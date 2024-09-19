interface GridCell {
	cellX: number;
	cellY: number;
	cellWidth: number;
	cellHeight: number;
	classes: Set<string>;
	component: {
		is: ShallowRef<VueElement>;
		bind?: HTMLElementAttributes;
	};
}
