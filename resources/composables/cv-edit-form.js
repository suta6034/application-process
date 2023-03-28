import {
    nextTick,
    onBeforeMount, onBeforeUnmount,
    ref, unref, watch, inject,
} from 'vue';
import mitt from '../utils/mitt';

import '../lang/notification';
import {
    useFormValidation,
} from './form-validation';
import {
    useActions, useGetters, useMutations, useState,
} from './vuex-helpers';
import i18n from '../utils/i18n';
import {
    showToast,
} from '../utils/toast';

export const cvEditFormProps = {
    standalone: {
        type: Boolean,
        default: false,
    },
};

export const cvEditFormEvents = ['closeEdit'];

export function useCvEditForm(props, emit, v$, submitted) {
    const router = inject('router');
    const dirty = ref(false);
    const root = ref(null);
    const next = ref(null);
    const { validate } = useFormValidation(v$, root);

    const {
        model: profileModel,
    } = useGetters('profile');

    const {
        cancelTimestamp,
        anyFormDirty,
        activeForm,
    } = useState('profile');

    const {
        FETCH_PROFILE: fetchProfile,
        UPDATE_PROFILE: updateProfile,
    } = useActions('profile');

    const {
        SET_FORM_DIRTY: setFormDirty,
    } = useMutations('profile');

    const {
        HIDE_POPUP: hideModal,
        SHOW_POPUP: showModal,
    } = useMutations('popup');

    function markAsDirty() {
        dirty.value = true;
        setFormDirty(dirty.value);
        return true;
    }
    function sendMessageToK4(target) {
        /* istanbul ignore next */
        window.top.postMessage({
            type: 'event',
            action: 'close',
            target,
        }, '*');
    }

    function handleRedirect(redirect) {
        if (redirect && !(redirect instanceof Event)) {
            if (redirect === 'browserBack') return router.back();
            return router.push(redirect);
        }
        /* istanbul ignore next */
        if (next.value) return next.value();

        return router.push({ name: 'page-cv' });
    }

    async function reset(redirect) {
        dirty.value = false;
        setFormDirty(dirty.value);

        await fetchProfile();
        await nextTick();

        if (!props.standalone) emit('closeEdit');
        else await handleRedirect(redirect);
    }
    async function save(redirect, matching) {
        // Wait for all form fields to update their values.
        await nextTick();

        if (!validate()) return;

        if (submitted) {
            // eslint-disable-next-line no-param-reassign
            submitted.value = true;
        }

        dirty.value = false;
        setFormDirty(dirty.value);

        emit('closeEdit');

        await updateProfile(profileModel.value);
        if (matching) {
            /* istanbul ignore next */
            sendMessageToK4('saveButton');
        } else {
            if (props.standalone) await handleRedirect(redirect);

            showToast({ text: i18n('notification.saved') });
        }
    }

    function handleCancel() {
        if (unref(v$)?.$invalid) {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            showModal({
                componentName: 'ModalIncompleteData',
                ariaLabel: 'Unvollständige Angaben',
            });
        } else if (dirty.value) {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            showModal({
                componentName: 'ModalUnsavedChanges',
                ariaLabel: 'Ungespeicherte Änderungen',
            });
        }
    }

    function cancel() {
        if (dirty.value) handleCancel();
        else emit('closeEdit');
    }

    async function beforeRouteLeaveCustom(nextRoute) {
        if (!dirty.value) nextRoute();
        else {
            /* istanbul ignore next */
            next.value = nextRoute;

            // Hide existing popups, just in case.
            /* istanbul ignore next */
            hideModal();

            // Wait for update after hiding an existing popup.
            /* istanbul ignore next */
            await nextTick();

            handleCancel();
        }
    }

    watch(cancelTimestamp, () => {
        if (dirty.value && !props.standalone) {
            handleCancel();
        }
    });

    onBeforeMount(() => {
        mitt.on('reset-form-data', reset);
        mitt.on('save-form-data', save);
        next.value = null;
    });

    onBeforeUnmount(() => {
        mitt.off('reset-form-data', reset);
        mitt.off('save-form-data', save);
    });

    return {
        validate,
        root,
        dirty,
        beforeRouteLeaveCustom,
        handleCancel,
        cancel,
        markAsDirty,
        anyFormDirty,
        activeForm,
        save,
        sendMessageToK4,
    };
}
