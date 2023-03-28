<script setup>
import {
    required,
} from '@vuelidate/validators';

import {
    ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    isoDate,
    minDate,
    maxDate,
    MAX_BIRTHDATE,
    MIN_BIRTHDATE,
} from '../../../utils/validators';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormDateInput from '../../molecules/form/FormDateInput';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import IllustrationMinitaskBirthday from '../../illustrations/IllustrationMinitaskBirthday';
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
const minitaskBirthdate = ref(null);
const validations = {
    minitaskBirthdate: {
        isoDate,
        required,
        minDate: minDate(MIN_BIRTHDATE),
        maxDate: maxDate(MAX_BIRTHDATE),
    },
};
const v$ = useVuelidate(validations, { minitaskBirthdate });
const { validate } = useFormValidation(v$, root);

const {
    birthdate,
} = useState('profile/basics');

const {
    markAsDirty,
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'birthdate',
    validate,
    emit,
    onSave: () => { birthdate.value = minitaskBirthdate.value; },
});

function lastField() {
    if (minitaskBirthdate.value) {
        const firstNumber = minitaskBirthdate.value.substr(0, 4).substr(0, 1);
        if (parseInt(firstNumber, 10) !== 0 && validate()) markAsDirty();
    }
}
watch(minitaskBirthdate, lastField);

// Expose for unit test
defineExpose({ dirty, lastField });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskBirthday data-qa="illustration"/>
        </template>
        <template #headline>
            Wann hast du Geburtstag?
        </template>
        <template #content>
            Trag dein Geburtsdatum ein und lass uns mit dir feiern!
        </template>
        <template #interaction>
            <FormElement class="c-minitaskBirthdate__inputWrap">
                <FormDateInput
                    id="minitaskBirthdate"
                    v-model="minitaskBirthdate"
                    :small="true"
                    :status="v$.minitaskBirthdate.$error ? 'error' : ''"
                    data-qa="birthdate"
                    @blurLastField="markAsDirty();v$.minitaskBirthdate.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskBirthdate.$error"
                        type="error"
                    >
                        <span>
                            {{ $t('validation.birthdate') }}
                        </span>
                    </FormMessage>
                </template>
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                class="c-minitaskBirthdate__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Birthday' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Birthday' : undefined"
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

// 1. Prevent that the validation message increases to space between input and buttons (makes Dani happy)
.c-minitaskBirthdate {
    $input-width: 133px;

    &__inputWrap {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width; // 1.
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
