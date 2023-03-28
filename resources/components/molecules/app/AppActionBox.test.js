import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppActionBox from './AppActionBox';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppActionBox);
});

describe('AppActionBox', () => {
    test('It renders a `div` with a form message.', () => {
        expect(wrapper.find('div').classes('c-appActionBox')).toBe(true);
    });
});
