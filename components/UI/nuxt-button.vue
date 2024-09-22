<script setup lang="ts">
withDefaults(defineProps<{
    location?: 'none' | 'start' | 'center' | 'end'
}>(), {
    location: 'none',
})

const isHydrating = useIsHydrating();
</script>

<template>
    <button class="nuxt-button" :class="[location]" :disabled="isHydrating">
        <slot />
    </button>
</template>

<style scoped>
.nuxt-button {
    background-color: color-mix(in srgb, var(--background), transparent 50%);
    padding: 0.5rem;
    color: var(--secondary);
    border-radius: calc(var(--border-glow-radius)/ 4);
    border: unset;

    &:active {
        background-color: var(--secondary);
        color: var(--background);
    }

    &.start {
        border-start-end-radius: unset;
        border-end-end-radius: unset;
    }

    &.center {
        border-radius: unset;
    }

    &.end {
        border-end-start-radius: unset;
        border-start-start-radius: unset;
    }
}

@keyframes very-subtle-glow {
    from {
        box-shadow: 0 0 1px var(--secondary);
    }

    to {
        box-shadow: 0 0 3px var(--secondary);
    }
}

.nuxt-button {
    animation: very-subtle-glow var(--animation-longer-duration) infinite alternate;
}
</style>