import GridCell from '~/classes/GridCell';
import SettingLabelInputCell from '~/components/cells/setting-label-input-cell.vue';
import { focusElement } from '~/utils/gridCellElement';

export default () => {
	const frameSpaceStore = useFrameSpaceStore();
	const { xGridBoundary, yGridBoundary, cellHeight } =
		storeToRefs(frameSpaceStore);
	const xInputRef = ref<HTMLInputElement | null>(null);
	const yInputRef = ref<HTMLInputElement | null>(null);
	const cellInputRef = ref<HTMLInputElement | null>(null);

	return [
		new GridCell({
			id: 'x-grid',
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
					'id': 'x-grid',
					'type': 'number',
					'min': 1,
					'setRef': (componentRef: HTMLInputElement) => {
						xInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, cellInputRef.value!, yInputRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'y-grid',
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
					'id': 'y-grid',
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
			id: 'cell-height',
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
					'id': 'cell-height',
					'type': 'number',
					'min': 1,
					'setRef': (componentRef: HTMLInputElement) => {
						cellInputRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, yInputRef.value!, xInputRef.value!);
					},
				},
			},
		}),
	];
};
