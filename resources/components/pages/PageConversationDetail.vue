<script setup>
import {
    computed,
    inject,
    ref,
    watch,
} from 'vue';
import {
    onBeforeRouteLeave,
// eslint-disable-next-line import/extensions
} from 'vue-router/composables';

// eslint-disable-next-line import/no-cycle
import {
    STATES,
    useConversation,
    useConversationPatch,
    useConversationRemove,
} from '../../composables/resource-conversation';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
import '../../lang/application';
import {
    CATEGORIES, track, trackVisibility,
} from '../../utils/tracking';

import AppBrandline from '../atoms/app/AppBrandline';
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import AppConversationDetail from '../organisms/app/AppConversationDetail';
import AppRefreshPrompt from '../molecules/app/AppRefreshPrompt';
import LayoutDefault from '../layouts/LayoutDefault';
import LayoutDefaultDetail from '../layouts/LayoutDefaultDetail';
import LayoutMinimal from '../layouts/LayoutMinimal';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';
import PageNotFound from './PageNotFound';

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

const { id: profileId } = useState('profile');

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const router = inject('router');
const {
    data: conversation,
    refetch: refetchConversation,
    error: conversationError,
    state: conversationState,
} = useConversation({
    id: props.id,
});
const {
    patch: patchRead,
} = useConversationPatch();
const {
    remove: conversationRemove,
    state: conversationPatchDeletedState,
} = useConversationRemove();

const isConversationStateSuccess = computed(() => conversationState.value === STATES.isSuccess);
const isConversationStateError = computed(() => conversationState.value === STATES.isError
    || conversationState.value === STATES.isErrorStale);

const hasNoCompany = computed(() => !conversation.value.company.isActive);
const hasNotFoundPage = computed(() => conversationError.value?.response?.status === 404);
const activeSubNav = ref('message');
const { isMediumScreen } = useBreakpoints();

const detail = ref(null);

const openPageConversations = async () => {
    await router.push({ name: 'page-conversations' });
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.messages);

const removeConversation = async ({ trackingEvent }) => {
    await conversationRemove({ id: conversation.value.id });
    trackClick(`${trackingEvent}-delete`);
    openPageConversations();
};

const navigateBack = () => {
    if (router.currentRoute.meta.referrer.name === null) {
        let route = {
            name: 'page-conversations',
        };

        if (conversation.value.deleted) {
            route = {
                ...route,
                query: { filter: 'deleted' },
            };
        }

        return router.push(route);
    }

    return router.back();
};

watch(conversation, () => {
    if (conversation.value?.read === true) return;

    patchRead({ data: { read: true }, id: conversation.value?.id });
});

watch(conversationPatchDeletedState, () => {
    if (conversationPatchDeletedState.value === STATES.isValidating) {
        showSnackbar({
            text: i18n('message.deleted'),
            icon: 'check',
        });
    }
});

onBeforeRouteLeave((to, from, next) => (detail.value?.customBeforeRouteLeave?.(next) ?? next()));

function showMessageDeleteModal({ trackingEvent }) {
    if (trackingEvent.trackVisibility) {
        trackVisibility({
            element: trackingEvent.element,
        });
    }
    showModal({
        componentName: 'ModalMessageDelete',
        ariaLabel: 'Bist du sicher?',
        componentProps: {
            removeCallback: () => {
                track({
                    element: trackingEvent.element,
                    elementDetail: 'Confirm',
                    ga4Event: true,
                });
                removeConversation({ trackingEvent: trackingEvent.oldTracking });
            },
            cancelCallback: () => {
                track({
                    element: trackingEvent.element,
                    elementDetail: 'Cancel',
                    ga4Event: true,
                });
                trackClick(`${trackingEvent.oldTracking}-cancel`);
            },
        },
    });
}
</script>

<template>
    <Component
        :is="isMediumScreen ? LayoutDefault : LayoutMinimal"
        v-if="!hasNotFoundPage"
        :has-background-gray="isMediumScreen"
        :has-header="isMediumScreen"
        :has-footer="isMediumScreen"
        :is-content-full-height="isMediumScreen"
    >
        <ModalApiError :error="conversationError"/>
        <Component
            :is="isMediumScreen ? LayoutDefaultDetail : 'div'"
            class="c-pageConversationDetail"
        >
            <div
                v-if="conversation"
                class="c-pageConversationDetail__header"
            >
                <AppBrandline/>

                <div class="c-pageConversationDetail__headerTitle">
                    {{ hasNoCompany ? 'Inaktive Firma': conversation.company.name }}
                </div>
                <AppButtonIconOnly
                    icon="cross"
                    size="l"
                    aria-label="Zurück"
                    class="c-pageConversationDetail__backButton"
                    data-qa="close detail"
                    @click.native="navigateBack"
                />
            </div>
            <div class="c-pageConversationDetail__body">
                <div
                    v-if="isConversationStateError"
                    class="c-pageConversationDetail__refreshPrompt"
                >
                    <AppRefreshPrompt
                        data-qa="error conversation detail"
                        :fetch="refetchConversation"
                    />
                </div>
                <AppConversationDetail
                    v-else
                    ref="detail"
                    :conversation="conversation"
                    :messages="(conversation && conversation.messages) || []"
                    :is-conversation-error="isConversationStateError"
                    :is-conversation-success="isConversationStateSuccess"
                    :active-sub-nav="activeSubNav"
                    is-deep-linked
                    :refetch-conversation="refetchConversation"
                    :profile-id="profileId"
                    @click-link-sub-nav="activeSubNav = $event"
                    @remove="showMessageDeleteModal({trackingEvent:$event})"
                    @redirect-after-send="openPageConversations"
                />
            </div>
        </Component>
    </Component>
    <PageNotFound
        v-else
        headline="Wir konnten diese Nachricht nicht finden"
        text="Komisch, da ist was schief gelaufen, tut uns leid!
        Vielleicht findest du sie ja doch bei deinen restlichen Nachrichten?"
        link-text="Zur Nachrichtenübersicht"
        to="page-conversations"
    />
</template>

<style lang="scss">
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/font-size';
@import '../../assets/scss/settings/spacing';

.c-pageConversationDetail {
    $refresh-prompt-padding-top: 3rem;

    &__header {
        display: flex;
        align-items: center;
        padding: $k-spacing--l $k-spacing--m;
        border-bottom: 1px solid $k-color-gray--100;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__headerTitle {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    }

    &__headerTitleStatus {
        margin-left: $k-spacing--s;
    }

    &__detail {
        flex-grow: 1;
    }

    &__refreshPrompt {
        padding-top: $refresh-prompt-padding-top;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
    }

    &__body {
        @media (max-width: $k-breakpoint--m) {
            margin-top: $k-spacing--l;
        }
    }

    &__backButton {
        position: absolute;
        right: $k-spacing--m;
    }
}
</style>
