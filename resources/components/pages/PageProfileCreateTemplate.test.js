import Vuex from 'vuex';
import Router from 'vue-router';
import {
    createLocalVue,
} from '@vue/test-utils';

import PageProfileCreateTemplate from './PageProfileCreateTemplate';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    mount,
} from '../../../tests/app/vue/utils';

jest.mock('../../store');

let wrapper;
let store;
const localVue = createLocalVue();

const router = new Router({
    routes: [
        {
            path: '/profil/anlegen/vorlage',
            name: 'Foo',
        },
        {
            path: '/profil/anlegen/vorlage/daten',
            name: 'Bar',
        },
    ],
    mode: 'history',
});

localVue.use(Router);
localVue.use(Vuex);

beforeEach(() => {
    // eslint-disable-next-line prefer-destructuring
    store = createStoreMocks().store;

    wrapper = mount(PageProfileCreateTemplate, {
        localVue,
        store,
        router,
        stubs: ['router-link', 'router-view'],
    });
});

describe('PageProfileCreateTemplate', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
