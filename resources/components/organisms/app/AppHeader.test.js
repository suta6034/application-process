import Vuex from 'vuex';
import Router from 'vue-router';
import flushPromises from 'flush-promises';

import {
    createLocalVue,
} from '@vue/test-utils';
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppHeader from './AppHeader';

import store from '../../../store';
import {
    html,
    scripts,
} from '../../../services/__mocks__/_header-response';

jest.mock('../../../store');
jest.mock('../../../store/modules/profile');
jest.mock('../../../services/app-shell');

const localVue = createLocalVue();
const router = new Router({
    routes: [
        {
            path: '/profil/lebenslauf',
            name: 'page-cv',
        },
    ],
});

localVue.use(Router);
localVue.use(Vuex);

function wrapperFactory({ propsData, computed } = {}) {
    return shallowMount(AppHeader, {
        propsData: {
            ...propsData,
        },
        computed: {
            ...computed,
        },
        store,
        router,
        localVue,
    });
}

describe('AppHeader', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Fallback', () => {
        test('It should render the fallback, if no headerView exists.', () => {
            const wrapper = wrapperFactory();
            expect(wrapper.contains('[data-qa="header fallback"]')).toBe(true);
        });
        test('It should render a fallback version in the given variant.', () => {
            const wrapper = wrapperFactory({ propsData: { minimal: true } });
            expect(wrapper.contains('[data-qa="header fallback"]')).toBe(true);

            const fallback = wrapper.find('[data-qa="header fallback"]');
            expect(fallback.classes()).toContain('c-appHeader__fallback--minimal');
        });
    });

    describe('MF-Header', () => {
        test('It should render the response from the service and append a script tag to the document', async () => {
            store.state.header.response = { html, scripts };

            const wrapper = wrapperFactory();
            document.body.appendChild = jest.fn();

            await flushPromises();

            expect(wrapper.contains('[data-qa="header fallback"]')).toBe(false);
            expect(wrapper.contains('[data-qa="header"]')).toBe(true);
            expect(document.body.appendChild).toBeCalled();
        });
    });
});
