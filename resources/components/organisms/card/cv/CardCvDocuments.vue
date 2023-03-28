<script setup>
import {
    computed, inject, ref,
} from 'vue';
import {
    ACCEPTED_FILE_FORMATS,
    MAX_FILE_SIZE_DOCUMENTS_IN_BYTES,
} from '../../../../utils/file-settings';
import {
    commitAndShowModal,
} from '../../../../utils/error';
import {
    createAdaptedFile,
} from '../../../../utils/AdaptedFile';
import {
    downloadZip,
} from '../../../../utils/download';
import {
    track,
} from '../../../../utils/tracking';

import AppBadge from '../../../atoms/app/AppBadge';
import AppCard from '../../../molecules/app/AppCard';
import AppLink from '../../../atoms/app/AppLink';
import FormAttachmentUpload from '../../../molecules/form/FormAttachmentUpload';
import ProgressBackdrop from '../../progress/ProgressBackdrop';
import TextHeadline from '../../../atoms/text/TextHeadline';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const store = inject('store');
const router = inject('router');

const MAX_ATTACHMENTS = 24;
const isDownloadingZip = ref(false);

const {
    rows: attachments,
} = useState('profile/attachment');

const {
    surname,
} = useState('profile/basics');

const attachmentsWithCv = computed(() => [
    ...attachments.value,
    createAdaptedFile({
        deletable: false,
        name: `Lebenslauf-${surname.value}.pdf`,
        preview: null,
        ribbon: 'Lebenslauf',
        url: router.resolve({ name: 'pdf', query: { inline: true } }).href,
        uuid: 'cv',
    }),
]);

const downloadZipWithLoadingState = async () => {
    try {
        isDownloadingZip.value = true;
        await downloadZip(attachmentsWithCv.value, 'lebenslauf-dokumente');
        isDownloadingZip.value = false;
    } catch (error) {
        commitAndShowModal(store.commit, error);
    }
};

</script>

<template>
    <AppCard
        class="c-cardCvDocuments"
        data-qa="documents card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="c-cardCvDocuments__headline _flexbox-min-width-fix"
            >
                Dokumente
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="attachments && attachments.length"
                    data-qa="counter"
                >
                    {{ attachments.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="attachments.length"
                :disabled="isDownloadingZip"
                class="c-cardCvDocuments__download"
                tag="button"
                data-qa="all download button"
                @click="downloadZipWithLoadingState"
            >
                Alle herunterladen
            </AppLink>
        </template>
        <div class="c-cardCvDocuments__upload">
            <ProgressBackdrop
                v-if="isDownloadingZip"
                data-qa="progress backdrop"
            >
                ZIP-Datei der Dokumente wird erstellt
            </ProgressBackdrop>
            <FormAttachmentUpload
                :value="attachments"
                :accepted-formats="ACCEPTED_FILE_FORMATS"
                :max-files="MAX_ATTACHMENTS"
                :max-size-in-bytes="MAX_FILE_SIZE_DOCUMENTS_IN_BYTES"
                @delete="track({ element: 'DB: Documents', elementDetail: 'Delete', ga4Event: true });"
                @preview="track({ element: 'DB: Documents', elementDetail: 'Show', ga4Event: true });"
                @download="track({ element: 'DB: Documents', elementDetail: 'Download', ga4Event: true });"
                @change="attachments = $event"
            />
        </div>
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';
@import '../../../../assets/scss/tools/surface-boost';

.c-cardCvDocuments {
    &__header {
        padding-top: $k-spacing--l;
        padding-bottom: $k-spacing--l;
    }

    &__headline {
        margin-right: $k-spacing--s;
    }

    &__download {
        @include surface-boost;

        white-space: nowrap;
    }

    &__upload {
        position: relative;
    }
}
</style>
