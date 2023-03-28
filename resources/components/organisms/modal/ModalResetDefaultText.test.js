import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalResetDefaultText from './ModalResetDefaultText';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/mitt', () => ({ emit: jest.fn() }));

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalResetDefaultText, {
        store: storeMocks.store,
    });
});

describe('ModalResetDefaultText', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an event and hide the modal when clicking the cancel reset.', () => {
        wrapper.find('[data-qa="cancel reset"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
