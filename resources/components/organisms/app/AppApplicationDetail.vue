<script setup>
import {
    computed,
} from 'vue';

import {
    emitUserAction,
} from '../../../services/user-actions';

import {
    formatDate,
} from '../../../utils/filter';

import '../../../lang/application';

import AppApplicationCompany from './AppApplicationCompany';
import AppApplicationActions from './AppApplicationActions';
import AppApplicationJobAd from './AppApplicationJobAd';
import AppApplicationMemo from './AppApplicationMemo';
import AppApplicationNavHorizontalOverflowContent from './AppApplicationNavHorizontalOverflowContent';
import AppBadge from '../../atoms/app/AppBadge';
import NavHorizontalOverflow from '../../molecules/nav/NavHorizontalOverflow';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

const props = defineProps({
    application: {
        type: Object,
        default: null,
    },
    hasCallbackBeforeDestroy: {
        type: Boolean,
        default: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    isError: {
        type: Boolean,
        default: false,
    },
    activeSubNav: {
        type: String,
        default: 'application',
    },
});
const emit = defineEmits(['memo', 'remove', 'click-link-sub-nav']);

const hasNoCompany = computed(() => props.application.company?.isChiffre
    || !props.application.company?.isActive
    || (props.application.isManual && !props.application.company?.id));

const formattedJobLocation = computed(() => props.application.jobLocation.replace(',', ', '));
const formattedEmploymentType = computed(() => props.application.employmentType.replace(',', ', '));
</script>

<template>
    <div class="c-appApplicationDetail">
        <template v-if="!isError">
            <SkeletonBox v-if="isLoading"/>
            <div
                v-else-if="application"
                class="c-appApplicationDetail__topHeadline"
            >
                <TextHeadline
                    :level="2"
                    size="xl"
                    class="c-appApplicationDetail__topHeadlineText"
                >
                    {{ application.jobTitle }}
                </TextHeadline>
                <AppApplicationActions
                    v-if="!application.isRejected"
                    :application="application"
                    :has-callback-before-destroy="hasCallbackBeforeDestroy"
                    class="c-appApplicationDetail__topActions"
                    ga-prefix="AP_D"
                    @edit="emitUserAction('application-edit-application-detail')"
                    @memo="emit('memo'); emitUserAction(`application-${$event}-note-detail`)"
                    @open-modal-remove="emitUserAction('application-delete-detail')"
                    @open-popover="emitUserAction('application-open-popover-detail')"
                    @remove="emit('remove')"
                    @status="emitUserAction('application-status-detail')"
                />
            </div>
            <SkeletonBox
                v-if="isLoading"
                class="c-appApplicationDetail__topSubheadlineSkeleton"
            />
            <div
                v-else-if="application"
                class="c-appApplicationDetail__topSubheadline"
            >
                <ul class="c-appApplicationDetail__topSubheadlineList k-o-chain">
                    <li class="c-appApplicationDetail__topSubheadlineItem k-o-chain__link">
                        {{ application.companyName }}
                    </li>
                    <li
                        v-if="application.jobLocation"
                        class="c-appApplicationDetail__topSubheadlineItem k-o-chain__link"
                    >
                        {{ formattedJobLocation }}
                    </li>
                    <li
                        v-if="application.employmentType"
                        class="c-appApplicationDetail__topSubheadlineItem k-o-chain__link"
                    >
                        {{ formattedEmploymentType }}
                    </li>
                    <li
                        v-if="application.job?.level"
                        class="c-appApplicationDetail__topSubheadlineItem k-o-chain__link"
                    >
                        {{ application.job.level }}
                    </li>
                    <li
                        v-if="application.job?.showDate"
                        class="c-appApplicationDetail__topSubheadlineItem k-o-chain__link"
                    >
                        {{ formatDate({
                            date: application.job.showDate, format: 'd.m.Y'
                        }) }}
                    </li>
                    <li
                        v-if="application.status"
                    >
                        <AppBadge
                            small
                            class="c-appApplicationDetail__topSubheadlineItemStatus"
                            :dark="application.isRejected"
                        >
                            <template v-if="application.isRejected">
                                {{ $t(`application.status.rejected`) }}
                            </template>
                            <template v-else>
                                {{ $t(`application.status.${application.status.toLowerCase()}`) }}
                            </template>
                        </AppBadge>
                    </li>
                </ul>
            </div>
        </template>
        <template v-if="!isError || application">
            <NavHorizontalOverflow
                v-if="isLoading || application"
                :is-loading="isLoading"
                :items="[
                    { name: 'Bewerbung', id: 'application', tag: 'button', trackingName: 'Application' },
                    { name: 'Stelleninserat', id: 'job', tag: 'button', trackingName: 'Job' },
                    { name: 'Arbeitgeber', id: 'company', tag: 'button', trackingName: 'Company' },
                    { name: 'Notizen', id: 'memo', tag: 'button', trackingName: 'Memo' },
                ]"
                :active-item="activeSubNav"
                class="c-appApplicationDetail__nav"
                @click-link="emit('click-link-sub-nav', $event); emitUserAction(`application-tab-${$event}`)"
            />
            <div class="c-appApplicationDetail__main">
                <template v-if="activeSubNav === 'application'">
                    <AppApplicationNavHorizontalOverflowContent
                        :application="application"
                        :is-loading="isLoading"
                    />
                </template>
                <section
                    v-if="activeSubNav === 'job'"
                    class="c-appApplicationDetail__mainSection"
                    :class="application.isManual && 'c-appApplicationDetail__mainSection--empty'"
                >
                    <AppApplicationJobAd :application="application"/>
                </section>
                <section
                    v-if="activeSubNav === 'company'"
                    class="c-appApplicationDetail__mainSection"
                    :class="hasNoCompany && 'c-appApplicationDetail__mainSection--empty'"
                >
                    <AppApplicationCompany
                        :application="application"
                        :has-no-company="hasNoCompany"
                    />
                </section>
                <section
                    v-if="activeSubNav === 'memo'"
                    class="c-appApplicationDetail__mainSection"
                >
                    <AppApplicationMemo :application="application"/>
                </section>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/typo';

// 1. Change font-size according to the design drafts for mobile screens.
// 2. Reset the font-size to their original value on desktop (result of the inconsistent
//    mobile-first approach).
// 3. We need to compensate the spacing of main, so it is subtracted from the desired spacing for mainSidebar.
.c-appApplicationDetail {
    $empty-company-illustration-width: 100px;

    display: flex;
    flex-direction: column;

    &__topSubheadlineItemStatus {
        display: none;
        margin-left: $k-spacing--s;

        @media (min-width: $k-breakpoint--m) {
            display: inline-block;
        }
    }

    &__topActions {
        display: none;
        margin-left: $k-spacing--xl;

        @media (min-width: $k-breakpoint--m) {
            display: inline-block;
        }
    }

    &__topHeadline {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__topHeadlineText {
        font-weight: bold;
        @include k-typo-l;    // 1.

        @media (min-width: $k-breakpoint--m) {
            font-weight: normal;
            @include k-typo-xl;   // 2.
        }
    }

    &__topSubheadlineSkeleton {
        margin-top: $k-spacing--s;
    }

    &__topSubheadline {
        display: flex;
        align-items: center;
        margin-top: $k-spacing--2xs;
    }

    &__topSubheadlineList {
        display: inline-flex;
    }

    &__topSubheadlineItem {
        color: $k-color-gray--500;

        &:not(:first-child) {
            display: none;

            @media (min-width: $k-breakpoint--m) {
                display: flex;
            }
        }

        &:first-child::before {
            display: none;
            margin-left: 0;
        }

        &:last-child {
            margin-right: $k-spacing--s;
        }
    }

    &__nav {
        margin-top: $k-spacing--m;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--xl;
        }
    }

    &__main {
        display: flex;
        flex-grow: 1;
        flex-direction: column-reverse;
        margin-top: $k-spacing--xl;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            margin-top: $k-spacing--3xl;
        }
    }

    &__mainSection {
        display: flex;

        @media (min-width: $k-breakpoint--m) {
            @include wrap(math.div(10, 12), $k-spacing--3xl);

            margin-right: auto;
            margin-left: auto;
            width: 100%;
        }

        &--empty {
            padding-top: $k-spacing--4xl;
            padding-bottom: $k-spacing--4xl;
        }
    }

    &__cupcakeCherry {
        width: $empty-company-illustration-width;
        height: 100%;
    }

    &__cupcakeText {
        margin-top: $k-spacing--m;
    }
}
</style>
