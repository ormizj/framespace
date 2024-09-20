import { acceptHMRUpdate, defineStore } from 'pinia';
import IframeCell from '~/components/cell-components/iframe-cell.vue';
import OpenCorsSites from '~/enums/OpenCorsSites';
import type { GridCell } from '~/types/GridCell';

export const useFrameSpaceStore = defineStore({
	id: 'frameSpaceStore',
	state: () => ({
		xGrid: 10,
		yGrid: 10,
		cellHeight: 10,
		iframeGridCells: [] as GridCell<typeof IframeCell>[],
		iframesSrcOptions: [...Object.values(OpenCorsSites)] as string[],
	}),
	getters: {
		outOfBoundIframes() {
			let amount = 0;
			let maxX = 0;
			let maxY = 0;
			this.iframeGridCells.forEach((iframe) => {
				const endX = iframe.cellX + iframe.cellWidth - 1;
				const endY = iframe.cellY + iframe.cellHeight - 1;
				if (endX > maxX) maxX = endX;
				if (endY > maxY) maxY = endY;
				if (endX > this.xGrid || endY > this.yGrid) amount++;
			});

			return {
				amount,
				maxX: maxX,
				maxY: maxY,
			};
		},
	},
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
			this.iframeGridCells.push({
				cellX,
				cellY,
				cellHeight,
				cellWidth,
				classes,
				component: {
					is: shallowRef(IframeCell),
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

			outerLoop: for (let y = 1; true; y++) {
				for (let x = 1; x <= this.xGrid; x++) {
					let isOutsideAllIframes = true;

					for (const iframe of this.iframeGridCells) {
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
