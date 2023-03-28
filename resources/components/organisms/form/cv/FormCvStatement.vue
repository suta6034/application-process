<script setup>
import {
    maxLength,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppList from '../../../atoms/app/AppList';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormElement from '../../../molecules/form/FormElement';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import FormTextareaLimited from '../../../atoms/form/FormTextareaLimited';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const STATEMENT_MAX_LENGTH = 180;

const props = defineProps({ ...cvEditFormProps });
const emit = defineEmits([...cvEditFormEvents]);

const {
    statement,
} = useState('profile/statement');

const validations = {
    statement: {
        maxLength: maxLength(STATEMENT_MAX_LENGTH),
    },
};

const v$ = useVuelidate(validations, { statement });

const {
    save,
    dirty,
    markAsDirty,
    cancel,
} = useCvEditForm(props, emit, v$);
</script>

<template>
    <LayoutForm
        :inline="true"
        :full-page="false"
        class="c-formCvStatement"
        @dirty="markAsDirty"
    >
        <template #info>
            <AppInfoBox hint>
                Ein treffendes Statement verschafft Arbeitgebern einen ersten Eindruck von deiner Persönlichkeit.
                <template #more>
                    <p>Beachte beim Verfassen deines Statements bitte folgende Punkte:</p>
                    <AppList>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>Dein Statement sollte 180 Zeichen nicht überschreiten.</span>
                        </li>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>Formuliere deine Stärken und Qualifikationen so kurz und prägnant wie möglich.</span>
                        </li>
                    </AppList>
                </template>
            </AppInfoBox>
        </template>

        <FormSection>
            <template #headline>
                <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                <label for="statement">
                    Wer bist du? Was zeichnet dich aus?
                </label>
            </template>
            <FormElement>
                <FormTextareaLimited
                    id="statement"
                    v-model="statement"
                    :maxlength="STATEMENT_MAX_LENGTH"
                    :status="v$.$error ? 'error' : ''"
                    rows="6"
                    placeholder="Beschreibe dich selbst in einem kurzen Statement"
                    data-qa="statement"
                    @input.native="v$.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: STATEMENT_MAX_LENGTH }) }}
                        </li>
                    </FormMessage>
                </template>
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
