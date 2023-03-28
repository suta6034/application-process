<script setup>
import {
    FORMS,
} from '../../../utils/form-settings';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskLanguage from '../../illustrations/IllustrationMinitaskLanguage';
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
} = useMinitaskEditForm({ key: 'minitask-language', emit });

function handleAddClick() {
    emit('updated');
    emit('add', FORMS.language);
    trackClick('add');
    log('profile-minitask', {
        label: 'language',
        result: 'add',
    });
}
</script>

<template>
    <AppCollapseBox>
        <template #media>
            <IllustrationMinitaskLanguage data-qa="illustration"/>
        </template>
        <template #headline>
            Welche Sprachen beherrscht du?
        </template>
        <template #interaction>
            <AppButton
                width="condensed"
                slim
                data-qa="add button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Language' : undefined"
                @click="handleAddClick"
            >
                Sprachen hinzufügen
            </AppButton>
            <AppButton
                width="condensed"
                slim
                outline
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Language' : undefined"
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
