import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalUnsavedCvChanges from './ModalUnsavedCvChanges';
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

    wrapper = mount(ModalUnsavedCvChanges, {
        store: storeMocks.store,
    });
});

describe('ModalUnsavedCvChanges', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an event and hide the modal when clicking the save button.', () => {
        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(mitt.emit).toBeCalledWith('save-cv-template');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should emit an event and hide the modal when clicking the discard link.', () => {
        wrapper.find('[data-qa="discard link"]').trigger('click');

        expect(mitt.emit).toBeCalledWith('discard-cv-template');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
