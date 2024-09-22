<script setup lang="ts">
import GridElements from '../grid-elements.vue';
import type IframeCell from '../cell-components/iframe-cell.vue';
import SettingLabelInputCell from './cells/setting-label-input-cell.vue';
import SettingLabelCell from './cells/setting-label-cell.vue';
import SettingInputCell from './cells/setting-input-cell.vue';
import SettingSelectCell from './cells/setting-select-cell.vue';
import SettingButtonCell from './cells/setting-button-cell.vue';
import type GridCell from '~/classes/GridCell';

const frameSpaceStore = useFrameSpaceStore();
const { outOfBoundIframes, iframeGridCells } = storeToRefs(frameSpaceStore);

const emailRef = ref<HTMLInputElement | null>(null);
const email = ref('');
const password = ref('');
const handleLogin = () => {
    if (!validateEmailInput(emailRef.value!)) return;
    console.log(email.value);
    console.log(password.value);
}
const handleRegister = () => {
    if (!validateEmailInput(emailRef.value!)) return;
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


const handleRemoveIframe = () => {
    if (removeIframe.value === '') return;
    frameSpaceStore.removeIframe(removeIframe.value)
}

const removeIframe = ref<GridCell<typeof IframeCell> | ''>('');
const editMode = ref(true);

type SettingCells = Component & (
    typeof SettingLabelInputCell |
    typeof SettingLabelCell |
    typeof SettingInputCell |
    typeof SettingSelectCell |
    typeof SettingButtonCell
);
const gridCells = ref<GridCell<SettingCells>[]>([
    { /* REMOVE IFRAME */
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
            is: SettingLabelInputCell,
            props: {
                'modelValue': email,
                'onUpdate:modelValue': (value: string) => email.value = value,
                'title': 'Email',
                'id': 'email',
                'type': 'email',
                'required': true,
                'setRef': (componentRef) => emailRef.value = componentRef.value,
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
                'required': true,
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
