<script setup>
import {
    inject, watch,
} from 'vue';
import * as mutationTypes from '../../../store/mutation-types';
import {
    useState,
} from '../../../composables/vuex-helpers';

const { active: isActive } = useState('popup');

const store = inject('store');
const emit = defineEmits(['reset', 'save', 'close']);

store.commit(`popup/${mutationTypes.SHOW_POPUP}`, {
    componentName: 'ModalUnsavedChanges',
    ariaLabel: 'Ungespeicherte Änderungen',
    componentProps: {
        callbackReset: () => emit('reset'),
        callbackSave: () => emit('save'),
    },
}, { root: true });

watch(isActive, () => {
    if (!isActive) emit('close');
});
</script>
<template><div><slot/></div></template>
