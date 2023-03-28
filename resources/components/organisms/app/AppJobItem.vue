<script setup>
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    loading: {
        default: false,
        type: Boolean,
    },
    to: {
        type: Object,
    },
    noMedia: {
        default: false,
        type: Boolean,
    },
    hoverPartial: {
        default: true,
        type: Boolean,
    },
});
</script>

<template>
    <div
        :is="to ? 'router-link' : 'div'"
        :to="to"
        class="c-appJobItem k-o-media"
        :class="{
            'u-partial-hover-parent': hoverPartial,
        }"
    >
        <div
            :class="{ 'c-appJobItem__hideImage': noMedia}"
            class="k-o-media__figure"
        >
            <SkeletonBox
                v-if="loading"
                class="c-appJobItem__companyLogoSkeleton"
                data-qa="skeleton box"
            />
            <div
                v-else
                class="k-c-imageBox"
            >
                <div class="c-appJobItem__companyLogo">
                    <slot name="figure"/>
                </div>
            </div>
        </div>
        <div
            class="k-o-media__body"
        >
            <div class="k-c-excerpt">
                <TextHeadline
                    :level="3"
                    size="l"
                    class="k-c-excerpt__headline u-word-break"
                    :class="{
                        'u-partial-hover-child': hoverPartial,
                    }"
                    bold
                    data-qa="headline"
                >
                    <SkeletonBox
                        v-if="loading"
                        :min-width="50"
                        :max-width="70"
                        data-qa="skeleton box"
                    />
                    <slot
                        v-else
                        name="headline"
                    />
                </TextHeadline>
                <div
                    class="k-c-excerpt__snippet"
                    data-qa="snippet"
                >
                    <SkeletonBox
                        v-if="loading"
                        data-qa="skeleton box"
                    />
                    <slot v-else/>
                </div>
                <div class="k-c-excerpt__metaEnd">
                    <SkeletonBox
                        v-if="loading"
                        data-qa="skeleton box"
                    />
                    <slot
                        v-else
                        name="meta-end"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

// 1. Trump skeleton inline styles.
// 2. Make the skeleton the same size as the regular logo.
.c-appJobItem {
    $logo-height: 3.5em;

    &__hideImage {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__companyLogo,
    &__companyLogoSkeleton {
        max-width: 14vw;
        max-height: 14vw;
        width: $logo-height !important; // 1
        height: $logo-height !important; // 1
    }

    &__companyLogo {
        display: flex;
        justify-content: center;
        align-items: center;
        color: $k-color-gray--300;
    }

    &__companyLogoSkeleton {
        box-sizing: content-box; // 2
        padding: $k-spacing--xs; // 2
    }
}
</style>
