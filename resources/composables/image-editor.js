import {
    ACCEPTED_IMAGE_FORMATS,
    MIN_FILE_SIZE_IN_BYTES,
    MAX_FILE_SIZE_IMAGES_IN_BYTES,
} from '../utils/file-settings';

import {
    SHOW_POPUP,
} from '../store/mutation-types';

import store from '../store/index';

export function useImageEditor() {
    const acceptedImageFormats = ACCEPTED_IMAGE_FORMATS;

    function showPopup(payload) {
        return store.commit(`popup/${SHOW_POPUP}`, payload);
    }

    function showImageEditor(e) {
        let file;

        if (e.target?.files) {
            [file] = e.target.files;
            e.target.value = '';
        }

        showPopup({
            componentName: 'OverlayImageEditor',
            title: 'Bild hochladen',
            type: 'overlay',
            componentProps: {
                acceptedImageFormats,
                file,
                minImageSizeInBytes: MIN_FILE_SIZE_IN_BYTES,
                maxImageSizeInBytes: MAX_FILE_SIZE_IMAGES_IN_BYTES,
            },
        });
    }

    return {
        showImageEditor,
        acceptedImageFormats,
    };
}
