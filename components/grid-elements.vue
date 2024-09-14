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
                        // @ts-ignore: element type is not exact
                        restriction: element.parentNode,
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
            }).resizable({ // TODO
                edges: {
                    bottom: true,
                    left: true,
                    right: true,
                    top: true,
                },
                listeners: {
                    move: function (event) {
                        let { x, y } = event.target.dataset

                        x = (parseFloat(x) || 0) + event.deltaRect.left
                        y = (parseFloat(y) || 0) + event.deltaRect.top

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            transform: `translate(${x}px, ${y}px)`
                        })

                        Object.assign(event.target.dataset, { x, y })
                    }
                }
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
        background-color: #29e;
        width: 300px;
    }

    .iframe {
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