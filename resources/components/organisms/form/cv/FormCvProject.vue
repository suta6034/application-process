<script setup>
import {
    required,
    maxLength,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    ref,
} from 'vue';
import {
    dateRange,
    isoDate,
    maxDate,
    minDate, validateIf,
} from '../../../../utils/validators';
import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import FormTextareaLimited from '../../../atoms/form/FormTextareaLimited';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    cvEditFormEvents,
    useCvEditForm,
} from '../../../../composables/cv-edit-form';
import {
    useComputedRowObjectProperties, useMutations, useState,
} from '../../../../composables/vuex-helpers';

const MAX_YEAR_END = new Date('2038-01-18T00:00:00+01:00'); // Maximum timestamp fitting into a MySQL int(11) type.
const MAX_DATE_START = new Date();
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const PROJECT_MAX_LENGTH = 500;

const props = defineProps({
    id: {
        type: Number,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    rows: projects,
} = useState('profile/project');

const {
    updateField,
    CLEAR_NEW_ROWS: clear,
} = useMutations('profile/project');

const {
    name,
    start,
    end,
    description,
    submitted,
    url,
} = useComputedRowObjectProperties({
    updateField,
    objects: projects,
    indexId: props.id,
});

if (!props.id) {
    clear();
}

const endDate = ref(null);
function focusEnd(e) {
    if (e.target.nextSibling || e.target.value.length < 4) return;

    setTimeout(() => {
        endDate.value.$el.querySelector('input').focus();
    }, 0);
}

const validations = {
    name: {
        required,
    },
    start: {
        isoDate: isoDate(true, true, false),
        required,
        minDate: minDate(MIN_DATE),
        maxDate: maxDate(MAX_DATE_START),
    },
    end: {
        isoDate: isoDate(true, true, false),
        minDate: minDate(MIN_DATE),
        maxDate: maxDate(MAX_YEAR_END),
        dateRange: validateIf(start, dateRange(start, end)),
    },
    description: {
        maxLength: maxLength(PROJECT_MAX_LENGTH),
    },
};
const v$ = useVuelidate(validations, { name, start, end, description });

const {
    dirty,
    cancel,
    markAsDirty,
    save,
} = useCvEditForm(props, emit, v$, submitted);

// Expose for unit tests
defineExpose({
    dirty, projects, name, start, end, description, submitted, url,
});
</script>

<template>
    <LayoutForm
        ref="root"
        :inline="true"
        :full-page="false"
        class="c-formCvProject"
        @dirty="markAsDirty"
    >
        <AppInfoBox
            v-if="id"
            hint
        >
            Hier hast du Platz für Projekte, die du umgesetzt oder begleitet
            hast und die für potenzielle Arbeitgeber von Interesse sein können.
            <template #more>
                Ganz egal ob aus bisherigen Jobs, deiner Ausbildung oder deinem Privatleben –
                Hauptsache mit Herzblut.
            </template>
        </AppInfoBox>
        <FormSection>
            <template
                v-if="!id"
                #headline
            >
                Welches Projekt möchtest du vorstellen?
            </template>

            <FormElement>
                <template #start>
                    <FormLabel
                        for="name"
                        title="Pflichtfeld"
                    >
                        Projektname
                    </FormLabel>
                </template>
                <FormInput
                    id="name"
                    v-model.trim="name"
                    :status="v$.name.$error ? 'error' : ''"
                    data-qa="name"
                    aria-label="Projektname"
                    placeholder="Bezeichnung des Projekts"
                    @blur="v$.name.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.name.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Projektname' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel for="url">
                        Webadresse - optional
                    </FormLabel>
                </template>
                <FormInput
                    id="url"
                    v-model.trim="url"
                    data-qa="url"
                    aria-label="Webadresse, optional"
                    placeholder="Link zum Projekt"
                />
            </FormElement>
            <FormElement>
                <div class="c-formCvProject__duration">
                    <FormElement>
                        <template #start>
                            <FormLabel
                                for="start"
                                title="Pflichtfeld"
                            >
                                Von
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="start"
                            v-model="start"
                            :show-day="false"
                            :status="v$.start.$error ? 'error' : ''"
                            data-qa="start"
                            divider="/"
                            default-day="01"
                            @blurLastField="v$.start.$touch()"
                            @input.native.capture="focusEnd"
                        />
                    </FormElement>
                    <FormElement>
                        <template #start>
                            <FormLabel for="end">
                                Bis - optional
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="end"
                            ref="endDate"
                            v-model="end"
                            :show-day="false"
                            :status="v$.end.$error ? 'error' : ''"
                            data-qa="end"
                            divider="/"
                            default-day="01"
                            @blurLastField="v$.end.$touch()"
                        />
                    </FormElement>
                </div>
                <template #end>
                    <FormMessage
                        v-if="v$.start.$error || v$.end.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.dateRange') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection>
            <FormElement>
                <template #start>
                    <FormLabel for="description">
                        Beschreibung - optional
                    </FormLabel>
                </template>
                <FormTextareaLimited
                    id="description"
                    v-model="description"
                    data-qa="description"
                    placeholder="Projektinhalt, Aufgabengebiete, ..."
                    rows="6"
                    :maxlength="PROJECT_MAX_LENGTH"
                    :status="v$.description.$error ? 'error' : ''"
                    @input.native="v$.description.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.description.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: PROJECT_MAX_LENGTH }) }}
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
                    {{ id ? 'Änderungen speichern' : 'Projekt hinzufügen' }}
                </AppButton>
                <template #secondary>
                    <AppButton
                        outline
                        data-qa="back link"
                        @click="cancel"
                    >
                        Abbrechen
                    </AppButton>
                </template>
            </AppButtonGroup>
        </template>
    </LayoutForm>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/spacing';

.c-formCvProject {
    &__duration {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }

    &__infoBox {
        margin-bottom: $k-spacing--xl;
    }
}
</style>
