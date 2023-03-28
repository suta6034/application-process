<script setup>
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

function reset() {
    mitt.emit('reset-form-data');
    hide();
}

function hideModal() {
    mitt.emit('hide-form-data');
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalUnsavedChangesKeepEditing">
        <template #headline>
            Ungespeicherte Angaben
        </template>
        <p>
            Bitte korrigiere deine Eingabe, um das Formular speichern zu können.
        </p>
        <template #actions>
            <AppButton
                data-qa="keep editing button"
                @click="hideModal"
            >
                Weiter bearbeiten
            </AppButton>
            <AppLink
                tag="button"
                data-qa="discard changes link"
                @click="reset"
            >
                Änderungen verwerfen
            </AppLink>
        </template>
    </LayoutModal>
</template>
