import {
    mount,
} from '../../../../tests/app/vue/utils';

import CardFaqBanner from './CardFaqBanner';

describe('CardFaqBanner', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = mount(CardFaqBanner);
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
