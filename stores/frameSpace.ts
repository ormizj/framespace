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
			if (!this.iframesSrcOptions.find((otherSrc) => otherSrc === src)) {
				this.iframesSrcOptions.unshift(src);
			}

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
		addIframeInFreeCell({
			src,
			classes = new Set(),
		}: {
			src: string;
			classes?: Set<string>;
		}) {
			let cellX: number = -1;
			let cellY: number = -1;

			outerLoop: for (let y = 1; y <= this.yGrid; y++) {
				for (let x = 1; x <= this.xGrid; x++) {
					let isOutsideAllIframes = true;

					for (const iframe of this.iframes) {
						let strX = iframe.cellX;
						let endX = iframe.cellX + iframe.cellWidth - 1;
						let strY = iframe.cellY;
						let endY = iframe.cellY + iframe.cellHeight - 1;

						if (x >= strX && x <= endX && y >= strY && y <= endY) {
							isOutsideAllIframes = false;
							break;
						}
					}

					if (isOutsideAllIframes) {
						cellX = x;
						cellY = y;
						break outerLoop;
					}
				}
			}
			this.addIframe({
				cellX,
				cellY,
				cellWidth: 1,
				cellHeight: 1,
				src,
				classes,
			});
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useFrameSpaceStore, import.meta.hot));
