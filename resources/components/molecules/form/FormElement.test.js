import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormElement from './FormElement';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(FormElement);
});

describe('FormElement', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
