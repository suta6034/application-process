<script>
import {
    required,
} from '@vuelidate/validators';
import {
    ref,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import FormInput from '../atoms/form/FormInput';
import {
    cvEditFormProps, useCvEditForm,
} from '../../composables/cv-edit-form';

export default {
    components: {
        FormInput,
    },
    props: {
        ...cvEditFormProps,
    },
    setup(props, { emit, expose }) {
        const submitted = ref(false);
        const field = ref('');
        const validations = { field: { required } };
        const v$ = useVuelidate(validations, { field });
        const {
            dirty,
            markAsDirty,
            save,
            cancel,
        } = useCvEditForm(props, emit, v$, submitted);
        expose({ submitted });
        return {
            field,
            v$,
            dirty,
            markAsDirty,
            save,
            cancel,
        };
    },
};
</script>

<template>
    <div @input="markAsDirty">
        <FormInput
            v-model="field"
            data-qa="field"
            @blur="v$.field.$touch()"
        />
        <button
            :disabled="!dirty"
            data-qa="save button"
            @click="save"
        >
            Save
        </button>
        <button
            :disabled="!dirty"
            data-qa="save button with redirect"
            @click="save({ name: 'page-cv-project' })"
        >
            Save
        </button>
        <button
            data-qa="cancel button"
            @click="cancel"
        >
            Cancel
        </button>
    </div>
</template>
