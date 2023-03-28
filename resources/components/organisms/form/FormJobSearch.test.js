import Router from 'vue-router';

import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormJobSearch from './FormJobSearch';

const mockRouter = new Router({
    routes: [
        {
            path: '/jobs',
            name: 'page-jobs',
        },
    ],
});

mockRouter.push = jest.fn();

describe('FormJobSearch', () => {
    function wrapperFactory() {
        return shallowMount(FormJobSearch, {
            mocks: {
                $randomFieldId: jest.fn(),
                $router: mockRouter,
            },
            stubs: {
                FormInput: { template: '<div @focus="$emit(\'focus\')"/>' },
                AppButton: { template: '<div @click="$emit(\'click\')"/>' },
            },
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show the location field and the button if the keyword field is focused.', async () => {
        const wrapper = wrapperFactory();

        wrapper.find('[data-qa="keyword"]').trigger('input');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="location wrap"]').isVisible()).toBe(true);
        expect(wrapper.find('[data-qa="search"]').isVisible()).toBe(true);
    });
});
