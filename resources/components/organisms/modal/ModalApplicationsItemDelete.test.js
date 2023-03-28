import flushPromises from 'flush-promises';

import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import * as applicationService from '../../../services/application';

import ModalApplicationsItemDelete from './ModalApplicationsItemDelete';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let confirmedCallback;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    // eslint-disable-next-line no-import-assign
    applicationService.remove = jest.fn();
    confirmedCallback = jest.fn();

    wrapper = mount(ModalApplicationsItemDelete, {
        store: storeMocks.store,
        propsData: {
            applicationId: '1',
            confirmedCallback,
        },
    });
});

describe('ModalApplicationsItemDelete', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide the modal', () => {
        wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should delete the application when clicking the delete button.', async () => {
        wrapper.find('[data-qa="delete button"]').trigger('click');

        expect(applicationService.remove).toBeCalledWith({ id: '1' });
    });

    test('It should call the given confirm callback function after deleting an application.', async () => {
        wrapper.find('[data-qa="delete button"]').trigger('click');
        await flushPromises();

        expect(confirmedCallback).toBeCalled();
    });
});
