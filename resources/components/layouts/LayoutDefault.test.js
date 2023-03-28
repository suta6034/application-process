import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import LayoutDefault from './LayoutDefault';

jest.mock('../../store');

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(LayoutDefault);
});

describe('LayoutDefault', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the header.', () => {
        expect(wrapper.contains('[data-qa="main header"]')).toBe(true);
    });

    test('It should render the footer.', () => {
        expect(wrapper.contains('[data-qa="main footer"]')).toBe(true);
    });
});
