<script setup>
import {
    computed, ref,
} from 'vue';
import {
    required,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    formatDate,
} from '../../../utils/filter';
import {
    titleOptionAdapter,
    titleValueAdapter,
} from '../../../store/modules/forms/work';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormElement from '../../molecules/form/FormElement';
import FormFilterSelect from '../../molecules/form/FormFilterSelect';
import FormMessage from '../../atoms/form/FormMessage';
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
const minitaskJobTitle = ref({ label: '' });
const validations = {
    minitaskJobTitle: {
        required,
    },
};
const v$ = useVuelidate(validations, { minitaskJobTitle });
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
    markAsDirty,
    dirty,
    skipped,
} = useMinitaskEditForm({
    key: 'job-title',
    clickAction: 'employer-position',
    validate,
    emit,
    onSave: () => {
        work.value.title = minitaskJobTitle.value;
        minitaskJobTitle.value = { label: '' };
        v$.value.$reset();
    },
});

function jobTitleInputHandler() {
    if (minitaskJobTitle.value?.label?.length > 0) markAsDirty();
    else dirty.value = false;
}

// Expose for unit tests
defineExpose({ dirty });
</script>

<template>
    <AppCollapseBox class="c-minitaskJobTitle">
        <template #media>
            <IllustrationMinitaskWorkEmployer data-qa="illustration"/>
        </template>
        <template #headline>
            <template v-if="hasEndDate">
                In welcher Position hast du im Zeitraum von {{ formatDate({ date: work.start, format: 'F Y' }) }}
                bis {{ formatDate({ date: work.end, format: 'F Y' }) }} bei {{ work.company.label }} gearbeitet?
            </template>
            <template v-else>
                In welcher Position arbeitest du bei {{ work.company.label }}?
            </template>
        </template>
        <template #interaction>
            <FormElement class="c-minitaskJobTitle__inputWrap">
                <FormFilterSelect
                    :id="$randomFieldId('work title' + work.id)"
                    v-model="minitaskJobTitle"
                    :status="v$.minitaskJobTitle.$error ? 'error' : ''"
                    :allow-new="true"
                    :option-adapter="titleOptionAdapter"
                    :value-adapter="titleValueAdapter"
                    :small="true"
                    data-qa="work title"
                    aria-label="Bezeichnung der Position"
                    placeholder="Projektmanager*in, Software-Entwickler*in, ..."
                    endpoint="jobs"
                    @change="jobTitleInputHandler"
                    @blur="v$.minitaskJobTitle.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskJobTitle.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.title') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Employer Position' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Employer Position' : undefined"
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

.c-minitaskJobTitle {
    $input-width: 19em;

    &__inputWrap {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width;
        }
    }
}
</style>
