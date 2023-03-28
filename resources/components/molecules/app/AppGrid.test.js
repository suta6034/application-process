import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppGrid from './AppGrid';

describe('AppGrid', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AppGrid);
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
