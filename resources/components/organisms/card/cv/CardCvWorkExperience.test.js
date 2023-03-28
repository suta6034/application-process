import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store/index';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

import CardCvWorkExperience from './CardCvWorkExperience';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();

    storeMocks.store.state.profile.work.rows = [
        {
            company: {
                label: 'Foo foo',
                id: 1,
            },
            id: 1,
            submitted: false,
            title: 'Foo',
            category: { id: 1, label: 'Berufserfahrung' },
        },
        {
            company: {
                label: 'Bar bar',
                id: 2,
            },
            id: 2,
            submitted: false,
            title: 'Bar',
            category: { id: 1, label: 'Berufserfahrung' },
        },
        {
            company: {
                label: 'Baz baz',
                id: null,
            },
            id: null,
            submitted: false,
            title: 'Baz',
            category: { id: 1, label: 'Berufserfahrung' },
        },
        {
            company: {
                label: 'Qux qux',
                id: 4,
            },
            id: null,
            submitted: true,
            title: 'Qux',
            category: { id: 1, label: 'Berufserfahrung' },
        },
    ];

    wrapper = mount(CardCvWorkExperience, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvWorkExperience', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Date rendering', () => {
        test('It should display formatted start and end dates if available.', async () => {
            storeMocks.store.state.profile.work.rows = [
                {
                    company: {
                        label: 'test',
                        id: 123,
                    },
                    end: '2015-02-01T00:00:00+01:00',
                    id: 1,
                    start: '2014-02-01T00:00:00+01:00',
                    title: {
                        id: 'test',
                        label: 'test',
                    },
                    category: { id: 1, label: 'Berufserfahrung' },
                },
            ];

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="work dates"]').text()).toContain('Feb 2014');
            expect(wrapper.find('[data-qa="work dates"]').text()).toContain('Feb 2015');
        });

        test('It should display a string alternative if no end date is available.', () => {
            storeMocks.store.state.profile.work.rows[0].end = '';
            expect(wrapper.find('[data-qa="work dates"]').text()).toContain('heute');
        });
    });
});
