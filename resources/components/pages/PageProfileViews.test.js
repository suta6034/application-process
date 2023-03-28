/* eslint-disable max-len */
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
import * as profileViewService from '../../services/profile-view';
import {
    profileViewServiceResponse,
} from '../__mocks__/profileViewServiceResponse';

import PageProfileViews from './PageProfileViews';

jest.mock('../../router', () => ({
    afterEach: () => () => {},
    push: jest.fn(),
}));
jest.mock('../../store');
jest.mock('../../services/profile-view');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
    storeMocks.store.state.profile.active = true;
});

localVue.use(Vuex);

function wrapperFactory() {
    return mount(PageProfileViews, {
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

describe('PageProfileViews', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show new views info when the user does not have profile-views', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.noProfileViews);
        storeMocks.store.state.profile.active = true;
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="No views link visible"]').exists()).toBe(true);
    });

    test('It should show not visible info when the user is not visible.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.noProfileViews);
        storeMocks.store.state.profile.active = false;
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="Not visibile info"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="No views link not visible"]').exists()).toBe(true);
    });

    test('It should show the list of companies when the user has profile-views.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.default);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="profile views headline"]');
        expect(wrapper.find('[data-qa="profile views list"]').exists()).toBe(true);
        expect(headline.text()).toBe('23 Aufrufe');
    });

    test('It should show the pagination when there is more than 1 page.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.default);
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="profile views pagination"]').exists()).toBe(true);
    });

    test('It should not show the pagination when there is only 1 page.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.noPagination);
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="profile views pagination"]').exists()).toBe(false);
    });

    test('It should show the correct headline and text when the user has no profile views.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.noProfileViews);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="profile views headline"]');
        const headlineText = wrapper.find('[data-qa="profile views headline text"]');
        await nextTick();
        expect(headline.text()).toBe('0 Aufrufe');
        expect(headlineText.exists()).toBe(false);
    });

    test('It should show the correct headline and text when the user has 1 profile view.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.noPagination);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="profile views headline"]');
        const headlineText = wrapper.find('[data-qa="profile views headline text"]');
        expect(headline.text()).toBe('1 Aufruf');
        expect(headlineText.text()).toBe('Diese Firma hat deinen Lebenslauf angesehen');
    });

    test('It should show the correct headline and text when the user has 23 profile views.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(profileViewServiceResponse.default);
        const wrapper = wrapperFactory();
        await flushPromises();
        const headline = wrapper.find('[data-qa="profile views headline"]');
        const headlineText = wrapper.find('[data-qa="profile views headline text"]');
        expect(wrapper.find('[data-qa="profile views list"]').exists()).toBe(true);
        expect(headline.text()).toBe('23 Aufrufe');
        expect(headlineText.text()).toBe('Diese Firmen haben deinen Lebenslauf angesehen');
    });
});
