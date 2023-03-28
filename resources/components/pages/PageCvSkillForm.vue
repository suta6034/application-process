<script setup>
import {
    ref,
} from 'vue';
import {
    onBeforeRouteLeave,
// eslint-disable-next-line import/extensions
} from 'vue-router/composables';
import FormCvSkill from '../organisms/form/cv/FormCvSkill';
import LayoutDefault from '../layouts/LayoutDefault';

import '../../lang/validation';

const form = ref(null);
/* istanbul ignore next */
onBeforeRouteLeave(async (to, from, next) => form.value.beforeRouteLeaveCustom(next));

defineProps({
    matching: {
        type: [Boolean, String],
        default: false,
    },
});
</script>

<template>
    <LayoutDefault>
        <FormCvSkill
            ref="form"
            standalone
            :matching="matching"
            data-qa="skill form"
        />
    </LayoutDefault>
</template>
