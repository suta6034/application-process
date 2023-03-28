<script setup>
import {
    inject,
} from 'vue';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskVisibility from '../../illustrations/IllustrationMinitaskVisibility';
import {
    minitaskEvents, useMinitaskEditForm,
} from '../../../composables/minitask-edit-form';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);
const router = inject('router');

const {
    skipped,
    trackClick,
} = useMinitaskEditForm({
    key: 'visibility',
    clickAction: 'profile-active',
    emit,
});

async function updated() {
    emit('updated');
    trackClick('activate');
    log('profile-minitask', {
        label: 'visibility',
        result: 'redirect',
    });
    await router.push({ name: 'page-visibility-form' });
}

</script>

<template>
    <AppCollapseBox>
        <template #media>
            <IllustrationMinitaskVisibility data-qa="illustration"/>
        </template>
        <template #headline>
            Du möchtest Job-Angebote erhalten?
        </template>
        <template #content>
            Aktiviere deinen Lebenslauf und sei sichtbar für Arbeitgeber.
        </template>
        <template #interaction>
            <AppButton
                width="condensed"
                slim
                data-qa="activate button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Activate Profile' : undefined"
                @click="updated"
            >
                Jetzt sichtbar schalten
            </AppButton>
            <AppButton
                width="condensed"
                slim
                outline
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Activate Profile' : undefined"
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
