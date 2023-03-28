import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppFooter from './AppFooter';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppFooter);
});

describe('AppFooter', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should toggle `is-open` class on parent container when group header is clicked.', async () => {
        wrapper.find('[data-qa="group header"]').trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="container"]').classes()).toContain('is-open');
    });
});
