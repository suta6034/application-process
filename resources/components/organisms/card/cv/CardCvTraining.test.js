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

import CardCvTraining from './CardCvTraining';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();

    storeMocks.store.state.profile.training.rows = [
        {
            id: 1,
            title: 'Foo',
            institute: 'Foo',
            date: '2016-01-01T00:00:00+01:00',
        },
    ];

    wrapper = mount(CardCvTraining, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvTraining', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should display formatted dates.', () => {
        expect(wrapper.find('[data-qa="training date"]').text()).toContain('2016');
    });
});
