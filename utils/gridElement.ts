export const getGridElementYGrid = (
	element: HTMLGridElement | HTMLCellElement
): number | typeof NaN => +element.getAttribute('y')!;

export const getGridElementXGrid = (
	element: HTMLGridElement | HTMLCellElement
): number | typeof NaN => +element.getAttribute('x')!;

export const getComputedProperty = (element: HTMLElement, property: string) => {
	const computedStyle = window.getComputedStyle(element);
	return computedStyle.getPropertyValue(property);
};
