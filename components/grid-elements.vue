<script setup lang="ts">

import interact from 'interactjs'
import { useWindowSize } from '@vueuse/core'
const editModel = defineModel('edit', { default: false });

const { width, height } = useWindowSize();
const yGrid = ref(height.value / 10);
const xGrid = ref(width.value / 10);
const link = "https://www.calculatorsoup.com/calculators/math/percentage.php"

onMounted(() => {
    const resize = (className: string) => {
        var element: HTMLElement = document.querySelector(`.${className}`)!
        var x = 0; var y = 0

        interact(element)
            .draggable({
                modifiers: [
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: xGrid.value, y: yGrid.value })
                        ],
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
            })
            .on('dragmove', function (event) {
                x += event.dx
                y += event.dy
                event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
            }).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        var target = event.target
                        var x = (parseFloat(target.getAttribute('data-x')) || 0)
                        var y = (parseFloat(target.getAttribute('data-y')) || 0)

                        // update the element's style
                        target.style.width = event.rect.width + 'px'
                        target.style.height = event.rect.height + 'px'

                        // translate when resizing from top or left edges
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
                        min: { width: 100, height: 100 }
                    })
                ],

                inertia: true
            })
    }

    resize('block1');
    resize('block2')
    resize('block3')
})
</script>

<template>
    <div class="grid-elements" :class="{ edit: editModel }">
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
    height: 100vh;
    user-select: none;

    .grid-snap {
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