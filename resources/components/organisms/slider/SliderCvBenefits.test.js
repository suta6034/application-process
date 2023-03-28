import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import SliderCvBenefits from './SliderCvBenefits';

describe('SliderCvBenefits', () => {
    function wrapperFactory() {
        return shallowMount(SliderCvBenefits);
    }

    test('It should render a `<slider-stub>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('HOOPER-STUB');
    });
});
