<script setup>
import Vue, {
    onBeforeMount, ref,
} from 'vue';

import {
    formatDate,
} from '../../../utils/filter';
import {
    ACTIONS,
    CATEGORIES,
    EVENTS,
    track,
} from '../../../utils/tracking';

import * as watchlistService from '../../../services/job-watchlist';

import AppIcon from '../../atoms/app/AppIcon';
import AppJobItem from '../../organisms/app/AppJobItem';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    job: {
        default: null,
        type: Object,
    },
});
const { trackClick } = useTrackClick(CATEGORIES.page.dashboard);
const watchStatus = ref({});

onBeforeMount(() => {
    /* istanbul ignore next */
    if (props.job.attributes.isWatched) {
        Vue.set(watchStatus.value, props.job.id, true);
    } else {
        Vue.set(watchStatus.value, props.job.id, false);
    }
});

const trackConversion = (event) => {
    track({
        category: CATEGORIES.conversion,
        action: ACTIONS.watchlist,
        label: event,
    });
};

const trackGA4Conversion = (id) => {
    track({
        event: EVENTS.jobSaveSuccess,
        jobId: id,
        ga4Event: true,
    });
};

const unwatch = async (id) => {
    Vue.set(watchStatus.value, id, false);
    await watchlistService.unwatch(id);
    trackConversion('remove');
};
const watch = async (id) => {
    Vue.set(watchStatus.value, id, true);
    await watchlistService.watch(id);
    trackClick('save-job');
    trackConversion('add');
    trackGA4Conversion(id);
};

</script>

<template>
    <div class="c-appJobMatchingItem k-o-distributeSpace">
        <div class="k-o-media__body">
            <AppJobItem
                ref="jobItem"
                data-gtm-element="DB: Matching"
                data-gtm-element-detail="Open Detail"
                :to="{ name: 'page-job-detail', params: { id: job.id } }"
                no-media
                @click.native="trackClick('view-job-detail')"
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
                        {{ formatDate({ date: job.attributes.showDate, format: 'd.m.Y' }) }}
                    </span>
                </template>
            </AppJobItem>
        </div>
        <div class="k-o-media__figure">
            <button
                v-show="watchStatus[job.id] !== false"
                class="c-appJobMatchingItem__watchToggle"
                data-qa="unwatch"
                aria-label="Nicht mehr beobachten"
                @click.prevent="unwatch(job.id)"
            >
                <AppIcon
                    name="star-filled"
                    size="l"
                />
            </button>
            <button
                v-show="watchStatus[job.id] === false"
                class="c-appJobMatchingItem__watchToggle"
                data-qa="watch"
                aria-label="Beobachten"
                @click.prevent="watch(job.id)"
            >
                <AppIcon
                    name="star"
                    size="l"
                />
            </button>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/tools/surface-boost';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-appJobMatchingItem {
    padding: $k-spacing--m $k-spacing--m $k-spacing--l $k-spacing--xs;
    width: 100%;
    border: 1px solid $k-color-gray--100;
    border-radius: $k-border-radius--s;
    vertical-align: middle;

    @media (min-width: $k-breakpoint--m) {
        @include wrap(math.div(7, 12));
    }

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
