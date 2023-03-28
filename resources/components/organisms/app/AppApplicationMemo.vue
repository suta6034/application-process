<script setup>
import {
    computed,
    ref,
    watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    maxLength,
} from '@vuelidate/validators';
import {
    STATES,
    useApplicationPatch,
} from '../../../composables/resource-application';
import {
    useNavigationGuard,
} from '../../../composables/navigation-guard';
import {
    CATEGORIES,
} from '../../../utils/tracking';
import '../../../lang/notification';
import '../../../lang/validation';

import AppButton from '../../atoms/app/AppButton';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppInfoBox from '../../molecules/app/AppInfoBox';
import FormElement from '../../molecules/form/FormElement';
import FormMessage from '../../atoms/form/FormMessage';
import FormSection from '../../molecules/form/FormSection';
import FormTextareaLimited from '../../atoms/form/FormTextareaLimited';
import ModalApiError from '../modal/ModalApiErrorAutoOpen';
import ModalDoubleCheck from '../modal/ModalDoubleCheckAutoOpen';
import ModalUnsavedChanges from '../modal/ModalUnsavedChangesAutoOpen';
import SvgLightBulb from '../../atoms/svg/SvgLightBulb';
import {
    doubleCheckEvents,
    useDoubleCheck,
} from '../../../composables/double-check';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import i18n from '../../../utils/i18n';
import {
    useFormValidation,
} from '../../../composables/form-validation';

const MAX_LENGTH_MEMO = 500;

const props = defineProps({
    application: {
        type: Object,
    },
});
const emit = defineEmits([...doubleCheckEvents]);

const {
    error,
    patch,
    state,
} = useApplicationPatch();
const memo = ref(props.application.memo);

const deleteMemo = useDoubleCheck({ emit });
const discardUnsavedChanges = useDoubleCheck({ emit });

const save = () => patch({ data: { memo: memo.value }, id: props.application.id });
const remove = () => {
    memo.value = '';
    save();
};
const cancel = () => {
    memo.value = props.application.memo;
};

const isDirty = computed(() => memo.value !== props.application.memo);
const {
    isGuarded,
    proceed,
    unguard,
} = useNavigationGuard({ isDirty });

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.applications);

const validations = {
    memo: {
        maxLength: maxLength(MAX_LENGTH_MEMO),
    },
};

const v$ = useVuelidate(validations, { memo }); // After Vuelidate upgrade: const v$ = useVuelidate(rules, state);
const root = ref(null);
const { validate } = useFormValidation(v$, root);

watch(state, () => {
    if (state.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('application.updated'),
            icon: 'check',
            dataQa: 'success updated',
        });
    }
});

function validateAndSave() {
    if (!validate()) return;
    save();
}

async function saveAndProceed() {
    if (!validate()) return;
    await save();
    proceed();
}

defineExpose({ approve: deleteMemo.approve });
</script>

<template>
    <div
        ref="root"
        class="c-appApplicationMemo"
    >
        <ModalUnsavedChanges
            v-if="isGuarded"
            @close="unguard"
            @reset="proceed"
            @save="saveAndProceed"
        />
        <ModalApiError :error="error"/>
        <AppInfoBox hint>
            <template #icon>
                <SvgLightBulb/>
            </template>
            Notiere weitere Infos zu deiner Bewerbung. Das können beispielsweise
            Notizen zu durchgeführten Telefonaten oder zur Vorbereitung fürs
            Bewerbungsgespräch sein.
        </AppInfoBox>
        <FormSection class="c-appApplicationMemo__memoSection">
            <FormElement>
                <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                <label
                    for="memo"
                    class="u-screen-reader-only"
                >
                    Notizen
                </label>
                <FormTextareaLimited
                    id="memo"
                    v-model="memo"
                    rows="10"
                    :maxlength="MAX_LENGTH_MEMO"
                    :status="v$.memo.$error ? 'error' : ''"
                    :placeholder="`Halte Notizen zu deiner Bewerbung als „${application.jobTitle}“ fest.`"
                    data-qa="memo"
                    @blur="v$.memo.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.memo.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.maxLength', { n: MAX_LENGTH_MEMO }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>
        <div
            class="c-appApplicationMemo__actions"
            :class="memo && 'c-appApplicationMemo__actions--has-delete'"
        >
            <AppLink
                secondary
                tag="button"
                data-qa="remove button"
                data-gtm-element="AP_D: Note"
                data-gtm-element-detail="Delete"
                @click="deleteMemo.inquire(); trackClick('application-note-delete')"
            >
                <template #icon>
                    <AppIcon
                        name="dustbin"
                        size="l"
                        fixed-width
                    />
                </template><!--
                        prevent whitespace characters at hover state
                        -->Löschen
                <ModalDoubleCheck
                    v-if="deleteMemo.isInquiring.value"
                    text="Möchtest du deine Notizen wirklich löschen?"
                    @approve="deleteMemo.approve(); remove();"
                    @close="deleteMemo.reset"
                    @decline="deleteMemo.decline"
                />
            </AppLink>
            <div class="c-appApplicationMemo__actionsMain">
                <AppButton
                    :disabled="!isDirty"
                    outline
                    data-qa="cancel button"
                    class="c-appApplicationMemo__actionsMainItem"
                    @click="discardUnsavedChanges.inquire(); trackClick('application-note-cancle')"
                >
                    Abbrechen
                    <ModalUnsavedChanges
                        v-if="discardUnsavedChanges.isInquiring.value"
                        @reset="discardUnsavedChanges.approve(); cancel();"
                        @close="discardUnsavedChanges.reset"
                        @save="discardUnsavedChanges.decline(); validateAndSave()"
                    />
                </AppButton>
                <AppButton
                    :disabled="!isDirty"
                    class="c-appApplicationMemo__actionsMainItem"
                    data-qa="save button"
                    data-gtm-element="AP_D: Note"
                    data-gtm-element-detail="Save"
                    @click="validateAndSave(); trackClick('application-note-save')"
                >
                    Notizen speichern
                </AppButton>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-appApplicationMemo {
    &__memoSection {
        margin-top: $k-spacing--l;
    }

    &__actions {
        display: flex;
        flex-direction: column;

        &--has-delete {
            margin-top: $k-spacing--l;
        }

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            justify-content: space-between;
            margin-top: $k-spacing--l;
        }
    }

    &__actionsMain {
        display: flex;
        flex-direction: column;
        margin-top: $k-spacing--2xl;
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            margin-top: 0;
            margin-left: auto;
            width: auto;
        }
    }

    &__actionsMainItem {
        &:first-child {
            order: 2;
            margin-top: $k-spacing--s;

            @media (min-width: $k-breakpoint--m) {
                order: 0;
                margin-top: 0;
            }
        }

        &:not(:first-child) {
            @media (min-width: $k-breakpoint--m) {
                margin-left: $k-spacing--s;
            }
        }
    }
}
</style>
