<script setup>
defineProps({
    tag: {
        default: 'button',
        type: String,
    },
    to: {
        type: Object,
    },
});
</script>

<template>
    <Component
        :is="to ? 'router-link' : tag"
        :to="to"
        class="c-appButtonUnstyled"
        v-on="$listeners"
    >
        <slot/>
    </Component>
</template>

<style lang="scss">
.c-appButtonUnstyled {
    padding: 0;
    border: none;
    background-color: transparent;
}
</style>
