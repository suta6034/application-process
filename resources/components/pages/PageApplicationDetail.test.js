import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import * as applicationService from '../../services/application';
import {
    localVue,
    mount,
    mockRouter,
} from '../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

import LayoutMinimal from '../layouts/LayoutMinimal';
import LayoutDefault from '../layouts/LayoutDefault';
import PageApplicationDetail from './PageApplicationDetail';
import PageNotFound from './PageNotFound';
import {
    SMALL_DEVICE, MEDIUM_DEVICE,
} from '../../../tests/app/jest-setup';

jest.mock('../../store');
jest.mock('../../router');
jest.mock('../../services/application');

const storeMocks = createStoreMocks();

localVue.use(Vuex);

function makeWrapper(options) {
    mockRouter.currentRoute.meta = {
        referrer: {
            name: null,
        },
    };

    return mount(PageApplicationDetail, {
        store: storeMocks.store,
        localVue,
        ...options,
    });
}

function setupApplication(responseOrResponses) {
    // eslint-disable-next-line no-import-assign
    applicationService.get = jest.fn();

    const responses = Array.isArray(responseOrResponses) ? responseOrResponses : [responseOrResponses];
    for (const response of responses) {
        applicationService.get.mockReturnValueOnce(response);
    }
}

const mockApplicationServiceResponse = {
    data: {
        type: 'application',
        id: 'cc5e4bd8-433a-4751-ae79-0be57534d3ee',
        company: { name: 'Company 1' },
        job: { title: 'Job 1' },
        createDate: '2020-07-22T00:57:58+02:00',
        showDate: '2020-07-22T00:57:58+02:00',
        attachments: [],
        status: 'APPLIED',
    },
};

describe('PageApplicationDetail', () => {
    test('It should render a `<LayoutMinimal/> on mobile devices`.', async () => {
        global.innerWidth = SMALL_DEVICE;
        setupApplication(mockApplicationServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.findComponent(LayoutMinimal).exists()).toBe(true);
    });

    test('It should render a `<LayoutDefault/> on tablet and larger devices`.', async () => {
        global.innerWidth = MEDIUM_DEVICE;
        setupApplication(mockApplicationServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.findComponent(LayoutDefault).exists()).toBe(true);
    });

    test('It should render `<PageNotFound/>` if an application with the given ID does not exist.', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });

        await flushPromises();

        expect(wrapper.findComponent(PageNotFound).exists()).toBe(true);
    });

    test('It should show an error prompt if fetching the application fails.', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.get = jest.fn().mockRejectedValue(new Error());
        const wrapper = makeWrapper({
            propsData: {
                id: 'wrongId',
            },
        });
        await flushPromises();
        const errorApplication = wrapper.find('[data-qa="application state error"]');

        expect(errorApplication.exists()).toBe(true);
    });
});
