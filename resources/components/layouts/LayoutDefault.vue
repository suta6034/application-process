<script setup>
import {
    isEmbedded,
} from '../../utils/frame-check';

import AppDivider from '../atoms/app/AppDivider';
import AppFooter from '../organisms/app/AppFooter';
import AppHeader from '../organisms/app/AppHeader';
import NavSub from '../molecules/nav/NavSub';
import ProgressLoadingBar from '../atoms/progress/ProgressLoadingBar';

defineProps({
    hasBackgroundGray: {
        type: Boolean,
        default: false,
    },
    isContentFullHeight: {
        type: Boolean,
        default: false,
    },
    hasFooterSpacing: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <div
        :class="{
            'is-embedded': isEmbedded(),
            'c-layoutDefault--hasBackgroundGray': hasBackgroundGray,
        }"
        class="c-layoutDefault"
    >
        <header class="c-layoutDefault__header">
            <AppHeader data-qa="main header"/>
        </header>
        <main
            class="c-layoutDefault__main"
            :class="isContentFullHeight && 'c-layoutDefault__main--contentFullHeight'"
        >
            <template v-if="!isEmbedded()">
                <NavSub @click-link="$emit('click-link')"/>
                <ProgressLoadingBar/>
            </template>
            <slot :is-embedded="isEmbedded()"/>
        </main>
        <footer class="c-layoutDefault__footer">
            <div
                v-if="hasBackgroundGray && hasFooterSpacing"
                class="c-layoutDefault__hrWrap"
            >
                <AppDivider/>
            </div>
            <AppFooter data-qa="main footer"/>
        </footer>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';

.c-layoutDefault {
    $root: &;
    $embed-close-trigger-height: 3.5rem;

    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &--hasBackgroundGray {
        background: $k-color-gray--50;
    }

    &.is-embedded {
        padding-top: $embed-close-trigger-height;
    }

    &__header,
    &__footer {
        #{$root}.is-embedded & {
            display: none;
        }
    }

    &__main {
        flex-grow: 1;

        &--contentFullHeight {
            display: flex;
            flex-direction: column;
        }
    }

    &__hrWrap {
        @include wrap(math.div(12, 12));

        margin-top: $k-spacing--5xl;
    }
}
</style>
