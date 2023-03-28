import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppCompanyViewsItem from './AppCompanyViewsItem';

describe('AppCompanyViewsItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppCompanyViewsItem);

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = shallowMount(AppCompanyViewsItem, { propsData: { isLoading: true } });

        expect(wrapper.find('[data-qa="skeleton box media"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="skeleton box body"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="skeleton box footer"]').exists()).toBe(true);
    });

    test('It should render the empty state illustration if there is no company data.', () => {
        const wrapper = shallowMount(AppCompanyViewsItem, {
            propsData: {
                company: null,
            },
        });

        expect(wrapper.contains('[data-qa="empty state illustration"]')).toBe(true);
    });

    test('It should render the empty state text if there is no company data.', () => {
        const wrapper = shallowMount(AppCompanyViewsItem, {
            propsData: {
                company: null,
            },
        });

        expect(wrapper.contains('[data-qa="empty state text"]')).toBe(true);
    });

    test('It should render the inactive state text if the company is inactive', () => {
        const wrapper = shallowMount(AppCompanyViewsItem, {
            propsData: {
                company: {
                    isActive: false,
                },
            },
        });

        expect(wrapper.contains('[data-qa="inactive state text"]')).toBe(true);
    });
});
