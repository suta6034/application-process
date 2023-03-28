import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppList from './AppList';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppList);
});

describe('AppList', () => {
    test('It should render a `<ul>`.', () => {
        expect(wrapper.is('ul')).toBe(true);
    });
});
