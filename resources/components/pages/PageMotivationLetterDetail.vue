<script setup>
import {
    computed,
} from 'vue';

import {
    useMotivationLetter,
} from '../../composables/resource-motivation-letter';
import {
    useBreakpoints,
} from '../../composables/breakpoint';

import AppBadge from '../atoms/app/AppBadge';
import AppBrandline from '../atoms/app/AppBrandline';
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import AppMotivationLetterActions from '../organisms/app/AppMotivationLetterActions';
import AppMotivationLetterDetail from '../organisms/app/AppMotivationLetterDetail';
import LayoutDefault from '../layouts/LayoutDefault';
import LayoutDefaultDetail from '../layouts/LayoutDefaultDetail';
import LayoutMinimal from '../layouts/LayoutMinimal';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';
import PageNotFound from './PageNotFound';
import TextHeadline from '../atoms/text/TextHeadline';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const {
    data: motivationLetter,
    error,
} = useMotivationLetter({
    id: props.id,
});

const isNotFound = computed(() => error.value?.response.status === 404);

const { isMediumScreen } = useBreakpoints();
</script>

<template>
    <Component
        :is="isMediumScreen ? LayoutDefault : LayoutMinimal"
        v-if="!isNotFound"
        :has-background-gray="isMediumScreen"
        :has-header="isMediumScreen"
        :has-footer="isMediumScreen"
        :is-content-full-height="isMediumScreen"
    >
        <ModalApiError :error="error"/>
        <Component
            :is="isMediumScreen ? LayoutDefaultDetail : 'div'"
            class="c-pageMotivationLetterDetail"
        >
            <div
                v-if="motivationLetter"
                class="c-pageMotivationLetterDetail__header"
            >
                <AppBrandline/>
                <AppButtonIconOnly
                    :to="{ name: 'page-motivation-letters' }"
                    icon="arrow-left"
                    size="l"
                    aria-label="Zurück"
                    data-qa="close detail"
                />
                <div class="c-pageMotivationLetterDetail__headerTitle">
                    <TextHeadline
                        :level="1"
                        class="u-ellipsis"
                    >
                        {{ motivationLetter.title || 'Bewerbungsschreiben' }}
                    </TextHeadline>
                    <div
                        v-if="motivationLetter"
                        class="c-pageMotivationLetterDetail__statusWrapper"
                    >
                        <AppBadge
                            v-if="motivationLetter.isDefault"
                            small
                            data-qa="status"
                        >
                            Standard
                        </AppBadge>
                    </div>
                </div>
                <AppMotivationLetterActions
                    :id="motivationLetter.id"
                    :is-default="motivationLetter.isDefault"
                    @remove="$emit('remove')"
                />
            </div>
            <div class="c-pageMotivationLetterDetail__body">
                <AppMotivationLetterDetail
                    :motivation-letter="motivationLetter"
                    @remove="$emit('remove')"
                />
            </div>
        </Component>
    </Component>
    <PageNotFound
        v-else
        headline="Wir konnten dieses Bewerbungsschreiben nicht finden"
        text="Komisch, da ist was schief gelaufen, tut uns leid!
        Vielleicht findest du sie ja doch bei deinen restlichen Bewerbungsschreiben?"
        link-text="Zur Übersicht"
        to="page-motivation-letters"
    />
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';

.c-pageMotivationLetterDetail {
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
        overflow: hidden;
    }

    &__statusWrapper {
        @include k-typo-s;

        margin-right: $k-spacing--s;
        margin-left: $k-spacing--s;
    }

    &__body {
        padding: $k-spacing--xl $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            padding: 0;
        }
    }
}
</style>
