import { acceptHMRUpdate, defineStore } from 'pinia';
import GridCell from '~/classes/GridCell';
import IframeCell from '~/components/cells/iframe-cell.vue';
import OpenCorsSites from '~/enums/OpenCorsSites';
import { getFreeGridXY } from '~/utils/GridCell.ts';

export const useFrameSpaceStore = defineStore({
	id: 'frameSpaceStore',
	state: () => ({
		yGridBoundary: 10,
		xGridBoundary: 10,
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
				const endX = iframe.xGrid + iframe.width - 1;
				const endY = iframe.yGrid + iframe.height - 1;
				if (endX > maxX) maxX = endX;
				if (endY > maxY) maxY = endY;
				if (endX > this.xGridBoundary || endY > this.yGridBoundary) amount++;
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
			yGrid,
			xGrid,
			height,
			width,
			src,
			initialClasses,
		}: {
			xGrid: number;
			yGrid: number;
			height: number;
			width: number;
			initialClasses?: Set<string>;
			src: string;
		}) {
			if (!this.iframesSrcOptions.find((otherSrc) => otherSrc === src)) {
				this.iframesSrcOptions.unshift(src);
			}
			const cellGrid = new GridCell<typeof IframeCell>({
				id: crypto.randomUUID(),
				yGrid,
				xGrid,
				height,
				width,
				initialClasses,
				component: {
					is: IframeCell,
					bind: {
						src,
					},
				},
			});
			this.iframeGridCells.push(cellGrid);
		},

		addIframeInFreeCell(src: string, initialClasses?: Set<string>) {
			const { yGrid, xGrid } = getFreeGridXY(
				this.iframeGridCells,
				this.xGridBoundary
			);
			this.addIframe({
				yGrid,
				xGrid,
				width: 1,
				height: 1,
				initialClasses,
				src,
			});
		},

		removeIframe(iframe: (typeof this.iframeGridCells)[number]) {
			const iframeIndex = this.iframeGridCells.findIndex(
				(otherIframe) => otherIframe === iframe
			);
			this.iframeGridCells.splice(iframeIndex, 1);
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useFrameSpaceStore, import.meta.hot));
