import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppApplicationItem from './AppApplicationItem';

describe('AppCvItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = mount(AppApplicationItem);

        expect(wrapper.is('div')).toBe(true);
    });
});
