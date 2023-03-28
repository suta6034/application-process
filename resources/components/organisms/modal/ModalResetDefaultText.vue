<script setup>
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    callbackCancel: {
        type: Function,
        default: null,
    },
    callbackRestore: {
        type: Function,
        default: null,
    },
});

function cancel() {
    props.callbackCancel?.();
    hide();
}

function setDefaultText() {
    props.callbackRestore?.();
    mitt.emit('set-default-text');
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalResetTemplate">
        <template #headline>
            Bist du dir sicher?
        </template>
        <p>
            Durch das Wiederherstellen der Vorlage gehen deine eigenen Änderungen verloren
        </p>
        <template #actions>
            <AppButton
                data-qa="get default text button"
                @click="setDefaultText"
            >
                Vorlage wiederherstellen
            </AppButton>
            <AppLink
                tag="button"
                data-qa="cancel reset"
                @click="cancel"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
