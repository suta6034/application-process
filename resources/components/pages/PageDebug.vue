<script setup>
import * as Sentry from '@sentry/vue';
import {
    computed, inject, ref,
} from 'vue';
import * as authService from '../../services/auth';
import appConfig from '../../config';

import AppButton from '../atoms/app/AppButton';
import AppCard from '../molecules/app/AppCard';
import AppIcon from '../atoms/app/AppIcon';
import LayoutDefault from '../layouts/LayoutDefault';
import ProgressDots from '../atoms/progress/ProgressDots';
import TextCode from '../atoms/text/TextCode';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    showSnackbar,
} from '../../utils/snackbar';
import {
    useActions, useState,
} from '../../composables/vuex-helpers';
import {
    showToast,
} from '../../utils/toast';

const router = inject('router');

const appVersion = process.env.VUE_APP_VERSION;
const sentryEnabled = process.env.VUE_APP_SENTRY_DSN;
const loggedIn = ref(false);
const oauthUser = ref(null);
const userUuid = ref(null);
const iframeHeight = ref(0);
const renderIframeJobAd = ref(false);
const renderIframeCompany = ref(false);

const {
    fetched,
} = useState('profile');

const {
    FETCH_PROFILE: fetchProfile,
} = useActions('profile');

const {
    firstname,
    surname,
    email,
} = useState('profile/basics');

const loading = computed(() => loggedIn.value && !fetched.value);

/* istanbul ignore next: Debug page isn't critical. */
const objectToString = obj => Object.keys(obj)
    .map(key => `${key.padEnd(20)} ${JSON.stringify(obj[key])}`)
    .join('\n');

/* istanbul ignore next: Debug page isn't critical. */
const refreshAuth = async () => {
    oauthUser.value = await authService.getProfile();
    userUuid.value = await authService.getUuid();
    loggedIn.value = await authService.isUserLoggedIn();

    /* istanbul ignore next: Debug page isn't critical. */
    if (loggedIn.value) {
        await fetchProfile();
    }
};

/* istanbul ignore next: Debug page isn't critical. */
const logout = () => authService.logout(router.currentRoute.path);

/* istanbul ignore next: Debug page isn't critical. */
const log = () => {
    /* istanbul ignore next: Debug page isn't critical. */
    if (process.env.VUE_APP_SENTRY_DSN) {
        Sentry.setUser(oauthUser.value);
        Sentry.captureMessage('Debug Page Test');
    }
};

/* istanbul ignore next: Debug page isn't critical. */
const triggerSnackbar = () => showSnackbar({ text: 'Snackbar. 🍫' });

/* istanbul ignore next: Debug page isn't critical. */
const triggerToast = () => showToast({ text: 'Toast. 🍞' });

/* istanbul ignore next: Debug page isn't critical. */
const triggerIframeJobAd = () => {
    renderIframeJobAd.value = !renderIframeJobAd.value;
    renderIframeCompany.value = false;
};

/* istanbul ignore next: Debug page isn't critical. */
const triggerIframeCompany = () => {
    renderIframeCompany.value = !renderIframeCompany.value;
    renderIframeJobAd.value = false;
};

/* istanbul ignore next: Debug page isn't critical. */
const iframeLoaded = (event) => {
    const iFrame = event.target;
    const contentDocument = (iFrame.contentWindow || iFrame.contentDocument).document;
    iframeHeight.value = contentDocument.documentElement.scrollHeight;
};

refreshAuth();
</script>

<template>
    <LayoutDefault has-background-gray>
        <div class="c-pageDebug">
            <div class="c-pageDebug--section">
                <AppCard>
                    <template #header>
                        <TextHeadline
                            :level="2"
                            size="xl"
                        >
                            <ProgressDots
                                v-if="loading"
                                class="c-cardCvAction__dots"
                            />
                            <AppIcon
                                v-else
                                name="avatar-questionmark"
                                size="2xl"
                            />
                            <span v-if="fetched">
                                {{ email }}
                                <span v-if="firstname && surname"> &middot; {{ firstname }} {{ surname }}</span>
                            </span>
                            <span v-if="!loggedIn && !fetched">
                                No User
                            </span>
                        </TextHeadline>
                    </template>
                    <div class="c-buttonList">
                        <AppButton
                            :to="{ name: 'login' }"
                            size="s"
                            outline
                        >
                            Login
                        </AppButton>
                        <AppButton
                            outline
                            :disabled="!loggedIn && loading"
                            size="s"
                            @click="fetchProfile"
                        >
                            Fetch Profile
                        </AppButton>
                        <AppButton
                            outline
                            :disabled="!loggedIn"
                            size="s"
                            @click="logout"
                        >
                            Logout
                        </AppButton>
                    </div>
                    <div v-if="loggedIn">
                        <TextCode>{{ objectToString(oauthUser) }}</TextCode>
                    </div>
                </AppCard>
            </div>
            <div class="c-pageDebug--section">
                <AppCard>
                    <template #header>
                        <TextHeadline
                            :level="2"
                            size="xl"
                        >
                            <AppIcon
                                name="cog"
                                size="2xl"
                            />
                            Build
                        </TextHeadline>
                    </template>
                    <template #action>
                        <AppButton
                            size="s"
                            outline
                            :disabled="!sentryEnabled"
                            @click="log"
                        >
                            Log to Sentry
                        </AppButton>
                    </template>
                    <TextCode>{{ objectToString({ 'version': appVersion }) }}</TextCode>
                    <TextCode>{{ objectToString(appConfig) }}</TextCode>
                </AppCard>
            </div>
            <div class="c-pageDebug--section">
                <AppCard>
                    <template #header>
                        <TextHeadline
                            :level="2"
                            size="xl"
                        >
                            <AppIcon
                                name="gamepad"
                                size="2xl"
                            />
                            UI
                        </TextHeadline>
                    </template>
                    <div class="c-buttonList">
                        <AppButton
                            size="s"
                            outline
                            @click="triggerSnackbar"
                        >
                            Snackbar
                        </AppButton>
                        <AppButton
                            size="s"
                            outline
                            @click="triggerToast"
                        >
                            Toast
                        </AppButton>
                        <AppButton
                            size="s"
                            outline
                            @click="triggerIframeJobAd"
                        >
                            iFrame JobAd
                        </AppButton>
                        <AppButton
                            size="s"
                            outline
                            @click="triggerIframeCompany"
                        >
                            iFrame Company
                        </AppButton>
                    </div>
                </AppCard>
            </div>
            <div class="c-pageDebug--section">
                <iframe
                    v-if="renderIframeJobAd"
                    title="Job Ad"
                    :height="iframeHeight"
                    style="overflow: hidden; width: 100%;"
                    src="/html/5751360?isSplitView=true"
                    @load="iframeLoaded"
                />
                <iframe
                    v-if="renderIframeCompany"
                    title="Company"
                    :height="iframeHeight"
                    style="overflow: hidden; width: 100%;"
                    src="/x/karriere-at?isSplitView=true"
                    @load="iframeLoaded"
                />
            </div>
        </div>
    </LayoutDefault>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/tools/wrap';

.c-pageDebug {
    @include wrap(math.div(8, 12));

    padding-top: $k-spacing--2xl;
    padding-bottom: $k-spacing--3xl;

    .c-buttonList {
        margin-bottom: 10px;

        .c-appButton {
            margin-right: 4px;
        }
    }

    &--section {
        margin-bottom: $k-spacing--xl;
    }

    &__headline {
        margin-bottom: $k-spacing--l;
    }
}
</style>
