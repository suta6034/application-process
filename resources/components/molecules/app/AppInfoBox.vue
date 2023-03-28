<script setup>
import AppShowMore from './AppShowMore';

defineProps({
    error: {
        type: Boolean,
        default: false,
    },
    warning: {
        type: Boolean,
        default: false,
    },
    hint: {
        type: Boolean,
        default: false,
    },
    full: {
        type: Boolean,
        default: false,
    },
    oneliner: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="c-appInfoBox k-c-infoBox"
        :class="{
            'k-c-infoBox--icon': $slots.icon && !oneliner,
            'k-c-infoBox--error': error,
            'k-c-infoBox--warning': warning,
            'k-c-infoBox--hint': hint,
            'k-c-infoBox--full': full,
        }"
    >
        <div
            v-if="$slots.icon"
            class="c-appInfoBox__icon k-c-infoBox__prefix"
        >
            <slot name="icon"/>
        </div>
        <div class="k-c-infoBox__content">
            <AppShowMore
                transition
            >
                <slot/>
                <template #more>
                    <div
                        v-if="$slots.more"
                        class="c-appInfoBox__more"
                    >
                        <slot name="more"/>
                    </div>
                </template>
            </AppShowMore>
        </div>
        <div
            v-if="$slots.suffix"
            class="k-c-infoBox__suffix"
        >
            <slot name="suffix"/>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/animations/fade-in';

// 1. Prevents content overflow on iOS12.
.c-appInfoBox {
    flex-shrink: 0; // 1

    &__icon {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
        }
    }

    &__more {
        margin-top: $k-spacing--s;
    }
}
</style>
