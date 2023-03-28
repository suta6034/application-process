<script setup>
import {
    onBeforeMount,
    ref, watch, watchEffect,
} from 'vue';
import initialPhonePrefixes from '../../../data/phone-prefixes.json';

import AppIcon from '../../atoms/app/AppIcon';
import FormFilterSelect from './FormFilterSelect';
import FormInput from '../../atoms/form/FormInput';
import FormMessage from '../../atoms/form/FormMessage';

const MAX_LENGTH_PHONE_NUMBER = 25;
const MIN_LENGTH_PHONE_NUMBER = 5;

const DEFAULT_COUNTRY_PREFIX = {
    prefix: '43',
    label: '43',
};

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    small: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['input']);

const phoneNumber = ref('');
const phoneCountryPrefix = ref({ prefix: '', label: '' });
const phoneNumberHasInvalidValue = ref(false);
const phoneNumberTooShort = ref(false);
const phoneNumberTooLong = ref(false);
const phoneNumberTouched = ref(false);
const phoneCountryPrefixHasInvalidValue = ref(false);

const phonePrefixes = JSON.parse(JSON.stringify(initialPhonePrefixes));

function formatPhoneNumber() {
    phoneNumber.value = phoneNumber.value.replace(/[^0-9\s]+/g, '').replace(/^0/, '');
    phoneNumber.value = phoneNumber.value.replace(/\s{2}/g, ' ');
}

function initPhoneNumber(val = props.value) {
    if (phonePrefixes && val !== null && val !== '' && phoneNumber.value === '') {
        if (val.indexOf('+') === 0) {
            Object.keys(phonePrefixes).some((i) => {
                if (val.indexOf(phonePrefixes[i].prefix) === 1) {
                    phoneCountryPrefix.value = {
                        prefix: phonePrefixes[i].prefix,
                        label: phonePrefixes[i].prefix,
                    };
                    phoneNumber.value = val.substring(phonePrefixes[i].prefix.length + 1).trim();
                    return true;
                }
                return false;
            });
        } else {
            let pn = val.trim();
            phoneCountryPrefix.value = DEFAULT_COUNTRY_PREFIX;
            if (pn.substring(0, 4) === '0043') {
                pn = pn.substring(4);
            } else if (pn.substring(0, 4) === '0049') {
                pn = pn.substring(4);
                phoneCountryPrefix.value = {
                    prefix: '49',
                    label: '49',
                };
            } else if (pn.substring(0, 2) === '43') {
                pn = pn.substring(2);
            } else if (pn.substring(0, 1) === '0') {
                pn = pn.substring(1);
            } else if (pn.substring(0, 3) === '(0)') {
                pn = pn.substring(3);
            } else if (pn.substring(0, 2) === '06') {
                pn = pn.substring(1);
            }
            phoneNumber.value = pn.trim();
        }
        formatPhoneNumber();
    }
}

function checkNumbersAndSpacesOnly(evt) {
    if (typeof evt === 'undefined' || typeof evt.key === 'undefined') return;
    const keyCode = evt.key.charCodeAt(0);
    if ((keyCode > 31 && (keyCode < 48 || keyCode > 57))
        && keyCode !== 46 && keyCode !== 32
    ) {
        evt.preventDefault();
    }
}

function setPhonePrefixAfterSelect(e) {
    if (e.prefix) {
        phoneCountryPrefix.value.prefix = e.prefix;
        phoneCountryPrefix.value.label = e.prefix;
    } else {
        phoneCountryPrefix.value.prefix = '';
        phoneCountryPrefix.value.label = '';
    }
}

function validateTelephone(forceTouch) {
    phoneCountryPrefixHasInvalidValue.value = false;
    phoneNumberHasInvalidValue.value = false;
    phoneNumberTooLong.value = false;
    if ((phoneNumber.value.length > 0 || phoneCountryPrefix.value.prefix)
        && phoneNumber.value.length < MIN_LENGTH_PHONE_NUMBER
        && (phoneNumberTouched.value || forceTouch)
    ) {
        phoneNumberHasInvalidValue.value = true;
        phoneCountryPrefixHasInvalidValue.value = true;
        phoneNumberTooShort.value = true;
        return false;
    }
    if (phoneNumber.value.length > MAX_LENGTH_PHONE_NUMBER) {
        phoneNumberTooLong.value = true;
        phoneCountryPrefixHasInvalidValue.value = true;
        phoneNumberHasInvalidValue.value = true;
        return false;
    }
    if (phoneNumber.value.length >= MIN_LENGTH_PHONE_NUMBER && !phoneCountryPrefix.value.prefix) {
        phoneCountryPrefixHasInvalidValue.value = true;
        return false;
    }
    return true;
}

function validatePhoneNumber() {
    phoneNumberTouched.value = true;
    validateTelephone(false);
}

function telephoneIsComplete() {
    return !!phoneCountryPrefix.value.prefix
        && phoneNumber.value.length >= MIN_LENGTH_PHONE_NUMBER
        && phoneNumber.value.length < MAX_LENGTH_PHONE_NUMBER;
}

onBeforeMount(initPhoneNumber);

watchEffect(() => {
    if (phoneNumber.value === '') {
        initPhoneNumber(props.value);
    }
});

watch(phoneNumber, (val) => {
    phoneNumber.value = val;
    if (telephoneIsComplete()) {
        const input = val !== '' ? `+${phoneCountryPrefix.value.prefix} ${val}` : '';
        emit('input', input);
    } else {
        emit('input', '');
    }
});

watch(phoneCountryPrefix, (val) => {
    if (telephoneIsComplete()) {
        const input = phoneNumber.value !== '' ? `+${val.prefix} ${phoneNumber.value}` : '';
        emit('input', input);
    } else {
        emit('input', '');
    }
});

// Expose for parent usage, unit tests
defineExpose({ validateTelephone, setPhonePrefixAfterSelect, phoneCountryPrefix });
</script>

<template>
    <div class="c-formTelephone">
        <div
            class="c-formTelephone__prefix"
            :class="{'c-formTelephone__prefix--small': small}"
        >
            <FormFilterSelect
                v-model="phoneCountryPrefix"
                placeholder="43"
                aria-label="Vorwahl"
                :status="phoneCountryPrefixHasInvalidValue ? 'error' : ''"
                :options="phonePrefixes"
                :allow-new="false"
                :allow-digits-only="true"
                :results-adaptive-width="true"
                :option-prefix="`+`"
                :auto-select-only-option-on-blur="true"
                :max-characters-allowed="3"
                :small="small"
                data-qa="phone prefix"
                @change="setPhonePrefixAfterSelect"
                @blur="validateTelephone(false)"
            >
                <template #start>
                    <AppIcon
                        class="c-formTelephone__icon"
                        :class="{'c-formTelephone__icon--small': small}"
                        name="plus"
                    />
                </template>
            </FormFilterSelect>
        </div>
        <div
            class="c-formTelephone__number"
            :class="{'c-formTelephone__number--small': small}"
        >
            <FormInput
                id="phoneNumber"
                v-model="phoneNumber"
                :small="small"
                name="phone number"
                data-qa="phone number"
                aria-label="Telefonnummer"
                placeholder="Telefonnummer"
                :status="phoneNumberHasInvalidValue ? 'error' : ''"
                @keypress="checkNumbersAndSpacesOnly"
                @input="formatPhoneNumber"
                @blur="validatePhoneNumber"
            />
        </div>

        <FormMessage
            v-if="phoneNumberHasInvalidValue || phoneCountryPrefixHasInvalidValue"
            type="error"
            class="c-formTelephone__errorMessage"
        >
            <li>
                <span v-if="phoneNumberTooLong">
                    {{ $t('validation.phoneNumberTooLong') }}
                </span>
                <span v-else-if="phoneNumberHasInvalidValue || phoneCountryPrefixHasInvalidValue">
                    {{ $t('validation.phoneNumber') }}
                </span>
            </li>
        </FormMessage>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/components/input';
@import '../../../assets/scss/settings/spacing';

.c-formTelephone {
    $icon-small-max-width: 0.75em;
    $telephone-prefix-with: 5.25em;

    @include k-layout($k-spacing--m, $k-spacing--s);

    &__prefix {
        flex: 0 0 $telephone-prefix-with;

        &--small {
            @media (min-width: $k-breakpoint--m) {
                width: 25%;
            }
        }
    }

    &__number {
        flex: 1;

        &--small {
            @media (min-width: $k-breakpoint--m) {
                width: 75%;
            }
        }
    }

    &__icon {
        color: $k-color-gray--500;

        &--small {
            max-width: $icon-small-max-width;
            max-height: $icon-small-max-width;
        }
    }

    &__input,
    &__select {
        @include input;

        padding: $k-spacing--s;
    }

    &__errorMessage {
        margin-top: $k-spacing--s;
        padding-top: 0;
    }
}
</style>
