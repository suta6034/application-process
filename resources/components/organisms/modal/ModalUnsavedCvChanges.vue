<script setup>
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

function save() {
    mitt.emit('save-cv-template');
    hide();
}

function discard() {
    mitt.emit('discard-cv-template');
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalUnsavedCvChanges">
        <template #headline>
            Ungespeicherte Änderungen
        </template>
        <p>
            Wenn du den Prozess jetzt abbrichst, werden die Änderungen an deinem Lebenslauf nicht gespeichert.
        </p>
        <template #actions>
            <AppButton
                data-qa="save button"
                @click="save"
            >
                Änderungen speichern
            </AppButton>
            <AppLink
                tag="button"
                secondary
                data-qa="discard link"
                @click="discard"
            >
                Änderungen verwerfen
            </AppLink>
        </template>
    </LayoutModal>
</template>
