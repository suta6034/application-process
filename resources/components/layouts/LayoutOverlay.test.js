import {
    mount,
} from '../../../tests/app/vue/utils';

import LayoutOverlay from './LayoutOverlay';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(LayoutOverlay, {
        store: storeMocks.store,
    });
});

describe('LayoutOverlay', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide the modal when clicking the close button.', () => {
        wrapper.find('[data-qa="close button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
