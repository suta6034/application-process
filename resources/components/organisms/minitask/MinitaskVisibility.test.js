import Router from 'vue-router';

import Vuex from 'vuex';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import {
    localVue,
    mount,
} from '../../../../tests/app/vue/utils';

import MinitaskVisibility from './MinitaskVisibility';

jest.mock('../../../store');

let wrapper;
let storeMocks;

localVue.use(Vuex);

const mockRouter = new Router({
    routes: [
        {
            path: '/foo/bar',
        },
    ],
});

describe('MinitaskVisibility', () => {
    beforeEach(() => {
        storeMocks = createStoreMocks();

        mockRouter.push = jest.fn();
        wrapper = mount(MinitaskVisibility, {
            localVue,
            store: storeMocks.store,
            mocks: {
                $router: mockRouter,
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should emit a skip event when the skip-button is clicked.', async () => {
        await wrapper.find('[data-qa="skip button"]').trigger('click');
        expect(wrapper.emitted('skipped')).toBeTruthy();
    });

    test('It should emit a updated event when the activate-button is clicked.', async () => {
        await wrapper.find('[data-qa="activate button"]').trigger('click');
        expect(wrapper.emitted('updated')).toBeTruthy();
    });
});
