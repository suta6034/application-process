import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import SkeletonBox from './SkeletonBox';

describe('SkeletonBox', () => {
    test('It should render a `<span>`.', () => {
        const wrapper = shallowMount(SkeletonBox);

        expect(wrapper.is('span')).toBe(true);
    });
});
