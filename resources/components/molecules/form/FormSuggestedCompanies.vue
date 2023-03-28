<script setup>
import {
    ref,
    watch,
    watchEffect,
} from 'vue';

import {
    autocomplete,
} from '../../../services/autocomplete';
import {
    CATEGORIES,
} from '../../../utils/tracking';

import AppShowMore from '../app/AppShowMore';
import AppActionBox from '../app/AppActionBox';
import AppGrid from '../app/AppGrid';
import AppGridColumn from '../app/AppGridColumn';
import FormRadio from '../../atoms/form/FormRadio';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    company: {
        required: true,
        type: Object,
    },
    hasSuggestions: {
        type: Boolean,
    },
});
const emit = defineEmits(['discard', 'input', 'update:has-suggestions']);

const initialCompany = ref(null);
const companySuggestions = ref([]);
const STATES = {
    isIdle: 'isIdle',
    isLoading: 'isLoading',
    isSuccess: 'isSuccess',
};
const state = ref(STATES.isIdle);

watch(() => props.company, async () => {
    try {
        if (state.value === STATES.isLoading) return;
        if (props.company.id) return;

        state.value = STATES.isLoading;
        initialCompany.value = props.company;
        companySuggestions.value = await autocomplete({
            filters: {
                prefix: props.company.label,
                limit: 11,
            },
            type: 'companies',
        });

        state.value = STATES.isSuccess;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        state.value = STATES.isIdle;
    }
}, { immediate: true });

watchEffect(() => {
    const hasSuggestions = initialCompany.value && companySuggestions.value.length > 0;
    emit('update:has-suggestions', hasSuggestions);
});

const updateCompany = ({ id, label: name }) => {
    emit('input', { id, name });
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.applications);
</script>

<template>
    <AppActionBox
        is-closable
        class="c-formSuggestedCompanies"
        @hide="emit('discard');trackClick('application-add-application-select-close')"
    >
        <span slot="header">
            Du hast „{{ initialCompany.label }}“ eingegeben – meintest du eine dieser Firmen?
        </span>
        <AppShowMore
            class="c-formSuggestedCompanies__suggestions"
            transition
            secondary
            center
            @showMore="trackClick('application-add-application-select-showmore')"
        >
            <AppGrid gap="s">
                <AppGridColumn :width="['12/12', '6/12@m']">
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <div
                        class="c-formSuggestedCompanies__item"
                        :class="!company.id && 'c-formSuggestedCompanies__item--checked'"
                        @click.prevent="
                            emit('input', initialCompany);
                            trackClick('application-add-application-select-input')"
                    >
                        <FormRadio :checked="!company.id">
                            <div class="c-formSuggestedCompanies__header">
                                Nein, eigene Eingabe übernehmen:
                            </div>
                            <div class="c-formSuggestedCompanies__content">
                                „{{ initialCompany.label }}”
                            </div>
                        </FormRadio>
                    </div>
                </AppGridColumn>
                <AppGridColumn
                    v-for="companySuggestion in companySuggestions.slice(0, 3)"
                    :key="companySuggestion.id"
                    :width="['12/12', '6/12@m']"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <div
                        class="c-formSuggestedCompanies__item"
                        :class="companySuggestion.id === company.id && 'c-formSuggestedCompanies__item--checked'"
                        @click.prevent="
                            updateCompany(companySuggestion);
                            trackClick('application-add-application-select-company')"
                    >
                        <FormRadio :checked="companySuggestion.id === company.id">
                            <div class="c-formSuggestedCompanies__header">
                                {{ companySuggestion.label }}
                            </div>
                            <div
                                v-if="companySuggestion.attributes['location']"
                                class="c-formSuggestedCompanies__content"
                            >
                                {{ companySuggestion.attributes['location'] }}
                            </div>
                        </FormRadio>
                    </div>
                </AppGridColumn>
            </AppGrid>
            <template
                v-if="companySuggestions.slice(3).length > 0"
                #more
            >
                <div class="c-formSuggestedCompanies__moreSuggestions">
                    <AppGrid gap="s">
                        <AppGridColumn
                            v-for="companySuggestion in companySuggestions.slice(3)"
                            :key="companySuggestion.id"
                            :width="['12/12', '6/12@m']"
                        >
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                            <div
                                class="c-formSuggestedCompanies__item"
                                :class="companySuggestion.id === company.id &&
                                    'c-formSuggestedCompanies__item--checked'"
                                @click.prevent="
                                    updateCompany(companySuggestion);
                                    trackClick('application-add-application-select-company')"
                            >
                                <FormRadio :checked="companySuggestion.id === company.id">
                                    <div class="c-formSuggestedCompanies__header">
                                        {{ companySuggestion.label }}
                                    </div>
                                    <div
                                        v-if="companySuggestion.attributes['location']"
                                        class="c-formSuggestedCompanies__content"
                                    >
                                        {{ companySuggestion.attributes['location'] }}
                                    </div>
                                </FormRadio>
                            </div>
                        </AppGridColumn>
                    </AppGrid>
                </div>
            </template>
        </AppShowMore>
    </AppActionBox>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-formSuggestedCompanies {
    &__suggestions {
        margin-top: $k-spacing--m;
    }

    &__moreSuggestions {
        margin-top: $k-spacing--s;
    }

    &__item {
        padding-top: $k-spacing--m;
        padding-right: $k-spacing--xl;
        padding-bottom: $k-spacing--m;
        padding-left: $k-spacing--m;
        height: 100%;
        border: 1px solid $k-color-gray--200;
        border-radius: $k-border-radius--s;
        background-color: $k-color-white;
        cursor: pointer;

        &--checked,
        &:hover {
            border-color: $k-color-green--700;
        }
    }

    &__header {
        font-weight: bold;
    }

    &__content {
        color: $k-color-gray--500;
    }
}
</style>
