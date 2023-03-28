<script setup>
import {
    inject, onBeforeMount, onBeforeUnmount, ref, watch,
} from 'vue';
import {
    isEmbedded,
} from '../../../utils/frame-check';
import {
    disableScrollLock,
    enableScrollLock,
} from '../../../utils/scroll-lock';
import '../../../polyfills/inert';
import {
    useMutations, useState,
} from '../../../composables/vuex-helpers';

const previousActiveElement = ref(null);
const router = inject('router');
const {
    active,
    ariaLabel,
    componentName,
    componentProps,
    focusElementSelector,
} = useState('popup');

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const root = ref(null);

const beforeRouteChange = (to, from, next) => {
    const persistPopup = (from.meta.popup && from.meta.popup === 'persistOnRouteChange')
        || (to.meta.popup && to.meta.popup === 'persistOnRouteChange');
    if (active.value && !persistPopup) hide();

    next();
};

const escapeHandler = (e) => {
    if (e.key === 'Escape' && active.value) {
        hide();
    }
};
onBeforeMount(() => {
    document.addEventListener('keydown', escapeHandler);
    router.beforeEach(beforeRouteChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', escapeHandler);
});

const setInert = (status) => {
    if (!root.value?.parentNode) return;

    root.value.parentNode?.childNodes.forEach((child) => {
        if (child === root.value) return;
        // eslint-disable-next-line no-param-reassign
        child.inert = status;
    });
};
const resetFocus = () => {
    const customFocusElement = document.querySelector(focusElementSelector.value);
    const element = customFocusElement || previousActiveElement.value;
    element?.focus?.();
};

const disableScrolling = (currentValue, previousValue) => {
    if (currentValue) {
        previousActiveElement.value = document.activeElement;

        if (!isEmbedded()) enableScrollLock();

        document.querySelector('body').style.overflow = 'hidden';

        setInert(true);
    } else if (previousValue) {
        document.querySelector('body').style.removeProperty('overflow');

        if (!isEmbedded()) disableScrollLock();

        setInert(false);
        resetFocus();
    }
};

watch(active, disableScrolling);

// expose for unit tests
defineExpose({ disableScrolling, resetFocus, previousActiveElement, beforeRouteChange });
</script>
<script>
/* eslint-disable-next-line import/first */
import ModalApiError from '../../organisms/modal/ModalApiError';

/* istanbul ignore next */
export default {
    components: {
        ModalApiError,
        ModalApplicationsItemDelete: () => import('../../organisms/modal/ModalApplicationsItemDelete'),
        ModalApplicationsItemStatus: () => import('../../organisms/modal/ModalApplicationsItemStatus'),
        // eslint-disable-next-line max-len
        ModalApplicationsNoInvitationReason: () => import('../../organisms/modal/ModalApplicationsNoInvitationReason'),
        ModalCvBooster: () => import('../../organisms/modal/ModalCvBooster'),
        ModalDeleteAttachment: () => import('../../organisms/modal/ModalDeleteAttachment'),
        ModalDeleteItem: () => import('../../organisms/modal/ModalDeleteItem'),
        ModalDoubleCheck: () => import('../../organisms/modal/ModalDoubleCheck'),
        ModalForbiddenDelete: () => import('../../organisms/modal/ModalForbiddenDelete'),
        ModalGdpr: () => import('../../organisms/modal/ModalGdpr'),
        ModalIncompleteData: () => import('../../organisms/modal/ModalIncompleteData'),
        ModalLevelSelector: () => import('../../organisms/modal/ModalLevelSelector'),
        ModalMotivationLetterDelete: () => import('../../organisms/modal/ModalMotivationLetterDelete'),
        // eslint-disable-next-line max-len
        ModalMotivationLetterForbiddenDelete: () => import('../../organisms/modal/ModalMotivationLetterForbiddenDelete'),
        ModalMessageDelete: () => import('../../organisms/modal/ModalMessageDelete'),
        ModalMessageUnsent: () => import('../../organisms/modal/ModalMessageUnsent'),
        ModalNotInterestedReason: () => import('../../organisms/modal/ModalNotInterestedReason'),
        ModalProfileExists: () => import('../../organisms/modal/ModalProfileExists'),
        ModalResetDefaultText: () => import('../../organisms/modal/ModalResetDefaultText'),
        ModalUnsavedChanges: () => import('../../organisms/modal/ModalUnsavedChanges'),
        ModalUnsavedChangesKeepEditing: () => import('../../organisms/modal/ModalUnsavedChangesKeepEditing'),
        ModalUnsavedCvChanges: () => import('../../organisms/modal/ModalUnsavedCvChanges'),
        OverlayImageEditor: () => import('../../organisms/overlay/OverlayImageEditor'),
        ProgressPopup: () => import('../../organisms/progress/ProgressPopup'),
    },
};
</script>
<template>
    <div
        ref="root"
        :aria-label="ariaLabel"
        class="c-appPopup"
        role="dialog"
    >
        <Component
            :is="componentName"
            v-bind="componentProps"
        />
    </div>
</template>
