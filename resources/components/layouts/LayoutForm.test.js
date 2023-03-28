import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import LayoutForm from './LayoutForm';

jest.mock('../../store');

describe('LayoutForm', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(LayoutForm);

        expect(wrapper.is('div')).toBe(true);
    });
});
