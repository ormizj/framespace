import GridCell from '~/classes/GridCell';
import SettingLabelCell from '~/components/cells/setting-label-cell.vue';
import SettingSelectCell from '~/components/cells/setting-select-cell.vue';
import SettingInputCell from '~/components/cells/setting-input-cell.vue';
import SettingButtonCell from '~/components/cells/setting-button-cell.vue';

export default () => {
	const frameSpaceStore = useFrameSpaceStore();
	const { iframesSrcOptions } = storeToRefs(frameSpaceStore);
	const addIframeSrc = ref('');
	const iframeInputRef = ref<HTMLInputElement | null>(null);

	const handleAddIframe = () => {
		if (!validateElement(iframeInputRef.value!)) return;
		frameSpaceStore.addIframeInFreeCell(
			addIframeSrc.value,
			new Set(['golden-animation'])
		);
	};

	return [
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
					forId: 'add-iframe',
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
					'v-model': addIframeSrc,
					'modelValue': addIframeSrc,
					'onUpdate:modelValue': (value: string) =>
						(addIframeSrc.value = value),
					'id': 'add-iframe-select',
					'options': iframesSrcOptions.value,
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
					'v-model': addIframeSrc,
					'modelValue': addIframeSrc,
					'onUpdate:modelValue': (value: string) =>
						(addIframeSrc.value = value),
					'id': 'add-iframe',
					'type': 'text',
					'required': true,
					'setRef': (componentRef: HTMLInputElement) => {
						iframeInputRef.value = componentRef;
					},
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
};
