<script setup>
defineProps({
    reset: {
        type: Boolean,
        default: false,
    },
    split: {
        type: Boolean,
        default: false,
    },
    splitHalf: {
        type: Boolean,
        default: false,
    },
    splitFirstBig: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="c-formRow"
        :class="{
            'c-formRow--reset': reset,
            'c-formRow--split': split,
            'c-formRow--split-first-big': splitFirstBig,
            'c-formRow--split-half': splitHalf,
        }"
    >
        <slot/>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-formRow {
    $root: &;

    display: flex;
    flex-wrap: wrap;
    padding: 0;

    > * {
        padding-top: $k-spacing--m;
        padding-left: $k-spacing--s;
        @include k-layout__item(math.div(12, 12));
    }

    @media (min-width: $k-breakpoint--m) {
        margin: 0;
        padding: 0;
    }

    &#{$root}--split,
    &#{$root}--split-first-big,
    &#{$root}--split-half,
    &#{$root}--reset {
        padding: 0;
    }

    &--split,
    &--split-first-big {
        @media (min-width: $k-breakpoint--m) {
            flex-wrap: nowrap;
        }
    }

    &--split {
        > *:first-child {
            width: auto;
        }

        > *:not(:first-child) {
            width: 100%;
        }
    }

    &--split-first-big {
        > *:first-child {
            width: 100%;
        }

        > *:not(:first-child) {
            width: auto;
        }
    }

    &--split-half {
        @media (min-width: $k-breakpoint--m) {
            > * {
                @include k-layout__item(math.div(6, 12));
            }
        }
    }
}
</style>
