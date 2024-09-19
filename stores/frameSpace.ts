import { acceptHMRUpdate, defineStore } from 'pinia';
import IframeCell from '~/components/cell-components/iframe-cell.vue';
import type { GridCell } from '~/types/GridCell';

export const useFrameSpaceStore = defineStore({
	id: 'frameSpaceStore',
	state: () => ({
		xGrid: 10,
		yGrid: 10,
		cellHeight: 10,
		iframes: [] as GridCell<typeof IframeCell>[],
	}),
	actions: {
		addIframe({
			cellX,
			cellY,
			cellWidth,
			cellHeight,
			link,
		}: {
			cellX: number;
			cellY: number;
			cellWidth: number;
			cellHeight: number;
			link: string;
		}) {
			this.iframes.push({
				cellX,
				cellY,
				cellHeight,
				cellWidth,
				classes: new Set(),
				component: {
					// TODO temp "as" type
					is: shallowRef(IframeCell) as unknown as typeof IframeCell,
					bind: {
						src: link,
					},
				},
			});
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useFrameSpaceStore, import.meta.hot));
