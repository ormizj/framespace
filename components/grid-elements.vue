<script setup lang="ts">

import interact from 'interactjs'

onMounted(() => {
    var element = document.querySelector('.grid-snap')
    var x = 0; var y = 0

    interact(element)
        .draggable({
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        interact.snappers.grid({ x: 30, y: 30 })
                    ],
                    range: Infinity,
                    relativePoints: [{ x: 0, y: 0 }]
                }),
                interact.modifiers.restrict({
                    restriction: element.parentNode,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                })
            ],
        })
        .on('dragmove', function (event) {
            x += event.dx
            y += event.dy

            event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        })
})
</script>

<template>
    <div class="grid-elements">
        <div class="grid-snap">Block1</div>

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
    grid-area: 11/11/15/15;
}
</style>