<script setup>
import {
    computed,
    inject,
} from 'vue';

import {
    useBreakpoints,
} from '../../../composables/breakpoint';
import {
    formatDate,
} from '../../../utils/filter';
import {
    decodeHTML,
} from '../../../utils/html';
import {
    trackPageView,
    trackSubContentGroup,
    CATEGORIES,
} from '../../../utils/tracking';

import AppBadge from '../../atoms/app/AppBadge';
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppSelectableItem from '../../molecules/app/AppSelectableItem';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    to: {
        type: Object,
    },
    isDeletable: {
        default: true,
        type: Boolean,
    },
    conversation: {
        default: null,
        type: Object,
    },
    isSelected: {
        default: false,
        type: Boolean,
    },
});
const emit = defineEmits(['selected', 'remove']);

const router = inject('router');
const isLoading = computed(() => !props.conversation);
const { isMobile } = useBreakpoints();

const messageRoute = computed(() => ({
    name: 'page-conversation-detail',
    params: {
        id: props.conversation.id,
    },
}));

const handleLinkClick = async (event) => {
    const isNewTabClick = event.metaKey || event.ctrlKey;

    if (!isNewTabClick) event.preventDefault();

    // $router.resolve does not give 'from' referrer in meta thus, :href in appLink serves only for desktop
    // as the deeplink page gets open as a new page.
    // But for mobile, 'from' referrer is important to know to redirect correctly by clicking back button.
    // So router push is here being used.
    if (isMobile.value) {
        await router.push(messageRoute.value);
        return;
    }

    trackSubContentGroup('Detail');
    trackPageView(`/profil/nachrichten/${props.conversation.id}`);

    emit('selected', event);
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.messages);
</script>

<template>
    <AppSelectableItem
        class="c-appConversationItem"
        :selected="isSelected"
    >
        <div class="k-o-media">
            <div class="k-o-media__figure">
                <template v-if="!isLoading">
                    <AppIcon
                        v-if="conversation.replied"
                        name="arrow-back"
                        :class="{ 'c-appConversationItem__status--inactive': conversation.read
                            || conversation.replied }"
                        data-qa="replied icon"
                        fixed-width
                        class="c-appConversationItem__status"
                    />
                    <div
                        v-else
                        class="c-appConversationItem__status c-appConversationItem__status--noReply"
                    />
                </template>
            </div>
            <div class="k-o-media__body c-appConversationItem__body">
                <div class="k-c-excerpt">
                    <div class="c-appConversationItem__headlineWrapper k-c-excerpt__headline">
                        <SkeletonBox
                            v-if="isLoading"
                            data-qa="headline loading skeleton box"
                        />
                        <template v-else>
                            <TextHeadline
                                :level="3"
                                size="l"
                                link
                                :bold="!conversation.read"
                                class="c-appConversationItem__headline u-word-break"
                                data-qa="headline"
                            >
                                <AppLink
                                    :href="$router.resolve(messageRoute).href"
                                    neutral
                                    class="c-appConversationItem__link"
                                    data-qa="conversation subject link"
                                    @click.native="handleLinkClick($event)"
                                >
                                    {{ decodeHTML(conversation.subject) }}
                                </AppLink>
                            </TextHeadline>
                            <AppButtonIconOnly
                                v-if="isDeletable"
                                icon="dustbin"
                                size="l"
                                aria-label="Löschen des Gesprächsverlaufs"
                                class="c-appConversationItem__delete"
                                data-qa="delete button"
                                data-gtm-element="MS_L: Delete"
                                data-gtm-element-detail="Click"
                                @click.native="
                                    emit('remove','messages-delete-message');
                                    trackClick('messages-delete-message');
                                "
                            />
                        </template>
                    </div>
                    <div
                        class="k-c-excerpt__snippet"
                        data-qa="snippet"
                    >
                        <SkeletonBox
                            v-if="isLoading"
                            data-qa="snippet loading skeleton box"
                        />
                        <AppBadge
                            v-else-if="!conversation.company.isActive"
                            class="c-appConversationItem__badge"
                            condensed
                            gray
                            data-qa="inactive badge"
                        >
                            inaktive firma
                        </AppBadge>
                        <div
                            v-else
                            class="u-ellipsis"
                            data-qa="company info"
                        >
                            <span class="c-appConversationItem__recipient">{{ conversation.recruiter.name }}</span>
                            <span class="c-appConversationItem__recipient">{{ conversation.company.name }}</span>
                        </div>
                    </div>
                    <div
                        class="k-c-excerpt__metaEnd"
                        data-qa="latest send date"
                    >
                        <SkeletonBox
                            v-if="isLoading"
                            data-qa="skeleton box"
                        />
                        <span v-else>
                            {{ formatDate({ format: 'd.m.Y, h:i', date: conversation.latestSendDate }) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </AppSelectableItem>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appConversationItem {
    &__body:last-child {
        margin-left: $k-spacing--s;
    }

    &__link {
        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            content: '';
        }
    }

    &__status {
        color: $k-color-primary;

        &--inactive {
            color: $k-color-gray--300;
        }

        &--noReply {
            width: $k-spacing--l;
            height: $k-spacing--l;
        }
    }

    &__headlineWrapper {
        display: flex;
        justify-content: space-between;
    }

    &__headline {
        /* stylelint-disable property-no-vendor-prefix, value-no-vendor-prefix */
        display: -webkit-box;
        /* stylelint-enable value-no-vendor-prefix */
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        /* stylelint-enable property-no-vendor-prefix */
    }

    &__delete {
        z-index: 1;
    }

    &__recipient {
        &:not(:first-child) {
            &::before {
                content: '・';
            }
        }
    }

    &__badge {
        margin-bottom: $k-spacing--xs;
    }
}
</style>
