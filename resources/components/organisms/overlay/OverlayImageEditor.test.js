import flushPromises from 'flush-promises';

import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    commitAndShowModal,
} from '../../../utils/error';
import {
    deleteImage as deleteImageFromServer,
    uploadImage as uploadImageToServer,
} from '../../../services/profile';
import {
    HIDE_POPUP,
} from '../../../store/mutation-types';

import OverlayImageEditor from './OverlayImageEditor';

global.URL.createObjectURL = jest.fn();

jest.mock('../../../services/profile', () => ({
    deleteImage: jest.fn(),
    uploadImage: jest.fn(),
}));
jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/error');
jest.mock('../../../utils/compress-image', () => ({ compressImage: file => file }));

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.getters['profile/imageVersion'].mockReset();
    storeMocks.modules.popup.mutations[HIDE_POPUP].mockReset();
    storeMocks.store.state.popup.active = true;
    commitAndShowModal.mockReset();
    deleteImageFromServer.mockReset();
    uploadImageToServer.mockReset();
    uploadImageToServer.mockResolvedValue({ data: { data: [] } });

    wrapper = mount(OverlayImageEditor, {
        store: storeMocks.store,
        stubs: {
            AppSvgIcon: true,
        },
        propsData: {
            acceptedImageFormats: [],
            minImageSizeInBytes: 100,
            maxImageSizeInBytes: 300000,
        },
        mocks: {
            $t: jest.fn(),
        },
    });
});

describe('OverlayImageEditor', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Uploading a new image', () => {
        const file = new File(['foo'], 'foo', {
            type: 'image',
        });
        Object.defineProperty(file, 'size', { value: 200000 });

        beforeEach(() => {
            wrapper = mount(OverlayImageEditor, {
                store: storeMocks.store,
                stubs: {
                    AppSvgIcon: true,
                },
                propsData: {
                    acceptedImageFormats: ['image'],
                    file,
                    minImageSizeInBytes: 100,
                    maxImageSizeInBytes: 300000,
                },
                mocks: {
                    $t: jest.fn(),
                },
            });
        });

        test('It should render an upload spinner during upload.', async () => {
            // Setting the properties directly because we can't wait for the images load event to finish.
            wrapper.setData({ uploading: true, preview: 'data:;base64,Zm9v' });

            // Wait for re-render.
            await wrapper.vm.$nextTick();

            expect(wrapper.contains('[data-qa="spinner"]')).toBe(true);
        });

        test('It should render a preview of the uploaded image during upload.', async () => {
            // Setting the properties directly because we can't wait for the images load event to finish.
            wrapper.setData({ uploading: true, preview: 'data:;base64,Zm9v' });

            await flushPromises();

            expect(wrapper.contains('[data-qa="preview"]')).toBe(true);
        });

        test('It should close the overlay when upload is finished.', async () => {
            // Trigger the method directly because faking a change on a file input is not possible.
            wrapper.vm.uploadImage(file);

            // Wait for `uploadImage()` to finish.
            await flushPromises();

            expect(storeMocks.modules.popup.mutations[HIDE_POPUP]).toBeCalled();
        });

        test('It should open the error modal if the upload request fails.', async () => {
            uploadImageToServer.mockRejectedValue(new Error());

            // Trigger the method directly because faking a change on a file input is not possible.
            wrapper.vm.uploadImage(file);

            // Wait for `uploadImage()` to finish.
            await flushPromises();

            expect(commitAndShowModal).toBeCalled();
        });

        test('It should validate files.', async () => {
            wrapper.vm.validate({ size: 1000, type: 'image' });
            expect(wrapper.vm.errors).toHaveLength(0);
        });

        test('It should set an error when a file is too small.', async () => {
            wrapper.vm.validate({ size: 99 });
            expect(wrapper.vm.errors).toContain('min-size');
        });

        test('It should set an error when a file is too large.', async () => {
            wrapper.vm.validate({ size: 300001 });
            expect(wrapper.vm.errors).toContain('max-size');
        });

        test('It should set an error when a file has the wrong type.', async () => {
            wrapper.vm.validate({ size: 1000, type: 'image' });
            expect(wrapper.vm.errors).toHaveLength(0);
        });
    });

    describe('Editing an existing image', () => {
        test('It should render the current profile image.', () => {
            storeMocks.store.getters['profile/imageVersion'].mockReturnValue({ url: 'foo.jpg' });
            wrapper = mount(OverlayImageEditor, {
                store: storeMocks.store,
                stubs: {
                    AppSvgIcon: true,
                },
                propsData: {
                    acceptedImageFormats: [],
                    minImageSizeInBytes: 100,
                    maxImageSizeInBytes: 300000,
                },
                mocks: {
                    $t: jest.fn(),
                },
            });

            expect(wrapper.contains('[data-qa="image"]')).toBe(true);
        });

        test('It should close the overlay and send a delete request when deleting the image.', () => {
            wrapper.find('[data-qa="delete"]').trigger('click');

            expect(deleteImageFromServer).toBeCalled();
        });

        test('It should open the error modal if the delete request fails.', async () => {
            deleteImageFromServer.mockRejectedValue(new Error());
            wrapper.find('[data-qa="delete"]').trigger('click');

            // Wait for `deleteImage()` to finish.
            await flushPromises();

            expect(commitAndShowModal).toBeCalled();
        });
    });
});
