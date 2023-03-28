import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppAccordion from './AppAccordion';
import AppCollapsible from './AppCollapsible';

function makeWrapper(options) {
    return mount(AppCollapsible, {
        slots: {
            content: '<div data-qa="content"/>',
        },
        ...options,
    });
}

describe('AppCollapsible', () => {
    test('It should render an `<AppAccordion>`.', () => {
        const wrapper = makeWrapper();
        expect(wrapper.findComponent(AppAccordion).exists()).toBe(true);
    });

    test('It should show the body when the user clicks on the toggle button.', async () => {
        const wrapper = makeWrapper();
        await wrapper.find('[data-qa="toggle button"]').trigger('click');

        expect(wrapper.contains('[data-qa="content"]')).toBe(true);
    });

    test('It should hide the body when the user clicks on the toggle button a second time.', async () => {
        const wrapper = makeWrapper();
        await wrapper.find('[data-qa="toggle button"]').trigger('click');
        expect(wrapper.contains('[data-qa="content"]')).toBe(true);

        await wrapper.find('[data-qa="toggle button"]').trigger('click');
        expect(wrapper.contains('[data-qa="content"]')).toBe(false);
    });

    test('It should not show the body when the user clicks the toggle button but it is not expandable.', async () => {
        const wrapper = makeWrapper({
            propsData: {
                isExpandable: false,
            },
        });
        await wrapper.find('[data-qa="toggle button"]').trigger('click');

        expect(wrapper.contains('[data-qa="content"]')).toBe(false);
    });
});
