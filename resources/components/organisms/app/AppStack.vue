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
    direction: {
        default: 'column',
        type: String,
    },
});
</script>

<template>
    <Component
        :is="tag"
        class="c-appStack"
        :class="[`c-appStack--gap-${gap}`, `c-appStack--direction-${direction}`]"
    >
        <slot/>
    </Component>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-appStack {
    display: flex;
    flex-wrap: wrap;

    &--direction-column {
        flex-direction: column;
    }

    &--direction-row {
        flex-direction: row;
    }

    &--gap-xs {
        gap: $k-spacing--xs;
    }

    &--gap-s {
        gap: $k-spacing--s;
    }

    &--gap-m {
        gap: $k-spacing--m;
    }

    &--gap-xl {
        gap: $k-spacing--xl;
    }
}
</style>
