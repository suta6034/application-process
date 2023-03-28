import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import SliderArrowControl from './SliderArrowControl';

describe('SliderArrowControl', () => {
    function wrapperFactory() {
        return shallowMount(SliderArrowControl, {
            propsData: {
                next: jest.fn(),
                prev: jest.fn(),
            },
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an update event when sliders prev control gets clicked.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="prev"]').trigger('click');

        expect(wrapper.emitted().update).toBeDefined();
    });

    test('It should emit an update event when sliders next control gets clicked.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="next"]').trigger('click');

        expect(wrapper.emitted().update).toBeDefined();
    });
});
