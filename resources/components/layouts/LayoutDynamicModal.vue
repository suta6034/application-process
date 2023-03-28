<script setup>
import {
    CATEGORIES,
    track,
} from '../../utils/tracking';

import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import {
    useMutations, useState,
} from '../../composables/vuex-helpers';

defineProps({
    ignorable: {
        default: false,
        type: Boolean,
    },
    closeTrackingStatus: {
        type: String,
    },
    mobileOverlay: {
        default: false,
        type: Boolean,
    },
});

const {
    active,
    showCloseButton,
} = useState('popup');

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const trackClickAndClose = (eventAction) => {
    track({
        category: CATEGORIES.page.dashboard,
        action: eventAction,
    });
    hide();
};
</script>

<template>
    <div
        class="c-layoutDynamicModal"
        data-qa="dynamic modal"
    >
        <Transition
            enter-active-class="a-fade-in"
            leave-active-class="a-fade-out"
            appear
        >
            <div
                v-if="active"
                class="c-layoutDynamicModal__background"
                data-qa="background"
            />
        </Transition>
        <Transition
            enter-active-class="a-fade-in-up"
            leave-active-class="a-fade-out-down"
            appear
        >
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
                v-if="active"
                class="c-layoutDynamicModal__body"
                data-qa="content"
                @click.self="ignorable ? hide() : ''"
            >
                <div
                    :class="{
                        'c-layoutDynamicModal__mobileFullWidth': mobileOverlay,
                        'c-layoutDynamicModal__inner': !mobileOverlay
                    }"
                >
                    <slot/>
                    <Transition
                        enter-active-class="c-layoutDynamicModal__expand"
                    >
                        <slot name="expandContent"/>
                    </Transition>
                    <AppButtonIconOnly
                        v-if="showCloseButton"
                        data-qa="close button"
                        icon="cross"
                        aria-label="Schließen"
                        class="c-layoutDynamicModal__close"
                        size="m"
                        @click.native="trackClickAndClose(closeTrackingStatus)"
                    />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
@import '../../assets/scss/settings/border-radius';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/settings/z-index';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../assets/scss/animations/fade-in-up';
@import '../../assets/scss/animations/fade-in';
@import '../../assets/scss/animations/fade-out-down';
@import '../../assets/scss/animations/fade-out';
@import '../../assets/scss/tools/wrap';

// 1. To create a smooth expand transition the height and width are static
//    NICE TO HAVE: If we need a DynamicModal more often, we should create a transition via JS and dynamic properties
.c-layoutDynamicModal {
    &__background,
    &__body {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    &__background {
        z-index: $z-index-modal;
        background-color: rgba($k-color-gray--800, 0.55);
    }

    &__body {
        z-index: $z-index-modal + 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    &__inner,
    &__mobileFullWidth {
        position: relative;
        overflow: scroll;
        background-color: $k-color-white;

        @media (min-width: $k-breakpoint--m) {
            margin-bottom: $k-spacing--5xl;
        }
    }

    &__inner {
        margin: $k-spacing--l;
        width: 93%;
        border-radius: $k-border-radius--s;

        @media (min-width: $k-breakpoint--m) {
            overflow: hidden;
            width: inherit;
        }
    }

    &__mobileFullWidth {
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            overflow-x: hidden;
            margin-top: $k-spacing--l;
            width: inherit;
        }
    }

    &__close {
        position: absolute;
        top: $k-spacing--m;
        right: $k-spacing--m;
    }

    &__expand {
        animation-name: a-fade-in;

        @media (min-width: $k-breakpoint--m) {
            animation-name: expand; // 1.
            animation-duration: 0.2s;
            animation-fill-mode: both;
            animation-timing-function: ease-out;
        }
    }

    @keyframes expand {
        from {
            width: 30em;
            height: 17em;
            opacity: 0;
            transform: scale(0);
        }

        to {
            width: 45em;
            height: 35em;
            opacity: 1;
            transform: scale(1);
        }
    }
}
</style>
