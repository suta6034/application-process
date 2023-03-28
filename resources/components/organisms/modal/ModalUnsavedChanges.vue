<script setup>
import {
    log,
} from '../../../utils/action-logger';
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    callbackReset: {
        type: Function,
        default: null,
    },
    callbackSave: {
        type: Function,
        default: null,
    },
});

async function reset() {
    await props.callbackReset?.();
    mitt.emit('reset-form-data');
    hide();
}

async function save() {
    await props.callbackSave?.();
    mitt.emit('save-form-data');
    hide();
}
</script>

<template>
    <LayoutModal
        class="c-modalUnsavedChanges"
        @hide="log('modal-unsaved-changes-cancel')"
    >
        <template #headline>
            Ungespeicherte Änderungen
        </template>
        <p>
            Wenn du deine Änderungen behalten willst kannst du sie jetzt noch speichern.
        </p>
        <template #actions>
            <AppButton
                data-qa="save button"
                @click="
                    save();
                    log('modal-unsaved-changes-save');
                "
            >
                Änderungen speichern
            </AppButton>
            <AppLink
                tag="button"
                secondary
                data-qa="reset link"
                @click="
                    reset();
                    log('modal-unsaved-changes-cancel');
                "
            >
                Nicht speichern
            </AppLink>
        </template>
    </LayoutModal>
</template>
