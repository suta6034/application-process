<script setup>
import {
    computed,
    inject,
} from 'vue';
import {
    useBreakpoints,
} from '../../../composables/breakpoint';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

const props = defineProps({
    conversation: {
        default: null,
        type: Object,
    },
    to: {
        type: Object,
    },
});
const emit = defineEmits(['clicked']);

const router = inject('router');
const isLoading = computed(() => !props.conversation);
const messageRoute = computed(() => ({
    name: 'page-conversation-detail',
    params: {
        id: props.conversation.id,
    },
}));

const { isMobile } = useBreakpoints();
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
    emit('clicked', event);
};
</script>

<template>
    <div
        class="c-appMessageItem k-o-media k-o-media--s u-partial-hover-parent"
    >
        <div class="k-o-media__figure">
            <AppIcon
                :name="conversation && conversation.replied ? 'arrow-back' : 'dot'"
                :class="{ 'c-appMessageItem__status--inactive':
                    isLoading || conversation.read || conversation.replied }"
                :data-qa="`${conversation && conversation.replied ? 'replied' : 'dot'} icon`"
                fixed-width
                class="c-appMessageItem__status"
            />
        </div>
        <div class="k-o-media__body">
            <div class="k-c-excerpt">
                <TextHeadline
                    :level="3"
                    size="l"
                    class="k-c-excerpt__headline u-partial-hover-child"
                    bold
                    data-qa="headline"
                >
                    <SkeletonBox
                        v-if="isLoading"
                        :min-width="50"
                        :max-width="70"
                        data-qa="skeleton box"
                    />
                    <AppLink
                        v-else
                        :href="$router.resolve(messageRoute).href"
                        neutral
                        class="c-appMessageItem__link"
                        data-qa="conversation subject link"
                        data-gtm-element="DB: Messages"
                        data-gtm-element-detail="Open Detail"
                        @click.native="handleLinkClick"
                    >
                        <slot
                            name="headline"
                        />
                    </AppLink>
                </TextHeadline>
                <div
                    class="k-c-excerpt__snippet"
                    data-qa="snippet"
                >
                    <SkeletonBox
                        v-if="isLoading"
                        data-qa="skeleton box"
                    />
                    <slot v-else/>
                </div>
                <div class="k-c-excerpt__metaEnd">
                    <SkeletonBox
                        v-if="isLoading"
                        data-qa="skeleton box"
                    />
                    <slot
                        v-else
                        name="meta-end"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/utilities/anchor-block-overlay';

.c-appMessageItem {
    position: relative;

    &__status {
        color: $k-color-primary;

        &--inactive {
            color: $k-color-gray--300;
        }
    }

    &__link {
        @include anchor-block-overlay;
    }
}
</style>
