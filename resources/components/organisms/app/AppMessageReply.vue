<script setup>
import {
    computed,
} from 'vue';

import {
    formatDate,
} from '../../../utils/filter';
import {
    decodeHTML, splitByLinebreaks,
} from '../../../utils/html';
import {
    CATEGORIES, track,
} from '../../../utils/tracking';
import {
    useTrackClick,
} from '../../../composables/track-click';

import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppProfileImage from '../../molecules/app/AppProfileImage';
import FormAttachmentList from '../../molecules/form/FormAttachmentList';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useMessageProperties,
} from '../../../composables/message-properties';

const props = defineProps({
    message: {
        required: true,
        type: Object,
    },
    conversation: {
        required: true,
        type: Object,
    },
    hasNoCompany: {
        type: Boolean,
        default: false,
    },
    isReplyForm: {
        type: Boolean,
        default: false,
    },
});

const {
    isFirstReply,
    isUserMessage,
    isFirstInGroup,
    isMiddleInGroup,
    isLastInGroup,
    isMessageGroup,
} = useMessageProperties(props.message, props.conversation);

const getInitials = computed(() => {
    const fullName = props.conversation.recruiter.name.split(' ');
    const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
});

const hasOnlyBrokenAttachments = computed(() => {
    if (!props.message.attachments || props.message.attachments.length === 0) {
        return false;
    }
    return props.message.attachments.filter(file => file.url).length === 0;
});

const decodedParagraphs = computed(() => splitByLinebreaks(decodeHTML(props.message.body)));

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.messages);

</script>

<template>
    <div
        data-qa="message"
        class="c-appMessageReply"
    >
        <section
            tabindex="0"
            aria-labelledby="nachricht"
            class="c-appMessageReply__wrap"
            :class="{
                'c-appMessageReply__wrap--user': isUserMessage,
            }"
        >
            <slot name="infobox"/>
            <slot/>
            <template v-if="message.body">
                <article
                    tabindex="0"
                    aria-label="nachricht inhalt"
                    class="c-appMessageReply__message"
                    :class="{
                        'c-appMessageReply__message--first': isFirstReply,
                        'c-appMessageReply__message--user': isUserMessage,
                        'c-appMessageReply__message--firstInGroup': isFirstInGroup,
                        'c-appMessageReply__message--lastInGroup': isLastInGroup,
                        'c-appMessageReply__message--middleInGroup': isMiddleInGroup,
                    }"
                    data-qa="full message"
                >
                    <p
                        v-for="(paragraph, index) in decodedParagraphs"
                        :key="index"
                        class="c-appMessageReply__messageParagraph"
                    >
                        {{ paragraph }}
                        <br v-if="paragraph.length === 0">
                    </p>
                    <template v-if="message.job">
                        <div
                            v-if="(message.job.id && message.job.title)"
                            class="c-appMessageReply__jobLink"
                        >
                            <div class="k-c-headline--bold">
                                Links
                            </div>
                            <AppLink
                                target="_blank"
                                :href="`/jobs/${ message.job.id }`"
                                secondary
                            >
                                {{ message.job.title }}
                            </AppLink>
                        </div>
                    </template>
                    <div
                        v-if="message.attachments && message.attachments.length > 0"
                        class="c-appMessageReply__attachments"
                    >
                        <div class="k-c-headline--bold">
                            Anhänge
                        </div>
                        <div
                            v-if="hasOnlyBrokenAttachments"
                            class="c-appMessageReply__attachmentError"
                            data-qa="all broken attachments"
                        >
                            <AppIcon
                                name="circle-exclamationmark"
                                size="l"
                                class="c-appMessageReply__errorIcon"
                            />
                            Anhänge können im Moment nicht geladen werden
                        </div>
                        <FormAttachmentList
                            :files="message.attachments"
                            is-downloadable
                            class="c-appMessageReply__attachmentList"
                            data-qa="file list"
                            @preview="trackClick('message-attachment-preview');
                                      track(
                                          {
                                              element: 'MS_D: Attachment',
                                              elementDetail: 'Preview',
                                              ga4Event: true,
                                          })"
                            @download="trackClick('message-attachment-download');
                                       track(
                                           {
                                               element: 'MS_D: Attachment',
                                               elementDetail: 'Download',
                                               ga4Event: true,
                                           })"
                        />
                    </div>
                    <div class="c-appMessageReply__messageFooter">
                        <span
                            v-if="message.sendDate"
                            class="c-appMessageReply__date"
                            data-qa="send date"
                        >
                            {{ formatDate({format: 'd.m.Y, h:i', date: message.sendDate}) }}
                        </span>
                    </div>
                    <slot name="messageSuffix"/>
                </article>
            </template>
            <div
                v-if="(!isMessageGroup || isLastInGroup) && !isReplyForm"
                tabindex="0"
                class="c-appMessageReply__author"
                :class="{ 'c-appMessageReply__author--user': isUserMessage }"
            >
                <AppProfileImage
                    round-small
                    placeholder-without-effects
                    :name-initials="message.sender.type === 'companyUser' ?
                        (hasNoCompany ? 'placeholder' : getInitials) :
                        (conversation.approved ? null : 'placeholder')"
                    data-qa="profile image"
                    class="c-appMessageReply__image"
                />
                <div class="c-appMessageReply__headline">
                    <div
                        class="c-appMessageReply__headlineTop"
                        :class="{ 'c-appMessageReply__headlineTop--user': isUserMessage }"
                    >
                        <TextHeadline
                            v-if="!isUserMessage"
                            :level="5"
                            bold
                            data-qa="sender"
                            class="c-appMessageReply__senderName"
                        >
                            {{
                                (message.sender.type === 'companyUser' && hasNoCompany) ?
                                    'Inaktive Firma' : message.sender.name
                            }}
                        </TextHeadline>
                    </div>
                    <p
                        v-if="!hasNoCompany && !isUserMessage"
                        class="c-appMessageReply__subheadline"
                        data-qa="company name"
                    >
                        {{ conversation.company.name }}
                    </p>
                </div>
            </div>
            <div
                v-if="$slots.actions"
                class="c-appMessageReply__actions"
            >
                <slot name="actions"/>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/tools/wrap';

.c-appMessageReply {
    $root: &;
    $page-messages-padding: $k-spacing--l;
    $page-messages-background: $k-color-gray--50;
    $separator-height: $k-spacing--s;
    $border-radius: $k-spacing--m;

    width: 100%;

    &__wrap {
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            padding-right: 0;
            padding-left: 0;
        }

        &--user {
            display: flex;
            flex-direction: column;
            align-items: end;
        }
    }

    &__author {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $k-spacing--s;

        &--user {
            flex-direction: row-reverse;
            margin-left: auto;
        }
    }

    &__image {
        flex-shrink: 0;
        width: $k-spacing--2xl;
        height: $k-spacing--2xl;
    }

    &__headlineTop {
        display: flex;
        justify-content: space-between;

        &--company {
            justify-content: end;
        }
    }

    &__headline {
        flex-grow: 1;
        overflow: hidden;
        min-width: 0;
    }

    &__subheadline,
    &__date {
        color: $k-color-gray--400;
    }

    &__subheadline {
        @include k-typo-s;
    }

    &__date {
        display: block;
        margin-right: $k-spacing--m;
        margin-bottom: $k-spacing--s;
        margin-left: auto;
        padding-left: $k-spacing--l;
        @include k-typo-s;
    }

    &__message {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        margin-bottom: $k-spacing--xs;
        margin-left: $k-spacing--l;
        padding-top: $k-spacing--l;
        max-width: 80%;
        border-radius: $border-radius;
        text-align: start;
        background-color: $k-color-gray--50;

        &--user {
            margin-right: $k-spacing--l;
            background-color: $k-color-green--50;
        }

        &--first {
            margin-top: $k-spacing--xl;
        }

        &--firstInGroup {
            border-bottom-left-radius: 0;
        }

        &--firstInGroup#{&}--user {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: $border-radius;
        }

        &--lastInGroup {
            border-top-left-radius: 0;
        }

        &--lastInGroup#{&}--user {
            border-top-left-radius: $border-radius;
            border-top-right-radius: 0;
        }

        &--middleInGroup {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        &--middleInGroup#{&}--user {
            border-radius: $border-radius 0 0 $border-radius;
        }
    }

    &__messageParagraph {
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
        overflow-wrap: break-word;
    }

    &__senderName {
        @include k-typo-s;
    }

    &__messageFooter {
        display: flex;
        justify-content: space-between;
    }

    &__actions {
        margin-top: $k-spacing--xl;
        text-align: end;
    }

    &__jobLink {
        margin-top: $k-spacing--2xl;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
    }

    &__attachments {
        margin-top: $k-spacing--xl;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
    }

    &__attachmentList,
    &__attachmentError {
        margin-top: $k-spacing--s;
    }

    &__attachmentError {
        color: $k-color-gray--500;
    }
}
</style>
