<script setup>
import AppIcon from './AppIcon';

defineProps({
    icon: {
        required: true,
        type: String,
    },
    size: {
        type: String,
        default: 's',
    },
    tag: {
        default: 'button',
        type: String,
    },
    to: {
        type: Object,
    },
    ariaLabel: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <Component
        :is="to ? 'router-link' : tag"
        :to="to"
        :aria-label="ariaLabel"
        class="c-appButtonIconOnly"
        v-on="$listeners"
    >
        <slot>
            <AppIcon
                :name="icon"
                :size="size"
                fixed-width
            />
        </slot>
    </Component>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/tools/surface-boost';

.c-appButtonIconOnly {
    @include surface-boost;

    border: none;
    background: transparent;
    cursor: pointer;

    &,
    &:visited {
        color: $k-color-gray--500;
    }

    &:hover,
    &:focus {
        color: $k-c-link-color-hover;
    }
}
</style>
