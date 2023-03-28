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

import CardCvAward from './CardCvAward';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();

    storeMocks.store.state.profile.award.rows = [
        {
            date: '2013-01-01T00:00:00+0100',
            id: 1,
            name: 'Foo Foo',
            url: 'www.fooBar.com',
        },
        {
            date: '2014-01-01T00:00:00+0100',
            id: 2,
            name: 'Bar Bar',
            url: 'www.barbar.app',
        },
        {
            date: '2015-01-01T00:00:00+0100',
            id: 3,
            name: 'Baz Baz',
            url: '',
        },
    ];

    wrapper = mount(CardCvAward, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvWorkExperience', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Date rendering', () => {
        test('It should display formatted date if available.', () => {
            storeMocks.store.state.profile.award.rows = [
                {
                    date: '2013-01-01T00:00:00+0100',
                    id: 1,
                    name: 'Foo Foo',
                    url: 'www.fooBar.com',
                },
            ];

            expect(wrapper.find('[data-qa="award date"]').text()).toContain('2013');
        });
    });
});
