import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppButtonGroup from './AppButtonGroup';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppButtonGroup);
});

describe('AppButtonGroup', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
