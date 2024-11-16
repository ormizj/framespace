export const focusElement = (
	event: KeyboardEvent,
	previous?: HTMLElement,
	next?: HTMLElement
) => {
	if (event.key !== 'Tab') return;
	if (event.shiftKey && previous) {
		setTimeout(() => previous.focus());
	} else if (!event.shiftKey && next) {
		setTimeout(() => next.focus());
	}
};
