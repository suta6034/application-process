import {
    createLocalVue,
    shallowMount,
} from '@vue/test-utils';

import ProgressBackdrop from './ProgressBackdrop';

const localVue = createLocalVue();
let wrapper;

beforeEach(() => {
    wrapper = shallowMount(ProgressBackdrop, {
        localVue,
    });
});

describe('ProgressBackdrop', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
