<script setup>
import {
    computed,
    watch,
} from 'vue';

import {
    formatDate,
} from '../../utils/filter';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
// eslint-disable-next-line import/no-cycle
import {
    STATES,
    useProfileViewList,
    useProfileViewNotificationPatch,
} from '../../composables/resource-profile-views';
import {
    done as progressDone,
    start as progressStart,
} from '../atoms/progress/ProgressLoadingBar';
import {
    CATEGORIES,
} from '../../utils/tracking';
import {
    log,
} from '../../utils/action-logger';
import {
    useStringWithCounter,
} from '../../composables/string-with-counter';

import AppCompanyViewsItem from '../organisms/app/AppCompanyViewsItem';
import AppCupcake from '../atoms/app/AppCupcake';
import AppLink from '../atoms/app/AppLink';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppPagination from '../molecules/app/AppPagination';
import LayoutDefault from '../layouts/LayoutDefault';
import LayoutDefaultDetail from '../layouts/LayoutDefaultDetail';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useTrackClick,
} from '../../composables/track-click';
import {
    useState,
} from '../../composables/vuex-helpers';

const DEFAULT_NUMBER_OF_LIST = 12;

const {
    active: isVisible,
} = useState('profile');

const {
    data: profileViews,
    pagination,
    state,
    turnToPageFirst,
    turnToPageNext,
    turnToPagePrevious,
    refetch,
} = useProfileViewList();
const {
    patch: patchProfileViewNotificationOpened,
} = useProfileViewNotificationPatch();

const profileViewsCount = computed(() => pagination.value?.total);
const { stringWithCounter: headline } = useStringWithCounter({
    singular: 'Aufruf',
    plural: 'Aufrufe',
    counter: profileViewsCount,
});

const hasProfileViews = computed(() => profileViews.value?.length > 0);
const isLoading = computed(() => state.value === STATES.isLoading);
const isSuccess = computed(() => state.value === STATES.isSuccess);
const { isMediumScreen, isLargeScreen } = useBreakpoints();

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.profileView);

watch(state, () => {
    if (state.value === STATES.isSuccess) patchProfileViewNotificationOpened({ data: {}, id: null });
});

watch(state, () => {
    if (state.value === STATES.isValidating) progressStart();
    if (state.value === STATES.isSuccess) progressDone();
});
</script>

<template>
    <LayoutDefault
        has-background-gray
        :has-footer-spacing="isMediumScreen || isLargeScreen"
        class="c-pageProfileViews"
        @click-link="refetch()"
    >
        <LayoutDefaultDetail :transparent="(isMediumScreen || isLargeScreen) && (isLoading || hasProfileViews)">
            <div class="c-pageProfileViews__header">
                <TextHeadline
                    :level="1"
                    size="xl"
                    class="c-pageProfileViews__headline"
                    data-qa="profile views headline"
                >
                    {{ headline }}
                </TextHeadline>
                <div
                    v-if="isLoading || hasProfileViews"
                    class="c-pageProfileViews__headlineText"
                    data-qa="profile views headline text"
                >
                    <template v-if="profileViewsCount === 1">
                        Diese Firma hat deinen Lebenslauf angesehen
                    </template>
                    <template v-else>
                        Diese Firmen haben deinen Lebenslauf angesehen
                    </template>
                </div>
                <AppInfoBox
                    v-if="isSuccess && !isVisible"
                    class="c-pageProfileViews__messageBox"
                    data-qa="Not visibile info"
                    warning
                >
                    Damit Firmen deinen anonymisierten Lebenslauf aufrufen und dir Job-Angebote schicken können,
                    musst du ihn
                    <template v-if="hasProfileViews">
                        wieder
                    </template>
                    <!-- Illegal usage of `k-c-infoBox__link` because of design flaw in Global Styles. -->
                    <router-link
                        v-track-visibility="{ element: 'PR_V: Profile Visibility' }"
                        :to="{ name: 'page-visibility-form' }"
                        class="k-c-infoBox__link"
                        data-gtm-element="PR_V: Profile Visibility"
                        data-gtm-element-detail="Change Profile Visibility"
                        @click.native="trackClick(hasProfileViews ? 'profile-view-change-visibility-info-box'
                            : 'profile-view-empty-change-visibility-info-box')"
                    >
                        <span>sichtbar schalten</span>
                    </router-link>.
                </AppInfoBox>
            </div>
            <div class="c-pageProfileViews__content">
                <AppCupcake
                    v-if="isSuccess && !hasProfileViews"
                    v-track-visibility="{ element: 'PR_V: Page State', elementDetail: 'Empty'}"
                    class="c-pageProfileViews__emptyContent"
                    data-qa="No views info"
                >
                    <template #cherry>
                        <img
                            alt=""
                            class="c-pageProfileViews__emptyIllustration"
                            src="../../assets/img/illustrations/has-no-visit.png"
                        >
                    </template>
                    <div class="c-pageProfileViews__emptyText">
                        <template
                            v-if="isVisible"
                        >
                            Mach den Lebenslauf interessanter für Recruiting-Verantwortliche.
                            <AppLink
                                href="/c/a/lebenslauf-interessant-fuer-recruiter"
                                data-qa="No views link visible"
                                @click.native="trackClick('profile-view-empty-visit-blog')"
                            >
                                Das geht ganz einfach.
                            </AppLink>
                        </template>
                        <template
                            v-else
                        >
                            Möchtest du von Firmen gefunden werden? Jetzt Lebenslauf
                            <AppLink
                                :to="{ name: 'page-visibility-form' }"
                                data-qa="No views link not visible"
                                @click.native="trackClick('profile-view-empty-change-visibility')"
                            >
                                <span>sichtbar schalten</span>
                            </AppLink>.
                        </template>
                    </div>
                </AppCupcake>
                <ul
                    class="c-pageProfileViews__cardsWrap"
                    data-qa="profile views list"
                >
                    <template
                        v-if="isLoading"
                    >
                        <li
                            v-for="i in DEFAULT_NUMBER_OF_LIST"
                            :key="i"
                            class="c-pageProfileViews__companySkeleton"
                        >
                            <AppCompanyViewsItem :is-loading="isLoading"/>
                        </li>
                    </template>
                    <template v-else>
                        <li
                            v-for="(profileView, index) in profileViews"
                            :key="profileView.id"
                            class="c-pageProfileViews__company"
                        >
                            <AppCompanyViewsItem
                                v-track-visibility="index === 0 ?
                                    { element: 'PR_V: Page State', elementDetail: 'Filled'} :
                                    { element: null, elementDetail: null}"
                                data-gtm-element="PR_V: Company Card"
                                data-gtm-element-detail="Company Link"
                                :to="{
                                    path: profileView.company.profileUrl,
                                    query: isMediumScreen ? {} : {'hide-mf-header': true},
                                }"
                                :is-loading="isLoading"
                                :company="profileView.company"
                                :view-date="profileView.viewDate"
                                @click.native="
                                    trackClick('profile-view-company');
                                    log('profile-view-company');
                                "
                            >
                                <template #footer>
                                    <span
                                        :class="{ 'is-disabled': !profileView.company.isActive }"
                                        class="c-pageProfileViews__cardFooter"
                                    >
                                        Aufruf am
                                        {{ formatDate({date: profileView.viewDate, format: 'd.m.Y'}) }}
                                    </span>
                                    <span v-if="profileView.company.isActive">
                                        <AppLink
                                            v-if="profileView"
                                            data-gtm-element="PR_V: Company Card"
                                            data-gtm-element-detail="Jobs Link"
                                            :to="{
                                                path: profileView.company.jobsUrl,
                                                query: isMediumScreen ? {} : {'hide-mf-header': true},
                                            }"
                                            data-qa="jobs link"
                                            @click.native.stop="
                                                trackClick('profile-view-job');
                                                log('profile-view-job');
                                            "
                                        >
                                            <template v-if=" profileView.company.activeJobs === 1">
                                                {{ profileView.company.activeJobs }} Job
                                            </template>
                                            <template v-else>
                                                {{ profileView.company.activeJobs }} Jobs
                                            </template>
                                        </AppLink>
                                    </span>
                                </template>
                            </AppCompanyViewsItem>
                        </li>
                    </template>
                </ul>
                <AppPagination
                    v-if="hasProfileViews && pagination.pages > 1"
                    :current-page="pagination.number"
                    :max-pages="pagination.pages"
                    data-qa="profile views pagination"
                    ga-prefix="PR_V"
                    @first="turnToPageFirst(); trackClick('profile-view-pagination-first')"
                    @previous="turnToPagePrevious(); trackClick('profile-view-pagination-previous')"
                    @next="turnToPageNext(); trackClick('profile-view-pagination-next')"
                />
            </div>
        </LayoutDefaultDetail>
    </LayoutDefault>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/tools/wrap';

.c-pageProfileViews {
    $root: &;
    $icon-min-height: 8em;
    $empty-container-height: 400px;
    $empty-illustration-width: 246px;
    $empty-illustration-height: 147px;

    &__wrap {
        margin-top: $k-spacing--2xl;
        @include wrap(math.div(10, 12));

        &--empty {
            margin-top: $k-spacing--m;
            padding-top: $k-spacing--xl;
            padding-bottom: 11em;
            background: $k-color-white;

            @media (min-width: $k-breakpoint--m) {
                padding-bottom: 16em;
            }
        }
    }

    &__headlineText {
        margin-top: $k-spacing--s;
    }

    &__messageBox {
        margin-top: $k-spacing--l;
    }

    &__content {
        margin-top: $k-spacing--2xl;
    }

    &__emptyContent {
        margin-top: $k-spacing--3xl;
        margin-bottom: $k-spacing--5xl;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--4xl;
            min-height: $empty-container-height;
        }
    }

    &__emptyIllustration {
        width: $empty-illustration-width;
        height: $empty-illustration-height;
    }

    &__emptyText {
        margin-top: $k-spacing--xl;
    }

    &__cardsWrap {
        @include k-layout;

        margin-bottom: $k-spacing--l;
    }

    &__cardFooter {
        @include k-typo-s;

        color: $k-color-gray--600;

        &.is-disabled {
            padding-bottom: $k-spacing--xs;
            color: $k-color-gray--400;
        }
    }

    &__company,
    &__companySkeleton {
        @include k-layout__item(math.div(12, 12));

        list-style: none;

        @media (min-width: $k-breakpoint--m) {
            @include k-layout__item(math.div(4, 12));
        }

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            @include k-layout__item(math.div(3, 12));
        }
    }
}
</style>
