<script setup>
import {
    maxLength,
} from '@vuelidate/validators';

import {
    ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    MAX_LENGTH_STREET,
} from '../../../utils/validators';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormInput from '../../atoms/form/FormInput';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import IllustrationMinitaskAddress from '../../illustrations/IllustrationMinitaskAddress';

import '../../../lang/validation';
import {
    minitaskEvents,
    useMinitaskEditForm,
} from '../../../composables/minitask-edit-form';
import {
    useFormValidation,
} from '../../../composables/form-validation';
import {
    useState,
} from '../../../composables/vuex-helpers';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);

const minitaskAddress = ref(null);
const root = ref(null);

const validations = {
    minitaskAddress: {
        maxLength: maxLength(MAX_LENGTH_STREET),
    },
};

const v$ = useVuelidate(validations, { minitaskAddress });
const { validate } = useFormValidation(v$, root);

const {
    town,
    street,
} = useState('profile/basics');

const {
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'address',
    validate,
    emit,
    onSave: () => { street.value = minitaskAddress.value; },
});

watch(minitaskAddress, () => {
    dirty.value = minitaskAddress.value.length > 0 && validate();
});

// Expose for unit tests
defineExpose({ dirty });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskAddress data-qa="illustration"/>
        </template>
        <template #headline>
            Wo in {{ town }} wohnst du genau? Gib deine Adresse ein.
        </template>
        <template #interaction>
            <FormElement class="c-minitaskAddress__inputWrap">
                <FormInput
                    id="minitaskAddress"
                    v-model.trim="minitaskAddress"
                    :small="true"
                    data-qa="address"
                    aria-label="Straße, Hausnummer"
                    placeholder="Straße, Hausnummer"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.minitaskAddress.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.requiredMaxLength', { fieldName: 'Adresse', n: MAX_LENGTH_STREET }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                class="c-minitaskAddress__save"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Address' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Address' : undefined"
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
.c-minitaskAddress {
    $input-width: 19em;

    &__inputWrap {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width; // 1.
        }
    }

    .c-appCollapseBox__interaction &__save {
        margin-top: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-top: 0;
        }
    }
}
</style>
