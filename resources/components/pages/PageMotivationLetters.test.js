import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    localVue,
    mount,
} from '../../../tests/app/vue/utils';
import * as motivationLetterService from '../../services/motivation-letter';

import PageMotivationLetters from './PageMotivationLetters';

jest.mock('../../router', () => ({
    afterEach: () => () => {},
    push: jest.fn(),
}));
jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../services/motivation-letter');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.exists = true;
    storeMocks.store.state.profile.fetched = true;
});

localVue.use(Vuex);

function makeWrapper() {
    return mount(PageMotivationLetters, {
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

describe('PageMotivationLetters', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show loading animation when it is loading.', async () => {
        // eslint-disable-next-line no-import-assign
        motivationLetterService.getList = jest.fn().mockReturnValue(new Promise(() => {}));
        const wrapper = makeWrapper();
        await flushPromises();
        expect(wrapper.find('[data-qa="loading animation"]').exists()).toBe(true);
    });
});
