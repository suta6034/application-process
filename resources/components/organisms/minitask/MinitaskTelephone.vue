<script setup>
import {
    ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormElement from '../../molecules/form/FormElement';
import FormTelephone from '../../molecules/form/FormTelephone';
import IllustrationMinitaskTelephone from '../../illustrations/IllustrationMinitaskTelephone';

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
const telephone = ref(null);
const minitaskTelephone = ref(null);
const validations = {
    minitaskTelephone: {
        required: () => telephone.value.validateTelephone(true),
    },
};
const v$ = useVuelidate(validations, { minitaskTelephone });
const { validate } = useFormValidation(v$, root);

const {
    mobile,
} = useState('profile/basics');

const {
    saveData,
    markAsDirty,
    dirty,
    skipped,
} = useMinitaskEditForm({
    key: 'telephone',
    clickAction: 'phonenumber',
    emit,
    onSave: () => { mobile.value = minitaskTelephone.value; },
    validate,
});

watch(minitaskTelephone, () => {
    if (minitaskTelephone.value.length > 0 && validate()) markAsDirty();
    else dirty.value = false;
});

// Expose for unit tests
defineExpose({ dirty });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskTelephone data-qa="illustration"/>
        </template>
        <template #headline>
            Was ist deine Telefonnummer?
        </template>
        <template #interaction>
            <FormElement
                class="c-minitaskTelephone__inputWrap"
            >
                <FormTelephone
                    id="minitaskTelephone"
                    ref="telephone"
                    v-model="minitaskTelephone"
                    class="c-minitaskTelephone__input"
                    :small="true"
                    data-qa="telephone"
                />
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                class="c-minitaskTelephone__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Phone Number' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Phone Number' : undefined"
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
.c-minitaskTelephone {
    $input-width: 19em;

    &__inputWrap {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width; // 1.
        }
    }

    &__input {
        @media (min-width: $k-breakpoint--m) {
            width: $input-width; // 1.
        }
    }

    .c-appCollapseBox__interaction &__firstButton {
        margin-top: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-top: 0;
            margin-left: 0;
        }
    }
}
</style>
