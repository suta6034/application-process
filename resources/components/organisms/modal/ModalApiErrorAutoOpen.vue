<script setup>
import {
    inject,
    watch,
} from 'vue';

import {
    commitAndShowModal,
} from '../../../utils/error';

const props = defineProps({
    error: {
        default: null,
        type: Error,
    },
});

const store = inject('store');

watch(() => props.error, () => {
    if (!props.error) return;
    commitAndShowModal(store.commit, props.error);
}, { immediate: true });
</script>
<template><div><slot/></div></template>
