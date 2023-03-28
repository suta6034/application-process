import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppSelectableItem from './AppSelectableItem';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppSelectableItem);
});

describe('AppSelectableItem', () => {
    test('It should render a `<li>`.', () => {
        expect(wrapper.element.tagName).toBe('LI');
    });
});
