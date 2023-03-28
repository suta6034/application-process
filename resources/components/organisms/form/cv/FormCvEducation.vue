<script setup>
import {
    computed, ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required,
    requiredIf,
    maxLength,
} from '@vuelidate/validators';
import {
    EDUCATION_CATEGORY_APPRENTICE,
    EDUCATION_TYPE_OTHER,
} from '../../../../services/education';
import {
    dateRange,
    isoDate,
    maxDate,
    minDate,
    validateIf,
} from '../../../../utils/validators';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormCheckbox from '../../../atoms/form/FormCheckbox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormPillSelect from '../../../molecules/form/FormPillSelect';
import FormSection from '../../../molecules/form/FormSection';
import FormTextareaLimited from '../../../atoms/form/FormTextareaLimited';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    useActions, useComputedRowObjectProperties, useMutations, useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const EDUCATION_MAX_LENGTH = 500;

const props = defineProps({
    id: {
        type: Number,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    educationCategories,
    educationTypes,
} = useState('profile');

const {
    fetchEducationCategories,
    fetchEducationTypes,
} = useActions('profile');
if (educationCategories.value.length === 0) fetchEducationCategories();
if (educationTypes.value.length === 0) fetchEducationTypes();

const {
    rows: educations,
} = useState('profile/education');

const {
    updateField,
    CLEAR_NEW_ROWS: clear,
} = useMutations('profile/education');

const {
    completed,
    submitted,
    start,
    end,
    type,
    title,
    category,
    customType,
    name,
    trainingCompany,
    focus,
    description,
} = useComputedRowObjectProperties({ updateField, objects: educations, indexId: props.id });

const educationTypesByActiveEducationCategory = computed(() => educationTypes.value
    .filter(educationType => educationType.parentId === category.value.id));
const educationTypeOtherSelected = computed(() => type.value.id === EDUCATION_TYPE_OTHER);
const isApprentice = computed(() => category.value.id === EDUCATION_CATEGORY_APPRENTICE);

function activateEducationTypeSection(value) {
    if (value) {
        type.value = {};
    }
}

const educationEnd = ref(null);
function focusEducationEnd(e) {
    if (e.target.nextSibling || e.target.value.length < 4) return;

    setTimeout(() => {
        educationEnd.value.$el.querySelector('input').focus();
    }, 0);
}

// Not tested because testing this is (almost) impossible.
const validations = {
    category: {
        required,
    },
    type: {
        required,
    },
    customType: {
        required: requiredIf(/* istanbul ignore next */educationTypeOtherSelected),
    },
    trainingCompany: {
        required: requiredIf(/* istanbul ignore next */isApprentice),
    },
    name: {
        required: requiredIf(/* istanbul ignore next */() => !isApprentice.value),
    },
    focus: {
        required: requiredIf(/* istanbul ignore next */isApprentice),
    },
    start: {
        isoDate: isoDate(true, true, false),
        required,
        maxDate: maxDate(new Date()),
        minDate: minDate(MIN_DATE),
    },
    end: {
        isoDate: isoDate(true, true, false),
        required: requiredIf(/* istanbul ignore next */ completed),
        maxDate: validateIf(completed, maxDate(new Date())),
        /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        dateRange: validateIf(start, dateRange(start, end)),
    },
    description: {
        maxLength: maxLength(EDUCATION_MAX_LENGTH),
    },
};

const v$ = useVuelidate(validations, {
    category,
    type,
    customType,
    trainingCompany,
    name,
    focus,
    start,
    end,
    description,
});

const {
    dirty,
    cancel,
    markAsDirty,
    save,
} = useCvEditForm(props, emit, v$, submitted);

watch(educationTypeOtherSelected, () => {
    if (!educationTypeOtherSelected.value) {
        customType.value = '';
        v$.value.customType.$reset();
    }
});

watch(isApprentice, () => {
    if (isApprentice.value) {
        name.value = '';
        v$.value.name.$reset();
    } else {
        trainingCompany.value = '';
        v$.value.trainingCompany.$reset();
    }
});

if (!props.id) {
    clear();
    completed.value = true;
}

// Expose for unit tests
defineExpose({
    dirty, trainingCompany, educations, name, category, type, activateEducationTypeSection, educationTypeOtherSelected,
});
</script>

<template>
    <LayoutForm
        ref="root"
        :inline="true"
        :full-page="false"
        class="c-formCvEducation"
        @dirty="markAsDirty"
    >
        <template #info>
            <AppInfoBox
                v-if="id"
                hint
            >
                Hier gibst du an, über welche Berufs- und Schulausbildung du verfügst.
                Je weniger Berufserfahrung du hast, desto mehr kannst du ins Detail gehen.
                Wenn du einen höheren Abschluss oder mehrjährige Berufserfahrung hast,
                lass Unter- und Oberstufe weg.
            </AppInfoBox>
        </template>
        <FormSection>
            <template #headline>
                <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                <label for="category">
                    Welche Ausbildung möchtest du angeben?
                </label>
            </template>

            <FormElement>
                <FormPillSelect
                    id="category"
                    v-model="category"
                    name="educationCategory"
                    :options="educationCategories"
                    :status="v$.category.$error ? 'error' : ''"
                    data-qa="education category select"
                    @change="activateEducationTypeSection"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.category.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.educationCategory') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="category.id"
            data-qa="education type section"
        >
            <template #headline>
                Bitte wähle den passenden {{ isApprentice ? 'Ausbildungstyp' : 'Schultyp' }} aus
            </template>
            <FormElement>
                <FormPillSelect
                    v-model="type"
                    name="educationType"
                    :options="educationTypesByActiveEducationCategory"
                    :status="v$.type.$error ? 'error' : undefined"
                    data-qa="education type select"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.type.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.educationType') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection>
            <FormElement v-if="isApprentice">
                <template #start>
                    <FormLabel for="training-company">
                        Ausbildungsbetrieb
                    </FormLabel>
                </template>
                <FormInput
                    id="training-company"
                    v-model="trainingCompany"
                    :status="v$.trainingCompany.$error ? 'error' : ''"
                    aria-label="Name des Ausbildungsbetriebs"
                    placeholder="Name des Ausbildungsbetriebs"
                    data-qa="training company"
                    @blur="v$.trainingCompany.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.trainingCompany.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Ausbildungsbetrieb' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement
                v-if="educationTypeOtherSelected"
                data-qa="custom education type section"
            >
                <template #start>
                    <FormLabel for="custom-education-type">
                        Schultyp
                    </FormLabel>
                </template>
                <FormInput
                    id="custom-education-type"
                    v-model="customType"
                    :status="v$.customType.$error ? 'error' : ''"
                    aria-label="Bezeichnung des Schultyps"
                    placeholder="Bezeichnung des Schultyps"
                    data-qa="custom education type field"
                    @blur="v$.customType.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.customType.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Schultyp' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement v-if="!isApprentice">
                <template #start>
                    <FormLabel for="name">
                        Schule/Institution
                    </FormLabel>
                </template>
                <FormInput
                    id="name"
                    v-model="name"
                    :status="v$.name.$error ? 'error' : ''"
                    aria-label="Name der Schule oder Institution"
                    placeholder="Name der Institution"
                    data-qa="name"
                    @blur="v$.name.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.name.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Schule / Institution' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement data-qa="education focus section">
                <template #start>
                    <FormLabel
                        v-if="isApprentice"
                        for="education-focus"
                    >
                        Beruf
                    </FormLabel>
                    <FormLabel
                        v-else
                        for="education-focus"
                    >
                        Fachrichtung - optional
                    </FormLabel>
                </template>
                <FormInput
                    id="education-focus"
                    v-model="focus"
                    :placeholder="isApprentice ? 'z.B. Tischler, Metalltechniker, Elektriker'
                        : 'Studienrichtung, Schwerpunkt, ...'"
                    :status="v$.focus.$error ? 'error' : ''"
                    aria-label="Fachrichtung, optional"
                    data-qa="focus field"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.focus.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Beruf' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement data-qa="duration section">
                <div class="c-formCvEducation__duration">
                    <FormElement>
                        <template #start>
                            <FormLabel for="education-start">
                                Von
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="education-start"
                            v-model="start"
                            :show-day="false"
                            :status="v$.start.$error ? 'error' : ''"
                            divider="/"
                            default-day="01"
                            data-qa="start"
                            @blurLastField="v$.start.$touch()"
                            @input.native.capture="focusEducationEnd"
                        />
                    </FormElement>
                    <FormElement>
                        <template #start>
                            <FormLabel for="education-end">
                                {{ completed ? 'Bis' : 'Bis - optional' }}
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="education-end"
                            ref="educationEnd"
                            v-model="end"
                            :show-day="false"
                            :status="v$.end.$error ? 'error' : ''"
                            divider="/"
                            default-day="01"
                            data-qa="end"
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
            <FormElement class="c-formCvEducation__element">
                <FormCheckbox
                    :checked="!completed"
                    data-qa="not completed checkbox"
                    @change="(e) => completed = !e"
                >
                    Ausbildung ist noch nicht abgeschlossen
                </FormCheckbox>
            </FormElement>
        </FormSection>
        <FormSection>
            <FormElement
                v-if="completed"
                data-qa="education title element"
            >
                <template #start>
                    <FormLabel for="education-title">
                        Erworbener Titel - optional
                    </FormLabel>
                </template>
                <FormInput
                    id="education-title"
                    v-model="title"
                    aria-label="Erworbener Titel, optional"
                    placeholder="Dr., Mag., Ing., ..."
                    data-qa="title"
                />
            </FormElement>
            <FormElement class="c-formCvEducation__element">
                <template #start>
                    <FormLabel for="description">
                        Beschreibung - optional
                    </FormLabel>
                </template>
                <FormTextareaLimited
                    id="description"
                    v-model="description"
                    :maxlength="EDUCATION_MAX_LENGTH"
                    :status="v$.description.$error ? 'error' : ''"
                    rows="6"
                    placeholder="Schwerpunkte, Auslandserfahrung, Studienbeschreibung, Abschlussarbeit, ..."
                    data-qa="description"
                    @input.native="v$.description.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.description.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: EDUCATION_MAX_LENGTH }) }}
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
                    {{ id ? 'Änderungen speichern' : 'Ausbildung hinzufügen' }}
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

.c-formCvEducation {
    &__duration {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }
}
</style>
