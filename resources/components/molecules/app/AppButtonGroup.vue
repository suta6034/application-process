<script setup>
defineProps({
    variant: {
        type: String,
    },
});
</script>

<template>
    <div
        :class="{
            [`c-appButtonGroup--${variant}`]: variant,
        }"
        class="c-appButtonGroup"
    >
        <div
            v-if="$slots.default"
            class="c-appButtonGroup__item"
        >
            <slot/>
        </div>
        <div
            v-if="$scopedSlots.secondary"
            class="c-appButtonGroup__item"
        >
            <slot name="secondary"/>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-appButtonGroup {
    $root: &;

    text-align: center;

    &__item {
        display: flex;
        flex-direction: column;

        &:not(:first-child) {
            margin-top: $k-spacing--l;

            @media (min-width: $k-breakpoint--m) {
                margin-top: $k-spacing--m;
            }
        }

        #{$root}--slim & {
            align-items: center;
        }

        #{$root}--right &,
        #{$root}--left & {
            &:not(:first-child) {
                margin-top: $k-spacing--s;

                @media (min-width: $k-breakpoint--m) {
                    margin-top: 0;
                }
            }

            @media (min-width: $k-breakpoint--m) {
                padding-left: $k-spacing--s;
            }
        }

        @media (min-width: $k-breakpoint--m) {
            align-items: center;
        }
    }

    &--right {
        @media (min-width: $k-breakpoint--m) {
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-end;
        }
    }

    &--left {
        @media (min-width: $k-breakpoint--m) {
            display: flex;
            justify-content: start;
        }
    }
}
</style>
