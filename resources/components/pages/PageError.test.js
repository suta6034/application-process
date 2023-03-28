import flushPromises from 'flush-promises';

import PageError from './PageError';
import {
    mount,
} from '../../../tests/app/vue/utils';
import {
    isUserLoggedIn,
} from '../../services/auth';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

jest.mock('../../store');
jest.mock('../../services/auth');

let wrapper;
const storeMocks = createStoreMocks();
beforeEach(() => {
    wrapper = mount(PageError, {
        store: storeMocks.store,
    });
});

describe('PageError', () => {
    test('It should render a `<LayoutDefault>`.', () => {
        expect(wrapper.element.classList).toContain('c-layoutDefault');
        expect(wrapper.contains('div.c-pageError')).toBe(true);
    });

    test('It should render the `back to dashboard` link.', async () => {
        isUserLoggedIn.mockResolvedValue(true);

        wrapper = mount(PageError, {
            store: storeMocks.store,
        });

        await flushPromises();

        expect(wrapper.contains('[data-qa="back to dashboard"]')).toBe(true);
    });

    test('It should render the `back home` link.', () => {
        isUserLoggedIn.mockResolvedValue(false);

        wrapper = mount(PageError, {
            store: storeMocks.store,
        });

        expect(wrapper.contains('[data-qa="back home"]')).toBe(true);
    });
});
