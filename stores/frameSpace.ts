import { acceptHMRUpdate, defineStore } from 'pinia';
import type { ShallowRef } from 'vue';
import IframeCell from '~/components/cell-components/iframe-cell.vue';
import OpenCorsSites from '~/enums/OpenCorsSites';
import type { GridCell } from '~/types/GridCell';

export const useFrameSpaceStore = defineStore({
	id: 'frameSpaceStore',
	state: () => ({
		xGrid: 10,
		yGrid: 10,
		cellHeight: 10,
		iframes: [] as GridCell<typeof IframeCell>[],
		iframesUpdater: 0,
		iframesSrcOptions: [...Object.values(OpenCorsSites)] as string[],
	}),
	actions: {
		addIframe({
			cellX,
			cellY,
			cellWidth,
			cellHeight,
			src,
			classes = new Set(),
		}: {
			cellX: number;
			cellY: number;
			cellWidth: number;
			cellHeight: number;
			src: string;
			classes?: Set<string>;
		}) {
			this.iframesUpdater++;
			this.iframes.push({
				cellX,
				cellY,
				cellHeight,
				cellWidth,
				classes,
				component: {
					// TODO temp "as" type
					is: null as unknown as typeof IframeCell,
					bind: {
						src,
					},
				},
			});
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useFrameSpaceStore, import.meta.hot));
