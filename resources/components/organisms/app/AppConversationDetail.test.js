import Vuex from 'vuex';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    localVue,
    mount,
} from '../../../../tests/app/vue/utils';
import {
    conversationMocks,
} from '../../__mocks__/conversations';

import AppConversationDetail from './AppConversationDetail';

jest.mock('../../../router', () => ({
    afterEach: () => () => {},
    push: jest.fn(),
}));
jest.mock('../../../store');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
});

localVue.use(Vuex);

const makeWrapper = (propsData, mocks) => mount(AppConversationDetail, {
    propsData,
    mocks: {
        $route: {
            params: {
                id: null,
            },
            path: '/',
        },
        ...mocks,
    },
    localVue,
    store: storeMocks.store,
});

describe('AppConversationDetail', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasReplied,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasReplied.messages,
        });

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a list of messages and the reply form when the user has 2 messages.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasReplied,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasReplied.messages,
        });

        expect(wrapper.findAll('[data-qa="main"] [data-qa="message"]').length).toBe(2);
        const messageReplyForm = wrapper.find('[data-qa="message reply form"]');
        expect(messageReplyForm.exists()).toBe(true);
        expect(messageReplyForm.find('[data-qa="send button"]').exists()).toBe(true);
    });

    test('It should render the not interested and answer buttons when the message is unreplied.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasNotReplied,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasNotReplied.messages,
        });

        expect(wrapper.find('[data-qa="not interested button"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="send answer button"]').exists()).toBe(true);
    });

    test('It should not render rejected infobox and answer button when the conversation is just rejected.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasRejected,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasRejected.messages,
        });

        expect(wrapper.find('[data-qa="rejected infobox"]').exists()).toBe(false);
        expect(wrapper.find('[data-qa="send answer after rejection button"]').exists()).toBe(false);
    });

    test('It should render the not interested button and answer button when the conversation is rejected '
        + 'but there is a new, unreplied message.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasRejectedNotReplied,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasRejectedNotReplied.messages,
        });

        expect(wrapper.find('[data-qa="rejected infobox"]').exists()).toBe(false);
        expect(wrapper.find('[data-qa="send answer after rejection button"]').exists()).toBe(false);
        expect(wrapper.find('[data-qa="not interested button"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="send answer button"]').exists()).toBe(true);
    });

    test('It should render the checkbox for approving contact data when the consent was not yet given.', async () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasNotApproved,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasNotApproved.messages,
        });
        await wrapper.find('[data-qa="send answer button"]').trigger('click');

        expect(wrapper.find('[data-qa="contact data checkbox"]').exists()).toBe(true);
    });

    test('It should not render the checkbox for approving contact data when the consent was already given.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasApproved,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasApproved.messages,
        });

        expect(wrapper.find('[data-qa="contact data checkbox"]').exists()).toBe(false);
    });

    test('It should render an infobox when the company is inactive.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasInactive,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasInactive.messages,
        });

        expect(wrapper.find('[data-qa="company inactive infobox"]').exists()).toBe(true);
    });

    test('It should render an infobox above the first message '
        + 'when there is only one message and the company user is inactive.', () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasRecruiterFallback,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasRecruiterFallback.messages,
        });

        expect(wrapper.find('[data-qa="recruiter inactive infobox"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="recruiter inactive infobox reply form"]').exists()).toBe(false);
    });

    test('It should render an infobox above the reply form '
        + 'when the user replies and already has multiple messages from an inactive company user.', async () => {
        const wrapper = makeWrapper({
            conversation: conversationMocks.hasRecruiterFallbackMultipleMessages,
            isConversationError: false,
            isConversationSuccess: true,
            messages: conversationMocks.hasRecruiterFallbackMultipleMessages.messages,
        });

        await wrapper.find('[data-qa="send answer button"]').trigger('click');

        expect(wrapper.find('[data-qa="recruiter inactive infobox"]').exists()).toBe(false);
        expect(wrapper.find('[data-qa="recruiter inactive infobox reply form"]').exists()).toBe(true);
    });
});
