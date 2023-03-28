import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppButtonIconOnlyGroup from './AppButtonIconOnlyGroup';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppButtonIconOnlyGroup);
});

describe('AppButtonIconOnlyGroup', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
