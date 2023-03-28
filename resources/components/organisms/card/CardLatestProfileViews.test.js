import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    localVue,
    mount,
} from '../../../../tests/app/vue/utils';
import * as profileViewService from '../../../services/profile-view';

import CardLatestProfileViews from './CardLatestProfileViews';

jest.mock('../../../store');
jest.mock('../../../services/profile-view');

let storeMocks;
const mockProfileViewServiceResponse = {
    default: {
        data: [
            {
                id: 'profile-view-1',
                viewDate: '1558593784',
                company: {
                    type: 'company',
                    id: 'company-1',
                    name: null,
                    isActive: false,
                    isChiffre: false,
                    typeId: null,
                    typeLabel: 'EMPLOYER_PAGE_PLUS1',
                    activeJobs: 4,
                    logos: null,
                    image: null,
                    slug: null,
                    locations: null,
                    branches: null,
                    profileUrl: null,
                    jobsUrl: null,
                },
            },
            {
                id: 'profile-view-2',
                viewDate: '1558593783',
                company: {
                    type: 'company',
                    id: 'company-2',
                    name: null,
                    isActive: false,
                    isChiffre: false,
                    typeId: null,
                    typeLabel: 'EMPLOYER_PAGE_PLUS2',
                    activeJobs: 4,
                    logos: null,
                    image: null,
                    slug: null,
                    locations: null,
                    branches: null,
                    profileUrl: null,
                    jobsUrl: null,
                },
            },
            {
                id: 'profile-view-3',
                viewDate: '1558593782',
                company: {
                    type: 'company',
                    id: 'company-3',
                    name: null,
                    isActive: false,
                    isChiffre: false,
                    typeId: null,
                    typeLabel: 'EMPLOYER_PAGE_PLUS3',
                    activeJobs: 4,
                    logos: null,
                    image: null,
                    slug: null,
                    locations: null,
                    branches: null,
                    profileUrl: null,
                    jobsUrl: null,
                },
            },
        ],
        meta: {
            pagination: {
                total: 3,
            },
        },
    },
};

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
    storeMocks.store.state.profile.active = true;
});

localVue.use(Vuex);

function wrapperFactory() {
    return mount(CardLatestProfileViews, {
        propsData: {
            multiple: false,
            acceptedFormats: ['image/jpeg'],
        },
        localVue,
        store: storeMocks.store,
    });
}

describe('CardLatestProfileViews', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div'))
            .toBe(true);
    });

    test('It should show the list of companies when the user has profile-views.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(mockProfileViewServiceResponse.default);
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="profile views dashboard"]').exists()).toBe(true);
    });

    test('It should show 3 items when the user has only 3 items.', async () => {
        // eslint-disable-next-line no-import-assign
        profileViewService.getList = jest.fn().mockReturnValue(mockProfileViewServiceResponse.default);
        const wrapper = wrapperFactory();
        await flushPromises();
        expect(wrapper.find('[data-qa="counter"]').text()).toBe('3');
    });
});
