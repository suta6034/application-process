<script setup>
import {
    ref,
} from 'vue';
import {
    CATEGORIES,
    track,
} from '../../../utils/tracking';
import {
    emitUserAction,
} from '../../../services/user-actions';

import AppButton from '../../atoms/app/AppButton';
import AppLadder from '../../atoms/app/AppLadder';
import AppLink from '../../atoms/app/AppLink';
import AppRadioBox from '../../molecules/app/AppRadioBox';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../lang/validation';
import '../../../directives/debounce-click';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const emit = defineEmits(['hidden']);

const props = defineProps({
    sendCallback: {
        type: Function,
        default: null,
    },
});

const selectedReason = ref(null);
const isSendLoading = ref(false);

const selectReason = (reason) => {
    selectedReason.value = reason;
};

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.applications);

function send() {
    isSendLoading.value = true;
    if (props.sendCallback) {
        props.sendCallback({
            reason: selectedReason.value,
        });
    }
    isSendLoading.value = false;
    hide();
}

</script>

<template>
    <LayoutModal
        class="c-modalNotInterestedReason"
        @hide="
            emitUserAction('modal-why-not-cancel');
            track({ element: 'Invited Question Infobox', elementDetail: 'Why not - Cancel', ga4Event: true });"
    >
        <template #headline>
            Wurdest du schon kontaktiert?
        </template>
        <AppLadder
            gap="s"
            class="c-modalNotInterestedReason__reasons"
            data-qa="radio select"
        >
            <li
                key="rejection"
                class="k-o-ladder__rung"
            >
                <AppRadioBox
                    name="reason"
                    data-qa="reason rejection"
                    @check="
                        selectReason('rejection');
                        trackClick('modal-why-not-rejected');
                    "
                >
                    Ich habe eine Absage erhalten.
                </AppRadioBox>
            </li>
            <li
                key="no-reply"
                class="k-o-ladder__rung"
            >
                <AppRadioBox
                    data-qa="reason no reply"
                    name="reason"
                    @check="
                        selectReason('no-reply');
                        trackClick('modal-why-not-no-response');
                    "
                >
                    Ich habe noch keine Rückmeldung erhalten.
                </AppRadioBox>
            </li>
        </AppLadder>
        <template #actions>
            <AppButton
                :disabled="isSendLoading || !selectedReason"
                data-qa="send button"
                data-gtm-element="Invited Question Infobox"
                :data-gtm-element-detail="`Why not - ${selectedReason === 'rejection' ? 'Rejected' : 'No Response'}`"
                @click="
                    send();
                    trackClick('modal-why-not-send');
                "
            >
                Antwort senden
            </AppButton>
            <AppLink
                v-debounce-click
                :disabled="isSendLoading"
                secondary
                tag="button"
                data-qa="cancel button"
                data-gtm-element="Invited Question Infobox"
                data-gtm-element-detail="Why not - Cancel"
                @click="
                    emit('hidden');
                    hide();
                    trackClick('modal-why-not-cancel');
                "
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-modalNotInterestedReason {
    &__reasons {
        margin-top: $k-spacing--2xl;
        text-align: left;
        color: $k-color-gray--900;
    }

    &__textDescription {
        margin-top: $k-spacing--xl;
    }

    &__text {
        margin-top: $k-spacing--m;
    }
}
</style>
