<script setup>
import {
    computed,
} from 'vue';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../utils/tracking';

import AppBadge from '../../atoms/app/AppBadge';
import AppButton from '../../atoms/app/AppButton';
import AppMotivationLetterActions from './AppMotivationLetterActions';
import ProgressDots from '../../atoms/progress/ProgressDots';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    splitByLinebreaks,
} from '../../../utils/html';

const emit = defineEmits(['set-as-default', 'remove']);

const props = defineProps({
    motivationLetter: {
        type: Object,
    },
});

const paragraphs = computed(() => splitByLinebreaks(props.motivationLetter.text));

function trackClick(action) {
    track({
        category: CATEGORIES.page.motivationLetter,
        action: ACTIONS.clickWithName(action),
        label: LABELS.click,
    });
}
</script>

<template>
    <div class="c-appMotivationLetterDetail">
        <div
            v-if="!motivationLetter"
            class="c-appMotivationLetterDetail__loading"
        >
            <ProgressDots data-qa="loading animation"/>
        </div>
        <template v-else>
            <div class="c-appMotivationLetterDetail__header">
                <TextHeadline
                    :level="2"
                    size="xl"
                    class="u-ellipsis"
                    data-qa="motivation letter title"
                >
                    {{ motivationLetter.title || 'Bewerbungsschreiben' }}
                </TextHeadline>
                <div class="c-appMotivationLetterDetail__statusWrapper">
                    <AppBadge
                        v-if="motivationLetter.isDefault"
                        small
                        data-qa="status detail column"
                    >
                        Standard
                    </AppBadge>
                </div>
                <div class="c-appMotivationLetterDetail__actionsWrapper">
                    <AppButton
                        size="s"
                        :to="{
                            name: 'page-motivation-letter-edit',
                            params: { id: motivationLetter.id },
                        }"
                        outline
                        data-qa="main edit button"
                        @click.native="trackClick('application-letter-edit-template-detail')"
                    >
                        Bearbeiten
                    </AppButton>
                    <AppMotivationLetterActions
                        :id="motivationLetter.id"
                        :is-default="motivationLetter.isDefault"
                        class="c-appMotivationLetterDetail__actions"
                        @open="trackClick('application-letter-open-popover-detail')"
                        @set-as-default="emit('set-as-default')"
                        @remove="emit('remove')"
                        @click="trackClick('application-letter-open-popover')"
                    />
                </div>
            </div>
            <div
                class="c-appMotivationLetterDetail__text"
                data-qa="motivation letter text"
            >
                <p
                    v-for="(paragraph, index) in paragraphs"
                    :key="index"
                >
                    {{ paragraph }}
                    <br v-if="paragraph.length === 0">
                </p>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/tools/wrap';

.c-appMotivationLetterDetail {
    height: 100%;

    &__loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    &__header {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
            align-items: center;
            padding-bottom: $k-spacing--l;
            border-bottom: 1px solid $k-color-gray--200;
        }
    }

    &__statusWrapper {
        @include k-typo-s;

        margin-right: $k-spacing--m;
        margin-left: $k-spacing--s;
    }

    &__actionsWrapper {
        display: flex;
        align-items: center;
        margin-left: auto;
    }

    &__actions {
        margin-left: $k-spacing--xl;
    }

    &__text {
        @media (min-width: $k-breakpoint--m) {
            @include wrap(math.div(10, 12), $k-spacing--3xl);

            margin-top: $k-spacing--3xl;
            margin-right: auto;
            margin-left: auto;
            width: 100%;
        }
    }
}
</style>
