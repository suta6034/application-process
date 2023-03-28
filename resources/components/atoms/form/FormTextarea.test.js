import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormTextarea from './FormTextarea';

let wrapper;

const helpers = {
    setValue(value) {
        wrapper.element.value = value;
        wrapper.trigger('input');
    },
};

beforeEach(() => {
    wrapper = shallowMount(FormTextarea);
});

describe('FormTextarea', () => {
    test('It should render a `<textarea>`.', () => {
        expect(wrapper.is('textarea')).toBe(true);
    });

    test('It should emit an `input` event.', () => {
        helpers.setValue('Some text');

        expect(wrapper.emitted().input[0][0]).toBe('Some text');
    });
});
