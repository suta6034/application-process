<script setup>
import useVuelidate from '@vuelidate/core';
import {
    nextTick,
    ref,
} from 'vue';
import '../../../directives/debounce-click';
import {
    maxLength,
} from '@vuelidate/validators';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../utils/tracking';
import REJECTION_REASONS from '../../../data/message-rejection-reason.json';

import AppButton from '../../atoms/app/AppButton';
import AppLadder from '../../atoms/app/AppLadder';
import AppLink from '../../atoms/app/AppLink';
import AppRadioBox from '../../molecules/app/AppRadioBox';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import FormTextareaLimited from '../../atoms/form/FormTextareaLimited';
import LayoutModal from '../../layouts/LayoutModal';

import '../../../lang/validation';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const MAX_LENGTH_TEXT = 1000;
const TEXTAREA_ROWS = 4;

const props = defineProps({
    sendCallback: {
        type: Function,
        default: null,
    },
});

const textAreaForm = ref(null);
const isCustomReasonFormVisible = ref(false);
const selectedReason = ref(null);
const customReasonText = ref('');
const isSendLoading = ref(false);
const textArea = ref(null);

const trackReason = (action) => {
    track({
        category: CATEGORIES.page.messages,
        action: ACTIONS.clickWithName(action),
        label: LABELS.click,
    });
};

const selectReason = async (reason) => {
    isCustomReasonFormVisible.value = false;
    track({
        element: 'MS_D: Not interested',
        elementDetail: reason.trackingDetail,
        ga4Event: true,
    });
    trackReason(`not-interested-${reason.key}`);
    if (reason.key === 'other-reason') {
        isCustomReasonFormVisible.value = true;

        //  scroll focus + cursor focus on the text area
        await nextTick();
        textArea.value[0]?.$el.scrollIntoView();
        textAreaForm.value[0]?.$refs.textarea.focus();
    }
    selectedReason.value = reason;
};

function send() {
    isSendLoading.value = true;
    props.sendCallback?.({
        type: 'reject',
        reason: selectedReason.value,
        customRejectionReason: selectedReason.value.text === 'Anderer Grund'
            ? customReasonText.value
            : '',
    });
    isSendLoading.value = false;
    trackReason('not-interested-reply');
    track({
        element: 'MS_D: Not interested',
        elementDetail: 'Send message',
        ga4Event: true,
    });
    hide();
}

function close() {
    trackReason('not-interested-reply-cancel');
    hide();
}

const rules = {
    customReasonText: {
        maxLength: maxLength(MAX_LENGTH_TEXT),
    },
};

const v$ = useVuelidate(rules, { customReasonText });
</script>

<template>
    <LayoutModal class="c-modalNotInterestedReason">
        <template #headline>
            Warum bist du nicht interessiert?
        </template>
        <template #subheadline>
            <p data-qa="text default">
                Deine Antwort wird dem Absender mitgeteilt - selbstverständlich anonym.
            </p>
        </template>
        <AppLadder
            tabindex="0"
            role="radiogroup"
            aria-label="radio group"
            gap="s"
            class="c-modalNotInterestedReason__reasons"
            data-qa="radio select"
        >
            <li
                v-for="reason in REJECTION_REASONS"
                :key="reason.text"
                class="k-o-ladder__rung"
                data-qa="reason"
            >
                <AppRadioBox
                    name="reason"
                    @check="selectReason(reason)"
                >
                    {{ reason.text }}
                </AppRadioBox>
                <template v-if="reason.text === 'Anderer Grund' && isCustomReasonFormVisible">
                    <p class="c-modalNotInterestedReason__textDescription">
                        Lass den Recruiter wissen, warum du nicht interessiert bist:
                    </p>
                    <FormElement
                        ref="textArea"
                        class="c-modalNotInterestedReason__text"
                    >
                        <FormTextareaLimited
                            id="reason text"
                            ref="textAreaForm"
                            v-model="customReasonText"
                            :status="v$.customReasonText.$error ? 'error' : ''"
                            :maxlength="MAX_LENGTH_TEXT"
                            :rows="TEXTAREA_ROWS"
                            placeholder="Deine Nachricht"
                            data-qa="custom rejection reason"
                            @input="v$.customReasonText.$touch()"
                        />
                        <template #end>
                            <FormMessage
                                v-if="v$.customReasonText.$error"
                                type="error"
                            >
                                <span v-if="!v$.customReasonText.maxLength">
                                    {{ $t('validation.maxLength', {n: MAX_LENGTH_TEXT}) }}
                                </span>
                            </FormMessage>
                        </template>
                    </FormElement>
                </template>
            </li>
        </AppLadder>
        <template #actions>
            <AppButton
                :disabled="!selectedReason || isSendLoading || v$.customReasonText.$error"
                data-qa="send button"
                @click="send"
            >
                Antwort senden
            </AppButton>
            <AppLink
                v-debounce-click
                tag="button"
                secondary
                data-qa="cancel button"
                data-gtm-element="MS_D: Not interested"
                data-gtm-element-detail="Cancel"
                @click="close"
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
    }

    &__textDescription {
        margin-top: $k-spacing--xl;
    }

    &__text {
        margin-top: $k-spacing--m;
    }
}
</style>
