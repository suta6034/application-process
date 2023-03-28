<script setup>
import {
    computed,
    inject,
    nextTick,
    ref, watch,
} from 'vue';

import {
    STATES,
    useMotivationLetterList,
    useMotivationLetterPatch,
} from '../../composables/resource-motivation-letter';
import {
    CATEGORIES,
} from '../../utils/tracking';
import '../../lang/motivation-letter';

import AppButton from '../atoms/app/AppButton';
import AppLink from '../atoms/app/AppLink';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppMotivationLetterDetail from '../organisms/app/AppMotivationLetterDetail';
import AppMotivationLetterItem from '../organisms/app/AppMotivationLetterItem';
import AppRefreshPrompt from '../molecules/app/AppRefreshPrompt';
import LayoutSplitView from '../layouts/LayoutSplitView';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';
import TextHeadline from '../atoms/text/TextHeadline';
import '../../directives/debounce-click';
import {
    useTrackClick,
} from '../../composables/track-click';
import {
    showSnackbar,
} from '../../utils/snackbar';
import i18n from '../../utils/i18n';

const router = inject('router');
const {
    data: motivationLetters,
    state,
    refetch,
} = useMotivationLetterList();
const {
    error: patchError,
    patch,
    state: patchState,
} = useMotivationLetterPatch();

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.motivationLetter);

const hasMotivationLetters = computed(() => motivationLetters.value?.length > 0);

const selectedMotivationLetterIdManual = ref(null);
const selectedMotivationLetterRoute = computed(() => motivationLetters.value
    .find(motivationLetter => motivationLetter.id === router.currentRoute.params.id) || null);
const selectedMotivationLetter = computed(() => {
    if (!hasMotivationLetters.value) return null;
    if (selectedMotivationLetterIdManual.value) {
        return motivationLetters.value.find(({ id }) => id === selectedMotivationLetterIdManual.value);
    }
    if (selectedMotivationLetterRoute.value) return selectedMotivationLetterRoute.value;

    return motivationLetters.value[0];
});
const selectMotivationLetter = (motivationLetter) => {
    selectedMotivationLetterIdManual.value = motivationLetter.id;
};
const selectMotivationLetterNextTo = (motivationLetter) => {
    const selectedIndex = motivationLetters.value.indexOf(motivationLetter);
    const nextMotivationLetter = motivationLetters.value[selectedIndex + 1]
                || motivationLetters.value[selectedIndex - 1]
                || null;
    if (nextMotivationLetter) selectMotivationLetter(nextMotivationLetter);
};

const isDetailOpen = ref(false);
const openDetail = async (motivationLetter) => {
    selectMotivationLetter(motivationLetter);
    await nextTick();
    isDetailOpen.value = true;
};

const fetchAndDisplayMotivationLetters = async () => {
    await refetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const setAsDefault = async ({ id }) => {
    await patch({ id, data: { isDefault: true } }, { isOptimistic: false });
    refetch();
};

watch(patchState, (newPatchState) => {
    if (newPatchState === STATES.isSuccess) {
        showSnackbar({
            text: i18n('motivationLetter.updated'),
            icon: 'check',
        });
    }
});
</script>

<template>
    <LayoutSplitView
        :detail-open="isDetailOpen"
        :loading="state === STATES.isLoading"
        sticky-column="detail"
        class="c-pageMotivationLetters"
    >
        <ModalApiError :error="patchError"/>
        <template #list-top>
            <div class="c-pageMotivationLetters__listHeader">
                <TextHeadline
                    v-if="motivationLetters"
                    :level="1"
                    size="xl"
                    data-qa="header headline"
                >
                    {{ motivationLetters.length }}
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    Vorlage<template v-if="motivationLetters.length > 1">n</template>
                </TextHeadline>
                <AppButton
                    :disabled="motivationLetters && motivationLetters.length > 2"
                    size="s"
                    :to="motivationLetters && motivationLetters.length > 2 ? undefined :
                        { name: 'page-motivation-letter-create' }"
                    outline
                    data-qa="create motivation letter"
                    @click.native="trackClick('application-letter-add-new')"
                >
                    Hinzufügen
                </AppButton>
            </div>
            <div class="c-pageMotivationLetters__listSubheader">
                <div class="c-pageMotivationLetters__listTopMessages">
                    <AppInfoBox
                        v-if="state !== STATES.isLoading"
                        hint
                        data-qa="motivation letter tipps"
                    >
                        Dein Bewerbungsschreiben soll richtig überzeugen? Hol dir
                        <strong>
                            <AppLink
                                target="_blank"
                                href="/c/a/bewerbungsschreiben-aufbau"
                                neutral
                                underline
                            >unsere Tipps</AppLink>.
                        </strong>
                    </AppInfoBox>
                    <AppInfoBox
                        v-if="state === STATES.isError"
                        warning
                        data-qa="error message"
                    >
                        Tut uns leid, es ist ein Fehler aufgetreten - bitte lade die Seite neu.
                        <AppLink
                            tag="button"
                            class="c-pageMotivationLetters__listTopMessageLink"
                            @click="fetchAndDisplayMotivationLetters"
                        >
                            Jetzt neu laden
                        </AppLink>
                    </AppInfoBox>
                </div>
            </div>
        </template>
        <template
            #list-main
        >
            <template v-if="state === STATES.isLoading">
                <AppMotivationLetterItem
                    v-for="i in 3"
                    :key="i"
                />
            </template>
            <AppMotivationLetterItem
                v-for="motivationLetter in motivationLetters"
                :key="motivationLetter.id"
                :motivation-letter="motivationLetter"
                :selected="selectedMotivationLetter.id === motivationLetter.id"
                @selected="openDetail(motivationLetter); trackClick('application-letter-show')"
                @set-as-default="setAsDefault(motivationLetter)"
                @remove="selectedMotivationLetter === motivationLetter
                    && selectMotivationLetterNextTo(motivationLetter)"
            />
        </template>
        <template
            v-if="motivationLetters"
            #list-meta
        >
            <template v-if="motivationLetters.length === 2">
                Du kannst noch 1 Vorlage erstellen.
            </template>
            <template v-else-if="motivationLetters.length === 1">
                Du kannst noch 2 Vorlagen erstellen.
            </template>
            <template v-else-if="motivationLetters.length === 0">
                Du kannst noch 3 Vorlagen erstellen.
            </template>
            <template v-else>
                Du hast die maximale Anzahl an Vorlagen erreicht.
            </template>
        </template>
        <template
            #detail
        >
            <div
                v-if="state === STATES.isError"
                class="c-pageMotivationLetters__refreshPrompt"
            >
                <AppRefreshPrompt :fetch="fetchAndDisplayMotivationLetters"/>
            </div>
            <AppMotivationLetterDetail
                v-else
                :motivation-letter="selectedMotivationLetter"
                @set-as-default="setAsDefault(selectedMotivationLetter)"
                @remove="selectMotivationLetterNextTo(selectedMotivationLetter)"
            />
        </template>
    </LayoutSplitView>
</template>

<style lang="scss">
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';

.c-pageMotivationLetters {
    $root: &;
    $filter-form-width: 13.5rem;
    $empty-max-width: 1000px;
    $empty-image-width: 476px;
    $empty-filter-illustration-width: 251px;

    background-color: $k-color-gray--50;

    &__listHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $k-spacing--xl;
    }

    &__listSubheader {
        margin-bottom: $k-spacing--m;
    }

    &__listTopMessages {
        margin-top: $k-spacing--xl;
        margin-bottom: $k-spacing--xl;

        > :not(:first-child) {
            margin-top: $k-spacing--m;
        }
    }

    &__listTopMessageLink {
        margin-top: $k-spacing--xs;
        color: $k-color-gray--800;
        text-decoration: underline;
        font-weight: bold;
        cursor: pointer;

        &:hover,
        &:visited {
            color: $k-color-gray--800;
            text-decoration: none;
        }
    }

    // 1. Visually center the block to satisfy the design.
    &__refreshPrompt {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 80%; // 1
    }
}
</style>
