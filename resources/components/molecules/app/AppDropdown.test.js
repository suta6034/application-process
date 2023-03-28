import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppDropdown from './AppDropdown';

describe('AppDropdown', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AppDropdown, {
            slots: {
                trigger: '<button type="button">Foo</button>',
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should be opened after clicking the trigger element.', async () => {
        await wrapper.find('[data-qa="trigger"]').trigger('click');

        expect(wrapper.find('[data-qa="content"]').isVisible()).toBe(true);
    });

    test('It should be closed after clicking the trigger element twice.', async () => {
        await wrapper.find('[data-qa="trigger"]').trigger('click');

        expect(wrapper.find('[data-qa="content"]').exists()).toBe(true);

        await wrapper.find('[data-qa="trigger"]').trigger('click');

        expect(wrapper.find('[data-qa="content"]').exists()).toBe(false);
    });
});
