import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppCard from './AppCard';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppCard);
});

describe('AppCard', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
