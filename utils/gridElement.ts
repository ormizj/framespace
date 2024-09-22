export const getGridElementYGrid = (
	element: HTMLGridElement | HTMLCellElement
): number | typeof NaN => +element.getAttribute('y')!;

export const getGridElementXGrid = (
	element: HTMLGridElement | HTMLCellElement
): number | typeof NaN => +element.getAttribute('x')!;
