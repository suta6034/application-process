import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import PageDebug from './PageDebug';

jest.mock('../../store');

describe('PageDebug', () => {
    test('It should render a `<ANONYMOUS-STUB>`.', () => {
        const wrapper = shallowMount(PageDebug, {
            stubs: {
                LayoutDefault: '<div><slot/></div>',
            },
        });

        expect(wrapper.element.tagName).toBe('ANONYMOUS-STUB');
    });
});
