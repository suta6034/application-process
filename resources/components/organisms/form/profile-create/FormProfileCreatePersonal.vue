<script setup>
import {
    email as emailValidator,
    maxLength,
    required,
} from '@vuelidate/validators';

import {
    onBeforeMount, onBeforeUnmount,
    ref, watch, watchEffect,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import * as authService from '../../../../services/auth';

import {
    isoDate,
    minDate,
    maxDate,
    MAX_BIRTHDATE,
    MIN_BIRTHDATE,
} from '../../../../utils/validators';

import {
    countryAutocompleteAdapter,
    townOptionAdapter,
    townValueAdapter,
} from '../../../../store/modules/forms/basics';

import mitt from '../../../../utils/mitt';

import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../../utils/tracking';

import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormFilterSelect from '../../../molecules/form/FormFilterSelect';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import LayoutForm from '../../../layouts/LayoutForm';
import suggestedCountries from '../../../../data/suggested-countries.json';
import '../../../../lang/validation';
import {
    useActions, useMutations, useState,
} from '../../../../composables/vuex-helpers';

const MAX_LENGTH_NAME = 50;

const countryHasInvalidValue = ref(false);
const townHasInvalidValue = ref(false);

const {
    userWithEmailExists,
} = useState('profileCreate');

const {
    email: userEmail,
} = useState('profile/basics');

const {
    email,
    country,
    town,
    zip,
    birthdate,
    firstname,
    surname,
} = useState('profileCreate/basics');

const {
    fetchCheckUserByEmail,
} = useActions('profileCreate');

const {
    SET_USER_WITH_EMAIL_EXISTS: setUserWithMailExists,
} = useMutations('profileCreate');

const {
    CLEAR_EMAIL: clearUserEmail,
} = useMutations('profile/basics');

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const {
    CLEAR_EMAIL: clearEmail,
} = useMutations('profileCreate/basics');

/* istanbul ignore next: Just for tracking */
function trackShowMore() {
    track({
        category: CATEGORIES.page.profileCreate,
        action: ACTIONS.clickWithName('ll-anlegen-1-mehr-erfahren'),
        label: LABELS.karl,
    });
}

const validations = {
    firstname: {
        required,
        maxLength: maxLength(MAX_LENGTH_NAME),
    },
    surname: {
        required,
        maxLength: maxLength(MAX_LENGTH_NAME),
    },
    birthdate: {
        isoDate,
        required,
        minDate: minDate(MIN_BIRTHDATE),
        maxDate: maxDate(MAX_BIRTHDATE),
    },
    email: {
        required,
        email: emailValidator,
    },
    zip: {
        required,
    },
    town: {
        required,
    },
    country: {
        required,
    },
    $validationGroups: {
        locationSection: [
            'zip',
            'town',
            'country',
        ],
        name: ['firstname', 'surname'],
        nameRequired: ['firstname.required', 'surname.required'],
        nameMaxLength: ['firstname.maxLength', 'surname.maxLength'],
    },
};

const v$ = useVuelidate(validations, {
    firstname, surname, birthdate, email, zip, town, country,
});

async function validateAndCheckUserByEmail() {
    v$.value.email.$touch();
    if (email.value) await fetchCheckUserByEmail(email.value);
}

watch(userWithEmailExists, async () => {
    if (userWithEmailExists.value && !await authService.isUserLoggedIn()) {
        showModal({
            ariaLabel: 'Anmelden und loslegen!',
            componentName: 'ModalProfileExists',
            componentProps: {
                email: email.value,
            },
            focusElementSelector: '#email',
            showCloseButton: false,
        });

        track({
            category: CATEGORIES.page.profileCreate,
            action: ACTIONS.showWithName('profile-exists-module'),
        });
    }
});

// The email from the `profile` store which is filled when a logged-in user visits
// the profile creation page and the profile (with an email address) is fetched.
watchEffect(() => {
    if (userEmail.value.length) {
        email.value = userEmail.value;
        fetchCheckUserByEmail(email.value);
    }
});

const resetEmailAndUserExists = () => {
    clearUserEmail();
    clearEmail();
    setUserWithMailExists(false);
    v$.value.$reset();
};

onBeforeMount(() => {
    setUserWithMailExists(false);
    mitt.on('modal-profile-exists-decline', resetEmailAndUserExists);
});

onBeforeUnmount(() => {
    mitt.off('modal-profile-exists-decline', resetEmailAndUserExists);
});

defineExpose({ v$, validateAndCheckUserByEmail });
</script>

<template>
    <LayoutForm
        :full-page="false"
        class="c-formProfileCreatePersonal"
    >
        <AppInfoBox
            data-qa="infobox"
            hint
            label="Mehr erfahren"
            @track="trackShowMore"
        >
            <p>
                Fülle zuerst die Basis-Informationen aus. Vervollständigen kannst du deinen Lebenslauf dann noch
                jederzeit später.
            </p>
            <template #more>
                <p>
                    Sobald du diese Felder ausgefüllt hast, kannst du alle Vorteile des kostenlosen karriere.at
                    Lebenslaufs nutzen. Die maximale Datenkontrolle liegt selbstverständlich immer bei dir!
                </p>
            </template>
        </AppInfoBox>
        <FormSection
            data-qa="name section"
            headline="large"
        >
            <template #headline>
                Persönliche Daten
            </template>
            <FormElement>
                <div class="c-formProfileCreatePersonal__name">
                    <FormElement class="c-formProfileCreatePersonal__firstName">
                        <template #start>
                            <FormLabel for="first-name">
                                Vorname
                            </FormLabel>
                        </template>
                        <FormInput
                            id="first-name"
                            v-model="firstname"
                            :status="v$.firstname.$error ? 'error' : ''"
                            data-qa="first name field"
                            aria-label="Vorname"
                            placeholder="Dein Vorname"
                            @blur="v$.firstname.$touch()"
                        />
                    </FormElement>
                    <FormElement class="c-formProfileCreatePersonal__surname">
                        <template #start>
                            <FormLabel for="last-name">
                                Nachname
                            </FormLabel>
                        </template>
                        <FormInput
                            id="last-name"
                            v-model="surname"
                            :status="v$.surname.$error ? 'error' : ''"
                            data-qa="surname field"
                            aria-label="Nachname"
                            placeholder="Dein Nachname"
                            @blur="v$.surname.$touch()"
                        />
                    </FormElement>
                </div>
                <template #end>
                    <FormMessage
                        v-if="v$.$validationGroups.name.$error"
                        type="error"
                    >
                        <li v-if="v$.$validationGroups.nameMaxLength.$invalid">
                            {{ $t('validation.fullnameMaxLength') }}
                        </li>
                        <li v-else-if="v$.$validationGroups.nameRequired.$invalid">
                            {{ $t('validation.fullname') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement
                data-qa="birthdate section"
                :headline-size="4"
            >
                <template #start>
                    <FormLabel for="birthdate">
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
        </FormSection>
        <FormSection
            :headline-size="4"
            class="c-formProfileCreatePersonal__addressSection"
            data-qa="address section"
        >
            <FormSection
                data-qa="email section"
                :headline-size="4"
            >
                <FormElement>
                    <template #start>
                        <FormLabel for="email">
                            E-Mail-Adresse
                        </FormLabel>
                    </template>
                    <FormInput
                        id="email"
                        v-model="email"
                        :status="v$.email.$error ? 'error' : ''"
                        :disabled="userEmail.length > 0"
                        :locked="userEmail.length > 0"
                        data-qa="email field"
                        aria-label="E-Mail-Adresse"
                        placeholder="E-Mail-Adresse"
                        type="email"
                        @blur="validateAndCheckUserByEmail"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.email.$error"
                            type="error"
                        >
                            <li v-if="v$.email.required.$invalid">
                                {{ $t('validation.required', { fieldName: 'E-Mail-Adresse' }) }}
                            </li>
                            <li v-if="v$.email.email.$invalid">
                                {{ $t('validation.email') }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormSection>
            <FormElement>
                <div class="c-formProfileCreatePersonal__address">
                    <FormElement class="c-formProfileCreatePersonal__zip">
                        <template #start>
                            <FormLabel for="postal-code">
                                PLZ
                            </FormLabel>
                        </template>
                        <FormInput
                            id="postal-code"
                            v-model.trim="zip"
                            :limit="10"
                            :status="v$.zip.$error ? 'error' : ''"
                            data-qa="postal code field"
                            aria-label="Postleitzahl"
                            placeholder="PLZ"
                            type="text"
                            @blur="v$.zip.$touch()"
                        />
                    </FormElement>
                    <FormElement class="c-formProfileCreatePersonal__town">
                        <template #start>
                            <FormLabel :for="$randomFieldId('town')">
                                Ort
                            </FormLabel>
                        </template>
                        <FormFilterSelect
                            :id="$randomFieldId('town')"
                            v-model="town"
                            :status="v$.town.$error || townHasInvalidValue ? 'error' : ''"
                            :allow-new="true"
                            :invalid.sync="townHasInvalidValue"
                            :option-adapter="townOptionAdapter"
                            :value-adapter="townValueAdapter"
                            :filters="{ locationType: 'district,town' }"
                            aria-label="Ort, Stadt"
                            placeholder="Ort, Stadt"
                            endpoint="locations"
                            data-qa="town field"
                            @blur="v$.town.$touch()"
                        />
                    </FormElement>
                </div>
                <template #end>
                    <FormMessage
                        v-if="v$.town.$error || v$.zip.$error || townHasInvalidValue"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.location') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <template #start>
                    <FormLabel :for="$randomFieldId('country')">
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
                    data-qa="country field"
                    aria-label="Land"
                    placeholder="Land"
                    endpoint="locations"
                    @blur="v$.country.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.country.$error || countryHasInvalidValue"
                        type="error"
                    >
                        <li v-if="countryHasInvalidValue">
                            {{ $t('validation.invalidSelection', { fieldName: 'Land' }) }}
                        </li>
                        <li v-else-if="v$.country.$error">
                            {{ $t('validation.required', { fieldName: 'Land' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>
    </LayoutForm>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/link/index';
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/spacing';

// 1. important is needed to overwrite the styles from LayoutForm
// which ensures the right distance between the form sections in the OnePager
.c-formProfileCreatePersonal {
    &__name,
    &__address {
        @include k-layout($k-spacing--m, $k-spacing--s);
    }

    &__firstName,
    &__surname {
        @include k-layout__item(math.div(6, 12));
    }

    &__zip {
        @include k-layout__item(math.div(3, 12));
    }

    &__town {
        @include k-layout__item(math.div(9, 12));
    }

    &__addressSection {
        margin-top: $k-spacing--m !important; // 1.
    }
}
</style>
