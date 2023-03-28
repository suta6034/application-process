<script setup>
import {
    FORMS,
} from '../../../utils/form-settings';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskSoftSkills from '../../illustrations/IllustrationMinitaskSoftSkills';
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
    skipped,
    trackClick,
} = useMinitaskEditForm({ key: 'soft-skills', emit });

function handleAddClick() {
    emit('updated');
    emit('add', FORMS.softSkills);
    trackClick('add');
    log('profile-minitask', {
        label: 'soft-skills',
        result: 'add',
    });
}
</script>

<template>
    <AppCollapseBox>
        <template #media>
            <IllustrationMinitaskSoftSkills data-qa="illustration"/>
        </template>
        <template #headline>
            Soft Skills und Werte
        </template>
        <template #content>
            Erhöhe deine Chance auf ein Bewerbungsgespräch mit der Angabe deiner Soft Skills und Werte.
        </template>
        <template #interaction>
            <AppButton
                width="condensed"
                slim
                data-qa="add button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Soft Skills' : undefined"
                @click="handleAddClick"
            >
                Soft Skills und Werte angeben
            </AppButton>
            <AppButton
                width="condensed"
                outline
                slim
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Soft Skills' : undefined"
                @click="skipped"
            >
                Später
            </AppButton>
        </template>
        <template #collapse-content>
            Je vollständiger dein Lebenslauf ist, desto mehr Chancen hast du.
        </template>
    </AppCollapseBox>
</template>
