import {
    mount,
} from '../../../../tests/app/vue/utils';

import MinitaskSuccess from './MinitaskSuccess';

let wrapper;

describe('MinitaskSuccess', () => {
    beforeEach(() => {
        wrapper = mount(MinitaskSuccess);
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a hide event when the close button is clicked.', () => {
        wrapper.find('[data-qa="close button"]').trigger('click');
        expect(wrapper.emitted().hide).toBeDefined();
    });
});
