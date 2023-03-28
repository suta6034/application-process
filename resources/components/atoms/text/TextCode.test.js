import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import TextCode from './TextCode';

describe('TextCode', () => {
    test('It should render a `<pre>`.', () => {
        const wrapper = shallowMount(TextCode);

        expect(wrapper.is('pre')).toBe(true);
    });
});
