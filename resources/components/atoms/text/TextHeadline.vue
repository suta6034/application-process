<script setup>
defineProps({
    level: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        default: 'm',
    },
    bold: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <h1
        :is="`h${level}`"
        :class="{
            [`k-c-headline-${size}`]: size,
            'k-c-headline--bold': bold,
        }"
        class="k-c-headline"
    >
        <slot/>
    </h1>
</template>
