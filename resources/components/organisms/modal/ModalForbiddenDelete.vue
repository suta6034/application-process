<script setup>
import {
    inject,
} from 'vue';
import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../directives/debounce-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const router = inject('router');

const props = defineProps({
    mutation: {
        type: String,
        required: true,
    },
    itemId: {
        type: Number,
        required: true,
    },
    clearCallBack: {
        type: Function,
        default: null,
    },
    editCallback: {
        type: Function,
        default: null,
    },
});

function edit() {
    if (props.itemId && !props.editCallback) {
        router.push({
            name: 'page-cv-education-form-edit',
            params: { id: props.itemId },
        });
    } else {
        props.editCallback();
        hide();
    }
}
</script>

<template>
    <LayoutModal
        class="c-modalForbiddenDelete"
    >
        <template #headline>
            Löschen nicht möglich
        </template>
        <p data-qa="text default">
            Die Angabe einer Ausbildung ist Pflicht.
            Du kannst diese Ausbildung entweder jetzt bearbeiten oder löschen
            nachdem du mindestens eine weitere Ausbildung hinzugefügt hast.
        </p>
        <template #actions>
            <AppButton
                data-qa="edit link"
                @click="edit"
            >
                Ausbildung bearbeiten
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
