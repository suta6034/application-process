<script setup>
defineProps({
    selected: {
        default: false,
        type: Boolean,
    },
});
</script>

<template>
    <li
        class="c-appSelectableItem"
        :class="{
            'c-appSelectableItem--selected': selected
        }"
    >
        <slot/>
    </li>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appSelectableItem {
    $marker-width: 3px;

    position: relative;
    padding: $k-spacing--l;
    border-bottom: 1px solid $k-color-gray--100;
    -webkit-tap-highlight-color: transparent;

    &--selected {
        &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            display: block;
            width: $marker-width;
            background: $k-color-green--600;
            content: '';
        }
    }
}
</style>
