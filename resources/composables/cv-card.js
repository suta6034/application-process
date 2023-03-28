import {
    nextTick, ref, computed,
} from 'vue';
import {
    CLEAR_NEW_ROWS,
    DELETE,
} from '../store/mutation-types';

import scrollToElement from '../utils/scroll-to-element';
import {
    CATEGORIES,
    track,
} from '../utils/tracking';

import '../lang/notification';
import {
    useMutations,
    useState,
} from './vuex-helpers';
import {
    useTrackClick,
} from './track-click';

const PREVIEW_ITEMS = 3;

export function useCvCard({ cardKey = null, element, module = null }) {
    const {
        activeForm,
        anyFormDirty,
        newFormIsActive,
    } = useState('profile');

    const activeId = ref(null);
    const isCloseableInExtendedList = ref(false);

    const {
        SET_FORM_ACTIVE: setFormActive,
        SET_NEW_FORM_ACTIVE: setNewFormActive,
        TRIGGER_CANCEL: triggerCancel,
    } = useMutations('profile');

    const {
        SHOW_POPUP: showModal,
    } = useMutations('popup');

    const { trackClick } = useTrackClick(CATEGORIES.page.profile);

    function isInEditMode(id) {
        return activeId.value === id && activeForm.value === cardKey;
    }

    function resetEdit() {
        setFormActive(null);
        activeId.value = null;
        setNewFormActive(false);
    }

    // Depending on where the template ref is set
    // (e.g. on a html element <div> or a module <AppCard>),
    // the html element is either exposed directly or wrapped in a vue component
    const htmlElement = computed(() => element.value.$el ?? element.value);

    async function resetEditAndScroll() {
        resetEdit();

        await nextTick();
        const scrollBehavior = activeForm.value === cardKey ? 'smooth' : 'auto';
        scrollToElement(htmlElement.value, scrollBehavior);
    }

    async function openEdit(trackingName, id, closeable) {
        if (activeForm.value === cardKey && activeId.value === id) return;

        if (anyFormDirty.value) {
            triggerCancel(Date.now());
            return;
        }

        if (!activeForm.value) resetEdit();
        else await resetEditAndScroll();

        trackClick(trackingName);
        setFormActive(cardKey);

        // Form in list section
        if (Number.isInteger(id)) {
            activeId.value = id;
        } else if (id === 'NEW') {
            setNewFormActive(true);
        }
        isCloseableInExtendedList.value = closeable;

        await nextTick();
        htmlElement.value.focus();
    }

    function showDeleteModal(id) {
        showModal({
            componentName: 'ModalDeleteItem',
            ariaLabel: 'Element löschen',
            componentProps: {
                itemId: id,
                mutation: `${module}/${DELETE}`,
                deleteCallBack: resetEdit,
            },
        });
    }

    function showForbiddenDeleteModal(id) {
        showModal({
            componentName: 'ModalForbiddenDelete',
            ariaLabel: 'Letztes Element löschen',
            componentProps: {
                itemId: id,
                mutation: `${module}/${CLEAR_NEW_ROWS}`,
                editCallback: () => {
                    openEdit('profile-list-last-education-delete', id);
                    track({ element: 'PR_L: Education', elementDetail: 'Delete', ga4Event: true });
                },
            },
        });
    }

    function showLessCallback() {
        if (anyFormDirty.value) triggerCancel(Date.now());
        if (isCloseableInExtendedList.value) resetEdit();
        return anyFormDirty.value;
    }

    function handleDelete(trackingName, id) {
        if (anyFormDirty.value) {
            triggerCancel(Date.now());
        } else {
            trackClick(trackingName);
            showDeleteModal(id);
        }
    }

    function handleForbiddenDelete(trackingName, id) {
        if (anyFormDirty.value) {
            triggerCancel(Date.now());
        } else {
            trackClick(trackingName);
            showForbiddenDeleteModal(id);
        }
    }

    return {
        isInEditMode,
        resetEdit,
        resetEditAndScroll,
        openEdit,
        showLessCallback,
        handleDelete,
        handleForbiddenDelete,
        PREVIEW_ITEMS,
        activeForm,
        anyFormDirty,
        activeId,
        isCloseableInExtendedList,
        showModal,
        newFormIsActive,
    };
}
