import Vuex from 'vuex';

import flushPromises from 'flush-promises';
import {
    nextTick,
} from 'vue';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    localVue,
    mount,
} from '../../../tests/app/vue/utils';
import * as conversationsService from '../../services/conversation';
import {
    SHOW_POPUP,
} from '../../store/mutation-types';
import {
    start as progressStart,
} from '../atoms/progress/ProgressLoadingBar';

import PageConversations from './PageConversations';

import {
    conversationsServiceResponses,
} from '../__mocks__/conversations';

jest.mock('../../router', () => {
    const afterEachStack = new Set();
    return {
        afterEach: (func) => {
            afterEachStack.add(func);
            return () => afterEachStack.delete(func);
        },
        push: (...params) => afterEachStack.forEach(func => func(...params)),
    };
});
jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../services/conversation');
jest.mock('../atoms/progress/ProgressLoadingBar');

let storeMocks;

function setupConversations(responseOrResponses) {
    // eslint-disable-next-line no-import-assign
    conversationsService.getList = jest.fn();

    const responses = Array.isArray(responseOrResponses) ? responseOrResponses : [responseOrResponses];
    for (const response of responses) {
        conversationsService.getList.mockReturnValueOnce(response);
    }
}

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
});

localVue.use(Vuex);

function wrapperFactory() {
    return mount(PageConversations, {
        mocks: {
            $route: {
                params: {
                    id: null,
                },
                path: '/',
            },
        },
        localVue,
        store: storeMocks.store,
    });
}

describe('PageConversations', () => {
    test('It should render a `<div>`.', () => {
        setupConversations(conversationsServiceResponses.empty);
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a list of conversations if the user has applications.', async () => {
        setupConversations(conversationsServiceResponses.pageOne);
        const wrapper = wrapperFactory();
        await wrapper.vm.$nextTick();
        const conversations = wrapper.findAll('[data-qa="conversation item"]');

        expect(conversations.length).toBe(5);
    });

    test('It should render only deleted conversations if the user applies the trash filter.', async () => {
        setupConversations([
            conversationsServiceResponses.pageOne,
            conversationsServiceResponses.filtered,
        ]);
        const wrapper = wrapperFactory();
        const filterButton = wrapper.find('[data-qa="filter"] [data-qa="button"]');
        await filterButton.trigger('click');
        expect(wrapper.find('[data-qa="options"]').exists()).toBe(true);

        await wrapper.find('[data-qa="option 2"]').trigger('click');
        expect(filterButton.text()).toBe('Papierkorb');

        await nextTick();

        const conversations = wrapper.findAll('[data-qa="conversation item"]');

        expect(conversations.length).toBe(1);
    });

    test('It should not render the not interested button when the message is rejected and in the bin.', async () => {
        const rejectedAndDeleted = {
            ...conversationsServiceResponses.filtered,
        };
        rejectedAndDeleted.data[0].rejected = true;
        setupConversations([
            conversationsServiceResponses.pageOne,
            rejectedAndDeleted,
        ]);
        const wrapper = wrapperFactory();
        const filterButton = wrapper.find('[data-qa="filter"] [data-qa="button"]');
        await filterButton.trigger('click');
        await wrapper.find('[data-qa="option 2"]').trigger('click');
        expect(filterButton.text()).toBe('Papierkorb');

        expect(wrapper.find('[data-qa="not interested button"]').exists()).toBe(false);
    });

    test('It should show a headline including the number of conversations if there are any.', async () => {
        setupConversations(conversationsServiceResponses.pageOne);
        const wrapper = wrapperFactory();
        await wrapper.vm.$nextTick();
        const headline = wrapper.find('[data-qa="conversations headline"]');

        expect(headline.text()).toContain('5');
    });

    test('It should show cv improvement link when the user does not have conversations', async () => {
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);
        storeMocks.store.state.profile.active = true;
        const wrapper = wrapperFactory();
        await flushPromises();

        const infobox = wrapper.find('[data-qa="infobox active profile and no conversations"]');
        expect(infobox.exists()).toBe(true);
        expect(infobox.find('[data-qa="cv improvement link"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="no conversation"] [data-qa="cv improvement link"]')
            .exists()).toBe(true);
    });

    test('It should show infobox and no conversations when the profile is not active.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);
        storeMocks.store.state.profile.active = false;
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="infobox inactive profile and no conversations"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="no conversation"] [data-qa="profile activation link"]').exists()).toBe(true);
    });

    test('It should show the correct headline when the user has no conversations.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = await wrapper.find('[data-qa="conversations headline"]');

        expect(headline.text()).toContain('0');
    });

    test('It should show an error infobox if fetching the conversations fails.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockRejectedValue(new Error());
        const wrapper = wrapperFactory();
        await flushPromises();
        const errorInfobox = wrapper.find('[data-qa="error conversation infobox"]');
        const errorConversation = wrapper.find('[data-qa="error conversation detail"]');

        expect(errorInfobox.exists()).toBe(true);
        expect(errorConversation.exists()).toBe(true);
    });

    test('It should open the delete modal, when clicking the delete button.', async () => {
        setupConversations(conversationsServiceResponses.pageOne);
        const wrapper = wrapperFactory();
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

    test('It should show a loading animation when data is loading.', async () => {
        setupConversations(conversationsServiceResponses.pageOne);
        const wrapper = wrapperFactory();
        const filterButton = wrapper.find('[data-qa="filter"] [data-qa="button"]');
        await filterButton.trigger('click');
        await wrapper.find('[data-qa="option 2"]').trigger('click');
        expect(filterButton.text()).toBe('Papierkorb');

        expect(progressStart).toBeCalled();
    });
});
