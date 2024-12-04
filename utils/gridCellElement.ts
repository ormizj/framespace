export const focusElement = (
	event: KeyboardEvent,
	previous?: HTMLElement,
	next?: HTMLElement
) => {
	if (event.key !== 'Tab') return;
	event.preventDefault();
	if (event.shiftKey && previous) {
		previous.focus();
	} else if (!event.shiftKey && next) {
		next.focus();
	}
};
