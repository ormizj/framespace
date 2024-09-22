<script setup lang="ts">
import type GridCell from '~/classes/GridCell';
import GridElements from '~/components/grid-elements.vue';
import gridAttributes from '../composables/settingsGrid/gridAttributes';
import addIframe from '~/composables/settingsGrid/addIframe';
import removeIframe from '~/composables/settingsGrid/removeIframe';
import auth from '~/composables/settingsGrid/auth';

const frameSpaceStore = useFrameSpaceStore();
const { outOfBoundIframes } = storeToRefs(frameSpaceStore);

const editMode = ref(true);
const gridCells = ref<GridCell[]>([
    ...gridAttributes(),
    ...addIframe(),
    ...removeIframe(),
    ...auth(),
]);
</script>

<template>
    <div class="settings">
        <div class="header">
            <div class="message-container start">
                <h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
                    Iframes out of bound: {{ outOfBoundIframes.amount }}
                </h3>
            </div>
            <div class="message-container center">
                <h2>
                    Settings
                </h2>
            </div>
            <div class="message-container end">
                <h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
                    Highest X-Grid: {{ outOfBoundIframes.maxX }}
                </h3>
                &nbsp;&nbsp;&nbsp;
                <h3 class="message" :class="{ warning: outOfBoundIframes.amount }">
                    Highest Y-Grid: {{ outOfBoundIframes.maxY }}
                </h3>
            </div>
        </div>
        <div class="content">
            <ClientOnly>
                <GridElements class="grid-elements" v-model="gridCells" v-model:edit="editMode" :x-grid="15"
                    :y-grid="15" :cell-height="10" :always-interactive="true" />
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
    }

    .content {
        overflow-y: auto;
        height: calc(100% - var(--header-height) - var(--tab-height));
        border-bottom: 1px solid var(--secondary);
        border-top: 1px solid var(--secondary);
    }

    .message-container {
        display: flex;
        width: 100%;

        &.start {
            justify-content: end;
        }

        &.center {
            justify-content: center;
        }

        &.end {
            justify-content: start;
        }

        .message {
            border-radius: var(--border-glow-radius);
            padding: 0.5rem;

            &.warning {
                animation: subtle-glow-warning var(--animation-long-duration) infinite alternate;
            }
        }
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


@keyframes subtle-glow-warning {
    from {
        box-shadow: 0 0 1px var(--warning) inset;
    }

    to {
        box-shadow: 0 0 calc(var(--border-glow-radius) / 2) var(--warning) inset;
    }
}
</style>
