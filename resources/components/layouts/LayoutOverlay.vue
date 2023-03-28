<script setup>
import {
    computed,
} from 'vue';
import AppBrandline from '../atoms/app/AppBrandline';
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useMutations, useState,
} from '../../composables/vuex-helpers';

const props = defineProps({
    fromLeft: {
        type: Boolean,
        default: false,
    },
    verticallyCentered: {
        type: Boolean,
    },
    horizontallyCentered: {
        type: Boolean,
    },
    horizontallyCenteredContent: {
        type: Boolean,
    },
});

const {
    active,
    title,
} = useState('popup');

const animationEnter = computed(() => (props.fromLeft ? 'slideInLeft' : 'zoomIn'));
const animationLeave = computed(() => (props.fromLeft ? 'slideOutLeft' : 'zoomOut'));

const {
    HIDE_POPUP: hide,
} = useMutations('popup');
</script>

<template>
    <div
        :class="{
            'c-layoutOverlay--fromLeft': fromLeft,
        }"
        class="c-layoutOverlay"
        data-qa="overlay"
    >
        <Transition
            enter-active-class="c-layoutOverlay__background--fadeIn is-animated"
            leave-active-class="c-layoutOverlay__background--fadeOut is-animated"
            appear
        >
            <div
                v-if="active"
                class="c-layoutOverlay__background"
            />
        </Transition>
        <Transition
            :enter-active-class="`c-layoutOverlay__content--${animationEnter} is-animated`"
            :leave-active-class="`c-layoutOverlay__content--${animationLeave} is-animated`"
            appear
        >
            <div
                v-if="active"
                class="c-layoutOverlay__content"
            >
                <div class="c-layoutOverlay__header">
                    <AppBrandline/>
                    <TextHeadline
                        v-if="title"
                        :level="2"
                        size="l"
                        data-qa="headline"
                    >
                        {{ title }}
                    </TextHeadline>
                    <AppButtonIconOnly
                        icon="cross"
                        size="l"
                        aria-label="Schließen"
                        class="c-layoutOverlay__close"
                        data-qa="close button"
                        @click="hide"
                    />
                </div>
                <div
                    :class="{
                        'c-layoutOverlay__body--verticallyCentered': verticallyCentered,
                        'c-layoutOverlay__body--horizontallyCentered': horizontallyCentered,
                        'c-layoutOverlay__body--horizontallyCenteredContent': horizontallyCenteredContent
                    }"
                    class="c-layoutOverlay__body"
                >
                    <slot/>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/branding';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/z-index';
@import '../../assets/scss/tools/wrap';

.c-layoutOverlay {
    $root: &;

    &__background,
    &__header,
    &__content {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $z-index-top-line;
    }

    // 1. Force enable hardware acceleration.
    &__background,
    &__content {
        transform: translateZ(0); // 1
        backface-visibility: hidden; // 1
        perspective: 1000px; // 1
    }

    &__background {
        background-color: $k-color-white;
        will-change: opacity;

        #{$root}--fromLeft & {
            background-color: rgba($k-color-gray--800, 0.55);
        }

        &.is-animated {
            animation-name: fade;
            animation-fill-mode: both;
        }

        &--fadeIn {
            animation-duration: 0.3s;
            animation-timing-function: ease-out;
        }

        &--fadeOut {
            animation-duration: 0.6s;
            animation-timing-function: ease-in-out;
            animation-direction: reverse;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        will-change: opacity, transform;

        #{$root}--fromLeft & {
            right: $k-spacing--3xl;
            background-color: $k-color-white;
        }

        &.is-animated {
            animation-fill-mode: both;
        }

        &--zoomIn {
            animation-name: zoom;
            animation-duration: 0.6s;
            animation-timing-function: ease-out;
        }

        &--zoomOut {
            animation-name: zoom;
            animation-duration: 0.3s;
            animation-timing-function: ease-in-out;
            animation-direction: reverse;
        }

        &--slideInLeft {
            animation-name: slide-left;
            animation-duration: 0.2s;
            animation-timing-function: ease-out;
        }

        &--slideOutLeft {
            animation-name: slide-left;
            animation-duration: 0.2s;
            animation-timing-function: ease-in-out;
            animation-direction: reverse;
        }
    }

    &__header {
        position: relative;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        height: $branding-header-height;
        border-bottom: 1px solid $k-color-gray--100;
        background: $k-color-white;

        #{$root}--fromLeft & {
            border-bottom: none;
        }
    }

    &__headline {
        padding-right: $k-spacing--2xl;
        padding-left: $k-spacing--2xl;
        text-align: center;
    }

    &__close {
        position: absolute;
        top: 0;
        right: $k-spacing--m;
        bottom: 0;
    }

    // 1. This is for IE 11 only, because it can't deal with auto margins on flex items.
    // 2. Make sure long texts are wrapped correctly. Be careful when using long texts in
    //    combination with vertical centering
    &__body {
        @include wrap(math.div(5, 12));

        overflow-y: auto;
        margin-right: 0;
        margin-left: 0;
        padding-top: $k-spacing--3xl;
        padding-bottom: $k-spacing--2xl;
        width: 100%; // 2
        height: 100%;
        -webkit-overflow-scrolling: touch;

        #{$root}--fromLeft & {
            @include wrap(1,5px,true,1248px);

            padding-top: 0;
        }

        &--verticallyCentered {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: auto; // 2
        }

        &--horizontallyCentered {
            align-self: center; // 1
            margin-right: auto;
            margin-left: auto;
        }

        &--horizontallyCenteredContent {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    @keyframes fade {
        from {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    @keyframes zoom {
        from {
            opacity: 0;
            transform: scale3d(0.9, 0.9, 0.9);
        }

        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes slide-left {
        from {
            transform: translate3d(-100%, 0, 0);
        }

        to {
            transform: translate3d(0, 0, 0);
        }
    }
}
</style>
