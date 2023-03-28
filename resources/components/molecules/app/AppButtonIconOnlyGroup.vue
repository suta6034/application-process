<script setup>
defineProps({
    isEditable: {
        default: true,
        type: Boolean,
    },
});
</script>

<template>
    <div class="c-appButtonIconOnlyGroup">
        <slot/>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-appButtonIconOnlyGroup {
    display: inline-flex;
    align-items: center;

    > * {
        &:not(:first-child) {
            margin-left: $k-spacing--m;

            @media (min-width: $k-breakpoint--m) {
                margin-left: $k-spacing--s;
            }
        }
    }
}
</style>
