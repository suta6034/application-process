<script setup>
import {
    required,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    inject,
    ref, watch,
} from 'vue';
import '../../../lang/application';
import {
    emitUserAction,
} from '../../../services/user-actions';
import {
    formatIsoPhp,
} from '../../../services/application';
import {
    SHOW_POPUP,
} from '../../../store/mutation-types';
import {
    makeDateModel,
} from '../../../utils/date-model';
import {
    isoDate,
    maxDate,
    minDate,
} from '../../../utils/validators';
import {
    track,
} from '../../../utils/tracking';
import {
    STATES,
    useApplicationStatusPatch,
} from '../../../composables/resource-application-status';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import FormDatePicker from '../../molecules/form/FormDatePicker';
import FormElement from '../../molecules/form/FormElement';
import FormFlag from '../../atoms/form/FormFlag';
import FormMessage from '../../atoms/form/FormMessage';
import FormPill from '../../atoms/form/FormPill';
import FormSection from '../../molecules/form/FormSection';
import LayoutModal from '../../layouts/LayoutModal';
import ProgressDots from '../../atoms/progress/ProgressDots';

import '../../../directives/debounce-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import {
    useMutations,
} from '../../../composables/vuex-helpers';
import i18n from '../../../utils/i18n';
import {
    useFormValidation,
} from '../../../composables/form-validation';

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const store = inject('store');

// We use UNIX timestamps to save dates in the DB ¯\_(ツ)_/¯
const MAX_YEAR_2038_PROBLEM = new Date('2037-01-01');
const MIN_YEAR_1970_PROBLEM = new Date('1971-01-01');

const props = defineProps({
    applicationId: {
        required: true,
        type: String,
    },
    gaPrefix: {
        type: String,
    },
    status: {
        type: String,
        default: 'applied',
    },
    statusDate: {
        type: String,
        default: null,
    },
    statusChangeCallback: {
        type: Function,
        default: null,
    },
    bodyLayout: {
        type: String,
        default: null,
    },
});

const {
    patch,
    state,
} = useApplicationStatusPatch();

const updatedStatus = ref(props.status);
const updatedStatusDate = ref(props.statusDate || makeDateModel().format(formatIsoPhp));

// Change for example status "REJECTED" into "Rejected" for correct tracking
const formatStatusName = status => status.charAt(0) + status.slice(1).toLowerCase();

const validations = {
    updatedStatusDate: {
        required,
        isoDate: isoDate(true, true, false),
        maxDate: maxDate(MAX_YEAR_2038_PROBLEM),
        minDate: minDate(MIN_YEAR_1970_PROBLEM),
    },
};

const root = ref(null);
const v$ = useVuelidate(validations, { updatedStatusDate });
const { validate } = useFormValidation(v$, root);

async function save() {
    if (!validate()) return;

    const data = { status: updatedStatus.value };
    if (updatedStatus.value === 'INVITED') {
        data.statusDate = updatedStatusDate.value;
    }

    const isSuccess = await patch({ id: props.applicationId, data });

    if (!isSuccess) {
        store.commit(`popup/${SHOW_POPUP}`, {
            componentName: 'ModalApiError',
            type: 'error',
        });
        return;
    }

    if (props.statusChangeCallback) {
        props.statusChangeCallback({
            status: updatedStatus.value,
        });
    }

    showSnackbar({
        text: i18n('application.statusUpdated'),
        icon: 'check',
    });

    emitUserAction(`application-state-changeto-${updatedStatus.value.toLowerCase()}`);

    if (props.gaPrefix) {
        track({
            element: `${props.gaPrefix}: Application State`,
            elementDetail: `Change to ${formatStatusName(updatedStatus.value)}`,
            ga4Event: true,
        });
    }
    // Hiding the modal immediately destroys the component. We must do
    // this after all the async code has run to make sure the reactive
    // code in `setup()` is executed correctly before teardown.
    hide();
}

function cancel() {
    hide();
    emitUserAction('application-invited-date-cancel');
}

watch(updatedStatus, () => {
    if (updatedStatus.value === 'INVITED') return;
    save();
});
</script>

<template>
    <LayoutModal
        ref="root"
        class="c-modalApplicationsItemStatus"
        :body-layout="'fullWidth'"
        @hide="
            emitUserAction('application-state-changeto-cancel');
            track({ element: 'AP_D: Application State', elementDetail: 'Change to Cancel', ga4Event: true});"
    >
        <template #headline>
            Status ändern
        </template>
        <p>
            Verwalte hier den Status deiner Bewerbung und behalte so immer den Überblick.
        </p>
        <div class="c-modalApplicationsItemStatus__options">
            <ProgressDots v-if="state === STATES.isLoading"/>
            <template v-else>
                <FormPill
                    class="c-modalApplicationsItemStatus__option"
                    :label="$t('application.status.applied')"
                    :status="updatedStatus === 'APPLIED' ? 'active' : undefined"
                    type="checkbox"
                    data-qa="change-status-applied button"
                    @click.native.prevent="updatedStatus = 'APPLIED'"
                />
                <FormPill
                    class="c-modalApplicationsItemStatus__option"
                    :label="$t('application.status.invited')"
                    :status="updatedStatus === 'INVITED' ? 'active' : undefined"
                    type="checkbox"
                    data-qa="change-status-invited button"
                    @click.native.prevent="updatedStatus = 'INVITED'"
                />
                <FormPill
                    class="c-modalApplicationsItemStatus__option"
                    :label="$t('application.status.confirmed')"
                    :status="updatedStatus === 'CONFIRMED' ? 'active' : undefined"
                    type="checkbox"
                    data-qa="change-status-confirmed button"
                    @click.native.prevent="updatedStatus = 'CONFIRMED'"
                />
                <FormPill
                    class="c-modalApplicationsItemStatus__option"
                    :label="$t('application.status.rejected')"
                    :status="updatedStatus === 'REJECTED' ? 'active' : undefined"
                    type="checkbox"
                    data-qa="change status rejected button"
                    @click.native.prevent="updatedStatus = 'REJECTED'"
                />
                <FormPill
                    class="c-modalApplicationsItemStatus__option"
                    :label="$t('application.status.archived')"
                    :status="updatedStatus === 'ARCHIVED' ? 'active' : undefined"
                    type="checkbox"
                    data-qa="change-status-archived button"
                    @click.native.prevent="updatedStatus = 'ARCHIVED'"
                />
            </template>
        </div>
        <template
            v-if="updatedStatus === 'INVITED'"
            #breakout
        >
            <FormSection>
                <template #headline>
                    Gib noch den Tag und die Uhrzeit des Gesprächs an&nbsp;<FormFlag>*</FormFlag>
                </template>
                <FormElement class="c-modalApplicationsItemStatus__dateWrapper">
                    <FormDatePicker
                        id="date"
                        v-model="updatedStatusDate"
                        :status="v$.updatedStatusDate.$error ? 'error' : ''"
                        class="c-modalApplicationsItemStatus__date"
                        position="auto"
                        has-time
                        inline
                        data-qa="interview datepicker"
                        @input="
                            v$.updatedStatusDate.$touch();
                            emitUserAction('application-select-invited-date');
                            track({
                                element: 'AP_D: Application State',
                                elementDetail: 'Set Invited Date',
                                ga4Event: true,
                            });"
                    />
                    <template #end>
                        <FormMessage
                            v-if="v$.updatedStatusDate.$error"
                            type="error"
                        >
                            <li v-if="v$.updatedStatusDate.required.$invalid">
                                {{ $t('validation.date') }}
                            </li>
                            <li v-if="v$.updatedStatusDate.isoDate.$invalid || v$.updatedStatusDate.maxDate.$invalid">
                                {{ $t('validation.date') }}
                            </li>
                            <li v-if="v$.updatedStatusDate.minDate.$invalid">
                                {{ $t('validation.dateMin', { date: MIN_YEAR_1970_PROBLEM.getFullYear() }) }}
                            </li>
                        </FormMessage>
                    </template>
                </FormElement>
            </FormSection>
        </template>
        <template #actions>
            <template v-if="updatedStatus === 'INVITED'">
                <AppButton
                    v-debounce-click
                    :disabled="v$.$error"
                    data-qa="save button"
                    @click="save"
                >
                    Gesprächstermin speichern
                </AppButton>
                <AppLink
                    v-debounce-click
                    tag="button"
                    data-qa="cancel button"
                    @click="cancel"
                >
                    Abbrechen
                </AppLink>
            </template>
        </template>
    </LayoutModal>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-modalApplicationsItemStatus {
    &__options {
        margin-top: $k-spacing--xl;
    }

    &__option {
        margin-top: $k-spacing--xs;

        &:not(:first-child) {
            margin-left: $k-spacing--xs;
        }
    }

    &__dateWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: $k-spacing--3xl;
        padding-left: $k-spacing--3xl;
    }

    &__date {
        margin-top: $k-spacing--s;
    }
}
</style>
