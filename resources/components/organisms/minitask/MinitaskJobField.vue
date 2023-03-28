<script setup>
import {
    computed, ref, watch,
} from 'vue';
import {
    required,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    formatDate,
} from '../../../utils/filter';

import jobFieldTypes from '../../../data/job-field-types.json';
import {
    workExperienceOptionsAdapter,
    workExperienceValueAdapter,
} from '../../../store/modules/forms/work';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import FormSelect from '../../molecules/form/FormSelect';
import IllustrationMinitaskWorkEmployer from '../../illustrations/IllustrationMinitaskWorkEmployer';
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

const props = defineProps({
    id: {
        type: Number,
    },
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);

const root = ref(null);
const minitaskJobField = ref('');
const validations = {
    minitaskJobField: {
        required,
    },
};
const v$ = useVuelidate(validations, { minitaskJobField });
const { validate } = useFormValidation(v$, root);

const {
    rows: workExperiences,
} = useState('profile/work');

const work = computed(() => {
    const rowWithMatchingId = workExperiences.value.find(({ id }) => id === props.id);
    const newEntryRow = workExperiences.value.slice(-1)[0];

    return rowWithMatchingId || newEntryRow;
});

const hasEndDate = computed(() => work.value.end !== null);

const {
    saveData,
    skipped,
    markAsDirty,
    dirty,
} = useMinitaskEditForm({
    key: 'job-field',
    clickAction: 'employer-field',
    validate,
    emit,
    onSave: () => {
        work.value.jobfield = minitaskJobField.value;
        minitaskJobField.value = '';
        v$.value.$reset();
    },
});

watch(minitaskJobField, () => {
    if (minitaskJobField.value.title?.length > 0) markAsDirty();
    else dirty.value = false;
});

// Expose for unit tests
defineExpose({ dirty });
</script>

<template>
    <AppCollapseBox class="c-minitaskJobField">
        <template #media>
            <IllustrationMinitaskWorkEmployer data-qa="illustration"/>
        </template>
        <template #headline>
            <template v-if="hasEndDate">
                In welchem Berufsfeld hast du im Zeitraum von {{ formatDate({ date: work.start, format: 'F Y' }) }}
                bis {{ formatDate({ date: work.end, format: 'F Y' }) }} bei {{ work.company.label }} gearbeitet?
            </template>
            <template v-else>
                In welchem Berufsfeld arbeitest du bei {{ work.company.label }}?
            </template>
        </template>
        <template #interaction>
            <FormElement class="c-minitaskJobField__inputWrap">
                <FormSelect
                    :id="$randomFieldId('work jobfield' + minitaskJobField)"
                    v-model="minitaskJobField"
                    :options="jobFieldTypes"
                    :status="v$.minitaskJobField.$error ? 'error' : ''"
                    :option-adapter="workExperienceOptionsAdapter"
                    :value-adapter="workExperienceValueAdapter"
                    :allow-multiple="false"
                    :small="true"
                    placeholder="Berufsfeld wählen"
                    name="jobfields"
                    data-qa="job fields dropdown"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskJobField.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.jobfield') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <AppButton
                :disabled="!dirty"
                data-qa="save button"
                width="condensed"
                slim
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Employer Field' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Employer Field' : undefined"
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

.c-minitaskJobField {
    $input-width: 19em;

    &.inactive {
        display: none;
    }

    &__inputWrap {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width;
        }
    }
}
</style>
