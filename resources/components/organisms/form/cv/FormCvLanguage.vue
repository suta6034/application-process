<script setup>
import {
    maxLength,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    computed,
} from 'vue';
import {
    autocompleteAdapter,
    labelDefinitionAdapter,
    optionAdapter,
} from '../../../../store/modules/forms/language';
import {
    LEVELS,
} from '../../../../models/Language';
import {
    UPDATE_LEVEL,
} from '../../../../store/mutation-types';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormElement from '../../../molecules/form/FormElement';
import FormSection from '../../../molecules/form/FormSection';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import LayoutForm from '../../../layouts/LayoutForm';

import suggestedLanguages from '../../../../data/suggested-languages.json';

import '../../../../lang/validation';
import {
    useMutations, useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const MAX_LANGUAGES = 25;

const props = defineProps({ ...cvEditFormProps });
const emit = defineEmits([...cvEditFormEvents]);

const {
    rows: storeLanguages,
} = useState('profile/language');

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const validations = {
    languages: {
        maxLength: maxLength(MAX_LANGUAGES),
    },
};

const {
    UPDATE: updateLanguage,
} = useMutations('profile/language');

// languages don't use the normal updateField mutation because they undergo some normalization,
// so we can't use the internal useStore setter, instead we call the mutation that normalizes
// the data manually with this computed property setter.
const languages = computed({
    get: () => storeLanguages.value,
    set: value => updateLanguage({
        path: 'rows',
        value,
    }),
});

const v$ = useVuelidate(validations, { languages }, { $scope: false });

const {
    save,
    cancel,
    dirty,
    markAsDirty,
} = useCvEditForm(props, emit, v$);

function showLevelSelection(option) {
    const language = languages.value.find(x => x.label === option.label);
    showModal({
        ariaLabel: `Wie gut kannst du ${language.label}?`,
        componentName: 'ModalLevelSelector',
        componentProps: {
            adaptedOption: optionAdapter(language),
            levels: LEVELS,
            mutation: `profile/language/${UPDATE_LEVEL}`,
        },
    });
}

function markAsDirtyAndShowLevelSelection(language) {
    markAsDirty();
    showLevelSelection(language);
}
</script>

<template>
    <LayoutForm
        ref="root"
        class="c-formCvLanguage"
        :full-page="false"
        :inline="true"
    >
        <template #info>
            <AppInfoBox hint>
                Gib deine Sprachkenntnisse realistisch an bzw. überprüfe diese immer wieder.
                Bewerbungsgespräche können durchaus in anderen Sprachen abgehalten werden.
            </AppInfoBox>
        </template>

        <FormSection>
            <template #headline>
                Welche Sprachen sprichst du?
            </template>

            <FormElement>
                <FormSuggestionSelect
                    v-model="languages"
                    :max="MAX_LANGUAGES"
                    :autocomplete-adapter="autocompleteAdapter"
                    :label-definition-adapter="labelDefinitionAdapter"
                    :option-adapter="optionAdapter"
                    :options="suggestedLanguages"
                    placeholder="Sprache eingeben oder Vorschlag wählen"
                    endpoint="languages"
                    data-qa="language"
                    @pillPrimaryAction="markAsDirtyAndShowLevelSelection"
                    @add="markAsDirtyAndShowLevelSelection"
                    @change="markAsDirty"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct', { fieldName: 'Sprache' }) }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_LANGUAGES, fieldName: 'Sprachen' }) }}
                    </template>
                </FormSuggestionSelect>
            </FormElement>
        </FormSection>

        <template #actions>
            <AppButtonGroup variant="right">
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save"
                >
                    Änderungen speichern
                </AppButton>
                <template #secondary>
                    <AppButton
                        outline
                        data-qa="cancel button"
                        @click="cancel"
                    >
                        Abbrechen
                    </AppButton>
                </template>
            </AppButtonGroup>
        </template>
    </LayoutForm>
</template>
