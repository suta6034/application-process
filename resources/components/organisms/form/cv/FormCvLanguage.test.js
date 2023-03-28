import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import FormCvLanguage from './FormCvLanguage';
import store from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');

let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    wrapper = mount(FormCvLanguage, {
        localVue,
        store,
        mocks: {
            $t: jest.fn(),
        },
    });
});

describe('FormCvLanguage', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
