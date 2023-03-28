<script setup>
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../directives/debounce-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    uuid: {
        type: String,
        required: true,
    },
});

function deleteAttachment() {
    mitt.emit('delete-attachment', props.uuid);
    hide();
}

// Exposing for unit test
defineExpose({ deleteAttachment });
</script>

<template>
    <LayoutModal class="c-modalDeleteAttachment">
        <template #headline>
            Dokument löschen
        </template>
        <p>
            Möchtest du dieses Dokument wirklich aus deinem Lebenslauf löschen?
        </p>
        <template #actions>
            <AppButton
                v-debounce-click
                color="red"
                data-qa="delete button"
                @click="deleteAttachment"
            >
                Dokument löschen
            </AppButton>
            <AppLink
                v-debounce-click
                tag="button"
                secondary
                data-qa="cancel button"
                @click="hide"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
