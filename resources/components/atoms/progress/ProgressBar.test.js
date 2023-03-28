import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
    test('It should render a `<progess>`.', () => {
        const wrapper = shallowMount(ProgressBar);

        expect(wrapper.is('progress')).toBe(true);
    });
});
