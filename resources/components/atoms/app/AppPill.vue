<script setup>
defineProps({
    status: {
        type: String,
    },
    tag: {
        type: String,
        default: 'span',
    },
    outline: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
    },
    labelDefinition: {
        type: String,
    },
    color: {
        type: String,
    },
});
</script>

<template>
    <div
        :is="tag"
        class="c-appPill k-c-pill"
        :class="{
            'k-c-pill--outline': outline,
            [`k-c-pill--${status}`]: status,
        }"
        data-qa="pill"
    >
        <span
            v-if="$slots.icon"
            class="k-c-pill__icon c-appPill__colorDot"
            :style="`background-color: ${color}`"
            data-qa="app pill color dot"
        >
            <slot name="icon"/>
        </span>
        <span
            v-if="$slots.illustration"
            class="c-appPill__illustration"
            data-qa="app pill illustration"
        >
            <slot name="illustration"/>
        </span>
        <span
            class="k-c-pill__text"
            :class="{
                'u-bold': labelDefinition,
            }"
            data-qa="label"
        >
            <template v-if="label">
                {{ label }}
            </template>
            <slot v-else/>
        </span>
        <span
            v-if="labelDefinition"
            data-qa="label definition"
        >
            {{ labelDefinition }}
        </span>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-appPill {
    &__colorDot {
        display: inline-block;
        margin-top: -$k-spacing--2xs;
        margin-right: $k-spacing--xs;
        width: $k-spacing--l;
        height: $k-spacing--l;
        border-radius: 100%;
    }
}
</style>
