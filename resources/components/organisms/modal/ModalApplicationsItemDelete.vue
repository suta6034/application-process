<script setup>
import {
    nextTick,
    watch,
} from 'vue';
import '../../../lang/application';
import {
    STATES,
    useApplicationList,
    useApplicationRemove,
} from '../../../composables/resource-application';
import '../../../directives/debounce-click';
import {
    emitUserAction,
} from '../../../services/user-actions';
import {
    track,
} from '../../../utils/tracking';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import ModalApiError from './ModalApiErrorAutoOpen';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import i18n from '../../../utils/i18n';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const props = defineProps({
    applicationId: {
        required: true,
        type: String,
    },
    confirmedCallback: {
        type: Function,
        default: null,
    },
    hasCallbackBeforeDestroy: {
        type: Boolean,
        default: true,
    },
});

const {
    error,
    remove,
    state,
} = useApplicationRemove();

const {
    pagination,
} = useApplicationList();

watch(state, () => {
    if (state.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('application.deleted'),
            icon: 'check',
        });
    }
});

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const cancel = () => {
    hide();
    emitUserAction('application-delete-cancel');
};

const confirm = async () => {
    if (props.hasCallbackBeforeDestroy) props.confirmedCallback();

    const isSuccess = await remove({ id: props.applicationId });
    if (!isSuccess) return;
    pagination.value.total -= 1;

    if (!props.hasCallbackBeforeDestroy) props.confirmedCallback();

    await nextTick(); // Allow Snackbar to render before hiding the modal.
    hide();
    emitUserAction('application-delete-delete');
    track({
        element: 'AP_L: Manual Application',
        elementDetail: 'Delete - Confirm',
        ga4Event: true,
    });
};
</script>

<template>
    <LayoutModal
        class="c-modalApplicationsItemDelete"
        @hide="emitUserAction('application-delete-cancel');
               track({ element: 'AP_L: Manual Application', elementDetail: 'Delete - Cancel', ga4Event: true, });"
    >
        <ModalApiError :error="error"/>
        <template #headline>
            Bist du dir sicher?
        </template>
        <p>
            Deine Bewerbung wird aus deiner Übersicht entfernt, liegt aber weiterhin beim Unternehmen auf.
        </p>
        <template #actions>
            <AppButton
                color="red"
                data-qa="delete button"
                @click="confirm"
            >
                Bewerbung löschen
            </AppButton>
            <AppLink
                v-debounce-click
                tag="button"
                secondary
                data-qa="cancel button"
                data-gtm-element="AP_L: Manual Application"
                data-gtm-element-detail="Delete - Cancel"
                @click="cancel"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
