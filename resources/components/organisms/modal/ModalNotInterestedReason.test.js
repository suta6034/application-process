import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import REJECTION_REASONS from '../../../data/message-rejection-reason.json';

import ModalNotInterestedReason from './ModalNotInterestedReason';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
let sendCallback;

function wrapperFactory({ propsData } = {}) {
    return mount(ModalNotInterestedReason, {
        store: storeMocks.store,
        propsData: {
            ...propsData,
        },
    });
}

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    sendCallback = jest.fn();

    wrapper = wrapperFactory({
        propsData: {
            reasons: REJECTION_REASONS,
            sendCallback,
        },
    });
});

describe('ModalNotInterestedReason', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the default body.', () => {
        expect(wrapper.find('[data-qa="text default"]').exists()).toBe(true);
    });

    test('It should hide the modal when the send button is clicked.', async () => {
        await wrapper.find('[data-qa="reason"]:nth-child(1) input[type="radio"]').trigger('click');
        await wrapper.find('[data-qa="send button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should include the text "Andere Position angestrebt" on the 3rd radio button', async () => {
        expect(wrapper.find('[data-qa="reason"]:nth-child(3)').text()).toBe('Andere Position angestrebt');
    });

    test('It should show 7 reasons when the reason table exists', async () => {
        expect(wrapper.findAll('[data-qa="reason"]').length).toBe(7);
    });

    test('It should show the custom rejection reason when clicking the other reason', async () => {
        wrapper = wrapperFactory({
            propsData: {
                reasons: REJECTION_REASONS,
                sendCallback,
                isCustomReasonFormVisible: true,
            },
        });
        wrapper.find('[data-qa="reason"]:nth-child(7) input[type="radio"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="reason"]:nth-child(7)').exists()).toBe(true);
        expect(wrapper.find('[data-qa="custom rejection reason"]').exists()).toBe(true);
    });

    test('It should disable the send button when no reason is selected.', () => {
        wrapper = wrapperFactory({
            propsData: {
                reasons: REJECTION_REASONS,
                sendCallback,
                isCustomReasonFormVisible: true,
            },
        });

        const sendButton = wrapper.find('[data-qa="send button"]');

        expect(sendButton.exists()).toBe(true);
        expect(sendButton.attributes().disabled).toBeTruthy();
    });

    test('It should enable the send button when a reason is selected.', async () => {
        wrapper = wrapperFactory({
            propsData: {
                reasons: REJECTION_REASONS,
                sendCallback,
                isCustomReasonFormVisible: true,
            },
        });

        const sendButton = wrapper.find('[data-qa="reason"]');
        await sendButton.trigger('click');

        expect(sendButton.attributes().disabled).toBeFalsy();
    });
});
