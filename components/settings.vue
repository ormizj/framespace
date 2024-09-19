<script setup lang="ts">
import type { GridCell } from '~/types/GridCell';
import SettingTextCell from './cell-components/setting-text-cell.vue';
import GridElements from './grid-elements.vue';

const frameSpaceStore = useFrameSpaceStore();
const { xGrid, yGrid, cellHeight } = storeToRefs(frameSpaceStore);

const editMode = ref(true);
const gridCells = ref<GridCell<typeof SettingTextCell>[]>([{
    cellX: 7,
    cellY: 1,
    cellWidth: 3,
    cellHeight: 1,
    classes: new Set(),
    component: {
        is: shallowRef(SettingTextCell),
        props: {
            'modelValue': xGrid,
            'onUpdate:modelValue': (value: string) => xGrid.value = +value,
            'title': '# X-Grid:',
            'id': 'x-grid',
            'type': 'number',
        }
    }
}, {
    cellX: 7,
    cellY: 2,
    cellWidth: 3,
    cellHeight: 1,
    classes: new Set(),
    component: {
        is: shallowRef(SettingTextCell),
        props: {
            'modelValue': yGrid,
            'onUpdate:modelValue': (value: string) => yGrid.value = +value,
            'title': '# Y-Grid:',
            'id': 'y-grid',
            'type': 'number',
        }
    }
}, {
    cellX: 7,
    cellY: 3,
    cellWidth: 3,
    cellHeight: 1,
    classes: new Set(),
    component: {
        is: shallowRef(SettingTextCell),
        props: {
            'modelValue': cellHeight,
            'onUpdate:modelValue': (value: string) => cellHeight.value = +value,
            'title': '% Cell-Height:',
            'id': 'cell-height',
            'type': 'number',
        }
    }
}]);
</script>

<template>
    <div class="settings">
        <div class="header">
            <h2>
                Settings
            </h2>
        </div>
        <div class="content">
            <ClientOnly>
                <GridElements class="grid-elements" v-model="gridCells as unknown as GridCell[]" v-model:edit="editMode"
                    :x-grid="15" :y-grid="15" :cell-height="10" :always-interactive="true" />
            </ClientOnly>
        </div>
    </div>
</template>

<style scoped>
.settings {
    height: 100%;

    .header {
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        overflow-y: auto;
        height: calc(100% - var(--header-height) - var(--tab-height));
        border-bottom: 1px solid var(--secondary);
        border-top: 1px solid var(--secondary);
    }
}


@keyframes subtle-glow {
    from {
        box-shadow: 0 0 1px var(--secondary);
    }

    to {
        box-shadow: 0 0 10px var(--secondary);
    }
}

:deep(.grid-cell:not(.error-animation)) {
    animation: subtle-glow var(--animation-longer-duration) infinite alternate;
}
</style>
