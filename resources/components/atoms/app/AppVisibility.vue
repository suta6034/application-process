<script setup>
defineProps({
    isVisible: {
        type: Boolean,
    },
});
</script>

<template>
    <div
        :class="{
            'is-visible': isVisible,
            'is-not-visible': !isVisible,
        }"
        class="c-appVisibility"
        data-qa="visibility badge"
    >
        <span class="c-appVisibility__label">
            Status:
        </span>
        <span data-qa="visibility">
            {{ isVisible ? 'Sichtbar' : 'Nicht sichtbar' }}
        </span>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

// 1. An enormous border radius guarantees to have the correct styling on every device.
.c-appVisibility {
    @include k-typo-s;

    display: inline-block;
    padding: $k-spacing--s $k-spacing--m;
    border-top-right-radius: 1000px; // 1
    border-bottom-right-radius: 1000px; // 1

    &.is-visible {
        background-color: $k-color-green--200;
        color: $k-color-gray--800;

        &:hover {
            background-color: $k-color-green--300;
        }
    }

    &.is-not-visible {
        background-color: $k-color-gray--100;
        color: $k-color-gray--700;

        &:hover {
            background-color: $k-color-gray--200;
        }
    }

    &__label {
        font-weight: bold;
    }
}
</style>
