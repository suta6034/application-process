import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import mitt from '../../../utils/mitt';

import ModalDeleteAttachment from './ModalDeleteAttachment';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/mitt', () => ({ emit: jest.fn() }));

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();

    wrapper = shallowMount(ModalDeleteAttachment, {
        store: storeMocks.store,
        propsData: {
            uuid: 'foo-uuid',
        },
        stubs: {
            LayoutModal: '<div><slot name="actions"/></div>',
            AppButton: '<div @click="$emit(\'click\')"/>',
        },
    });
});

describe('ModalDeleteAttachment', () => {
    test('It should successfully mount.', () => {
        expect(wrapper.element.tagName).toBe('ANONYMOUS-STUB');
    });

    test('It should hide the modal when clicking the delete button.', () => {
        wrapper.vm.deleteAttachment();

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should emit an `delete-attachment` event when clicking the delete button.', () => {
        wrapper.vm.deleteAttachment();

        expect(mitt.emit).toBeCalledWith('delete-attachment', 'foo-uuid');
    });
});
