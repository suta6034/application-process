import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import ProgressDots from './ProgressDots';

describe('ProgressDots', () => {
    test('It should render a `<span>`.', () => {
        const wrapper = shallowMount(ProgressDots);

        expect(wrapper.is('span')).toBe(true);
    });
});
