<script setup>
import useVuelidate from '@vuelidate/core';
import {
    required,
} from '@vuelidate/validators';

import {
    isoDate,
    maxDate,
    minDate,
} from '../../../../utils/validators';
import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppList from '../../../atoms/app/AppList';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
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
    cvEditFormEvents,
    cvEditFormProps,
    useCvEditForm,
} from '../../../../composables/cv-edit-form';
import {
    useComputedRowObjectProperties,
    useMutations,
    useState,
} from '../../../../composables/vuex-helpers';

const MAX_DATE = new Date();
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));

const emit = defineEmits([...cvEditFormEvents]);
const props = defineProps({
    ...cvEditFormProps,
    id: {
        type: Number,
    },
});

const {
    updateField,
    CLEAR_NEW_ROWS: clear,
} = useMutations('profile/award');

if (!props.id) {
    clear();
}

const {
    rows: awards,
} = useState('profile/award');

const { name, date, url, submitted } = useComputedRowObjectProperties({
    objects: awards,
    indexId: props.id,
    updateField,
});

const validations = {
    name: {
        required,
    },
    date: {
        isoDate: isoDate(true, false, false),
        maxDate: maxDate(MAX_DATE),
        minDate: minDate(MIN_DATE),
    },
};
const v$ = useVuelidate(validations, { name, date });

const {
    root,
    dirty,
    cancel,
    markAsDirty,
    save,
} = useCvEditForm(props, emit, v$, submitted);

// Expose for unit tests
defineExpose({
    dirty, awards, name,
});
</script>

<template>
    <div class="c-formCvAward">
        <LayoutForm
            ref="root"
            :inline="true"
            :full-page="false"
            @dirty="markAsDirty"
        >
            <template #info>
                <AppInfoBox
                    v-if="id"
                    hint
                >
                    Du hast eine Auszeichnung wie z.B. ein Stipendium oder einen Preis bei einem Wettbewerb erhalten?
                    Dann ist hier der richtige Platz dafür.
                    <template #more>
                        <p>Wichtig dabei:</p>
                        <AppList>
                            <li class="k-c-list__item k-c-list__item--disc">
                                <span>Nur Auszeichnungen angeben, die für dein Karriereleben relevant sind.</span>
                            </li>
                            <li class="k-c-list__item k-c-list__item--disc">
                                <span>Beschränke dich auf die wichtigsten Auszeichnungen und übertreibe nicht.</span>
                            </li>
                        </AppList>
                    </template>
                </AppInfoBox>
            </template>

            <FormSection>
                <template
                    v-if="!id"
                    #headline
                >
                    Welche Auszeichnung hast du bekommen?
                </template>

                <FormElement>
                    <template #start>
                        <FormLabel
                            for="name"
                            required
                        >
                            Auszeichnungsname
                        </FormLabel>
                    </template>
                    <FormInput
                        id="name"
                        v-model.trim="name"
                        :status="v$.name.$error ? 'error' : ''"
                        data-qa="name"
                        aria-label="Name der Auszeichnung"
                        placeholder="Name der Auszeichnung"
                        @blur="v$.$touch()"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.name.$error"
                            type="error"
                        >
                            <li>
                                {{ $t('validation.required', { fieldName: 'Auszeichnungsname' }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="url">
                            Webadresse
                        </FormLabel>
                    </template>
                    <FormInput
                        id="url"
                        v-model="url"
                        data-qa="url"
                        aria-label="Link zur Auszeichnung"
                        placeholder="Link zur Auszeichnung"
                    />
                </FormElement>
                <FormElement>
                    <template #start>
                        <FormLabel for="date">
                            Jahr
                        </FormLabel>
                    </template>
                    <FormDateInput
                        id="date"
                        v-model="date"
                        :status="v$.date.$error ? 'error' : ''"
                        :show-day="false"
                        :show-month="false"
                        class="c-pageCvAwardForm__date"
                        data-qa="date"
                        @blurLastField="v$.$touch()"
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
                        {{ id ? 'Änderungen speichern' : 'Auszeichnung hinzufügen' }}
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
.c-formCvAward {
    &__date {
        width: 22%;
    }
}
</style>
