<script setup>
import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../lang/validation';
import '../../../directives/debounce-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    cancelCallback: {
        type: Function,
        required: true,
    },
    removeCallback: {
        type: Function,
        required: true,
    },
});

function remove() {
    props.removeCallback?.();
    hide();
}

function cancel() {
    props.cancelCallback?.();
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalMessageDelete">
        <template #headline>
            Bist du sicher?
        </template>
        <p data-qa="text default">
            Willst du den Gesprächsverlauf wirklich löschen?
        </p>
        <template #actions>
            <AppButton
                :disabled="false"
                data-qa="delete button"
                color="red"
                @click="remove"
            >
                Nachricht löschen
            </AppButton>
            <AppLink
                v-debounce-click
                :disabled="false"
                tag="button"
                secondary
                data-qa="cancel button"
                @click="cancel"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
