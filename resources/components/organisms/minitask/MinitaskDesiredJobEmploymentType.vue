<script setup>
import {
    computed, ref,
} from 'vue';
import {
    required,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    desiredJobOptionsAdapter,
    desiredJobValueAdapter,
} from '../../../store/modules/forms/desired-job';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import FormSelect from '../../molecules/form/FormSelect';
import IllustrationMinitaskDesiredJob from '../../illustrations/IllustrationMinitaskDesiredJob';

import jobEmploymentTypes from '../../../data/job-employment-types.json';

import '../../../lang/validation';
import {
    useFormValidation,
} from '../../../composables/form-validation';
import {
    minitaskEvents,
    useMinitaskEditForm,
} from '../../../composables/minitask-edit-form';
import {
    useState,
} from '../../../composables/vuex-helpers';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);

const root = ref(null);
const minitaskEmployment = ref([]);
const validations = {
    minitaskEmployment: {
        required,
    },
};
const v$ = useVuelidate(validations, { minitaskEmployment });
const { validate } = useFormValidation(v$, root);

const {
    employment,
} = useState('profile/desiredJob');

const hasSelection = computed(() => minitaskEmployment.value.length !== 0);

const {
    markAsDirty,
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'desired-job-employment-type',
    clickAction: 'desiredjob-employmenttype',
    validate,
    emit,
    onSave: () => { employment.value = minitaskEmployment.value; },
});

// Expose for unit tests
defineExpose({ dirty, minitaskEmployment });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskDesiredJob data-qa="illustration"/>
        </template>
        <template #headline>
            Dein Wunschjob: Vollzeit oder Teilzeit?
        </template>
        <template #content>
            Gib deine bevorzugte Anstellungsart ein und erhalte noch passendere Jobangebote.
        </template>
        <template #interaction>
            <FormElement class="c-minitaskDesiredJobEmploymentType__formElement">
                <FormSelect
                    v-model="minitaskEmployment"
                    :small="true"
                    :options="jobEmploymentTypes"
                    :option-adapter="desiredJobOptionsAdapter"
                    :value-adapter="desiredJobValueAdapter"
                    :allow-multiple="true"
                    :status="v$.minitaskEmployment.$error ? 'error' : ''"
                    placeholder="Anstellungsarten wählen"
                    name="employments"
                    data-qa="employments dropdown"
                    @change="markAsDirty();v$.minitaskEmployment.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskEmployment.$error"
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
            <AppButton
                :disabled="!dirty || !hasSelection"
                width="condensed"
                slim
                class="c-minitaskDesiredJobEmploymentType__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Desired Job Employment Type' : undefined"
                @click="saveData"
            >
                Übernehmen
            </AppButton>
            <AppButton
                width="condensed"
                slim
                outline
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Desired Job Employment Type' : undefined"
                @click="skipped"
            >
                Später
            </AppButton>
        </template>
        <template #collapse-content>
            Je vollständiger dein Lebenslauf ist, desto mehr Chancen hast du.
        </template>
    </AppCollapseBox>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

// 1. Prevent that the select element increases and breaks the style
.c-minitaskDesiredJobEmploymentType {
    $select-width: 19em;

    &__formElement {
        @media (min-width: $k-breakpoint--m) {
            width: $select-width; // 1.
        }
    }

    .c-appCollapseBox__interaction &__firstButton {
        margin-top: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-top: 0;
        }
    }
}
</style>
