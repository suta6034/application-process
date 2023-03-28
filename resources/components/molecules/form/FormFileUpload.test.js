import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormFileUpload from './FormFileUpload';

function makeWrapper(props = {}) {
    return mount(FormFileUpload, {
        mocks: {
            $t: jest.fn(),
        },
        propsData: {
            acceptedFormats: ['image/jpeg'],
            ...props,
        },
    });
}

describe('FormFileUpload', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();
        expect(wrapper.element.tagName).toBe('DIV');
    });

    describe('has no checkbox', () => {
        test('It should be activated when a user drags a file on it.', async () => {
            const wrapper = makeWrapper();
            const fileUpload = wrapper.find('[data-qa="file upload"]');
            const input = wrapper.find('[data-qa="file input"]');
            await fileUpload.trigger('dragenter');

            expect(input.attributes().disabled).toBe(undefined);
            expect(fileUpload.classes('is-active')).toBe(true);
            expect(fileUpload.classes('k-c-uploadBox--active')).toBe(true);
        });

        test('It should be de-activated when a user drags a file away.', async () => {
            const wrapper = makeWrapper();
            const fileUpload = wrapper.find('[data-qa="file upload"]');
            await fileUpload.trigger('dragenter');
            await fileUpload.trigger('dragleave');

            expect(fileUpload.classes('is-active')).toBe(false);
        });

        test('It should be de-activated when a user drops a file.', async () => {
            const wrapper = makeWrapper();
            const fileUpload = wrapper.find('[data-qa="file upload"]');
            await fileUpload.trigger('dragenter');
            await fileUpload.trigger('drop', { dataTransfer: { files: [new File(['foo'], 'foo')] } });

            expect(fileUpload.classes('.is-active')).toBe(false);
        });

        test('It should update the value when a single file is selected.', () => {
            const wrapper = makeWrapper({ multiple: false });
            const fileUpload = wrapper.find('[data-qa="file upload"]');

            const files = [new File(['foo'], 'foo')];

            wrapper.vm.validate = jest.fn().mockReturnValue(true);
            fileUpload.trigger('drop', { dataTransfer: { files } });

            expect(wrapper.emitted('change')).toEqual([files]);
        });

        test('It should update the value when multiple files are selected.', () => {
            const wrapper = makeWrapper({ multiple: true });
            const fileUpload = wrapper.find('[data-qa="file upload"]');

            const files = [new File(['foo'], 'foo'), new File(['bar'], 'bar')];

            wrapper.vm.validate = jest.fn().mockReturnValue(true);
            fileUpload.trigger('drop', { dataTransfer: { files } });

            expect(wrapper.emitted('change')).toEqual([[files]]);
        });
    });
});
