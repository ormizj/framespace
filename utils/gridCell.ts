import type GridCell from '~/classes/GridCell';

export const getFreeGridXY = (gridCells: GridCell[], maxXGrid: number) => {
	let yGrid: number = -1;
	let xGrid: number = -1;

	outerLoop: for (let y = 1; true; y++) {
		for (let x = 1; x <= maxXGrid; x++) {
			let isOutsideAllIframes = true;

			for (const iframe of gridCells) {
				let strX = iframe.xGrid;
				let endX = iframe.xGrid + iframe.width - 1;
				let strY = iframe.yGrid;
				let endY = iframe.yGrid + iframe.height - 1;

				if (x >= strX && x <= endX && y >= strY && y <= endY) {
					isOutsideAllIframes = false;
					break;
				}
			}

			if (isOutsideAllIframes) {
				xGrid = x;
				yGrid = y;
				break outerLoop;
			}
		}
	}

	return {
		yGrid,
		xGrid,
	};
};

export const getGridCellCoordinates = ({
	yGrid,
	xGrid,
	height,
	width,
}: {
	yGrid: number;
	xGrid: number;
	height: number;
	width: number;
}): GridCellCoordinates => {
	return {
		strY: yGrid,
		endY: yGrid + height - 1,
		strX: xGrid,
		endX: xGrid + width - 1,
	};
};

export const getGridSizeAxis = (startAxis: number, endAxis: number) => {
	return startAxis - endAxis + 1;
};
