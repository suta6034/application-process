import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppPagination from './AppPagination';

function wrapperFactory({ propsData } = {}) {
    return shallowMount(AppPagination, {
        propsData: {
            currentPage: 3,
            maxPages: 10,
            ...propsData,
        },
    });
}

describe('AppPagination', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should disable the first page button if it is the first page.', () => {
        const wrapper = wrapperFactory({ propsData: { currentPage: 1 } });

        expect(wrapper.find('[data-qa="first page"]').attributes().disabled).toBeTruthy();
    });

    test('It should disable the previous page button if it is the first page.', () => {
        const wrapper = wrapperFactory({ propsData: { currentPage: 1 } });

        expect(wrapper.find('[data-qa="previous page"]').attributes().disabled).toBeTruthy();
    });

    test('It should disable the next page button if it is the last page.', () => {
        const wrapper = wrapperFactory({ propsData: { currentPage: 10 } });

        expect(wrapper.find('[data-qa="next page"]').attributes().disabled).toBeTruthy();
    });
});
