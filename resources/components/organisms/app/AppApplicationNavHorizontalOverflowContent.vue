<script setup>
import {
    computed,
    ref,
    watch,
} from 'vue';
import {
    STATUS,
} from '../../../composables/resource-application';
import {
    useApplicationStatusPatch,
    STATES,
} from '../../../composables/resource-application-status';
import {
    formatDate,
} from '../../../utils/filter';
import {
    CATEGORIES,
} from '../../../utils/tracking';
import {
    emitUserAction,
} from '../../../services/user-actions';

import AppActionBox from '../../molecules/app/AppActionBox';
import AppApplicationLetter from './AppApplicationLetter';
import AppApplicationTimeline from './AppApplicationTimeline';
import AppButton from '../../atoms/app/AppButton';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppInfoBox from '../../molecules/app/AppInfoBox';
import AppLink from '../../atoms/app/AppLink';
import ModalApiError from '../modal/ModalApiErrorAutoOpen';
import IllustrationMessageEmptyStateApplications from '../../illustrations/IllustrationMessageEmptyStateApplications';
import ProgressDots from '../../atoms/progress/ProgressDots';
import SvgLightBulb from '../../atoms/svg/SvgLightBulb';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const ACTIONBOX_KEY = 'applications-no-invitation-no-reply';

const props = defineProps({
    isLoading: {
        default: false,
        type: Boolean,
    },
    application: {
        default: () => {},
        type: Object,
    },
});

const {
    error: applicationStatusPatchError,
    patch: patchApplicationStatus,
    state: applicationStatusState,
} = useApplicationStatusPatch();

const isCreateDateThreeDaysAgo = () => {
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const threeDaysAfterApplicationCreation = new Date(props.application.createDate).getTime()
                + threeDaysInMilliseconds;
    return now >= threeDaysAfterApplicationCreation;
};

const applicationsNoReplyYet = ref(JSON.parse(localStorage.getItem(ACTIONBOX_KEY)) ?? []);
const hasNoReply = computed(() => applicationsNoReplyYet.value.includes(props.application?.id));

const setKey = () => {
    applicationsNoReplyYet.value.push(props.application.id);
    localStorage.setItem(ACTIONBOX_KEY, JSON.stringify(applicationsNoReplyYet.value));
};

const removeItemFromLocalStorage = () => {
    const indexInArray = applicationsNoReplyYet.value.indexOf(props.application.id);
    applicationsNoReplyYet.value.splice(indexInArray, 1);

    if (applicationsNoReplyYet.value.length) {
        localStorage.setItem(ACTIONBOX_KEY, JSON.stringify(applicationsNoReplyYet.value));
    } else {
        localStorage.removeItem(ACTIONBOX_KEY);
    }
};

const updateStatusToRejected = async () => {
    await patchApplicationStatus({ id: props.application.id, data: { status: STATUS.rejected } });

    if (hasNoReply.value) removeItemFromLocalStorage();
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.applications);

watch(applicationStatusState, () => {
    if (applicationStatusState.value === STATES.isSuccess) {
        showSnackbar({
            text: 'Status wurde geändert',
            icon: 'check',
        });
    }
});

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const openApplicationsNoInvitationReasonModal = () => {
    showModal({
        componentName: 'ModalApplicationsNoInvitationReason',
        componentProps: {
            sendCallback: ({ reason }) => {
                if (reason === 'no-reply') {
                    setKey();
                } else if (reason === 'rejection') {
                    updateStatusToRejected();
                }
            },
        },
    });
};
const openStatusApplicationModal = () => {
    showModal({
        componentName: 'ModalApplicationsItemStatus',
        componentProps: {
            applicationId: props.application.id,
            status: STATUS.invited,
            statusDate: props.application.statusDate,
            statusChangeCallback: ({ status }) => {
                if (status === STATUS.invited) removeItemFromLocalStorage();
            },
        },
    });
};
</script>

<template>
    <div class="c-appApplicationNavHorizontalOverflowContent">
        <ModalApiError :error="applicationStatusPatchError"/>
        <section class="c-appApplicationNavHorizontalOverflowContent__section">
            <ProgressDots
                v-if="isLoading"
                class="c-appApplicationNavHorizontalOverflowContent__loading"
            />
            <template v-else-if="application">
                <template v-if="application.status === STATUS.applied">
                    <AppActionBox
                        v-if="isCreateDateThreeDaysAgo() && !hasNoReply"
                        v-track-visibility="{ element: 'AP_D: Invited Question Infobox' }"
                        class="c-appApplicationNavHorizontalOverflowContent__applicationStatusActionBox"
                        data-qa="action box invited"
                    >
                        <template #header>
                            Wurdest du zu einem Vorstellungsgespräch eingeladen?
                        </template>
                        <div class="c-appApplicationNavHorizontalOverflowContent__applicationStatusActionButtons">
                            <AppButton
                                outline
                                slim
                                data-qa="no"
                                data-gtm-element="AP_D: Invited Question Infobox"
                                data-gtm-element-detail="No"
                                @click="
                                    openApplicationsNoInvitationReasonModal();
                                    trackClick('infobox-already-invited-no');
                                "
                            >
                                Nein
                            </AppButton>
                            <AppButton
                                outline
                                slim
                                data-qa="yes"
                                data-gtm-element="AP_D: Invited Question Infobox"
                                data-gtm-element-detail="Yes"
                                @click="
                                    openStatusApplicationModal();
                                    trackClick('infobox-already-invited-yes');
                                "
                            >
                                Ja
                            </AppButton>
                        </div>
                    </AppActionBox>
                    <AppActionBox
                        v-else-if="hasNoReply"
                        class="c-appApplicationNavHorizontalOverflowContent__applicationStatusActionBox"
                        data-qa="action box no reply"
                    >
                        <template #header>
                            Wir drücken dir die Daumen!
                            Halte uns über deinen Bewerbungsstatus am Laufenden, damit wir dir weiterhin
                            Tipps geben können.
                        </template>
                        <div class="c-appApplicationNavHorizontalOverflowContent__applicationStatusActionButtons">
                            <AppButton
                                outline
                                slim
                                data-qa="no"
                                @click="updateStatusToRejected"
                            >
                                Absage
                            </AppButton>
                            <AppButton
                                outline
                                slim
                                data-qa="yes"
                                @click="openStatusApplicationModal"
                            >
                                Einladung
                            </AppButton>
                        </div>
                    </AppActionBox>
                </template>
                <AppInfoBox
                    v-if="application.status === STATUS.invited"
                    hint
                    class="c-appApplicationNavHorizontalOverflowContent__statusInfo"
                    data-qa="invited info"
                >
                    <template #icon>
                        <SvgLightBulb/>
                    </template>
                    <template v-if="application.statusDate">
                        Am {{ formatDate({ date: application.statusDate, format: 'd.m.Y' }) }}
                        ist dein Vorstellungsgespräch.
                    </template>
                    <template v-else>
                        Bald findet dein Vorstellungsgespräch statt.
                    </template>
                    Zur optimalen Vorbereitung
                    <!-- Illegal usage of `k-c-infoBox__link` because of design flaw in Global Styles. -->
                    <AppLink
                        v-track-visibility="{ element: 'AP_D: Application State Content Infobox' }"
                        href="/c/a/bewerbungsgespraech"
                        target="_blank"
                        class="k-c-infoBox__link"
                        data-gtm-element="AP_D: Application State Content Infobox"
                        data-gtm-element-detail="Change to Invited"
                        @click="trackClick('application-invited-content')"
                    >
                        unsere besten Tipps.
                    </AppLink>
                </AppInfoBox>
                <AppInfoBox
                    v-if="application.status === STATUS.confirmed"
                    hint
                    class="c-appApplicationNavHorizontalOverflowContent__statusInfo"
                    data-qa="confirmed info"
                >
                    <template #icon>
                        <SvgLightBulb/>
                    </template>
                    Gratuliere zum neuen Job! Damit du ab dem ersten Tag durchstarten kannst, hol dir
                    <!-- Illegal usage of `k-c-infoBox__link` because of design flaw in Global Styles. -->
                    <AppLink
                        v-track-visibility="{ element: 'AP_D: Application State Content Infobox' }"
                        href="/c/a/neu-im-job-was-beachten"
                        target="_blank"
                        class="k-c-infoBox__link"
                        data-gtm-element="AP_D: Application State Content Infobox"
                        data-gtm-element-detail="Change to Confirmed"
                        @click="trackClick('application-confirmed-content')"
                    >
                        <strong>Tipps zum Arbeitsstart.</strong>
                    </AppLink>
                </AppInfoBox>
                <AppInfoBox
                    v-if="application.status === STATUS.rejected"
                    hint
                    class="c-appApplicationNavHorizontalOverflowContent__statusInfo"
                    data-qa="rejected info"
                >
                    Absagen sind immer schade, aber lass den Kopf nicht hängen! Dein Traumjob wartet auf dich. Wir haben
                    Tipps für dich, damit es beim nächsten Mal besser läuft.
                    <!-- Illegal usage of `k-c-infoBox__link` because of design flaw in Global Styles. -->
                    <AppLink
                        v-track-visibility="{ element: 'AP_D: Application State Content Infobox' }"
                        href="/c/motivationsschreiben"
                        target="_blank"
                        class="k-c-infoBox__link"
                        data-gtm-element="AP_D: Application State Content Infobox"
                        data-gtm-element-detail="Change to Rejected"
                        @click="trackClick('application-rejected-content')"
                    >
                        <strong>Tipps lesen</strong>
                    </AppLink>
                </AppInfoBox>
                <AppApplicationLetter
                    v-if="application.message"
                    :application="application"
                />
                <AppCupcake
                    v-else
                    class="c-appApplicationNavHorizontalOverflowContent__empty"
                    data-qa="no message info"
                >
                    <template #cherry>
                        <IllustrationMessageEmptyStateApplications
                            class="c-appApplicationNavHorizontalOverflowContent__cupcakeCherry"
                            alt="Bewerbungsschreiben nicht gefunden."
                        />
                    </template>
                    <p class="c-appApplicationNavHorizontalOverflowContent__cupcakeText">
                        Du hast dein Bewerbungsschreiben noch nicht hinterlegt.
                    </p>
                    <template #action>
                        <AppLink
                            :to="{ name: 'page-application-edit', params: { id: application.id } }"
                            data-qa="edit application"
                            @click.native="emitUserAction('application-edit-application-tab-application')"
                        >
                            Bewerbung bearbeiten
                        </AppLink>
                    </template>
                </AppCupcake>
            </template>
        </section>
        <AppApplicationTimeline
            v-if="!isLoading && application"
            class="c-appApplicationNavHorizontalOverflowContent__sidebar"
            :application="application"
        />
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';

.c-appApplicationNavHorizontalOverflowContent {
    $loading-dots-padding-top: 8rem;
    $section-min-height: 12rem;

    display: flex;
    flex-grow: 1;
    flex-direction: column-reverse;

    @media (min-width: $k-breakpoint--m) {
        flex-direction: row;
    }

    &__statusInfo {
        margin-bottom: $k-spacing--xl;
    }

    &__section {
        display: flex;
        flex-direction: column;

        @media (min-width: $k-breakpoint--m) {
            @include wrap(math.div(10, 12), $k-spacing--3xl);

            margin-right: auto;
            margin-left: auto;
            min-height: $section-min-height;
            width: 100%;
        }
    }

    &__empty {
        padding-top: $k-spacing--4xl;
        padding-bottom: $k-spacing--4xl;
    }

    &__sidebar {
        margin-bottom: $k-spacing--l;
        border-radius: $k-border-radius--s;

        @media (min-width: $k-breakpoint--m) {
            flex-shrink: 0;
            margin-top: $k-spacing--xl - $k-spacing--3xl; // 3
            margin-bottom: 0;
            margin-left: $k-spacing--l;
            width: 254px;
        }
    }

    &__loading {
        margin: auto;
        padding-top: $loading-dots-padding-top;

        @media (min-width: $k-breakpoint--m) {
            padding-top: 0;
        }
    }

    &__applicationStatusActionBox {
        margin-bottom: $k-spacing--xl;
    }

    &__applicationStatusActionButtons {
        display: flex;
        margin-top: $k-spacing--m;
        gap: $k-spacing--s;

        >* {
            width: 50%;

            @media (min-width: $k-breakpoint--m) {
                width: auto;
            }
        }
    }
}
</style>
