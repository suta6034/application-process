import flushPromises from 'flush-promises';
import Vuex from 'vuex';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    localVue,
    mount,
} from '../../../tests/app/vue/utils';
import * as applicationService from '../../services/application';
import {
    applicationServiceResponses,
} from '../__mocks__/applicationServiceResponses';

import PageApplications from './PageApplications';

jest.mock('../../router', () => {
    const afterEachStack = new Set();
    return {
        afterEach: (func) => {
            afterEachStack.add(func);
            return () => afterEachStack.delete(func);
        },
        push: (...params) => afterEachStack.forEach(func => func(...params)),
        currentRoute: {
            query: {
                filter: '',
            },
        },
    };
});
jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../services/application');
jest.mock('../../services/application-status');
jest.mock('../../services/job-watchlist');
jest.mock('../atoms/progress/ProgressLoadingBar');

let storeMocks;

function setupApplications(responseOrResponses) {
    // eslint-disable-next-line no-import-assign
    applicationService.getList = jest.fn();

    const responses = Array.isArray(responseOrResponses) ? responseOrResponses : [responseOrResponses];
    for (const response of responses) {
        applicationService.getList.mockReturnValueOnce(response);
    }
}

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
});

localVue.use(Vuex);

function wrapperFactory() {
    return mount(PageApplications, {
        mocks: {
            $route: {
                params: {
                    id: null,
                },
                path: '/',
                query: {},
            },
        },
        store: storeMocks.store,
    });
}

describe('PageApplications', () => {
    test('It should render a `<div>`.', async () => {
        setupApplications(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show an empty state if the user has no applications.', async () => {
        setupApplications(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();
        const emptyState = wrapper.findAll('[data-qa="empty"]');

        expect(emptyState.exists()).toBe(true);
    });

    test('It should show the correct empty state headline if the user has a profile.', async () => {
        setupApplications(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="empty state headline"]');

        expect(headline.text()).toContain('Deine Bewerbungen auf einen Blick');
    });

    test('It should render a list of applications if the user has applications.', async () => {
        setupApplications(applicationServiceResponses.pageOne);
        const wrapper = wrapperFactory();
        await flushPromises();
        const applications = wrapper.findAll('[data-qa="application item"]');

        expect(applications.length).toBe(4);
    });

    test('It should render a list of applications when the user removes an applied filter.', async () => {
        setupApplications([
            applicationServiceResponses.pageOne,
            applicationServiceResponses.filtered,
            applicationServiceResponses.pageOne,
        ]);
        const wrapper = wrapperFactory();
        await flushPromises();
        await wrapper.find('[data-qa="trigger"]').trigger('click');
        wrapper.find('[data-qa="filter status rejected"] input').trigger('click');
        await flushPromises();
        wrapper.find('[data-qa="trigger"]').trigger('click');
        await wrapper.vm.$nextTick();

        // Remove filter
        wrapper.find('[data-qa="active filter rejected"] [data-qa="secondary action"]').trigger('click');
        await flushPromises();

        const applications = wrapper.findAll('[data-qa="application item"]');

        expect(applications.length).toBe(4);
    });

    test('It should show a headline including the number of applications if there are some.', async () => {
        setupApplications(applicationServiceResponses.pageOne);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="header headline"]');

        expect(headline.text()).toContain('5');
        expect(headline.text()).toContain('Bewerbungen');
    });

    test('It should show an error message if fetching the applications fails.', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockRejectedValue(new Error());
        const wrapper = wrapperFactory();
        await flushPromises();
        const errorMessage = wrapper.find('[data-qa="error message"]');

        expect(errorMessage.exists()).toBe(true);
    });
});
