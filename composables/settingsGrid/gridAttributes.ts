import GridCell from '~/classes/GridCell';
import SettingLabelInputCell from '~/components/cells/setting-label-input-cell.vue';

export default () => {
	const frameSpaceStore = useFrameSpaceStore();
	const { xGridBoundary, yGridBoundary, cellHeight } =
		storeToRefs(frameSpaceStore);

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
					'onUpdate:modelValue': (value: string) =>
						(xGridBoundary.value = +value),
					'title': '# X-Grid:',
					'id': 'x-grid',
					'type': 'number',
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
					'onUpdate:modelValue': (value: string) =>
						(yGridBoundary.value = +value),
					'title': '# Y-Grid:',
					'id': 'y-grid',
					'type': 'number',
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
					'onUpdate:modelValue': (value: string) => (cellHeight.value = +value),
					'title': '% Cell-Height:',
					'id': 'cell-height',
					'type': 'number',
				},
			},
		}),
	];
};
