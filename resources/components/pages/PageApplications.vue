<script setup>
import {
    computed,
    inject,
    nextTick,
    ref,
    watch,
} from 'vue';
import {
    emitUserAction,
} from '../../services/user-actions';

// eslint-disable-next-line import/no-cycle
import {
    STATES,
    useApplicationList,
} from '../../composables/resource-application';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
import * as watchlistService from '../../services/job-watchlist';
import {
    done as progressDone,
    start as progressStart,
} from '../atoms/progress/ProgressLoadingBar';
import {
    useStringWithCounter,
} from '../../composables/string-with-counter';
import '../../lang/application';
import '../../lang/notification';

import AppApplicationDetail from '../organisms/app/AppApplicationDetail';
import AppApplicationItem from '../organisms/app/AppApplicationItem';
import AppButton from '../atoms/app/AppButton';
import AppCupcake from '../atoms/app/AppCupcake';
import AppDropdown from '../molecules/app/AppDropdown';
import AppIcon from '../atoms/app/AppIcon';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppLink from '../atoms/app/AppLink';
import AppList from '../atoms/app/AppList';
import AppPagination from '../molecules/app/AppPagination';
import AppPillGroup from '../atoms/app/AppPillGroup';
import AppRefreshPrompt from '../molecules/app/AppRefreshPrompt';
import DropdownApplicationsFilter from '../organisms/dropdown/applications/DropdownApplicationsFilter';
import LayoutSplitView from '../layouts/LayoutSplitView';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useState,
} from '../../composables/vuex-helpers';
import {
    showSnackbar,
} from '../../utils/snackbar';

const props = defineProps({
    id: {
        default: null,
        type: String,
    },
    subNavId: {
        default: null,
        type: String,
    },
});

const hasJobWatchlist = ref(false);
const isLoadingJobWatchlist = ref(false);

const router = inject('router');
const {
    data: applications,
    pagination,
    refetch: refetchApplications,
    sortBy,
    sortDirection,
    state,
    turnToPageFirst,
    turnToPageNext,
    turnToPagePrevious,
    activeFilter,
    filterString,
    setFilter,
    resetFilter,
    hasActiveFilter,
} = useApplicationList();

const applicationsCount = computed(() => pagination.value.total);
const hasApplications = computed(() => applications.value?.length > 0);

const isError = computed(() => state.value === STATES.isError);
const isLoadingApplications = computed(() => state.value === STATES.isLoading);
const isSuccess = computed(() => state.value === STATES.isSuccess);

const selectedApplicationIdManual = ref(null);
const selectedAppplicationRoute = computed(() => applications.value
    .find(application => application.id === props.id) || null);
const selectedApplication = computed(() => {
    if (isLoadingApplications.value || !hasApplications.value) return null;
    if (selectedApplicationIdManual.value) {
        const selectedData = applications.value.find(({ id }) => id === selectedApplicationIdManual.value);
        if (selectedData === undefined) return applications.value[0];

        return selectedData;
    }
    if (selectedAppplicationRoute.value) return selectedAppplicationRoute.value;

    return applications.value[0];
});
const selectApplication = (application) => {
    selectedApplicationIdManual.value = application.id;
};
const selectApplicationNextTo = (application) => {
    const selectedIndex = applications.value.indexOf(application);
    const nextApplication = applications.value[selectedIndex + 1]
            || applications.value[selectedIndex - 1]
            || null;
    if (nextApplication) selectApplication(nextApplication);
};

const { isMobile } = useBreakpoints();
const isDetailOpen = ref(false);
const activeSubNav = props.subNavId ? ref(props.subNavId) : ref('application');
const openDetail = async (application, subNavId) => {
    if (isMobile.value) {
        await router.push({
            name: 'page-application-detail',
            params: {
                id: application.id,
                subNavId: 'memo',
            },
        });
        return;
    }
    selectApplication(application);
    await nextTick();
    activeSubNav.value = subNavId;
    isDetailOpen.value = true;
};

const fetchAndDisplayApplications = async () => {
    await refetchApplications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const delayUntilSnackbar = 1000; // ms
watch(hasApplications, () => {
    if (hasApplications.value && router.currentRoute.query.fromApplication) {
        router.replace({ ...router.currentRoute, query: { fromApplication: undefined } });
        setTimeout(() => {
            showSnackbar({
                text: 'Deine Bewerbung wurde erfolgreich versandt!',
                icon: 'check',
            });
        }, delayUntilSnackbar);
    }
});

// Go to previous page if current page is empty.
watch(hasApplications, () => {
    const isFirstPage = pagination.value.number <= 1;
    if (isFirstPage || hasApplications.value) return;

    turnToPagePrevious();
});

watch(state, () => {
    if (state.value === STATES.isValidating) progressStart();
    if (state.value === STATES.isSuccess) progressDone();
});

const emitFilterClick = (filterAction) => {
    switch (filterAction) {
    case '-createDate':
        emitUserAction('application-filter-sort-newest');
        break;
    case 'createDate':
        emitUserAction('application-filter-sort-oldest');
        break;
    default:
        break;
    }
};

const { stringWithCounter: headline } = useStringWithCounter({
    singular: 'Bewerbung',
    plural: 'Bewerbungen',
    counter: applicationsCount,
});

const {
    fetched: profileFetched,
    exists: profileExists,
} = useState('profile');

const isLoading = computed(() => isLoadingApplications.value || isLoadingJobWatchlist.value || !profileFetched.value);
const isReady = computed(() => !isLoading.value && !isError.value);
const hasProfileWithoutApplications = computed(() => profileExists.value && isSuccess.value && !hasApplications.value);

watch(hasProfileWithoutApplications, async (value) => {
    if (!value || hasJobWatchlist.value) return;

    try {
        isLoadingJobWatchlist.value = true;

        const watchlist = await watchlistService.latest();

        isLoadingJobWatchlist.value = false;
        hasJobWatchlist.value = watchlist?.data.meta.count > 0;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
});

watch(filterString, async (newString) => {
    const query = newString ? { filter: newString } : null;
    if (router.currentRoute.query?.filter === newString) return;
    await router.push({ query });
});
</script>

<template>
    <LayoutSplitView
        :detail-open="isDetailOpen"
        :loading="isLoading"
        sticky-column="detail"
        class="c-pageApplications"
    >
        <template
            v-if="isReady && !hasActiveFilter && !hasApplications"
            #full
        >
            <div
                v-track-visibility="{ element: 'PR_V: Page State', elementDetail: 'Empty' }"
                class="c-pageApplications__empty"
                data-qa="empty"
            >
                <div class="c-pageApplications__emptyWrapper">
                    <div class="c-pageApplications__emptyLeft">
                        <img
                            class="c-pageApplications__emptyIllustration"
                            src="../../assets/img/illustrations/has-no-applications.jpg"
                            width="1002"
                            height="749"
                            alt=""
                        >
                    </div>
                    <div class="c-pageApplications__emptyRight">
                        <TextHeadline
                            :level="1"
                            size="xl"
                            data-qa="empty state headline"
                        >
                            Deine Bewerbungen auf einen Blick
                        </TextHeadline>
                        <AppList class="c-pageApplications__emptyList">
                            <li class="k-c-list__item">
                                <AppIcon
                                    size="m"
                                    name="check"
                                    class="k-c-list__icon"
                                    fixed-width
                                />
                                <span>
                                    Sobald du dich auf karriere.at für einen Job beworben hast,
                                    kannst du hier den Überblick über deine Bewerbungen halten.
                                </span>
                            </li>
                            <li class="k-c-list__item">
                                <AppIcon
                                    size="m"
                                    name="check"
                                    class="k-c-list__icon"
                                    fixed-width
                                />
                                <span>
                                    Vorstellungsgespräch oder leider eine Absage? Setz den
                                    <b>passenden Status</b> deiner Bewerbung.
                                </span>
                            </li>
                            <li class="k-c-list__item">
                                <AppIcon
                                    size="m"
                                    name="check"
                                    class="k-c-list__icon"
                                    fixed-width
                                />
                                <span>
                                    <b>Jederzeit verfügbar</b> – greif von allen Geräten auf
                                    deine Bewerbungen zu.
                                </span>
                            </li>
                        </AppList>
                        <div class="c-pageApplications__emptyActions">
                            <AppButton
                                :to="{ name: 'page-jobs' }"
                                class="c-pageApplications__emptyButton"
                                data-qa="job search now"
                                data-gtm-element="AP_L: Empty State"
                                data-gtm-element-detail="Go to Job Search"
                                @click.native="emitUserAction('application-empty-job-search')"
                            >
                                Jetzt Jobs suchen
                            </AppButton>
                            <p
                                class="c-pageApplications__emptyParagraphBottom"
                            >
                                Tipp: Du kannst Bewerbungen auch
                                <AppLink
                                    :to="{ name: 'page-application-create' }"
                                    data-qa="application form link"
                                    data-gtm-element="AP_L: Empty State"
                                    data-gtm-element-detail="Add Application"
                                    @click.native="emitUserAction('application-empty-add-application')"
                                >
                                    manuell hinzufügen
                                </AppLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #list-top>
            <div
                v-track-visibility="{ element: 'PR_V: Page State', elementDetail: 'Filled' }"
                class="c-pageApplications__listHeader"
            >
                <TextHeadline
                    :level="1"
                    size="xl"
                    data-qa="header headline"
                >
                    {{ headline }}
                </TextHeadline>
                <AppDropdown
                    class="c-pageApplications__filter"
                    data-qa="applications filter"
                >
                    <template #trigger>
                        <AppButton
                            width="condensed"
                            :disabled="isLoading"
                            slim
                            outline="outlineGray"
                            class="c-pageApplications__filterTrigger"
                            data-gtm-element="AP_L: Filter"
                            data-gtm-element-detail="Click"
                            @click="emitUserAction('application-filter-open')"
                        >
                            <span class="c-pageApplications__filterText">Filter anzeigen</span>
                            <template #iconRight>
                                <AppIcon
                                    class="c-pageApplications__filterTriggerIcon u-gray-hover-green"
                                    name="arrow-down"
                                    size="l"
                                />
                            </template>
                        </AppButton>
                    </template>
                    <template #default="{ close }">
                        <DropdownApplicationsFilter
                            class="c-pageApplications__filterForm"
                            :sort="sortDirection"
                            @sortChange="sortBy($event);close();emitFilterClick($event)"
                        />
                    </template>
                </AppDropdown>
            </div>
            <div class="c-pageApplications__listSubheader">
                <div
                    v-if="isReady && hasActiveFilter"
                    class="c-pageApplications__listFilterStatus"
                >
                    <AppPillGroup
                        v-for="filter in activeFilter"
                        :key="filter.key"
                        :label="$t(`application.status.${filter.key}`)"
                        :data-qa="`active filter ${filter.key}`"
                        @secondaryAction="setFilter(filter.key, false)"
                    >
                        <template #secondaryAction>
                            <AppIcon
                                name="cross"
                                size="xs"
                            />
                        </template>
                    </AppPillGroup>
                </div>
                <div class="c-pageApplications__listTopMessages">
                    <AppInfoBox
                        v-if="isReady && hasActiveFilter && !hasApplications"
                        warning
                        data-qa="no match list"
                    >
                        <template v-if="activeFilter.length === 1">
                            Du hast keine Bewerbungen mit diesem Status.
                        </template>
                        <template v-else>
                            Du hast keine Bewerbungen mit diesen Kriterien.
                        </template>
                        <AppLink
                            tag="button"
                            neutral
                            underline
                            data-qa="reset application filter"
                            class="c-pageApplications__listTopMessageLink"
                            @click.native="resetFilter();emitUserAction('application-filter-reset')"
                        >
                            <strong>
                                Filter zurücksetzen
                            </strong>
                        </AppLink>
                    </AppInfoBox>
                    <AppInfoBox
                        v-if="isReady && pagination.number === 1"
                        data-qa="infobox add application"
                        hint
                    >
                        Du kannst auch Bewerbungen speichern, die du nicht über karriere.at versendet hast.
                        <br>
                        <AppLink
                            :to="{ name: 'page-application-create' }"
                            class="c-pageApplications__listTopMessageLink"
                            neutral
                            underline
                            data-qa="application form link"
                            data-gtm-element="AP_L: Manual Application"
                            data-gtm-element-detail="Add"
                            @click.native="emitUserAction('application-add-application-infobox')"
                        >
                            <strong>Bewerbung hinzufügen</strong>
                        </AppLink>
                    </AppInfoBox>
                    <AppInfoBox
                        v-if="isError"
                        warning
                        data-qa="error message"
                    >
                        Tut uns leid, es ist ein Fehler aufgetreten - bitte lade die Seite neu.
                        <br>
                        <AppLink
                            tag="button"
                            neutral
                            underline
                            class="c-pageApplications__listTopMessageLink"
                            @click="fetchAndDisplayApplications"
                        >
                            <strong>Jetzt neu laden</strong>
                        </AppLink>
                    </AppInfoBox>
                </div>
            </div>
        </template>
        <template
            #list-main
        >
            <template v-if="isLoading">
                <li
                    v-for="i in 6"
                    :key="i"
                    class="c-pageApplications__listItem"
                >
                    <AppApplicationItem/>
                </li>
            </template>
            <li
                v-for="application in applications"
                v-else
                :key="application.id"
                class="c-pageApplications__listItem"
                :class="{
                    'c-pageApplications__listItem--selected':
                        selectedApplication && selectedApplication.id === application.id
                }"
                data-qa="application item"
            >
                <AppApplicationItem
                    :application="application"
                    @memo="openDetail(application, 'memo')"
                    @clicked="openDetail(application)"
                    @remove="selectedApplication === application && selectApplicationNextTo(application)"
                />
            </li>
        </template>
        <template
            v-if="isReady && pagination.pages > 1"
            #list-pagination
        >
            <AppPagination
                :current-page="pagination.number"
                :max-pages="pagination.pages"
                data-qa="pagination"
                ga-prefix="AP_L"
                @first="turnToPageFirst();emitUserAction('application-pagination-first')"
                @previous="turnToPagePrevious();emitUserAction('application-pagination-previous')"
                @next="turnToPageNext();emitUserAction('application-pagination-next')"
            />
        </template>
        <template
            #detail
        >
            <div
                v-if="isError || (isReady && activeFilter && !hasApplications)"
                class="c-pageApplications__refreshPrompt"
            >
                <AppRefreshPrompt
                    v-if="isError"
                    :fetch="fetchAndDisplayApplications"
                />
                <AppCupcake
                    v-if="isReady && hasActiveFilter && !hasApplications"
                    data-qa="no match detail"
                >
                    <template #cherry>
                        <img
                            class="c-pageApplications__emptyStateFilteredIllustration"
                            src="../../assets/img/illustrations/has-no-applications-filtered.png"
                            alt="Seite nicht gefunden."
                        >
                    </template>
                    <p class="c-pageApplications__cupcakeText">
                        Du hast keine Bewerbungen mit diesem Status.
                    </p>
                    <template #action>
                        <AppLink
                            tag="button"
                            data-qa="reload"
                            @click.native="resetFilter();emitUserAction('application-filter-reset-detail')"
                        >
                            Filter zurücksetzen
                        </AppLink>
                    </template>
                </AppCupcake>
            </div>
            <AppApplicationDetail
                v-else
                :key="selectedApplication && selectedApplication.id"
                :application="selectedApplication"
                :is-loading="!isReady"
                :is-error="isError"
                :active-sub-nav="activeSubNav"
                class="c-pageApplications__detail"
                @click-link-sub-nav="activeSubNav = $event"
                @memo="activeSubNav = 'memo'"
                @remove="selectApplicationNextTo(selectedApplication)"
            />
        </template>
    </LayoutSplitView>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/link/index';
@import '../../assets/scss/settings/border-radius';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/font-size';
@import '../../assets/scss/settings/spacing';

// 1. Fix background color issue when scrolling on mobile devices.
// 2. Visually center the block to satisfy the design.
.c-pageApplications {
    $root: &;
    $filter-form-width: 13.5rem;
    $empty-max-width: 1000px;
    $empty-image-width: 476px;
    $empty-filter-illustration-width: 251px;
    $filterTrigger-size-mobile: 180px;

    background-color: $k-color-gray--50;

    &.c-layoutSplitView--detailOpen {
        background-color: $k-color-white; // 1

        @media (min-width: $k-breakpoint--m) {
            background-color: $k-color-gray--50;
        }
    }

    &__refreshPrompt {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 80%; // 2
    }

    &__detail {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
            height: 100%;
        }
    }

    &__empty {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: start;
        margin-top: $k-spacing--m;
        background-color: $k-color-white;
    }

    &__emptyWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: $k-spacing--2xl;
        margin-right: $k-spacing--xl;
        margin-bottom: $k-spacing--5xl;
        margin-left: $k-spacing--xl;
        max-width: $empty-max-width;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            margin-top: $k-spacing--4xl;
        }
    }

    &__emptyLeft {
        @media (min-width: $k-breakpoint--m) {
            margin-right: $k-spacing--2xl;
            max-width: 476px;
        }
    }

    &__emptyRight {
        flex-grow: 1;
    }

    &__emptyIllustration {
        width: 100%;
    }

    &__emptyList {
        padding-top: $k-spacing--l;

        .k-c-list__item:first-child {
            margin-top: 0;
        }
    }

    &__emptyActions {
        margin-top: $k-spacing--xl;
    }

    &__emptyButton {
        width: 100%;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            width: auto;
            text-align: left;
        }
    }

    &__emptyParagraphBottom {
        margin-top: $k-spacing--m;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            text-align: left;
        }
    }

    &__listItem {
        position: relative;
        padding: $k-spacing--l;

        &:not(:last-child) {
            border-bottom: 1px solid $k-color-gray--100;
        }

        &--selected {
            &::before {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                display: block;
                width: 3px;
                background: $k-color-green--600;
                content: '';
            }
        }
    }

    &__listHeader {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $k-spacing--l;
        gap: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    &__listSubheader {
        margin-bottom: $k-spacing--m;
    }

    &__listFilterStatus {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: $k-spacing--xl;
        gap: $k-spacing--m;
    }

    &__listTopMessages {
        margin-top: $k-spacing--xl;
        margin-bottom: $k-spacing--xl;

        > :not(:first-child) {
            margin-top: $k-spacing--m;
        }
    }

    &__listTopMessageLink {
        margin-top: $k-spacing--xs;
    }

    &__filter,
    &__status {
        position: relative;
    }

    &__filterTrigger {
        width: $filterTrigger-size-mobile;

        &:hover:not([disabled]) {
            #{$root}__filterTriggerIcon {
                color: $k-color-green--800;
            }
        }

        &:focus {
            border-color: $k-color-gray--300;
            color: $k-color-gray--900;

            #{$root}__filterTriggerIcon {
                color: $k-color-gray--500;
            }

            &:hover {
                border-color: $k-color-green--800;
                color: $k-color-green--800;

                #{$root}__filterTriggerIcon {
                    color: $k-color-green--800;
                }
            }
        }

        @media (min-width: $k-breakpoint--m) {
            width: 100%;
        }
    }

    &__filterTriggerIcon {
        will-change: transform;
        transition: transform 0.2s ease-in-out, color 0.2s ease;
    }

    &__filterForm {
        position: absolute;
        right: 0;
        z-index: 1;
        margin-top: $k-spacing--s;
        padding: $k-spacing--xl;
        width: 100%;
        border-radius: $k-border-radius--s;
        background: $k-color-white;
        box-shadow: 0 0 $k-spacing--s rgba($k-color-gray--900, 0.2);

        &:hover {
            cursor: auto;
        }
    }

    &__filter {
        &.c-appDropdown--open {
            #{$root}__filterTriggerIcon {
                transform: rotate(180deg);
            }
        }

        @media (min-width: $k-breakpoint--m) {
            width: 100%;
        }
    }

    &__filterText {
        flex-grow: 1;
        text-align: left;
    }

    &__emptyStateFilteredIllustration {
        max-width: $empty-filter-illustration-width;
    }

    &__cupcakeText {
        margin-top: $k-spacing--m;
    }

    &__headline {
        &--highlighted {
            color: $k-color-green--500;
        }
    }
}
</style>
