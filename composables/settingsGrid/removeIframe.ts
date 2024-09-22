import GridCell from '~/classes/GridCell';
import SettingLabelCell from '~/components/cells/setting-label-cell.vue';
import SettingSelectCell from '~/components/cells/setting-select-cell.vue';
import type IframeCell from '~/components/cells/iframe-cell.vue';
import SettingButtonCell from '~/components/cells/setting-button-cell.vue';

export default () => {
	const frameSpaceStore = useFrameSpaceStore();
	const { iframeGridCells } = storeToRefs(frameSpaceStore);

	const removeIframe = ref<GridCell<typeof IframeCell> | ''>('');

	const handleRemoveIframe = () => {
		if (removeIframe.value === '') return;
		frameSpaceStore.removeIframe(removeIframe.value);
	};

	return [
		new GridCell({
			id: 'remove-iframe',
			yGrid: 3,
			xGrid: 5,
			height: 1,
			width: 2,
			component: {
				is: SettingLabelCell,
				props: {
					title: 'Remove Iframe',
					id: 'remove-iframe-select',
				},
			},
		}),
		new GridCell({
			id: 'remove-iframe-select',
			yGrid: 3,
			xGrid: 7,
			height: 1,
			width: 3,
			component: {
				is: SettingSelectCell,
				props: {
					'modelValue': removeIframe,
					'onUpdate:modelValue': (value: GridCell<typeof IframeCell>) =>
						(removeIframe.value = value),
					'id': 'remove-iframe-select',
					'options': iframeGridCells.value,
					'formatter': (option: GridCell<typeof IframeCell>) =>
						`[${option.yGrid}-${option.xGrid}]: ${option.component.bind!.src}`,
				},
			},
		}),
		new GridCell({
			id: 'remove-iframe-button',
			yGrid: 3,
			xGrid: 10,
			height: 1,
			width: 2,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Remove Iframe',
					onClick: handleRemoveIframe,
				},
			},
		}),
	];
};
