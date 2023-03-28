import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormLabel from './FormLabel';

describe('FormLabel', () => {
    test('It should render a `<label>`.', () => {
        const wrapper = shallowMount(FormLabel, {
            slots: {
                default: ['foo'],
            },
        });

        expect(wrapper.is('label')).toBe(true);
    });
});
