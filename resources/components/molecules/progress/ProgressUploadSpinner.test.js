import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import ProgressUploadSpinner from './ProgressUploadSpinner';

describe('ProgressUploadSpinner', () => {
    test('It should render a `<span>` element.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner);

        expect(wrapper.is('span')).toBe(true);
    });

    test('It should have loading class if property `loading` is set to true.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner, {
            propsData: {
                loading: true,
            },
        });

        expect(wrapper.classes()).toContain('is-loading');
    });

    test('It should have error class if property status is set to error.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner, {
            propsData: {
                status: 'error',
            },
        });

        expect(wrapper.classes()).toContain('is-error');
    });

    test('It should only have loading icon if property status is set to loading.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner, {
            propsData: {
                status: 'loading',
            },
        });
        const loading = wrapper.find('[data-qa="loading icon"]');
        const hasIconWrapper = wrapper.find('[data-qa="import status indicator"]');

        expect(loading.exists()).toBe(true);
        expect(hasIconWrapper.exists()).toBe(false);
    });

    test('It should only have a success icon if the status is success.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner, {
            propsData: {
                status: 'success',
            },
        });
        const loading = wrapper.find('[data-qa="loading icon"]');
        const success = wrapper.find('[data-qa="success icon"]');
        const error = wrapper.find('[data-qa="error icon"]');

        expect(loading.exists()).toBe(false);
        expect(success.exists()).toBe(true);
        expect(error.exists()).toBe(false);
    });

    test('It should only have an error icon if the status is error.', () => {
        const wrapper = shallowMount(ProgressUploadSpinner, {
            propsData: {
                status: 'error',
            },
        });
        const loading = wrapper.find('[data-qa="loading icon"]');
        const success = wrapper.find('[data-qa="success icon"]');
        const error = wrapper.find('[data-qa="error icon"]');

        expect(loading.exists()).toBe(false);
        expect(success.exists()).toBe(false);
        expect(error.exists()).toBe(true);
    });
});
