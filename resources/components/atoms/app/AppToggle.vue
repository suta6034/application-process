<script setup>
defineProps({
    value: {
        type: [Boolean, String],
        default: false,
    },
});
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label class="c-appToggle k-c-toggle">
        <input
            :checked="value"
            type="checkbox"
            class="k-c-toggle__input"
            data-qa="toggle input"
            @change="$emit('input', $event.target.checked)"
        >
        <span class="k-c-toggle__symbol"/>
        <span class="k-c-toggle__text">
            <slot/>
        </span>
    </label>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/toggle';
</style>
