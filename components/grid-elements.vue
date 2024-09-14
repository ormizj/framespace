<script setup lang="ts">

import interact from 'interactjs'

onMounted(() => {
    const resize = (className: string) => {
        var element: HTMLElement = document.querySelector(`.${className}`)!
        var x = 0; var y = 0

        interact(element)
            .draggable({
                modifiers: [
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: 10, y: 10 })
                        ],
                        range: Infinity,
                        relativePoints: [{ x: 0, y: 0 }]
                    }),
                    interact.modifiers.restrict({
                        restriction: element.parentNode,
                        elementRect: {
                            top: 0,
                            left: 0,
                            bottom: 1,
                            right: 1
                        },
                        endOnly: true
                    })
                ],
            })
            .on('dragmove', function (event) {
                x += event.dx
                y += event.dy

                event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
            }).resizable({
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
    <div class="grid-elements">
        <div class="grid-snap block1">Block1</div>
        <div class="grid-snap block2">Block2</div>
        <div class="grid-snap block3">Block3</div>
    </div>
</template>

<style scoped>
.grid-elements {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(auto-fill, 1dvw);
    grid-template-rows: repeat(auto-fill, 1dvh);
}

.grid-snap {
    background-color: #29e;
    touch-action: none;
    grid-area: 11/11/50/50;
}
</style>