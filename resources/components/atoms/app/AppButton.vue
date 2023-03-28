<script setup>
defineProps({
    tag: {
        default: 'button',
        type: String,
    },
    to: {
        type: Object,
    },
    targetBlank: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
    },
    width: {
        type: String,
    },
    outline: {
        type: [Boolean, String],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    },
    slim: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <Component
        :is="to ? 'router-link' : tag"
        :to="to"
        :target="targetBlank ? '_blank' : '_self'"
        :class="{
            [`k-c-button--${size}`]: size,
            [`k-c-button--${width}`]: width,
            [`k-c-button--${outline}`]: outline && typeof outline === 'string',
            [`k-c-button--${color}`]: color,
            'k-c-button--outline': outline === true,
            'k-c-button--disabled': (disabled || loading),
            'k-c-button--slim': slim,
            'k-c-button--icon': $slots.iconLeft || $slots.iconRight,
            'k-c-button--iconRight': $slots.iconRight,
        }"
        class="k-c-button"
        :disabled="disabled"
        v-on="$listeners"
    >
        <div
            v-if="loading"
            class="k-c-loadingDots k-c-loadingDots--white k-c-loadingDots--insideButton"
        >
            <span class="k-c-loadingDots__dot"/>
            <span class="k-c-loadingDots__dot"/>
            <span class="k-c-loadingDots__dot"/>
        </div>
        <span
            v-if="$slots.iconLeft"
            class="k-c-button__icon"
            data-qa="icon left"
        >
            <slot name="iconLeft"/>
        </span>
        <slot/>
        <span
            v-if="$slots.iconRight"
            class="k-c-button__icon"
            data-qa="icon right"
        >
            <slot name="iconRight"/>
        </span>
    </Component>
</template>
<style lang="scss">
@import '@karriereat/global-styles/scss/components/loading-dots';
</style>
