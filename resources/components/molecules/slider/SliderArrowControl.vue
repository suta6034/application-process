<script setup>
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    next: {
        type: Function,
        required: true,
    },
    prev: {
        type: Function,
        required: true,
    },
    isBig: {
        type: Boolean,
        default: false,
    },
    isCentered: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update']);
</script>

<template>
    <div class="c-sliderArrowControl">
        <button
            :class="{
                'c-sliderArrowControl__direction--big': isBig,
                'c-sliderArrowControl__direction--centered': isCentered
            }"
            class="c-sliderArrowControl__direction c-sliderArrowControl__direction--prev"
            aria-label="previous"
            data-qa="prev"
            @click="prev(); emit('update')"
        >
            <AppIcon
                name="arrow-left"
                size="xl"
                fixed-width
            />
        </button>
        <button
            :class="{
                'c-sliderArrowControl__direction--big': isBig,
                'c-sliderArrowControl__direction--centered': isCentered
            }"
            class="c-sliderArrowControl__direction c-sliderArrowControl__direction--next"
            aria-label="next"
            data-qa="next"
            @click="next(); emit('update')"
        >
            <AppIcon
                name="arrow-right"
                size="xl"
                fixed-width
            />
        </button>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/surface-boost';
@import '~@karriereat/global-styles/scss/components/input/settings';

// 1. Because the centered control mode is use within the design template configurator,
//    we need to reduce the height, that the clickable part of the buttons is not on the whole side
.c-sliderArrowControl {
    &__direction {
        @include surface-boost;

        position: absolute;
        top: $k-spacing--s;
        border: none;
        background: transparent;
        color: $k-color-brand;
        cursor: pointer;

        &:hover,
        &:focus {
            color: $k-color-primary--dark;
        }

        &--prev {
            left: $k-spacing--s;
        }

        &--next {
            right: $k-spacing--s;
        }

        &--big {
            top: $k-spacing--3xl;
            padding: 0;
        }

        &--centered {
            bottom: 0;
            margin: auto;
            height: 20%; // 1.
        }
    }
}
</style>
