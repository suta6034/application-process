<script setup>
import {
    maxLength,
    required,
} from '@vuelidate/validators';
import {
    computed,
    inject,
    nextTick, onBeforeMount, onBeforeUnmount,
    ref, watch,
} from 'vue';

import useVuelidate from '@vuelidate/core';
import {
    DEFAULT_TEXT,
} from '../../services/motivation-letter';
import * as motivationLetterService from '../../services/motivation-letter';
import mitt from '../../utils/mitt';
import {
    CATEGORIES,
} from '../../utils/tracking';
import {
    STATES,
    useMotivationLetterPatch,
    useMotivationLetterPost,
} from '../../composables/resource-motivation-letter';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
import {
    useFocusElement,
} from '../../composables/focus-element';

import AppButton from '../atoms/app/AppButton';
import AppLink from '../atoms/app/AppLink';
import AppMotivationLetterAssemblyKit from '../organisms/app/AppMotivationLetterAssemblyKit';
import AppStack from '../organisms/app/AppStack';
import FormElement from '../molecules/form/FormElement';
import FormInput from '../atoms/form/FormInput';
import FormLabel from '../atoms/form/FormLabel';
import FormMessage from '../atoms/form/FormMessage';
import FormTextareaLimited from '../atoms/form/FormTextareaLimited';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';

import '../../lang/notification';
import '../../lang/validation';
import '../../lang/motivation-letter';
import {
    useTrackClick,
} from '../../composables/track-click';
import {
    showSnackbar,
} from '../../utils/snackbar';
import i18n from '../../utils/i18n';
import {
    useFormValidation,
} from '../../composables/form-validation';
import {
    useMutations,
} from '../../composables/vuex-helpers';

const MAX_LENGTH_TITLE = 255;
const MAX_LENGTH_TEXT = 1000;
const DEFAULT_TEXTAREA_ROWS = 11;
const LARGE_SCREEN_TEXTAREA_ROWS = 30;

const props = defineProps({
    id: {
        type: String,
        default: null,
    },
});

const router = inject('router');
const { isMediumScreen } = useBreakpoints();
const motivationLetter = ref(motivationLetterService.SHAPE());
const status = ref('idle');

const loadMotivationLetter = async (id) => {
    status.value = 'loading';
    motivationLetter.value = JSON.parse(JSON.stringify(((await motivationLetterService.get({ id })).data)));
    status.value = 'idle';
};

if (props.id) {
    loadMotivationLetter(props.id);
}

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.motivationLetter);

const {
    error: errorPatchMotivationLetter,
    patch,
    state: statePatchMotivationLetter,
} = useMotivationLetterPatch();
const {
    error: errorPostMotivationLetter,
    post,
    state: statePostMotivationLetter,
} = useMotivationLetterPost();

const dirty = ref(false);
const markAsDirty = (value = true) => {
    dirty.value = value;
};

const {
    current,
    previous,
} = useFocusElement();
const textareaComponent = ref(null);
const lastCursorPosition = ref(null);
const insertText = async (text) => {
    const textarea = textareaComponent.value.$el.querySelector('textarea');
    const isTextareaFocused = previous.value === textarea || current.value === textarea;
    if (isTextareaFocused) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        motivationLetter.value.text = motivationLetter.value.text.substring(0, startPos)
            + text
            + motivationLetter.value.text.substring(endPos, motivationLetter.value.text.length);
        lastCursorPosition.value = startPos + text.length;
    } else {
        motivationLetter.value.text = `${text}\n\n${motivationLetter.value.text}`;
        lastCursorPosition.value = text.length;
    }
    await nextTick();
    if (motivationLetter.value.text.length < MAX_LENGTH_TEXT) textarea.focus();
    textarea.selectionStart = lastCursorPosition.value;
    textarea.selectionEnd = lastCursorPosition.value;
};
const leave = async () => {
    dirty.value = false;
    await router.push({ name: 'page-motivation-letters' });
};
const save = async () => {
    const isSuccess = props.id
        ? await patch({ data: motivationLetter.value, id: props.id })
        : await post({ data: motivationLetter.value });

    if (isSuccess) leave();
};

const isSaveButtonDisabled = computed(() => !dirty.value);

const validations = {
    motivationLetter: {
        title: {
            required,
            maxLength: maxLength(MAX_LENGTH_TITLE),
        },
        text: {
            required,
            maxLength: maxLength(MAX_LENGTH_TEXT),
        },
    },
};

const v$ = useVuelidate(validations, { motivationLetter });
const root = ref(null);
const { validate } = useFormValidation(v$, root);

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

function close() {
    if (!props.id) trackClick('application-letter-cancel-changes');
    if (dirty.value) {
        showModal({
            componentName: 'ModalUnsavedChanges',
            ariaLabel: 'Ungespeicherte Änderungen',
        });
    } else {
        leave();
    }
}

function validateAndSave() {
    if (validate()) {
        if (!props.id) trackClick('application-letter-save-changes');
        save();
    }
}

watch(statePatchMotivationLetter, () => {
    if (statePatchMotivationLetter.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('motivationLetter.updated'),
            icon: 'check',
            dataQa: 'success updated',
        });
    }
});

watch(statePostMotivationLetter, () => {
    if (statePostMotivationLetter.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('motivationLetter.created'),
            icon: 'check',
            dataQa: 'success created',
        });
    }
});

onBeforeMount(() => {
    mitt.on('save-form-data', validateAndSave);
    mitt.on('reset-form-data', leave);
});

onBeforeUnmount(() => {
    mitt.off('save-form-data', validateAndSave);
    mitt.off('reset-form-data', leave);
});
</script>

<template>
    <LayoutFullscreen
        ref="root"
        brandline
        background="gray"
        class="c-pageMotivationLetterForm"
        @close="close"
    >
        <template #headline>
            <template v-if="id">
                Vorlage bearbeiten
            </template>
            <template v-else>
                Vorlage hinzufügen
            </template>
        </template>
        <template
            v-if="status === 'idle'"
            #split-left
        >
            <ModalApiError :error="errorPatchMotivationLetter"/>
            <ModalApiError :error="errorPostMotivationLetter"/>
            <AppStack gap="xl">
                <FormElement>
                    <template #start>
                        <FormLabel
                            for="motivation letter title"
                            required
                        >
                            Bezeichnung
                        </FormLabel>
                    </template>
                    <FormInput
                        id="motivation letter title"
                        v-model="motivationLetter.title"
                        :status="v$.motivationLetter.title.$error ? 'error' : ''"
                        aria-label="Name des Bewerbungsschreibens"
                        placeholder="Mein Bewerbungsschreiben"
                        data-qa="motivation letter title"
                        @blur="v$.motivationLetter.title.$touch()"
                        @input.native="markAsDirty"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.motivationLetter.title.$error"
                            type="error"
                        >
                            <li v-if="!v$.motivationLetter.title.required">
                                {{ $t('validation.required', { fieldName: 'Bezeichnung' }) }}
                            </li>
                            <li v-if="!v$.motivationLetter.title.maxLength">
                                {{ $t('validation.maxLength', { n: MAX_LENGTH_TITLE }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
                <AppMotivationLetterAssemblyKit @insert="insertText"/>
            </AppStack>
        </template>
        <template
            v-if="status === 'idle'"
            #split-right
        >
            <FormElement>
                <template #start>
                    <FormLabel
                        for="motivation letter text"
                        required
                    >
                        Bewerbungsschreiben
                    </FormLabel>
                </template>
                <FormTextareaLimited
                    ref="textareaComponent"
                    v-model="motivationLetter.text"
                    :maxlength="MAX_LENGTH_TEXT"
                    :status="v$.motivationLetter.text.$error ? 'error' : ''"
                    :rows="isMediumScreen ? LARGE_SCREEN_TEXTAREA_ROWS : DEFAULT_TEXTAREA_ROWS"
                    :placeholder="DEFAULT_TEXT"
                    :trim="false"
                    data-qa="motivation letter text"
                    @input="v$.motivationLetter.text.$touch(); markAsDirty()"
                    @click="trackClick('application-letter-change-template')"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.motivationLetter.text.$error"
                        type="error"
                    >
                        <li v-if="!v$.motivationLetter.text.required">
                            {{ $t('validation.required', { fieldName: 'Bewerbungsschreiben' }) }}
                        </li>
                        <li v-if="!v$.motivationLetter.text.maxLength">
                            {{ $t('validation.maxLength', {n: MAX_LENGTH_TEXT}) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </template>
        <template #footer>
            <AppLink
                tag="button"
                class="c-pageMotivationLetterForm__cancelLink"
                data-qa="cancel button"
                @click="close"
            >
                Abbrechen<!--
            -->
            </AppLink>
            <AppButton
                :disabled="isSaveButtonDisabled"
                data-qa="save button"
                @click="validateAndSave"
            >
                <template v-if="id">
                    Änderungen speichern
                </template>
                <template v-else>
                    Vorlage hinzufügen
                </template>
            </AppButton>
        </template>
    </LayoutFullscreen>
</template>

<style lang="scss">
@import '../../assets/scss/settings/spacing';

.c-pageMotivationLetterForm {
    &__cancelLink {
        margin-right: $k-spacing--l;
    }
}
</style>
