import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppApplicationActions from './AppApplicationActions';
import AppDropdown from '../../molecules/app/AppDropdown';

function makeWrapper(options) {
    return mount(AppApplicationActions, {
        ...options,
    });
}

describe('AppApplicationActions', () => {
    test('It should render an `<AppDropdown>` if the application is not rejected.', () => {
        const wrapper = makeWrapper({
            propsData: {
                application: {
                    isRejected: false,
                },
            },
        });
        expect(wrapper.findComponent(AppDropdown).exists()).toBe(true);
    });

    test('It should only show a delete button when the application is rejected.', () => {
        const wrapper = makeWrapper({
            propsData: {
                application: {
                    isRejected: true,
                },
            },
        });
        expect(wrapper.find('[data-qa="delete button"]').exists()).toBe(true);
    });
});
