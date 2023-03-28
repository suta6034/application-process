import {
    mount,
} from '../../../../../tests/app/vue/utils';

import DropdownApplicationsOptions from './DropdownApplicationsOptions';

let wrapper;

beforeEach(() => {
    wrapper = mount(DropdownApplicationsOptions, { propsData: { id: '123', isEditable: true } });
});

describe('DropdownApplicationsOptions', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should emit a memo event when clicking the memo button.', async () => {
        wrapper.find('[data-qa="memo button"]').trigger('click');

        expect(wrapper.emitted().memo).toBeDefined();
    });

    test('It should open a (remove-)modal event when clicking the delete button.', async () => {
        wrapper.find('[data-qa="delete button"]').trigger('click');

        expect(wrapper.emitted('open-modal-remove')).toBeTruthy();
    });
});
