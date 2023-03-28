import { shallowMount } from '../../../../tests/app/vue/utils';

import SvgBriefcase from './SvgBriefcase';

describe('SvgBriefcase', () => {
    test('It should render a `<svg>`.', () => {
        const wrapper = shallowMount(SvgBriefcase);

        expect(wrapper.is('svg')).toBe(true);
    });
});
