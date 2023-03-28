<script setup>
import {
    computed,
} from 'vue';

const props = defineProps({
    tag: {
        default: 'div',
        type: String,
    },
    width: {
        default: '12/12',
        type: [Array, String],
    },
});

const widths = computed(() => {
    if (Array.isArray(props.width)) return props.width;
    return [props.width];
});
</script>

<template>
    <Component
        :is="tag"
        class="c-appGridColumn"
        :class="widths.map(width => `c-appGridColumn--width-${width}`)"
    >
        <slot/>
    </Component>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-appGridColumn {
    &--width-12\/12 {
        width: 100%;
    }

    @media (min-width: $k-breakpoint--m) {
        &--width-6\/12\@m {
            width: 50%;
        }

        &--width-4\/12\@m {
            width: 33.3333%;
        }

        &--width-8\/12\@m {
            width: 66.6667%;
        }
    }
}
</style>
