<script setup>
defineProps({
    gap: {
        default: 'm',
        type: String,
    },
});
</script>

<template>
    <ul
        class="k-o-ladder"
        :class="{
            [`k-o-ladder--${gap}`]: gap,
        }"
    >
        <slot/>
    </ul>
</template>
