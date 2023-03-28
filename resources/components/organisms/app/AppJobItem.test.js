import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppJobItem from './AppJobItem';

describe('AppJobItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppJobItem);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = shallowMount(AppJobItem, { propsData: { loading: true } });

        expect(wrapper.contains('[data-qa="skeleton box"]')).toBe(true);
    });
});
