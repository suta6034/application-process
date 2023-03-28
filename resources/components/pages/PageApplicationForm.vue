<script setup>
import {
    inject, onBeforeMount, onBeforeUnmount,
    ref,
    shallowRef,
    watch,
} from 'vue';

import * as applicationService from '../../services/application';
import mitt from '../../utils/mitt';
// eslint-disable-next-line import/no-cycle
import {
    STATES,
    useApplicationPatch,
    useApplicationPost,
} from '../../composables/resource-application';
import {
    emitUserAction,
} from '../../services/user-actions';

import AppButton from '../atoms/app/AppButton';
import AppLink from '../atoms/app/AppLink';
import FormApplication from '../organisms/form/FormApplication';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';

import '../../lang/application';
import {
    useMutations,
} from '../../composables/vuex-helpers';
import {
    showSnackbar,
} from '../../utils/snackbar';
import i18n from '../../utils/i18n';

const props = defineProps({
    id: {
        type: String,
        default: null,
    },
});

const router = inject('router');
const application = shallowRef({});
const status = ref('idle');

const loadApplication = async (id) => {
    status.value = 'loading';
    application.value = (await applicationService.get({ id })).data;
    status.value = 'idle';
};

const loadEmptyApplication = async () => {
    status.value = 'loading';
    application.value = (await applicationService.getEmpty()).data;
    status.value = 'idle';
};

if (props.id) {
    loadApplication(props.id);
} else {
    loadEmptyApplication();
}

const { SHOW_POPUP: showModal } = useMutations('popup');
const {
    error: errorPatchApplication,
    patch,
    state: statePatchApplication,
} = useApplicationPatch();
const {
    error: errorPostApplication,
    post,
    state: statePostApplication,
} = useApplicationPost();

const dirty = ref(false);
const markAsDirty = (value = true) => {
    dirty.value = value;
};
const validateAndSave = () => {
    if (!props.id) emitUserAction('application-add-application-save');
    mitt.emit('save-form-data');
};
const leave = async () => {
    dirty.value = false;
    await router.back();
};
const save = async () => {
    const isSuccess = props.id
        ? await patch({ data: application.value, id: props.id })
        : await post({ data: application.value });

    if (isSuccess) leave();
};

watch(statePatchApplication, () => {
    if (statePatchApplication.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('application.updated'),
            icon: 'check',
        });
    }
});

watch(statePostApplication, () => {
    if (statePostApplication.value === STATES.isSuccess) {
        showSnackbar({
            text: i18n('application.created'),
            icon: 'check',
        });
    }
});

function close() {
    if (!props.id) emitUserAction('application-add-application-cancel');

    if (dirty.value) {
        showModal({
            componentName: 'ModalUnsavedChanges',
            ariaLabel: 'Ungespeicherte Änderungen',
        });
    } else {
        leave();
    }
}

function openDeleteApplicationModal() {
    showModal({
        componentName: 'ModalApplicationsItemDelete',
        componentProps: {
            applicationId: props.id,
            confirmedCallback: leave,
        },
    });
    emitUserAction('application-delete');
}

onBeforeMount(() => {
    mitt.on('reset-form-data', leave);
});

onBeforeUnmount(() => {
    mitt.off('reset-form-data', leave);
});
</script>

<template>
    <LayoutFullscreen
        @close="close"
    >
        <ModalApiError :error="errorPatchApplication"/>
        <ModalApiError :error="errorPostApplication"/>
        <template #headline>
            <template v-if="id">
                Bewerbung bearbeiten
            </template>
            <template v-else>
                Bewerbung hinzufügen
            </template>
        </template>
        <FormApplication
            v-if="status === 'idle'"
            v-model="application"
            @dirty="markAsDirty"
            @save="save"
            @remove="openDeleteApplicationModal"
        />
        <template #footer>
            <AppLink
                tag="button"
                class="c-pageApplicationForm__cancelLink"
                data-qa="cancel button"
                @click="close"
            >
                Abbrechen<!--
            -->
            </AppLink>
            <AppButton
                data-qa="save button"
                @click="validateAndSave"
            >
                <template v-if="id">
                    Änderungen speichern
                </template>
                <template v-else>
                    Bewerbung hinzufügen
                </template>
            </AppButton>
        </template>
    </LayoutFullscreen>
</template>

<style lang="scss">
@import '../../assets/scss/settings/spacing';

.c-pageApplicationForm {
    &__cancelLink {
        margin-right: $k-spacing--l;
    }
}
</style>
