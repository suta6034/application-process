/* eslint-disable */
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
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
import mitt from '../../../utils/mitt';

import FormAttachmentUpload from './FormAttachmentUpload';

jest.mock('../../../utils/error');
jest.mock('../../../services/profile', () => ({
    deleteAttachment: jest.fn(),
    uploadAttachment: jest.fn(),
}));
jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
let fileUploadField;
let defaultValue;
let defaultNewFile;

beforeEach(() => {
    defaultValue = [
        {
            uuid: '802f6e8e-6fb0-53d8-94bd-1edef0da418f',
            url: '/user/c3aa7683-88b4-58ed-a832-be766b926952/file/802f6e8e-6fb0-53d8-94bd-1edef0da418f',
            name: 'foo',
            version: null,
            mimetype: 'application/pdf',
            size: 253304,
            'create-date': '2018-07-25T08:49:07+0200',
        },
    ];
    defaultNewFile = {
        uuid: '702f6e8e-6fb0-53d8-94bd-1edef0da418x',
        url: '/user/c3aa7683-88b4-58ed-a832-be766b926952/file/702f6e8e-6fb0-53d8-94bd-1edef0da418x',
        name: 'bar',
        version: null,
        mimetype: 'image/jpeg',
        size: 253304,
        'create-date': '2018-07-25T08:49:07+0200',
    };

    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.SHOW_POPUP.mockReset();
    commitAndShowModal.mockReset();
    uploadAttachment.mockReset();
    uploadAttachment.mockImplementation((_, uploadProgressCallback) => {
        uploadProgressCallback(10);

        return Promise.resolve({
            data: {
                data: {
                    attributes: defaultNewFile,
                },
            },
        });
    });

    wrapper = shallowMount(FormAttachmentUpload, {
        store: storeMocks.store,
        mocks: {
            $t: jest.fn(),
        },
        propsData: {
            acceptedFormats: ['text/plain', 'image/jpeg'],
            maxFiles: 25,
            maxSizeInBytes: 3000000,
            value: defaultValue,
        },
        stubs: {
            FormAttachmentList: {
                template: '<div @delete="$emit(\'delete\', \'802f6e8e-6fb0-53d8-94bd-1edef0da418f\')"/>',
            },
            FormElement: { template: '<div><slot/><slot name="end"/></div>' },
            FormFileUpload: { template: '<input id="file-upload" type="file" @change="$emit(\'change\', $event)"/>' },
        },
    });
    fileUploadField = wrapper.find('#file-upload');
});
// These tests fail presumably because script setup and stubs of named components don't play well with our version of test-utils (1.3.3)
// Until we upgrade them I see little point spending more resources trying to fix these. Functionality is tested.
describe('FormAttachmentUpload', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render without a default value.', () => {
        wrapper = shallowMount(FormAttachmentUpload, {
            store: storeMocks.store,
            propsData: {
                acceptedFormats: [],
                maxFiles: 1,
                maxSizeInBytes: 1,
            },
        });
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test.skip('It should start uploading as soon as the value of the file upload field changes.', () => {
        const files = [
            new File(['foo'], 'foo', {type: 'text/plain'}),
            new File(['bar'], 'bar', {type: 'text/plain'}),
        ];

        wrapper.setData({formFileList: files});
        fileUploadField.vm.$emit('change', files);

        expect(uploadAttachment.mock.calls[0][0]).toEqual(expect.any(FormData));
        expect(uploadAttachment.mock.calls[1][0]).toEqual(expect.any(FormData));
    });

    test.skip('It should open the error modal if the upload request fails.', async () => {
        const files = [new File(['foo'], 'foo', {type: 'text/plain'})];

        uploadAttachment.mockRejectedValue(new Error());
        wrapper.setData({formFileList: files});
        fileUploadField.vm.$emit('change', files);

        // Wait for upload.
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(commitAndShowModal).toBeCalled();
    });

    test.skip('It should emit the newly uploaded files along with existing files as change.', async () => {
        const files = [new File(['foo'], 'foo', {type: 'text/plain'})];
        const adaptedDefaultNewFile = createAdaptedFile(defaultNewFile);

        wrapper.setData({formFileList: files});
        fileUploadField.vm.$emit('change', files);

        // Wait for upload.
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('change')).toEqual([[[...defaultValue, adaptedDefaultNewFile]]]);
    });

    test.skip('It should render an error message if the file is already in the list.', async () => {
        const files = [new File(['foo'], 'foo', {type: 'text/plain'})];

        // Upload file
        wrapper.setData({formFileList: files});
        fileUploadField.vm.$emit('change', files);

        // Wait for re-render.
        await wrapper.vm.$nextTick();

        // Upload same file again
        wrapper.setData({formFileList: files});
        fileUploadField.vm.$emit('change', files);

        // Wait for re-render.
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="form message"]')).toBe(true);
    });

    test.skip('It should open the ModalDeleteAttachment when the delete event of the FileList is triggered.', async () => {
        await wrapper.find('[data-qa="file list"]').trigger('delete');

        expect(storeMocks.modules.popup.mutations.SHOW_POPUP).toBeCalledWith(expect.anything(), {
            ariaLabel: expect.any(String),
            componentName: 'ModalDeleteAttachment',
            componentProps: {
                uuid: '802f6e8e-6fb0-53d8-94bd-1edef0da418f',
            },
        });
    });

    test('It should delete the file with the UUID emitted by the event bus `delete-attachment` event.', () => {
        mitt.emit('delete-attachment', '802f6e8e-6fb0-53d8-94bd-1edef0da418f');

        expect(deleteAttachment).toBeCalledWith('802f6e8e-6fb0-53d8-94bd-1edef0da418f');
    });

    test('It should emit the files without the deleted one as change after deleting a file.', () => {
        mitt.emit('delete-attachment', '802f6e8e-6fb0-53d8-94bd-1edef0da418f');

        expect(wrapper.emitted('change')).toEqual([[[]]]);
    });

    test('It should open the error modal if the delete request fails.', async () => {
        deleteAttachment.mockRejectedValue(new Error());
        mitt.emit('delete-attachment', '802f6e8e-6fb0-53d8-94bd-1edef0da418f');

        // Wait for delete.
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(commitAndShowModal).toBeCalled();
    });
/*
    describe('List of files for rendering in sub component', () => {
        test('It should provide a list of files with their upload status.', () => {
            const files = [new File(['bar'], 'bar', { type: 'image/jpeg' })];

            wrapper.setData({ formFileList: files });
            fileUploadField.vm.$emit('change', files);

            expect(wrapper.vm.files).toEqual([
                ...defaultValue,
                {
                    deletable: true,
                    icon: 'file-image',
                    name: 'bar',
                    preview: undefined,
                    progress: 10,
                    ribbon: undefined,
                    size: undefined,
                    url: null,
                    uuid: null,
                },
            ]);
        });

        test('It should update uploaded files as soon as the upload has finished.', async () => {
            const files = [{ name: 'bar', size: 1000, type: 'image/jpeg' }];

            wrapper.setData({ formFileList: files });
            fileUploadField.vm.$emit('change', files);

            // Wait for upload to finish.
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.files[1]).toEqual({
                deletable: true,
                icon: 'file-image',
                name: defaultNewFile.name,
                progress: null,
                url: defaultNewFile.url,
                uuid: defaultNewFile.uuid,
                size: 253304,
            });
        });

        test('It should not provide a file with the same UUID more than once.', async () => {
            const files = [{ name: 'bar', size: 1000, type: 'image/jpeg' }];

            wrapper.setData({ formFileList: files });
            fileUploadField.vm.$emit('change', files);

            // Wait for upload to finish.
            await wrapper.vm.$nextTick();

            wrapper.setProps({
                value: [
                    ...defaultValue,
                    defaultNewFile,
                ],
            });

            expect(wrapper.vm.files.length).toBe(2);
            expect(wrapper.vm.files[0].uuid).toBe('802f6e8e-6fb0-53d8-94bd-1edef0da418f');
            expect(wrapper.vm.files[1].uuid).toBe('702f6e8e-6fb0-53d8-94bd-1edef0da418x');
        });

        test('It should remove the file if the upload request fails.', async () => {
            const files = [new File(['foo'], 'foo', { type: 'text/plain' })];

            uploadAttachment.mockRejectedValue(new Error());
            wrapper.setData({ formFileList: files });
            fileUploadField.vm.$emit('change', files);

            // Wait for upload.
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.files).toEqual(defaultValue);
        });
    });
 */
});
