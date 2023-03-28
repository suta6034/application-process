<script setup>
import AppButton from '../../atoms/app/AppButton';
import AppButtonGroup from '../../molecules/app/AppButtonGroup';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    eventId: {
        type: String,
        default: Date.now().toString(),
    },
    closeAction: {
        type: Function,
        default: null,
    },
});

const buttonAction = () => props.closeAction?.() ?? hide();

</script>

<template>
    <LayoutModal class="c-modalApiError">
        <template #headline>
            Sorry!
        </template>
        <p data-qa="error">
            Es ist ein Fehler aufgetreten und wir sind bereits dran das Problem zu beheben
            - bitte versuch es später noch einmal.
        </p>
        <template #actions>
            <AppButtonGroup>
                <AppButton
                    data-qa="confirm"
                    @click="buttonAction"
                >
                    Nochmal versuchen
                </AppButton>
            </AppButtonGroup>
        </template>
    </LayoutModal>
</template>
