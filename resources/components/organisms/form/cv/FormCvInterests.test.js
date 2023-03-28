import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import FormCvInterests from './FormCvInterests';
import store from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');

let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    wrapper = mount(FormCvInterests, {
        localVue,
        store,
        mocks: {
            $t: jest.fn(),
        },
    });
});

describe('FormCvInterests', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
