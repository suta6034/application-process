<script setup>
import ProgressDots from '../../atoms/progress/ProgressDots';
</script>

<template>
    <div
        class="c-progressBackdrop"
        data-qa="loading dots"
    >
        <ProgressDots/>
        <div
            v-if="$slots.default"
            class="c-progressBackdrop__text"
        >
            <slot/>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-progressBackdrop {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba($k-color-white, 0.9);

    &__text {
        margin-top: $k-spacing--m;
        color: $k-color-gray--600;
    }
}
</style>
