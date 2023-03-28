<script setup>
defineProps({
    transparent: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="c-layoutDefaultDetail"
    >
        <div
            class="c-layoutDefaultDetail__inner"
            :class="{
                'c-layoutDefaultDetail__inner--transparent': transparent,
            }"
        >
            <slot/>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';

.c-layoutDefaultDetail {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding-top: $k-spacing--m;
    width: 100%;

    @media (min-width: $k-breakpoint--m) {
        @include wrap(math.div(12, 12));
    }

    &__inner {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        padding: $k-spacing--l $k-spacing--l $k-spacing--xl $k-spacing--l;
        background-color: $k-color-white;

        &--transparent {
            background: transparent;
        }
    }
}
</style>
