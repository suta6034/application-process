import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppPillGroup from './AppPillGroup';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppPillGroup, {
        slots: {
            secondaryAction: '<div></div>',
        },
    });
});

describe('AppPillGroup', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a `secondaryAction` event when clicking the secondary button.', () => {
        wrapper = mount(AppPillGroup, {
            slots: {
                secondaryAction: '<span></span>',
            },
        });
        wrapper.find('[data-qa="secondary action"]').trigger('click');
        expect(wrapper.emitted().secondaryAction).toBeDefined();
    });
});
