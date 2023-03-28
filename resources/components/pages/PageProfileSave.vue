<script setup>
import {
    onBeforeMount, ref, inject,
} from 'vue';

import {
    CATEGORIES,
    EVENTS,
    LABELS,
    track,
} from '../../utils/tracking';
import * as authService from '../../services/auth';
import {
    log,
} from '../../utils/action-logger';

import AnimationEmailConfirmation from '../atoms/animation/AnimationEmailConfirmation';
import LayoutMinimal from '../layouts/LayoutMinimal';
import ProgressDots from '../atoms/progress/ProgressDots';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    useActions, useGetters, useMutations, useState,
} from '../../composables/vuex-helpers';

const router = inject('router');

const showConfirmationInfo = ref(false);
const showProgressInfo = ref(true);

const {
    model: profileModel,
} = useGetters('profileCreate');

const {
    email,
} = useState('profileCreate/basics');

const {
    source,
    origin,
    userWithEmailExists,
} = useState('profileCreate');
const {
    created: profileCreated,
} = useState('profile');
const {
    templateSettings,
} = useGetters('templateSettings');
const {
    confirmed: userIsConfirmed,
} = useGetters('user');

const {
    CREATE_PROFILE: createProfile,
} = useActions('profile');
const {
    CREATE_TEMPLATE_SETTINGS: createTemplateSettings,
    UPDATE_TEMPLATE_SETTINGS: updateTemplateSettings,
} = useActions('templateSettings');
const {
    FETCH_USER: fetchUser,
} = useActions('user');

const {
    RESET_STATE: resetProfileData,
} = useMutations('profileCreate');

async function finish() {
    resetProfileData();

    track({
        event: EVENTS.profileCreated,
        category: CATEGORIES.conversion,
    });

    const method = router.currentRoute.query.profileType;

    track({
        event: EVENTS.profileCreateSuccess,
        method,
        ga4Event: true,
    });

    if (source.value === 'application') {
        track({
            event: EVENTS.profileCreated,
            category: CATEGORIES.conversion,
            label: LABELS.application,
        });
    }

    showProgressInfo.value = false;

    if (!userIsConfirmed.value) {
        showConfirmationInfo.value = true;
        return;
    }

    log('profile-create-desired-job');

    await router.push({
        name: 'page-cv',
        query: {
            'first-activation': 'karl',
        },
    });
}

async function createProcess() {
    const hash = router.currentRoute.query.hash || null;
    await createProfile({ profileData: profileModel.value, hash });
    if (await authService.isUserLoggedIn()) await fetchUser();
    if (origin.value.origin === 'TEMPLATE_MANUAL') {
        // when a profile is added to an existing user without a profile, the template settings are
        // created by default and therefore post cannot be used
        if (userWithEmailExists.value) {
            await updateTemplateSettings({
                templateSettings: templateSettings.value,
                hash,
            });
            return;
        }

        await createTemplateSettings({
            templateSettings: templateSettings.value,
            hash,
        });
    }
}

onBeforeMount(async () => {
    if (!email.value) {
        router.push({
            name: 'page-profile-create-onepage',
        });
        return;
    }
    await createProcess();
    if (profileCreated.value) finish();
});

// Expose for unit tests
defineExpose({ showConfirmationInfo });
</script>

<template>
    <LayoutMinimal>
        <div class="c-pageProfileSave">
            <div v-if="showProgressInfo">
                <TextHeadline
                    :level="1"
                    size="l"
                >
                    Daten werden gespeichert
                </TextHeadline>
                <ProgressDots class="c-pageProfileSave__loading"/>
            </div>
            <div v-if="showConfirmationInfo">
                <AnimationEmailConfirmation/>
                <TextHeadline
                    :level="1"
                    size="2xl"
                    class="c-pageProfileSave__headline"
                >
                    Registrierung abschließen
                </TextHeadline>
                <p data-qa="confirm information">
                    Du hast einen Bestätigungslink per E-Mail an {{ email }}
                    erhalten um deine Registrierung abzuschließen. Bitte klicke diesen, um fortzufahren.
                </p>
            </div>
        </div>
    </LayoutMinimal>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-pageProfileSave {
    @include wrap(math.div(5, 12));

    margin-top: $k-spacing--2xl;
    margin-bottom: $k-spacing--2xl;
    text-align: center;

    &__headline {
        @include k-typo-xl;

        padding: $k-spacing--m $k-spacing--xl $k-spacing--xs;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            @include k-typo-2xl;
        }
    }

    &__loading {
        margin-top: $k-spacing--l;
    }
}
</style>
