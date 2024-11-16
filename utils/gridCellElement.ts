export const focusElement = (
	event: KeyboardEvent,
	next: HTMLElement,
	previous?: HTMLElement
) => {
	if (event.key !== 'Tab') return;
	if (event.shiftKey && previous) {
		setTimeout(() => {
			previous.focus();
		});
		return;
	}
	setTimeout(() => {
		next.focus();
	});
};
