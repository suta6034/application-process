<script setup>
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useMutations, useState,
} from '../../composables/vuex-helpers';

defineProps({
    ignorable: {
        default: true,
        type: Boolean,
    },
    actionsLayout: {
        default: null,
        type: String,
    },
    bodyLayout: {
        default: null,
        type: String,
    },
    contentLayout: {
        default: null,
        type: String,
    },
    contentWidth: {
        default: null,
        type: String,
    },
});

const {
    active,
    showCloseButton,
} = useState('popup');

const {
    HIDE_POPUP: hide,
} = useMutations('popup');
</script>

<template>
    <div
        class="c-layoutModal"
        data-qa="modal"
    >
        <Transition
            enter-active-class="a-fade-in"
            leave-active-class="a-fade-out"
            appear
        >
            <div
                v-if="active"
                class="c-layoutModal__background"
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
                class="c-layoutModal__content"
                data-qa="content"
                @click.self="ignorable && showCloseButton ? ($emit('hide') && hide()) : null"
            >
                <div
                    class="c-layoutModal__contentInner"
                    :style="[contentWidth ? { width: contentWidth } : {}]"
                    :class="{
                        [`c-layoutModal__contentInner--${contentLayout}`]: contentLayout
                    }"
                >
                    <AppButtonIconOnly
                        v-if="showCloseButton"
                        data-qa="close button"
                        icon="cross"
                        aria-label="Schließen"
                        size="l"
                        class="c-layoutModal__close"
                        @click="hide();$emit('hide')"
                    />
                    <TextHeadline
                        v-if="$slots.headline"
                        :level="2"
                        size="xl"
                        data-qa="headline"
                    >
                        <slot name="headline"/>
                    </TextHeadline>
                    <div
                        v-if="$slots.subheadline"
                        class="c-layoutModal__subheadline"
                        data-qa="subheadline"
                    >
                        <slot name="subheadline"/>
                    </div>
                    <div
                        v-if="$slots.default"
                        class="c-layoutModal__body"
                        :class="{
                            [`c-layoutModal__body--${bodyLayout}`]: bodyLayout
                        }"
                    >
                        <slot/>
                        <div
                            v-if="$slots.actions && !$slots.breakout"
                            data-qa="actions"
                            :class="{ [`c-layoutModal__actions--${actionsLayout}`]: actionsLayout }"
                            class="c-layoutModal__actions"
                        >
                            <slot name="actions"/>
                        </div>
                    </div>
                    <div
                        v-if="$slots.actions && !$slots.default && !$slots.breakout"
                        data-qa="actions"
                        :class="{ [`c-layoutModal__actions--${actionsLayout}`]: actionsLayout }"
                        class="c-layoutModal__actions"
                    >
                        <slot name="actions"/>
                    </div>
                    <div
                        v-if="$slots.breakout"
                        data-qa="breakout"
                        class="c-layoutModal__breakout"
                    >
                        <slot name="breakout"/>
                        <div
                            v-if="$slots.actions"
                            data-qa="actions"
                            :class="{ [`c-layoutModal__actions--${actionsLayout}`]: actionsLayout }"
                            class="c-layoutModal__actions"
                        >
                            <slot name="actions"/>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../assets/scss/settings/border-radius';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/settings/z-index';
@import '../../assets/scss/animations/fade-in-up';
@import '../../assets/scss/animations/fade-in';
@import '../../assets/scss/animations/fade-out-down';
@import '../../assets/scss/animations/fade-out';

.c-layoutModal {
    $outer-padding-vertical: $k-spacing--3xl;
    $outer-padding-horizontal: $k-spacing--xl;

    text-align: center;

    &__subheadline {
        margin-top: $k-spacing--s;
        color: $k-color-gray--700;
    }

    &__background {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $z-index-modal;
        background-color: rgba($k-color-gray--800, 0.55);
    }

    &__content {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $z-index-modal + 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    &__contentInner {
        position: relative;
        overflow: auto;
        margin: $k-spacing--3xl $k-spacing--l;
        padding: $outer-padding-vertical $outer-padding-horizontal;
        max-width: 94%;
        width: 38rem;
        border-radius: $k-border-radius--s;
        text-align: center;
        background-color: $k-color-white;

        &--noPadding {
            padding: 0;
        }
    }

    &__breakout {
        margin-top: $k-spacing--2xl;
        margin-right: -$outer-padding-horizontal;
        margin-bottom: -$outer-padding-vertical;
        margin-left: -$outer-padding-horizontal;
        padding-top: $k-spacing--2xl;
        padding-right: $outer-padding-horizontal;
        padding-bottom: $outer-padding-vertical;
        padding-left: $outer-padding-horizontal;
        background-color: $k-color-gray--50;
        color: $k-color-gray--700;
    }

    &__close {
        position: absolute;
        top: $k-spacing--l;
        right: $k-spacing--l;
        display: flex;
    }

    &__body {
        margin-top: $k-spacing--m;
        color: $k-color-gray--700;

        @media (min-width: $k-breakpoint--m) {
            margin-right: auto;
            margin-left: auto;
            width: 85%;
        }

        &--fullWidth {
            width: 100%;
        }

        &--noMargin {
            margin: 0;
        }
    }

    &__actions {
        display: inline-flex;
        flex-direction: column;
        margin-top: $k-spacing--xl;

        > :not(:first-child) {
            margin-top: $k-spacing--s;
        }

        &--horizontal {
            @media (min-width: $k-breakpoint--m) {
                flex-direction: row;

                > :not(:first-child) {
                    margin-top: 0;
                    margin-left: $k-spacing--s;
                }
            }
        }
    }
}
</style>
