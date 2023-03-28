<script setup>
import {
    onBeforeMount, ref,
} from 'vue';
import AppButton from '../../atoms/app/AppButton';
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import FormElement from '../../molecules/form/FormElement';
import FormSelect from '../../molecules/form/FormSelect';
import IllustrationMinitaskDesiredJobAlternative from '../../illustrations/IllustrationMinitaskDesiredJobAlternative';

import {
    minitaskEvents,
    useMinitaskEditForm,
} from '../../../composables/minitask-edit-form';
import {
    useState,
} from '../../../composables/vuex-helpers';
import {
    TRAVEL_READINESS_OPTIONS,
} from '../../../models/DesiredJob';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);

const root = ref(null);
const minitaskTravelReadiness = ref({});

const {
    travelReadiness,
} = useState('profile/desiredJob');

const {
    markAsDirty,
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'travel-readiness',
    emit,
    onSave: () => { travelReadiness.value = minitaskTravelReadiness.value; },
});

// Initialise value once from store
onBeforeMount(() => {
    minitaskTravelReadiness.value = travelReadiness.value;
});

// Expose for unit tests
defineExpose({ dirty, minitaskTravelReadiness });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskDesiredJobAlternative data-qa="illustration"/>
        </template>
        <template #headline>
            Wie viele Tage pro Woche magst du reisen?
        </template>
        <template #content>
            Die Reisebereitschaft wird nun in Tagen pro Woche angegeben.
            Bist du mit der ausgewählten Anzahl der Tage einverstanden?
        </template>
        <template #interaction>
            <FormElement class="c-minitaskDesiredJobTravelReadiness__formElement">
                <FormSelect
                    v-model="minitaskTravelReadiness"
                    :small="true"
                    :options="TRAVEL_READINESS_OPTIONS"
                    placeholder="Anzahl der Tage"
                    name="travel readiness"
                    data-qa="travel readiness dropdown"
                    @change="markAsDirty()"
                />
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                class="c-minitaskDesiredJobTravelReadiness__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Travel Readiness' : undefined"
                @click="saveData"
            >
                Übernehmen
            </AppButton>
            <AppButton
                width="condensed"
                slim
                outline
                data-qa="skip button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Skip` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Travel Readiness' : undefined"
                @click="skipped"
            >
                Später
            </AppButton>
        </template>
        <template #collapse-content>
            Je vollständiger deine Eingaben sind, desto mehr Job-Chancen hast du.
        </template>
    </AppCollapseBox>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

// 1. Prevent that the select element increases and breaks the style
.c-minitaskDesiredJobTravelReadiness {
    $select-width: 19em;

    &__formElement {
        text-align: start;

        @media (min-width: $k-breakpoint--m) {
            width: $select-width; // 1.
        }
    }

    .c-appCollapseBox__interaction &__firstButton {
        margin-top: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-top: 0;
        }
    }
}
</style>
