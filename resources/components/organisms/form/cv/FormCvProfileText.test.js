import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import FormCvProfileText from './FormCvProfileText';
import store from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');

let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    wrapper = mount(FormCvProfileText, {
        localVue,
        store,
    });
});

describe('FormCvProfileText', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
