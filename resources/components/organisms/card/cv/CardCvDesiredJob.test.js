import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import CardCvDesiredJob from './CardCvDesiredJob';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

const localVue = createLocalVue();

localVue.use(Vuex);
const storeMocks = createStoreMocks();

storeMocks.store.state.profile.desiredJob = {
    locations: [
        {
            id: 2411,
            label: 'Oberösterreich',
        },
        {
            id: 3226,
            label: 'Wien Innenstadt',
        },
        {
            id: 2420,
            label: 'Österreich',
        },
        {
            id: 1111,
            label: 'Foo Bar',
        },
        {
            id: 2222,
            label: 'Qux',
        },
    ],
    objectives: [
        {
            id: 1251295,
            name: 'Projektmanagement',
        },
        {
            id: 1251297,
            name: 'Projektorganisation',
        },
    ],
    employment: [
        {
            id: 3960,
            title: 'Teilzeit',
        },
        {
            id: 3961,
            name: 'Projektorganisation',
        },
    ],
    jobFields: [
        {
            id: 3092,
            name: 'Sontige Berufe',
        },
    ],
};

function wrapperFactory({ stubs } = {}) {
    return mount(CardCvDesiredJob, {
        stubs: {
            ...stubs,
        },
        localVue,
        store: storeMocks.store,
        mocks: {
            $t: jest.fn(),
        },
    });
}

describe('CardDesiredJob', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    describe('Pills', () => {
        test('It should render a maximum of 3 data pills.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.findAll('[data-qa="pill"]').length).toBe(3);
        });

        test('It should render one more pill.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.findAll('[data-qa="more pill"]').length).toBe(1);
        });
    });
});
