<script setup>
import {
    watch,
} from 'vue';
import {
    STATES,
    useMotivationLetterRemove,
} from '../../../composables/resource-motivation-letter';
import '../../../directives/debounce-click';
import {
    CATEGORIES,
} from '../../../utils/tracking';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import ModalApiError from './ModalApiErrorAutoOpen';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import i18n from '../../../utils/i18n';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const props = defineProps({
    id: {
        required: true,
        type: String,
    },
    confirmedCallback: {
        type: Function,
        default: null,
    },
});

const {
    error,
    remove,
    state,
} = useMotivationLetterRemove();

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.applications);

watch(state, () => {
    if (state.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('motivationLetter.deleted'),
            icon: 'check',
        });
    }
});

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const cancel = () => {
    hide();
    trackClick('application-letter-delete-template-cancel');
};
const confirm = async () => {
    props.confirmedCallback?.();

    const isSuccess = await remove({ id: this.id });
    if (!isSuccess) return;

    hide();
    trackClick('application-letter-delete-template-delete');
};
</script>

<template>
    <LayoutModal class="c-modalMotivationLetterDelete">
        <ModalApiError :error="error"/>
        <template #headline>
            Bist du dir sicher?
        </template>
        <p data-qa="text default">
            Deine Bewerbungsvorlage kann nach dem Löschen nicht wiederhergestellt werden.
        </p>
        <template #actions>
            <AppButton
                color="red"
                data-qa="delete button"
                @click="confirm"
            >
                Vorlage löschen
            </AppButton>
            <AppLink
                v-debounce-click
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
