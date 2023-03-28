import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppVisibility from './AppVisibility';

describe('AppVisibility', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AppVisibility);
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should display the active label.', async () => {
        wrapper.setProps({ isVisible: true });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="visibility"]').text()).toBe('Sichtbar');
    });

    test('It should display the inactive label.', () => {
        wrapper.setProps({ isVisible: false });
        expect(wrapper.find('[data-qa="visibility"]').text()).toBe('Nicht sichtbar');
    });
});
