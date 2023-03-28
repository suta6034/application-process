<script setup>
import {
    onBeforeRouteLeave,
    // eslint-disable-next-line import/extensions
} from 'vue-router/composables';
import {
    ref,
} from 'vue';
import LayoutDefault from '../layouts/LayoutDefault';
import FormCvDesiredJob from '../organisms/form/cv/FormCvDesiredJob';

defineProps({
    target: {
        type: String,
    },
    matching: {
        type: [Boolean, String],
        default: false,
    },
});

const form = ref(null);

onBeforeRouteLeave(async (to, from, next) => {
    await form.value.beforeRouteLeaveCustom(next);
});
</script>

<template>
    <LayoutDefault>
        <FormCvDesiredJob
            ref="form"
            standalone
            :target="target"
            :matching="matching"
            data-qa="desired job form"
        />
    </LayoutDefault>
</template>
