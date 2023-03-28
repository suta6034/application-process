import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppMotivationLetterItemItem from './AppMotivationLetterItem';

describe('AppMotivationLetterItemItem', () => {
    test('It should render a `<li>`.', () => {
        const wrapper = mount(AppMotivationLetterItemItem);

        expect(wrapper.is('li')).toBe(true);
    });
});
