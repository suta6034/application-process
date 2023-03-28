<script setup>
/* istanbul ignore file */
import client from '@karriereat/mf-header-client';
import sum from 'hash-sum';

import {
    computed, inject, nextTick, onBeforeMount, onMounted, ref, watch,
} from 'vue';
import {
    HEADER_CACHE,
} from '../../../utils/cache';
import * as authService from '../../../services/auth';
import * as logger from '../../../utils/logger';
import {
    useActions, useGetters, useMutations, useState,
} from '../../../composables/vuex-helpers';

const router = inject('router');

const props = defineProps({
    minimal: {
        type: Boolean,
        default: false,
    },
    transparent: {
        type: Boolean,
        default: false,
    },
    white: {
        type: Boolean,
        default: false,
    },
});

function wait(duration) {
    return new Promise((resolve) => { setTimeout(() => resolve(), duration); });
}

async function waitForElement({ selector, tryNumber = 1, tryLimit = 5, timeout = 100 }) {
    const isElementInDocument = Boolean(document.querySelector(selector));
    if (isElementInDocument) return;

    if (tryNumber <= tryLimit) {
        await wait(timeout);
        await waitForElement({ selector, tryNumber: tryNumber + 1, tryLimit, timeout });
        return;
    }

    throw new Error(`Element "${selector}" not found!`);
}

const authenticated = ref(null);
const headerView = ref(null);

const {
    fetched, imageVersion,
} = useGetters('profile');

const {
    email, firstname, surname,
} = useState('profile/basics');

const {
    hash: headerHash,
    expireTime: headerExpireTime,
    response: headerResponse,
} = useState('header');

const {
    messages: messagesHasNotification,
    cv: cvHasNotification,
    alarm: jobAlarmHasNotification,
    companies: myCompaniesHasNotification,
    matching: matchingHasNotification,
    applications: applicationHasNotification,
} = useState('notification');

const showLoadingState = computed(() => !fetched.value && authenticated.value);
const imageUrlRound = computed(() => imageVersion.value('square')?.url ?? '');

const headerAppearance = computed(() => ({
    transparent: props.transparent,
    white: props.white,
    minimal: props.minimal,
}));

const userModel = computed(() => ({
    firstName: firstname.value,
    lastName: surname.value,
    email: email.value,
    profileImageUrl: imageUrlRound.value,
}));

const loginButtonModel = computed(() => ({
    targetUrl: router.resolve({
        name: 'login',
        query: {
            redirectUrl: router.currentRoute.fullPath,
        },
    }).href,
}));

const logoutButtonModel = computed(() => ({
    targetUrl: null,
}));

const notificationModel = computed(() => ({
    cv: cvHasNotification.value,
    applications: applicationHasNotification.value,
    messages: messagesHasNotification.value,
    alarm: jobAlarmHasNotification.value,
    jobs: false,
    matching: matchingHasNotification.value,
    companies: myCompaniesHasNotification.value,
}));

const {
    FETCH_HEADER: fetchHeader,
} = useActions('header');

const {
    SET_HEADER_HASH: setHeaderHash,
} = useMutations('header');

async function updateHeader(data) {
    headerView.value = data.html; // Self-XSS Risk approved by sec-op
    await nextTick();

    const scriptTagExist = document.querySelector('[data-js="mf-script"]');
    if (!scriptTagExist) {
        // Cross-site injection protection
        const expectedOrigin = process.env.API_MF_APP_SHELL_BASE?.replace('localhost', '127.0.0.1') || '';
        if (!data.scripts[0].src.startsWith(expectedOrigin)) {
            return;
        }

        const tag = document.createElement('script');
        tag.setAttribute('src', data.scripts[0].src);
        tag.setAttribute('defer', 'defer');
        tag.setAttribute('data-js', 'mf-script');
        document.body.appendChild(tag);
    } else {
        try {
            await waitForElement({ selector: '.mf-headerViewModel' });
            client.mountHeader();
        } catch (exception) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.error(exception);
            }

            // Temporary log errors for debugging.
            /* istanbul ignore next */
            logger.info({
                exception,
                extras: {
                    data,
                },
                tags: {
                    user_info: logger.userInfoTags.NONE,
                },
            });
        }
    }
}

function setFirstLevelCache(response) {
    /*
    This is approximation to Clock with Adaptive Replacement Caching
    We assume that the majority of users active in karL have a profile and
    that the loading state should not be displayed. Therefore, the response
    is stored by an active user who sees the default header.
    Since we assume this, the frequency and the type of the HeaderResponse
    is not considered in this cache.
    */
    const maxAge = 2 * 60 * 1000;
    const cacheObj = { timeStamp: Date.now() + maxAge, response };

    sessionStorage.setItem(HEADER_CACHE, JSON.stringify(cacheObj));
}

function isFirstLevelCacheActive() {
    const cacheObj = JSON.parse(sessionStorage.getItem(HEADER_CACHE));
    if (!cacheObj || !cacheObj.timeStamp || !cacheObj.response) return false;
    if (props.minimal) return false;
    if (Date.now > parseFloat(cacheObj.timeStamp)) {
        sessionStorage.removeItem(HEADER_CACHE);
        return false;
    }

    return cacheObj && cacheObj.response && parseFloat(cacheObj.timeStamp) > Date.now();
}

async function fetchDataAndSetCache(model) {
    await fetchHeader(model);

    if (authenticated.value
        && (model.user.firstName || model.user.email)
        && !model.status.loading && headerResponse.value && !props.minimal) {
        setFirstLevelCache(headerResponse.value);
    }
}

async function renderHeader(model) {
    /*
    This is the second level for caching.
    First, the current ViewModel is hashed and compared to the previous hash.
    If they do not match, the API is called.
    The next step will take effect if the last call is more than X minutes in the past.
    The last step checks if the cache contains a response at all.
    */
    const currentHash = sum(model);
    if (currentHash !== headerHash.value) {
        setHeaderHash(currentHash);
        await fetchDataAndSetCache(model);
    } else if (Date.now() > headerExpireTime.value) {
        await fetchDataAndSetCache(model);
    } else if (!headerResponse.value) {
        await fetchDataAndSetCache(model);
    }

    if (headerResponse.value) {
        await updateHeader(headerResponse.value);
    }
}

function getViewFromFirstLevelCache(model) {
    const cacheObj = JSON.parse(sessionStorage.getItem(HEADER_CACHE));
    if (cacheObj?.response) {
        updateHeader(cacheObj.response);
    } else {
        // Fallback if the sessionStorage is not available or if the cache state is inconsistent
        renderHeader(model);
    }
}

watch(showLoadingState, () => {
    if (!showLoadingState.value) client.updateStatus({ loading: showLoadingState.value });
}, { deep: true, immediate: true });

watch(userModel, () => {
    // If the userModel is updated we can assume that the user is loggedIn,
    // so we set the loading state of false to ensure this assumption,
    // we check if the firstname or the email is truthy
    client.updateUser(userModel.value);
    if (firstname.value || email.value) client.updateStatus({ loading: false });
}, { deep: true, immediate: true });

watch(notificationModel, () => {
    client.updateNotifications(notificationModel.value);
}, { deep: true, immediate: true });

onBeforeMount(async () => {
    let model = {
        headerAppearance: headerAppearance.value,
        loginButton: loginButtonModel.value,
        logoutButton: logoutButtonModel.value,
        registerLink: { targetUrl: router.resolve({ name: 'register' }).href },
    };

    authenticated.value = await authService.isUserLoggedIn();

    if (authenticated.value) {
        const status = { status: { loggedIn: true, loading: showLoadingState.value } };
        const user = { user: userModel.value };
        model = { ...model, ...user, ...status };
    } else {
        client.updateLoginButton(loginButtonModel.value);
    }

    if (router.currentRoute.path.startsWith('/profil/lebenslauf')) {
        const activeMenu = {
            activeMenuItem: {
                jobs: false,
                companies: false,
                cv: true,
                center: false,
                hr: false,
            },
        };
        model = { ...model, ...activeMenu };
    }

    if (isFirstLevelCacheActive()) {
        getViewFromFirstLevelCache(model);
    } else {
        renderHeader(model);
    }
});

onMounted(() => {
    client.onReady(() => {
        if (!showLoadingState.value) client.updateStatus({ loading: showLoadingState.value });
        client.updateUser(userModel.value);
        client.updateNotifications(notificationModel.value);
    });
    client.onLogoutButtonClick(() => authService.logout());
});

// Expose for unit tests
defineExpose({ userModel, showLoadingState, headerResponse });
</script>

<template>
    <div
        v-if="headerView"
        class="c-appHeader"
        v-html="headerView"
    />
    <div
        v-else
        class="c-appHeader__fallback"
        :class="{
            'c-appHeader__fallback--minimal': minimal,
            'c-appHeader__fallback--white': white,
            'c-appHeader__fallback--transparent': transparent,
        }"
        data-qa="header fallback"
    />
</template>

<style lang="scss">
@import '../../../assets/scss/settings/branding';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/z-index';

.c-appHeader {
    position: relative;
    z-index: $z-index-nav-user;

    &__fallback {
        height: $branding-header-height;
        background-color: $k-color-primary;
        color: $k-color-white;

        &--minimal,
        &--white {
            background-color: $k-color-white;
            color: $k-color-primary;
        }

        &--transparent {
            background-color: transparent;
            color: $k-color-white;
        }
    }

    &__hide {
        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }
}
</style>
