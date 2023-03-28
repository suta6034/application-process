<script setup>
import {
    computed,
} from 'vue';

import {
    useConversationList,
} from '../../../composables/resource-conversation';
import {
    STATES,
} from '../../../composables/resource-endpoint';

import {
    formatDate,
    truncate,
} from '../../../utils/filter';

import AppBadge from '../../atoms/app/AppBadge';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppLink from '../../atoms/app/AppLink';
import AppMessageItem from '../app/AppMessageItem';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import IllustrationEmptyMessage from '../../illustrations/IllustrationEmptyMessage';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useState,
} from '../../../composables/vuex-helpers';

const {
    data: conversations,
    pagination,
    state: conversationsState,
    refetch,
} = useConversationList({ pageSize: 3 });

const isLoading = computed(() => conversationsState.value === STATES.isLoading);
const hasError = computed(() => conversationsState.value === STATES.isError);

const {
    active: profileActive,
} = useState('profile');
</script>

<template>
    <div class="c-cardLatestMessages k-c-card k-c-card--noBorder">
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    Nachrichten
                </TextHeadline>
                <div class="k-o-media__figure">
                    <SkeletonBox
                        v-if="isLoading"
                        width="1.875em"
                        height="1.375em"
                    />
                    <AppBadge
                        v-else
                        data-qa="counter"
                    >
                        {{ pagination ? pagination.total : 0 }}
                    </AppBadge>
                </div>
            </div>
            <AppLink
                v-if="conversations && conversations.length"
                :to="{ name: 'page-conversations' }"
                data-qa="show all link"
                data-gtm-element="DB: Messages"
                data-gtm-element-detail="Show All"
            >
                Alle anzeigen
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="hasError"
                :fetch="refetch"
                data-qa="error state"
            />
            <ul
                v-else-if="isLoading || conversations && conversations.length > 0"
                class="k-o-ladder k-o-ladder--l"
            >
                <template v-if="isLoading">
                    <li
                        v-for="n in 3"
                        :key="n"
                        class="k-o-ladder__rung"
                    >
                        <AppMessageItem/>
                    </li>
                </template>
                <template v-else>
                    <li
                        v-for="conversation in conversations"
                        :key="conversation.id"
                        class="k-o-ladder__rung"
                        data-qa="message"
                    >
                        <AppMessageItem
                            :conversation="conversation"
                            @clicked="$router.push({
                                name: 'page-conversations',
                                params: {
                                    id: conversation.id
                                }
                            })"
                        >
                            <template #headline>
                                {{ truncate(conversation.subject, 60) }}
                            </template>
                            {{ conversation.company.name ? conversation.company.name : 'Inaktive Firma' }}
                            <template #meta-end>
                                <span data-qa="date">
                                    {{ formatDate({ format: 'd.m.Y, h:i', date: conversation.latestSendDate }) }}
                                </span>
                            </template>
                        </AppMessageItem>
                    </li>
                </template>
            </ul>
            <AppCupcake
                v-if="!hasError
                    && !isLoading
                    && (conversations && conversations.length === 0 || !profileActive)
                "
                class="c-cardLatestMessages__emptyState"
            >
                <template
                    v-if="!isLoading && conversations && conversations.length === 0"
                    #cherry
                >
                    <IllustrationEmptyMessage data-qa="empty state illustration"/>
                </template>
                <p
                    v-if="!profileActive && conversations && conversations.length > 0"
                    data-qa="new job offers info"
                >
                    Du möchtest neue Jobangebote von Firmen erhalten?
                    Dann schalte deinen Lebenslauf auf
                    <AppLink :to="{ name: 'page-visibility-form' }">
                        sichtbar!
                    </AppLink>
                </p>
                <p
                    v-else-if="!profileActive"
                    data-qa="no job offers info"
                >
                    Job-Angebote von Firmen sind nur möglich wenn du deinen Lebenslauf
                    <AppLink :to="{ name: 'page-visibility-form' }">
                        sichtbar schaltest.
                    </AppLink>
                </p>
                <p
                    v-else
                    data-qa="get job offers info"
                >
                    Du möchtest gefunden werden und Jobangebote von Firmen erhalten?
                    Dann aktualisiere regelmäßig die Daten deines Lebenslaufs!
                </p>
            </AppCupcake>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-cardLatestMessages {
    &__emptyState {
        &:not(:first-child) {
            margin-top: $k-spacing--xl;
        }
    }
}
</style>
