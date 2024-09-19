import { acceptHMRUpdate, defineStore } from 'pinia';

export const useFrameSpaceStore = defineStore({
	id: 'frameSpaceStore',
	state: () => ({
		xGrid: 10,
		yGrid: 10,
		cellHeight: 10,
	}),
	actions: {},
});

import.meta.hot?.accept(acceptHMRUpdate(useFrameSpaceStore, import.meta.hot));
