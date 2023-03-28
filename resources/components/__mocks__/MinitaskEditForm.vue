<script>
import useVuelidate from '@vuelidate/core';
import {
    ref,
} from 'vue';

import FormInput from '../atoms/form/FormInput';
import {
    useMinitaskEditForm,
} from '../../composables/minitask-edit-form';

export default {
    components: {
        FormInput,
    },
    setup() {
        const field = ref('');
        const v$ = useVuelidate(null, { field });

        const {
            dirty,
            save,
            markAsDirty,
        } = useMinitaskEditForm({});

        return {
            field,
            v$,
            markAsDirty,
            save,
            dirty,
        };
    },
};
</script>

<template>
    <div @input.capture="markAsDirty">
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
            data-qa="skip button"
        >
            Skip
        </button>
    </div>
</template>
