<script setup>
defineProps({
    type: {
        type: String,
        default: 'info',
    },
});
</script>

<template>
    <ul
        :class="{
            [`c-formMessage--${type}`]: type,
        }"
        class="c-formMessage"
        data-qa="form message"
    >
        <slot/>
    </ul>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-formMessage {
    @include k-typo-s;

    &--success {
        color: $k-color-success--text;
    }

    &--error {
        color: $k-color-error--text;
    }

    &--warning {
        color: $k-color-warning--text;
    }

    &--info {
        color: $k-color-gray--900;
    }
}
</style>
