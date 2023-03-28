<script setup>
import {
    computed, ref, nextTick,
} from 'vue';
import {
    emitUserAction,
} from '../../../services/user-actions';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import {
    useUniqueId,
} from '../../../composables/unique-id';
import router from '../../../router';
import {
    track,
} from '../../../utils/tracking';

// Because iOS can't handle the `accept` property on `<input>` correctly which
// prevents users from selecting any file, it is not used and we have to rely
// on validating the file type after the user has already selected a file.

const props = defineProps({
    multiple: {
        type: Boolean,
        default: true,
    },
    hasError: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['change']);

const isActive = ref(false);
const fileInput = ref(null);
const { id } = useUniqueId();

const status = computed(() => {
    if (props.hasError) return 'error';
    if (isActive.value) return 'active';
    return null;
});

const updateValue = async (formFiles) => {
    if (router.currentRoute.name === 'page-cv') {
        emitUserAction('profile-list-document-upload', null);
        track({ element: 'PR_L: Documents', elementDetail: 'Upload', ga4Event: true });
    }

    isActive.value = false;

    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    emit('change', props.multiple ? formFiles : formFiles[0]);
    await nextTick();

    // Reset the file input value after uploading a file,
    // so a change event is triggered if the same file is uploaded again.
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    if (fileInput.value) fileInput.value.value = null;
};

// Expose for unit tests
defineExpose({ emit });
</script>

<template>
    <div class="c-formFileUpload">
        <label
            class="k-c-uploadBox"
            :class="{
                'is-active': status === 'active',
                [`k-c-uploadBox--${status}`]: status,
            }"
            :for="id"
            data-qa="file upload"
            @dragenter="isActive = true"
            @dragleave="isActive = false"
            @dragover.prevent
            @drop.prevent="updateValue($event.dataTransfer.files)"
        >
            <div class="c-formFileUpload__labelWrap">
                <AppIcon
                    name="upload"
                    class="c-formFileUpload__trigger k-c-link"
                    size="l"
                />
                <div class="c-formFileUpload__labelText">
                    <span class="c-formFileUpload__preText">Dateien reinziehen oder</span>
                    <AppLink
                        tag="span"
                        class="c-formFileUpload__dummyLink"
                    >
                        hochladen
                    </AppLink>
                </div>
            </div>
            <input
                :id="id"
                ref="fileInput"
                :multiple="multiple"
                class="u-screen-reader-only"
                type="file"
                data-qa="file input"
                @change="updateValue($event.target.files)"
            >
            <div class="k-c-uploadBox__info">
                <slot name="info">
                    JPG, PNG, GIF, PDF, DOC, DOCX, ODT, RTF - max. 8 MB
                </slot>
            </div>
        </label>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/components/link/settings';

// 1. Prevent dragleave from firing when dragging over child elements.
// 2. Overwrites spaces when upload link should be inline at desktop version.
.c-formFileUpload {
    &.is-active {
        * {
            pointer-events: none; // 1
        }
    }

    &__labelText {
        margin-left: $k-spacing--s;
        color: $k-color-gray--900;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--s;
            margin-left: 0;
        }
    }

    &__preText {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }

    &__dummyLink {
        text-transform: capitalize;

        @media (min-width: $k-breakpoint--m) {
            text-transform: none;
        }
    }

    &__labelWrap {
        display: flex;
        justify-content: center;
        align-items: center;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: column;
        }
    }
}
</style>
