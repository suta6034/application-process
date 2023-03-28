<script setup>
defineProps({
    transparent: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <!-- eslint-disable max-len -->
    <svg class="c-svgImageEditor" :class="{'c-svgImageEditor--transparent': transparent}" version="1.1" id="Ebene_1"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="18px" height="18px" viewBox="0 0 18 18" enable-background="new 0 0 18 18" xml:space="preserve">
        <path d="M15.17,14.8H2.83c-0.64,0-1.16-0.52-1.16-1.16V6.12c0-0.64,0.52-1.16,1.16-1.16h1.84
            c0.11-0.04,0.53-0.48,0.8-0.77c0.62-0.64,0.98-1,1.31-1h4.43c0.33,0,0.69,0.36,1.31,1c0.28,0.29,0.7,0.72,0.84,0.77l1.81,0
            c0.64,0,1.16,0.52,1.16,1.16v7.52C16.33,14.28,15.81,14.8,15.17,14.8z M2.83,5.57c-0.31,0-0.56,0.25-0.56,0.56v7.52
            c0,0.31,0.25,0.56,0.56,0.56h12.35c0.31,0,0.56-0.25,0.56-0.56V6.12c0-0.31-0.25-0.56-0.56-0.56h-1.85c-0.3,0-0.63-0.32-1.23-0.95
            c-0.28-0.29-0.74-0.76-0.9-0.82H6.78C6.65,3.84,6.18,4.33,5.9,4.62C5.3,5.24,4.97,5.57,4.66,5.57H2.83z"/>
                <path d="M9,12.17c-1.54,0-2.8-1.26-2.8-2.8s1.26-2.8,2.8-2.8s2.8,1.26,2.8,2.8S10.55,12.17,9,12.17z M9,7.17
            c-1.21,0-2.2,0.99-2.2,2.2s0.99,2.2,2.2,2.2s2.2-0.99,2.2-2.2S10.22,7.17,9,7.17z"/>
    </svg>
    <!-- eslint-enable -->
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';

.c-svgImageEditor {
    background-color: $k-color-gray--100;
    color: $k-color-gray--600;

    &:focus,
    &:hover {
        background-color: $k-color-gray--300;
    }

    &--transparent {
        background-color: transparent;

        &:focus,
        &:hover {
            background-color: transparent;
        }
    }
}
</style>

