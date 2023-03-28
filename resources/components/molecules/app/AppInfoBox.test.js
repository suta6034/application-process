import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppInfoBox from './AppInfoBox';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppInfoBox);
});

describe('AppInfoBox', () => {
    test('It renders a `div` with a form message.', () => {
        expect(wrapper.find('div').classes('k-c-infoBox')).toBe(true);
    });
});
