import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalUnsavedChangesKeepEditing from './ModalUnsavedChangesKeepEditing';
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

    wrapper = mount(ModalUnsavedChangesKeepEditing, {
        store: storeMocks.store,
    });
});

describe('ModalUnsavedChangesKeepEditing', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should be available to keep editing the text when clicking the keep editing button.', () => {
        wrapper.find('[data-qa="keep editing button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should discard changes and get previously saved text back when clicking the discard changes link.', () => {
        wrapper.find('[data-qa="discard changes link"]').trigger('click');

        expect(mitt.emit).toBeCalledWith('reset-form-data');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
