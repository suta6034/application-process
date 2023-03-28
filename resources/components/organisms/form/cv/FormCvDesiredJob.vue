<script setup>
import {
    onMounted,
    onUnmounted,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    integer,
    maxValue,
    minLength,
    required,
} from '@vuelidate/validators';
import {
    desiredJobOptionsAdapter,
    desiredJobValueAdapter,
    locationAutocompleteAdapter,
    objectiveOptionAdapter,
    objectiveValueAdapter,
    salaryFormatAdapter,
    salaryValueAdapter,
    termOfNoticeValueAdapter,
} from '../../../../store/modules/forms/desired-job';
import {
    TERM_OF_NOTICE_OPTIONS,
    TRAVEL_READINESS_OPTIONS,
    WORKFROMHOME_OPTIONS,
} from '../../../../models/DesiredJob';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import AppList from '../../../atoms/app/AppList';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormCheckbox from '../../../atoms/form/FormCheckbox';
import FormElement from '../../../molecules/form/FormElement';
import FormFlag from '../../../atoms/form/FormFlag';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormRow from '../../../molecules/form/FormRow';
import FormSection from '../../../molecules/form/FormSection';
import FormSelect from '../../../molecules/form/FormSelect';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import LayoutForm from '../../../layouts/LayoutForm';

import jobBranchTypes from '../../../../data/job-branch-types.json';
import jobEmploymentTypes from '../../../../data/job-employment-types.json';
import jobFieldTypes from '../../../../data/job-field-types.json';
import suggestedJobs from '../../../../data/suggested-jobs.json';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    cvEditFormEvents, useCvEditForm,
} from '../../../../composables/cv-edit-form';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const MIN_JOBS = 1;
const MAX_JOBS = 25;
const MIN_LOCATIONS = 1;
const MAX_LOCATIONS = 25;
const MAX_SALARY = 15000;

const props = defineProps({
    standalone: {
        type: Boolean,
        default: false,
    },
    target: {
        type: String,
    },
    matching: {
        type: [Boolean, String],
        default: false,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    branches,
    employment,
    jobFields,
    locations,
    migrate,
    objectives,
    salary,
    termOfNotice,
    travelReadiness,
    workFromHome,
} = useState('profile/desiredJob');

const validations = {
    employment: {
        required,
    },
    jobFields: {
        required,
    },
    locations: {
        required,
        minLength: minLength(MIN_LOCATIONS),
    },
    objectives: {
        required,
        minLength: minLength(MIN_JOBS),
    },
    salary: {
        integer,
        maxValue: maxValue(MAX_SALARY),
    },
};

const v$ = useVuelidate(validations, { employment, jobFields, locations, objectives, salary });
const {
    dirty,
    cancel,
    markAsDirty,
    save,
    sendMessageToK4,
    beforeRouteLeaveCustom,
} = useCvEditForm(props, emit, v$);

function onMigrateChange(event) { migrate.value = event; }

if (props.matching) {
    const callback = (event) => {
        /* istanbul ignore next */
        if (event.key === 'Escape' || event.key === 'Esc') {
            sendMessageToK4('closeButton');
        }
    };
    /* istanbul ignore next */
    onMounted(() => document.addEventListener('keyup', callback));
    onUnmounted(() => document.removeEventListener('keyup', callback));
}

// Called in PageCvDesiredJobForm (k4 matching)
defineExpose({ beforeRouteLeaveCustom });
</script>

<template>
    <LayoutForm
        ref="root"
        class="c-formCvDesiredJob"
        :full-page="standalone"
        :inline="!standalone"
        @dirty="markAsDirty"
    >
        <template
            v-if="standalone"
            #headline
        >
            Wunschjob
        </template>

        <template #info>
            <AppInfoBox hint>
                Mit der Angabe eines Wunschjobs erhältst du noch passendere
                Job-Angebote von potenziellen Arbeitgebern.
                <template #more>
                    <p>Gut zu wissen:</p>
                    <AppList>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Dein Wunschjob dient als ergänzende Information für Arbeitgeber,
                                wenn dein Lebenslauf aktiv und für Unternehmen sichtbar ist.
                            </span>
                        </li>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Ist dein Lebenslauf inaktiv und für Unternehmen nicht sichtbar,
                                bleiben diese Informationen natürlich verdeckt.
                            </span>
                        </li>
                    </AppList>
                </template>
            </AppInfoBox>
        </template>

        <FormSection>
            <template #headline>
                Was möchtest du gerne machen?&nbsp;<FormFlag>*</FormFlag>
            </template>
            <FormElement>
                <FormSuggestionSelect
                    v-model="objectives"
                    :allow-new="true"
                    :auto-select-on-separator="true"
                    :enable-primary-action="false"
                    :max="MAX_JOBS"
                    :option-adapter="objectiveOptionAdapter"
                    :value-adapter="objectiveValueAdapter"
                    :options="suggestedJobs"
                    :status="v$.objectives.$error ? 'error' : ''"
                    placeholder="Tätigkeit eingeben oder Vorschlag wählen"
                    data-qa="objectives"
                    endpoint="jobs"
                    @change="markAsDirty();v$.objectives.$touch()"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct') }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_JOBS, fieldName: 'Wunschjobs' }) }}
                    </template>
                </FormSuggestionSelect>
                <template #end>
                    <FormMessage
                        v-if="v$.objectives.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', { n: MIN_JOBS, fieldName: 'Wunschjob' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection>
            <FormElement>
                <template #start>
                    <FormLabel
                        for="employments"
                        required
                    >
                        Anstellungsart
                    </FormLabel>
                </template>
                <FormSelect
                    id="employments"
                    v-model="employment"
                    :options="jobEmploymentTypes"
                    :option-adapter="desiredJobOptionsAdapter"
                    :value-adapter="desiredJobValueAdapter"
                    :allow-multiple="true"
                    :status="v$.employment.$error ? 'error' : ''"
                    placeholder="Anstellungsarten wählen"
                    name="employments"
                    data-qa="employments dropdown"
                    @change="v$.employment.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.employment.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', {
                                n: 1,
                                quantifier: 'eine',
                                fieldName: 'Anstellungsart',
                            }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel
                        for="jobFields"
                        required
                    >
                        Berufsfelder
                    </FormLabel>
                </template>
                <FormSelect
                    v-model="jobFields"
                    :options="jobFieldTypes"
                    :option-adapter="desiredJobOptionsAdapter"
                    :value-adapter="desiredJobValueAdapter"
                    :allow-multiple="true"
                    :status="v$.jobFields.$error ? 'error' : ''"
                    placeholder="Berufsfelder wählen"
                    name="jobfields"
                    data-qa="job fields dropdown"
                    @change="v$.jobFields.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.jobFields.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', { n: 1, quantifier: 'ein', fieldName: 'Berufsfeld' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel for="branches">
                        Branchen
                    </FormLabel>
                </template>
                <FormSelect
                    v-model="branches"
                    :options="jobBranchTypes"
                    :option-adapter="desiredJobOptionsAdapter"
                    :value-adapter="desiredJobValueAdapter"
                    :allow-multiple="true"
                    placeholder="Branchen wählen"
                    name="branches"
                    data-qa="branches dropdown"
                />
            </FormElement>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel for="salary">
                            Brutto-Monatsgehalt min.
                        </FormLabel>
                    </template>
                    <FormInput
                        id="salary"
                        v-model="salary"
                        :limit="6"
                        :format-adapter="salaryFormatAdapter"
                        :value-adapter="salaryValueAdapter"
                        :status="v$.salary.$error ? 'error' : ''"
                        data-qa="salary"
                        aria-label="Brutto-Monatsgehalt Minimum"
                        placeholder="Wunschgehalt"
                        min="0"
                        type="tel"
                        @blur="v$.salary.$touch();"
                    >
                        <template #start>
                            <AppIcon
                                class="c-formCvDesiredJob__icon"
                                name="euro"
                            />
                        </template>
                    </FormInput>
                    <template #end>
                        <FormMessage
                            v-if="v$.salary.$error"
                            type="error"
                        >
                            <li v-if="!v$.salary.integer">
                                {{ $t('validation.numeric') }}
                            </li>
                            <li v-if="!v$.salary.maxValue">
                                {{ `Bitte gib einen Wert unter € ${MAX_SALARY.toLocaleString('de')} an.` }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="time">
                            Verfügbarkeit ab
                        </FormLabel>
                    </template>
                    <FormSelect
                        id="time"
                        v-model="termOfNotice"
                        :options="TERM_OF_NOTICE_OPTIONS"
                        :value-adapter="termOfNoticeValueAdapter"
                        placeholder="Zeitpunkt wählen"
                        name="term of notice"
                        data-qa="term of notice dropdown"
                    />
                </FormElement>
            </FormRow>
        </FormSection>

        <FormSection id="desired-job-location">
            <template #headline>
                Wo möchtest du arbeiten?&nbsp;<FormFlag>*</FormFlag>
            </template>
            <FormElement>
                <FormSuggestionSelect
                    v-model="locations"
                    :enable-primary-action="false"
                    :max="MAX_LOCATIONS"
                    :autocomplete-adapter="locationAutocompleteAdapter"
                    :status="v$.locations.$error ? 'error' : ''"
                    placeholder="Bevorzugter Arbeitsort"
                    data-qa="locations"
                    endpoint="locations"
                    @change="markAsDirty();v$.locations.$touch()"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct', { fieldName: 'Wunscharbeitsort' }) }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_LOCATIONS, fieldName: 'Wunscharbeitsorten' }) }}
                    </template>
                </FormSuggestionSelect>
                <template #end>
                    <FormMessage
                        v-if="v$.locations.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', { n: MIN_LOCATIONS, fieldName: 'Wunscharbeitsort' }) }}
                        </li>
                    </FormMessage>
                </template>
                <FormCheckbox
                    :checked="migrate"
                    :true-value="1"
                    :false-value="0"
                    class="c-formCvDesiredJob__checkbox"
                    data-qa="migrate checkbox"
                    @change="onMigrateChange"
                >
                    Ich bin bereit, für den richtigen Job auch umzuziehen
                </FormCheckbox>
            </FormElement>
        </FormSection>

        <FormSection id="work-from-home-travel-readiness">
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel for="work-from-home-per-week">
                            Homeoffice pro Woche
                        </FormLabel>
                    </template>
                    <FormSelect
                        id="work-from-home-per-week"
                        v-model="workFromHome"
                        :options="WORKFROMHOME_OPTIONS"
                        placeholder="Anzahl der Tage"
                        name="workFromHome"
                        data-qa="work-from-home dropdown"
                    />
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="travel-readiness-per-week">
                            Reisebereitschaft pro Woche
                        </FormLabel>
                    </template>
                    <FormSelect
                        id="travel-readiness-per-week"
                        v-model="travelReadiness"
                        :options="TRAVEL_READINESS_OPTIONS"
                        placeholder="Anzahl der Tage"
                        name="travel readiness"
                        data-qa="travel readiness dropdown"
                    />
                </FormElement>
            </FormRow>
        </FormSection>

        <template #actions>
            <AppButtonGroup v-if="standalone">
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save({ name: 'page-cv' }, matching)"
                >
                    Änderungen speichern
                </AppButton>
                <template #secondary>
                    <AppLink
                        v-if="!matching"
                        :to="{ name: 'page-cv' }"
                        data-qa="back link"
                    >
                        Zurück zum Lebenslauf
                    </AppLink>
                    <AppLink
                        v-else
                        tag="button"
                        @click="sendMessageToK4('closeButton')"
                    >
                        Zurück zu den Job-Empfehlungen
                    </AppLink>
                </template>
            </AppButtonGroup>
            <AppButtonGroup
                v-else
                variant="right"
            >
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save('', matching)"
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

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/color';
@import '~@karriereat/global-styles/scss/settings/spacing';

.c-formCvDesiredJob {
    &__checkbox {
        display: flex;
        align-items: center;
        margin-top: $k-spacing--l;
    }

    &__icon {
        color: $k-color-gray--500;
    }

    &__hiddenLabel {
        display: none;
    }
}
</style>
