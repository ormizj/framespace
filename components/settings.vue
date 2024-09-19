<script setup lang="ts">
import SettingCell from './cell-components/setting-cell.vue';
import GridElements from './grid-elements.vue';

const editMode = ref(true);
const gridCells = ref<GridCell[]>([{
    cellX: 1,
    cellY: 1,
    cellWidth: 1,
    cellHeight: 1,
    classes: new Set(),
    component: {
        is: shallowRef(SettingCell),
    }
}, {
    cellX: 1,
    cellY: 7,
    cellWidth: 1,
    cellHeight: 1,
    classes: new Set(),
    component: {
        is: shallowRef(SettingCell),
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
                <GridElements class="grid-elements" v-model="gridCells" v-model:edit="editMode" :x-grid="15"
                    :y-grid="15" :cell-height="10" />
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
</style>