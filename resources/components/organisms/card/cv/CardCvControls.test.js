import {
    mount,
} from '../../../../../tests/app/vue/utils';

import CardCvControls from './CardCvControls';

describe('CardCvControls', () => {
    function wrapperFactory({ propsData } = {}) {
        return mount(CardCvControls, { propsData });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an `edit` event when clicking the edit button.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="edit link"]').trigger('click');

        expect(wrapper.emitted().edit).toBeTruthy();
    });

    test('It should hide the edit button when it is not editable.', () => {
        const wrapper = wrapperFactory({ propsData: { isEditable: false } });

        expect(wrapper.find('[data-qa="edit link"]').exists()).toBe(false);
    });

    test('It should emit a `delete` event when clicking the delete button.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="delete link"]').trigger('click');

        expect(wrapper.emitted().delete).toBeTruthy();
    });
});
