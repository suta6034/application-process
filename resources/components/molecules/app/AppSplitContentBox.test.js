import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppSplitContentBox from './AppSplitContentBox';

describe('AppSplitContentBox', () => {
    function wrapperFactory() {
        return shallowMount(AppSplitContentBox);
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });
});
