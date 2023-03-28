import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import * as motivationService from '../../services/motivation-letter';
import {
    localVue,
    mount,
} from '../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

import PageMotivationLetterDetail from './PageMotivationLetterDetail';
import PageNotFound from './PageNotFound';
import {
    SMALL_DEVICE, MEDIUM_DEVICE,
} from '../../../tests/app/jest-setup';

jest.mock('../../store');
jest.mock('../../router');
jest.mock('../../services/motivation-letter');

const storeMocks = createStoreMocks();

localVue.use(Vuex);

function makeWrapper(options) {
    return mount(PageMotivationLetterDetail, {
        mocks: {
            $route: {
                path: '/',
                params: {},
            },
        },
        store: storeMocks.store,
        localVue,
        ...options,
    });
}

function setupMotivationLetter(responseOrResponses) {
    // eslint-disable-next-line no-import-assign
    motivationService.get = jest.fn();

    const responses = Array.isArray(responseOrResponses) ? responseOrResponses : [responseOrResponses];
    for (const response of responses) {
        motivationService.get.mockReturnValueOnce(response);
    }
}

const mockMotivationLetterServiceResponse = {
    data: {
        type: 'motivation-letter',
        id: '1',
        isDefault: true,
        text: 'motivation',
        title: 'Mein Bewerbungsschreiben',
    },
};

describe('PageMotivationLetterDetail', () => {
    test('It should render a `<LayoutMinimal/>` on small devices.', async () => {
        global.innerWidth = SMALL_DEVICE;
        setupMotivationLetter(mockMotivationLetterServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.element.classList).toContain('c-layoutMinimal');
    });

    test('It should render a `<LayoutDefault/>` on tablet and larger devices.', async () => {
        global.innerWidth = MEDIUM_DEVICE;
        setupMotivationLetter(mockMotivationLetterServiceResponse);
        const wrapper = makeWrapper({
            propsData: { id: '1' },
        });

        await flushPromises();

        expect(wrapper.element.classList).toContain('c-layoutDefault');
    });

    test('It should render `<PageNotFound/>` if a motivation letter with the given ID does not exist.', async () => {
        // eslint-disable-next-line no-import-assign
        motivationService.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });

        await flushPromises();

        expect(wrapper.findComponent(PageNotFound).exists()).toBe(true);
    });
});
