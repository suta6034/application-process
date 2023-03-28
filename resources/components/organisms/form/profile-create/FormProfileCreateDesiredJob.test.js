import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';
import FormProfileCreateDesiredJob from './FormProfileCreateDesiredJob';

jest.mock('../../../../store');
jest.mock('../../../../services/autocomplete');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profileCreate.forceValidation = { key: '', time: 0 };

    wrapper = mount(FormProfileCreateDesiredJob, {
        localVue,
        store: storeMocks.store,
        mocks: {
            $t: jest.fn(),
            $randomFieldId: jest.fn(),
            finish: jest.fn(),
        },
    });
});

describe('FormProfileCreateDesiredJob', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
