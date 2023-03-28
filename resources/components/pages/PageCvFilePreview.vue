<script setup>
import {
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    ref,
    inject,
} from 'vue';
import AppButton from '../atoms/app/AppButton';
import AppLink from '../atoms/app/AppLink';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import ProgressDots from '../atoms/progress/ProgressDots';

import {
    patchTemplateSettings,
    prepareLivePreviewData,
}
    from '../../services/cv-file';

import {
    commitAndShowModal,
} from '../../utils/error';
import {
    isEmbedded,
} from '../../utils/frame-check';
import mitt from '../../utils/mitt';

import '../../lang/notification';
import {
    useActions, useMutations, useState,
} from '../../composables/vuex-helpers';
import i18n from '../../utils/i18n';
import {
    showToast,
} from '../../utils/toast';

const { SHOW_POPUP: showModal } = useMutations('popup');
const { settings: templateSettings } = useState('templateSettings');
const { CREATE_TEMPLATE_SETTINGS: createTemplateSettings } = useActions('templateSettings');
const { SET_MODIFIED: setModified } = useMutations('templateSettings');

// The iframe size is fixed (set by Kickresume) and has a 1:√2 (A4) ratio.
const iframeWidth = 794;
const iframeHeight = 1123;

const buttonDisabled = ref(false);
const iframeSource = ref(false);
const iframeTargetOrigin = ref(false);

const pageContainer = ref(null);
const iframeElement = ref(null);

const router = inject('router');
const store = inject('store');

/* istanbul ignore next: Hard to test – tested in acceptance tests. */
if (process.env.NODE_ENV === 'development') {
    iframeSource.value = '/profil/lebenslauf/design-vorschau/debug';
    iframeTargetOrigin.value = '*';
} else {
    iframeSource.value = 'https://api.kickresume.com/render-preview/karriere-at/';
    iframeTargetOrigin.value = 'https://api.kickresume.com';
}

function resizePreview() {
    const containerStyles = window.getComputedStyle(pageContainer.value);
    const containerHeight = pageContainer.value.offsetHeight
        - parseInt(containerStyles.paddingTop, 10)
        - parseInt(containerStyles.paddingBottom, 10);
    if (iframeElement.value) {
        // eslint-disable-next-line no-shadow
        const iframeHeight = iframeElement.value.offsetHeight;
        const ratio = iframeHeight / containerHeight;

        const transform = `scale(${1 / ratio})`;
        iframeElement.value.style.transform = transform;
    }
}

// The preview is not generated from data of the database as nothing was saved at this point.
// prepareLivePreviewData replaces the settings from the database with the new settings,
// but as educationFirst is not a kickresume parameter we need to manually change the order of education and
// experience to get a correct preview.
function mapPreviewData(data) {
    const { sections } = data;
    const indexEducation = sections.findIndex(x => x.name === 'Ausbildung');
    const indexWorkExperience = sections.findIndex(x => x.name === 'Berufserfahrung');

    if (templateSettings.value.educationFirst) {
        if (indexWorkExperience === -1 || indexEducation === -1
            || indexWorkExperience > indexEducation) return data;

        const tempWorkExperience = sections[indexWorkExperience];
        sections[indexWorkExperience] = sections[indexEducation];
        sections[indexEducation] = tempWorkExperience;
    } else {
        if (indexWorkExperience === -1 || indexEducation === -1
            || indexEducation > indexWorkExperience) return data;

        const tempEducation = sections[indexEducation];
        sections[indexEducation] = sections[indexWorkExperience];
        sections[indexWorkExperience] = tempEducation;
    }
    return { ...data, sections: [...sections] };
}

async function updatePreview() {
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    const data = await prepareLivePreviewData(templateSettings.value);
    const preparedData = mapPreviewData(data);
    iframeElement.value.contentWindow.postMessage({
        type: 'cv_data',
        data: preparedData,
    }, iframeTargetOrigin.value);
    resizePreview();
}

async function createAndSaveTemplateSettings() {
    try {
        await createTemplateSettings({
            templateSettings: templateSettings.value,
        });
        /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        if (!isEmbedded()) {
            showToast({ text: i18n('notification.saved') });
            await router.push({ name: 'page-cv' });
        } else {
            window.top.postMessage({
                type: 'event',
                action: 'close',
            }, '*');
        }
    } catch (error) {
        // eslint-disable-next-line no-lone-blocks
        {
            buttonDisabled.value = false;
            commitAndShowModal(store.commit, error);
        }
    }
}

async function saveTemplateSettings() {
    buttonDisabled.value = true;
    if (!templateSettings.value) {
        await createAndSaveTemplateSettings();
    } else {
        try {
            await patchTemplateSettings(templateSettings.value);
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            if (!isEmbedded()) {
                showToast({ text: i18n('notification.saved') });
                await router.push({ name: 'page-cv' });
            } else {
                window.top.postMessage({
                    type: 'event',
                    action: 'close',
                }, '*');
            }
            setModified(false);
        } catch (error) {
            // eslint-disable-next-line no-lone-blocks
            {
                buttonDisabled.value = false;
                commitAndShowModal(store.commit, error);
            }
        }
    }
}

function close() {
    showModal({
        componentName: 'ModalUnsavedCvChanges',
        ariaLabel: 'Ungespeicherte Änderungen',
    });
}

onBeforeMount(() => {
    mitt.on('save-cv-template', saveTemplateSettings);
});

onBeforeUnmount(() => {
    mitt.off('save-cv-template', saveTemplateSettings);
});

onMounted(() => {
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    window.addEventListener('resize', resizePreview);
});

onUnmounted(() => {
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    window.removeEventListener('resize', resizePreview);
});

// Exposing for unit test
defineExpose({ resizePreview, buttonDisabled, templateSettings });
</script>

<template>
    <LayoutFullscreen
        @close="close"
    >
        <template #headline>
            Vorschau
        </template>
        <div
            ref="pageContainer"
            class="c-pageCvFilePreview"
        >
            <div class="c-pageCvFilePreview__iframeContainer">
                <div class="c-pageCvFilePreview__loading">
                    <ProgressDots/>
                </div>
                <!-- `scrolling="no"` is deprecated (as per the HTML 5) but removes scrollbars in Edge.  -->
                <iframe
                    ref="iframeElement"
                    title="Lebenslaufvorschau"
                    class="c-pageCvFilePreview__iframe"
                    :src="iframeSource"
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="no"
                    :width="iframeWidth"
                    :height="iframeHeight"
                    data-qa="cv file iframe"
                    @load="updatePreview"
                />
            </div>
        </div>
        <template #footer>
            <AppLink
                :to="{ name: 'page-cv-file-edit' }"
                class="c-pageCvFilePreview__backLink"
                data-qa="back link"
            >
                Zurück<!--
            -->
            </AppLink>
            <AppButton
                data-qa="save button"
                :disabled="buttonDisabled"
                @click.native="saveTemplateSettings"
            >
                Design speichern
            </AppButton>
        </template>
    </LayoutFullscreen>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/settings/z-index';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/components/loading-dots/index';

// 1. This is necessary for our acceptance tests to be able to click the `Change design` button,
//    also a user shouldn’t be able to interact with the iframe's content.
.c-pageCvFilePreview {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: $z-index-zero;
    padding-top: $k-spacing--2xl;
    padding-bottom: $k-spacing--2xl;
    background-color: $k-color-gray--50;

    &__loading {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__iframeContainer {
        position: fixed;
        top: 50%;
        left: 50%;
        display: block;
        transform: translate(-50%, -50%);
        pointer-events: none; // 1
    }

    &__iframe {
        border: 1px solid $k-color-gray--100;
        background-color: $k-color-white;
        transform: scale(0);
    }

    &__backLink {
        margin-right: $k-spacing--l;
    }
}
</style>
