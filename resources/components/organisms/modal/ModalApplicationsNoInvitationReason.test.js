import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import ModalApplicationsNoInvitationReason from './ModalApplicationsNoInvitationReason';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalApplicationsNoInvitationReason, {
        store: storeMocks.store,
    });
});

describe('ModalApplicationsNoInvitationReason', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should hide when the cancel button is clicked.', async () => {
        await wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(wrapper.emitted().hidden).toBeTruthy();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should not call the sendCallback when no reason is selected and the send button is clicked.', async () => {
        await wrapper.setProps({ sendCallback: jest.fn() });
        await wrapper.find('[data-qa="send button"]').trigger('click');

        expect(wrapper.vm.sendCallback).not.toBeCalled();
    });

    test('It should call the sendCallback when a reason is selected and the send button is clicked.', async () => {
        await wrapper.setProps({ sendCallback: jest.fn() });
        await wrapper.find('[data-qa="reason rejection"]').trigger('click');
        await wrapper.find('[data-qa="send button"]').trigger('click');

        expect(wrapper.vm.sendCallback).toBeCalled();
    });

    test('It should not hide when no reason is selected and the send button is clicked.', async () => {
        await wrapper.find('[data-qa="send button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).not.toBeCalled();
    });

    test('It should hide when a reason is selected and the send button is clicked.', async () => {
        await wrapper.find('[data-qa="reason rejection"]').trigger('click');
        await wrapper.find('[data-qa="send button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
