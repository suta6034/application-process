<script setup>
import {
    computed, nextTick, onBeforeMount, onMounted, ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required,
    requiredIf,
} from '@vuelidate/validators';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../../utils/tracking';
import {
    dateRange,
    isoDate,
    maxDate,
    minDate,
    validateIf,
} from '../../../../utils/validators';
import {
    WORK_CATEGORY,
    autocompleteAdapter,
    companyOptionAdapter,
    titleOptionAdapter,
    titleValueAdapter,
    workExperienceOptionsAdapter,
    workExperienceValueAdapter,
} from '../../../../store/modules/forms/work';

import FormCheckbox from '../../../atoms/form/FormCheckbox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormFilterSelect from '../../../molecules/form/FormFilterSelect';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormPillSelect from '../../../molecules/form/FormPillSelect';
import FormSection from '../../../molecules/form/FormSection';
import LayoutForm from '../../../layouts/LayoutForm';
import FormSelect from '../../../molecules/form/FormSelect';
import jobFieldTypes from '../../../../data/job-field-types.json';
import workTypes from '../../../../data/work-types.json';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    useComputedObjectProperties, useMutations,
    useState,
} from '../../../../composables/vuex-helpers';

const MAX_CURRENT_DATE = new Date();
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));

const {
    rows: workRows,
} = useState('profileCreate/work');
const {
    updateField,
} = useMutations('profileCreate/work');

const work = computed(() => workRows.value[0]);
const {
    current,
    category,
    submitted,
    start,
    end,
    title,
    jobfield,
    company,
} = useComputedObjectProperties({
    object: work,
    updateField,
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

const endDateText = computed(() => {
    if (isCategoryWorkExperience.value) return 'Aktueller Arbeitgeber';
    if (isCategoryParentalLeave.value) return 'Bis jetzt';
    return 'Noch nicht abgeschlossen';
});

async function resetEndDate(checked) {
    current.value = checked;
    if (current.value) {
        // Wait for update of the date value.
        await nextTick();
        end.value = null;
    }
}

const endInput = ref(null);
function focusEnd(e) {
    if (e.target.nextSibling || e.target.value.length < 4) return;

    setTimeout(() => {
        endInput.value.$el.querySelector('input').focus();
    }, 0);
}

function trackClick({ label }) {
    let action;

    switch (label) {
    case WORK_CATEGORY.BERUFSERFAHRUNG:
        action = 'experience-add-experience';
        break;
    case WORK_CATEGORY.ELTERNZEIT:
        action = 'experience-add-parental-leave';
        break;
    case WORK_CATEGORY.GRUNDWEHRDIENST:
        action = 'experience-add-military-service';
        break;
    case WORK_CATEGORY.ZIVILDIENST:
        action = 'experience-add-community-service';
        break;
    case WORK_CATEGORY.SONSTIGES:
        action = 'experience-add-other';
        break;
    default:
        action = 'experience-add-experience';
    }

    track({
        category: CATEGORIES.page.profile,
        action: ACTIONS.clickWithName(action),
        label: LABELS.click,
    });
}

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
        required,
        isoDate: isoDate(true, true, false),
        maxDate: maxDate(MAX_CURRENT_DATE),
        minDate: minDate(MIN_DATE),
    },
    end: {
        required: requiredIf(/* istanbul ignore next: */ () => !current.value),
        isoDate: isoDate(true, true, false),
        maxDate: validateIf(() => !current.value, maxDate(MAX_CURRENT_DATE)),
        minDate: minDate(MIN_DATE),
        /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        dateRange: validateIf(start, dateRange(start, end)),
    },
};
const v$ = useVuelidate(validations, { title, jobfield, company, start, end });

onBeforeMount(() => {
    submitted.value = false;
});

onMounted(() => {
    // DOM mounted = opened pill select form, Berufserfahrung is selected as default.
    trackClick({ label: WORK_CATEGORY.BERUFSERFAHRUNG });
});

// Expose for parents & unit tests
defineExpose({ v$, submitted, end, current });
</script>

<template>
    <LayoutForm
        class="c-formProfileCreateWork"
        :full-page="false"
    >
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
            <FormElement
                v-if="!isCategoryParentalLeave"
            >
                <template #start>
                    <FormLabel :for="$randomFieldId('work-title')">
                        {{ isCategoryWorkExperience ? 'Position' : 'Bezeichnung' }}
                        {{ !isCategoryMiscellaneous && !isCategoryWorkExperience ? ' - optional' : '' }}
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId('work-title')"
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
            <FormElement
                data-qa="jobfield"
            >
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
                    @blur="v$.jobfield.$touch()"
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
                    <FormLabel :for="$randomFieldId(`company`)">
                        {{ isLabelEmployer ? 'Arbeitgeber' : 'Organisation' }}
                        {{ isCategoryWorkExperience ? '' : ' - optional' }}
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId(`company`)"
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
        </FormSection>

        <FormSection>
            <template #headline>
                In welchem Zeitraum warst du dort beschäftigt?
            </template>
            <FormElement>
                <div class="c-formProfileCreateWork__duration">
                    <FormElement>
                        <template #start>
                            <FormLabel for="start">
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
                    {{ endDateText }}
                </FormCheckbox>
            </FormElement>
        </FormSection>
    </LayoutForm>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/spacing';

.c-formProfileCreateWork {
    &__duration {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }
}
</style>
