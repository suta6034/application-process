import {
    nextTick,
} from 'vue';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalUnsavedChanges from './ModalUnsavedChanges';
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

    wrapper = mount(ModalUnsavedChanges, {
        store: storeMocks.store,
    });
});

describe('ModalUnsavedChanges', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an event and hide the modal when clicking the save button.', async () => {
        wrapper.find('[data-qa="save button"]').trigger('click');

        await nextTick();
        expect(mitt.emit).toBeCalledWith('save-form-data');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should emit an event and hide the modal when clicking the reset link.', async () => {
        wrapper.find('[data-qa="reset link"]').trigger('click');

        await nextTick();
        expect(mitt.emit).toBeCalledWith('reset-form-data');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
