import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import * as conversationService from '../../services/conversation';
import {
    localVue,
    mount,
} from '../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    SHOW_POPUP,
} from '../../store/mutation-types';

import LayoutMinimal from '../layouts/LayoutMinimal';
import LayoutDefault from '../layouts/LayoutDefault';
import PageConversationDetail from './PageConversationDetail';
import PageNotFound from './PageNotFound';
import {
    SMALL_DEVICE, MEDIUM_DEVICE,
} from '../../../tests/app/jest-setup';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../router');
jest.mock('../../services/conversation');

const storeMocks = createStoreMocks();

localVue.use(Vuex);

function makeWrapper(options) {
    return mount(PageConversationDetail, {
        mocks: {
            $route: {
                path: '/',
                params: {},
            },
        },
        store: storeMocks.store,
        provide: {
            store: {
                commit: jest.fn(),
            },
        },
        localVue,
        ...options,
    });
}

function setupConversation(responseOrResponses) {
    // eslint-disable-next-line no-import-assign
    conversationService.get = jest.fn();

    const responses = Array.isArray(responseOrResponses) ? responseOrResponses : [responseOrResponses];
    for (const response of responses) {
        conversationService.get.mockReturnValueOnce(response);
    }
}

const mockConversationServiceResponse = {
    data: {
        type: 'conversation',
        id: 'conversation-1',
        read: true,
        replied: false,
        approved: false,
        rejected: true,
        deleted: false,
        latestSendDate: '2021-10-15T10:01:01+02:00',
        subject: 'foo subject',
        recruiter: {
            type: 'user',
            id: 'user-1',
            name: 'foo user-1',
        },
        recruiterFallback: {
            id: null,
            name: null,
            type: 'user',
        },
        company: {
            type: 'company',
            id: 'company-1',
            isActive: true,
            isChiffre: false,
            name: 'foo company name',
            slug: 'foo-bar',
        },
        messages: [
            {
                type: 'message',
                id: 'message-1',
                meta: {
                    sendDate: '2021-10-15T10:01:01+02:00',
                },
                attributes: {
                    subject: 'foo',
                    body: 'bar',
                },
                sender: {
                    data: {
                        type: 'companyUser',
                        id: 'company-1',
                    },
                },
                recipient: {
                    data: {
                        type: 'user',
                        id: 'user-1',
                    },
                },
                job: {
                    data: {
                        type: 'job',
                        id: 'job-1',
                    },
                },
            },
        ],
    },
};

beforeEach(() => {
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
});

describe('PageConversationDetail', () => {
    test('It should render a `<LayoutMinimal/>` on small devices.', async () => {
        global.innerWidth = SMALL_DEVICE;
        setupConversation(mockConversationServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.findComponent(LayoutMinimal).exists()).toBe(true);
    });

    test('It should render a `<LayoutDefault/>` on tablet and larger devices.', async () => {
        global.innerWidth = MEDIUM_DEVICE;
        setupConversation(mockConversationServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.findComponent(LayoutDefault).exists()).toBe(true);
    });

    test('It should render `<PageNotFound/>` if a conversation with the given ID does not exist.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationService.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });

        await flushPromises();

        expect(wrapper.findComponent(PageNotFound).exists()).toBe(true);
    });

    test('It should open the delete modal, when clicking the delete button.', async () => {
        setupConversation(mockConversationServiceResponse);
        const wrapper = makeWrapper({
            propsData: {
                id: 'conversation-1',
            },
        });

        await flushPromises();

        const deleteButton = wrapper.find('[data-qa="delete button"]');
        await deleteButton.trigger('click');

        expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
            .toBeCalledWith(expect.any(Object), {
                ariaLabel: expect.any(String),
                componentName: 'ModalMessageDelete',
                componentProps: {
                    removeCallback: expect.any(Function),
                    cancelCallback: expect.any(Function),
                },
            });
    });

    test('It should show an error prompt if fetching the conversation fails.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationService.get = jest.fn().mockRejectedValue(new Error());
        const wrapper = makeWrapper({
            propsData: {
                id: 'wrongId',
            },
        });
        await flushPromises();
        const errorConversation = wrapper.find('[data-qa="error conversation detail"]');

        expect(errorConversation.exists()).toBe(true);
    });
});
