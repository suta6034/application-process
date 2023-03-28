<script setup>
import {
    maxLength,
    required,
} from '@vuelidate/validators';
import {
    computed, ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import suggestedCountries from '../../../../data/suggested-countries.json';
import suggestedStatesAt from '../../../../data/suggested-states-at.json';
import suggestedStatesCh from '../../../../data/suggested-states-ch.json';
import suggestedStatesDe from '../../../../data/suggested-states-de.json';
import {
    isoDate,
    minDate,
    maxDate,
    MAX_BIRTHDATE,
    MIN_BIRTHDATE,
    MAX_LENGTH_STREET,
} from '../../../../utils/validators';
import {
    ACTIONS,
    CATEGORIES,
    track,
} from '../../../../utils/tracking';
import {
    countryAutocompleteAdapter,
    nationalityOptionAdapter,
    nationalityValueAdapter,
    townOptionAdapter,
    townValueAdapter,
    webAddressOptionAdapter,
    webAddressValueAdapter,
} from '../../../../store/modules/forms/basics';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppLink from '../../../atoms/app/AppLink';
import AppList from '../../../atoms/app/AppList';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormFilterSelect from '../../../molecules/form/FormFilterSelect';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormRow from '../../../molecules/form/FormRow';
import FormSection from '../../../molecules/form/FormSection';
import FormSelect from '../../../molecules/form/FormSelect';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import FormTelephone from '../../../molecules/form/FormTelephone';
import LayoutForm from '../../../layouts/LayoutForm';

import salutationTypes from '../../../../data/salutation-types.json';
import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const MAX_WEB_ADDRESSES = 25;
const MAX_LENGTH_NAME = 50;
const MAX_LENGTH_TITLE = 50;

const props = defineProps({ ...cvEditFormProps });
const emit = defineEmits([...cvEditFormEvents]);

const countryHasInvalidValue = ref(false);
const stateHasInvalidValue = ref(false);

const {
    birthdate,
    country,
    email,
    firstname,
    nationality,
    salutation,
    state,
    street,
    suffix,
    surname,
    mobile,
    title,
    town,
    web,
    zip,
} = useState('profile/basics');

const countryId = computed(() => parseInt(country.value.id, 10));
const suggestedStates = computed(() => {
    switch (countryId.value) {
    case 3757: return suggestedStatesAt;
    case 2420: return suggestedStatesAt;
    case 3253: return suggestedStatesCh;
    case 3185: return suggestedStatesDe;
    default: return [];
    }
});
const telephone = ref(null);
const validations = {
    title: {
        maxLength: maxLength(MAX_LENGTH_TITLE),
    },
    firstname: {
        required,
        maxLength: maxLength(MAX_LENGTH_NAME),
    },
    surname: {
        required,
        maxLength: maxLength(MAX_LENGTH_NAME),
    },
    suffix: {
        maxLength: maxLength(MAX_LENGTH_TITLE),
    },
    birthdate: {
        isoDate,
        required,
        minDate: minDate(MIN_BIRTHDATE),
        maxDate: maxDate(MAX_BIRTHDATE),
    },
    email: {
        required,
    },
    zip: {
        required,
    },
    town: {
        required,
    },
    street: {
        maxLength: maxLength(MAX_LENGTH_STREET),
    },
    country: {
        required,
    },
    web: {
        maxLength: maxLength(MAX_WEB_ADDRESSES),
    },
    telephone: {
        required: () => telephone.value.validateTelephone(true),
    },
};

const v$ = useVuelidate(validations, {
    title,
    firstname,
    surname,
    suffix,
    birthdate,
    email,
    zip,
    town,
    street,
    country,
    web,
    telephone,
}, { $scope: false });

const {
    dirty,
    markAsDirty,
    cancel,
    save,
} = useCvEditForm(props, emit, v$);

const trackClick = () => track({
    category: CATEGORIES.page.personalData,
    action: ACTIONS.clickWithName('email-change'),
});
</script>

<template>
    <LayoutForm
        ref="root"
        class="c-formCvPersonalData"
        :full-page="false"
        :inline="true"
        @dirty="markAsDirty"
    >
        <template #info>
            <AppInfoBox
                label="Mehr erfahren"
                hint
            >
                Fülle deine persönlichen Daten aus und verleihe deinem Profil ein Gesicht!
                <template #more>
                    <p>Beachte beim Ausfüllen deiner persönlichen Daten bitte folgende Punkte:</p>
                    <AppList>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Du bestimmst selbst, für welche Unternehmen deine persönlichen Daten
                                freigegeben werden! Bis dahin bleiben sie verdeckt.
                            </span>
                        </li>
                        <li class="k-c-list__item k-c-list__item--disc">
                            <span>
                                Deine Angaben sollten immer aktuell sein,
                                damit Unternehmen dich problemlos kontaktieren können.
                            </span>
                        </li>
                    </AppList>
                </template>
            </AppInfoBox>
        </template>

        <FormSection>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel for="salutation">
                            Geschlecht
                        </FormLabel>
                    </template>
                    <FormSelect
                        v-model="salutation"
                        :allow-multiple="false"
                        placeholder="Geschlecht wählen"
                        :options="salutationTypes"
                        name="salutation"
                        data-qa="salutation"
                    />
                </FormElement>
            </FormRow>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel for="title">
                            Vorangestellter akad. Grad, Titel
                        </FormLabel>
                    </template>
                    <FormInput
                        id="title"
                        v-model.trim="title"
                        :status="v$.title.$error ? 'error' : ''"
                        data-qa="prefix title"
                        aria-label="Vorangestellter akademischer Grad oder Titel"
                        placeholder="z.B. Dkfm., Ing., Mag."
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.title.$error"
                            type="error"
                        >
                            <li>
                                {{ $t(
                                    'validation.requiredMaxLength',
                                    { fieldName: 'Vorangestellter Titel', n: MAX_LENGTH_TITLE }
                                ) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="title">
                            Nachgestellter akad. Grad
                        </FormLabel>
                    </template>
                    <FormInput
                        id="suffix"
                        v-model.trim="suffix"
                        :status="v$.suffix.$error ? 'error' : ''"
                        data-qa="suffix"
                        aria-label="Nachgestellter akademischer Grad"
                        placeholder="z.B. BSc, MBA, PhD"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.suffix.$error"
                            type="error"
                        >
                            <li>
                                {{ $t(
                                    'validation.requiredMaxLength',
                                    { fieldName: 'Nachgestellter akad. Grad', n: MAX_LENGTH_TITLE }
                                ) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormRow>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel
                            for="first-name"
                            required
                        >
                            Vorname
                        </FormLabel>
                    </template>
                    <FormInput
                        id="first-name"
                        v-model.trim="firstname"
                        :status="v$.firstname.$error ? 'error' : ''"
                        data-qa="first name"
                        aria-label="Vorname"
                        placeholder="Dein Vorname"
                        @blur="v$.firstname.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.firstname.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.requiredMaxLength', { fieldName: 'Vorname', n: MAX_LENGTH_NAME }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel
                            for="last-name"
                            required
                        >
                            Nachname
                        </FormLabel>
                    </template>
                    <FormInput
                        id="last-name"
                        v-model.trim="surname"
                        :status="v$.surname.$error ? 'error' : ''"
                        data-qa="surname"
                        aria-label="Nachname"
                        placeholder="Dein Nachname"
                        @blur="v$.surname.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.surname.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.requiredMaxLength', { fieldName: 'Nachname', n: MAX_LENGTH_NAME }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormRow>
            <FormRow split>
                <FormElement>
                    <template #start>
                        <FormLabel
                            for="birthdate"
                            required
                        >
                            Geburtsdatum
                        </FormLabel>
                    </template>
                    <FormDateInput
                        id="birthdate"
                        v-model="birthdate"
                        :status="v$.birthdate.$error ? 'error' : ''"
                        data-qa="birthdate"
                        @blurLastField="v$.birthdate.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.birthdate.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.birthdate') }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel :for="$randomFieldId('nationality')">
                            Staatsbürgerschaft
                        </FormLabel>
                    </template>
                    <FormFilterSelect
                        :id="$randomFieldId('nationality')"
                        v-model="nationality"
                        :allow-new="true"
                        :allow-reset="true"
                        :option-adapter="nationalityOptionAdapter"
                        :value-adapter="nationalityValueAdapter"
                        :options="suggestedCountries"
                        :filters="{ locationType: 'country' }"
                        :autocomplete-adapter="({ label }) => label"
                        aria-label="Staatsbürgerschaft"
                        placeholder="Staatsbürgerschaft"
                        endpoint="locations"
                        data-qa="nationality"
                    />
                </FormElement>
            </FormRow>
        </FormSection>

        <FormSection>
            <template #headline>
                Kontaktdaten
            </template>
            <FormElement>
                <template #start>
                    <FormLabel for="street">
                        Straße, Hausnummer
                    </FormLabel>
                </template>
                <FormInput
                    id="street"
                    v-model.trim="street"
                    :status="v$.street.$error ? 'error' : ''"
                    data-qa="street"
                    aria-label="Straße, Hausnummer"
                    placeholder="Straße, Hausnummer"
                    @blur="v$.street.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.street.$error"
                        type="error"
                    >
                        <li>
                            {{ $t(
                                'validation.requiredMaxLength',
                                { fieldName: 'Straße, Hausnummer', n: MAX_LENGTH_STREET }
                            ) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <div class="c-formCvPersonalData__address">
                    <FormElement class="c-formCvPersonalData__zip">
                        <template #start>
                            <FormLabel
                                for="postal-code"
                                required
                            >
                                PLZ
                            </FormLabel>
                        </template>
                        <FormInput
                            id="postal-code"
                            v-model.trim="zip"
                            :limit="10"
                            :status="v$.zip.$error ? 'error' : ''"
                            data-qa="postal code"
                            aria-label="Postleitzahl"
                            placeholder="PLZ"
                            type="text"
                            @blur="v$.zip.$touch()"
                        />
                    </FormElement>
                    <FormElement class="c-formCvPersonalData__town">
                        <template #start>
                            <FormLabel
                                :for="$randomFieldId('town')"
                                required
                            >
                                Ort
                            </FormLabel>
                        </template>
                        <FormFilterSelect
                            :id="$randomFieldId('town')"
                            v-model="town"
                            :status="v$.town.$error ? 'error' : ''"
                            :allow-new="true"
                            :option-adapter="townOptionAdapter"
                            :value-adapter="townValueAdapter"
                            :filters="{ locationType: 'district,town' }"
                            aria-label="Ort, Stadt"
                            placeholder="Ort, Stadt"
                            endpoint="locations"
                            data-qa="town"
                            @blur="v$.town.$touch()"
                        />
                    </FormElement>
                </div>
                <template #end>
                    <FormMessage
                        v-if="v$.town.$error || v$.zip.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.location') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel
                            :for="$randomFieldId('country')"
                            required
                        >
                            Land
                        </FormLabel>
                    </template>
                    <FormFilterSelect
                        :id="$randomFieldId('country')"
                        v-model="country"
                        :invalid.sync="countryHasInvalidValue"
                        :status="v$.country.$error || countryHasInvalidValue ? 'error' : ''"
                        :options="suggestedCountries"
                        :filters="{ locationType: 'country' }"
                        :autocomplete-adapter="countryAutocompleteAdapter"
                        data-qa="country"
                        aria-label="Land"
                        placeholder="Land"
                        endpoint="locations"
                        @blur="v$.country.$touch()"
                        @change="state = ''"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.country.$error || countryHasInvalidValue"
                            type="error"
                        >
                            <li v-if="countryHasInvalidValue">
                                {{ $t('validation.invalidSelection', { fieldName: 'Land' }) }}
                            </li>
                            <li v-if="!countryHasInvalidValue && v$.country.$error">
                                {{ $t('validation.required', { fieldName: 'Land' }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement v-if="suggestedStates.length">
                    <template #start>
                        <FormLabel :for="$randomFieldId('state')">
                            {{ countryId === 3253 ? 'Kanton' : 'Bundesland' }}
                        </FormLabel>
                    </template>
                    <FormFilterSelect
                        :id="$randomFieldId('state')"
                        v-model="state"
                        :placeholder="countryId === 3253 ? 'Kanton' : 'Bundesland'"
                        :invalid.sync="stateHasInvalidValue"
                        :status="stateHasInvalidValue ? 'error' : ''"
                        :options="suggestedStates"
                        :aria-label="countryId === 3253 ? 'Kanton' : 'Bundesland'"
                        data-qa="state"
                        @blur="markAsDirty"
                    />
                    <template #end>
                        <FormMessage
                            v-if="stateHasInvalidValue"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.invalidSelection', { fieldName: 'Bundesland' }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormRow>
            <FormRow split-half>
                <FormElement>
                    <template #start>
                        <FormLabel for="telephone">
                            Telefonnummer
                        </FormLabel>
                    </template>
                    <FormTelephone
                        id="telephone"
                        ref="telephone"
                        v-model="mobile"
                        data-qa="telephone"
                    />
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="email">
                            E-Mail-Adresse
                        </FormLabel>
                        <AppLink
                            :to="{ name: 'page-settings' }"
                            class="c-formCvPersonalData__settingsLink"
                            data-qa="settings link"
                            @click.native="trackClick"
                        >
                            Ändern
                        </AppLink>
                    </template>
                    <FormInput
                        id="email"
                        v-model.trim="email"
                        :disabled="true"
                        :locked="true"
                        data-qa="email"
                        aria-label="E-Mail-Adresse"
                        placeholder="E-Mail-Adresse"
                        type="email"
                    />
                </FormElement>
            </FormRow>
            <FormElement>
                <template #start>
                    <FormLabel for="web">
                        Website
                    </FormLabel>
                </template>
                <FormSuggestionSelect
                    v-model="web"
                    :allow-new="true"
                    :max="MAX_WEB_ADDRESSES"
                    :option-adapter="webAddressOptionAdapter"
                    :value-adapter="webAddressValueAdapter"
                    :enable-primary-action="false"
                    placeholder="Webadresse eingeben"
                    data-qa="web"
                    @change="markAsDirty();v$.web.$touch()"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinctWeb') }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_WEB_ADDRESSES, fieldName: 'Webadressen' }) }}
                    </template>
                </FormSuggestionSelect>
            </FormElement>
        </FormSection>

        <template #actions>
            <AppButtonGroup variant="right">
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save"
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
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/spacing';

.c-formCvPersonalData {
    &__settingsLink {
        @include k-typo-s;
    }

    &__address {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }

    &__zip {
        @include k-layout__item(math.div(3, 12));
    }

    &__town {
        @include k-layout__item(math.div(9, 12));
    }
}
</style>
