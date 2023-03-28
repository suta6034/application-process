<script setup>
import {
    inject, onBeforeMount, ref,
} from 'vue';

import * as CvFileService from '../../../../services/cv-file';
import {
    commitAndShowModal,
} from '../../../../utils/error';
import {
    isEmbedded,
} from '../../../../utils/frame-check';
import {
    hasPdfSupport,
} from '../../../../utils/pdf-support';
import {
    CATEGORIES,
    trackPageView,
    trackSubContentGroup,
} from '../../../../utils/tracking';
import {
    log,
} from '../../../../utils/action-logger';

import AppCvCompleteness from '../../../molecules/app/AppCvCompleteness';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import AppVisibility from '../../../atoms/app/AppVisibility';
import ProgressDots from '../../../atoms/progress/ProgressDots';
import {
    useTrackClick,
} from '../../../../composables/track-click';

const router = inject('router');
const store = inject('store');

defineProps({
    isVisible: {
        type: Boolean,
    },
});

const settings = ref(null);
const loading = ref(false);
const cvPdfPreviewLinkUrl = router.resolve({ name: hasPdfSupport() ? 'page-cv-pdf-preview' : 'pdf' }).href;
const cvPdfPreviewLinkTarget = hasPdfSupport() ? '_blank' : '_self';

onBeforeMount(async () => {
    const { data } = await CvFileService.getTemplateSettings();
    settings.value = data.data.attributes;
});

const getPreviewImage = () => {
    if (settings.value) {
        /* eslint-disable-next-line max-len, import/no-dynamic-require, global-require */
        return require(`../../../../assets/img/cv-templates/skeletons/${settings.value.template}-${settings.value.color}.png`);
    }
    /* eslint-disable-next-line global-require */
    return require('../../../../assets/img/cv-templates/skeletons/vegan-blu-gre.png');
};

const { trackClick } = useTrackClick(CATEGORIES.page.profile);

const initiateDownload = async () => {
    loading.value = true;
    try {
        const isAvailable = await CvFileService.fetchAvailability();
        /* istanbul ignore next */
        loading.value = false;
        /* istanbul ignore next */
        if (isAvailable) {
            await router.push({ name: 'pdf' });
        } else {
            commitAndShowModal(store.commit, Error('PDF could not be downloaded'));
        }
    } catch (error) {
        loading.value = false;
        commitAndShowModal(store.commit, error);
    }
};

const downloadCvFile = () => {
    trackClick('profile-card-download-pdf');
    log('cv-preview', { result: 'download' });
    initiateDownload();
};

const openPdfPreview = (e) => {
    trackClick('profile-card-preview');
    if (hasPdfSupport()) {
        trackSubContentGroup('Vorschau');
        trackPageView('/profil/lebenslauf/pdf-vorschau');
        log('cv-preview', { source: 'karl' });
        setTimeout(() => {
            trackSubContentGroup(null);
        }, 100);
    } else {
        e.preventDefault();
        initiateDownload();
        log('cv-preview', { result: 'download' });
    }
};

const emit = defineEmits(['complete']);
</script>

<template>
    <div class="c-cardCvAction k-c-card k-c-card--noBorder">
        <router-link
            :to="{ name: 'page-visibility-form'}"
            class="c-cardCvAction__badge"
            data-qa="visibility badge"
            data-gtm-element="PR_L: Profile"
            data-gtm-element-detail="Change Visibility"
            @click.native="trackClick('profile-card-change-visibility')"
        >
            <AppVisibility
                :is-visible="isVisible"
            />
        </router-link>
        <div class="k-c-card__body">
            <a
                class="c-cardCvAction__preview"
                data-qa="skeleton preview image"
                :href="cvPdfPreviewLinkUrl"
                :target="cvPdfPreviewLinkTarget"
                tabindex="-1"
                @click="openPdfPreview"
            >
                <span class="u-screen-reader-only">
                    PDF Vorschau ansehen
                </span>
                <img
                    :src="getPreviewImage()"
                    :class="{ 'is-disabled' : loading }"
                    alt=""
                    class="c-cardCvAction__image"
                    data-qa="cv preview skeleton"
                >
                <ProgressDots
                    v-if="loading"
                    class="c-cardCvAction__dots"
                    data-qa="loading spinner"
                />
            </a>
            <div class="c-cardCvAction__actions">
                <AppLink
                    mixed
                    data-qa="preview link"
                    :href="cvPdfPreviewLinkUrl"
                    :target="cvPdfPreviewLinkTarget"
                    data-gtm-element="PR_L: CV"
                    data-gtm-element-detail="Preview"
                    @click="openPdfPreview"
                >
                    <template #icon>
                        <AppIcon
                            name="cv"
                            size="l"
                            class="c-cardCvAction__icon"
                            fixed-width
                        />
                    </template>
                    <span><!--
                                prevent whitespace characters at hover state
                                -->Lebenslauf-Vorschau
                    </span>
                </AppLink>
                <AppLink
                    :to="{ name: 'page-cv-file-edit', params: { reset: isEmbedded() }}"
                    mixed
                    data-qa="edit design link"
                    data-gtm-element="PR_L: CV"
                    data-gtm-element-detail="Change Design"
                    @click.native="trackClick('profile-card-change-design')"
                >
                    <template #icon>
                        <AppIcon
                            name="bucket"
                            size="l"
                            class="c-cardCvAction__icon"
                            fixed-width
                        />
                    </template>
                    <span><!--
                                prevent whitespace characters at hover state
                                -->Design ändern
                    </span>
                </AppLink>
                <AppLink
                    :mixed="!loading"
                    :disabled="loading"
                    tag="button"
                    data-qa="download link"
                    data-gtm-element="PR_L: CV"
                    data-gtm-element-detail="Download PDF"
                    @click.native="downloadCvFile"
                >
                    <template #icon>
                        <AppIcon
                            name="download"
                            size="l"
                            class="c-cardCvAction__icon"
                            fixed-width
                        />
                    </template>
                    <span><!--
                                prevent whitespace characters at hover state
                                -->Als PDF herunterladen
                    </span>
                </AppLink>
                <AppLink
                    :to="{ name: 'page-visibility-form' }"
                    mixed
                    data-qa="visibility link"
                    data-gtm-element="PR_L: Profile"
                    data-gtm-element-detail="Change Visibility"
                    @click.native="
                        trackClick('profile-card-change-visibility');
                        log('profile-card-change-visibility-link');
                    "
                >
                    <template #icon>
                        <AppIcon
                            name="eye"
                            size="l"
                            class="c-cardCvAction__icon"
                            fixed-width
                        />
                    </template>
                    <span>
                        <!--
                                prevent whitespace characters at hover state
                                -->Sichtbarkeit ändern
                    </span>
                </AppLink>
            </div>
        </div>
        <AppCvCompleteness
            data-qa="completeness area"
            data-gtm-element="PR_L: Profile"
            data-gtm-element-detail="Completeness-Box"
            @click.native="trackClick('profile-card-completeness')"
            @complete="emit('complete', $event)"
        />
    </div>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/border-radius';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

// 1. Set color to border-color to prevent Safari from randomly applying text color to borders for images in <a> tags
.c-cardCvAction {
    $root: &;
    $skeletonHeight: 9rem;
    $skeletonWidth: 10rem;
    $loadingStateOpacity: 0.5;

    border-color: $k-color-gray--200;

    &__badge {
        display: inline-block;
        margin-top: $k-spacing--l;
    }

    &__preview {
        position: relative;
        display: block;
        margin: 0 auto;
        width: $skeletonWidth;
        cursor: pointer;

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(0deg, $k-color-white 10%, rgb(255 255 255 / 0%) 60%);
            content: '';
        }
    }

    &__image {
        width: 100%;
        height: $skeletonHeight;
        border: 1px solid $k-color-gray--50;
        border-radius: $k-border-radius--s;
        color: $k-color-gray--50; // 1.
        object-fit: cover;
        object-position: 100% 0;

        &.is-disabled {
            opacity: $loadingStateOpacity;
        }
    }

    &__dots {
        position: absolute;
        top: $k-spacing--4xl;
        display: block;
        width: 100%;
        text-align: center;
    }

    &__actions {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-top: $k-spacing--m;

        & * {
            display: flex;
            align-items: center;
            margin-top: $k-spacing--xs;

            &:hover,
            &:focus {
                #{$root}__icon {
                    color: $k-color-green--800;
                }
            }
        }
    }

    &__icon {
        color: $k-color-gray--600;
    }
}
</style>
