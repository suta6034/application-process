<script setup>
import {
    computed, inject,
    onBeforeMount, onBeforeUnmount, ref,
} from 'vue';
import {
    ValidateEach,
} from '@vuelidate/components';
import {
    maxLength,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    commitAndShowModal,
} from '../../../utils/error';
import {
    createAdaptedFile,
} from '../../../utils/AdaptedFile';
import {
    deleteAttachment,
    uploadAttachment,
} from '../../../services/profile';
import {
    fileSize,
    fileType,
} from '../../../utils/validators';
import mitt from '../../../utils/mitt';
import {
    CATEGORIES,
} from '../../../utils/tracking';

import FormAttachmentList from './FormAttachmentList';
import FormElement from './FormElement';
import FormFileUpload from './FormFileUpload';
import FormMessage from '../../atoms/form/FormMessage';

import '../../../lang/validation';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';
import i18n from '../../../utils/i18n';

const store = inject('store');

const props = defineProps({
    acceptedFormats: {
        required: true,
        type: Array,
    },
    maxFiles: {
        required: true,
        type: Number,
    },
    maxSizeInBytes: {
        required: true,
        type: Number,
    },
    value: {
        default: () => [],
        type: Array,
    },
});

const { trackClick } = useTrackClick(CATEGORIES.page.profile);

const errors = ref([]);
const formFileList = ref(null);
const uploadedFiles = ref([]);

const valueWithoutUploadedFiles = computed(() => props.value
    .filter(x => !uploadedFiles.value.find(y => x.uuid === y.uuid)));
const files = computed(() => [...valueWithoutUploadedFiles.value, ...uploadedFiles.value]);
const formFileArray = computed(() => Array.from(formFileList.value ?? []));

// Convert File to Object because <ValidateEach> gives a warning if its prop has type File instead of Object
const formFileArrayAsObjects = computed(() => formFileArray.value
    .map(fileObject => ({
        lastModified: fileObject.lastModified,
        lastModifiedDate: fileObject.lastModifiedDate,
        name: fileObject.name,
        size: fileObject.size,
        type: fileObject.type,
    })));

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const emit = defineEmits(['change', 'delete', 'preview', 'download']);

const validations = {
    files: {
        maxLength: maxLength(props.maxFiles),
    },
};

const fileRules = {
    size: fileSize(props.maxSizeInBytes),
    type: fileType(props.acceptedFormats),
};

const v$ = useVuelidate(validations, { files });

async function deleteFile(uuid) {
    try {
        emit('change', props.value.filter(x => x.uuid !== uuid));
        uploadedFiles.value = uploadedFiles.value.filter(x => x.uuid !== uuid);
        await deleteAttachment(uuid);
    } catch (error) {
        commitAndShowModal(store.commit, error);
    }
}

function unique(file) {
    let isUnique = true;
    if (files.value.find(x => x.uuid === file.uuid)) {
        errors.value.push(i18n('validation.fileUnique', { fileName: file.name }));
        isUnique = false;
    }
    return isUnique;
}

async function uploadFile(formFile) {
    if (v$.value.files.$error) return;

    const currentlyUploadingFile = createAdaptedFile({
        mimetype: formFile.type,
        name: formFile.name,
        url: null,
    });
    uploadedFiles.value.push(currentlyUploadingFile);

    try {
        const attachmentData = new FormData();
        attachmentData.append('file', formFile);

        const { data } = await uploadAttachment(attachmentData, (progress) => {
            currentlyUploadingFile.progress = progress;
        });
        const apiFile = data.data.attributes;
        const uploadedFile = createAdaptedFile(apiFile);

        if (!unique(uploadedFile)) {
            uploadedFiles.value = uploadedFiles.value.filter(x => x !== currentlyUploadingFile);
            return;
        }

        Object.assign(currentlyUploadingFile, uploadedFile);
        emit('change', [...props.value, uploadedFile]);
    } catch (error) {
        uploadedFiles.value = uploadedFiles.value.filter(x => x !== currentlyUploadingFile);
        commitAndShowModal(store.commit, error);
    }
}

async function multiUpload(event) {
    formFileList.value = event;

    // Firefox does not update the v-model correctly when the FileList changes, by manually updating the
    // property, we trigger an update of the `formFilesArray` computed property.
    const prevValue = formFileList.value;
    formFileList.value = null;
    formFileList.value = prevValue;

    errors.value = [];
    v$.value.$touch();

    formFileArray.value
        .filter(file => fileRules.size.$validator(file) && fileRules.type.$validator(file))
        .forEach(file => uploadFile(file));
}

const showDeleteAttachmentModal = async uuid => showModal({
    componentName: 'ModalDeleteAttachment',
    componentProps: { uuid },
    ariaLabel: 'Dokument löschen',
});

onBeforeMount(() => mitt.on('delete-attachment', deleteFile));
onBeforeUnmount(() => mitt.off('delete-attachment', deleteFile));

// Expose for unit tests
defineExpose({ emit });
</script>

<template>
    <div class="c-formAttachmentUpload">
        <FormElement>
            <FormFileUpload
                :has-error="v$.$error"
                @change="multiUpload"
            />
            <template #end>
                <FormMessage
                    type="error"
                    data-qa="form message"
                >
                    <ValidateEach
                        v-for="(file) in formFileArrayAsObjects"
                        :key="`${file.size}_${file.type}`"
                        :state="file"
                        :rules="fileRules"
                    >
                        <template #default="{ v }">
                            <li>
                                <template v-if="v.type.$invalid">
                                    {{ $t('validation.fileType', { fileName: file.name }) }}
                                </template>
                                <template v-if="v.size.$invalid">
                                    {{ $t('validation.fileSizeMax', { fileName: file.name }) }}
                                </template>
                            </li>
                        </template>
                    </ValidateEach>
                </FormMessage>
                <FormMessage
                    v-if="v$.$error || errors.length"
                    type="error"
                    data-qa="form message"
                >
                    <li
                        v-for="(error, index) in errors"
                        :key="`error${index}`"
                    >
                        {{ error }}
                    </li>
                    <li v-if="v$.files.$error">
                        {{ $t('validation.max', { fieldName: 'Dokumenten', n: '25' }) }}
                    </li>
                </FormMessage>
            </template>
        </FormElement>

        <FormAttachmentList
            v-if="files.length"
            :files="files"
            class="c-formAttachmentUpload__fileList"
            data-qa="file list"
            @delete="showDeleteAttachmentModal($event);trackClick('profile-list-document-delete');emit('delete');"
            @preview="trackClick('profile-list-document-show');emit('preview');"
            @download="trackClick('profile-list-document-download');emit('download');"
        />
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-formAttachmentUpload {
    &__fileList {
        margin-top: $k-spacing--s;
    }
}
</style>
