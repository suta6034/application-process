<script setup>
import {
    computed,
    inject,
} from 'vue';

import {
    CATEGORIES,
} from '../../../utils/tracking';

import {
    useBreakpoints,
} from '../../../composables/breakpoint';

import AppBadge from '../../atoms/app/AppBadge';
import AppLink from '../../atoms/app/AppLink';
import AppMotivationLetterActions from './AppMotivationLetterActions';
import AppSelectableItem from '../../molecules/app/AppSelectableItem';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    motivationLetter: {
        default: null,
        type: Object,
    },
    selected: {
        default: false,
        type: Boolean,
    },
});
const emit = defineEmits(['selected', 'set-as-default', 'remove']);

const router = inject('router');
const isLoading = computed(() => !props.motivationLetter);
const { isMobile } = useBreakpoints();

const motivationLetterRoute = computed(() => ({
    name: 'page-motivation-letter-detail',
    params: {
        id: props.motivationLetter.id,
    },
}));

const handleLinkClick = async (event) => {
    const isNewTabClick = event.metaKey || event.ctrlKey;

    if (!isNewTabClick) event.preventDefault();
    if (isMobile.value) {
        await router.push(motivationLetterRoute.value);
        return;
    }
    emit('selected');
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.motivationLetter);
</script>

<template>
    <AppSelectableItem
        :selected="selected"
        class="c-appMotivationLetterItem"
    >
        <div class="c-appMotivationLetterItem__body k-c-excerpt">
            <SkeletonBox
                v-if="isLoading"
                data-qa="snippet loading skeleton box"
            />
            <template
                v-else
            >
                <div class="c-appMotivationLetterItem__headlineWrapper k-c-excerpt__headline">
                    <TextHeadline
                        class="u-ellipsis"
                        :level="3"
                        size="l"
                        bold
                        data-qa="motivation letter list column"
                    >
                        <AppLink
                            :href="$router.resolve(motivationLetterRoute).href"
                            neutral
                            class="c-appMotivationLetterItem__link"
                            @click="handleLinkClick"
                        >
                            {{ motivationLetter.title || 'Bewerbungsschreiben' }}
                        </AppLink>
                    </TextHeadline>
                    <div
                        v-if="motivationLetter.isDefault"
                        class="c-appMotivationLetterItem__statusWrapper"
                    >
                        <AppBadge
                            small
                            data-qa="status list column"
                        >
                            Standard
                        </AppBadge>
                    </div>
                    <AppMotivationLetterActions
                        :id="motivationLetter.id"
                        :is-default="motivationLetter.isDefault"
                        class="c-appMotivationLetterItem__actions"
                        @open="trackClick('application-letter-open-popover')"
                        @set-as-default="emit('set-as-default')"
                        @remove="emit('remove')"
                    />
                </div>
                <p
                    class="c-appMotivationLetterItem__text k-c-excerpt__snippet"
                >
                    {{ motivationLetter.text }}
                </p>
            </template>
        </div>
    </AppSelectableItem>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appMotivationLetterItem {
    &__headlineWrapper {
        display: flex;
    }

    &__statusWrapper {
        @include k-typo-s;

        margin-right: $k-spacing--s;
        margin-left: $k-spacing--s;
    }

    &__actions {
        margin-left: auto;
    }

    &__text {
        /* stylelint-disable property-no-vendor-prefix, value-no-vendor-prefix */
        display: -webkit-box;
        /* stylelint-enable value-no-vendor-prefix */
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        /* stylelint-enable property-no-vendor-prefix */
    }

    &__link {
        // For best a11y an anchor should not contain all the content of a
        // preview card like the motivation letter item because everything is
        // read out loud to a screen reader user.
        // See: https://www.sarasoueidan.com/blog/nested-links#my-implementation
        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            content: '';
        }
    }
}
</style>
