export const getComputedProperty = (element: HTMLElement, property: string) => {
	const computedStyle = window.getComputedStyle(element);
	return computedStyle.getPropertyValue(property);
};

export const validateElement = (
	element: HTMLInputElement | HTMLSelectElement,
	error = ''
) => {
	const isValid = element.checkValidity();
	if (!isValid) {
		setTimeout(() => {
			element.setCustomValidity(error);
			element.reportValidity();
		});
	}
	return isValid;
};
