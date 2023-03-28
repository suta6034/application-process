<script setup>
import {
    nextTick,
} from 'vue';
import {
    FORMS,
} from '../../../utils/form-settings';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskWorkEmployer from '../../illustrations/IllustrationMinitaskWorkEmployer';
import {
    useActions,
} from '../../../composables/vuex-helpers';
import {
    minitaskEvents, useMinitaskEditForm,
} from '../../../composables/minitask-edit-form';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits([...minitaskEvents, 'add']);

const {
    UPDATE_HAS_WORK_EXPERIENCE_STATUS: updateHasWorkExperienceStatus,
} = useActions('profile');

const {
    skipped,
    trackClick,
} = useMinitaskEditForm({
    key: 'work-experience',
    clickAction: 'experience',
    emit,
});

async function onSkip() {
    skipped();
    // Wait for all form fields to update their values.
    await nextTick();
    updateHasWorkExperienceStatus(false);
}

function handleAddClick() {
    emit('updated');
    emit('add', FORMS.work);
    trackClick('add');
    log('profile-minitask', {
        label: 'work-experience',
        result: 'add',
    });
}
</script>

<template>
    <AppCollapseBox>
        <template #media>
            <IllustrationMinitaskWorkEmployer data-qa="illustration"/>
        </template>
        <template #headline>
            Du bringst Berufserfahrung mit?
        </template>
        <template #content>
            In welchen Bereichen hast du schon Erfahrungen gesammelt?
        </template>
        <template #interaction>
            <AppButton
                width="condensed"
                slim
                data-qa="add button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Experience' : undefined"
                @click="handleAddClick"
            >
                Ja, jetzt hinzufügen
            </AppButton>
            <AppButton
                width="condensed"
                outline
                slim
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Experience' : undefined"
                @click="onSkip"
            >
                Noch nicht
            </AppButton>
        </template>
        <template #collapse-content>
            Je vollständiger dein Lebenslauf ist, desto mehr Chancen hast du.
        </template>
    </AppCollapseBox>
</template>
