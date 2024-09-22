import GridCell from '~/classes/GridCell';
import SettingLabelCell from './cells/setting-label-cell.vue';
import SettingSelectCell from './cells/setting-select-cell.vue';
import SettingInputCell from './cells/setting-input-cell.vue';
import SettingButtonCell from './cells/setting-button-cell.vue';

const frameSpaceStore = useFrameSpaceStore();
const { iframesSrcOptions } = storeToRefs(frameSpaceStore);

const addIframeSrc = ref('');

const handleAddIframe = () => {
	if (!addIframeSrc.value) {
		alert('Iframe url is missing!');
		return;
	}
	frameSpaceStore.addIframeInFreeCell(
		addIframeSrc.value,
		new Set(['golden-animation'])
	);
};

export default [
	new GridCell({
		id: 'add-iframe',
		yGrid: 1,
		xGrid: 5,
		height: 2,
		width: 2,
		component: {
			is: SettingLabelCell,
			props: {
				title: 'Add Iframe',
				id: 'add-iframe',
			},
		},
	}),
	new GridCell({
		id: 'add-iframe-select',
		yGrid: 1,
		xGrid: 7,
		height: 1,
		width: 3,
		component: {
			is: SettingSelectCell,
			props: {
				'modelValue': addIframeSrc,
				'onUpdate:modelValue': (value: string) => (addIframeSrc.value = value),
				'id': 'add-iframe-select',
				'options': iframesSrcOptions,
			},
		},
	}),
	new GridCell({
		id: 'add-iframe-input',
		yGrid: 2,
		xGrid: 7,
		height: 1,
		width: 3,
		component: {
			is: SettingInputCell,
			props: {
				'modelValue': addIframeSrc,
				'onUpdate:modelValue': (value: string) => (addIframeSrc.value = value),
				'id': 'add-iframe',
				'type': 'text',
			},
		},
	}),
	new GridCell({
		id: 'add-iframe-button',
		xGrid: 10,
		yGrid: 1,
		width: 2,
		height: 2,
		component: {
			is: SettingButtonCell,
			props: {
				title: 'Add Iframe',
				onClick: handleAddIframe,
			},
		},
	}),
];
