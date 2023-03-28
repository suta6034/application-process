import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppRefreshPrompt from './AppRefreshPrompt';

describe('AppRefreshPrompt', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = mount(AppRefreshPrompt, {
            propsData: { fetch: () => {} },
        });
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should call the fetch function', () => {
        const fetch = jest.fn();
        const wrapper = mount(AppRefreshPrompt, {
            propsData: { fetch },
        });
        wrapper.find('[data-qa="reload"]').trigger('click');
        expect(fetch).toHaveBeenCalled();
    });
});
