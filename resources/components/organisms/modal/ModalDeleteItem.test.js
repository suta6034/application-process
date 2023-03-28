import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalDeleteItem from './ModalDeleteItem';
import store, {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalDeleteItem, {
        store: storeMocks.store,
        propsData: { mutation: 'foo/bar', itemId: 5 },
    });
});

describe('ModalDeleteItem', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should delete the given item.', () => {
        store.dispatch = jest.fn();
        wrapper.vm.deleteItem();

        expect(store.dispatch).toHaveBeenCalledWith('profile/UPDATE_PROFILE', undefined);
    });

    test('It should hide the modal', () => {
        wrapper.find('[data-qa="cancel button"]').trigger('click');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
