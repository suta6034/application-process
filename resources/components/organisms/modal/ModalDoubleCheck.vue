<script setup>
import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    callbackApprove: {
        type: Function,
        default: null,
    },
    callbackDecline: {
        type: Function,
        default: null,
    },
    headline: {
        type: String,
        default: 'Bist du dir sicher?',
    },
    text: {
        type: String,
        default: 'Möchtest du diesen Eintrag wirklich löschen?',
    },
});

function approve() {
    props.callbackApprove?.();
    hide();
}

function decline() {
    props.callbackDecline?.();
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalDoubleCheck">
        <template
            #headline
        >
            {{ headline }}
        </template>
        <p data-qa="text">
            {{ text }}
        </p>
        <template #actions>
            <AppButton
                color="red"
                data-qa="approve button"
                @click="approve"
            >
                Jetzt löschen
            </AppButton>
            <AppLink
                tag="button"
                secondary
                data-qa="decline link"
                @click="decline"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
