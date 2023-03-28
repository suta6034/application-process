<script setup>
import {
    computed, inject, onMounted, ref,
} from 'vue';
import {
    commitAndShowModal,
} from '../../../utils/error';
import {
    deleteImage as deleteImageFromServer,
    uploadImage as uploadImageToServer,
} from '../../../services/profile';
import {
    compressImage,
} from '../../../utils/compress-image';
import * as logger from '../../../utils/logger';

import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppInfoBox from '../../molecules/app/AppInfoBox';
import FormMessage from '../../atoms/form/FormMessage';
import LayoutOverlay from '../../layouts/LayoutOverlay';
import ProgressUploadSpinner from '../../molecules/progress/ProgressUploadSpinner';
import SvgAvatarPlaceholder from '../../atoms/svg/SvgAvatarPlaceholder';
import SvgLightBulb from '../../atoms/svg/SvgLightBulb';

import '../../../directives/debounce-click';
import '../../../lang/validation';
import {
    useGetters, useMutations,
} from '../../../composables/vuex-helpers';

const store = inject('store');

const props = defineProps({
    acceptedImageFormats: {
        type: Array,
        required: true,
    },
    file: {
        type: File,
    },
    minImageSizeInBytes: {
        type: Number,
        required: true,
    },
    maxImageSizeInBytes: {
        type: Number,
        required: true,
    },
});
const errors = ref([]);
const preview = ref(null);
const uploading = ref(false);

const {
    imageVersion,
} = useGetters('profile');
const imageUrl = computed(() => {
    const image = imageVersion.value('medium');
    return image ? image.url : null;
});
const hasError = computed(() => errors.value.length > 0);

const {
    SET_PROFILE_IMAGE: setProfileImage,
} = useMutations('profile');

const {
    HIDE_POPUP: hide,
} = useMutations('popup');

const showPreview = (file) => {
    preview.value = URL.createObjectURL(file);
};
const hidePreview = () => {
    // Release object URL for optimal performance and memory usage.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#Memory_management
    if (preview.value) URL.revokeObjectURL(preview.value);
};

const validate = (file) => {
    if (file.size < props.minImageSizeInBytes) {
        errors.value.push('min-size');
        return false;
    }

    if (file.size > props.maxImageSizeInBytes) {
        errors.value.push('max-size');
        return false;
    }

    if (!props.acceptedImageFormats.includes(file.type)) {
        errors.value.push('type');
        return false;
    }

    errors.value = [];
    return true;
};
const uploadImage = async (file) => {
    errors.value = [];
    if (!file) return;

    uploading.value = true;

    if (!validate(file)) {
        uploading.value = false;
        return;
    }

    /** @type {Blob|File} */
    let fileCompressed = file;
    try {
        fileCompressed = await compressImage(file);
    } catch (exception) {
        // If compressing fails we can try to go with the original file.
        // But we still want to log the problem to see how often this
        // happens and if we need to do something about it.
        /* istanbul ignore next */
        logger.info({
            exception,
            tags: {
                user_info: logger.userInfoTags.NONE,
            },
        });
    }

    try {
        showPreview(fileCompressed);

        const imageData = new FormData();
        imageData.append('file', fileCompressed, fileCompressed.name);

        const response = await uploadImageToServer(imageData);

        setProfileImage(response.data.data.map(x => x.attributes));
        hidePreview();
        hide();
    } catch (error) {
        commitAndShowModal(store.commit, error);
    }

    uploading.value = false;
};
const deleteImage = async () => {
    try {
        await deleteImageFromServer();

        setProfileImage([]);
        hide();
    } catch (error) {
        commitAndShowModal(store.commit, error);
    }
};

onMounted(() => {
    if (props.file) uploadImage(props.file);
});

// Expose for unit tests
defineExpose({ uploading, preview, uploadImage, validate, errors });
</script>

<template>
    <LayoutOverlay
        class="c-overlayImageEditor"
        horizontally-centered
        horizontally-centered-content
    >
        <div
            v-if="uploading || hasError"
            class="c-overlayImageEditor__preview"
            data-qa="preview"
        >
            <div
                v-if="preview"
                :style="`background-image:url(${preview})`"
                class="c-overlayImageEditor__previewImage"
            />
            <ProgressUploadSpinner
                v-if="uploading"
                size="2xl"
                data-qa="spinner"
            />
            <template v-if="hasError">
                <AppIcon
                    name="circle-exclamationmark"
                    size="2xl"
                    class="c-overlayImageEditor__errorIcon"
                />
                <FormMessage
                    type="error"
                    class="c-overlayImageEditor__errorMessage"
                >
                    <li v-if="errors.includes('min-size')">
                        {{ $t('validation.fileSizeMinProfileImage', { size: minImageSizeInBytes / 1000 }) }}
                    </li>
                    <li v-if="errors.includes('max-size')">
                        {{ $t('validation.fileSizeMaxProfileImage', { size: maxImageSizeInBytes / 1000000 }) }}
                    </li>
                    <li v-if="errors.includes('type')">
                        {{ $t('validation.fileTypeProfileImage') }}
                    </li>
                </FormMessage>
            </template>
        </div>
        <div
            v-else-if="imageUrl"
            class="c-overlayImageEditor__imageWrapper"
        >
            <AppInfoBox
                data-qa="infobox"
                hint
            >
                <template #icon>
                    <SvgLightBulb/>
                </template>
                <p>
                    Dein Foto wird automatisch auf das von Recruitern empfohlene Format zugeschnitten.
                    Geh daher sicher, dass dein Kopf mittig positioniert ist und um ihn herum genügend Freiraum ist.
                </p>
            </AppInfoBox>
            <img
                :src="imageUrl"
                class="c-overlayImageEditor__image"
                alt="Profilbild"
                data-qa="image"
            >
        </div>
        <div v-else>
            <SvgAvatarPlaceholder class="c-overlayImageEditor__placeholder"/>
        </div>
        <div class="c-overlayImageEditor__actions">
            <AppLink
                tag="label"
                :class="{ 'c-overlayImageEditor__action--disabled': uploading }"
                class="c-overlayImageEditor__action"
            >
                <AppIcon
                    name="picture-stack"
                    size="xl"
                />
                <!-- --><span class="c-overlayImageEditor__actionLabel"><!--
                    -->Foto auswählen<!-- -->
                </span><!-- -->
                <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                <input
                    :accept="acceptedImageFormats"
                    :disabled="uploading"
                    class="c-overlayImageEditor__input"
                    type="file"
                    data-qa="file input"
                    @change="uploadImage($event.target.files[0])"
                >
            </AppLink>
            <AppLink
                v-if="!hasError"
                v-debounce-click
                tag="button"
                :disabled="uploading"
                class="c-overlayImageEditor__action"
                data-qa="delete"
                aria-label="Löschen"
                @click="deleteImage"
            >
                <AppIcon
                    name="dustbin"
                    size="xl"
                />
            </AppLink>
        </div>
    </LayoutOverlay>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/components/link/index';

// 1. Move to optical center.
// 2. IE 11 overflow fix.
// 3. Prevents content overflow on iOS12.
.c-overlayImageEditor {
    $image-width: 240px;
    $image-height: 320px;

    &__preview {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: $image-width;
        height: $image-height;
        border-radius: $k-border-radius--s;
        text-align: center;
        background-color: $k-color-gray--50;
        color: $k-color-active--dark;
    }

    &__previewImage {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-position: center;
        background-size: cover;
        opacity: 0.1;
    }

    &__imageWrapper {
        display: flex;
        flex-shrink: 0; // 3.
        flex-direction: column;
        align-items: center;
    }

    &__image,
    &__placeholder {
        margin-top: $k-spacing--2xl;
        width: $image-width;
        height: $image-height;
        background-color: $k-color-gray--50;
    }

    &__placeholder {
        color: $k-color-gray--600;
        fill: $k-color-gray--600;
    }

    &__errorIcon {
        margin-top: -$k-spacing--m; // 1.
        color: $k-color-red--700;
    }

    &__errorMessage {
        margin-top: $k-spacing--xs;
        padding-right: $k-spacing--xl;
        padding-left: $k-spacing--xl;
        max-width: 100%; // 2.
    }

    &__actions {
        display: flex;
        justify-content: space-between;
        margin-top: $k-spacing--m;
        width: $image-width;
    }

    &__action {
        &--disabled,
        &[disabled] {
            cursor: default;

            &,
            &:hover,
            &:focus {
                color: $k-color-gray--400;
            }
        }
    }

    &__actionLabel {
        margin-left: $k-spacing--xs;
    }

    &__input {
        display: none;
    }
}
</style>
