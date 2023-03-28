<script setup>
import {
    maxLength,
} from '@vuelidate/validators';

import {
    ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormElement from '../../../molecules/form/FormElement';
import FormSection from '../../../molecules/form/FormSection';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const MAX_INTERESTS = 25;

const suggestedInterest = ref([0]);

const {
    rows: interests,
} = useState('profile/interest');

const props = defineProps({
    ...cvEditFormProps,
});

const emit = defineEmits([...cvEditFormEvents]);

const validations = {
    interests: {
        maxLength: maxLength(MAX_INTERESTS),
    },
};

const v$ = useVuelidate(validations, { interests }, { $scope: false });

const {
    dirty,
    cancel,
    markAsDirty,
    save,
} = useCvEditForm(props, emit, v$);
</script>

<template>
    <LayoutForm
        ref="root"
        :full-page="false"
        :inline="true"
        class="c-formCvInterests"
    >
        <template #info>
            <AppInfoBox hint>
                Interessen runden dein Portfolio ab, indem sie Eigenschaften und Fähigkeiten hervorheben,
                die du betonen möchtest.
            </AppInfoBox>
        </template>
        <FormSection>
            <template #headline>
                Was machst du gerne?
            </template>
            <FormElement>
                <FormSuggestionSelect
                    v-model="interests"
                    :suggestion-pills="suggestedInterest"
                    :allow-new="true"
                    :auto-select-on-separator="true"
                    :max="MAX_INTERESTS"
                    :enable-primary-action="false"
                    placeholder="z.B. Städtereisen, Yoga, Musikverein"
                    data-qa="interest field"
                    @change="markAsDirty();v$.$touch()"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct') }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_INTERESTS, fieldName: 'Interessen' }) }}
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
