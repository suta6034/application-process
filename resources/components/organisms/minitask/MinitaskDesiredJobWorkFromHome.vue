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
    WORKFROMHOME_OPTIONS,
} from '../../../models/DesiredJob';

defineProps({
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(minitaskEvents);

const root = ref(null);
const minitaskWorkFromHome = ref({});

const {
    workFromHome,
} = useState('profile/desiredJob');

const {
    markAsDirty,
    dirty,
    saveData,
    skipped,
} = useMinitaskEditForm({
    key: 'workFromHome',
    emit,
    onSave: () => { workFromHome.value = minitaskWorkFromHome.value; },
});

// Initialise value once from store
onBeforeMount(() => {
    minitaskWorkFromHome.value = workFromHome.value;
});

// Expose for unit tests
defineExpose({ dirty, minitaskWorkFromHome });
</script>

<template>
    <AppCollapseBox ref="root">
        <template #media>
            <IllustrationMinitaskDesiredJobAlternative data-qa="illustration"/>
        </template>
        <template #headline>
            Wie viele Tage pro Woche willst du im Homeoffice arbeiten?
        </template>
        <template #content>
            Lass dich von Firmen finden, die deinen Wunschjob für dich bereit halten!
        </template>
        <template #interaction>
            <FormElement class="c-minitaskDesiredJobWorkFromHome__formElement">
                <FormSelect
                    v-model="minitaskWorkFromHome"
                    :small="true"
                    :options="WORKFROMHOME_OPTIONS"
                    placeholder="Anzahl der Tage"
                    name="work from home"
                    data-qa="work from home dropdown"
                    @change="markAsDirty()"
                />
            </FormElement>
            <AppButton
                :disabled="!dirty"
                width="condensed"
                slim
                class="c-minitaskDesiredJobWorkFromHome__firstButton"
                data-qa="save button"
                :data-gtm-element="gaPrefix ? `${gaPrefix}: Minitask - Proceed` : undefined"
                :data-gtm-element-detail="gaPrefix ? 'Homeoffice' : undefined"
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
                :data-gtm-element-detail="gaPrefix ? 'Homeoffice' : undefined"
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
.c-minitaskDesiredJobWorkFromHome {
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
