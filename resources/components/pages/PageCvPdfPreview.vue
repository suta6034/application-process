<script setup>
import {
    onBeforeMount,
    inject,
} from 'vue';
import * as CvFileService from '../../services/cv-file';
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    useMutations,
} from '../../composables/vuex-helpers';

const {
    HIDE_POPUP: hidePopup,
    SHOW_POPUP: showPopup,
} = useMutations('popup');

const store = inject('store');
const router = inject('router');

function showErrorModal() {
    hidePopup();
    commitAndShowModal(store.commit, Error('PDF could not be displayed'), {}, {
        showCloseButton: false,
        componentProps: {
            closeAction: window.close,
        },
    });
}

async function checkCvFilePreviewAvailability() {
    showPopup({
        componentName: 'ProgressPopup',
        type: 'progress',
    });
    try {
        const isAvailable = await CvFileService.fetchAvailability();
        if (isAvailable) {
            await router.push({
                name: 'pdf',
                query: { display: 'inline' },
            });
        } else {
            showErrorModal();
        }
    } catch (error) {
        showErrorModal();
    }
}

onBeforeMount(checkCvFilePreviewAvailability);
</script>

<template>
    <div/>
</template>
