<script setup>

defineProps({
    condensed: {
        type: Boolean,
        default: false,
    },
    full: {
        type: Boolean,
        default: false,
    },
    small: {
        type: Boolean,
        default: false,
    },
    primary: {
        type: Boolean,
        default: false,
    },
    secondary: {
        type: Boolean,
        default: false,
    },
    dark: {
        type: Boolean,
        default: false,
    },
    gray: {
        type: Boolean,
        default: false,
    },
    light: {
        type: Boolean,
        default: false,
    },
});

</script>

<template>
    <span
        class="k-c-badge"
        :class="{
            'k-c-badge--condensed': condensed,
            'k-c-badge--full': full,
            'k-c-badge--small': small,
            'k-c-badge--primary': primary,
            'k-c-badge--secondary': secondary,
            'k-c-badge--dark': dark,
            'k-c-badge--gray': gray,
            'k-c-badge--light': light,
        }"
    >
        <slot/>
    </span>
</template>
