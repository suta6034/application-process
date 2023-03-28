<script setup>
import {
    computed,
    nextTick,
    ref,
    watch,
} from 'vue';
import {
    maxLength,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    useResourceCache,
} from '../../../composables/resource-cache';
import * as conversationActionService from '../../../services/conversation-action';
import {
    decodeHTML,
} from '../../../utils/html';
import {
    CATEGORIES, track,
} from '../../../utils/tracking';
import {
    validateEmoji,
} from '../../../utils/validators';

import AppActionBox from '../../molecules/app/AppActionBox';
import AppBadge from '../../atoms/app/AppBadge';
import AppButton from '../../atoms/app/AppButton';
import AppButtonGroup from '../../molecules/app/AppButtonGroup';
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppConversationCompany from './AppConversationCompany';
import AppInfoBox from '../../molecules/app/AppInfoBox';
import AppLink from '../../atoms/app/AppLink';
import AppMessageReply from './AppMessageReply';
import FormCheckbox from '../../atoms/form/FormCheckbox';
import FormElement from '../../molecules/form/FormElement';
import FormLabel from '../../atoms/form/FormLabel';
import FormMessage from '../../atoms/form/FormMessage';
import FormTextareaLimited from '../../atoms/form/FormTextareaLimited';
import NavHorizontalOverflow from '../../molecules/nav/NavHorizontalOverflow';
import ModalApiError from '../modal/ModalApiErrorAutoOpen';
import ProgressDots from '../../atoms/progress/ProgressDots';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

import '../../../lang/validation';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import i18n from '../../../utils/i18n';
import {
    useMutations,
} from '../../../composables/vuex-helpers';
import {
    makeDateModel,
} from '../../../utils/date-model';
import {
    formatIsoPhp,
} from '../../../services/conversation';

const MAX_LENGTH_TEXT = 1000;
const TEXTAREA_ROWS = 2;
const TEXTAREA_MAX_ROWS = 6;

const props = defineProps({
    conversation: {
        type: Object,
    },
    messages: {
        type: Array,
    },
    isConversationSuccess: {
        type: Boolean,
        required: true,
    },
    isConversationError: {
        type: Boolean,
        required: true,
    },
    isDeepLinked: {
        type: Boolean,
        default: false,
    },
    activeSubNav: {
        type: String,
        default: 'message',
    },
    refetchConversation: {
        type: Function,
        default: () => {},
    },
    profileId: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['redirect-after-send', 'remove', 'click-link-sub-nav']);

let temporalIdCounter = 0;
const NAV_ITEM = {
    message: { name: 'Nachricht', id: 'message', tag: 'button', trackingName: 'Message' },
    employer: { name: 'Arbeitgeber', id: 'company', tag: 'button', trackingName: 'Company' },
};
const {
    mutatePatch,
} = useResourceCache();

const textAreaForm = ref(null);
const hasMessages = computed(() => Boolean(props.messages?.length));
const hasNoCompany = computed(() => !props.conversation.company.isActive);
const hasFallbackRecruiter = computed(() => props.conversation.recruiterFallback?.name);
const isInitialMessage = computed(() => props.messages.length === 1 && !props.conversation.rejected);

const sendActionError = ref(null);
const isSendActionLoading = ref(false);

const dirty = ref(false);
const markAsDirty = (value = true) => {
    dirty.value = value;
};
const isCheckboxApproved = ref(false);
const isReplyFormVisible = ref(false);

const replyMessage = ref('');
const rejectMessage = ref('');

const isJustRejected = computed(() => props.messages[props.messages.length - 1]
    ?.body?.includes(props.profileId));

const isFirstFallbackConversation = computed(() => props.conversation.replied
    && props.messages.length === 1);

const isSendButtonDisabled = computed(() => !dirty.value || !replyMessage.value);

const replyFormElement = ref(null);
const toggleReplyForm = async () => {
    isReplyFormVisible.value = !isReplyFormVisible.value;

    //  scroll focus + cursor focus on the text area
    await nextTick();
    replyFormElement.value?.$el?.scrollIntoView();
    textAreaForm.value?.$refs.textarea.focus();
};

const fetchAndDisplayConversation = async () => {
    await props.refetchConversation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearMessageForm = () => {
    dirty.value = false;
    isCheckboxApproved.value = false;
    replyMessage.value = '';
};

const send = async ({ type, reason = { preDefinedMessage: '' }, customRejectionReason = '' }) => {
    isSendActionLoading.value = true;

    if (type === 'reject') {
        rejectMessage.value = `Guten Tag!

            Ihre Wunschkandidat*in ID ${props.profileId} hat Ihre Anfrage erhalten${customRejectionReason === ''
    ? `. ${reason.preDefinedMessage}`
    : ` und diese mit folgender Begründung abgelehnt:
    ${customRejectionReason}`}

                Freundliche Grüße
                Ihr karriere.at Team`;
    }

    if (!hasFallbackRecruiter.value) {
        temporalIdCounter += 1;

        mutatePatch({
            type: 'conversation',
            id: props.conversation.id,
            data: {
                replied: true,
                fallback: false,
                approved: props.conversation.approved ? true : !!isCheckboxApproved.value,
                rejected: type === 'reject' ? true : props.conversation.rejected,
                messages: [
                    ...props.messages,
                    {
                        type: 'message',
                        subject: null,
                        sendDate: makeDateModel().format(formatIsoPhp),
                        recipient: {
                            type: 'companyUser',
                            id: null,
                            name: null,
                        },
                        job: {
                            type: 'job',
                            id: null,
                            showDate: makeDateModel().format(formatIsoPhp),
                            isActive: false,
                            title: null,
                        },
                        attachments: [],
                        id: `temporal id ${temporalIdCounter}`,
                        body: type === 'reply'
                            ? replyMessage.value
                            : rejectMessage.value,
                        sender: {
                            type: 'user',
                            id: null,
                            name: props.messages[0].sender.type === 'user'
                                ? props.messages[0].sender.name
                                : props.messages[0].recipient.name,
                        },
                    },
                ],
            },
        });
    }

    let rejectData = {
        fallback: !!hasFallbackRecruiter.value,
        reason: reason.key,
        recipient: hasFallbackRecruiter.value
            ? props.conversation.recruiterFallback.id
            : props.conversation.recruiter.id,
    };
    if (reason.key === 'other-reason' && customRejectionReason) {
        rejectData = {
            ...rejectData,
            comment: customRejectionReason,
        };
    }

    const replyData = {
        approved: props.conversation.approved ? true : !!isCheckboxApproved.value,
        fallback: !!hasFallbackRecruiter.value,
        body: replyMessage.value,
        recipient: hasFallbackRecruiter.value
            ? props.conversation.recruiterFallback.id
            : props.conversation.recruiter.id,
    };

    try {
        const response = await conversationActionService.send({
            conversationId: props.conversation.id,
            data: type === 'reply' ? replyData : rejectData,
            type,
        });
        if (response.meta.success === true) {
            showSnackbar({
                text: i18n(props.conversation.deleted ? 'message.sentFromTrash' : 'message.sent'),
            });
        } else if (response.errors) throw Error(response.errors[0].meta.title);
    } catch (err) {
        sendActionError.value = err;
    } finally {
        isSendActionLoading.value = false;
        clearMessageForm();
        if (hasFallbackRecruiter.value || props.conversation.deleted) {
            emit('redirect-after-send');
        }
    }
};

watch(sendActionError, () => fetchAndDisplayConversation());

watch(() => props.messages, () => {
    if (props.conversation && props.messages) {
        isReplyFormVisible.value = isFirstFallbackConversation.value
            || (!isJustRejected.value && props.conversation.replied === true);
    }
}, {
    immediate: true,
});

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.messages);

/* istanbul ignore next */
const trackSubNav = (subNavId) => {
    if (subNavId === NAV_ITEM.message.id) {
        track({
            element: 'MS_D: Tab',
            elementDetail: 'Message',
            ga4Event: true,
        });
        trackClick('message-tab');
    }
    if (subNavId === NAV_ITEM.employer.id) {
        track({
            element: 'MS_D: Tab',
            elementDetail: 'Employer',
            ga4Event: true,
        });
        trackClick('employer-tab');
    }
};

function changeContactDataCheckbox() {
    isCheckboxApproved.value = !isCheckboxApproved.value;
    if (isCheckboxApproved.value) {
        trackClick('message-reply-show-profile-enable');
        track({
            element: 'MS_D: Visibility Profile Data',
            elementDetail: 'Shown',
            ga4Event: true,
        });
    } else {
        trackClick('message-reply-show-profile-disable');
        track({
            element: 'MS_D: Visibility Profile Data',
            elementDetail: 'Hidden',
            ga4Event: true,
        });
    }
}

const validations = {
    replyMessage: {
        characters: validateEmoji,
        maxLength: maxLength(MAX_LENGTH_TEXT),
    },
};

const v$ = useVuelidate(validations, { replyMessage });

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

function showNotInterestedModal() {
    showModal({
        componentName: 'ModalNotInterestedReason',
        ariaLabel: 'Warum bist du nicht interessiert?',
        componentProps: {
            sendCallback: options => send(options),
        },
    });
}

function showUnsentMessageModal(componentProps) {
    showModal({
        componentName: 'ModalMessageUnsent',
        ariaLabel: 'Bist du sicher?',
        componentProps,
    });
}

/* istanbul ignore next */
async function customBeforeRouteLeave(next) {
    if (dirty.value && replyMessage.value) {
        await showUnsentMessageModal({ resetCallback: () => next() });
    } else next();
}

function resetCallback() {
    clearMessageForm();
    v$.value.$reset();
}

watch(() => props.messages, resetCallback, { immediate: true });

defineExpose({ customBeforeRouteLeave });
</script>

<template>
    <div
        class="c-appConversationDetail"
        :class="{
            'c-appConversationDetail--isDeepLinked': isDeepLinked,
        }"
    >
        <ModalApiError
            v-if="sendActionError"
            :error="sendActionError"
        />
        <SkeletonBox
            v-if="!conversation"
            class="c-appConversationDetail__skeleton"
            data-qa="loading"
        />
        <div
            v-else-if="conversation"
            class="c-appConversationDetail__topHeadline"
        >
            <TextHeadline
                :level="2"
                size="xl"
                class="c-appConversationDetail__topHeadlineText"
                data-qa="conversation subject"
            >
                {{ decodeHTML(conversation.subject) }}
            </TextHeadline>
            <AppButtonIconOnly
                v-if="!conversation.deleted"
                class="c-appConversationDetail__topHeadlineIcon"
                aria-label="Löschen des Gesprächsverlaufs"
                icon="dustbin"
                size="l"
                data-qa="delete button"
                data-gtm-element="MS_D: Delete"
                data-gtm-element-detail="Click"
                @click.native="
                    emit('remove', {
                        oldTracking: 'message-delete-inactive-company',
                        element: 'MS_D: Delete - Inactive Company',
                        trackVisibility: true,
                    });
                    trackClick('message-delete-detail');
                "
            />
        </div>
        <SkeletonBox
            v-if="!conversation"
            class="c-appConversationDetail__skeleton k-c-excerpt__metaEnd"
        />
        <div
            v-else-if="conversation"
            class="c-appConversationDetail__topSubheadline"
        >
            <template v-if="hasNoCompany">
                <AppBadge
                    class="c-appConversationDetail__badge"
                    condensed
                    gray
                    data-qa="inactive badge"
                >
                    Inaktive Firma
                </AppBadge>
            </template>
            <template v-else>
                <ul
                    class="c-appConversationDetail__topSubheadlineList k-o-chain"
                    data-qa="company info"
                >
                    <li class="c-appConversationDetail__topSubheadlineItem k-o-chain__link">
                        {{ conversation.recruiter.name }}
                    </li>
                    <li class="c-appConversationDetail__topSubheadlineItem k-o-chain__link">
<!--
                        -->{{ conversation.company.name }}<!--
                    -->
                    </li>
                </ul>
            </template>
        </div>
        <NavHorizontalOverflow
            is-splitview-tab-nav
            :is-loading="!conversation"
            :items="[
                NAV_ITEM.message,
                NAV_ITEM.employer,
            ]"
            :active-item="activeSubNav"
            class="c-appConversationDetail__nav"
            data-qa="navigation"
            @click-link="emit('click-link-sub-nav', $event);trackSubNav($event)"
        />
        <div
            class="c-appConversationDetail__main"
            data-qa="main"
        >
            <template v-if="activeSubNav === 'message'">
                <ProgressDots
                    v-if="!isConversationSuccess && !hasMessages"
                    class="c-appConversationDetail__loading"
                />
                <template v-else>
                    <div
                        v-if="hasNoCompany || (
                            hasFallbackRecruiter
                            && messages.length === 1
                            && !isReplyFormVisible
                        )"
                        class="c-appConversationDetail__infoboxWrap"
                    >
                        <AppInfoBox
                            v-if="hasNoCompany"
                            warning
                            data-qa="company inactive infobox"
                        >
                            {{ `Diese Firma ist auf karriere.at
    leider nicht mehr aktiv${isInitialMessage ? '.'
                            : ' und kann keine Nachrichten mehr empfangen.'}` }}
                            <AppLink
                                v-if="isInitialMessage && !conversation.deleted"
                                tag="span"
                                neutral
                                underline
                                data-gtm-element="MS_D: Delete - Inactive Company"
                                data-gtm-element-detail="Click"
                                @click.native="
                                    emit('remove', {
                                        oldTracking: 'message-delete-inactive-company',
                                        element: 'MS_D: Delete - Inactive Company',
                                    });
                                    trackClick('message-delete-inactive-company');
                                "
                            >
                                <strong>
                                    Nachricht löschen
                                </strong>
                            </AppLink>
                        </AppInfoBox>
                        <AppInfoBox
                            v-else
                            warning
                            data-qa="recruiter inactive infobox"
                        >
                            {{ `${conversation.recruiter.name} arbeitet nicht mehr bei
${conversation.company.name}. Deine Nachrichten werden daher stellvertretend an
${conversation.recruiterFallback.name} weitergeleitet – dein bisheriger
Nachrichtenverlauf wird dabei nicht weitergegeben.` }}
                        </AppInfoBox>
                    </div>
                    <AppMessageReply
                        v-if="!conversation.replied && messages.length === 1"
                        :conversation="conversation"
                        :message="messages[0]"
                        :has-no-company="hasNoCompany"
                    >
                        <template
                            v-if="!isReplyFormVisible"
                            #actions
                        >
                            <AppButtonGroup variant="right">
                                <AppButton
                                    data-qa="send answer button"
                                    :disabled="hasNoCompany"
                                    data-gtm-element="MS_D: Reply"
                                    data-gtm-element-detail="Click"
                                    @click="
                                        toggleReplyForm();
                                        trackClick('message-reply-answer');
                                    "
                                >
                                    Antwort schreiben
                                </AppButton>
                                <template #secondary>
                                    <AppButton
                                        outline
                                        data-qa="not interested button"
                                        :disabled="hasNoCompany"
                                        data-gtm-element="MS_D: Reply"
                                        data-gtm-element-detail="Click"
                                        @click="
                                            showNotInterestedModal();
                                            trackClick('message-reply-not-interested');
                                        "
                                    >
                                        Nicht interessiert
                                    </AppButton>
                                </template>
                            </AppButtonGroup>
                        </template>
                    </AppMessageReply>
                    <AppMessageReply
                        v-if="isFirstFallbackConversation"
                        :conversation="conversation"
                        :message="messages[0]"
                        :has-no-company="hasNoCompany"
                    />
                    <template
                        v-if="messages.length > 1"
                    >
                        <AppMessageReply
                            v-for="(message, index) in messages"
                            :key="message.id"
                            :message="message"
                            :conversation="conversation"
                            :has-no-company="hasNoCompany"
                        >
                            <template
                                v-if="!isReplyFormVisible
                                    && index === messages.length - 1
                                    && !conversation.replied
                                    && !hasNoCompany"
                                #actions
                            >
                                <template v-if="conversation.rejected">
                                    <AppActionBox class="c-appConversationDetail__rejectedInfobox">
                                        <template #header>
                                            {{ `Wenn du es dir doch anders überlegt hast, kannst du der Firma
                                            ${conversation.company.name} jederzeit doch noch antworten.` }}
                                        </template>
                                        <AppButtonGroup
                                            variant="left"
                                            class="c-appConversationDetail__rejectedSendButtons"
                                        >
                                            <AppButton
                                                data-qa="send answer button"
                                                data-gtm-element="MS_D: Reply"
                                                data-gtm-element-detail="Click"
                                                @click="
                                                    toggleReplyForm();
                                                    trackClick('message-reply-to-rejected');
                                                "
                                            >
                                                Nachricht schreiben
                                            </AppButton>
                                            <template #secondary>
                                                <AppButton
                                                    outline
                                                    data-qa="not interested button"
                                                    @click="
                                                        showNotInterestedModal();
                                                        trackClick('message-reply-not-interested');
                                                    "
                                                >
                                                    Nicht interessiert
                                                </AppButton>
                                            </template>
                                        </AppButtonGroup>
                                    </AppActionBox>
                                </template>
                                <template v-else>
                                    <AppButtonGroup variant="right">
                                        <AppButton
                                            data-qa="send answer button"
                                            @click="
                                                toggleReplyForm();
                                                trackClick('message-reply-answer');
                                            "
                                        >
                                            Nachricht schreiben
                                        </AppButton>
                                        <template #secondary>
                                            <AppButton
                                                outline
                                                data-qa="not interested button"
                                                @click="
                                                    showNotInterestedModal();
                                                    trackClick('message-reply-not-interested');
                                                "
                                            >
                                                Nicht interessiert
                                            </AppButton>
                                        </template>
                                    </AppButtonGroup>
                                </template>
                            </template>
                            <template
                                v-if="conversation.rejected
                                    && !isReplyFormVisible
                                    && index === messages.length - 1
                                    && conversation.replied
                                    && isJustRejected"
                                #messageSuffix
                            >
                                <AppActionBox
                                    v-if="!hasNoCompany"
                                    class="c-appConversationDetail__rejectedInfobox"
                                    data-qa="rejected infobox"
                                >
                                    <template #header>
                                        {{ `Wenn du es dir doch anders überlegt hast, kannst du der Firma
                                            ${conversation.company.name} jederzeit doch noch antworten.` }}
                                    </template>
                                    <AppButton
                                        class="c-appConversationDetail__rejectedSendButton"
                                        data-qa="send answer after rejection button"
                                        :disabled="hasNoCompany"
                                        data-gtm-element="MS_D: Reply"
                                        data-gtm-element-detail="Click"
                                        @click="
                                            toggleReplyForm();
                                            trackClick('message-reply-reversal');
                                        "
                                    >
                                        Nachricht schreiben
                                    </AppButton>
                                </AppActionBox>
                            </template>
                        </AppMessageReply>
                    </template>
                    <AppMessageReply
                        v-if="messages[0] && isReplyFormVisible && !hasNoCompany"
                        :message="{ sender : {
                            name: messages[0].sender.type === 'user'
                                ? messages[0].sender.name : messages[0].recipient.name,
                            type: messages[0].sender.type === 'user'
                                ? messages[0].sender.type : messages[0].recipient.type,
                        }}"
                        :conversation="conversation"
                        :is-reply-form="true"
                        data-qa="message reply form"
                    >
                        <template #infobox>
                            <div
                                v-if="hasFallbackRecruiter"
                                class="c-appConversationDetail__inactiveUserInfobox"
                            >
                                <AppInfoBox
                                    warning
                                    data-qa="recruiter inactive infobox reply form"
                                >
                                    {{ `${conversation.recruiter.name} arbeitet nicht mehr bei
                                        ${conversation.company.name}. Deine Nachrichten werden daher stellvertretend an
                                        ${conversation.recruiterFallback.name} weitergeleitet –
                                        dein bisheriger Nachrichtenverlauf wird dabei nicht weitergegeben.` }}
                                </AppInfoBox>
                            </div>
                        </template>
                        <FormElement
                            ref="replyFormElement"
                            class="c-appConversationDetail__replyText"
                        >
                            <template #start>
                                <FormLabel for="reply text">
                                    Nachricht
                                </FormLabel>
                            </template>
                            <FormTextareaLimited
                                id="reply text"
                                ref="textAreaForm"
                                v-model="replyMessage"
                                :maxlength="MAX_LENGTH_TEXT"
                                :rows="TEXTAREA_ROWS"
                                :status="v$.replyMessage.$error ? 'error' : ''"
                                :max-rows="TEXTAREA_MAX_ROWS"
                                validation-indicator="text"
                                placeholder="Dies ist deine Nachricht"
                                data-qa="textarea"
                                @input="v$.replyMessage.$touch(); markAsDirty()"
                            />
                            <template #end>
                                <FormMessage
                                    v-if="v$.replyMessage.$error"
                                    type="error"
                                >
                                    <li v-if="!v$.replyMessage.maxLength">
                                        {{ $t('validation.maxLength', { n: MAX_LENGTH_TEXT }) }}
                                    </li>
                                    <li v-if="!v$.replyMessage.characters">
                                        {{ $t('validation.characters') }}
                                    </li>
                                </FormMessage>
                            </template>
                        </FormElement>
                        <AppActionBox
                            v-if="!conversation.approved"
                            class="c-appConversationDetail__share"
                        >
                            <FormElement>
                                <FormCheckbox
                                    :checked="isCheckboxApproved"
                                    data-qa="contact data checkbox"
                                    @change="changeContactDataCheckbox"
                                >
                                    Persönliche Informationen, Dokumente und Namen deiner bisherigen
                                    Arbeitgeber freigeben
                                </FormCheckbox>
                            </FormElement>
                            <div class="c-appConversationDetail__shareInfo">
                                <p>
                                    Wenn du deiner Ansprechperson mehr von dir Preis gibst, kann sie sich ein
                                    besseres Bild von dir machen und leichter direkt mit dir in Kontakt treten.
                                    Bitte beachte: Die Daten werden dann unabhängig von karriere.at vom
                                    Unternehmen verarbeitet. Willst du beispielsweise, dass deine Daten dann
                                    gelöscht werden, musst du dich direkt ans Unternehmen wenden.
                                </p>
                            </div>
                        </AppActionBox>
                        <template #actions>
                            <AppButtonGroup variant="right">
                                <AppButton
                                    :disabled="isSendButtonDisabled || isSendActionLoading || v$.replyMessage.$error"
                                    data-qa="send button"
                                    class="c-appConversationDetail__submitButton"
                                    data-gtm-element="MS_D: Reply"
                                    :data-gtm-element-detail="hasFallbackRecruiter
                                        ? 'Click'
                                        : 'Send Message'"
                                    @click="
                                        send({type: 'reply'});
                                        hasFallbackRecruiter
                                            ? trackClick('message-reply-fallback-recruiter')
                                            : trackClick('message-reply-send-message')
                                        ;
                                    "
                                >
                                    Nachricht senden
                                </AppButton>
                            </AppButtonGroup>
                        </template>
                    </AppMessageReply>
                </template>
            </template>
            <section
                v-if="activeSubNav === 'company'"
                class="c-appConversationDetail__mainSection"
                :class="{'c-appConversationDetail__mainSection--empty': hasNoCompany}"
            >
                <AppConversationCompany
                    class="c-appConversationDetail__company"
                    :conversation="conversation"
                    :has-no-company="hasNoCompany"
                />
            </section>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/typo';

// 1. Change font-size according to the design drafts for mobile screens.
// 2. Reset the font-size to their original value on desktop (result of the inconsistent
//    mobile-first approach).
// 3. We need to compensate the spacing of main, so it is subtracted from the desired spacing for mainSidebar.
.c-appConversationDetail {
    $root: &;
    $empty-company-illustration-width: 100px;
    $loading-dots-padding-top: 8rem;

    display: flex;
    flex-direction: column;
    height: 100%;

    &--isDeepLinked {
        #{$root}__skeleton {
            margin-right: $k-spacing--l;
            margin-left: $k-spacing--l;

            @media (min-width: $k-breakpoint--m) {
                margin-right: 0;
                margin-left: 0;
            }
        }

        #{$root}__topHeadline,
        #{$root}__topSubheadline {
            padding-right: $k-spacing--l;
            padding-left: $k-spacing--l;

            @media (min-width: $k-breakpoint--m) {
                padding-right: 0;
                padding-left: 0;
            }
        }
    }

    &__topActions {
        display: none;
        margin-left: $k-spacing--xl;

        @media (min-width: $k-breakpoint--m) {
            display: inline-block;
        }
    }

    &__topHeadline {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__topHeadlineText {
        font-weight: bold;
        @include k-typo-l; // 1.

        @media (min-width: $k-breakpoint--m) {
            font-weight: normal;
            @include k-typo-xl; // 2.
        }
    }

    &__topHeadlineIcon {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
        }
    }

    &__topSubheadline {
        display: flex;
        align-items: center;
        margin-top: $k-spacing--2xs;
    }

    &__topSubheadlineList {
        display: inline-flex;
        flex-wrap: nowrap;
        overflow: hidden;
        white-space: nowrap;
    }

    &__topSubheadlineItem {
        color: $k-color-gray--500;

        &:not(:first-child) {
            @media (min-width: $k-breakpoint--m) {
                display: flex;
            }
        }

        &:first-child::before {
            display: none;
            margin-left: 0;
        }

        &:last-child {
            display: inline-block;
            overflow: hidden;
            margin-right: $k-spacing--s;
            text-overflow: ellipsis;
        }
    }

    &__nav {
        margin-top: $k-spacing--m;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--xl;
        }
    }

    &__main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        margin-bottom: $k-spacing--4xl;
    }

    &__mainSection {
        display: flex;
        flex-direction: column;

        @media (min-width: $k-breakpoint--m) {
            @include wrap(math.div(10, 12), $k-spacing--3xl);

            margin-right: auto;
            margin-left: auto;
            width: 100%;
        }

        &--empty {
            padding-top: $k-spacing--4xl;
            padding-bottom: $k-spacing--4xl;
        }
    }

    &__company {
        margin-top: $k-spacing--2xl;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--3xl;
            padding-right: $k-spacing--3xl;
            padding-left: $k-spacing--3xl;
        }
    }

    &__loading {
        margin: auto;
        padding-top: $loading-dots-padding-top;
    }

    &__replyText {
        margin-top: $k-spacing--xl;
    }

    &__share {
        margin-top: $k-spacing--l;
    }

    &__shareInfo {
        margin-top: $k-spacing--xs;
        margin-left: $k-spacing--l + $k-spacing--s;
        color: $k-color-gray--800;
    }

    &__badge {
        margin-top: $k-spacing--xs;
    }

    &__button {
        display: flex;
        margin-top: $k-spacing--l;
    }

    &__infoboxWrap {
        @include wrap(math.div(10, 12), $k-spacing--3xl);

        margin-top: $k-spacing--2xl;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--3xl;
            padding-right: $k-spacing--3xl;
            padding-left: $k-spacing--3xl;
        }
    }

    &__inactiveUserInfobox {
        margin-top: $k-spacing--2xl;
        margin-bottom: $k-spacing--2xl;
    }

    &__rejectedInfobox {
        margin: $k-spacing--2xl $k-spacing--xl $k-spacing--xl;
        border-radius: $k-spacing--s;
        background-color: $k-color-green--100;
    }

    &__rejectedSendButton,
    &__rejectedSendButtons {
        margin-top: $k-spacing--l;
    }

    &__rejectedSendButtons {
        @media (min-width: $k-breakpoint--m) {
            flex-direction: row-reverse;
        }
    }
}
</style>
