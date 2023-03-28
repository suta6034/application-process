import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppCvItem from './AppCvItem';

describe('AppCvItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppCvItem);

        expect(wrapper.is('div')).toBe(true);
    });
});
