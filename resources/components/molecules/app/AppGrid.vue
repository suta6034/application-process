<script setup>
defineProps({
    gap: {
        default: 'm',
        type: String,
    },
    tag: {
        default: 'div',
        type: String,
    },
});
</script>

<template>
    <Component
        :is="tag"
        class="c-appGrid"
        :class="`c-appGrid--gap-${gap}`"
    >
        <slot/>
    </Component>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-appGrid {
    display: flex;
    flex-wrap: wrap;

    &--gap-s {
        margin-top: -$k-spacing--s;
        margin-left: -$k-spacing--s;

        > * {
            padding-top: $k-spacing--s;
            padding-left: $k-spacing--s;
        }
    }

    &--gap-m {
        margin-top: -$k-spacing--m;
        margin-left: -$k-spacing--m;

        > * {
            padding-top: $k-spacing--m;
            padding-left: $k-spacing--m;
        }
    }

    &--gap-2xl {
        margin-top: -$k-spacing--2xl;
        margin-left: -$k-spacing--2xl;

        > * {
            padding-top: $k-spacing--2xl;
            padding-left: $k-spacing--2xl;
        }
    }
}
</style>
