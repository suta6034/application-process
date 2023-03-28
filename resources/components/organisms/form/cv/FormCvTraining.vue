<script setup>
import {
    maxLength,
    required,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    isoDate,
    maxDate,
    minDate,
} from '../../../../utils/validators';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/notification';
import '../../../../lang/validation';
import {
    cvEditFormEvents, cvEditFormProps, useCvEditForm,
} from '../../../../composables/cv-edit-form';
import {
    useComputedRowObjectProperties,
    useMutations, useState,
} from '../../../../composables/vuex-helpers';

const MAX_DATE = new Date();
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const MAX_TITLE_LENGTH = 120;
const MAX_INSTITUTE_LENGTH = 120;

const props = defineProps({
    ...cvEditFormProps,
    id: {
        type: Number,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    updateField,
    CLEAR_NEW_ROWS: clear,
} = useMutations('profile/training');

if (!props.id) {
    clear();
}

const {
    rows: trainings,
} = useState('profile/training');

const {
    title, date, institute, submitted,
} = useComputedRowObjectProperties({
    objects: trainings,
    indexId: props.id,
    updateField,
});

const validations = {
    title: {
        required,
        maxLength: maxLength(MAX_TITLE_LENGTH),
    },
    institute: {
        required,
        maxLength: maxLength(MAX_INSTITUTE_LENGTH),
    },
    date: {
        required,
        isoDate: isoDate(true, false, false),
        maxDate: maxDate(MAX_DATE),
        minDate: minDate(MIN_DATE),
    },
    $validationGroups: {
        validTraining: ['title', 'institute', 'date'],
    },
};

const v$ = useVuelidate(validations, { title, institute, date });

const {
    root,
    dirty,
    cancel,
    markAsDirty,
    save,
} = useCvEditForm(props, emit, v$, submitted);

// Expose for unit tests
defineExpose({ trainings, dirty, title });
</script>

<template>
    <div class="c-formCvTraining">
        <LayoutForm
            ref="root"
            :inline="true"
            :full-page="false"
            @dirty="markAsDirty"
        >
            <FormSection>
                <template
                    v-if="!id"
                    #headline
                >
                    Welche Weiterbildung hast du gemacht?
                </template>

                <FormElement>
                    <template #start>
                        <FormLabel
                            for="title"
                            required
                        >
                            Name
                        </FormLabel>
                    </template>
                    <FormInput
                        id="title"
                        v-model.trim="title"
                        :status="v$.title.$error ? 'error' : ''"
                        data-qa="title"
                        aria-label="Name der Weiterbildung"
                        placeholder="Name der Weiterbildung"
                        @blur="v$.title.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.title.$error"
                            type="error"
                        >
                            <li>
                                {{ $t(
                                    'validation.requiredMaxLength',
                                    { fieldName: 'Weiterbildungsname', n: MAX_TITLE_LENGTH }
                                ) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>

                <FormElement>
                    <template #start>
                        <FormLabel
                            for="institute"
                            required
                        >
                            Institut
                        </FormLabel>
                    </template>
                    <FormInput
                        id="institute"
                        v-model.trim="institute"
                        :status="v$.institute.$error ? 'error' : ''"
                        data-qa="institute"
                        aria-label="Institut"
                        placeholder="Institut der Weiterbildung"
                        @blur="v$.institute.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.institute.$error"
                            type="error"
                        >
                            <li>
                                {{ $t(
                                    'validation.requiredMaxLength',
                                    { fieldName: 'Institut', n: MAX_INSTITUTE_LENGTH }
                                ) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>

                <FormElement>
                    <template #start>
                        <FormLabel
                            for="date"
                            required
                        >
                            Jahr
                        </FormLabel>
                    </template>
                    <FormDateInput
                        id="date"
                        v-model="date"
                        :status="v$.date.$error ? 'error' : ''"
                        :show-day="false"
                        :show-month="false"
                        class="c-formCvTraining__date"
                        data-qa="date"
                        @blurLastField="v$.date.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.date.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.year') }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormSection>

            <template #actions>
                <AppButtonGroup variant="right">
                    <AppButton
                        :disabled="!dirty"
                        data-qa="save button"
                        @click="save"
                    >
                        {{ id ? 'Änderungen speichern' : 'Weiterbildung hinzufügen' }}
                    </AppButton>
                    <template #secondary>
                        <AppButton
                            outline
                            data-qa="back link"
                            @click="cancel"
                        >
                            Abbrechen
                        </AppButton>
                    </template>
                </AppButtonGroup>
            </template>
        </LayoutForm>
    </div>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/spacing';

.c-formCvTraining {
    &__date {
        width: 22%;
    }

    &__infoBox {
        margin-bottom: $k-spacing--xl;
    }
}
</style>
