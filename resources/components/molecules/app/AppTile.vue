<script setup>
defineProps({
    to: {
        type: Object,
    },
    highlighted: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Boolean,
        default: false,
    },
    spacingHorizontal: {
        type: String,
    },
    variant: {
        type: String,
    },
});
</script>

<template>
    <div
        :is="to ? 'router-link' : 'div'"
        :to="to"
        :class="{
            [`c-appTile--spacingHorizontal-${spacingHorizontal}`]: spacingHorizontal,
            [`c-appTile--${variant}`]: variant,
            'is-highlighted': highlighted,
            'has-status-error': error,
        }"
        class="c-appTile"
    >
        <slot/>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appTile {
    display: block;
    padding: $k-spacing--m;
    border: 1px solid $k-color-gray--200;
    border-radius: $k-border-radius--s;
    transition: border-color 0.2s;

    &--hasBorderWhite {
        border: 1px solid $k-color-white;
        background: $k-color-white;
    }

    &,
    &:hover,
    &:visited {
        color: $k-color-text;
    }

    &:not(div):hover,
    &:not(div):focus {
        border-color: $k-color-green--800;
    }

    &.is-highlighted {
        border-color: $k-color-primary--dark;
    }

    &.has-status-error {
        border-color: $k-color-error--border;
    }

    &--spacingHorizontal-l {
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
    }
}
</style>
