<script setup>
import {
    inject, watch,
} from 'vue';
import * as mutationTypes from '../../../store/mutation-types';
import {
    useState,
} from '../../../composables/vuex-helpers';

const { active: isActive } = useState('popup');

const props = defineProps({
    headline: {
        default: undefined,
        type: String,
    },
    text: {
        default: undefined,
        type: String,
    },
});

const store = inject('store');
const emit = defineEmits(['approve', 'decline', 'close']);

store.commit(`popup/${mutationTypes.SHOW_POPUP}`, {
    componentName: 'ModalDoubleCheck',
    ariaLabel: 'Bist du dir sicher?',
    componentProps: {
        callbackApprove: () => emit('approve'),
        callbackDecline: () => emit('decline'),
        headline: props.headline,
        text: props.text,
    },
}, { root: true });

watch(isActive, () => {
    if (!isActive) emit('close');
});

</script>
<template><div><slot/></div></template>
