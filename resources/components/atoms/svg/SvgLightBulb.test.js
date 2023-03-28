import { shallowMount } from '../../../../tests/app/vue/utils';

import SvgLightBulb from './SvgLightBulb';

describe('SvgLightBulb', () => {
    test('It should render a `<svg>`.', () => {
        const wrapper = shallowMount(SvgLightBulb);

        expect(wrapper.is('svg')).toBe(true);
    });
});
