import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalIncompleteData from './ModalIncompleteData';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import mitt from '../../../utils/mitt';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/mitt', () => ({ emit: jest.fn() }));

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalIncompleteData, {
        store: storeMocks.store,
    });
});

describe('ModalIncompleteData', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide the modal when clicking the complete data button.', () => {
        wrapper.find('[data-qa="complete data button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should emit an event and hide the modal when clicking the discard changes link.', () => {
        wrapper.find('[data-qa="discard changes link"]').trigger('click');

        expect(mitt.emit).toBeCalledWith('reset-form-data');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
