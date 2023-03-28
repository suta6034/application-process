import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import FormCvStatement from './FormCvStatement';
import store from '../../../../store';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');

let wrapper;
const localVue = createLocalVue();

// This is necessary for the FormTextareaLimited component to work correctly.
global.getComputedStyle = () => ({
    getPropertyValue() {
        return '100px';
    },
});

localVue.use(Vuex);

beforeEach(() => {
    wrapper = mount(FormCvStatement, {
        localVue,
        store,
    });
});

describe('FormCvStatement', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
