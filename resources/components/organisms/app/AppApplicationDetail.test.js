import {
    localVue,
    mount,
} from '../../../../tests/app/vue/utils';

import AppApplicationDetail from './AppApplicationDetail';

function makeWrapper(options) {
    return mount(AppApplicationDetail, {
        ...options,
        localVue,
    });
}

describe('AppApplicationDetail', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();

        expect(wrapper.element.tagName).toBe('DIV');
    });
});
