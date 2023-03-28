<script setup>
import {
    computed,
    onBeforeMount, onBeforeUnmount,
    ref,
    watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required,
    maxLength,
} from '@vuelidate/validators';

import {
    isoDate,
    maxDate,
    minDate,
    url,
} from '../../../utils/validators';
import mitt from '../../../utils/mitt';

import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import FormDatePicker from '../../molecules/form/FormDatePicker';
import FormElement from '../../molecules/form/FormElement';
import FormFilterSelect from '../../molecules/form/FormFilterSelect';
import FormSuggestedCompanies from '../../molecules/form/FormSuggestedCompanies';
import FormInput from '../../atoms/form/FormInput';
import FormLabel from '../../atoms/form/FormLabel';
import FormMessage from '../../atoms/form/FormMessage';
import FormRow from '../../molecules/form/FormRow';
import FormSection from '../../molecules/form/FormSection';
import FormTextareaLimited from '../../atoms/form/FormTextareaLimited';

import '../../../lang/notification';
import '../../../lang/validation';
import {
    useFormValidation,
} from '../../../composables/form-validation';

// We need to create a new max date every time the component is rendered because
// otherwise the default date of the application will be newer than this one.
const MAX_CURRENT_DATE = () => new Date(Date.now());
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const MAX_LENGTH_FIELD = 255;
const MAX_LENGTH_MEMO = 500;
const MAX_LENGTH_MESSAGE = 1000;

const props = defineProps({
    value: {
        type: Object,
    },
});

const emit = defineEmits(['dirty', 'input', 'save', 'remove']);

const isCreateMode = computed(() => !props.value.id);
const applicationFormData = ref(JSON.parse(JSON.stringify(props.value)));

const company = computed({
    get() {
        return {
            id: applicationFormData.value.company?.id,
            label: applicationFormData.value.company?.id
                ? applicationFormData.value.company?.name
                : applicationFormData.value.companyName,
        };
    },
    set(value) {
        if (value.id) {
            applicationFormData.value.company = value;
            applicationFormData.value.companyName = value.name;
        } else {
            applicationFormData.value.company = {};
            applicationFormData.value.companyName = value.label;
        }
    },
});

const hasSuggestedCompanies = ref(false);
const isSuggestedCompaniesActive = ref(false);
const activateSuggestedCompanies = () => {
    isSuggestedCompaniesActive.value = !company.value.id && company.value.label?.length > 2;
};

const companyAutocompleteAdapter = ({ id, label }) => ({
    id,
    name: label,
    type: 'company',
});
const companyOptionAdapter = ({ id, label }) => ({
    id,
    label,
    value: id,
});

const locationAutocompleteAdapter = ({ label }) => label;
const locationOptionAdapter = label => ({
    id: label,
    label,
    value: label,
});
const locationValueAdapter = label => label;

const markAsDirty = () => {
    emit('dirty');
};

watch(applicationFormData, () => {
    emit('input', applicationFormData.value);
}, { deep: true });

const validations = {
    company: {
        required(value) {
            return Boolean(value?.label);
        },
        maxLength(value) {
            if (!value.label) return true;

            return value.label.length <= MAX_LENGTH_FIELD;
        },
    },
    applicationFormData: {
        jobTitle: {
            required,
            maxLength: maxLength(MAX_LENGTH_FIELD),
        },
        jobLocation: {
            maxLength: maxLength(MAX_LENGTH_FIELD),
        },
        jobUrl: {
            url,
            maxLength: maxLength(MAX_LENGTH_FIELD),
        },
        createDate: {
            required,
            isoDate: isoDate(true, true, false),
            maxDate: maxDate(MAX_CURRENT_DATE()),
            minDate: minDate(MIN_DATE),
        },
        message: {
            maxLength: maxLength(MAX_LENGTH_MESSAGE),
        },
        memo: {
            maxLength: maxLength(MAX_LENGTH_MEMO),
        },
    },
};

const v$ = useVuelidate(validations, { company, applicationFormData });
const root = ref(null);
const { validate } = useFormValidation(v$, root);

function validateAndSave() {
    if (validate()) emit('save');
}

onBeforeMount(() => {
    mitt.on('save-form-data', validateAndSave);
});

onBeforeUnmount(() => {
    mitt.off('save-form-data', validateAndSave);
});
</script>

<template>
    <div
        ref="root"
        class="c-formApplicationEdit"
        @change.capture="markAsDirty"
        @input.capture="markAsDirty"
    >
        <FormSection>
            <FormElement>
                <template #start>
                    <FormLabel
                        for="job title"
                        required
                    >
                        Position
                    </FormLabel>
                </template>
                <FormInput
                    id="job title"
                    v-model="applicationFormData.jobTitle"
                    :status="v$.applicationFormData.jobTitle.$error ? 'error' : ''"
                    aria-label="Bezeichnung der Position"
                    placeholder="Projektmanager*in, Software-Entwickler*in, ..."
                    data-qa="job title"
                    @blur="v$.applicationFormData.jobTitle.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.applicationFormData.jobTitle.$error"
                        type="error"
                    >
                        <li v-if="!v$.applicationFormData.jobTitle.required">
                            {{ $t('validation.required', { fieldName: 'Position' }) }}
                        </li>
                        <li v-if="!v$.applicationFormData.jobTitle.maxLength">
                            {{ $t('validation.maxLength', { n: MAX_LENGTH_FIELD }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormRow
                reset
                split-half
            >
                <FormElement>
                    <template #start>
                        <FormLabel
                            :for="$randomFieldId('company')"
                            required
                        >
                            Firma
                        </FormLabel>
                    </template>
                    <FormFilterSelect
                        :id="$randomFieldId('company')"
                        v-model="company"
                        aria-label="Name der Firma"
                        :status="v$.company.$error ? 'error' : ''"
                        :allow-new="true"
                        :autocomplete-adapter="companyAutocompleteAdapter"
                        :option-adapter="companyOptionAdapter"
                        :input-limit="MAX_LENGTH_FIELD"
                        placeholder="Name der Firma"
                        endpoint="companies"
                        data-qa="company"
                        @blur="activateSuggestedCompanies(); v$.company.$touch()"
                    />
                    <FormSuggestedCompanies
                        v-if="isSuggestedCompaniesActive"
                        :company="company"
                        class="c-formApplicationEdit__suggestionsMobile"
                        @input="company = $event"
                        @discard="isSuggestedCompaniesActive = false"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.company.$error"
                            type="error"
                        >
                            <li v-if="!v$.company.required">
                                {{ $t('validation.required', { fieldName: 'Firma' }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel :for="$randomFieldId('job location')">
                            Standort
                        </FormLabel>
                    </template>
                    <FormFilterSelect
                        :id="$randomFieldId('job location')"
                        v-model="applicationFormData.jobLocation"
                        :status="v$.applicationFormData.jobLocation.$error ? 'error' : ''"
                        :allow-new="true"
                        :autocomplete-adapter="locationAutocompleteAdapter"
                        :option-adapter="locationOptionAdapter"
                        :value-adapter="locationValueAdapter"
                        :input-limit="MAX_LENGTH_FIELD"
                        aria-label="Standort der Firma"
                        placeholder="z.B. Linz"
                        endpoint="locations"
                        data-qa="job location"
                        @blur="v$.applicationFormData.jobLocation.$touch()"
                    />
                </FormElement>
            </FormRow>
            <FormElement
                v-if="isSuggestedCompaniesActive"
                v-show="hasSuggestedCompanies"
                class="c-formApplicationEdit__suggestionsDesktop"
            >
                <FormSuggestedCompanies
                    :company="company"
                    :has-suggestions.sync="hasSuggestedCompanies"
                    @input="company = $event"
                    @discard="isSuggestedCompaniesActive = false"
                />
            </FormElement>
            <FormRow
                reset
                split-first-big
            >
                <FormElement>
                    <template #start>
                        <FormLabel for="url">
                            URL
                        </FormLabel>
                    </template>
                    <FormInput
                        id="url"
                        v-model="applicationFormData.jobUrl"
                        aria-label="Link zum Job"
                        placeholder="https://www.beispiel-link.at"
                        :status="v$.applicationFormData.jobUrl.$error ? 'error' : ''"
                        data-qa="job url"
                        @blur="v$.applicationFormData.jobUrl.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.applicationFormData.jobUrl.$error"
                            type="error"
                        >
                            <li v-if="!v$.applicationFormData.jobUrl.url">
                                {{ $t('validation.url') }}
                            </li>
                            <li v-if="!v$.applicationFormData.jobUrl.maxLength">
                                {{ $t('validation.maxLength', { n: MAX_LENGTH_FIELD }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel
                            required
                            for="date"
                        >
                            Bewerbungsdatum
                        </FormLabel>
                    </template>
                    <FormDatePicker
                        id="date"
                        v-model="applicationFormData.createDate"
                        :status="v$.applicationFormData.createDate.$error ? 'error' : ''"
                        position="below right"
                        data-qa="create date"
                        @input="v$.applicationFormData.createDate.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.applicationFormData.createDate.$error"
                            type="error"
                        >
                            <li v-if="!v$.applicationFormData.createDate.required">
                                {{ $t('validation.date') }}
                            </li>
                            <li v-if="!v$.applicationFormData.createDate.isoDate">
                                {{ $t('validation.date') }}
                            </li>
                            <li v-if="!v$.applicationFormData.createDate.maxDate">
                                {{ $t('validation.dateMaxFuture') }}
                            </li>
                            <li v-if="!v$.applicationFormData.createDate.minDate">
                                {{ $t('validation.dateMin', { date: MIN_DATE.getFullYear() }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormRow>
            <FormElement>
                <template #start>
                    <FormLabel for="message">
                        Anschreiben
                    </FormLabel>
                </template>
                <FormTextareaLimited
                    id="message"
                    v-model="applicationFormData.message"
                    rows="9"
                    :maxlength="MAX_LENGTH_MESSAGE"
                    :status="v$.applicationFormData.message.$error ? 'error' : ''"
                    placeholder="Hier ist Platz für dein Anschreiben"
                    data-qa="message"
                    @blur="v$.applicationFormData.message.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.applicationFormData.message.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: MAX_LENGTH_MESSAGE }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement v-if="isCreateMode">
                <template #start>
                    <FormLabel for="memo">
                        Notizen
                    </FormLabel>
                </template>
                <FormTextareaLimited
                    id="memo"
                    v-model="applicationFormData.memo"
                    rows="7"
                    :maxlength="MAX_LENGTH_MEMO"
                    :status="v$.applicationFormData.memo.$error ? 'error' : ''"
                    placeholder="Halte Notizen zu deiner Bewerbung fest."
                    data-qa="memo"
                    @blur="v$.applicationFormData.memo.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.applicationFormData.memo.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: MAX_LENGTH_MEMO }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>
        <AppLink
            v-if="applicationFormData.id"
            secondary
            tag="button"
            data-qa="delete button"
            class="c-formApplicationEdit__delete"
            @click="emit('remove')"
        >
            <template #icon>
                <AppIcon
                    name="dustbin"
                    size="l"
                    fixed-width
                />
            </template><!--
            prevent whitespace characters at hover state
            -->Bewerbung löschen
        </AppLink>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';

.c-formApplicationEdit {
    @include wrap(math.div(8, 12));

    &__suggestionsMobile {
        display: block;
        margin-top: $k-spacing--m;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__suggestionsDesktop {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__delete {
        margin-top: $k-spacing--xl;
    }
}
</style>
