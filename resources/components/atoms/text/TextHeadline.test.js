import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import TextHeadline from './TextHeadline';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(TextHeadline, {
        propsData: { level: 1 },
    });
});

describe('TextHeadline', () => {
    test('It should render a `<hN>` tag of the given level.', () => {
        expect(wrapper.is('h1')).toBe(true);
    });

    test('It should be possible to set a `bold` weight modifier class.', async () => {
        wrapper.setProps({ bold: true });

        await wrapper.vm.$nextTick();

        expect(wrapper.classes()).toContain('k-c-headline--bold');
    });
});
