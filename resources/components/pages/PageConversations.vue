<script setup>
import {
    computed,
    inject,
    nextTick,
    ref,
    watch,
    watchEffect,
} from 'vue';
import {
    onBeforeRouteLeave,
// eslint-disable-next-line import/extensions
} from 'vue-router/composables';

import {
    STATES,
} from '../../composables/resource-endpoint';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
// eslint-disable-next-line import/no-cycle
import {
    useConversationPatch,
    useConversationList,
    useConversation,
    useConversationRemove,
} from '../../composables/resource-conversation';
import {
    opened as conversationOpened,
} from '../../services/conversation-action';
import {
    CATEGORIES, track,
} from '../../utils/tracking';
import {
    useStringWithCounter,
} from '../../composables/string-with-counter';
import {
    done as progressDone,
    start as progressStart,
} from '../atoms/progress/ProgressLoadingBar';

import AppConversationDetail from '../organisms/app/AppConversationDetail';
import AppConversationItem from '../organisms/app/AppConversationItem';
import AppCupcake from '../atoms/app/AppCupcake';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppLink from '../atoms/app/AppLink';
import AppPagination from '../molecules/app/AppPagination';
import AppRefreshPrompt from '../molecules/app/AppRefreshPrompt';
import FormSelect from '../molecules/form/FormSelect';
import LayoutSplitView from '../layouts/LayoutSplitView';
import ProgressDots from '../atoms/progress/ProgressDots';
import TextHeadline from '../atoms/text/TextHeadline';

import '../../lang/message';
import {
    useTrackClick,
} from '../../composables/track-click';
import {
    useMutations, useState,
} from '../../composables/vuex-helpers';
import {
    showSnackbar,
} from '../../utils/snackbar';
import i18n from '../../utils/i18n';

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const {
    id: profileId,
    fetched: profileFetched,
    active: isVisible,
} = useState('profile');

const {
    applyFilter,
    data: conversations,
    filter: appliedFilter,
    pagination,
    refetch: refetchConversations,
    state: conversationsState,
    turnToPageFirst,
    turnToPageNext,
    turnToPagePrevious,
} = useConversationList();
const {
    patch: conversationsPatchRead,
} = useConversationPatch();
const {
    remove: conversationRemove,
    state: conversationPatchDeletedState,
} = useConversationRemove();

const conversationsCount = computed(() => pagination.value.total);

const { stringWithCounter: headline } = useStringWithCounter({
    singular: 'Nachricht',
    plural: 'Nachrichten',
    counter: conversationsCount,
});
const { isMediumScreen } = useBreakpoints();

const FILTER = {
    inbox: 'Posteingang',
    trash: 'Papierkorb',
};

const filterTypes = [
    {
        id: 0,
        label: FILTER.inbox,
        value: FILTER.inbox,
        status: 'default',
    },
    {
        id: 1,
        label: FILTER.trash,
        value: FILTER.trash,
        status: 'deleted',
    },
];

/* Regarding convention of variables for local storage,
it should be like underscore + lowercase for the expiry date of infobox */
const messageInfobox = '_message';

const props = defineProps({
    id: {
        default: null,
        type: String,
    },
});

const router = inject('router');

const detail = ref(null);
const isDetailOpen = ref(false);
const activeSubNav = ref('message');
const selectedConversationIdManual = ref(null);
const showSubHeader = ref(true);

const hasConversations = computed(() => conversations.value?.length > 0);
const selectedConversationRoute = computed(() => conversations.value
    .find(conversation => conversation.id === props.id) || null);
const isConversationsLoading = computed(() => conversationsState.value === STATES.isLoading);

const selectedConversation = computed(() => {
    if (isConversationsLoading.value || !hasConversations.value) return null;
    if (selectedConversationIdManual.value) {
        const selectedData = conversations.value.find(({ id }) => id === selectedConversationIdManual.value);
        if (selectedData === undefined) return conversations.value[0];

        return selectedData;
    }
    if (selectedConversationRoute.value) return selectedConversationRoute.value;

    return conversations.value[0];
});

onBeforeRouteLeave((to, from, next) => (detail.value?.customBeforeRouteLeave(next) ?? next()));

const setExpiryDate = () => {
    showSubHeader.value = false;
    const now = new Date();
    const addSixMonthsOnToday = new Date(now.setMonth(now.getMonth() + 6));

    const item = {
        infobox: addSixMonthsOnToday,
    };
    localStorage.setItem(messageInfobox, JSON.stringify(item));
};

const checkWithExpiryDate = () => {
    const itemStr = localStorage.getItem(messageInfobox);

    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.infobox) {
        localStorage.removeItem(messageInfobox);
        showSubHeader.value = true;
        return null;
    }
    showSubHeader.value = false;
    return null;
};

const readConversation = (conversation) => {
    if (conversation) {
        if (conversation.read === true) return;
        conversationsPatchRead({ data: { read: true }, id: conversation.id });
    }
};

const selectConversation = (conversation) => {
    selectedConversationIdManual.value = conversation.id;
};

const selectConversationNextTo = (index) => {
    const nextConversation = conversations.value[index + 1]
        || conversations.value[index - 1]
        || null;
    if (nextConversation) selectConversation(nextConversation);
};

const openDetail = async (conversation, subNavId) => {
    selectConversation(conversation);
    await nextTick();
    activeSubNav.value = subNavId;
    isDetailOpen.value = true;
};

const {
    state: conversationState,
    refetch: refetchConversation,
} = useConversation({
    id: computed(() => selectedConversation.value?.id),
});

const isConversationStateError = computed(() => conversationState.value === STATES.isError
    || conversationState.value === STATES.isErrorStale);
const isConversationStateSuccess = computed(() => conversationState.value === STATES.isSuccess);

const isConversationsStateError = computed(() => conversationsState.value === STATES.isError);
const isConversationsReady = computed(() => !isConversationsLoading.value && !isConversationsStateError.value);
const isLoading = computed(() => isConversationsLoading.value || !profileFetched.value);

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.messages);

/* istanbul ignore next */
const trackSelectedFilter = (selectedFilterType) => {
    if (selectedFilterType.label === FILTER.inbox) {
        trackClick('messages-filter-inbox');
        track({
            element: 'MS_L: Filter',
            elementDetail: 'Inbox',
            ga4Event: true,
        });
    }
    if (selectedFilterType.label === FILTER.trash) {
        trackClick('messages-filter-bin');
        track({
            element: 'MS_L: Filter',
            elementDetail: 'Bin',
            ga4Event: true,
        });
    }
};

const removeConversation = ({ conversation, index, trackingEvent }) => {
    pagination.value.total -= 1;
    conversationRemove({ id: conversation.id });
    trackClick(`${trackingEvent}-delete`);
    selectConversationNextTo(index - 1);
};

const resetIdByFilter = () => {
    selectedConversationIdManual.value = null;
};

const fetchAndDisplayConversations = async () => {
    await refetchConversations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const currentFilter = () => filterTypes.find(filterType => filterType.status === appliedFilter.value.status);
const filter = ref(currentFilter());

const handleFilterChange = (selectedFilterType) => {
    applyFilter(selectedFilterType);
    resetIdByFilter();
    trackSelectedFilter(selectedFilterType);
};

watch(appliedFilter, () => {
    filter.value = currentFilter();
});

const splitView = ref(null);
const redirectAfterSend = async () => {
    await refetchConversations();

    const isFilterTrash = appliedFilter.value.status === 'deleted';
    const isTheFirstPage = pagination.value.number === 1;

    if (isFilterTrash) {
        applyFilter({
            status: 'default',
        });
        return;
    }

    if (isTheFirstPage) {
        openDetail(conversations.value[0]);
        splitView.value?.$refs.listColumn.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    await router.push({ name: 'page-conversations' });
};

watch(selectedConversation, () => {
    readConversation(selectedConversation.value);
});

watch(conversationsState, () => {
    if (conversationsState.value === STATES.isSuccess) {
        conversationOpened({ data: {} });
    }
});

watch(conversationsState, () => {
    if (conversationsState.value === STATES.isValidating) progressStart();
    if (conversationsState.value === STATES.isSuccess) progressDone();
});

watchEffect(checkWithExpiryDate);

watch(conversationPatchDeletedState, () => {
    if (conversationPatchDeletedState.value === STATES.isValidating) {
        showSnackbar({
            text: i18n('message.deleted'),
            icon: 'check',
        });
    }
});

function handlePagination({ first, previous, next }) {
    if (first) {
        turnToPageFirst();
        trackClick('messages-pagination-first');
        track({
            element: 'MS_L: Pagination',
            elementDetail: 'First',
            ga4Event: true,
        });
    } else if (previous) {
        turnToPagePrevious();
        trackClick('messages-pagination-previous');
        track({
            element: 'MS_L: Pagination',
            elementDetail: 'Previous',
            ga4Event: true,
        });
    } else if (next) {
        turnToPageNext();
        trackClick('messages-pagination-next');
        track({
            element: 'MS_L: Pagination',
            elementDetail: 'Next',
            ga4Event: true,
        });
    }
}

function showMessageDeleteModal({ conversation, index, trackingEvent }) {
    showModal({
        componentName: 'ModalMessageDelete',
        ariaLabel: 'Bist du sicher?',
        componentProps: {
            removeCallback: () => {
                removeConversation({ conversation, index, trackingEvent });
                track({ element: 'MS_L: Delete', elementDetail: 'Confirm', ga4Event: true });
            },
            cancelCallback: () => {
                trackClick(`${trackingEvent}-cancel`);
                track({ element: 'MS_L: Delete', elementDetail: 'Cancel', ga4Event: true });
            },
        },
    });
}
// Refetch conversations on click on messages
function handleSubnavClick(id, callback) {
    if (id !== 'messages') return;
    detail.value?.customBeforeRouteLeave(callback);
}

</script>

<template>
    <LayoutSplitView
        ref="splitView"
        :detail-open="isDetailOpen"
        :loading="isLoading"
        has-sticky-list
        sticky-column="list"
        class="c-pageConversations"
        @click-link="handleSubnavClick($event, refetchConversations)"
    >
        <template #list-top>
            <div class="c-pageConversations__listHeader">
                <TextHeadline
                    :level="1"
                    size="xl"
                    data-qa="conversations headline"
                >
                    {{ headline }}
                </TextHeadline>
                <FormSelect
                    v-model="filter"
                    :disabled="isLoading"
                    :options="filterTypes"
                    data-qa="filter"
                    icon-size="l"
                    is-condensed
                    prevent-scroll
                    small
                    class="c-pageConversations__dropdown"
                    data-gtm-element="MS_L: Filter"
                    data-gtm-element-detail="Click"
                    @change="handleFilterChange"
                    @open="trackClick('messages-filter')"
                />
            </div>
            <template v-if="isConversationsReady">
                <template v-if="hasConversations">
                    <AppInfoBox
                        v-if="showSubHeader && appliedFilter.status !== 'deleted'"
                        class="c-pageConversations__infoBox"
                    >
                        Wundere dich nicht über Nachrichten ohne direkte Anrede. Recruiter haben im
                        Talentepool erst Zugriff auf deine persönlichen Daten, sobald du sie explizit
                        freigegeben hast.
                        <AppLink
                            v-track-visibility="{ element: 'MS_L: Salutation Info' }"
                            neutral
                            underline
                            tag="button"
                            data-gtm-element="MS_L: Salutation Info"
                            data-gtm-element-detail="Dismiss"
                            @click.native="setExpiryDate();trackClick('messages-infobox-hide')"
                        >
                            <strong>Nicht mehr anzeigen</strong>
                        </AppLink>
                    </AppInfoBox>
                </template>
                <template v-else>
                    <AppInfoBox
                        v-if="isVisible"
                        v-track-visibility="appliedFilter.status === 'deleted' ?
                            { element: 'MS_L: Improve CV - Bin' } :
                            { element: 'MS_L: Improve CV - Inbox' }"
                        class="c-pageConversations__infoBox"
                        warning
                        data-qa="infobox active profile and no conversations"
                    >
                        Deinen Lebenslauf für Recruiting-Verantwortliche noch interessanter gestalten?
                        <br>
                        <AppLink
                            href="/c/a/lebenslauf-interessant-fuer-recruiter"
                            class="c-pageConversations__infoBoxLink"
                            neutral
                            underline
                            data-qa="cv improvement link"
                            :data-gtm-element="appliedFilter.status === 'deleted' ?
                                { element: 'MS_L: Improve CV - Bin' } :
                                { element: 'MS_L: Improve CV - Inbox' }"
                            data-gtm-element-detail="Click"
                            @click.native="
                                appliedFilter.status === 'deleted'
                                    ? trackClick('bin-improve-cv')
                                    : trackClick('improve-cv')"
                        >
                            <strong>Das geht ganz einfach</strong>
                        </AppLink>.
                    </AppInfoBox>
                    <AppInfoBox
                        v-else
                        class="c-pageConversations__infoBox"
                        data-qa="infobox inactive profile and no conversations"
                        warning
                    >
                        Damit Firmen deinen anonymisierten Lebenslauf aufrufen und dir Job-Angebote schicken können,
                        musst du ihn
                        <router-link
                            v-track-visibility="{ element: 'MS_L: Activate Profile' }"
                            :to="{ name: 'page-visibility-form' }"
                            class="k-c-infoBox__link"
                            data-gtm-element="MS_L: Activate Profile"
                            data-gtm-element-detail="Click"
                            @click.native="trackClick('make-cv-visible');"
                        >
                            <span>sichtbar schalten</span>
                        </router-link>.
                    </AppInfoBox>
                    <template v-if="!isMediumScreen">
                        <div
                            v-if="isConversationsStateError
                                || isConversationStateError
                                || (isConversationsReady && !hasConversations)"
                            class="c-pageConversations__refreshPrompt--mobile"
                        >
                            <AppRefreshPrompt
                                v-if="isConversationsStateError || isConversationStateError"
                                data-qa="error conversation detail"
                                :fetch="fetchAndDisplayConversations"
                            />
                            <AppCupcake
                                v-if="isConversationsReady && !hasConversations"
                                data-qa="no conversation"
                            >
                                <template #cherry>
                                    <img
                                        class="c-pageConversations__emptyIllustration"
                                        src="../../assets/img/illustrations/has-no-visit.png"
                                        alt="no visit"
                                    >
                                </template>
                                <div class="c-pageConversations__emptyText">
                                    <template
                                        v-if="isVisible"
                                    >
                                        Mach den Lebenslauf interessanter für Recruiting-Verantwortliche.
                                        <AppLink
                                            v-track-visibility="appliedFilter.status === 'deleted' ?
                                                { element: 'MS_D: Improve CV - Bin' } :
                                                { element: 'MS_D: Improve CV - Inbox' }"
                                            href="/c/a/lebenslauf-interessant-fuer-recruiter.html"
                                            data-qa="cv improvement link"
                                            :data-gtm-element="appliedFilter.status === 'deleted' ?
                                                { element: 'MS_D: Improve CV - Bin' } :
                                                { element: 'MS_D: Improve CV - Inbox' }"
                                            data-gtm-element-detail="Click"
                                            @click.native="
                                                appliedFilter.status === 'deleted'
                                                    ? trackClick('bin-improve-cv-detail')
                                                    : trackClick('improve-cv-detail')
                                            "
                                        >
                                            Das geht ganz einfach.
                                        </AppLink>
                                    </template>
                                    <template
                                        v-else
                                    >
                                        Möchtest du von Firmen gefunden werden? Jetzt Lebenslauf
                                        <AppLink
                                            v-track-visibility="{ element: 'MS_D: Activate Profile' }"
                                            :to="{ name: 'page-visibility-form' }"
                                            data-qa="profile activation link"
                                            data-gtm-element="MS_D: Activate Profile"
                                            data-gtm-element-detail="Click"
                                            @click.native="trackClick('make-cv-visible-detail')"
                                        >
                                            <span>sichtbar schalten</span>
                                        </AppLink>.
                                    </template>
                                </div>
                            </AppCupcake>
                        </div>
                    </template>
                </template>
            </template>
            <AppInfoBox
                v-if="isConversationsStateError || isConversationStateError"
                class="c-pageConversations__infoBox"
                data-qa="error conversation infobox"
            >
                Tut uns leid, es ist ein Fehler aufgetreten - bitte lade die Seite neu.
                <AppLink
                    tag="button"
                    neutral
                    underline
                    class="c-pageConversations___infoBoxLink"
                    @click="fetchAndDisplayConversations"
                >
                    <strong>Jetzt neu laden</strong>
                </AppLink>
            </AppInfoBox>
        </template>
        <template #list-main>
            <template v-if="isLoading">
                <AppConversationItem
                    v-for="i in 6"
                    :key="i"
                />
            </template>
            <AppConversationItem
                v-for="(conversation, index) in conversations"
                v-else
                :key="conversation.id"
                :conversation="conversation"
                :is-deletable="appliedFilter.status !== 'deleted'"
                :is-selected="selectedConversation && selectedConversation.id === conversation.id"
                data-qa="conversation item"
                data-gtm-element="MS_L: Message"
                @selected="openDetail(conversation, 'message'); trackClick('messages-select-message')"
                @remove="showMessageDeleteModal({conversation, index, trackingEvent: $event });"
            />
        </template>
        <template
            v-if="isConversationsReady && hasConversations && pagination.pages > 1"
            #list-pagination
        >
            <AppPagination
                :current-page="pagination.number"
                :max-pages="pagination.pages"
                data-qa="pagination"
                @first="handlePagination({ first: true })"
                @previous="handlePagination({ previous: true })"
                @next="handlePagination({ next: true })"
            />
        </template>
        <template #detail>
            <ProgressDots
                v-if="isConversationsLoading"
                class="c-pageConversations__loading"
            />
            <div
                v-else-if="isConversationsStateError
                    || isConversationStateError
                    || (isConversationsReady && !hasConversations)"
                class="c-pageConversations__refreshPrompt"
            >
                <AppRefreshPrompt
                    v-if="isConversationsStateError || isConversationStateError"
                    data-qa="error conversation detail"
                    :fetch="fetchAndDisplayConversations"
                />
                <AppCupcake
                    v-if="isConversationsReady && !hasConversations"
                    data-qa="no conversation"
                >
                    <template #cherry>
                        <img
                            class="c-pageConversations__emptyIllustration"
                            src="../../assets/img/illustrations/has-no-visit.png"
                            alt="no visit"
                        >
                    </template>
                    <div class="c-pageConversations__emptyText">
                        <template
                            v-if="isVisible"
                        >
                            Mach den Lebenslauf interessanter für Recruiting-Verantwortliche.
                            <AppLink
                                href="/c/a/lebenslauf-interessant-fuer-recruiter"
                                data-qa="cv improvement link"
                                @click.native="
                                    appliedFilter.status === 'deleted'
                                        ? trackClick('bin-improve-cv-detail')
                                        : trackClick('improve-cv-detail')
                                "
                            >
                                Das geht ganz einfach.
                            </AppLink>
                        </template>
                        <template
                            v-else
                        >
                            Möchtest du von Firmen gefunden werden? Jetzt Lebenslauf
                            <AppLink
                                v-track-visibility="{ element: 'MS_D: Activate Profile' }"
                                :to="{ name: 'page-visibility-form' }"
                                data-qa="profile activation link"
                                data-gtm-element="MS_D: Activate Profile"
                                data-gtm-element-detail="Click"
                                @click.native="trackClick('make-cv-visible-detail')"
                            >
                                <span>sichtbar schalten</span>
                            </AppLink>.
                        </template>
                    </div>
                </AppCupcake>
            </div>
            <AppConversationDetail
                v-else-if="selectedConversation"
                ref="detail"
                :active-sub-nav="activeSubNav"
                :conversation="selectedConversation"
                :messages="selectedConversation.messages || []"
                :is-conversation-error="isConversationStateError"
                :is-conversation-success="isConversationStateSuccess"
                :profile-id="profileId"
                :refetch-conversation="refetchConversation"
                @click-link-sub-nav="activeSubNav = $event"
                @remove="
                    showMessageDeleteModal({
                        conversation: selectedConversation,
                        index: conversations.indexOf(selectedConversation),
                        trackingEvent: $event,
                    });
                "
                @redirect-after-send="redirectAfterSend"
            />
        </template>
    </LayoutSplitView>
</template>

<style lang="scss">
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';

.c-pageConversations {
    $empty-illustration-width: 246px;
    $empty-illustration-height: 147px;

    background-color: $k-color-gray--50;

    &__refreshPrompt {
        display: flex;
        align-items: center;
        height: 80%;

        &--mobile {
            margin-top: $k-spacing--4xl;
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

    &__infoBox {
        margin-top: $k-spacing--xl;
        margin-bottom: $k-spacing--xl;
    }

    &__infoBoxLink {
        margin-top: $k-spacing--xs;
    }

    &__dropdown {
        @media (min-width: $k-breakpoint--m) {
            width: 100%;
        }
    }

    &__emptyIllustration {
        width: $empty-illustration-width;
        height: $empty-illustration-height;
    }

    &__emptyText {
        margin-top: $k-spacing--xl;
    }

    &__loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80%;

        &--mobile {
            position: absolute;
            top: 50%;
            left: 50%;
        }
    }
}
</style>
