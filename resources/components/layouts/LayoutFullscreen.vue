<script setup>
import {
    nextTick,
    inject,
} from 'vue';
import {
    isEmbedded,
} from '../../utils/frame-check';
import mitt from '../../utils/mitt';

import AppBrandline from '../atoms/app/AppBrandline';
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import AppGrid from '../molecules/app/AppGrid';
import AppGridColumn from '../molecules/app/AppGridColumn';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useMutations,
} from '../../composables/vuex-helpers';

defineProps({
    background: {
        type: String,
        default: '',
    },
});

const router = inject('router');

const {
    SET_MODIFIED: setModified,
} = useMutations('templateSettings');

const emit = defineEmits(['close']);
const discard = async () => {
    await nextTick();
    setModified(false);

    if (router.currentRoute.name !== 'page-cv') await router.push({ name: 'page-cv' });
};

mitt.on('discard-cv-template', discard);
</script>

<template>
    <div
        class="c-layoutFullscreen"
        data-qa="overlay"
    >
        <AppBrandline/>
        <div
            class="c-layoutFullscreen__content"
        >
            <div
                v-if="!isEmbedded()"
                class="c-layoutFullscreen__header k-c-navbar k-c-navbar--minimal"
            >
                <TextHeadline
                    v-if="$slots.headline"
                    :level="2"
                    size="l"
                    data-qa="headline"
                >
                    <slot name="headline"/>
                </TextHeadline>
                <AppButtonIconOnly
                    class="c-layoutFullscreen__close"
                    data-qa="close button"
                    icon="cross"
                    size="l"
                    aria-label="Schließen"
                    @click="emit('close')"
                />
            </div>
            <div
                v-if="$slots['split-left'] && $slots['split-right']"
                class="c-layoutFullscreen__splitWrap"
            >
                <div class="c-layoutFullscreen__split">
                    <AppGrid gap="2xl">
                        <AppGridColumn :width="['12/12', '4/12@m']">
                            <div class="c-layoutFullscreen__splitItem">
                                <slot name="split-left"/>
                            </div>
                        </AppGridColumn>
                        <AppGridColumn :width="['12/12', '8/12@m']">
                            <div class="c-layoutFullscreen__splitItem c-layoutFullscreen__splitItem--right">
                                <slot name="split-right"/>
                            </div>
                        </AppGridColumn>
                    </AppGrid>
                </div>
            </div>
            <div
                v-else
                :class="{
                    'is-embedded': isEmbedded(),
                    [`c-layoutFullscreen__body--${background}`]: background,
                }"
                class="c-layoutFullscreen__body"
            >
                <slot/>
            </div>
            <div
                v-if="$slots.footer"
                class="c-layoutFullscreen__footer k-c-navbar k-c-navbar--minimal"
            >
                <div class="c-layoutFullscreen__footerContent">
                    <slot name="footer"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/branding';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/z-index';
@import '../../assets/scss/tools/wrap';

.c-layoutFullscreen {
    $root: &;
    $height-fixed-header-footer-min: 550px;

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        min-height: 100vh;

        @media (min-height: $height-fixed-header-footer-min) {
            padding-top: $branding-header-height;
            padding-bottom: $branding-header-height;
        }
    }

    &__header,
    &__footer {
        position: relative;
        background-color: $k-color-white;

        @media (min-height: $height-fixed-header-footer-min) {
            position: fixed;
            z-index: $z-index-popup;
            width: 100%;
        }
    }

    &__header {
        top: 0;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid $k-color-gray--100;
    }

    &__headerContent,
    &__footerContent {
        @include wrap(math.div(12, 12));
    }

    &__headerContent {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
    }

    &__close {
        position: absolute;
        top: 0;
        right: $k-spacing--l;
        bottom: 0;

        @media (min-width: $k-breakpoint--m) {
            right: $k-spacing--xl;
        }
    }

    // 1. Make sure long texts are wrapped correctly. Be careful when using long texts in
    //    combination with vertical centering
    &__body {
        position: relative;
        flex-grow: 1;
        padding-top: $k-spacing--xl;
        padding-bottom: $k-spacing--3xl;
        width: 100%; // 1

        &--gray {
            background: $k-color-gray--50;
        }

        &.is-embedded {
            margin-top: $branding-header-height;
        }

        @media (min-width: $k-breakpoint--l) {
            padding-top: $k-spacing--4xl;
        }
    }

    &__splitWrap {
        flex-grow: 1;
        overflow: hidden;
        padding-bottom: $k-spacing--3xl;
    }

    &__split {
        @include wrap(math.div(12, 12), $k-spacing--l);
    }

    &__splitItem {
        padding-top: $k-spacing--2xl;
        padding-bottom: 0;

        @media (min-width: $k-breakpoint--m) {
            padding-top: $k-spacing--3xl;
            padding-bottom: $k-spacing--3xl;
        }

        &--right {
            position: relative;

            @media (min-width: $k-breakpoint--m) {
                padding-left: $k-spacing--4xl;
            }

            &::before {
                position: absolute;
                top: 0;
                right: -999rem;
                bottom: -999rem;
                left: -999rem;
                z-index: -1;
                background: $k-color-gray--50;
                content: '';

                @media (min-width: $k-breakpoint--m) {
                    left: 0;
                }
            }
        }
    }

    &__footer {
        bottom: 0;
        padding-top: $k-spacing--xs;
        padding-bottom: $k-spacing--xs;
        border-top: 1px solid $k-color-gray--100;
    }

    &__footerContent {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
