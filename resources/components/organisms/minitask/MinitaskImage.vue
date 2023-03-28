<script setup>
import {
    ACTIONS,
    LABELS,
    track,
} from '../../../utils/tracking';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskProfileImage from '../../illustrations/IllustrationMinitaskProfileImage';
import {
    useImageEditor,
} from '../../../composables/image-editor';
import router from '../../../router';
import {
    minitaskEvents,
} from '../../../composables/minitask-edit-form';

const { showImageEditor, acceptedImageFormats } = useImageEditor();
const emit = defineEmits(minitaskEvents);

defineProps({
    gaPrefix: {
        type: String,
    },
});

function trackClick(label) {
    track({
        category: router.currentRoute.meta?.trackingCategory,
        action: ACTIONS.clickWithName('minitask-picture-upload'),
        label: LABELS.eventWithName(label),
    });
}

function skipped() {
    emit('skipped');
    trackClick('skip');
    log('profile-minitask', {
        label: 'image',
        view: 'list',
        result: 'skip',
    });
}

function openImageEditor(e) {
    showImageEditor(e);
    emit('updated');
    trackClick('upload');
    log('profile-minitask', {
        label: 'image',
        view: 'list',
        result: 'save',
    });
}

defineExpose({ openImageEditor }); // Expose for unit test because simulating file upload is very tricky
</script>
<template class="c-minitaskImage">
    <AppCollapseBox>
        <template #media>
            <IllustrationMinitaskProfileImage data-qa="illustration"/>
        </template>
        <template #headline>
            Punkte mit deinem Lächeln!
        </template>
        <template #content>
            Zeig dich von deiner besten Seite mit einem professionellen, sympathischen Foto.
        </template>
        <template #interaction>
            <AppButton
                width="condensed"
                slim
                tag="label"
                class="k-outline-if-focus-within"
            >
                Foto hochladen
                <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                <input
                    :accept="acceptedImageFormats"
                    class="u-screen-reader-only"
                    type="file"
                    data-qa="save button"
                    :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                    :data-gtm-element-detail="gaPrefix ? 'Profile Photo' : undefined"
                    @change="openImageEditor"
                >
            </AppButton>
            <AppButton
                width="condensed"
                slim
                outline
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Profile Photo' : undefined"
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
