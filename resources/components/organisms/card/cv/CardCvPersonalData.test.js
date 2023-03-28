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

import CardCvPersonalData from './CardCvPersonalData';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();

    wrapper = mount(CardCvPersonalData, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvPersonalData', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
