<script setup lang="ts">
import type { GridCell } from '~/types/GridCell';
import GridElements from './grid-elements.vue';
import SettingLabelInputCell from './cell-components/setting-label-input-cell.vue';
import SettingLabelCell from './cell-components/setting-label-cell.vue';
import SettingInputCell from './cell-components/setting-input-cell.vue';
import SettingSelectCell from './cell-components/setting-select-cell.vue';
import SettingButtonCell from './cell-components/setting-button-cell.vue';
import type IframeCell from './cell-components/iframe-cell.vue';

const frameSpaceStore = useFrameSpaceStore();
const { xGrid, yGrid, cellHeight, iframesSrcOptions, outOfBoundIframes, iframeGridCells } = storeToRefs(frameSpaceStore);

let emailRef: Ref<HTMLInputElement> | null = null;
const email = ref('');
const password = ref('');
const handleLogin = () => {
    if (!validateEmailInput(emailRef!.value)) return;
    console.log(email.value);
    console.log(password.value);
}
const handleRegister = () => {
    if (!validateEmailInput(emailRef!.value)) return;
    console.log(email.value);
    console.log(password.value);
}
const validateEmailInput = (emailRef: HTMLInputElement) => {
    const isValid = emailRef.checkValidity();
    if (!isValid) {
        setTimeout(() => {
            emailRef.reportValidity();
        });
    }
    return isValid;
}

const handleAddIframe = () => {
    if (!addIframeSrc.value) {
        alert('Iframe url is missing!');
        return;
    }
    frameSpaceStore.addIframeInFreeCell({
        src: addIframeSrc.value,
        classes: new Set(['golden-animation'])
    });
}
const handleRemoveIframe = () => {
    if (removeIframe.value === '') return;
    frameSpaceStore.removeIframe(removeIframe.value)
}

const addIframeSrc = ref('');
const removeIframe = ref<GridCell<typeof IframeCell> | ''>('');
type SettingCells = typeof SettingLabelInputCell | typeof SettingLabelCell | typeof SettingInputCell | typeof SettingSelectCell | typeof SettingButtonCell;
const editMode = ref(true);
const gridCells = ref<GridCell<SettingCells>[]>([
    { /* GRID ATTRIBUTES */
        cellX: 7,
        cellY: 4,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelInputCell),
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
        cellY: 5,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelInputCell),
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
        cellY: 6,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelInputCell),
            props: {
                'modelValue': cellHeight,
                'onUpdate:modelValue': (value: string) => cellHeight.value = +value,
                'title': '% Cell-Height:',
                'id': 'cell-height',
                'type': 'number',
            }
        }
    }, { /* ADD IFRAME */
        cellX: 5,
        cellY: 1,
        cellWidth: 2,
        cellHeight: 2,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelCell),
            props: {
                'title': 'Add Iframe',
                'id': 'add-iframe',
            }
        }
    }, {
        cellX: 7,
        cellY: 1,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingSelectCell),
            props: {
                'modelValue': addIframeSrc,
                'onUpdate:modelValue': (value: string) => addIframeSrc.value = value,
                'id': 'add-iframe-select',
                'options': iframesSrcOptions,
            }
        }
    }, {
        cellX: 7,
        cellY: 2,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingInputCell),
            props: {
                'modelValue': addIframeSrc,
                'onUpdate:modelValue': (value: string) => addIframeSrc.value = value,
                'id': 'add-iframe',
                'type': 'text',
            }
        }
    }, {
        cellX: 10,
        cellY: 1,
        cellWidth: 2,
        cellHeight: 2,
        classes: new Set(),
        component: {
            is: shallowRef(SettingButtonCell),
            props: {
                'title': 'Add Iframe',
                'onClick': handleAddIframe
            }
        }
    }, { /* REMOVE IFRAME */
        cellX: 5,
        cellY: 3,
        cellWidth: 2,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelCell),
            props: {
                'title': 'Remove Iframe',
                'id': 'remove-iframe-select',
            }
        }
    }, {
        cellX: 7,
        cellY: 3,
        cellWidth: 3,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingSelectCell),
            props: {
                'modelValue': removeIframe,
                'onUpdate:modelValue': (value: GridCell<typeof IframeCell>) => removeIframe.value = value,
                'id': 'remove-iframe-select',
                'options': iframeGridCells,
                'formatter': (option: GridCell<typeof IframeCell>) => `[${option.cellY}-${option.cellX}]: ${option.component.bind!.src}`
            }
        }
    }, {
        cellX: 10,
        cellY: 3,
        cellWidth: 2,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingButtonCell),
            props: {
                'title': 'Remove Iframe',
                'onClick': handleRemoveIframe,
            }
        }
    }, { /* LOGIN */
        cellX: 1,
        cellY: 1,
        cellWidth: 2,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelCell),
            props: {
                'title': 'Login',
                'id': 'login',
            }
        }
    }, {
        cellX: 1,
        cellY: 2,
        cellWidth: 2,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelInputCell),
            props: {
                'modelValue': email,
                'onUpdate:modelValue': (value: string) => email.value = value,
                'title': 'Email',
                'id': 'email',
                'type': 'email',
                'setRef': (childRef) => emailRef = childRef,
            }
        }
    }, {
        cellX: 1,
        cellY: 3,
        cellWidth: 2,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingLabelInputCell),
            props: {
                'modelValue': password,
                'onUpdate:modelValue': (value: string) => password.value = value,
                'title': 'Password',
                'id': 'password',
                'type': 'text',
            }
        }
    }, {
        cellX: 1,
        cellY: 4,
        cellWidth: 1,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingButtonCell),
            props: {
                'title': 'Register',
                'onClick': handleRegister,
            }
        }
    }, {
        cellX: 2,
        cellY: 4,
        cellWidth: 1,
        cellHeight: 1,
        classes: new Set(),
        component: {
            is: shallowRef(SettingButtonCell),
            props: {
                'title': 'Login',
                'onClick': handleLogin,
            }
        }
    },
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
