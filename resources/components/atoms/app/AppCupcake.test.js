import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppCupcake from './AppCupcake';

describe('AppCupcake', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppCupcake);

        expect(wrapper.is('div')).toBe(true);
    });
});
