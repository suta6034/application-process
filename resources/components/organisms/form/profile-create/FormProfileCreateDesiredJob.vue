<script setup>
import {
    required,
} from '@vuelidate/validators';

import {
    computed, ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    locationAutocompleteAdapter,
    objectiveOptionAdapter,
    objectiveValueAdapter,
} from '../../../../store/modules/forms/desired-job';

import FormElement from '../../../molecules/form/FormElement';
import FormFilterSelect from '../../../molecules/form/FormFilterSelect';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';

import {
    useState,
} from '../../../../composables/vuex-helpers';

const locationHasInvalidValue = ref(false);

const {
    locations,
    objectives,
} = useState('profileCreate/desiredJob');

const location = computed({
    get() {
        return locations.value[0] || '';
    },
    set(value) {
        locations.value = [value];
    },
});

const objective = computed({
    get() {
        return objectives.value[0];
    },
    set(value) {
        objectives.value = [value];
    },
});

const validations = {
    objective: {
        required,
    },
    location: {
        required,
    },
    $validationGroups: {
        desiredJobSection: ['objective', 'location'],
    },
};

const v$ = useVuelidate(validations, { objective, location });

defineExpose({ v$ });
</script>

<template>
    <LayoutForm
        class="c-formProfileCreateDesiredJob"
        :full-page="false"
    >
        <FormSection
            headline="large"
            class="c-formProfileCreateDesiredJob__form"
            data-qa="desired job section"
        >
            <template #headline>
                Was ist dein Wunschjob?
            </template>
            <p class="c-formProfileCreateDesiredJob__info">
                Du erhältst so noch passendere Job-Angebote. Dein Wunschjob ist natürlich nicht auf deinem
                Lebenslauf sichtbar.
            </p>
            <FormElement>
                <template #start>
                    <FormLabel :for="$randomFieldId('desired-job-objectives')">
                        Wunschjob
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId('desired-job-objectives')"
                    v-model="objective"
                    :status="v$.objective.$error ? 'error' : ''"
                    :allow-new="true"
                    :option-adapter="objectiveOptionAdapter"
                    :value-adapter="objectiveValueAdapter"
                    aria-label="Wunschjob"
                    placeholder="z.B. Software-Entwickler*in"
                    endpoint="jobs"
                    data-qa="desired job objectives"
                    @blur="v$.objective.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.objective.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Wunschjob' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel :for="$randomFieldId('desired-job-locations')">
                        Wunsch-Arbeitsort
                    </FormLabel>
                </template>
                <FormFilterSelect
                    :id="$randomFieldId('desired-job-locations')"
                    v-model="location"
                    :invalid.sync="locationHasInvalidValue"
                    :status="v$.location.$error || locationHasInvalidValue ? 'error' : ''"
                    :autocomplete-adapter="locationAutocompleteAdapter"
                    aria-label="Wunsch-Arbeitsort"
                    placeholder="z.B. Linz, Großraum Wien"
                    endpoint="locations"
                    data-qa="desired job locations"
                    @blur="v$.location.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.location.$error || locationHasInvalidValue"
                        type="error"
                    >
                        <li v-if="locationHasInvalidValue">
                            {{ $t('validation.invalidSelection', { fieldName: 'Ort' }) }}
                        </li>
                        <li v-if="!locationHasInvalidValue && v$.location.$error">
                            {{ $t('validation.required', { fieldName: 'Wunsch-Arbeitsort' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>
    </LayoutForm>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/index';
@import '~@karriereat/global-styles/scss/settings/color';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/spacing';

.c-formProfileCreateDesiredJob {
    &__headline {
        margin-top: $k-spacing--xl;
        text-align: center;
    }

    &__subheadline {
        margin-top: $k-spacing--s;
        text-align: center;
        color: $k-color-gray--500;
    }

    &__infoBox {
        margin-top: $k-spacing--2xl;
    }

    &__info {
        padding-top: $k-spacing--s;
        color: $k-color-gray--600;
    }

    &__form {
        margin-top: $k-spacing--xl;
    }

    &__actions {
        margin-top: $k-spacing--l;
        text-align: center;
    }
}
</style>
