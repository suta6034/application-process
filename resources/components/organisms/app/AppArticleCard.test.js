import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppArticleCard from './AppArticleCard';

describe('AppArticleCard', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppArticleCard);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = shallowMount(AppArticleCard, { propsData: { loading: true } });

        expect(wrapper.contains('[data-qa="skeleton box"]')).toBe(true);
    });
});
