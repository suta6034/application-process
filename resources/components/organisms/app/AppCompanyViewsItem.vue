<script setup>
import AppCompanyMediaBox from '../../molecules/app/AppCompanyMediaBox';
import IllustrationCompanyEmptyState from '../../illustrations/IllustrationCompanyEmptyStateProfileView';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadLine from '../../atoms/text/TextHeadline';

defineProps({
    company: {
        default: null,
        type: Object,
    },
    isLoading: {
        default: false,
        type: Boolean,
    },
    to: {
        type: Object,
    },
    hasNoBorder: {
        default: false,
        type: Boolean,
    },
});
</script>

<template>
    <div
        :is="to ? 'router-link' : 'div'"
        :to="to"
        :class="[
            { 'is-disabled': !company },
            { 'is-inactive': company && !company.isActive}
        ]"
        class="c-appCompanyViewsItems u-partial-hover-parent"
        data-qa="company page link"
    >
        <div
            class="k-c-card"
            :class="{ 'k-c-card--noBorder': hasNoBorder }"
        >
            <SkeletonBox
                v-if="isLoading"
                aspect-ratio="24/14"
                data-qa="skeleton box media"
            />
            <template v-else>
                <AppCompanyMediaBox
                    v-if="company"
                    :is-active="company && company.isActive"
                    :company-name="company.name"
                    :img="company.image"
                    :video="company.previewVideo"
                    :branding-type="company.typeId"
                    :logo="company.logo ? company.logo : null"
                />
                <div
                    v-else
                    class="c-appCompanyViewsItems__empty"
                >
                    <IllustrationCompanyEmptyState data-qa="empty state illustration"/>
                </div>
            </template>
            <div class="c-appCompanyViewsItems__body k-c-excerpt k-c-card__body">
                <template v-if="isLoading">
                    <SkeletonBox
                        v-for="i in 3"
                        :key="i"
                        :min-width="50"
                        data-qa="skeleton box body"
                    />
                </template>
                <template v-else>
                    <template v-if="!company || (company && company.isActive)">
                        <TextHeadLine
                            :level="3"
                            size="l"
                            bold
                            :class="{
                                'is-disabled': !company,
                                'u-partial-hover-child': company
                            }"
                            class="c-appCompanyViewsItems__headline k-c-excerpt__headline u-ellipsis"
                            data-qa="headline"
                        >
                            <template v-if="company">
                                {{ company.name }}
                            </template>
                            <template
                                v-else
                            >
                                Dein Wunscharbeitgeber
                            </template>
                        </TextHeadLine>
                        <div
                            :class="{ 'is-disabled': !company }"
                            class="c-appCompanyViewsItems__metaStart k-c-excerpt__metaStart u-ellipsis"
                            data-qa="locations"
                        >
                            <template v-if="company">
                                {{ company.locations ? company.locations : null }}
                            </template>
                            <div
                                v-else
                                class="k-o-chain k-o-chain--noWrap"
                                data-qa="empty state text"
                            >
                                <span class="k-o-chain__link">
                                    Ort
                                </span>
                            </div>
                        </div>
                        <div
                            class="k-c-excerpt__snippet u-ellipsis"
                            data-qa="branch"
                        >
                            <template v-if="company">
                                {{ company.branches ? company.branches : null }}
                            </template>
                            <div
                                v-else
                                class="k-o-chain k-o-chain--noWrap"
                                data-qa="empty state text"
                            >
                                <span class="k-o-chain__link">
                                    Branche
                                </span>
                            </div>
                        </div>
                    </template>
                    <div
                        v-else
                        :class="{ 'is-disabled': company && !company.isActive }"
                        class="c-appCompanyViewsItems__inactiveText"
                        data-qa="inactive state text"
                    >
                        <span>
                            Dieser Arbeitgeber hat kein Profil mehr auf karriere.at.
                            Wir können dir daher keine Details anzeigen.
                        </span>
                    </div>
                </template>
            </div>
            <div class="k-c-card__footer k-o-distributeSpace">
                <SkeletonBox
                    v-if="isLoading"
                    class="c-appCompanyViewsItems__footerSkeleton"
                    :width="'25%'"
                    data-qa="skeleton box footer"
                />
                <template v-else>
                    <slot name="footer"/>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/surface-boost';

// 1. This prevents body from getting smaller when inactive companies data applies.
.c-appCompanyViewsItems {
    $icon-min-height: 8em;

    &.is-inactive {
        cursor: not-allowed;
    }

    &.is-disabled {
        color: $k-color-gray--300;
    }

    &__headline {
        &.is-disabled {
            color: $k-color-gray--400;
            font-weight: normal;
        }
    }

    &__metaStart {
        &.is-disabled {
            color: $k-color-gray--300;
        }
    }

    &__footerSkeleton {
        margin-left: auto;
    }

    &__empty {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: $icon-min-height;
        height: 1px;
        background-color: $k-color-gray--100;
    }

    &__inactiveText {
        &.is-disabled {
            height: $k-spacing--4xl + $k-spacing--s; // 1.
            color: $k-color-gray--400;
        }
    }
}
</style>
