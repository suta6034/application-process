<script setup>
import '../../../directives/debounce-click';
import {
    CATEGORIES,
} from '../../../utils/tracking';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../lang/validation';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    resetCallback: {
        type: Function,
        default: null,
    },
});

const { trackClick } = useTrackClick(CATEGORIES.page.messages);

function cancel() {
    trackClick('message-reply-cancel-continue');
    props.resetCallback?.();
    hide();
}

async function keep() {
    trackClick('message-reply-cancel-discard');
    hide();
}
</script>

<template>
    <LayoutModal class="c-modalMessageUnsent">
        <template #headline>
            Bist du sicher?
        </template>
        <p data-qa="text default">
            Möchtest du deine Nachricht wirklich verwerfen?
        </p>
        <template #actions>
            <AppButton
                :disabled="false"
                data-qa="keep button"
                data-gtm-element="MS_D: Discard message"
                data-gtm-element-detail="Cancel"
                @click="keep"
            >
                Bearbeitung fortsetzen
            </AppButton>
            <AppLink
                v-debounce-click
                :disabled="false"
                tag="button"
                secondary
                data-qa="cancel button"
                data-gtm-element="MS_D: Discard message"
                data-gtm-element-detail="Discard"
                @click="cancel"
            >
                Nachricht verwerfen
            </AppLink>
        </template>
    </LayoutModal>
</template>
