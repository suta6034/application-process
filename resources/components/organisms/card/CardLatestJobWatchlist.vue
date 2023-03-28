<script setup>
import {
    ref, watch,
} from 'vue';
import {
    formatDate,
} from '../../../utils/filter';
import * as watchlistService from '../../../services/job-watchlist';

import AppBadge from '../../atoms/app/AppBadge';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppJobItem from '../app/AppJobItem';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import IllustrationEmptyJobWatchlist from '../../illustrations/IllustrationEmptyJobWatchlist';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useLatestWatchlist,
} from '../../../composables/latest-watchlist';
import {
    showSnackbar,
} from '../../../utils/snackbar';

const {
    jobs,
    count,
    error,
    fetch,
    isLoading,
} = useLatestWatchlist();

// Array of job-ids of followed jobs as a workaround for Vue 2 reactivity caveats (no new key)
const watchStatus = ref([]);

watch(jobs, (retrievedJobs) => {
    retrievedJobs.forEach(job => watchStatus.value.push(job.id));
});

const showErrorSnackbar = () => {
    showSnackbar({
        text: 'Da ging etwas schief, bitte probiere es noch einmal.',
        icon: 'cross',
    });
};

const unwatchJob = async (id) => {
    // Optimistic UI: Update star without waiting for API response first
    const index = watchStatus.value.indexOf(id);
    watchStatus.value.splice(index, 1);
    try {
        await watchlistService.unwatch(id);
    } catch (e) {
        showErrorSnackbar();
        // Revert optimistic UI change
        watchStatus.value.push(id);
    }
};
const watchJob = async (id) => {
    // Optimistic UI: Update star without waiting for API response first
    watchStatus.value.push(id);
    try {
        await watchlistService.watch(id);
    } catch (e) {
        showErrorSnackbar();
        // Revert optimistic UI change
        const index = watchStatus.value.indexOf(id);
        watchStatus.value.splice(index, 1);
    }
};
</script>

<template>
    <div class="c-cardLatestJobWatchlist k-c-card k-c-card--noBorder">
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    Merkliste
                </TextHeadline>
                <div class="k-o-media__figure">
                    <SkeletonBox
                        v-if="isLoading"
                        width="1.875em"
                        height="1.375em"
                    />
                    <AppBadge
                        v-else-if="!error"
                        data-qa="counter"
                    >
                        {{ count }}
                    </AppBadge>
                </div>
            </div>
            <AppLink
                v-if="jobs && jobs.length"
                :to="{ name: 'page-watchlist' }"
                data-qa="show all link"
                data-gtm-element="DB: Watchlist"
                data-gtm-element-detail="Show All"
            >
                Alle anzeigen
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="error"
                :fetch="fetch"
                data-qa="error state"
            />

            <AppCupcake
                v-else-if="!isLoading && jobs && jobs.length === 0"
                data-qa="empty state"
            >
                <template #cherry>
                    <IllustrationEmptyJobWatchlist data-qa="empty state illustration"/>
                </template>
                <p>
                    Gerade auf dem Sprung? Speichere interessante Jobs in
                    deiner Merkliste und bewirb dich später in Ruhe.
                </p>
                <template #action>
                    <AppLink :to="{ name: 'page-jobs' }">
                        Jetzt Jobs suchen
                    </AppLink>
                </template>
            </AppCupcake>
            <ul
                v-else
                class="k-o-ladder k-o-ladder--l"
            >
                <template v-if="isLoading">
                    <li
                        v-for="n in 3"
                        :key="n"
                        class="k-o-ladder__rung"
                    >
                        <AppJobItem loading/>
                    </li>
                </template>
                <template v-else>
                    <li
                        v-for="job in jobs"
                        :key="job.id"
                        class="k-o-ladder__rung k-o-media"
                        data-qa="job"
                    >
                        <div class="k-o-media__body">
                            <AppJobItem
                                ref="jobItem"
                                data-gtm-element="DB: Watchlist"
                                data-gtm-element-detail="Open Detail"
                                :to="{ name: 'page-job-detail', params: { id: job.id } }"
                            >
                                <template #figure>
                                    <img
                                        v-if="job.attributes.companyLogo"
                                        :src="job.attributes.companyLogo"
                                        :alt="job.attributes.companyName"
                                        data-qa="company logo"
                                    >
                                    <AppIcon
                                        v-else
                                        name="company"
                                        size="2xl"
                                        data-qa="company fallback logo"
                                    />
                                </template>
                                <template #headline>
                                    {{ job.attributes.title }}
                                </template>
                                <div class="k-o-chain k-o-chain--noWrap">
                                    <span class="k-o-chain__link u-ellipsis">
                                        {{ job.attributes.companyName }}
                                    </span>
                                    <span class="k-o-chain__link u-ellipsis">
                                        <span class="u-ellipsis">
                                            {{ job.attributes.locations.join(', ') }}
                                        </span>
                                    </span>
                                </div>
                                <template #meta-end>
                                    <span data-qa="date">
                                        {{ formatDate({ date: job.attributes.createDate, format: 'd.m.Y' }) }}
                                    </span>
                                </template>
                            </AppJobItem>
                        </div>
                        <div class="k-o-media__figure">
                            <button
                                v-show="watchStatus.includes(job.id)"
                                class="c-cardLatestJobWatchlist__watchToggle"
                                data-qa="unwatch"
                                data-gtm-element="DB: Watchlist"
                                data-gtm-element-detail="Unwatch Click"
                                aria-label="Nicht mehr beobachten"
                                @click.prevent="unwatchJob(job.id)"
                            >
                                <AppIcon
                                    name="star-filled"
                                    size="l"
                                />
                            </button>
                            <button
                                v-show="!watchStatus.includes(job.id)"
                                class="c-cardLatestJobWatchlist__watchToggle"
                                data-qa="watch"
                                data-gtm-element="DB: Watchlist"
                                data-gtm-element-detail="Watch Click"
                                aria-label="Beobachten"
                                @click.prevent="watchJob(job.id)"
                            >
                                <AppIcon
                                    name="star"
                                    size="l"
                                />
                            </button>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/tools/surface-boost';

.c-cardLatestJobWatchlist {
    &__watchToggle {
        @include surface-boost;

        border: none;
        background-color: transparent;
        color: $k-color-primary--dark;
        cursor: pointer;
        transition: color 0.2s;

        &:focus,
        &:hover {
            color: $k-color-green--800;
        }
    }
}
</style>
