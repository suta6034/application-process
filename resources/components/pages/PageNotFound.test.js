import flushPromises from 'flush-promises';

import PageNotFound from './PageNotFound';
import {
    shallowMount,
} from '../../../tests/app/vue/utils';
import {
    isUserLoggedIn,
} from '../../services/auth';

jest.mock('../../store');
jest.mock('../../services/auth');

describe('PageNotFound', () => {
    test('It should mount successfully.', () => {
        const wrapper = shallowMount(PageNotFound);
        expect(wrapper.contains('div.c-pageNotFound')).toBe(true);
    });

    test('It should render the `back to dashboard` link.', async () => {
        isUserLoggedIn.mockReturnValue(true);
        const wrapper = shallowMount(PageNotFound);

        await flushPromises();

        expect(wrapper.contains('[data-qa="back to dashboard"]')).toBe(true);
    });

    test('It should render the `back home` link.', () => {
        const wrapper = shallowMount(PageNotFound);

        isUserLoggedIn.mockReturnValue(false);
        expect(wrapper.contains('[data-qa="back home"]')).toBe(true);
    });
});
