<script setup lang="ts"></script>

<template>
    <div class="grid-elements">
        <div class="block1">block1</div>
        <div class="block2">block2</div>
        <div class="block3">block3</div>
        <div class="block4">block4</div>
        <div class="block5">block5</div>
        <div class="block6">block6</div>
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

.block1 {
    background-color: red;
    grid-area: 11/11/15/15;
}

.block2 {
    background-color: green;
}

.block3 {
    background-color: blue;
}

.block4 {
    background-color: red;
}

.block5 {
    background-color: green;
}

.block6 {
    background-color: blue;
}
</style>