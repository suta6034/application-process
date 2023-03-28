<script setup>
defineProps({
    value: {
        type: Number,
        default: 0,
    },
});
</script>

<template>
    <progress
        :value="value"
        class="c-progressBar"
        max="100"
    />
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';

// 1. An enormous border radius guarantees to have the correct styling on every device.
// 2. Ensures that the progress element is styled correctly in firefox.
// 3. Ensures that the progress element is styled correctly in IE and Edge.
.c-progressBar {
    height: 0.75em;

    &[value] {
        overflow: hidden;
        width: 100%;
        border: none; // 3
        border-radius: 1000px; // 1
        appearance: none;
        background-color: $k-color-white; // 2
        color: $k-color-brand; // 3
    }

    &[value]::-webkit-progress-bar {
        border-radius: 1000px; // 1
        background-color: $k-color-white;
    }

    &::-moz-progress-bar {
        background-color: $k-color-brand; // 2
    }

    &[value]::-webkit-progress-value {
        border-top-left-radius: 1000px; // 1
        border-bottom-left-radius: 1000px; // 1
        background-color: $k-color-brand;
    }
}
</style>
