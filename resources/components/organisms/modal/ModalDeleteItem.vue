<script setup>
import {
    inject,
} from 'vue';
import AppButton from '../../atoms/app/AppButton';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../directives/debounce-click';
import AppLink from '../../atoms/app/AppLink';
import {
    useActions, useGetters, useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');
const { UPDATE_PROFILE: updateProfile } = useActions('profile');
const { model: profileModel } = useGetters('profile');

const store = inject('store');

const props = defineProps({
    mutation: {
        type: String,
        required: true,
    },
    itemId: {
        type: Number,
        required: true,
    },
    createMode: {
        type: Boolean,
        default: false,
    },
    deleteCallBack: {
        type: Function,
        default: null,
    },
});

function deleteItem() {
    store.commit(props.mutation, props.itemId);
    if (!props.createMode) updateProfile(profileModel.value);
    if (props.deleteCallBack) props.deleteCallBack();
    hide();
}

// Exposing for unit test
defineExpose({ deleteItem });
</script>

<template>
    <LayoutModal class="c-modalDeleteItem">
        <template #headline>
            Bist du dir sicher?
        </template>
        <p>
            Je weniger Informationen du im Lebenslauf angibst, desto weniger wirst du von Top-Arbeitgebern gefunden.
        </p>
        <template #actions>
            <AppButton
                color="red"
                data-qa="delete button"
                @click="deleteItem"
            >
                Jetzt löschen
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
