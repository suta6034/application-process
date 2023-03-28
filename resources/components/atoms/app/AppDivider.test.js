import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppDivider from './AppDivider';

describe('AppDivider', () => {
    test('It should render a `<hr>`.', () => {
        const wrapper = shallowMount(AppDivider);

        expect(wrapper.is('hr')).toBe(true);
    });
});
