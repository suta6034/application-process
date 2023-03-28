import flushPromises from 'flush-promises';

import {
    mount,
} from '../../../../tests/app/vue/utils';
import * as applicationService from '../../../services/application';

import AppApplicationMemo from './AppApplicationMemo';
import * as moduleApi from '../../../utils/snackbar';

jest.mock('../../../router');
jest.mock('../../../services/application');
jest.mock('../../../utils/i18n');

function wrapperFactory(options) {
    return mount(AppApplicationMemo, {
        propsData: {
            application: {
                id: 1,
                memo: '',
            },
        },
        stubs: {
            // The components rely on Vuex and we don't want to mock Vuex.
            ModalApiError: { render: h => h('div', { attrs: { 'data-qa': 'error modal' } }) },
            ModalDoubleCheck: { render: h => h('div', { attrs: { 'data-qa': 'remove modal' } }) },
            ModalUnsavedChanges: { render: h => h('div', { attrs: { 'data-qa': 'unsaved changes modal' } }) },
        },
        ...options,
    });
}

describe('PageApplications', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should enable the save button when the memo field is dirty.', async () => {
        const wrapper = wrapperFactory();

        expect(wrapper.find('[data-qa="save button"]').attributes().disabled).toBe('disabled');
        await wrapper.find('[data-qa="memo"]').setValue('foo');

        expect(wrapper.find('[data-qa="save button"]').attributes().disabled).not.toBe('disabled');
    });

    test('It should show a snackbar after successfully saving.', async () => {
        const spy = jest.spyOn(moduleApi, 'showSnackbar');
        // eslint-disable-next-line no-import-assign
        applicationService.patch = jest.fn().mockResolvedValue({ data: { id: 1, memo: 'foo' } });
        const wrapper = wrapperFactory();

        await wrapper.find('[data-qa="memo"]').setValue('foo');
        await wrapper.find('[data-qa="save button"]').trigger('click');
        await flushPromises();

        expect(spy).toHaveBeenCalled();
    });

    // Skip because stubbing doesn't work properly until vue test util upgrade to vue 3
    // TODO when vue3 upgrade
    test.skip('It should remove the memo text when clicking the remove button.', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.patch = jest.fn().mockResolvedValue({ data: { id: 1, memo: '' } });
        const wrapper = wrapperFactory({
            propsData: {
                application: {
                    id: 1,
                    memo: 'foo',
                },
            },
        });

        await wrapper.find('[data-qa="remove button"]').trigger('click');

        expect(wrapper.find('[data-qa="remove modal"]').exists()).toBe(true);

        await wrapper.find('[data-qa="remove modal"]').vm.$emit('approve');
        await flushPromises();

        expect(wrapper.find('[data-qa="memo"]').element.value).toBe('');
    });

    test.skip('It should reset the memo text to its initial value when clicking the cancel button.', async () => {
        const wrapper = wrapperFactory({
            propsData: {
                application: {
                    id: 1,
                    memo: 'foo',
                },
            },
        });

        await wrapper.find('[data-qa="memo"]').setValue('foo bar');
        await wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(wrapper.find('[data-qa="unsaved changes modal"]').exists()).toBe(true);

        await wrapper.find('[data-qa="unsaved changes modal"]').vm.$emit('reset');

        expect(wrapper.find('[data-qa="memo"]').element.value).toBe('foo');
    });

    test.skip('It should show an error modal when saving fails.', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.patch = jest.fn().mockRejectedValue(new Error());
        const wrapper = wrapperFactory();

        await wrapper.find('[data-qa="memo"]').setValue('foo');
        await wrapper.find('[data-qa="save button"]').trigger('click');
        await flushPromises();

        expect(wrapper.find('[data-qa="error modal"]').exists()).toBe(true);
    });
});
