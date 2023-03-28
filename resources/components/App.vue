<script setup>
import {
    inject, onBeforeMount,
} from 'vue';

import {
    useGtm,
} from '@gtm-support/vue2-gtm';
import {
    getCookie,
} from '../utils/cookie';
import {
    COOKIE_SERVER_SIDE_EVENTS,
    enableTrackers,
    trackServerSideEvents,
} from '../utils/tracking';

import {
    initUserActionTracking,
} from '../services/tracking-user-actions';

import config from '../config';
import * as logger from '../utils/logger';
import * as authService from '../services/auth';
import * as notificationsService from '../services/notification';

import AppPopup from './molecules/app/AppPopup';
import {
    useMutations,
} from '../composables/vuex-helpers';

const TIME_NOTIFICATIONS_USER = 30 * 1000;

const router = inject('router');
initUserActionTracking({ getCurrentCategory: () => router.currentRoute?.meta?.trackingCategory });

const {
    SET_NOTIFICATIONS: setNotifications,
} = useMutations('notification');

async function checkNotifications() {
    const isPageLoaded = router.currentRoute.matched.length > 0;

    try {
        // We have a couple of routes that only serve as entry points to
        // trigger redirects or auth related things but don't render a
        // component themselves. We don't want to check notifications on
        // such routes because it's pointless and it can lead to
        // unnecessary redirects on auth related routes.
        // This is only a workaround. Ideally we don't want to
        // initialize `App.vue` at all for such routes.
        if (isPageLoaded && await authService.isUserLoggedIn()) {
            const response = await notificationsService.get();
            setNotifications(response.data.meta);
        }
    } catch (error) {
        // Ignore network errors because notifications are not critical.
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    // Make sure to fetch notifications quickly after page load.
    const timeout = isPageLoaded ? TIME_NOTIFICATIONS_USER : 1000;
    setTimeout(checkNotifications, timeout);
}

function enableTracking() {
    const trackerDependencies = [];
    if (config.gtm) {
        const gtm = useGtm();
        trackerDependencies.push(gtm);
    }
    enableTrackers(trackerDependencies);
}

function tryToTrackServerSideEvents() {
    try {
        trackServerSideEvents();
    } catch (exception) {
        // Temporary log errors for debugging.
        /* istanbul ignore next */
        logger.info({
            exception,
            extras: {
                cookie: getCookie(COOKIE_SERVER_SIDE_EVENTS),
            },
            tags: {
                user_info: logger.userInfoTags.NONE,
            },
        });
    }
}

onBeforeMount(() => {
    checkNotifications();

    router.onReady(() => {
        enableTracking();
        tryToTrackServerSideEvents();
    });
});
</script>

<template>
    <div id="app">
        <router-view/>
        <AppPopup data-qa="popup"/>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/generic/all';
@import '../assets/scss/elements/base';
@import '~@karriereat/global-styles/scss/objects/all';
@import '~@karriereat/global-styles/scss/components/all';
@import '../assets/scss/hacks/flexbox-min-width-fix';
@import '../assets/scss/utilities/bold';
@import '../assets/scss/utilities/clearfix';
@import '../assets/scss/utilities/ellipsis';
@import '../assets/scss/utilities/gray-hover-green';
@import '../assets/scss/utilities/nowrap';
@import '../assets/scss/utilities/partial-hover';
@import '../assets/scss/utilities/screen-reader-only';
@import '../assets/scss/utilities/word-break';
</style>
