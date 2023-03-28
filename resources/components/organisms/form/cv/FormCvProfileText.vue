<script setup>
import {
    onBeforeUnmount,
} from 'vue';
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
import FormTextarea from '../../../atoms/form/FormTextarea';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const PROFILE_TEXT_MAX_LENGTH = 10000;

const {
    profileText,
} = useState('profile/profileText');

const props = defineProps({ ...cvEditFormProps });
const emit = defineEmits([...cvEditFormEvents, 'destroy']);

onBeforeUnmount(() => emit('destroy'));
const validations = {
    profileText: {
        maxLength: maxLength(PROFILE_TEXT_MAX_LENGTH),
    },
};

const v$ = useVuelidate(validations, { profileText });

const {
    save,
    dirty,
    markAsDirty,
    cancel,
} = useCvEditForm(props, emit, v$);
</script>

<template>
    <LayoutForm
        ref="root"
        :inline="true"
        :full-page="false"
        class="c-formCvProfileText"
        @dirty="markAsDirty"
    >
        <template #info>
            <AppInfoBox hint>
                Im Freitextfeld hast du die Möglichkeit, Informationen von dir zu ergänzen,
                die bisher noch keinen Platz in deinem Lebenslauf hatten.
                <template #more>
                    <p>Hier einige Tipps zum Freitext:</p>
                    <AppList>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Wer diese Rubrik mit 08/15-Texten füllt, vergibt wertvolle Chancen –
                                für den Text solltest du dir genau überlegen, was du kommunizieren möchtest.
                            </span>
                        </li>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Lange Texte werden nur überflogen – formuliere so kurz und prägnant wie möglich.
                            </span>
                        </li>
                    </AppList>
                </template>
            </AppInfoBox>
        </template>

        <FormSection>
            <template #headline>
                <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                <label for="profile-text">
                    Was sollte dein zukünftiger Arbeitgeber noch von dir wissen?
                </label>
            </template>
            <FormElement>
                <FormTextarea
                    id="profile-text"
                    v-model.trim="profileText"
                    :status="v$.$error ? 'error' : ''"
                    rows="6"
                    placeholder="Erzähle mehr von dir!"
                    data-qa="profile text"
                    @input.native="v$.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: PROFILE_TEXT_MAX_LENGTH }) }}
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
