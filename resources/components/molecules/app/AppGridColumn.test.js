import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppGridColumn from './AppGrid';

describe('AppGridColumn', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AppGridColumn);
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
