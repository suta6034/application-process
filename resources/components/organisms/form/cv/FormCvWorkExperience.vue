<script setup>
import {
    computed, nextTick, onMounted, ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required,
    requiredIf,
    maxLength,
} from '@vuelidate/validators';
import {
    dateRange,
    isoDate,
    maxDate,
    minDate,
    validateIf,
} from '../../../../utils/validators';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../../utils/tracking';
import {
    WORK_CATEGORY,
    autocompleteAdapter,
    companyOptionAdapter,
    titleOptionAdapter,
    titleValueAdapter,
    workExperienceOptionsAdapter,
    workExperienceValueAdapter,
} from '../../../../store/modules/forms/work';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormCheckbox from '../../../atoms/form/FormCheckbox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormFilterSelect from '../../../molecules/form/FormFilterSelect';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormRow from '../../../molecules/form/FormRow';
import FormPillSelect from '../../../molecules/form/FormPillSelect';
import FormSection from '../../../molecules/form/FormSection';
import FormSelect from '../../../molecules/form/FormSelect';
import FormTextareaLimited from '../../../atoms/form/FormTextareaLimited';
import LayoutForm from '../../../layouts/LayoutForm';

import jobEmploymentTypesWithDefaultOption from '../../../../data/job-employment-types-with-default-option.json';
import jobFieldTypes from '../../../../data/job-field-types.json';
import workTypes from '../../../../data/work-types.json';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    useComputedRowObjectProperties, useMutations, useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const MAX_CURRENT_DATE = new Date();
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const WORK_EXPERIENCE_MAX_LENGTH = 500;
const WORK_CATEGORY_ACTION = {
    Berufserfahrung: 'experience-add-experience',
    Elternzeit: 'experience-add-parental-leave',
    Grundwehrdienst: 'experience-add-military-service',
    Zivildienst: 'experience-add-community-service',
    Sonstiges: 'experience-add-other',
};
const WORK_CATEGORY_ACTION_GA4_TRACKING = {
    Berufserfahrung: 'Add',
    Elternzeit: 'Add - Parental Leave',
    Grundwehrdienst: 'Add - Military Service',
    Zivildienst: 'Add - Community Service',
    Sonstiges: 'Add - Other',
};

const props = defineProps({
    id: {
        type: Number,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    rows: workRows,
} = useState('profile/work');

const {
    updateField,
    CLEAR_NEW_ROWS: clear,
} = useMutations('profile/work');

const {
    submitted,
    category,
    current,
    employmentType,
    start,
    title,
    jobfield,
    company,
    end,
    description,
} = useComputedRowObjectProperties({
    updateField,
    objects: workRows,
    indexId: props.id,
});

const isLabelEmployer = computed(() => category.value.label === WORK_CATEGORY.BERUFSERFAHRUNG
    || category.value.label === WORK_CATEGORY.ELTERNZEIT);
const isCategoryParentalLeave = computed(() => category.value.label === WORK_CATEGORY.ELTERNZEIT);
const isCategoryWorkExperience = computed(() => category.value.label === WORK_CATEGORY.BERUFSERFAHRUNG);
const isCategoryMiscellaneous = computed(() => category.value.label === WORK_CATEGORY.SONSTIGES);

const workTitlePlaceholder = computed(() => {
    if (isCategoryWorkExperience.value) return 'Projektmanager*in, Software-Entwickler*in, ...';
    if (isCategoryMiscellaneous.value) return 'Was hast du gemacht?';
    return 'Kraftfahrer, Panzergrenadier, Küchengehilfe, ...';
});

const endDate = computed(() => {
    if (isCategoryWorkExperience.value) return 'Aktueller Arbeitgeber';
    if (isCategoryParentalLeave.value) return 'Bis jetzt';
    return 'Noch nicht abgeschlossen';
});

if (!props.id) {
    clear();
}

async function resetEndDate(checked) {
    current.value = checked;
    if (current.value) {
        // Wait for update of the date value.
        await nextTick();
        end.value = null;
    }
}

async function cleanTitle() {
    if (category.value.label === WORK_CATEGORY.ELTERNZEIT) title.value = '';
}

const endInput = ref(null);
function focusEnd(e) {
    if (e.target.nextSibling || e.target.value.length < 4) return;

    setTimeout(() => {
        endInput.value.$el.querySelector('input').focus();
    }, 0);
}

function trackClick({ label: workCategoryLabel }) {
    track({
        category: CATEGORIES.page.profile,
        action: ACTIONS.clickWithName(WORK_CATEGORY_ACTION[workCategoryLabel]),
        label: LABELS.click,
    });
    track({
        element: 'PR_L: Experience',
        elementDetail: WORK_CATEGORY_ACTION_GA4_TRACKING[workCategoryLabel],
        ga4Event: true,
    });
}

onMounted(() => trackClick({ label: WORK_CATEGORY.BERUFSERFAHRUNG }));

const validations = {
    title: {
        required: requiredIf(() => isCategoryWorkExperience.value || isCategoryMiscellaneous.value),
    },
    jobfield: {
        required: requiredIf(isCategoryWorkExperience),
    },
    company: {
        required: requiredIf(isCategoryWorkExperience),
    },
    start: {
        isoDate: isoDate(true, true, false),
        maxDate: maxDate(MAX_CURRENT_DATE),
        minDate: minDate(MIN_DATE),
        required,
    },
    end: {
        isoDate: isoDate(true, true, false),
        maxDate: validateIf(() => !current.value, maxDate(MAX_CURRENT_DATE)),
        minDate: minDate(MIN_DATE),
        required: requiredIf(/* istanbul ignore next: */ () => !current.value),
        /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        dateRange: validateIf(start, dateRange(start, end)),
    },
    description: {
        maxLength: maxLength(WORK_EXPERIENCE_MAX_LENGTH),
    },
};

const v$ = useVuelidate(validations, {
    title, jobfield, company, start, end, description,
});

const {
    save,
    dirty,
    markAsDirty,
    cancel,
} = useCvEditForm(props, emit, v$, submitted);

// Expose for unit tests
defineExpose({ workRows, title, description, end });
</script>

<template>
    <LayoutForm
        :inline="true"
        :full-page="false"
        class="c-formCvWorkExperience"
        data-qa="work experience form"
        @dirty="markAsDirty"
    >
        <template #info>
            <AppInfoBox
                v-if="id"
                hint
            >
                Überleg dir gut, wie sehr du hier ins Detail gehst. Ein Praktikums- oder Ferialjob ist oft
                nicht mehr relevant, wenn du bereits mehrere Jahre in anderen Positionen tätig warst.
            </AppInfoBox>
        </template>
        <FormSection>
            <template #headline>
                <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                <label for="category">
                    Welche Station möchtest du angeben?
                </label>
            </template>

            <FormElement>
                <FormPillSelect
                    id="category"
                    v-model="category"
                    name="workCategory"
                    :options="workTypes"
                    data-qa="work category select"
                    @trackClick="trackClick"
                />
            </FormElement>
        </FormSection>
        <FormSection>
            <FormElement v-if="!isCategoryParentalLeave">
                <template #start>
                    <FormLabel :for="$randomFieldId('work title')">
                        {{ isCategoryWorkExperience ? 'Position' : 'Bezeichnung' }}
                        {{ !isCategoryMiscellaneous && !isCategoryWorkExperience ? ' - optional' : '' }}
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId('work title')"
                    v-model="title"
                    :status="v$.title.$error ? 'error' : ''"
                    :allow-new="true"
                    :option-adapter="titleOptionAdapter"
                    :value-adapter="titleValueAdapter"
                    data-qa="work title"
                    aria-label="Bezeichnung der Position"
                    :placeholder="workTitlePlaceholder"
                    endpoint="jobs"
                    @blur="v$.title.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.title.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Position' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel :for="$randomFieldId('work title')">
                        {{ isLabelEmployer ? 'Arbeitgeber' : 'Organisation' }}
                        {{ isCategoryWorkExperience ? '' : ' - optional' }}
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId('company')"
                    v-model="company"
                    :status="v$.company.$error ? 'error' : ''"
                    :allow-new="true"
                    :autocomplete-adapter="autocompleteAdapter"
                    :option-adapter="companyOptionAdapter"
                    data-qa="company"
                    :aria-label="isLabelEmployer ? 'Name des Arbeitgebers' : 'Name der Organisation'"
                    :placeholder="isLabelEmployer ? 'Name des Arbeitgebers': 'Name der Organisation'"
                    endpoint="companies"
                    @blur="v$.company.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.company.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Arbeitgeber' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormRow
                v-if="isCategoryWorkExperience"
                split-half
            >
                <FormElement>
                    <template #start>
                        <FormLabel for="jobFields">
                            Berufsfeld
                        </FormLabel>
                    </template>
                    <FormSelect
                        v-model="jobfield"
                        :options="jobFieldTypes"
                        :status="v$.jobfield.$error ? 'error' : ''"
                        :option-adapter="workExperienceOptionsAdapter"
                        :value-adapter="workExperienceValueAdapter"
                        :allow-multiple="false"
                        placeholder="Berufsfeld wählen"
                        name="jobfields"
                        data-qa="job fields dropdown"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.jobfield.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.jobfield') }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="employmentType">
                            Anstellungsart - optional
                        </FormLabel>
                    </template>
                    <FormSelect
                        v-model="employmentType"
                        :options="jobEmploymentTypesWithDefaultOption"
                        :option-adapter="workExperienceOptionsAdapter"
                        :value-adapter="workExperienceValueAdapter"
                        :allow-multiple="false"
                        placeholder="Anstellungsart wählen"
                        name="employmentType"
                        data-qa="employments dropdown"
                    />
                </FormElement>
            </FormRow>
            <FormElement>
                <div class="c-formCvWorkExperience__duration">
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
                            ref="endInput"
                            v-model="end"
                            :show-day="false"
                            :disabled="current"
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
            <FormElement>
                <FormCheckbox
                    :checked="current"
                    data-qa="current checkbox"
                    @change="resetEndDate"
                >
                    {{ endDate }}
                </FormCheckbox>
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
                    :maxlength="WORK_EXPERIENCE_MAX_LENGTH"
                    :status="v$.description.$error ? 'error' : ''"
                    rows="6"
                    placeholder="Projekte, Tätigkeiten, Aufgabengebiete, ..."
                    data-qa="description"
                    @input.native="v$.description.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.description.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: WORK_EXPERIENCE_MAX_LENGTH }) }}
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
                    @click="cleanTitle(); save()"
                >
                    {{ id ? 'Änderungen speichern' : 'Berufserfahrung hinzufügen' }}
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

.c-formCvWorkExperience {
    &__duration {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }
}
</style>
