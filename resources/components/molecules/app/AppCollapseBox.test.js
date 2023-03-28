import {
    shallowMount,
    mount,
} from '../../../../tests/app/vue/utils';

import AppCollapseBox from './AppCollapseBox';

describe('AppCollapseBox', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppCollapseBox);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should be collapsed after the toggle button is clicked.', async () => {
        const wrapper = shallowMount(AppCollapseBox);
        wrapper.find('[data-qa="toggle button"]').trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="collapsed box"]')).toBe(true);
    });

    test('It should be hidden after the close button is clicked.', async () => {
        const wrapper = mount(AppCollapseBox, {
            propsData: {
                closeable: 'true',
            },
        });
        wrapper.find('[data-qa="close button"]').trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="close button"]')).toBe(false);
    });
});
