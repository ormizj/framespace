import GridCell from '~/classes/GridCell';
import SettingLabelInputCell from '~/components/cells/setting-label-input-cell.vue';
import { focusElement } from '~/utils/gridCellElement';

export default () => {
	const frameSpaceStore = useFrameSpaceStore();
	const { xGridBoundary, yGridBoundary, cellHeight, scrollAmount } =
		storeToRefs(frameSpaceStore);
	const xInputRef = ref<HTMLInputElement | null>(null);
	const yInputRef = ref<HTMLInputElement | null>(null);
	const cellInputRef = ref<HTMLInputElement | null>(null);
	const scrollInputRef = ref<HTMLInputElement | null>(null);

	return [
		new GridCell({
			id: 'x_grid',
			yGrid: 4,
			xGrid: 7,
			height: 1,
			width: 3,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': xGridBoundary,
					'modelValue': xGridBoundary,
					'onUpdate:modelValue': (value: string) =>
						(xGridBoundary.value = +value),
					'title': '# X-Grid:',
					'id': 'x_grid',
					'type': 'number',
					'min': 1,
					'setRef': (componentRef: HTMLInputElement) => {
						xInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, scrollInputRef.value!!, yInputRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'y_grid',
			yGrid: 5,
			xGrid: 7,
			height: 1,
			width: 3,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': yGridBoundary,
					'modelValue': yGridBoundary,
					'onUpdate:modelValue': (value: string) =>
						(yGridBoundary.value = +value),
					'title': '# Y-Grid:',
					'id': 'y_grid',
					'type': 'number',
					'min': 1,
					'setRef': (componentRef: HTMLInputElement) => {
						yInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, xInputRef.value!, cellInputRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'cell_height',
			yGrid: 6,
			xGrid: 7,
			height: 1,
			width: 3,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': cellHeight,
					'modelValue': cellHeight,
					'onUpdate:modelValue': (value: string) => (cellHeight.value = +value),
					'title': '% Cell-Height:',
					'id': 'cell_height',
					'type': 'number',
					'min': 1,
					'setRef': (componentRef: HTMLInputElement) => {
						cellInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, yInputRef.value!, scrollInputRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'scroll_amount',
			yGrid: 7,
			xGrid: 7,
			height: 1,
			width: 3,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': scrollAmount,
					'modelValue': scrollAmount,
					'onUpdate:modelValue': (value: string) =>
						(scrollAmount.value = +value),
					'title': '# Scroll Amount:',
					'id': 'scroll_amount',
					'type': 'number',
					'min': 0,
					'setRef': (componentRef: HTMLInputElement) => {
						scrollInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, cellInputRef.value!, xInputRef.value!);
					},
				},
			},
		}),
	];
};
