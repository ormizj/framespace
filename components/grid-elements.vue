<script setup lang="ts">

import interact from 'interactjs'
import { useWindowSize } from '@vueuse/core'

// TODO temp
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"

const editModel = defineModel('edit', { default: false });

const { width, height } = useWindowSize();
const yGrid = ref(height.value / 10);
const xGrid = ref(width.value / 10);
const yMin = ref(100);
const xMin = ref(100);

const gridElements = ref<HTMLDivElement | null>(null);

onMounted(() => {
    const initializeGridElements = (element: HTMLElement) => {
        let y = 0;
        let x = 0;
        interact(element).draggable({
            listeners: {
                move(event) {
                    x += event.dx
                    y += event.dy
                    event.target.style.transform = `translate(${x}px,${y}px)`
                },
            },
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        interact.snappers.grid({ x: xGrid.value, y: yGrid.value })
                    ],
                    relativePoints: [{ x: 0, y: 0 }]
                }),
                interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: {
                        top: 0,
                        left: 0,
                        bottom: 1,
                        right: 1
                    },
                })
            ],
        }).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    const target = event.target
                    let x = (parseFloat(target.getAttribute('data-x')) || 0)
                    let y = (parseFloat(target.getAttribute('data-y')) || 0)

                    target.style.width = `${event.rect.width}px`
                    target.style.height = `${event.rect.height}px`

                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                }
            },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),
                interact.modifiers.restrictSize({
                    min: { width: xMin.value, height: yMin.value }
                })
            ],
        })
    }

    gridElements.value!.childNodes.forEach((el) => {
        initializeGridElements(el as HTMLElement);
    });
})
</script>

<template>
    <div class="grid-elements" ref="gridElements" :class="{ edit: editModel }">
        <div class="grid-snap block1">
            <iframe :src="link" class="iframe" />
        </div>
        <div class="grid-snap block2">
            <iframe :src="link" class="iframe" />
        </div>
        <div class="grid-snap block3">
            <iframe :src="link" class="iframe" />
        </div>
    </div>
</template>

<style scoped>
.grid-elements {
    width: 100%;
    height: 100%;
    user-select: none;

    .grid-snap {
        /* TODO temp */
        width: 300px;
    }

    .iframe {
        border: unset;
        width: 100%;
        height: 100%;
    }
}

.grid-elements.edit {
    .iframe {
        pointer-events: none;
    }

    .grid-snap {
        pointer-events: auto;
    }
}

.grid-elements:not('.edit') {
    .iframe {
        pointer-events: auto;
    }

    .grid-snap {
        pointer-events: none;
    }
}
</style>