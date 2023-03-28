import Vuex from 'vuex';
import Router from 'vue-router';
import {
    createLocalVue,
    shallowMount,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import AppCvCompleteness from './AppCvCompleteness';

jest.mock('../../../store');

describe('AppCvCompleteness', () => {
    let wrapper;
    let storeMocks;
    const localVue = createLocalVue();

    localVue.use(Router);
    localVue.use(Vuex);

    beforeEach(() => {
        storeMocks = createStoreMocks();
        storeMocks.store.state.profile.completeness = 80;

        wrapper = shallowMount(AppCvCompleteness, {
            stubs: { 'app-icon': true },
            localVue,
            store: storeMocks.store,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('CompletenessList', () => {
        test('It should not be shown initially.', () => {
            expect(wrapper.contains('[data-qa="completeness body"]')).toBe(false);
        });
    });
});
