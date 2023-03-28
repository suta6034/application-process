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

import jobFieldTypes from '../../../data/job-field-types.json';
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
const minitaskJobFields = ref([]);
const validations = {
    minitaskJobFields: {
        required,
    },
};
const v$ = useVuelidate(validations, { minitaskJobFields });
const { validate } = useFormValidation(v$, root);

const {
    jobFields,
} = useState('profile/desiredJob');
const hasSelection = computed(() => minitaskJobFields.value.length !== 0);

const {
    markAsDirty,
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'desired-job-field',
    clickAction: 'desiredjob-field',
    validate,
    emit,
    onSave: () => { jobFields.value = minitaskJobFields.value; },
});

// Expose for unit tests
defineExpose({ dirty, minitaskJobFields });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskDesiredJob data-qa="illustration"/>
        </template>
        <template #headline>
            Wie sieht dein Wunschjob aus?
        </template>
        <template #content>
            Gib an, in welchen Bereichen du in den nächsten Jahren gerne arbeiten möchtest.
        </template>
        <template #interaction>
            <FormElement class="c-minitaskDesiredJobJobfield__formElement">
                <FormSelect
                    v-model="minitaskJobFields"
                    :small="true"
                    :options="jobFieldTypes"
                    :allow-multiple="true"
                    :option-adapter="desiredJobOptionsAdapter"
                    :value-adapter="desiredJobValueAdapter"
                    :status="v$.minitaskJobFields.$error ? 'error' : ''"
                    class="c-minitaskDesiredJobJobfield__formElement"
                    placeholder="Berufsfelder wählen"
                    name="jobfields"
                    data-qa="job fields dropdown"
                    @change="markAsDirty();v$.minitaskJobFields.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskJobFields.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', {
                                n: 1,
                                quantifier: 'ein',
                                fieldName: 'Berufsfeld',
                            }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <AppButton
                :disabled="!dirty || !hasSelection"
                width="condensed"
                slim
                class="c-minitaskDesiredJobJobfield__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Desired Job Field' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Desired Job Field' : undefined"
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
.c-minitaskDesiredJobJobfield {
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
