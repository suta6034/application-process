import flushpromises from 'flush-promises';
import Vuex from 'vuex';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    mount,
    localVue,
    mockRouter,
} from '../../../../tests/app/vue/utils';
import {
    conversationsServiceResponses,
} from '../../__mocks__/conversations';
import * as conversationsService from '../../../services/conversation';

import CardLatestMessages from './CardLatestMessages';
import {
    LARGE_DEVICE,
} from '../../../../tests/app/jest-setup';

jest.mock('../../../router', () => ({
    afterEach: () => () => {},
    push: jest.fn(),
}));
jest.mock('../../../store');
jest.mock('../../../services/conversation');

localVue.use(Vuex);

let storeMocks;

const makeWrapper = () => mount(CardLatestMessages, {
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

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.active = true;
});

describe('CardLatestMessages', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    describe('has messages', () => {
        test('It should render the provided data.', async () => {
            conversationsService.getList.mockReturnValue(conversationsServiceResponses.three);

            const wrapper = makeWrapper();
            await flushpromises();

            expect(wrapper.findAll('[data-qa="message"]').length).toBe(3);
        });

        test('It should truncate the provided title.', async () => {
            // eslint-disable-next-line no-import-assign
            conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.three);

            const wrapper = makeWrapper();
            await flushpromises();

            const messageTitle = wrapper.findAll('[ data-qa="message"] [data-qa="headline"]').at(0).text();
            expect(messageTitle.length).toBeLessThanOrEqual(63);
            expect(messageTitle).toBe('Neue Herausforderung und Entwicklungsmöglichkeit im Bereich ...');
        });

        test('It should only show the latest three messages.', async () => {
            // eslint-disable-next-line no-import-assign
            conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.three);

            const wrapper = makeWrapper();
            await flushpromises();

            expect(wrapper.findAll('[data-qa="message"]').length).toBe(3);
        });
    });

    test('It should render an empty state illustration if done loading and no messages.', async () => {
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);

        const wrapper = makeWrapper();
        await flushpromises();

        expect(wrapper.find('[data-qa="empty state illustration"]').exists()).toBe(true);
    });

    describe('inactive profile', () => {
        test('It should render the `no job offers info` text, when there are no messages', async () => {
            storeMocks.store.state.profile.active = false;
            // eslint-disable-next-line no-import-assign
            conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);

            const wrapper = makeWrapper();
            await flushpromises();

            expect(wrapper.find('[data-qa="no job offers info"]').exists()).toBe(true);
        });

        test('It should render the existing messages and the `new job offers info` text.', async () => {
            storeMocks.store.state.profile.active = false;
            // eslint-disable-next-line no-import-assign
            conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.three);

            const wrapper = makeWrapper();
            await flushpromises();

            expect(wrapper.findAll('[data-qa="message"]').length).toBe(3);
            expect(wrapper.find('[data-qa="new job offers info"]').exists()).toBe(true);
        });
    });

    describe('active profile and no messages', () => {
        test('It should render the existing messages and the `get job offers info` text.', async () => {
            // eslint-disable-next-line no-import-assign
            conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.empty);

            const wrapper = makeWrapper();
            await flushpromises();

            expect(wrapper.find('[data-qa="get job offers info"]').exists()).toBe(true);
        });
    });

    test('It should route to the conversations page, when clicking the message on a desktop device.', async () => {
        global.innerWidth = LARGE_DEVICE;
        // eslint-disable-next-line no-import-assign
        conversationsService.getList = jest.fn().mockReturnValue(conversationsServiceResponses.three);
        const wrapper = makeWrapper();
        await flushpromises();

        const firstMessage = wrapper.find('[data-qa="conversation subject link"]');
        await firstMessage.trigger('click');

        expect(mockRouter.push).toBeCalledWith({
            name: 'page-conversations',
            params: { id: 'ab706a2f-85a0-4298-bfde-cdbd8ad92987' },
        });
    });
});
