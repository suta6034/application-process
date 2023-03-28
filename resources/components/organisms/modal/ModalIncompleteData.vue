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
</script>

<template>
    <LayoutModal class="c-modalIncompleteData">
        <template #headline>
            Unvollständige Angaben
        </template>
        <p>
            Bitte fülle alle Pflichtfelder aus um fortzufahren.
        </p>
        <template #actions>
            <AppButton
                data-qa="complete data button"
                @click="hide"
            >
                Angaben vervollständigen
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
