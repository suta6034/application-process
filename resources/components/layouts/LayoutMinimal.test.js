import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import LayoutMinimal from './LayoutMinimal';

jest.mock('../../store');

describe('LayoutMinimal', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(LayoutMinimal);

        expect(wrapper.is('div')).toBe(true);
    });
});
