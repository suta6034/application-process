import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormFlag from './FormFlag';

describe('FormFlag', () => {
    test('It should render a `<span>`.', () => {
        const wrapper = shallowMount(FormFlag);

        expect(wrapper.is('span')).toBe(true);
    });
});
