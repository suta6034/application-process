import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppList from './AppLadder';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppList);
});

describe('AppLadder', () => {
    test('It should render a `<ul>`.', () => {
        expect(wrapper.element.tagName).toBe('UL');
    });
});
